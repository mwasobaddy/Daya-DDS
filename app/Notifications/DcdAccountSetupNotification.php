<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class DcdAccountSetupNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private int $ddsEarned = 0,
        private int $dwsEarned = 0
    ) {}

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
        $mail = (new MailMessage)
            ->subject('Welcome to Daya DDS - Your Digital Content Distributor Account is Ready!')
            ->greeting('Welcome '.$notifiable->full_name.'!')
            ->line('Congratulations! Your Digital Content Distributor account has been successfully set up.');

        if ($this->ddsEarned > 0 || $this->dwsEarned > 0) {
            $mail->line('')
                ->line('**🎉 Signup Bonus Awarded!**')
                ->line('You have received **'.$this->ddsEarned.' DDS** and **'.$this->dwsEarned.' DWS** tokens as a signup bonus!')
                ->line('Total DDS Balance: '.$notifiable->total_DDS_balance)
                ->line('Total DWS Balance: '.$notifiable->total_DWS_balance);
        }

        $mail->line('')
            ->line('**What you can do as a DCD:**')
            ->line('• Distribute digital content in your business location')
            ->line('• Earn revenue from content distribution')
            ->line('• Access exclusive DCD tools and analytics')
            ->line('• Participate in promotional campaigns')
            ->line('')
            ->line('**How to Earn on the Platform:**')
            ->line('• Display QR codes in your business for customers to scan')
            ->line('• Earn tokens each time a customer scans and engages with content')
            ->line('• Participate in targeted campaigns for higher earnings')
            ->line('• Monitor your performance through detailed analytics')
            ->line('')
            ->line('**Next Steps:**')
            ->line('1. Complete your business profile setup')
            ->line('2. Set up your content distribution preferences')
            ->line('3. Start distributing content and earning revenue')
            ->line('4. Monitor your earnings in the dashboard')
            ->action('Access Your Dashboard', url('/dashboard'))
            ->line('If you have any questions, feel free to contact our support team.')
            ->salutation('Best regards, The Daya DDS Team');

        // Attach PDF guide if it exists
        if ($notifiable->dcd && $notifiable->dcd->pdf_guide_path) {
            $pdfPath = Storage::disk('public')->path($notifiable->dcd->pdf_guide_path);
            if (file_exists($pdfPath)) {
                $mail->attach($pdfPath, [
                    'as' => 'DCD_QR_Code_Guide.pdf',
                    'mime' => 'application/pdf',
                ]);
            }
        }

        return $mail;
    }
}
