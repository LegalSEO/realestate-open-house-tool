import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSMS, formatPhoneNumber } from '@/lib/twilio';
import { sendEmail } from '@/lib/resend';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await request.json();
    const { message, messageType } = body;

    if (!message || !messageType) {
      return NextResponse.json(
        { success: false, error: 'Message and messageType are required' },
        { status: 400 }
      );
    }

    // Get event and all leads
    const event = await prisma.openHouseEvent.findUnique({
      where: { id: eventId },
      include: {
        leads: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const results = {
      sms: { sent: 0, failed: 0 },
      email: { sent: 0, failed: 0 },
    };

    // Send messages to all leads
    for (const lead of event.leads) {
      // Send SMS
      if (messageType === 'sms' || messageType === 'both') {
        try {
          await sendSMS(formatPhoneNumber(lead.phone), message);
          results.sms.sent++;
        } catch (error) {
          console.error(`Failed to send SMS to ${lead.phone}:`, error);
          results.sms.failed++;
        }
      }

      // Send Email
      if (messageType === 'email' || messageType === 'both') {
        try {
          const subject = `Update about ${event.propertyAddress}`;
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hi ${lead.firstName},</h2>
              <p>${message}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                ${event.agentName}<br>
                ${event.agentBrokerage}<br>
                ${event.agentPhone}<br>
                ${event.agentEmail}
              </p>
            </div>
          `;
          await sendEmail(lead.email, subject, html);
          results.email.sent++;
        } catch (error) {
          console.error(`Failed to send email to ${lead.email}:`, error);
          results.email.failed++;
        }
      }
    }

    console.log('Broadcast results:', results);

    return NextResponse.json({
      success: true,
      results,
      message: 'Broadcast sent successfully',
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send broadcast' },
      { status: 500 }
    );
  }
}
