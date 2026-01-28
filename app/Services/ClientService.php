<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClientService
{
    public function createClient(array $data): Client
    {
        return DB::transaction(function () use ($data) {
            // Create user first
            $user = User::create([
                'role' => 'client',
                'full_name' => $data['contactPerson'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'country_id' => $data['country'] ?? null,
                'county_id' => $data['county'] ?? null,
                'subcounty_id' => $data['subcounty'] ?? null,
                'ward_id' => $data['ward'] ?? null,
                'referral_code' => $this->generateUniqueReferralCode(),
                'password' => Hash::make('temporary_password'), // TODO: handle proper password
            ]);

            // Create client record
            $client = Client::create([
                'user_id' => $user->id,
                'business_name' => $data['companyName'],
                'full_name' => $data['contactPerson'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'country_id' => $data['country'] ?? null,
                'county_id' => $data['county'] ?? null,
                'subcounty_id' => $data['subcounty'] ?? null,
                'ward_id' => $data['ward'] ?? null,
            ]);

            // Create campaign record
            Campaign::create([
                'client_id' => $client->id,
                'campaign_name' => $data['campaignName'],
                'campaign_type' => $data['accountType'],
                'music_preferences' => ($data['accountType'] === 'Artist' || $data['accountType'] === 'Label') ? $data['selectedMusicGenres'] : null,
                'campaign_objectives' => $data['campaignObjective'],
                'objectives' => $data['campaignDescription'],
                'budget' => $data['totalBudget'],
                'currency' => 'KES',
                'safety_preferences' => $data['selectedSafetyPreferences'],
                'country_target' => $data['targetCountry'] ?? null,
                'county_target' => $data['targetCounty'] ?? null,
                'subcounty_target' => $data['targetSubcounty'] ?? null,
                'ward_target' => $data['targetWard'] ?? null,
                'business_target' => $data['selectedBusinessTypes'],
                'status' => 'pending',
                'credits_allocated' => $data['totalBudget'],
                'credits_balance' => $data['totalBudget'],
                'credits_used' => 0,
                'scan_allocated' => 0,
                'scan_balance' => 0,
                'scan_used' => 0,
            ]);

            return $client;
        });
    }

    /**
     * Generate a unique referral code
     */
    private function generateUniqueReferralCode(): string
    {
        do {
            $code = 'CL'.strtoupper(substr(md5(uniqid()), 0, 8));
        } while (User::where('referral_code', $code)->exists());

        return $code;
    }
}
