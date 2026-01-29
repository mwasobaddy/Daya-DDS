<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DaWalletCreatedNotification extends Notification
{
    protected $walletType;

    protected $walletPin;

    /**
     * Create a new notification instance.
     */
    public function __construct($walletType, $walletPin)
    {
        $this->walletType = $walletType;
        $this->walletPin = $walletPin;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Daya DDS Wallet Has Been Created')
            ->greeting('Hello '.$notifiable->full_name.'!')
            ->line('Your digital wallet has been successfully created and is ready to use.')
            ->line('')
            ->line('**Wallet Details:**')
            ->line('Wallet Type: '.ucfirst($this->walletType))
            ->line('Wallet PIN: '.$this->walletPin.' (Keep this secure!)')
            ->line('Current Balance: 0 DDS')
            ->line('')
            ->line('**Important Security Notes:**')
            ->line('• Never share your wallet PIN with anyone')
            ->line('• Use your PIN for all wallet transactions')
            ->line('• Contact support immediately if you suspect unauthorized access')
            ->line('')
            ->action('Manage Your Wallet', url('/dashboard/wallet'))
            ->line('Start earning and managing your tokens today!')
            ->salutation('Best regards, The Daya DDS Team');
    }
}
