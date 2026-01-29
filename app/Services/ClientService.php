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

            // if the user exists, check if the phone matches and if phone do not match, throw error telling the user ti use previous phone number
            if ($client && $client->phone !== $data['phone']) {
                throw new \Exception('A client with this email already exists with a different phone number. Please use the phone number associated with this email or use a different email.');
            }

            if (! $client) {
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
                // 10 NGN = 1 credit
                $creditsAllocated = $data['totalBudget'] / 10;
            } else {
                // 1 KSH = 1 credit (default for other currencies)
                $creditsAllocated = $data['totalBudget'];
            }

            // Calculate scan allocated
            $scanAllocated = (int) floor($creditsAllocated / $costPerScan);

            // Prepare business target data
            $businessTarget = [];
            if (in_array('other', $data['selectedBusinessTypes']) && ! empty($data['otherBusinessType'])) {
                $businessTarget['custom'] = $data['otherBusinessType'];
            }
            $businessTarget['types'] = $data['selectedBusinessTypes'];

            // Create campaign record
            $campaign = Campaign::create([
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
                'business_target' => $businessTarget,
                'status' => 'pending',
                'cost_per_scan' => (string) $costPerScan,
                'credits_allocated' => $creditsAllocated,
                'credits_balance' => $creditsAllocated,
                'credits_used' => 0,
                'scan_allocated' => $scanAllocated,
                'scan_balance' => $scanAllocated,
                'scan_used' => 0,
                'start_date' => now(),
                'end_date' => now()->addDays(30),
                'engagement_score' => 50, // Default engagement score
            ]);

            // Notify admins about the new campaign
            $this->notifyAdmins($client, $campaign);

            return $client;
        });
    }

    private function notifyAdmins(Client $client, Campaign $campaign): void
    {
        $admins = \App\Models\User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\AdminCampaignNotification($client, $campaign));
        }
    }
}
