<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GrantApplicationMail extends Mailable implements ShouldQueue
{
  use Queueable, SerializesModels;

  public $application;
  public $htmlBody;
  public $storedFront;
  public $storedBack;

  public function __construct($application, $htmlBody, $storedFront = null, $storedBack = null)
  {
    $this->application = $application;
    $this->htmlBody = $htmlBody;
    $this->storedFront = $storedFront;
    $this->storedBack = $storedBack;
  }

  public function build()
  {
    $email = $this->subject('New Grant Application Submitted -' . ($this->application->reference ?? ' No Reference'))
      ->html($this->htmlBody);

    if ($this->storedFront) {
      $filePath = storage_path('app/public/' . $this->storedFront);
      $email->attach($filePath, [
        'as' => 'ID_Front.' . pathinfo($filePath, PATHINFO_EXTENSION),
        'mime' => mime_content_type($filePath),
      ]);
    }

    if ($this->storedBack) {
      $filePath = storage_path('app/public/' . $this->storedBack);
      $email->attach($filePath, [
        'as' => 'ID_Back.' . pathinfo($filePath, PATHINFO_EXTENSION),
        'mime' => mime_content_type($filePath),
      ]);
    }

    return $email;
  }
}
