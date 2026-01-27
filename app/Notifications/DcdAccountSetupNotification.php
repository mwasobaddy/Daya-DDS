<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DcdAccountSetupNotification extends Notification implements ShouldQueue
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
            ->subject('Welcome to Daya DDS - Your Digital Content Distributor Account is Ready!')
            ->greeting('Welcome '.$notifiable->full_name.'!')
            ->line('Congratulations! Your Digital Content Distributor account has been successfully set up.')
            ->line('')
            ->line('**What you can do as a DCD:**')
            ->line('• Distribute digital content in your business location')
            ->line('• Earn revenue from content distribution')
            ->line('• Access exclusive DCD tools and analytics')
            ->line('• Participate in promotional campaigns')
            ->line('')
            ->line('**Next Steps:**')
            ->line('1. Complete your business profile setup')
            ->line('2. Set up your content distribution preferences')
            ->line('3. Start distributing content and earning revenue')
            ->line('4. Monitor your earnings in the dashboard')
            ->action('Access Your Dashboard', url('/dashboard'))
            ->line('If you have any questions, feel free to contact our support team.')
            ->salutation('Best regards, The Daya DDS Team');
    }
}
