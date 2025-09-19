<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grant Application Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header {
      background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .header-icon {
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .header p {
      margin: 10px 0 0;
      font-size: 16px;
      opacity: 0.9;
    }

    .content {
      padding: 40px 30px;
    }

    .success-badge {
      background-color: #10B981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      display: inline-block;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 30px;
    }

    .reference-box {
      background-color: #F3F4F6;
      border: 2px dashed #9CA3AF;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 30px 0;
    }

    .reference-label {
      font-size: 14px;
      color: #6B7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .reference-number {
      font-size: 24px;
      font-weight: 700;
      color: #1F2937;
      font-family: 'Courier New', monospace;
      letter-spacing: 0.1em;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }

    .info-item {
      background-color: #F9FAFB;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3B82F6;
    }

    .info-label {
      font-size: 12px;
      color: #6B7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .info-value {
      font-size: 16px;
      color: #1F2937;
      font-weight: 600;
    }

    .alert-box {
      background-color: #FEF3C7;
      border: 1px solid #F59E0B;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }

    .alert-title {
      font-weight: 700;
      color: #92400E;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .alert-text {
      color: #78350F;
      font-size: 14px;
      line-height: 1.5;
    }

    .next-steps {
      background-color: #EFF6FF;
      border-radius: 12px;
      padding: 24px;
      margin: 30px 0;
    }

    .next-steps h3 {
      color: #1E40AF;
      margin: 0 0 16px;
      font-size: 18px;
    }

    .next-steps ul {
      margin: 0;
      padding-left: 20px;
      color: #1E3A8A;
    }

    .next-steps li {
      margin-bottom: 8px;
    }

    .track-button {
      display: inline-block;
      background-color: #3B82F6;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: background-color 0.3s ease;
    }

    .track-button:hover {
      background-color: #2563EB;
    }

    .footer {
      background-color: #F9FAFB;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }

    .footer p {
      margin: 0;
      color: #6B7280;
      font-size: 14px;
    }

    .contact-info {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
    }

    @media (max-width: 600px) {
      .container {
        margin: 0;
        box-shadow: none;
      }

      .header,
      .content,
      .footer {
        padding: 20px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .reference-number {
        font-size: 20px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-icon">
        <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1>Application Received!</h1>
      <p>Your grant application has been successfully submitted</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="success-badge">✓ Successfully Submitted</div>

      <b style="font-size: 18px">Dear {{ $application->first_name }} {{ $application->last_name }},</b>

      <p style="font-size: 16px">Thank you for submitting your grant application. We have successfully received your
        application and it is now
        under review by our team.</p>

      <!-- Reference Number -->
      <div class="reference-box">
        <div class="reference-label">Your Reference Number</div>
        <div class="reference-number">{{ $application->reference }}</div>
      </div>

      <!-- Application Details -->
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Application Date</div>
          <div class="info-value">{{ $application->created_at->format('M d, Y') }}</div>
        </div>
        @if ($application->grantSelect)
          <div class="info-item">
            <div class="info-label">Grant Type</div>
            <div class="info-value">{{ $application->grantSelect }}</div>
          </div>
        @endif
        <div class="info-item">
          <div class="info-label">Amount Range</div>
          <div class="info-value">{{ $application->amount_applied }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Current Status</div>
          <div class="info-value">{{ ucwords(str_replace('_', ' ', $application->status ?? 'submitted')) }}</div>
        </div>
      </div>

      <!-- Important Notice -->
      <div class="alert-box">
        <div class="alert-title">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Important - Keep This Information Safe
        </div>
        <div class="alert-text">
          Please save your reference number <strong>{{ $application->reference }}</strong> in a safe place. You will
          need this number to track your application status and for any future correspondence with our team.
        </div>
      </div>

      <!-- Next Steps -->
      <div class="next-steps">
        <h3>What happens next?</h3>
        <ul>
          <li>Our review team will carefully evaluate your application</li>
          <li>We may contact you if additional information is required</li>
          <li>Contact your Agent for next steps by showing him/her your reference number </li>
          <li>Processing typically takes 24-48 hours</li>
          <li>You can track your application status online anytime</li>
        </ul>
      </div>

      <!-- Track Application Button -->
      <div style="text-align: center;">
        <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/track-application" class="track-button">
          Track Your Application Status
        </a>
      </div>

      <!-- Contact Information -->
      <div class="contact-info">
        <p><strong>Need Help?</strong></p>
        <p>If you have any questions about your application, please contact our support team:</p>
        <p>
          📧 Email: {{ env('APPLICATION_NOTIFY_EMAIL', 'support@grantapplication.com') }}<br> <br>
          📞 Phone: 1-800-GRANTS-1 (1-800-472-6871)<br> <br>
          🕒 Hours: Monday - Friday, 9:00 AM - 5:00 PM EST
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>{{ config('app.name', 'Grant Application System') }}</strong></p>
      <p>This is an automated message. Please do not reply to this email.</p>
      <p style="margin-top: 15px; font-size: 12px; color: #9CA3AF;">
        © {{ date('Y') }} {{ config('app.name', 'Grant Application System') }}. All rights reserved.
      </p>
    </div>
  </div>
</body>

</html>
