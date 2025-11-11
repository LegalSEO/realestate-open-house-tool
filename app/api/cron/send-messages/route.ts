import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processScheduledMessage } from '@/lib/messaging';

/**
 * Cron job endpoint to process scheduled messages
 * This should be triggered every 5 minutes by a cron service like Vercel Cron or cron-job.org
 *
 * Example cron expression (every 5 minutes): * /5 * * * *
 *
 * Security: In production, you should protect this endpoint with:
 * 1. Vercel Cron Secret (for Vercel deployments)
 * 2. API key authentication
 * 3. IP whitelist
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    console.log(`[Cron] Processing scheduled messages at ${now.toISOString()}`);

    // Find all pending messages that should be sent now
    const messagesToSend = await prisma.scheduledMessage.findMany({
      where: {
        status: 'pending',
        sendAt: {
          lte: now,
        },
      },
      take: 50, // Process up to 50 messages per run to avoid timeout
      orderBy: {
        sendAt: 'asc',
      },
    });

    console.log(`[Cron] Found ${messagesToSend.length} messages to send`);

    if (messagesToSend.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No messages to send',
        processed: 0,
      });
    }

    // Process each message
    const results = await Promise.allSettled(
      messagesToSend.map((message) => processScheduledMessage(message.id))
    );

    // Count successes and failures
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`[Cron] Processed ${messagesToSend.length} messages: ${successful} successful, ${failed} failed`);

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `[Cron] Failed to process message ${messagesToSend[index].id}:`,
          result.reason
        );
      }
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${messagesToSend.length} messages`,
      processed: messagesToSend.length,
      successful,
      failed,
    });
  } catch (error) {
    console.error('[Cron] Error processing scheduled messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process scheduled messages',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for manual triggering (useful for testing)
 */
export async function POST(request: NextRequest) {
  // Reuse the same logic as GET
  return GET(request);
}
