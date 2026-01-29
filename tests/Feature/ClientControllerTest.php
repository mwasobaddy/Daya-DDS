<?php

use App\Models\AdminAction;
use App\Models\Campaign;
use App\Models\Client;
use App\Models\Country;
use App\Models\County;
use App\Models\Dcd;
use App\Models\Subcounty;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

uses(RefreshDatabase::class);

describe('ClientController', function () {
    beforeEach(function () {
        // Create geographical data
        $this->country = Country::create([
            'code' => 'kenya',
            'name' => 'Kenya',
            'currency_code' => 'KES',
            'currency_symbol' => 'KSh',
            'county_label' => 'County',
            'subcounty_label' => 'Sub-county',
        ]);
        $this->county = County::create(['name' => 'Nairobi', 'country_id' => $this->country->id]);
        $this->subcounty = Subcounty::create(['name' => 'Westlands', 'county_id' => $this->county->id]);
        $this->ward = Ward::create(['name' => 'Kilimani', 'subcounty_id' => $this->subcounty->id]);

        // Create admin user
        $this->admin = User::factory()->create(['role' => 'admin']);

        Notification::fake();
    });

    test('shows campaign approval page', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(URL::signedRoute('admin.campaign.approve', $campaign));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/CampaignApprove')
            ->has('campaign')
            ->has('dcdAssigned')
            ->where('dcdAssigned', false) // No DCD available yet
        );
    });

    test('shows campaign approval page with assigned DCD', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
            'country_target' => $this->country->id,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka'],
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate'],
        ]);

        // Create matching DCD
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => $this->country->id,
        ]);
        $dcd = Dcd::factory()->create([
            'user_id' => $dcdUser->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka'],
            ],
            'campaign_types' => ['surveys'],
            'safety_preferences' => ['Kids Appropriate'],
            'operating_days' => ['Monday'],
        ]);

        $response = $this->actingAs($this->admin)
            ->get(URL::signedRoute('admin.campaign.approve', $campaign));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/CampaignApprove')
            ->has('campaign')
            ->has('dcdAssigned')
            ->where('dcdAssigned', true)
            ->has('dcdName')
        );
    });

    test('approves campaign successfully', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.campaign.process-approve', $campaign));

        $response->assertRedirect(route('admin.campaign.approve', $campaign));
        $response->assertSessionHas('success', 'Campaign approved successfully.');

        $campaign->refresh();
        expect($campaign->status)->toBe('approved');

        // Check admin action was recorded
        $action = AdminAction::where('campaign_id', $campaign->id)->first();
        expect($action)->not->toBeNull();
        expect($action->action)->toBe('approved');
        expect($action->admin_id)->toBe($this->admin->id);

        // Check notification was sent
        Notification::assertSentTo(
            $client,
            \App\Notifications\ClientCampaignApprovedNotification::class
        );
    });

    test('assigns DCD when approving campaign with match', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
            'country_target' => $this->country->id,
            'business_target' => [
                'custom' => '',
                'types' => ['kiosk_duka'],
            ],
            'campaign_objectives' => 'surveys',
            'safety_preferences' => ['Kids Appropriate'],
        ]);

        // Create matching DCD
        $dcdUser = User::factory()->create([
            'role' => 'dcd',
            'country_id' => $this->country->id,
        ]);
        $dcd = Dcd::factory()->create([
            'user_id' => $dcdUser->id,
            'business_type' => [
                'custom' => '',
                'types' => ['kiosk_duka'],
            ],
            'campaign_types' => ['surveys'],
            'safety_preferences' => ['Kids Appropriate'],
            'operating_days' => ['Monday'],
        ]);

        $response = $this->actingAs($this->admin)
            ->post(URL::signedRoute('admin.campaign.process-approve', $campaign));

        $campaign->refresh();
        expect($campaign->dcd_id)->toBe($dcd->id);
    });

    test('rejects campaign successfully', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.campaign.process-reject', $campaign), [
                'rejection_reason' => 'Campaign does not meet requirements.',
            ]);

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('success', 'Campaign rejected successfully.');

        $campaign->refresh();
        expect($campaign->status)->toBe('rejected');

        // Check admin action was recorded
        $action = AdminAction::where('campaign_id', $campaign->id)->first();
        expect($action)->not->toBeNull();
        expect($action->action)->toBe('rejected');
        expect($action->rejection_reason)->toBe('Campaign does not meet requirements.');

        // Check notification was sent
        Notification::assertSentTo(
            $client,
            \App\Notifications\ClientCampaignRejectedNotification::class
        );
    });

    test('prevents double approval', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        // First approval
        AdminAction::create([
            'campaign_id' => $campaign->id,
            'admin_id' => $this->admin->id,
            'action' => 'approved',
            'acted_at' => now(),
        ]);

        // Try to approve again
        $response = $this->actingAs($this->admin)
            ->post(URL::signedRoute('admin.campaign.process-approve', $campaign));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/CampaignConflict')
        );
    });

    test('prevents double rejection', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        // First rejection
        AdminAction::create([
            'campaign_id' => $campaign->id,
            'admin_id' => $this->admin->id,
            'action' => 'rejected',
            'rejection_reason' => 'Test reason',
            'acted_at' => now(),
        ]);

        // Try to reject again
        $response = $this->actingAs($this->admin)
            ->post(URL::signedRoute('admin.campaign.process-reject', $campaign), [
                'rejection_reason' => 'Another reason',
            ]);

        $response->assertInertia(fn ($page) => $page
            ->component('admin/CampaignConflict')
        );
    });

    test('shows conflict page for already acted campaigns', function () {
        $client = Client::factory()->create();
        $campaign = Campaign::factory()->create([
            'client_id' => $client->id,
            'status' => 'approved',
        ]);

        AdminAction::create([
            'campaign_id' => $campaign->id,
            'admin_id' => $this->admin->id,
            'action' => 'approved',
            'acted_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->get(URL::signedRoute('admin.campaign.approve', $campaign));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/CampaignConflict')
            ->has('adminAction')
        );
    });
});
