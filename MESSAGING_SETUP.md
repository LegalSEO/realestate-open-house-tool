# Automated Messaging Setup

This document explains how to set up and configure the automated SMS and email follow-up sequences for the Open House Lead Capture Tool.

## Overview

When a lead signs in at an open house, the system automatically:

1. **Immediately sends**:
   - Welcome SMS with property details link
   - Welcome email with property photos and details

2. **Schedules follow-up messages**:
   - **1 hour later**: SMS + Email (first follow-up)
   - **24 hours later**: SMS + Email (second follow-up)
   - **3 days later**: SMS + Email (similar properties)
   - **7 days later**: SMS + Email (market update)

## Requirements

### 1. Twilio Account (for SMS)

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get a phone number with SMS capabilities
3. Copy your Account SID, Auth Token, and phone number
4. Add them to your `.env` file:

```env
TWILIO_ACCOUNT_SID="your_account_sid_here"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"
```

### 2. Resend Account (for Email)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use the test domain for development)
3. Generate an API key
4. Add it to your `.env` file:

```env
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="Your Name <noreply@yourdomain.com>"
```

### 3. Application URL

Set your application's base URL:

```env
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

For local development, use `http://localhost:3000`.

## Database Migration

After setting up the environment variables, run the database migration to create the `ScheduledMessage` table:

```bash
npx prisma migrate dev --name add-scheduled-messages
```

## Cron Job Setup

The system uses a cron job to process scheduled messages. Messages are checked and sent every 5 minutes.

### Option 1: Vercel Cron (Recommended for Vercel deployments)

If you're deploying to Vercel, the cron job is automatically configured via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-messages",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

No additional setup needed! Vercel will handle the cron execution.

### Option 2: External Cron Service (for other deployments)

If you're not using Vercel, use an external cron service like:

- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Cron-job.io](https://cron-job.io)

Configure it to call your endpoint every 5 minutes:

**URL**: `https://yourdomain.com/api/cron/send-messages`
**Method**: GET
**Schedule**: Every 5 minutes (`*/5 * * * *`)
**Headers**: `Authorization: Bearer YOUR_CRON_SECRET` (optional but recommended)

### Securing the Cron Endpoint

To prevent unauthorized access to the cron endpoint, set a secret:

```env
CRON_SECRET="your_random_secret_string_here"
```

Then configure your cron service to include this header:
```
Authorization: Bearer your_random_secret_string_here
```

## Message Templates

### SMS Templates

SMS messages are kept concise (under 160 characters when possible):

- **Welcome**: "Hi [Name]! Thanks for visiting [Address] today. Here's the full property info: [Link] - [Agent]"
- **1h Follow-up**: "Hi [Name], just checking in! Any questions about [Address]? I'm here to help. - [Agent]"
- **24h Follow-up**: "[Name], still thinking about [Address]? Happy to schedule another showing or answer questions. - [Agent]"
- **Similar Properties**: "Hi [Name]! Found some great homes similar to [Address]. Want to see them? Text back or call me! - [Agent]"
- **Market Update**: "[Name], here's your local market update! Inventory is moving fast. Let's discuss your home search. - [Agent]"

### Email Templates

Professional, branded email templates are located in the `/emails` directory:

- `WelcomeEmail.tsx` - Includes property photos and full details
- `FollowUpEmail.tsx` - Used for 1h and 24h follow-ups
- `SimilarPropertiesEmail.tsx` - Suggests similar properties
- `MarketUpdateEmail.tsx` - Provides market insights

All templates use React Email components for consistent rendering across email clients.

## Testing

### Test Welcome Messages

Create a test lead to trigger immediate welcome messages:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "your_event_id",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+11234567890",
    "preApproved": "yes",
    "hasAgent": false,
    "timeline": "0-30 days",
    "interestedIn": "buying"
  }'
```

### Test Cron Job

Manually trigger the cron job to process scheduled messages:

```bash
curl http://localhost:3000/api/cron/send-messages
```

Or with authentication:

```bash
curl http://localhost:3000/api/cron/send-messages \
  -H "Authorization: Bearer your_cron_secret"
```

### Check Scheduled Messages

Query the database to see scheduled messages:

```bash
npx prisma studio
```

Navigate to the `ScheduledMessage` table to see all pending, sent, and failed messages.

## Monitoring

### View Logs

Check your application logs to monitor message sending:

- Successful sends are logged with message IDs
- Failed sends are logged with error details
- Cron job runs are logged with processing statistics

### Failed Messages

Messages that fail to send are marked with `status: 'failed'` and include an error message. You can:

1. View failed messages in Prisma Studio
2. Manually retry by updating the status back to `pending` and adjusting the `sendAt` time
3. Check Twilio/Resend dashboards for delivery issues

## Cost Considerations

### Twilio SMS

- Cost per SMS varies by country (~$0.0075 per SMS in the US)
- Each lead generates 5 SMS messages
- 100 leads = 500 SMS = ~$3.75

### Resend Email

- Free tier: 100 emails/day, 3,000 emails/month
- Each lead generates 5 emails
- 100 leads = 500 emails (within free tier if spread over time)

## Customization

### Modify Message Schedule

Edit `/lib/messaging.ts` in the `scheduleFollowUpSequence` function to change timing:

```typescript
// Current: 1 hour later
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

// Change to 30 minutes:
const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
```

### Customize Message Content

- **SMS**: Edit message templates in `/lib/messaging.ts` in the `generateSMSContent` function
- **Email**: Edit React components in `/emails/` directory

### Add New Message Types

1. Add new template type to `MessageTemplateType` in `/lib/messaging.ts`
2. Create new email template in `/emails/` directory
3. Add template rendering logic in `/lib/resend.ts`
4. Schedule the new message in `scheduleFollowUpSequence`

## Troubleshooting

### Messages Not Sending

1. Check environment variables are set correctly
2. Verify Twilio/Resend credentials are valid
3. Check application logs for errors
4. Ensure cron job is running (check Vercel dashboard or external cron service)

### Email Not Delivered

1. Verify domain is configured in Resend
2. Check spam folder
3. Review Resend dashboard for delivery status
4. Ensure `EMAIL_FROM` uses verified domain

### SMS Not Delivered

1. Verify phone numbers are in E.164 format (+1234567890)
2. Check Twilio console for message status
3. Ensure phone number has SMS capabilities
4. Check recipient hasn't opted out

## Support

For issues with:
- **Twilio**: [Twilio Support](https://support.twilio.com)
- **Resend**: [Resend Support](https://resend.com/support)
- **This application**: Create an issue in the repository
