import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.');
  }

  if (!twilioClient) {
    twilioClient = twilio(accountSid, authToken);
  }

  return twilioClient;
}

/**
 * Send an SMS message via Twilio
 * @param to - Recipient phone number (E.164 format recommended, e.g., +1234567890)
 * @param message - Message content (keep under 160 characters for single segment)
 * @returns Message SID if successful
 */
export async function sendSMS(to: string, message: string): Promise<string> {
  try {
    const client = getTwilioClient();

    // Ensure phone number starts with +
    const formattedTo = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo,
    });

    console.log(`SMS sent successfully to ${formattedTo}. SID: ${result.sid}`);
    return result.sid;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
}

/**
 * Validate a phone number format
 * @param phone - Phone number to validate
 * @returns Formatted phone number in E.164 format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it's a 10-digit US number, add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If it already has country code, just add +
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // If it already starts with +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }

  // Otherwise, assume it's a US number and add +1
  return `+1${digits}`;
}
