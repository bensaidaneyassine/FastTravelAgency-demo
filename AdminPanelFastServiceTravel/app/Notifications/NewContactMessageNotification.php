<?php

namespace App\Notifications;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewContactMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Contact $contact) {}

    public function via($notifiable): array
    {
        return ['database']; // Add 'mail' if mail is configured
    }

    public function toDatabase($notifiable): DatabaseMessage
    {
        return new DatabaseMessage([
            'type' => 'contact_message',
            'contact_id' => (string)$this->contact->_id ?? $this->contact->id,
            'name' => $this->contact->name,
            'email' => $this->contact->email,
            'subject' => $this->contact->subject,
            'message_excerpt' => mb_substr($this->contact->message, 0, 120) . '...',
        ]);
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Contact Message: ' . $this->contact->subject)
            ->greeting('Hello Admin')
            ->line('A new contact message has been submitted.')
            ->line('From: ' . $this->contact->name . ' <' . $this->contact->email . '>')
            ->line('Subject: ' . $this->contact->subject)
            ->action('View Messages', url('/admin/contact-messages'))
            ->line('Thank you.');
    }
}
