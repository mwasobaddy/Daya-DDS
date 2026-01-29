<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewDaRegistrationNotification extends Notification
{
    protected $newDa;

    protected $referrer;

    /**
     * Create a new notification instance.
     */
    public function __construct($newDa, $referrer = null)
    {
        $this->newDa = $newDa;
        $this->referrer = $referrer;
    }

    /**
     * Get the new DA user.
     */
    public function getNewDa()
    {
        return $this->newDa;
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
            ->subject('New Digital Ambassador Registration')
            ->greeting('New DA Registration Alert')
            ->line('A new Digital Ambassador has registered on the platform.')
            ->line('')
            ->line('**New DA Details:**')
            ->line('Name: '.$this->newDa->full_name)
            ->line('Email: '.$this->newDa->email)
            ->line('Phone: '.$this->newDa->phone)
            ->line('National ID: '.$this->newDa->national_id)
            ->line('Gender: '.ucfirst($this->newDa->gender))
            ->line('Wallet Type: '.ucfirst($this->newDa->wallet_type))
            ->line('Date of Birth: '.$this->newDa->dob);

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

        return $mail->action('View DA Details', url('/admin/da/'.$this->newDa->id))
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
            'type' => 'new_da_registration',
            'message' => 'New DA registered: '.$this->newDa->full_name,
            'new_da_id' => $this->newDa->id,
            'new_da_name' => $this->newDa->full_name,
            'new_da_email' => $this->newDa->email,
            'referrer_name' => $this->referrer ? $this->referrer->full_name : null,
            'referrer_email' => $this->referrer ? $this->referrer->email : null,
        ];
    }
}
