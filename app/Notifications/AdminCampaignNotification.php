<?php

namespace App\Notifications;

use App\Models\Campaign;
use App\Models\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class AdminCampaignNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Client $client,
        public Campaign $campaign
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $approveUrl = URL::signedRoute('admin.campaign.approve', ['campaign' => $this->campaign->id]);
        $rejectUrl = URL::signedRoute('admin.campaign.reject', ['campaign' => $this->campaign->id]);

        return (new MailMessage)
            ->subject('New Campaign Registration Requires Review')
            ->greeting('Hello Admin,')
            ->line('A new campaign has been registered and requires your review.')
            ->line('**Client Details:**')
            ->line('Name: '.$this->client->full_name)
            ->line('Email: '.$this->client->email)
            ->line('Phone: '.$this->client->phone)
            ->line('Business: '.$this->client->business_name)
            ->line('**Campaign Details:**')
            ->line('Name: '.$this->campaign->name)
            ->line('Type: '.$this->campaign->type)
            ->line('Objective: '.$this->campaign->campaign_objectives)
            ->line('Budget: '.$this->campaign->budget.' '.$this->campaign->currency)
            ->line('Description: '.$this->campaign->campaign_description)
            ->action('Approve Campaign', $approveUrl)
            ->action('Reject Campaign', $rejectUrl)
            ->line('Please review and take appropriate action.')
            ->salutation('Best regards, Daya DDS Team');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'client_id' => $this->client->id,
            'campaign_id' => $this->campaign->id,
        ];
    }
}
