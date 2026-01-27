<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewDcdRegistrationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $newDcd;

    protected $referrer;

    /**
     * Create a new notification instance.
     */
    public function __construct($newDcd, $referrer = null)
    {
        $this->newDcd = $newDcd;
        $this->referrer = $referrer;
    }

    /**
     * Get the new DCD user.
     */
    public function getNewDcd()
    {
        return $this->newDcd;
    }

    /**
     * Get the referrer user.
     */
    public function getReferrer()
    {
        return $this->referrer;
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
        $mail = (new MailMessage)
            ->subject('New Digital Content Distributor Registration')
            ->greeting('New DCD Registration Alert')
            ->line('A new Digital Content Distributor has registered on the platform.')
            ->line('')
            ->line('**New DCD Details:**')
            ->line('Name: '.$this->newDcd->full_name)
            ->line('Business: '.$this->newDcd->dcd->business_name ?? 'N/A')
            ->line('Email: '.$this->newDcd->email)
            ->line('Phone: '.$this->newDcd->phone)
            ->line('National ID: '.$this->newDcd->national_id)
            ->line('Gender: '.ucfirst($this->newDcd->gender))
            ->line('Wallet Type: Business')
            ->line('Date of Birth: '.$this->newDcd->dob);

        if ($this->referrer) {
            $mail->line('')
                ->line('**Referral Information:**')
                ->line('Referred by: '.$this->referrer->full_name.' ('.$this->referrer->email.')')
                ->line('Referrer Role: '.ucfirst($this->referrer->role));
        } else {
            $mail->line('')
                ->line('**Referral Information:**')
                ->line('No referral code provided - assigned to admin automatically');
        }

        return $mail->action('View DCD Details', url('/admin/dcd/'.$this->newDcd->id))
            ->line('Please review the application and take appropriate action.')
            ->salutation('Best regards, Daya DDS System');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_dcd_registration',
            'message' => 'New DCD registered: '.$this->newDcd->full_name,
            'new_dcd_id' => $this->newDcd->id,
            'new_dcd_name' => $this->newDcd->full_name,
            'new_dcd_business' => $this->newDcd->dcd->business_name ?? 'N/A',
            'new_dcd_email' => $this->newDcd->email,
            'referrer_name' => $this->referrer ? $this->referrer->full_name : null,
            'referrer_email' => $this->referrer ? $this->referrer->email : null,
        ];
    }
}
