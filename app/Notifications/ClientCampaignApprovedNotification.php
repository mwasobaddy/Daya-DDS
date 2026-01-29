<?php

namespace App\Notifications;

use App\Models\Campaign;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClientCampaignApprovedNotification extends Notification
{
    public function __construct(
        public Campaign $campaign
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Campaign Has Been Approved')
            ->greeting('Congratulations!')
            ->line('Your campaign registration has been approved and is now active.')
            ->line('**Campaign Details:**')
            ->line('Name: '.$this->campaign->name)
            ->line('Type: '.$this->campaign->type)
            ->line('Objective: '.$this->campaign->campaign_objectives)
            ->line('Budget: '.$this->campaign->budget.' '.$this->campaign->currency)
            ->line('Credits Allocated: '.$this->campaign->credits_allocated)
            ->line('Scans Allocated: '.$this->campaign->scan_allocated)
            ->line('Your campaign will start receiving scans soon.')
            ->action('View Dashboard', url('/client/dashboard'))
            ->salutation('Best regards, Daya DDS Team');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'campaign_id' => $this->campaign->id,
            'status' => 'approved',
        ];
    }
}
