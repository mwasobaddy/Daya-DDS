<?php

namespace App\Notifications;

use App\Models\Campaign;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClientCampaignRejectedNotification extends Notification
{
    public function __construct(
        public Campaign $campaign,
        public string $rejectionReason
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Campaign Has Been Rejected')
            ->greeting('We regret to inform you')
            ->line('Your campaign registration has been reviewed and unfortunately rejected.')
            ->line('**Campaign Details:**')
            ->line('Name: '.$this->campaign->name)
            ->line('Reason for Rejection: '.$this->rejectionReason)
            ->line('You can modify your campaign details and submit again.')
            ->action('Submit New Campaign', url('/client/register'))
            ->salutation('Best regards, Daya DDS Team');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'campaign_id' => $this->campaign->id,
            'status' => 'rejected',
            'reason' => $this->rejectionReason,
        ];
    }
}
