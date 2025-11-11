import { prisma } from '@/lib/prisma';
import { sendSMS, formatPhoneNumber } from '@/lib/twilio';
import { sendTemplatedEmail, EmailTemplateType } from '@/lib/resend';

export type MessageTemplateType = 'welcome' | 'follow-up-1h' | 'follow-up-24h' | 'similar-properties' | 'market-update';
export type MessageType = 'sms' | 'email';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  openHouseEventId: string;
}

interface OpenHouseEvent {
  id: string;
  shortCode: string;
  propertyAddress: string;
  propertyPhotos: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  agentName: string;
  agentPhoto: string;
  agentBrokerage: string;
  agentEmail: string;
  agentPhone: string;
}

/**
 * Generate SMS message content based on template type
 */
function generateSMSContent(
  templateType: MessageTemplateType,
  lead: Lead,
  event: OpenHouseEvent
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const propertyLink = `${baseUrl}/${event.shortCode}`;
  const leadName = lead.firstName;
  const agentName = event.agentName;
  const address = event.propertyAddress;

  switch (templateType) {
    case 'welcome':
      return `Hi ${leadName}! Thanks for visiting ${address} today. Here's the full property info: ${propertyLink} - ${agentName}`;

    case 'follow-up-1h':
      return `Hi ${leadName}, just checking in! Any questions about ${address}? I'm here to help. - ${agentName}`;

    case 'follow-up-24h':
      return `${leadName}, still thinking about ${address}? Happy to schedule another showing or answer questions. - ${agentName}`;

    case 'similar-properties':
      return `Hi ${leadName}! Found some great homes similar to ${address}. Want to see them? Text back or call me! - ${agentName}`;

    case 'market-update':
      return `${leadName}, here's your local market update! Inventory is moving fast. Let's discuss your home search. - ${agentName}`;

    default:
      throw new Error(`Unknown SMS template type: ${templateType}`);
  }
}

/**
 * Schedule a single message (SMS or Email)
 */
export async function scheduleMessage(
  leadId: string,
  openHouseEventId: string,
  messageType: MessageType,
  templateType: MessageTemplateType,
  sendAt: Date,
  recipientPhone?: string,
  recipientEmail?: string
) {
  // Get lead and event data to generate content
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  const event = await prisma.openHouseEvent.findUnique({
    where: { id: openHouseEventId },
  });

  if (!lead || !event) {
    throw new Error('Lead or Event not found');
  }

  let content: string;
  let subject: string | null = null;

  if (messageType === 'sms') {
    content = generateSMSContent(templateType, lead, event);
  } else {
    // For email, we'll store a placeholder and generate actual content when sending
    // This allows for fresh data (like property photos) at send time
    subject = getEmailSubject(templateType, event.propertyAddress);
    content = `Email template: ${templateType}`;
  }

  // Create scheduled message in database
  const scheduledMessage = await prisma.scheduledMessage.create({
    data: {
      leadId,
      openHouseEventId,
      messageType,
      templateType,
      subject,
      content,
      recipientPhone: recipientPhone || null,
      recipientEmail: recipientEmail || null,
      sendAt,
      status: 'pending',
    },
  });

  console.log(`Scheduled ${messageType} message for ${sendAt.toISOString()}`);
  return scheduledMessage;
}

/**
 * Get email subject based on template type
 */
function getEmailSubject(templateType: MessageTemplateType, propertyAddress: string): string {
  switch (templateType) {
    case 'welcome':
      return `Thank you for visiting ${propertyAddress}!`;
    case 'follow-up-1h':
      return `Quick follow-up about ${propertyAddress}`;
    case 'follow-up-24h':
      return `Still thinking about ${propertyAddress}?`;
    case 'similar-properties':
      return 'Similar properties you might love';
    case 'market-update':
      return 'Your local market update and insights';
    default:
      return 'Message from your real estate agent';
  }
}

/**
 * Schedule all follow-up messages for a new lead
 */
export async function scheduleFollowUpSequence(leadId: string, openHouseEventId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    throw new Error('Lead not found');
  }

  const now = new Date();

  // Schedule 1 hour follow-up
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'sms',
    'follow-up-1h',
    oneHourLater,
    lead.phone
  );
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'email',
    'follow-up-1h',
    oneHourLater,
    undefined,
    lead.email
  );

  // Schedule 24 hour follow-up
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'sms',
    'follow-up-24h',
    oneDayLater,
    lead.phone
  );
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'email',
    'follow-up-24h',
    oneDayLater,
    undefined,
    lead.email
  );

  // Schedule 3 day similar properties
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'sms',
    'similar-properties',
    threeDaysLater,
    lead.phone
  );
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'email',
    'similar-properties',
    threeDaysLater,
    undefined,
    lead.email
  );

  // Schedule 7 day market update
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'sms',
    'market-update',
    sevenDaysLater,
    lead.phone
  );
  await scheduleMessage(
    leadId,
    openHouseEventId,
    'email',
    'market-update',
    sevenDaysLater,
    undefined,
    lead.email
  );

  console.log(`Scheduled complete follow-up sequence for lead ${leadId}`);
}

/**
 * Send immediate welcome messages (SMS + Email)
 */
export async function sendWelcomeMessages(leadId: string, openHouseEventId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  const event = await prisma.openHouseEvent.findUnique({
    where: { id: openHouseEventId },
  });

  if (!lead || !event) {
    throw new Error('Lead or Event not found');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const propertyLink = `${baseUrl}/${event.shortCode}`;

  try {
    // Send welcome SMS
    const smsContent = generateSMSContent('welcome', lead, event);
    await sendSMS(formatPhoneNumber(lead.phone), smsContent);
    console.log(`Welcome SMS sent to ${lead.firstName} ${lead.lastName}`);

    // Send welcome email
    const propertyPhotos = JSON.parse(event.propertyPhotos);
    await sendTemplatedEmail(lead.email, 'welcome', {
      leadName: lead.firstName,
      agentName: event.agentName,
      agentPhoto: event.agentPhoto,
      agentBrokerage: event.agentBrokerage,
      agentPhone: event.agentPhone,
      agentEmail: event.agentEmail,
      propertyAddress: event.propertyAddress,
      propertyPhotos,
      price: event.price,
      bedrooms: event.bedrooms,
      bathrooms: event.bathrooms,
      squareFeet: event.squareFeet,
      propertyLink,
    });
    console.log(`Welcome email sent to ${lead.firstName} ${lead.lastName}`);
  } catch (error) {
    console.error('Error sending welcome messages:', error);
    // Don't throw - we don't want to fail lead creation if messaging fails
  }
}

/**
 * Process a scheduled message (called by cron job)
 */
export async function processScheduledMessage(messageId: string) {
  const message = await prisma.scheduledMessage.findUnique({
    where: { id: messageId },
    include: {
      lead: true,
    },
  });

  if (!message) {
    throw new Error('Scheduled message not found');
  }

  const event = await prisma.openHouseEvent.findUnique({
    where: { id: message.openHouseEventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  try {
    if (message.messageType === 'sms') {
      // Send SMS
      if (!message.recipientPhone) {
        throw new Error('No recipient phone number');
      }
      await sendSMS(formatPhoneNumber(message.recipientPhone), message.content);
    } else {
      // Send Email
      if (!message.recipientEmail) {
        throw new Error('No recipient email address');
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const propertyLink = `${baseUrl}/${event.shortCode}`;
      const propertyPhotos = JSON.parse(event.propertyPhotos);

      const emailData = {
        leadName: message.lead.firstName,
        agentName: event.agentName,
        agentPhoto: event.agentPhoto,
        agentBrokerage: event.agentBrokerage,
        agentPhone: event.agentPhone,
        agentEmail: event.agentEmail,
        propertyAddress: event.propertyAddress,
        propertyLink,
        propertyPhotos,
        price: event.price,
        bedrooms: event.bedrooms,
        bathrooms: event.bathrooms,
        squareFeet: event.squareFeet,
        followUpNumber: message.templateType === 'follow-up-1h' ? 1 : 2,
      };

      await sendTemplatedEmail(
        message.recipientEmail,
        message.templateType as EmailTemplateType,
        emailData
      );
    }

    // Update message status to sent
    await prisma.scheduledMessage.update({
      where: { id: messageId },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });

    console.log(`Successfully sent scheduled message ${messageId}`);
  } catch (error) {
    // Update message status to failed
    await prisma.scheduledMessage.update({
      where: { id: messageId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    console.error(`Failed to send scheduled message ${messageId}:`, error);
    throw error;
  }
}
