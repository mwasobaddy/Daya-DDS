<?php

namespace App\Console\Commands;

use App\Models\Campaign;
use App\Models\Dcd;
use Illuminate\Console\Command;

class MatchDcdToCampaigns extends Command
{
    protected $signature = 'campaigns:match-dcd';

    protected $description = 'Match approved campaigns without DCD to available DCDs';

    public function handle()
    {
        $campaigns = Campaign::where('status', 'approved')
            ->whereNull('dcd_id')
            ->get();

        $this->info("Found {$campaigns->count()} campaigns to match");

        foreach ($campaigns as $campaign) {
            $dcd = $this->findMatchingDcd($campaign);
            if ($dcd) {
                $campaign->update(['dcd_id' => $dcd->id]);
                $this->info("Matched campaign {$campaign->id} to DCD {$dcd->id}");
            } else {
                $this->warn("No matching DCD found for campaign {$campaign->id}");
            }
        }

        $this->info('Matching process completed');
    }

    private function findMatchingDcd(Campaign $campaign)
    {
        // Enhanced matching logic
        // 1. Exact location match
        $dcd = Dcd::where('country_id', $campaign->country_target)
            ->where('county_id', $campaign->county_target)
            ->whereJsonContains('business_types', $campaign->business_target)
            ->first();

        if ($dcd) {
            return $dcd;
        }

        // 2. Broader location match (same country, any county)
        $dcd = Dcd::where('country_id', $campaign->country_target)
            ->whereJsonContains('business_types', $campaign->business_target)
            ->first();

        if ($dcd) {
            return $dcd;
        }

        // 3. Any location with matching business types
        $dcd = Dcd::whereJsonContains('business_types', $campaign->business_target)
            ->first();

        return $dcd;
    }
}
