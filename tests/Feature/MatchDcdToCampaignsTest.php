<?php

use App\Console\Commands\MatchDcdToCampaigns;
use App\Models\Campaign;
use App\Models\Client;
use App\Models\Country;
use App\Models\County;
use App\Models\Dcd;
use App\Models\Subcounty;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('MatchDcdToCampaigns Command', function () {
    beforeEach(function () {
        // Create geographical data
        $this->country = Country::create([
            'code' => 'kenya',
            'name' => 'Kenya',
            'currency_code' => 'KES',
            'currency_symbol' => 'KSh',
            'county_label' => 'County',
            'subcounty_label' => 'Sub-county',
        ]);
        $this->county = County::create(['name' => 'Nairobi', 'country_id' => $this->country->id]);
        $this->subcounty = Subcounty::create(['name' => 'Westlands', 'county_id' => $this->county->id]);
        $this->ward = Ward::create(['name' => 'Kilimani', 'subcounty_id' => $this->subcounty->id]);
    });

    test('matches approved campaigns to available DCDs', function () {
        // Create client and approved campaign
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'approved',
            'dcd_id' => null,
            'country_target' => $this->country->id,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        // Create matching DCD
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => $this->country->id,
        ]);
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

        // Run the command
        $this->artisan(MatchDcdToCampaigns::class)
            ->expectsOutput('Found 1 campaigns to match')
            ->expectsOutput('Matched campaign 1 to DCD 1')
            ->expectsOutput('Matching process completed')
            ->assertExitCode(0);

        // Check campaign was matched
        $campaign->refresh();
        expect($campaign->dcd_id)->toBe($dcd->id);
    });

    test('skips campaigns that already have DCD assigned', function () {
        // Create client and approved campaign with DCD already assigned
        $client = Client::factory()->create();
        $dcdUser = User::factory()->create(['role' => 'dcd']);
        $dcd = Dcd::factory()->create(['user_id' => $dcdUser->id]);

        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'approved',
            'dcd_id' => $dcd->id, // Already assigned
        ]);

        // Run the command
        $this->artisan(MatchDcdToCampaigns::class)
            ->expectsOutput('Found 0 campaigns to match') // Should find 0 since dcd_id is not null
            ->expectsOutput('Matching process completed')
            ->assertExitCode(0);
    });

    test('skips pending campaigns', function () {
        // Create client and pending campaign
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending', // Not approved
            'dcd_id' => null,
        ]);

        // Run the command
        $this->artisan(MatchDcdToCampaigns::class)
            ->expectsOutput('Found 0 campaigns to match')
            ->expectsOutput('Matching process completed')
            ->assertExitCode(0);
    });

    test('handles campaigns with no matching DCD', function () {
        // Create client and approved campaign
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'approved',
            'dcd_id' => null,
            'country_target' => 999, // Non-existent location
            'business_target' => [
                'custom' => '',
                'types' => ['nonexistent_type']
            ],
            'campaign_objectives' => 'nonexistent_objective',
            'safety_preferences' => ['Nonexistent Preference']
        ]);

        // Run the command
        $this->artisan(MatchDcdToCampaigns::class)
            ->expectsOutput('Found 1 campaigns to match')
            ->expectsOutput('No matching DCD found for campaign 1')
            ->expectsOutput('Matching process completed')
            ->assertExitCode(0);

        // Check campaign still has no DCD
        $campaign->refresh();
        expect($campaign->dcd_id)->toBeNull();
    });

    test('matches multiple campaigns', function () {
        // Create multiple clients and campaigns
        $clients = Client::factory()->count(3)->create();

        foreach ($clients as $index => $client) {
            Campaign::factory()->create([
                'client_id' => $client->id,
                'status' => 'approved',
                'dcd_id' => null,
                'country_target' => $this->country->id,
                'business_target' => [
                    'custom' => '',
                    'types' => ['kiosk_duka']
                ],
                'campaign_objectives' => 'surveys',
                'safety_preferences' => ['Kids Appropriate']
            ]);
        }

        // Create multiple matching DCDs
        $dcdUsers = User::factory()->count(3)->create([
            'role' => 'dcd',
            'country_id' => $this->country->id,
        ]);
        foreach ($dcdUsers as $dcdUser) {
            Dcd::factory()->create([
                'user_id' => $dcdUser->id,
                'business_type' => [
                    'custom' => '',
                    'types' => ['kiosk_duka']
                ],
                'campaign_types' => ['surveys'],
                'safety_preferences' => ['Kids Appropriate'],
                'operating_days' => ['Monday']
            ]);
        }

        // Run the command
        $this->artisan(MatchDcdToCampaigns::class)
            ->expectsOutput('Found 3 campaigns to match')
            ->expectsOutputToContain('Matched campaign')
            ->expectsOutput('Matching process completed')
            ->assertExitCode(0);

        // Check all campaigns were matched
        $matchedCampaigns = Campaign::whereNotNull('dcd_id')->count();
        expect($matchedCampaigns)->toBe(3);
    });

    test('respects DCD campaign limits', function () {
        // Create client and approved campaign
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'approved',
            'dcd_id' => null,
            'country_target' => $this->country->id,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka']
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate']
        ]);

        // Create DCD with 3 active campaigns (at limit)
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => $this->country->id,
        ]);
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

        // Run the command
        $this->artisan(MatchDcdToCampaigns::class)
            ->expectsOutput('Found 1 campaigns to match')
            ->expectsOutput('No matching DCD found for campaign 1')
            ->expectsOutput('Matching process completed')
            ->assertExitCode(0);

        // Check campaign was not matched
        $campaign->refresh();
        expect($campaign->dcd_id)->toBeNull();
    });
});