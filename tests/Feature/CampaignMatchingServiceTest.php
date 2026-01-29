<?php

use App\Models\Campaign;
use App\Models\Client;
use App\Models\Dcd;
use App\Models\User;
use App\Services\CampaignMatchingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('CampaignMatchingService', function () {
    beforeEach(function () {
        // Create test users
        $this->dcdUser = User::factory()->create(['role' => 'dcd']);
        $this->client = Client::factory()->create();
    });

    test('finds matching DCD by location', function () {
        // Create DCD user with specific location
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => 1,
            'county_id' => 1,
            'subcounty_id' => 1,
            'ward_id' => 1,
        ]);
        
        // Create DCD with specific business type
        $dcd = Dcd::factory()->create([
            'user_id' => $dcdUser->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka', 'cafe']
            ],
            'campaign_types' => ['surveys', 'events_promotions'],
            'safety_preferences' => ['Kids Appropriate', 'Teen Appropriate (13+)'],
            'operating_days' => ['Monday', 'Tuesday', 'Wednesday']
        ]);

        // Create campaign targeting same location
        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 1,
            'county_target' => 1,
            'subcounty_target' => 1,
            'ward_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        expect($result)->not->toBeNull();
        expect($result->id)->toBe($dcd->id);
    });

    test('returns null when no DCDs in location', function () {
        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 999, // Non-existent location
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        expect($result)->toBeNull();
    });

    test('filters by campaign limit', function () {
        // Create DCD user with location
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => 1,
        ]);
        
        // Create DCD with 3 active campaigns (at limit)
        $dcd = Dcd::factory()->create([
            'user_id' => $dcdUser->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_types' => ['surveys'],
            'safety_preferences' => ['Kids Appropriate'],
            'operating_days' => ['Monday']
        ]);

        // Create 3 active campaigns for this DCD
        Campaign::factory()->count(3)->create([
            'dcd_id' => $dcd->id,
            'status' => 'approved'
        ]);

        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        expect($result)->toBeNull();
    });

    test('filters by business types', function () {
        // Create DCD user with location
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => 1,
        ]);
        
        // Create DCD with different business types
        $dcd = Dcd::factory()->create([
            'user_id' => $dcdUser->id,
            'business_type' => [
                'custom' => '',
                'types' => ['cafe', 'restaurant'] // No kiosk_duka
            ],
            'campaign_types' => ['surveys'],
            'safety_preferences' => ['Kids Appropriate'],
            'operating_days' => ['Monday']
        ]);

        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka'] // Different from DCD
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        expect($result)->toBeNull();
    });

    test('filters by content types', function () {
        // Create DCD user with location
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => 1,
        ]);
        
        $dcd = Dcd::factory()->create([
            'user_id' => $dcdUser->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_types' => ['events_promotions', 'games'], // No surveys
            'safety_preferences' => ['Kids Appropriate'],
            'operating_days' => ['Monday']
        ]);

        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys', // Not in DCD's campaign_types
            'safety_preferences' => ['Kids Appropriate']
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        expect($result)->toBeNull();
    });

    test('filters by safety preferences', function () {
        // Create DCD user with location
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => 1,
        ]);
        
        $dcd = Dcd::factory()->create([
            'user_id' => $dcdUser->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_types' => ['surveys'],
            'safety_preferences' => ['Adult Content (18+)'], // Different from campaign
            'operating_days' => ['Monday']
        ]);

        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate'] // Not matching DCD
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        expect($result)->toBeNull();
    });

    test('selects DCD with most operating days when multiple match', function () {
        // Create two DCDs
        // Create DCD user with location
        $dcdUser1 = User::factory()->create([
            'role' => 'dcd',
            'country_id' => 1,
        ]);
        
        $dcd1 = Dcd::factory()->create([
            'user_id' => $dcdUser1->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_types' => ['surveys'],
            'safety_preferences' => ['Kids Appropriate'],
            'operating_days' => ['Monday', 'Tuesday'] // 2 days
        ]);

        // Create another DCD user with location
        $dcdUser2 = User::factory()->create([
            'role' => 'dcd',
            'country_id' => 1,
        ]);
        
        $dcd2 = Dcd::factory()->create([
            'user_id' => $dcdUser2->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_types' => ['surveys'],
            'safety_preferences' => ['Kids Appropriate'],
            'operating_days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] // 5 days
        ]);

        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        // Should select DCD with more operating days
        expect($result->id)->toBe($dcd2->id);
    });

    test('randomly selects when multiple have same operating days', function () {
        // Create multiple DCD users with same location
        $dcdUsers = User::factory()->count(3)->create([
            'role' => 'dcd',
            'country_id' => 1,
        ]);
        
        // Create multiple DCDs with same criteria
        $dcds = $dcdUsers->map(function ($user) {
            return Dcd::factory()->create([
                'user_id' => $user->id,
                'business_type' => [
                    'custom' => '',
                    'types' => ['kiosk_duka']
                ],
                'campaign_types' => ['surveys'],
                'safety_preferences' => ['Kids Appropriate'],
                'operating_days' => ['Monday', 'Tuesday', 'Wednesday']
            ]);
        });

        $campaign = Campaign::factory()->create([
            'client_id' => $this->client->id,
            'country_target' => 1,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        $service = new CampaignMatchingService();
        $result = $service->findMatchingDcd($campaign);

        // Should return one of the DCDs
        expect($result)->not->toBeNull();
        expect($dcds->pluck('id'))->toContain($result->id);
    });
});