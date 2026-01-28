<?php

use App\Models\Country;
use App\Models\County;
use App\Models\Subcounty;
use App\Models\Ward;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Client Registration', function () {

    beforeEach(function () {
        // Create geographical data required for user creation
        $country = Country::create([
            'code' => 'kenya',
            'name' => 'Kenya',
            'currency_code' => 'KES',
            'currency_symbol' => 'KSh',
            'county_label' => 'County',
            'subcounty_label' => 'Sub-county',
        ]);
        $county = County::create(['name' => 'Nairobi', 'country_id' => $country->id]);
        $subcounty = Subcounty::create(['name' => 'Westlands', 'county_id' => $county->id]);
        Ward::create(['name' => 'Kilimani', 'subcounty_id' => $subcounty->id]);
    });

    test('client registration requires accountType', function () {
        $data = [
            'companyName' => 'Test Company',
            'contactPerson' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254712345678',
            'businessAddress' => '123 Test Street',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            // Missing accountType
            'campaignObjective' => 'music_promotion',
            'campaignName' => 'Test Campaign',
            'campaignDescription' => str_repeat('This is a test campaign description that meets the minimum length requirement of 50 characters.', 2),
            'startDate' => now()->addDay()->format('Y-m-d'),
            'endDate' => now()->addDays(7)->format('Y-m-d'),
            'targetAudience' => str_repeat('This is a test target audience description that meets the minimum length requirement of 50 characters.', 2),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 100.00,
        ];

        $response = $this->post(route('client.store'), $data);

        $response->assertSessionHasErrors(['accountType']);
    });

    test('client registration requires startDate, endDate, and targetAudience', function () {
        $data = [
            'companyName' => 'Test Company',
            'contactPerson' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254712345678',
            'businessAddress' => '123 Test Street',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'accountType' => 'Startup',
            'campaignObjective' => 'music_promotion',
            'campaignName' => 'Test Campaign',
            'campaignDescription' => str_repeat('This is a test campaign description that meets the minimum length requirement of 50 characters.', 2),
            // Missing startDate, endDate, targetAudience
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 100.00,
        ];

        $response = $this->post(route('client.store'), $data);

        $response->assertSessionHasErrors(['startDate', 'endDate', 'targetAudience']);
    });

    test('client registration passes with all required fields', function () {
        $data = [
            'companyName' => 'Test Company',
            'contactPerson' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254712345678',
            'businessAddress' => '123 Test Street',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'accountType' => 'Startup',
            'campaignObjective' => 'music_promotion',
            'campaignName' => 'Test Campaign',
            'campaignDescription' => str_repeat('This is a test campaign description that meets the minimum length requirement of 50 characters.', 2),
            'startDate' => now()->addDay()->format('Y-m-d'),
            'endDate' => now()->addDays(7)->format('Y-m-d'),
            'targetAudience' => str_repeat('This is a test target audience description that meets the minimum length requirement of 50 characters.', 2),
            'selectedSafetyPreferences' => ['Kids Appropriate'],
            'selectedBusinessTypes' => ['kiosk_duka'],
            'totalBudget' => 100.00,
        ];

        $response = $this->post(route('client.store'), $data);

        // Should not have validation errors for the fields we fixed
        $response->assertSessionDoesntHaveErrors(['accountType', 'startDate', 'endDate', 'targetAudience']);
    });
});
