<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Dcd;
use App\Models\Earning;
use App\Models\Referral;
use App\Models\Scan;
use App\Models\User;
use DeviceDetector\DeviceDetector;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScanService
{
    /**
     * Process a QR code scan with enhanced logic
     */
    public function processScan(
        int $dcdUserId,
        string $deviceIdentifier,
        ?array $geo = null,
        ?string $userAgent = null,
        ?string $ipAddress = null
    ): array {
        try {
            // 1. Validate DCD user
            $dcd = User::where('id', $dcdUserId)->where('role', 'dcd')->first();
            if (! $dcd) {
                return [
                    'success' => false,
                    'message' => 'Invalid DCD',
                    'redirect_url' => null,
                ];
            }

            // 2. Update campaign statuses based on dates
            $this->updateCampaignStatuses();

            // 3. Validate device fingerprint
            if (! $this->validateDeviceFingerprint($deviceIdentifier, $userAgent, $ipAddress)) {
                Log::warning('Suspicious scan attempt', [
                    'dcd_id' => $dcdUserId,
                    'device_identifier' => $deviceIdentifier,
                    'ip' => $ipAddress,
                    'user_agent' => $userAgent,
                ]);

                return [
                    'success' => false,
                    'message' => 'Device validation failed',
                    'redirect_url' => null,
                ];
            }

            // 4. Select optimal campaign using multi-factor scoring
            $campaign = $this->selectOptimalCampaign($dcd, $deviceIdentifier);
            if (! $campaign) {
                return [
                    'success' => false,
                    'message' => 'No eligible campaigns available',
                    'redirect_url' => route('campaigns.index'),
                ];
            }

            // 5. Process scan and distribute rewards
            return $this->processScanAndRewards($campaign, $dcd, $deviceIdentifier, $geo);

        } catch (\Exception $e) {
            Log::error('Scan processing failed', [
                'dcd_id' => $dcdUserId,
                'device_identifier' => $deviceIdentifier,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Scan processing failed',
                'redirect_url' => null,
            ];
        }
    }

    /**
     * Update campaign statuses based on start/end dates
     */
    public function updateCampaignStatuses(): void
    {
        $now = now();

        // Activate approved campaigns that have reached start date
        Campaign::where('status', 'approved')
            ->where('start_date', '<=', $now)
            ->update(['status' => 'active']);

        // Expire active campaigns that have reached end date
        Campaign::where('status', 'active')
            ->where('end_date', '<=', $now)
            ->update(['status' => 'expired']);

        // Mark completed campaigns (no credits left)
        Campaign::where('status', 'active')
            ->where('credits_balance', '<=', 0)
            ->update(['status' => 'completed']);
    }

    /**
     * Validate device fingerprint using multiple factors
     */
    private function validateDeviceFingerprint(string $deviceIdentifier, ?string $userAgent, ?string $ipAddress): bool
    {
        // Basic validation - ensure device identifier is not empty
        if (empty($deviceIdentifier)) {
            return false;
        }

        // Use Device Detector for user agent analysis
        if ($userAgent) {
            $deviceDetector = new DeviceDetector($userAgent);
            $deviceDetector->parse();

            // Block known bots
            if ($deviceDetector->isBot()) {
                return false;
            }

            // Could add more sophisticated validation here
            // - Check for suspicious user agents
            // - Validate device consistency
            // - Rate limiting per IP/device
        }

        return true;
    }

    /**
     * Select optimal campaign using multi-factor scoring
     */
    private function selectOptimalCampaign(User $dcd, string $deviceIdentifier): ?Campaign
    {
        // Get the DCD record
        $dcdRecord = Dcd::where('user_id', $dcd->id)->first();
        if (! $dcdRecord) {
            return null;
        }

        // Get campaigns that haven't been scanned by this device
        $eligibleCampaigns = Campaign::where('dcd_id', $dcdRecord->id)
            ->where('status', 'active')
            ->whereRaw('credits_balance >= cost_per_scan')
            ->whereDoesntHave('scans', function ($query) use ($deviceIdentifier) {
                $query->where('device_identifier', $deviceIdentifier);
            })
            ->with(['scans' => function ($query) {
                $query->where('created_at', '>=', now()->subDay());
            }])
            ->get();

        if ($eligibleCampaigns->isEmpty()) {
            return null;
        }

        // Calculate scores and select best campaign
        $scoredCampaigns = $eligibleCampaigns->map(function ($campaign) {
            $campaign->selection_score = $this->calculateCampaignScore($campaign);

            return $campaign;
        });

        return $scoredCampaigns->sortByDesc('selection_score')->first();
    }

    /**
     * Calculate campaign selection score based on budget and engagement
     */
    private function calculateCampaignScore(Campaign $campaign): float
    {
        // Engagement rate: scans per day (normalized)
        $recentScans = $campaign->scans->count();
        $engagementScore = min($recentScans / 10, 1); // Cap at 1.0

        // Budget score: higher budget = higher priority (normalized)
        $budgetScore = min($campaign->budget / 1000, 1); // Cap at 1.0

        // Weight: 60% budget, 40% engagement
        return ($budgetScore * 0.6) + ($engagementScore * 0.4);
    }

    /**
     * Process scan and distribute rewards with revenue sharing
     */
    private function processScanAndRewards(Campaign $campaign, User $dcd, string $deviceIdentifier, ?array $geo): array
    {
        return DB::transaction(function () use ($campaign, $dcd, $deviceIdentifier, $geo) {
            // Record the scan
            $scan = Scan::create([
                'dcd_id' => $dcd->id,
                'campaign_id' => $campaign->id,
                'device_identifier' => $deviceIdentifier,
                'geo' => $geo,
                'scanned_at' => now(),
            ]);

            // Get cost per scan and distribute rewards
            $costPerScan = (float) $campaign->cost_per_scan;
            $this->distributeRewards($campaign, $dcd, $scan, $costPerScan);

            // Update campaign metrics
            $campaign->increment('credits_used', $costPerScan);
            $campaign->decrement('credits_balance', $costPerScan);
            $campaign->increment('scan_used');
            $campaign->decrement('scan_balance');

            // Update engagement score (simple increment)
            $campaign->increment('engagement_score');

            return [
                'success' => true,
                'message' => 'Scan processed successfully',
                'redirect_url' => $campaign->digital_product_link,
            ];
        });
    }

    /**
     * Distribute rewards: 60% DCD, 30% referrer, 10% company
     */
    private function distributeRewards(Campaign $campaign, User $dcd, Scan $scan, float $totalCredits): void
    {
        $dcdReward = $totalCredits * 0.6;        // 60% to DCD
        $referrerReward = $totalCredits * 0.3;   // 30% to referrer
        $companyReward = $totalCredits * 0.1;    // 10% to company

        // DCD earning
        Earning::create([
            'user_id' => $dcd->id,
            'campaign_id' => $campaign->id,
            'scan_id' => $scan->id,
            'credits_earned' => $dcdReward,
            'description' => 'DCD scan reward for campaign: '.$campaign->name,
            'status' => 'running',
        ]);

        // Referrer earning (if exists)
        $referrer = $this->findReferrer($dcd);
        if ($referrer) {
            Earning::create([
                'user_id' => $referrer->id,
                'campaign_id' => $campaign->id,
                'scan_id' => $scan->id,
                'credits_earned' => $referrerReward,
                'description' => 'Referral reward for DCD scan: '.$campaign->name,
                'status' => 'running',
            ]);
        } else {
            // If no referrer, company gets the referrer's share
            $companyReward += $referrerReward;
        }

        // Company earning (find company user or use admin)
        $companyUser = User::where('role', 'admin')->first() ?? User::find(999);
        if (! $companyUser) {
            // Create a company user if none exists
            $companyUser = User::factory()->admin()->create(['id' => 999]);
        }

        Earning::create([
            'user_id' => $companyUser->id,
            'campaign_id' => $campaign->id,
            'scan_id' => $scan->id,
            'credits_earned' => $companyReward,
            'description' => 'Company revenue from campaign: '.$campaign->name,
            'status' => 'running',
        ]);
    }

    /**
     * Find the referrer for a DCD user
     */
    private function findReferrer(User $dcd): ?User
    {
        $referral = Referral::where('referred_id', $dcd->id)->first();

        return $referral ? $referral->referrer : null;
    }
}
