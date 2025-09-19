<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Application;

class ApplicationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $application;

    /**
     * Create a new message instance.
     */
    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Grant Application Confirmation - ' . $this->application->reference,
            from: config('mail.from.address', 'no-reply@grantapplication.com'),
            replyTo: config('mail.application_notify_email', 'support@grantapplication.com'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.application-confirmation',
            with: [
                'application' => $this->application,
                'applicantName' => $this->application->first_name . ' ' . $this->application->last_name,
                'referenceNumber' => $this->application->reference,
                'submissionDate' => $this->application->created_at->format('F j, Y'),
                'grantType' => $this->application->grantSelect,
                'amountRange' => $this->application->amount_applied,
                'currentStatus' => ucwords(str_replace('_', ' ', $this->application->status)),
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
