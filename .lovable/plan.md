

# Batch Email Notification for Certificate Issuance

## Overview
Create an edge function that sends notification emails to recipients when certificates are issued, callable from both single and bulk issuance flows.

## Approach
Use Lovable AI's built-in capabilities to avoid requiring external API keys. The edge function will use the Resend-style email sending via the Supabase built-in `SUPABASE_SERVICE_ROLE_KEY` and auth admin features — but since we don't have a custom email domain or Resend key, we'll use **Supabase's built-in `auth.admin.generateLink`** approach won't work for arbitrary emails.

**Better approach**: Create an edge function that uses Resend (requires API key) or leverage a connector.

Actually, the simplest reliable approach: Create an edge function `send-certificate-emails` that accepts an array of `{recipient_name, recipient_email, certificate_id, course_name}` and sends emails. We need an email-sending service.

Let me check available connectors and options.

Since no email connector is natively available and no API keys are configured, we have two options:

1. **Ask user for a Resend API key** — store as a secret, use in edge function
2. **Use Lovable AI** — not applicable for email sending

**Recommendation**: Use Resend (free tier supports 100 emails/day). We'll need the user to provide a `RESEND_API_KEY`.

## Implementation Plan

### 1. Create edge function `send-certificate-emails`
- Accepts POST with array of recipients: `{recipient_name, recipient_email, certificate_id, course_name, issuer_name}`
- Uses Resend API to send branded HTML emails with certificate details and a verification link
- Returns success/failure counts
- Includes CORS headers and JWT validation

### 2. Update `IssueCertificate.tsx`
- After successful single insert: query the inserted certificate's ID, then call the edge function with one recipient
- After successful bulk insert: query the inserted certificates, then call the edge function with all recipients
- Add a "Send email notifications" toggle (default on) so issuers can opt out
- Show toast with email delivery results

### 3. Email template (inline in edge function)
- Branded HTML email matching AfriCertify's dark blue/neon theme
- Contains: recipient name, course/achievement name, issuer organization, verification link (`/certificate/:id`)
- Mobile-responsive

### 4. Secret setup
- Will need `RESEND_API_KEY` from the user before the edge function can send emails

## Steps
1. Request `RESEND_API_KEY` secret from user
2. Create `supabase/functions/send-certificate-emails/index.ts`
3. Update `supabase/config.toml` with `verify_jwt = false` for the function
4. Update `IssueCertificate.tsx` — add notification toggle, call edge function after issuance
5. Deploy edge function

