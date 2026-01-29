<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DcdReferralRewardNotification extends Notification
{
    protected $newDcd;

    protected $ddsAwarded;

    protected $dwsAwarded;

    protected $totalDdsBalance;

    protected $totalDwsBalance;

    /**
     * Create a new notification instance.
     */
    public function __construct($newDcd, $ddsAwarded, $dwsAwarded, $totalDdsBalance, $totalDwsBalance)
    {
        $this->newDcd = $newDcd;
        $this->ddsAwarded = $ddsAwarded;
        $this->dwsAwarded = $dwsAwarded;
        $this->totalDdsBalance = $totalDdsBalance;
        $this->totalDwsBalance = $totalDwsBalance;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Congratulations! New DCD Referral Reward')
            ->greeting('Great news!')
            ->line('A new Digital Content Distributor has signed up using your referral code.')
            ->line('**New DCD Details:**')
            ->line('Name: '.$this->newDcd->full_name)
            ->line('Business: '.$this->newDcd->dcd->business_name ?? 'N/A')
            ->line('Email: '.$this->newDcd->email)
            ->line('Phone: '.$this->newDcd->phone)
            ->line('')
            ->line('**Reward Earned:**')
            ->line('DDS Tokens: '.$this->ddsAwarded)
            ->line('DWS Tokens: '.$this->dwsAwarded)
            ->line('')
            ->line('**Your Updated Balance:**')
            ->line('Total DDS Balance: '.$this->totalDdsBalance)
            ->line('Total DWS Balance: '.$this->totalDwsBalance)
            ->action('View Dashboard', url('/dashboard'))
            ->line('Thank you for helping grow our content distribution network!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'dcd_referral_reward',
            'message' => 'You earned '.$this->ddsAwarded.' DDS and '.$this->dwsAwarded.' DWS tokens for referring '.$this->newDcd->full_name,
            'new_dcd_name' => $this->newDcd->full_name,
            'new_dcd_business' => $this->newDcd->dcd->business_name ?? 'N/A',
            'new_dcd_email' => $this->newDcd->email,
            'dds_awarded' => $this->ddsAwarded,
            'dws_awarded' => $this->dwsAwarded,
            'total_dds_balance' => $this->totalDdsBalance,
            'total_dws_balance' => $this->totalDwsBalance,
        ];
    }
}
