<?php

use App\Models\User;
use App\Models\VentureShare;
use App\Notifications\DcdAccountSetupNotification;
use App\Notifications\DcdReferralRewardNotification;
use App\Notifications\DcdWalletCreatedNotification;
use App\Notifications\NewDcdRegistrationNotification;
use App\Services\DcdService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

describe('DCD Registration', function () {

    beforeEach(function () {
        // Create geographical data required for user creation
        $country = \App\Models\Country::create([
            'code' => 'kenya',
            'name' => 'Kenya',
            'currency_code' => 'KES',
            'currency_symbol' => 'KSh',
            'county_label' => 'County',
            'subcounty_label' => 'Sub-county',
        ]);
        $county = \App\Models\County::create(['name' => 'Nairobi', 'country_id' => $country->id]);
        $subcounty = \App\Models\Subcounty::create(['name' => 'Westlands', 'county_id' => $county->id]);
        \App\Models\Ward::create(['name' => 'Kilimani', 'subcounty_id' => $subcounty->id]);
    });

    test('dcd registration with valid referral code awards tokens and sends notifications', function () {
        // Create a referrer user
        $referrer = User::factory()->create([
            'role' => 'da',
            'referral_code' => 'VALIDREF123',
            'total_DDS_balance' => 1000,
            'total_DWS_balance' => 1000,
        ]);

        // Create some admins
        User::factory()->create(['role' => 'admin']);
        User::factory()->create(['role' => 'admin']);

        // Ensure we're under the 3000 DCD cap
        User::where('role', 'dcd')->delete();

        Storage::fake('public');
        Notification::fake();

        $dcdService = app(DcdService::class);

        $registrationData = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '12345678',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'businessName' => 'Test Business',
            'businessAddress' => '123 Test Street',
            'businessType' => ['types' => ['kiosk_duka']],
            'operationalDays' => ['Monday', 'Tuesday'],
            'openingTime' => '08:00',
            'closingTime' => '18:00',
            'footTrafficEstimate' => 'High',
            'campaignTypes' => ['music'],
            'musicPreferences' => [],
            'safetyPreferences' => ['cctv'],
            'pin' => '1234',
            'referralCode' => 'VALIDREF123',
        ];

        $dcd = $dcdService->createDcd($registrationData);

        // Assert DCD was created
        expect($dcd)->not->toBeNull();
        expect($dcd->business_name)->toBe('Test Business');

        // Assert user was created with correct data
        $user = $dcd->user;
        expect($user->full_name)->toBe('John Doe');
        expect($user->role)->toBe('dcd');
        expect($user->wallet_pin)->toBe('1234');
        expect((int) $user->total_DDS_balance)->toBe(1000);
        expect((int) $user->total_DWS_balance)->toBe(1000);

        // Assert referrer got tokens
        $referrer->refresh();
        expect((int) $referrer->total_DDS_balance)->toBe(1500);
        expect((int) $referrer->total_DWS_balance)->toBe(1500);

        // Assert venture shares were created
        $signupShares = VentureShare::where('user_id', $user->id)->where('reason', 'DCD Signup Bonus')->first();
        expect($signupShares)->not->toBeNull();
        expect((int) $signupShares->dds_earned)->toBe(1000);
        expect((int) $signupShares->dws_earned)->toBe(1000);

        $referralShares = VentureShare::where('user_id', $referrer->id)->where('reason', 'like', 'DCD Referral: John Doe')->first();
        expect($referralShares)->not->toBeNull();
        expect((int) $referralShares->dds_earned)->toBe(500);
        expect((int) $referralShares->dws_earned)->toBe(500);

        // Assert files were generated
        Storage::disk('public')->assertExists($dcd->qr_code_path);
        Storage::disk('public')->assertExists($dcd->pdf_guide_path);

        // Assert notifications were sent
        Notification::assertSentTo($user, DcdAccountSetupNotification::class);
        Notification::assertSentTo($user, DcdWalletCreatedNotification::class);
        Notification::assertSentTo($referrer, DcdReferralRewardNotification::class);

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::assertSentTo($admin, NewDcdRegistrationNotification::class);
        }
    });

    test('dcd registration with invalid referral code fails validation', function () {
        $dcdService = app(DcdService::class);

        $registrationData = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '12345678',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'businessName' => 'Test Business',
            'businessAddress' => '123 Test Street',
            'businessType' => ['types' => ['kiosk_duka']],
            'operationalDays' => ['Monday', 'Tuesday'],
            'openingTime' => '08:00',
            'closingTime' => '18:00',
            'footTrafficEstimate' => 'High',
            'campaignTypes' => ['games'],
            'musicPreferences' => [],
            'safetyPreferences' => ['cctv'],
            'pin' => '1234',
            'referralCode' => 'INVALIDREF',
        ];

        expect(fn () => $dcdService->createDcd($registrationData))
            ->toThrow(\Illuminate\Validation\ValidationException::class);
    });

    test('dcd registration without referral code assigns admin with least tokens', function () {
        $admin1 = User::factory()->create([
            'role' => 'admin',
            'total_DDS_balance' => 1000,
            'total_DWS_balance' => 2000,
        ]);
        $admin2 = User::factory()->create([
            'role' => 'admin',
            'total_DDS_balance' => 500,
            'total_DWS_balance' => 800,
        ]);

        User::where('role', 'dcd')->delete();

        Storage::fake('public');
        Notification::fake();

        $dcdService = app(DcdService::class);

        $registrationData = [
            'fullName' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+254700000001',
            'nationalId' => '87654321',
            'dob' => '1992-01-01',
            'gender' => 'Female',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'businessName' => 'Another Business',
            'businessAddress' => '456 Test Avenue',
            'businessType' => ['types' => ['mini_supermarket']],
            'operationalDays' => ['Wednesday', 'Thursday'],
            'openingTime' => '09:00',
            'closingTime' => '17:00',
            'footTrafficEstimate' => 'Medium',
            'campaignTypes' => ['events_promotions'],
            'musicPreferences' => [],
            'safetyPreferences' => ['security_guard'],
            'pin' => '5678',
        ];

        $dcd = $dcdService->createDcd($registrationData);

        $admin2->refresh();
        expect((int) $admin2->total_DDS_balance)->toBe(1000);
        expect((int) $admin2->total_DWS_balance)->toBe(1300);

        $admin1->refresh();
        expect((int) $admin1->total_DDS_balance)->toBe(1000);
        expect((int) $admin1->total_DWS_balance)->toBe(2000);

        $referralShares = VentureShare::where('user_id', $admin2->id)->where('reason', 'like', 'DCD Referral: Jane Doe')->first();
        expect($referralShares)->not->toBeNull();
    });

    test('dcd registration over 3000 cap does not award tokens', function () {
        User::factory()->count(3000)->create(['role' => 'dcd']);

        $referrer = User::factory()->create([
            'role' => 'da',
            'referral_code' => 'REFOVERCAP',
            'total_DDS_balance' => 1000,
            'total_DWS_balance' => 1000,
        ]);

        Storage::fake('public');
        Notification::fake();

        $dcdService = app(DcdService::class);

        $registrationData = [
            'fullName' => 'Over Cap User',
            'email' => 'overcap@example.com',
            'phone' => '+254700000002',
            'nationalId' => '99999999',
            'dob' => '1985-01-01',
            'gender' => 'Male',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'businessName' => 'Over Cap Business',
            'businessAddress' => '789 Over Street',
            'businessType' => ['types' => ['general_store']],
            'operationalDays' => ['Friday', 'Saturday'],
            'openingTime' => '10:00',
            'closingTime' => '20:00',
            'footTrafficEstimate' => 'Low',
            'campaignTypes' => ['movies'],
            'musicPreferences' => [],
            'safetyPreferences' => ['alarm_system'],
            'pin' => '9999',
            'referralCode' => 'REFOVERCAP',
        ];

        $dcd = $dcdService->createDcd($registrationData);

        $user = $dcd->user;
        expect((int) $user->total_DDS_balance)->toBe(0);
        expect((int) $user->total_DWS_balance)->toBe(0);

        $referrer->refresh();
        expect((int) $referrer->total_DDS_balance)->toBe(1000);
        expect((int) $referrer->total_DWS_balance)->toBe(1000);

        $signupShares = VentureShare::where('user_id', $user->id)->where('reason', 'DCD Signup Bonus')->count();
        expect($signupShares)->toBe(0);

        $referralShares = VentureShare::where('user_id', $referrer->id)->where('reason', 'like', 'DCD Referral: Over Cap User')->count();
        expect($referralShares)->toBe(0);
    });

    test('dcd registration sends correct notifications with proper data', function () {
        $referrer = User::factory()->create([
            'role' => 'da',
            'referral_code' => 'NOTIFYTEST',
            'total_DDS_balance' => 500,
            'total_DWS_balance' => 600,
        ]);

        User::factory()->create(['role' => 'admin']);
        User::factory()->create(['role' => 'admin']);

        User::where('role', 'dcd')->delete();

        Storage::fake('public');
        Notification::fake();

        $dcdService = app(DcdService::class);

        $registrationData = [
            'fullName' => 'Notify Test User',
            'email' => 'notify@example.com',
            'phone' => '+254700000003',
            'nationalId' => '11111111',
            'dob' => '1988-01-01',
            'gender' => 'Female',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'businessName' => 'Notify Business',
            'businessAddress' => '111 Notify Street',
            'businessType' => ['types' => ['cafe']],
            'operationalDays' => ['Monday', 'Wednesday', 'Friday'],
            'openingTime' => '07:00',
            'closingTime' => '19:00',
            'footTrafficEstimate' => 'Very High',
            'campaignTypes' => ['surveys'],
            'musicPreferences' => [],
            'safetyPreferences' => ['fire_extinguisher'],
            'pin' => '1111',
            'referralCode' => 'NOTIFYTEST',
        ];

        $dcd = $dcdService->createDcd($registrationData);
        $user = $dcd->user;

        Notification::assertSentTo($user, DcdAccountSetupNotification::class);
        Notification::assertSentTo($user, DcdWalletCreatedNotification::class);
        Notification::assertSentTo($referrer, DcdReferralRewardNotification::class);

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::assertSentTo($admin, NewDcdRegistrationNotification::class);
        }
    });
});
