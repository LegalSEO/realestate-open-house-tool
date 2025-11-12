import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { triggerLeadUpdate } from '@/lib/pusher-server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    if (!['HOT', 'WARM', 'COLD'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be HOT, WARM, or COLD' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: { score: status },
    });

    // Trigger real-time update via Pusher
    await triggerLeadUpdate(lead.openHouseEventId, lead);

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error('Failed to update lead status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead status' },
      { status: 500 }
    );
  }
}
