<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DaReferralRewardNotification extends Notification
{
    protected $newDa;

    protected $ddsAwarded;

    protected $dwsAwarded;

    protected $totalDdsBalance;

    protected $totalDwsBalance;

    /**
     * Create a new notification instance.
     */
    public function __construct($newDa, $ddsAwarded, $dwsAwarded, $totalDdsBalance, $totalDwsBalance)
    {
        $this->newDa = $newDa;
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
            ->subject('Congratulations! New DA Referral Reward')
            ->greeting('Great news!')
            ->line('A new Digital Ambassador has signed up using your referral code.')
            ->line('**New DA Details:**')
            ->line('Name: '.$this->newDa->full_name)
            ->line('Email: '.$this->newDa->email)
            ->line('Phone: '.$this->newDa->phone)
            ->line('')
            ->line('**Reward Earned:**')
            ->line('DDS Tokens: '.$this->ddsAwarded)
            ->line('DWS Tokens: '.$this->dwsAwarded)
            ->line('')
            ->line('**Your Updated Balance:**')
            ->line('Total DDS Balance: '.$this->totalDdsBalance)
            ->line('Total DWS Balance: '.$this->totalDwsBalance)
            ->action('View Dashboard', url('/dashboard'))
            ->line('Thank you for helping grow our community!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'da_referral_reward',
            'message' => 'You earned '.$this->ddsAwarded.' DDS and '.$this->dwsAwarded.' DWS tokens for referring '.$this->newDa->full_name,
            'new_da_name' => $this->newDa->full_name,
            'new_da_email' => $this->newDa->email,
            'dds_awarded' => $this->ddsAwarded,
            'dws_awarded' => $this->dwsAwarded,
            'total_dds_balance' => $this->totalDdsBalance,
            'total_dws_balance' => $this->totalDwsBalance,
        ];
    }
}
