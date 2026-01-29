<?php

use App\Models\Campaign;
use App\Models\Dcd;
use App\Models\Earning;
use App\Models\Referral;
use App\Models\Scan;
use App\Models\User;
use App\Services\ScanService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('ScanService', function () {
    beforeEach(function () {
        // Create test data
        $this->user = User::factory()->dcd()->create();
        $this->dcd = Dcd::factory()->create(['user_id' => $this->user->id]);
        $this->scanService = new ScanService;
    });

    test('processes scan successfully with revenue sharing', function () {
        // Create a client first
        $client = \App\Models\Client::factory()->create();

        // Create an approved campaign with DCD assigned
        $campaign = Campaign::factory()->approved()->create([
            'client_id' => $client->id,
            'dcd_id' => $this->dcd->id,
            'budget' => 1000,
            'cost_per_scan' => 10,
            'credits_balance' => 100,
            'scan_balance' => 10,
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(30),
        ]);

        // Create a referrer
        $referrer = User::factory()->create();
        Referral::create([
            'referrer_id' => $referrer->id,
            'referred_id' => $this->user->id,
            'type' => 'da_to_dcd',
        ]);

        $userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
        $ipAddress = '192.168.1.100';

        $result = $this->scanService->processScan($this->user->id, 'device123', null, $userAgent, $ipAddress);

        expect($result['success'])->toBeTrue();
        expect($result['message'])->toBeString();

        // Check that a scan was created
        $scan = Scan::where('dcd_id', $this->user->id)->first();
        expect($scan)->not->toBeNull();
        expect($scan->campaign_id)->toBe($campaign->id);
        expect($scan->device_identifier)->toBe('device123');

        // Check revenue sharing
        $earnings = Earning::where('user_id', $this->user->id)->get();
        expect($earnings)->toHaveCount(1);
        expect($earnings->first()->credits_earned)->toBe('6.0000'); // 60% of 10

        $referrerEarnings = Earning::where('user_id', $referrer->id)->get();
        expect($referrerEarnings)->toHaveCount(1);
        expect($referrerEarnings->first()->credits_earned)->toBe('3.0000'); // 30% of 10

        // Check campaign balance updated
        $updatedCampaign = $campaign->fresh();
        expect($updatedCampaign->credits_balance)->toBe(90);
        expect($updatedCampaign->scan_balance)->toBe(9);
    });

    test('validates device fingerprinting', function () {
        $campaign = Campaign::factory()->approved()->create([
            'dcd_id' => $this->dcd->id,
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(30),
        ]);

        // Test with bot user agent
        $botUserAgent = 'Googlebot/2.1 (+http://www.google.com/bot.html)';
        $ipAddress = '192.168.1.100';

        $result = $this->scanService->processScan($this->user->id, 'device123', null, $botUserAgent, $ipAddress);

        expect($result['success'])->toBeFalse();
        expect($result['message'])->toContain('Device validation failed');
    });

    test('skips expired campaigns', function () {
        $expiredCampaign = Campaign::factory()->approved()->create([
            'dcd_id' => $this->dcd->id,
            'end_date' => now()->subDays(1), // Expired
        ]);

        $userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
        $ipAddress = '192.168.1.100';

        $result = $this->scanService->processScan($this->user->id, 'device123', null, $userAgent, $ipAddress);

        // Should not find the expired campaign
        expect($result['success'])->toBeFalse();
    });

    test('updates campaign statuses correctly', function () {
        // Create campaigns with different date scenarios
        $activeCampaign = Campaign::factory()->approved()->create([
            'dcd_id' => $this->dcd->id,
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(30),
            'status' => 'active',
        ]);

        $pendingCampaign = Campaign::factory()->approved()->create([
            'dcd_id' => $this->dcd->id,
            'start_date' => now()->addDays(1), // Future start
            'end_date' => now()->addDays(30),
            'status' => 'approved',
        ]);

        $expiredCampaign = Campaign::factory()->approved()->create([
            'dcd_id' => $this->dcd->id,
            'start_date' => now()->subDays(10),
            'end_date' => now()->subDays(1), // Expired
            'status' => 'active',
        ]);

        $this->scanService->updateCampaignStatuses();

        expect($activeCampaign->fresh()->status)->toBe('active');
        expect($pendingCampaign->fresh()->status)->toBe('approved'); // Start date is in future
        expect($expiredCampaign->fresh()->status)->toBe('expired'); // Should be expired
    });

    test('selects campaign based on multi-factor scoring', function () {
        // Create campaigns with different budgets and recent scan activity
        $highBudgetLowEngagement = Campaign::factory()->create([
            'dcd_id' => $this->dcd->id,
            'budget' => 1000,
            'status' => 'active',
            'credits_balance' => 100,
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(30),
        ]);

        $lowBudgetHighEngagement = Campaign::factory()->create([
            'dcd_id' => $this->dcd->id,
            'budget' => 100,
            'status' => 'active',
            'credits_balance' => 100,
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(30),
        ]);

        // Add recent scans to the high engagement campaign
        Scan::create([
            'dcd_id' => $this->user->id,
            'campaign_id' => $lowBudgetHighEngagement->id,
            'device_identifier' => 'other_device',
            'scanned_at' => now()->subHours(2),
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2),
        ]);

        $userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
        $ipAddress = '192.168.1.100';

        // The service should select the campaign with the highest score
        // High budget campaign: (1000/1000 * 0.6) + (0 * 0.4) = 0.6
        // Low budget campaign: (100/1000 * 0.6) + (1/10 * 0.4) = 0.06 + 0.04 = 0.1

        $result = $this->scanService->processScan($this->user->id, 'device123', null, $userAgent, $ipAddress);

        expect($result['success'])->toBeTrue();
        $scan = Scan::where('dcd_id', $this->user->id)->where('device_identifier', 'device123')->first();
        expect($scan->campaign_id)->toBe($highBudgetLowEngagement->id);
    });

    test('handles insufficient campaign balance', function () {
        $campaign = Campaign::factory()->approved()->create([
            'dcd_id' => $this->dcd->id,
            'credits_balance' => 5, // Less than cost_per_scan (10)
            'scan_balance' => 0,
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(30),
        ]);

        $userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
        $ipAddress = '192.168.1.100';

        $result = $this->scanService->processScan($this->user->id, 'device123', null, $userAgent, $ipAddress);

        // Should not create scan due to insufficient balance
        expect($result['success'])->toBeFalse();
    });
});
