<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Models\AdminAction;
use App\Models\Campaign;
use App\Services\ClientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct(
        private ClientService $clientService
    ) {}

    public function index(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'video_url' => 'https://www.youtube.com/embed/KBSQg6WPxtU',
                'title' => 'Launch Your Digital Campaign',
                'description' => 'Discover how the Daya ecosystem empowers you to distribute digital content and reach targeted audiences.',
            ]);
        }

        return Inertia::render('client/index', [
            'videoUrl' => 'https://www.youtube.com/embed/KBSQg6WPxtU',
            'title' => 'Launch Your Digital Campaign',
            'description' => 'Discover how the Daya ecosystem empowers you to distribute digital content and reach targeted audiences.',
        ]);
    }

    public function register(Request $request)
    {
        // For Inertia web
        if ($request->wantsJson()) {
            return response()->json([
                'form' => 'client/register',
            ]);
        }

        return Inertia::render('client/register');
    }

    public function store(StoreClientRequest $request)
    {
        try {
            $client = $this->clientService->createClient($request->validated());

            return redirect()
                ->route('client.register')
                ->with('success', 'Client campaign registration submitted successfully!');
        } catch (\Exception $e) {
            \Log::error('Client registration failed', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function approveCampaign(Campaign $campaign)
    {
        // Check if already acted upon
        $existingAction = AdminAction::where('campaign_id', $campaign->id)->first();
        if ($existingAction) {
            return Inertia::render('admin/CampaignConflict', [
                'campaign' => $campaign->load('client'),
                'adminAction' => [
                    'action' => $existingAction->action,
                    'admin' => $existingAction->admin,
                    'created_at' => $existingAction->acted_at,
                    'rejection_reason' => $existingAction->rejection_reason,
                ],
            ]);
        }

        // Check if DCD can be assigned
        $dcd = $this->findMatchingDcd($campaign);

        return Inertia::render('admin/CampaignApprove', [
            'campaign' => $campaign->load('client'),
            'dcdAssigned' => $dcd !== null,
            'dcdName' => $dcd?->user->name,
        ]);
    }

    public function processApprove(Campaign $campaign)
    {
        // Check if already acted upon
        $existingAction = AdminAction::where('campaign_id', $campaign->id)->first();
        if ($existingAction) {
            return Inertia::render('admin/CampaignConflict', [
                'campaign' => $campaign->load('client'),
                'adminAction' => [
                    'action' => $existingAction->action,
                    'admin' => $existingAction->admin,
                    'created_at' => $existingAction->acted_at,
                    'rejection_reason' => $existingAction->rejection_reason,
                ],
            ]);
        }

        // Record the action
        AdminAction::create([
            'campaign_id' => $campaign->id,
            'admin_id' => Auth::id(),
            'action' => 'approved',
            'acted_at' => now(),
        ]);

        // Update campaign status
        $campaign->update(['status' => 'approved']);

        // Try to find matching DCD
        $dcd = $this->findMatchingDcd($campaign);
        if ($dcd) {
            $campaign->update(['dcd_id' => $dcd->id]);
        } else {
            // Queue for cron job
            // For now, we'll implement the cron later
        }

        // Send confirmation email to client
        $campaign->client->notify(new \App\Notifications\ClientCampaignApprovedNotification($campaign));

        return redirect()->route('admin.dashboard')->with('success', 'Campaign approved successfully.');
    }

    public function processReject(Request $request, Campaign $campaign)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        // Check if already acted upon
        $existingAction = AdminAction::where('campaign_id', $campaign->id)->first();
        if ($existingAction) {
            return Inertia::render('admin/CampaignConflict', [
                'campaign' => $campaign->load('client'),
                'adminAction' => [
                    'action' => $existingAction->action,
                    'admin' => $existingAction->admin,
                    'created_at' => $existingAction->acted_at,
                    'rejection_reason' => $existingAction->rejection_reason,
                ],
            ]);
        }

        // Record the action
        AdminAction::create([
            'campaign_id' => $campaign->id,
            'admin_id' => Auth::id(),
            'action' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'acted_at' => now(),
        ]);

        // Update campaign status
        $campaign->update(['status' => 'rejected']);

        // Send rejection email to client
        $campaign->client->notify(new \App\Notifications\ClientCampaignRejectedNotification($campaign, $request->rejection_reason));

        return redirect()->route('admin.dashboard')->with('success', 'Campaign rejected successfully.');
    }

    private function findMatchingDcd(Campaign $campaign)
    {
        // Simple matching logic: find DCD in the same location with matching business types
        // This can be enhanced later
        return \App\Models\Dcd::where('country_id', $campaign->country_target)
            ->where('county_id', $campaign->county_target)
            ->whereJsonContains('business_types', $campaign->business_target)
            ->first();
    }
}
