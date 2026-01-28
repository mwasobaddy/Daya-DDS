<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Client;
use App\Models\Country;
use Illuminate\Support\Facades\DB;

class ClientService
{
    private const CAMPAIGN_OBJECTIVE_CREDITS = [
        'music' => 1,
        'movies' => 1,
        'games' => 1,
        'surveys' => 5,
        'product_promotion' => 5,
        'events' => 5,
        'apartment_listing' => 5,
        'app_downloads' => 10,
        'product_launch' => 10,
        'education_learning' => 10,
        'civic_political' => 10,
    ];

    public function createClient(array $data): Client
    {
        return DB::transaction(function () use ($data) {
            // Check if client already exists by email
            $client = Client::where('email', $data['email'])->first();

            if (!$client) {
                // Create client record if doesn't exist
                $client = Client::create([
                    'business_name' => $data['companyName'],
                    'full_name' => $data['contactPerson'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'country_id' => $data['country'] ?? null,
                    'county_id' => $data['county'] ?? null,
                    'subcounty_id' => $data['subcounty'] ?? null,
                    'ward_id' => $data['ward'] ?? null,
                ]);
            }

            // Get currency from user's country
            $country = Country::find($data['country']);
            $currency = $country ? $country->currency_code : 'KES';

            // Calculate campaign values based on objective and currency
            $costPerScan = self::CAMPAIGN_OBJECTIVE_CREDITS[$data['campaignObjective']] ?? 1;

            // Calculate credits allocated based on currency
            $creditsAllocated = 0;
            if ($currency === 'NGN') {
                // 1 NGN = 10 credits
                $creditsAllocated = $data['totalBudget'] * 10;
            } else {
                // 1 KSH = 1 credit (default for other currencies)
                $creditsAllocated = $data['totalBudget'];
            }

            // Calculate scan allocated
            $scanAllocated = (int) floor($creditsAllocated / $costPerScan);

            // Create campaign record
            Campaign::create([
                'client_id' => $client->id,
                'dcd_id' => null, // TODO: This should be assigned properly
                'name' => $data['campaignName'],
                'type' => $data['accountType'],
                'campaign_objectives' => $data['campaignObjective'],
                'music_preferences' => ($data['accountType'] === 'Artist' || $data['accountType'] === 'Label') ? $data['selectedMusicGenres'] : null,
                'digital_product_link' => $data['digitalProductLink'] ?? '',
                'explainer_video_link' => $data['explainerVideoLink'] ?? '',
                'campaign_description' => $data['campaignDescription'],
                'target_audience' => $data['targetAudience'] ?? '',
                'budget' => $data['totalBudget'],
                'currency' => $currency,
                'safety_preferences' => $data['selectedSafetyPreferences'],
                'country_target' => $data['targetCountry'] ?? null,
                'county_target' => $data['targetCounty'] ?? null,
                'subcounty_target' => $data['targetSubcounty'] ?? null,
                'ward_target' => $data['targetWard'] ?? null,
                'business_target' => $data['selectedBusinessTypes'],
                'status' => 'pending',
                'cost_per_scan' => (string) $costPerScan,
                'credits_allocated' => $creditsAllocated,
                'credits_balance' => $creditsAllocated,
                'credits_used' => 0,
                'scan_allocated' => $scanAllocated,
                'scan_balance' => $scanAllocated,
                'scan_used' => 0,
            ]);

            return $client;
        });
    }
}
