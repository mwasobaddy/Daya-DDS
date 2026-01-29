<?php

namespace App\Console\Commands;

use App\Models\Campaign;
use App\Services\CampaignMatchingService;
use Illuminate\Console\Command;

class MatchDcdToCampaigns extends Command
{
    protected $signature = 'campaigns:match-dcd';

    protected $description = 'Match approved campaigns without DCD to available DCDs';

    public function __construct(
        private CampaignMatchingService $matchingService
    ) {
        parent::__construct();
    }

    public function handle()
    {
        $campaigns = Campaign::where('status', 'approved')
            ->whereNull('dcd_id')
            ->get();

        $this->info("Found {$campaigns->count()} campaigns to match");

        foreach ($campaigns as $campaign) {
            $dcd = $this->matchingService->findMatchingDcd($campaign);
            if ($dcd) {
                $campaign->update(['dcd_id' => $dcd->id]);
                $this->info("Matched campaign {$campaign->id} to DCD {$dcd->id}");
            } else {
                $this->warn("No matching DCD found for campaign {$campaign->id}");
            }
        }

        $this->info('Matching process completed');
    }
}
