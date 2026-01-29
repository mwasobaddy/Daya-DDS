<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Dcd;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class CampaignMatchingService
{
    /**
     * Find the best matching DCD for a campaign
     */
    public function findMatchingDcd(Campaign $campaign): ?Dcd
    {
        // Step 1: Get DCDs from the campaign's lowest location level
        $dcds = $this->getDcdsByLocation($campaign);

        if ($dcds->isEmpty()) {
            Log::info('No DCDs found for campaign location', ['campaign_id' => $campaign->id]);

            return null;
        }

        // Step 2: Filter DCDs with less than 3 active campaigns
        $dcds = $this->filterByCampaignLimit($dcds);

        if ($dcds->isEmpty()) {
            Log::info('No DCDs available after campaign limit filter', ['campaign_id' => $campaign->id]);

            return null;
        }

        // Step 3: Filter by business types
        $dcds = $this->filterByBusinessTypes($dcds, $campaign);

        if ($dcds->isEmpty()) {
            Log::info('No DCDs match campaign business types', ['campaign_id' => $campaign->id]);

            return null;
        }

        // Step 4: Filter by content types (campaign_types vs campaign_objectives)
        $dcds = $this->filterByContentTypes($dcds, $campaign);

        if ($dcds->isEmpty()) {
            Log::info('No DCDs match campaign content types', ['campaign_id' => $campaign->id]);

            return null;
        }

        // Step 5: Filter by safety preferences
        $dcds = $this->filterBySafetyPreferences($dcds, $campaign);

        if ($dcds->isEmpty()) {
            Log::info('No DCDs match campaign safety preferences', ['campaign_id' => $campaign->id]);

            return null;
        }

        // Step 6: If only 1 DCD left, return it
        if ($dcds->count() === 1) {
            return $dcds->first();
        }

        // Step 7: Filter by most operating days
        $dcds = $this->filterByMostOperatingDays($dcds);

        if ($dcds->count() === 1) {
            return $dcds->first();
        }

        // Step 8: Randomly pick one
        return $dcds->random();
    }

    /**
     * Get DCDs based on campaign's lowest location level
     */
    private function getDcdsByLocation(Campaign $campaign): Collection
    {
        $query = Dcd::query()->with('user');

        // Determine the lowest location level available
        if ($campaign->ward_target) {
            return $query->whereHas('user', function ($q) use ($campaign) {
                $q->where('ward_id', $campaign->ward_target);
            })->get();
        } elseif ($campaign->subcounty_target) {
            return $query->whereHas('user', function ($q) use ($campaign) {
                $q->where('subcounty_id', $campaign->subcounty_target);
            })->get();
        } elseif ($campaign->county_target) {
            return $query->whereHas('user', function ($q) use ($campaign) {
                $q->where('county_id', $campaign->county_target);
            })->get();
        } elseif ($campaign->country_target) {
            return $query->whereHas('user', function ($q) use ($campaign) {
                $q->where('country_id', $campaign->country_target);
            })->get();
        }

        // If no location specified, return empty (or all - depending on business rules)
        return collect();
    }

    /**
     * Filter DCDs that have less than 3 active campaigns
     */
    private function filterByCampaignLimit(Collection $dcds): Collection
    {
        return $dcds->filter(function ($dcd) {
            // Count active campaigns for this DCD
            $activeCampaigns = $dcd->campaigns()
                ->where('status', 'approved')
                ->count();

            return $activeCampaigns < 3;
        });
    }

    /**
     * Filter DCDs that have at least one matching business type
     */
    private function filterByBusinessTypes(Collection $dcds, Campaign $campaign): Collection
    {
        $campaignBusinessTypes = $campaign->business_target['types'] ?? [];

        return $dcds->filter(function ($dcd) use ($campaignBusinessTypes) {
            $dcdBusinessTypes = $dcd->business_type['types'] ?? [];

            // Check if DCD has any of the campaign's business types
            return ! empty(array_intersect($campaignBusinessTypes, $dcdBusinessTypes));
        });
    }

    /**
     * Filter DCDs whose campaign_types match campaign objectives
     */
    private function filterByContentTypes(Collection $dcds, Campaign $campaign): Collection
    {
        $campaignObjectives = is_array($campaign->campaign_objectives)
            ? $campaign->campaign_objectives
            : [$campaign->campaign_objectives];

        return $dcds->filter(function ($dcd) use ($campaignObjectives) {
            $dcdContentTypes = $dcd->campaign_types ?? [];

            // Check if DCD has any of the campaign's objectives
            return ! empty(array_intersect($campaignObjectives, $dcdContentTypes));
        });
    }

    /**
     * Filter DCDs whose safety_preferences match campaign preferences
     */
    private function filterBySafetyPreferences(Collection $dcds, Campaign $campaign): Collection
    {
        $campaignSafetyPrefs = $campaign->safety_preferences ?? [];

        return $dcds->filter(function ($dcd) use ($campaignSafetyPrefs) {
            $dcdSafetyPrefs = $dcd->safety_preferences ?? [];

            // Check if DCD has any of the campaign's safety preferences
            return ! empty(array_intersect($campaignSafetyPrefs, $dcdSafetyPrefs));
        });
    }

    /**
     * Filter to DCDs with the most operating days
     */
    private function filterByMostOperatingDays(Collection $dcds): Collection
    {
        $maxDays = $dcds->max(function ($dcd) {
            return count($dcd->operating_days ?? []);
        });

        return $dcds->filter(function ($dcd) use ($maxDays) {
            return count($dcd->operating_days ?? []) === $maxDays;
        });
    }
}
