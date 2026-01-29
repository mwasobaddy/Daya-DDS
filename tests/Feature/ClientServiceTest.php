<?php

use App\Models\Client;
use App\Models\Country;
use App\Models\County;
use App\Models\Subcounty;
use App\Models\Ward;
use App\Services\ClientService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

describe('ClientService', function () {
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

        Notification::fake();
    });

    test('creates new client successfully', function () {
        $data = [
            'companyName' => 'Test Company',
            'contactPerson' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254712345678',
            'country' => $this->country->id,
            'county' => $this->county->id,
            'subcounty' => $this->subcounty->id,
            'ward' => $this->ward->id,
            'accountType' => 'Business',
            'campaignObjective' => 'education_learning',
            'campaignName' => 'Test Campaign',
            'campaignDescription' => str_repeat('Description', 10),
            'targetAudience' => str_repeat('Audience', 10),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 1000,
            'targetCountry' => $this->country->id,
            'targetCounty' => $this->county->id,
            'targetSubcounty' => $this->subcounty->id,
            'targetWard' => $this->ward->id,
        ];

        $service = new ClientService();
        $client = $service->createClient($data);

        expect($client)->toBeInstanceOf(Client::class);
        expect($client->business_name)->toBe('Test Company');
        expect($client->email)->toBe('john@example.com');

        // Check campaign was created
        expect($client->campaigns)->toHaveCount(1);
        $campaign = $client->campaigns->first();
        expect($campaign->name)->toBe('Test Campaign');
        expect($campaign->campaign_objectives)->toBe('education_learning');
        expect($campaign->cost_per_scan)->toBe('10'); // education_learning = 10 credits
        expect($campaign->credits_allocated)->toBe(1000); // KES currency
        expect($campaign->scan_allocated)->toBe(100); // 1000 / 10
    });

    test('calculates credits correctly for NGN currency', function () {
        $ngnCountry = Country::create([
            'code' => 'nigeria',
            'name' => 'Nigeria',
            'currency_code' => 'NGN',
            'currency_symbol' => '₦',
            'county_label' => 'State',
            'subcounty_label' => 'LGA',
        ]);

        $data = [
            'companyName' => 'Test Company',
            'contactPerson' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+234812345678',
            'country' => $ngnCountry->id,
            'county' => $this->county->id,
            'subcounty' => $this->subcounty->id,
            'ward' => $this->ward->id,
            'accountType' => 'Business',
            'campaignObjective' => 'music', // 1 credit per scan
            'campaignName' => 'Test Campaign',
            'campaignDescription' => str_repeat('Description', 10),
            'targetAudience' => str_repeat('Audience', 10),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 1000, // NGN
            'targetCountry' => $ngnCountry->id,
        ];

        $service = new ClientService();
        $client = $service->createClient($data);

        $campaign = $client->campaigns->first();
        expect($campaign->cost_per_scan)->toBe('1');
        expect($campaign->credits_allocated)->toBe(100); // 1000 / 10 for NGN
        expect($campaign->scan_allocated)->toBe(100); // 100 / 1
    });

    test('handles existing client with same email and phone', function () {
        // Create existing client
        $existingClient = Client::create([
            'business_name' => 'Existing Company',
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+254712345679',
            'country_id' => $this->country->id,
            'county_id' => $this->county->id,
            'subcounty_id' => $this->subcounty->id,
            'ward_id' => $this->ward->id,
        ]);

        $data = [
            'companyName' => 'New Company', // Different company name
            'contactPerson' => 'Jane Doe',
            'email' => 'jane@example.com', // Same email
            'phone' => '+254712345679', // Same phone
            'country' => $this->country->id,
            'county' => $this->county->id,
            'subcounty' => $this->subcounty->id,
            'ward' => $this->ward->id,
            'accountType' => 'Business',
            'campaignObjective' => 'education_learning',
            'campaignName' => 'New Campaign',
            'campaignDescription' => str_repeat('Description', 10),
            'targetAudience' => str_repeat('Audience', 10),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 1000,
            'targetCountry' => $this->country->id,
        ];

        $service = new ClientService();
        $client = $service->createClient($data);

        // Should return the existing client
        expect($client->id)->toBe($existingClient->id);
        expect($client->business_name)->toBe('Existing Company'); // Original name preserved

        // Should have created a new campaign for the existing client
        expect($client->campaigns)->toHaveCount(1);
        $campaign = $client->campaigns->first();
        expect($campaign->name)->toBe('New Campaign');
    });

    test('throws exception for existing client with different phone', function () {
        // Create existing client
        Client::create([
            'business_name' => 'Existing Company',
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+254712345679',
            'country_id' => $this->country->id,
            'county_id' => $this->county->id,
            'subcounty_id' => $this->subcounty->id,
            'ward_id' => $this->ward->id,
        ]);

        $data = [
            'companyName' => 'New Company',
            'contactPerson' => 'Jane Doe',
            'email' => 'jane@example.com', // Same email
            'phone' => '+254712345680', // Different phone
            'country' => $this->country->id,
            'county' => $this->county->id,
            'subcounty' => $this->subcounty->id,
            'ward' => $this->ward->id,
            'accountType' => 'Business',
            'campaignObjective' => 'education_learning',
            'campaignName' => 'New Campaign',
            'campaignDescription' => str_repeat('Description', 10),
            'targetAudience' => str_repeat('Audience', 10),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 1000,
            'targetCountry' => $this->country->id,
        ];

        $service = new ClientService();

        expect(fn() => $service->createClient($data))
            ->toThrow(Exception::class, 'A client with this email already exists with a different phone number. Please use the phone number associated with this email or use a different email.');
    });

    test('handles custom business type', function () {
        $data = [
            'companyName' => 'Test Company',
            'contactPerson' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254712345678',
            'country' => $this->country->id,
            'county' => $this->county->id,
            'subcounty' => $this->subcounty->id,
            'ward' => $this->ward->id,
            'accountType' => 'Business',
            'campaignObjective' => 'education_learning',
            'campaignName' => 'Test Campaign',
            'campaignDescription' => str_repeat('Description', 10),
            'targetAudience' => str_repeat('Audience', 10),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['other'],
            'otherBusinessType' => 'Custom Business',
            'totalBudget' => 1000,
            'targetCountry' => $this->country->id,
        ];

        $service = new ClientService();
        $client = $service->createClient($data);

        $campaign = $client->campaigns->first();
        expect($campaign->business_target)->toBe([
            'custom' => 'Custom Business',
            'types' => ['other']
        ]);
    });

    test('notifies admins when client is created', function () {
        // Create admin user
        $admin = \App\Models\User::factory()->create(['role' => 'admin']);

        $data = [
            'companyName' => 'Test Company',
            'contactPerson' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254712345678',
            'country' => $this->country->id,
            'county' => $this->county->id,
            'subcounty' => $this->subcounty->id,
            'ward' => $this->ward->id,
            'accountType' => 'Business',
            'campaignObjective' => 'education_learning',
            'campaignName' => 'Test Campaign',
            'campaignDescription' => str_repeat('Description', 10),
            'targetAudience' => str_repeat('Audience', 10),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 1000,
            'targetCountry' => $this->country->id,
        ];

        $service = new ClientService();
        $client = $service->createClient($data);

        Notification::assertSentTo(
            $admin,
            \App\Notifications\AdminCampaignNotification::class,
            function ($notification) use ($client) {
                return $notification->client->id === $client->id;
            }
        );
    });
});