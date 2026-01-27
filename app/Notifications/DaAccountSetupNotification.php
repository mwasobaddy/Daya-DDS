<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DaAccountSetupNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
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
            ->subject('Welcome to Daya DDS - Your Account is Ready!')
            ->greeting('Welcome '.$notifiable->full_name.'!')
            ->line('Congratulations! Your Digital Ambassador account has been successfully set up.')
            ->line('')
            ->line('**What you can do as a DA:**')
            ->line('• Earn commissions by referring new users')
            ->line('• Build your network and grow your income')
            ->line('• Access exclusive DA tools and resources')
            ->line('• Participate in promotional campaigns')
            ->line('')
            ->line('**Next Steps:**')
            ->line('1. Complete your profile setup')
            ->line('2. Start referring friends and family')
            ->line('3. Monitor your earnings in the dashboard')
            ->line('4. Join our DA community for tips and support')
            ->action('Access Your Dashboard', url('/dashboard'))
            ->line('If you have any questions, feel free to contact our support team.')
            ->salutation('Best regards, The Daya DDS Team');
    }
}
