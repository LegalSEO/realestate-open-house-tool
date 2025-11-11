// MOCKED: Twilio integration disabled for development
// import twilio from 'twilio';

// Initialize Twilio client (MOCKED)
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

/**
 * Send an SMS message via Twilio (MOCKED - logs to console only)
 * @param to - Recipient phone number (E.164 format recommended, e.g., +1234567890)
 * @param message - Message content (keep under 160 characters for single segment)
 * @returns Mock Message SID
 */
export async function sendSMS(to: string, message: string): Promise<string> {
  // Ensure phone number starts with +
  const formattedTo = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;

  // Mock SID for development
  const mockSid = `SM${Math.random().toString(36).substring(2, 15)}`;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 MOCK SMS SENT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`From: ${fromNumber}`);
  console.log(`To: ${formattedTo}`);
  console.log(`Message: ${message}`);
  console.log(`SID: ${mockSid}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return mockSid;
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
