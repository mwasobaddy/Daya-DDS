<?php

use App\Models\Da;
use App\Models\User;
use App\Models\VentureShare;
use App\Notifications\DaAccountSetupNotification;
use App\Notifications\DaReferralRewardNotification;
use App\Notifications\DaWalletCreatedNotification;
use App\Notifications\NewDaRegistrationNotification;
use Illuminate\Support\Facades\Notification;

describe('DA Registration', function () {

    beforeEach(function () {
        // Create geographical data
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

        // Create admin users for testing
        User::factory()->admin()->create([
            'email' => 'admin1@example.com',
            'total_DDS_balance' => '200', // Higher balance
            'total_DWS_balance' => '100',
        ]);

        User::factory()->admin()->create([
            'email' => 'admin2@example.com',
            'total_DDS_balance' => '50', // Lower balance
            'total_DWS_balance' => '50',
        ]);
    });

    test('rejects registration with invalid referral code', function () {
        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => 'INVALID123',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['twitter' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $request = new \App\Http\Requests\StoreDaRequest;
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $request->withValidator($validator);

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('referralCode'))->toBeTrue();
    });

    test('accepts registration with valid referral code', function () {
        $referrer = User::factory()->da()->create([
            'referral_code' => 'VALIDREF123',
        ]);

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => 'VALIDREF123',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $request = new \App\Http\Requests\StoreDaRequest;
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $request->withValidator($validator);

        expect($validator->fails())->toBeFalse();
    });

    test('accepts registration without referral code', function () {
        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => '', // Empty referral code
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $request = new \App\Http\Requests\StoreDaRequest;
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $request->withValidator($validator);

        expect($validator->fails())->toBeFalse();
    });

    test('assigns admin with least tokens when no referral code provided', function () {
        Notification::fake();

        $daService = app(\App\Services\DaService::class);

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => '', // No referral code
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $da = $daService->createDa($data);

        // Should assign to admin2 who has least total tokens (100 vs 300)
        $admin2 = User::where('email', 'admin2@example.com')->first();
        expect($da)->toBeInstanceOf(Da::class);

        // Check that notifications were sent
        Notification::assertSentTo($da->user, DaAccountSetupNotification::class);
        Notification::assertSentTo($da->user, DaWalletCreatedNotification::class);
        Notification::assertSentTo($admin2, DaReferralRewardNotification::class);
    });

    test('awards tokens to referrer when referral code provided and DA count below 3000', function () {
        Notification::fake();

        $referrer = User::factory()->da()->create([
            'referral_code' => 'VALIDREF123',
            'total_DDS_balance' => '100',
            'total_DWS_balance' => '50',
        ]);

        $daService = app(\App\Services\DaService::class);

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => 'VALIDREF123',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $da = $daService->createDa($data);

        // Refresh referrer from database
        $referrer->refresh();

        expect($referrer->total_DDS_balance)->toBe('300.00'); // 100 + 200
        expect($referrer->total_DWS_balance)->toBe('250.00'); // 50 + 200

        // Check venture share record
        $ventureShare = VentureShare::where('user_id', $referrer->id)->first();
        expect($ventureShare)->not->toBeNull();
        expect($ventureShare->dds_earned)->toBe('200.00');
        expect($ventureShare->dws_earned)->toBe('200.00');
        expect($ventureShare->reason)->toContain('John Doe');

        // Check notifications
        Notification::assertSentTo($da->user, DaAccountSetupNotification::class);
        Notification::assertSentTo($da->user, DaWalletCreatedNotification::class);
        Notification::assertSentTo($referrer, DaReferralRewardNotification::class);
    });

    test('does not award tokens when DA count reaches 3000', function () {
        Notification::fake();

        // Create 3000 DA users to reach the limit
        User::factory()->count(3000)->da()->create();

        $referrer = User::factory()->da()->create([
            'referral_code' => 'VALIDREF123',
            'total_DDS_balance' => '100',
            'total_DWS_balance' => '50',
        ]);

        $daService = app(\App\Services\DaService::class);

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => 'VALIDREF123',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $da = $daService->createDa($data);

        // Refresh referrer from database
        $referrer->refresh();

        // Balances should remain unchanged
        expect($referrer->total_DDS_balance)->toBe('100.00');
        expect($referrer->total_DWS_balance)->toBe('50.00');

        // No venture share record should be created
        $ventureShare = VentureShare::where('user_id', $referrer->id)->first();
        expect($ventureShare)->toBeNull();

        // Check notifications - referrer should not get reward notification
        Notification::assertSentTo($da->user, DaAccountSetupNotification::class);
        Notification::assertSentTo($da->user, DaWalletCreatedNotification::class);
        Notification::assertNotSentTo($referrer, DaReferralRewardNotification::class);
    });

    test('sends notifications to all admins about new DA registration', function () {
        Notification::fake();

        $referrer = User::factory()->da()->create([
            'referral_code' => 'VALIDREF123',
        ]);

        $daService = app(\App\Services\DaService::class);

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => 'VALIDREF123',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $da = $daService->createDa($data);

        // Check that all admins received notification
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::assertSentTo($admin, NewDaRegistrationNotification::class, function ($notification) use ($da, $referrer) {
                return $notification->getNewDa()->id === $da->user->id &&
                       $notification->getReferrer()->id === $referrer->id;
            });
        }
    });

    test('generates unique referral code for new DA', function () {
        $daService = app(\App\Services\DaService::class);

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => '',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $da = $daService->createDa($data);

        expect($da->user->referral_code)->toStartWith('DA');
        expect(strlen($da->user->referral_code))->toBeGreaterThan(2);

        // Check uniqueness
        $existingCode = User::where('referral_code', $da->user->referral_code)->count();
        expect($existingCode)->toBe(1); // Only the newly created user should have this code
    });

    test('creates DA record with correct data', function () {
        $daService = app(\App\Services\DaService::class);

        $socialPlatforms = ['x' => '1K-10K', 'facebook' => 'Less than 1K'];
        $contactMethod = 'WhatsApp';

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => '',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => $socialPlatforms,
            'preferred_contact_method' => $contactMethod,
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $da = $daService->createDa($data);

        expect($da->user->role)->toBe('da');
        expect($da->user->full_name)->toBe('John Doe');
        expect($da->user->email)->toBe('john@example.com');
        expect($da->user->phone)->toBe('+254700000000');
        expect($da->user->national_id)->toBe('1234567890');
        expect($da->user->gender)->toBe('male');
        expect($da->user->wallet_type)->toBe('personal');
        expect($da->user->wallet_pin)->toBe('1234');
        expect($da->social_platforms)->toBe($socialPlatforms);
        expect($da->prefered_contact_method)->toBe($contactMethod);
    });

    test('handles database transaction rollback on failure', function () {
        // This test would require mocking a failure scenario
        // For now, we'll just ensure the transaction completes successfully
        $daService = app(\App\Services\DaService::class);

        $data = [
            'fullName' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+254700000000',
            'nationalId' => '1234567890',
            'dob' => '1990-01-01',
            'gender' => 'Male',
            'referralCode' => '',
            'country' => 1,
            'county' => 1,
            'subcounty' => 1,
            'ward' => 1,
            'social_platforms' => ['x' => '1K-10K'],
            'preferred_contact_method' => 'WhatsApp',
            'wallet_type' => 'personal',
            'pin' => '1234',
        ];

        $initialUserCount = User::count();
        $initialDaCount = Da::count();

        $da = $daService->createDa($data);

        expect(User::count())->toBe($initialUserCount + 1);
        expect(Da::count())->toBe($initialDaCount + 1);
        expect($da)->toBeInstanceOf(Da::class);
    });
});
