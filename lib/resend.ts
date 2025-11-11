// MOCKED: Resend integration disabled for development
// import { Resend } from 'resend';
import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/WelcomeEmail';
import FollowUpEmail from '@/emails/FollowUpEmail';
import SimilarPropertiesEmail from '@/emails/SimilarPropertiesEmail';
import MarketUpdateEmail from '@/emails/MarketUpdateEmail';

// Initialize Resend client (MOCKED)
const fromEmail = process.env.EMAIL_FROM || 'noreply@example.com';

export type EmailTemplateType = 'welcome' | 'follow-up-1h' | 'follow-up-24h' | 'similar-properties' | 'market-update';

interface BaseEmailData {
  leadName: string;
  agentName: string;
  agentPhoto: string;
  agentBrokerage: string;
  agentPhone: string;
  agentEmail: string;
  propertyAddress: string;
}

interface WelcomeEmailData extends BaseEmailData {
  propertyPhotos: string[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyLink: string;
}

interface FollowUpEmailData extends BaseEmailData {
  propertyLink: string;
  followUpNumber: number;
}

interface SimilarPropertiesEmailData extends BaseEmailData {
  // Can be extended with actual similar properties data
}

interface MarketUpdateEmailData extends BaseEmailData {
  // Can be extended with market statistics
}

/**
 * Render email template based on type and data
 */
function renderEmailTemplate(
  templateType: EmailTemplateType,
  data: WelcomeEmailData | FollowUpEmailData | SimilarPropertiesEmailData | MarketUpdateEmailData
): { subject: string; html: string } {
  let subject: string;
  let html: string;

  switch (templateType) {
    case 'welcome':
      subject = `Thank you for visiting ${data.propertyAddress}!`;
      html = render(WelcomeEmail(data as WelcomeEmailData));
      break;

    case 'follow-up-1h':
      subject = `Quick follow-up about ${data.propertyAddress}`;
      html = render(FollowUpEmail({ ...(data as FollowUpEmailData), followUpNumber: 1 }));
      break;

    case 'follow-up-24h':
      subject = `Still thinking about ${data.propertyAddress}?`;
      html = render(FollowUpEmail({ ...(data as FollowUpEmailData), followUpNumber: 2 }));
      break;

    case 'similar-properties':
      subject = 'Similar properties you might love';
      html = render(SimilarPropertiesEmail(data as SimilarPropertiesEmailData));
      break;

    case 'market-update':
      subject = 'Your local market update and insights';
      html = render(MarketUpdateEmail(data as MarketUpdateEmailData));
      break;

    default:
      throw new Error(`Unknown email template type: ${templateType}`);
  }

  return { subject, html };
}

/**
 * Send an email via Resend (MOCKED - logs to console only)
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML content
 * @returns Mock Email ID
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<string> {
  // Mock email ID for development
  const mockEmailId = `email_${Math.random().toString(36).substring(2, 15)}`;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 MOCK EMAIL SENT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`From: ${fromEmail}`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`HTML Length: ${html.length} characters`);
  console.log(`Email ID: ${mockEmailId}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return mockEmailId;
}

/**
 * Send a templated email
 * @param to - Recipient email address
 * @param templateType - Type of email template to use
 * @param data - Data to populate the template
 * @returns Email ID if successful
 */
export async function sendTemplatedEmail(
  to: string,
  templateType: EmailTemplateType,
  data: WelcomeEmailData | FollowUpEmailData | SimilarPropertiesEmailData | MarketUpdateEmailData
): Promise<{ emailId: string; subject: string }> {
  const { subject, html } = renderEmailTemplate(templateType, data);
  const emailId = await sendEmail(to, subject, html);
  return { emailId, subject };
}

/**
 * Validate email address format
 * @param email - Email address to validate
 * @returns true if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
