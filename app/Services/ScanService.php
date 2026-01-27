<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Earning;
use App\Models\Scan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ScanService
{
    /**
     * Process a QR code scan
     */
    public function processScan(int $dcdUserId, string $deviceIdentifier, ?array $geo = null): array
    {
        $dcd = User::where('id', $dcdUserId)->where('role', 'dcd')->first();

        if (! $dcd) {
            return [
                'success' => false,
                'message' => 'Invalid DCD',
                'redirect_url' => null,
            ];
        }

        // Get active campaigns for this DCD where device fingerprint doesn't exist
        $availableCampaigns = Campaign::where('dcd_id', $dcd->dcd->id)
            ->where('status', 'active')
            ->whereDoesntHave('scans', function ($query) use ($deviceIdentifier) {
                $query->where('device_identifier', $deviceIdentifier);
            })
            ->get();

        if ($availableCampaigns->isEmpty()) {
            // No available campaigns, but check if there are any active campaigns at all
            $anyActiveCampaigns = Campaign::where('dcd_id', $dcd->dcd->id)
                ->where('status', 'active')
                ->get();

            if ($anyActiveCampaigns->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'No active campaigns available',
                    'redirect_url' => route('campaigns.index'), // Redirect to campaign page
                ];
            }

            // All campaigns have been scanned by this device, record scan but no award
            $randomCampaign = $anyActiveCampaigns->random();
            $this->recordScan($randomCampaign, $deviceIdentifier, $geo, false);

            return [
                'success' => true,
                'message' => 'Scan recorded, but no award (already scanned all campaigns)',
                'redirect_url' => $randomCampaign->digital_product_link,
            ];
        }

        // Find campaign with highest budget
        $maxBudget = $availableCampaigns->max('budget');
        $highestBudgetCampaigns = $availableCampaigns->filter(function ($campaign) use ($maxBudget) {
            return $campaign->budget == $maxBudget;
        });

        // Randomly pick one if there are multiple with same budget
        $selectedCampaign = $highestBudgetCampaigns->random();

        // Record scan and award
        $this->recordScan($selectedCampaign, $deviceIdentifier, $geo, true);

        return [
            'success' => true,
            'message' => 'Scan processed successfully',
            'redirect_url' => $selectedCampaign->digital_product_link,
        ];
    }

    /**
     * Record a scan and potentially create earning
     */
    private function recordScan(Campaign $campaign, string $deviceIdentifier, ?array $geo, bool $award): void
    {
        DB::transaction(function () use ($campaign, $deviceIdentifier, $geo, $award) {
            // Record the scan
            $scan = Scan::create([
                'dcd_id' => $campaign->dcd_id,
                'campaign_id' => $campaign->id,
                'device_identifier' => $deviceIdentifier,
                'geo' => $geo,
                'scanned_at' => now(),
            ]);

            if ($award) {
                // Create earning record
                Earning::create([
                    'user_id' => $campaign->dcd->user_id,
                    'campaign_id' => $campaign->id,
                    'scan_id' => $scan->id,
                    'credits_earned' => 1, // Assuming 1 credit per scan
                    'description' => 'QR Code scan for campaign: '.$campaign->campaign_name,
                    'status' => 'running',
                ]);

                // Update campaign credits
                $campaign->increment('credits_used');
                $campaign->decrement('credits_balance');
            }
        });
    }
}
