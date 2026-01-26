<?php

namespace App\Services;

use App\Models\Da;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DaService
{
    public function createDa(array $data): Da
    {
        return DB::transaction(function () use ($data) {
            // Map gender
            $gender = match($data['gender']) {
                'Male' => 'male',
                'Female' => 'female',
                default => 'male', // or handle other
            };

            // Create user first
            $user = User::create([
                'role' => 'da',
                'full_name' => $data['fullName'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'national_id' => $data['nationalId'],
                'dob' => $data['dob'],
                'gender' => $gender,
                'country_id' => null, // TODO: resolve from name
                'county_id' => null,
                'subcounty_id' => null,
                'ward_id' => null,
                'referral_code' => $data['referralCode'],
                'wallet_type' => $data['wallet_type'],
                'wallet_status' => 'pending', // default
                'wallet_pin' => $data['pin'],
                'wallet_balance' => '0', // default
                'total_DDS_balance' => '0',
                'total_DWS_balance' => '0',
                'password' => Hash::make('temporary_password'), // TODO: handle proper password
            ]);

            // Create DA record
            $da = Da::create([
                'user_id' => $user->id,
                'social_platforms' => $data['social_platforms'],
                'prefered_contact_method' => $data['preferred_contact_method'],
            ]);

            return $da;
        });
    }
}
