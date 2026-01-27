<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            [
                'email' => 'family.obadiahs@gmail.com',
                'full_name' => 'Family Obadiahs',
                'phone' => '+254700000001',
                'national_id' => '1000000001',
                'gender' => 'male',
            ],
            [
                'email' => 'kelvinramsiel01@gmail.com',
                'full_name' => 'Kelvin Ramsiel',
                'phone' => '+254700000002',
                'national_id' => '1000000002',
                'gender' => 'male',
            ],
        ];

        foreach ($admins as $adminData) {
            User::create([
                'role' => 'admin',
                'full_name' => $adminData['full_name'],
                'email' => $adminData['email'],
                'phone' => $adminData['phone'],
                'national_id' => $adminData['national_id'],
                'dob' => '1990-01-01', // Default DOB
                'gender' => $adminData['gender'],
                'country_id' => 1, // Kenya (assuming ID 1 from seeder)
                'county_id' => 1, // Nairobi County (assuming ID 1)
                'subcounty_id' => 1, // Westlands Subcounty (assuming ID 1)
                'ward_id' => 1, // Any ward (assuming ID 1)
                'referral_code' => 'ADM'.strtoupper(substr(md5($adminData['email']), 0, 6)), // Generate unique referral code
                'wallet_type' => 'business',
                'wallet_status' => 'active',
                'wallet_pin' => '1234', // Default PIN for admins
                'wallet_balance' => '0.00',
                'total_DDS_balance' => '0.00',
                'total_DWS_balance' => '0.00',
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // Default password
                'remember_token' => null,
                'two_factor_secret' => null,
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
            ]);
        }

        $this->command->info('Admin users created successfully!');
        $this->command->info('Email: family.obadiahs@gmail.com | Password: password');
        $this->command->info('Email: kelvinramsiel01@gmail.com | Password: password');
    }
}
