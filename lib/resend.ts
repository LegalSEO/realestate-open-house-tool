import { Resend } from 'resend';
import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/WelcomeEmail';
import FollowUpEmail from '@/emails/FollowUpEmail';
import SimilarPropertiesEmail from '@/emails/SimilarPropertiesEmail';
import MarketUpdateEmail from '@/emails/MarketUpdateEmail';

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'noreply@example.com';

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendApiKey) {
    throw new Error('Resend API key not configured. Please set RESEND_API_KEY environment variable.');
  }

  if (!resendClient) {
    resendClient = new Resend(resendApiKey);
  }

  return resendClient;
}

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
 * Send an email via Resend
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML content
 * @returns Email ID if successful
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<string> {
  try {
    const client = getResendClient();

    const result = await client.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    console.log(`Email sent successfully to ${to}. ID: ${result.data?.id}`);
    return result.data?.id || 'unknown';
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
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
