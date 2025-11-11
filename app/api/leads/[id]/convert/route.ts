import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;

    // For now, we'll just add a note indicating the lead was converted
    // In a full implementation, you might have a separate "converted" field
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const convertedNote = `[CONVERTED] Lead marked as converted on ${new Date().toLocaleString()}`;
    const updatedNotes = lead.notes
      ? `${lead.notes}\n\n${convertedNote}`
      : convertedNote;

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        notes: updatedNotes,
      },
    });

    console.log(`Lead ${leadId} marked as converted`);

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Error marking lead as converted:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark lead as converted' },
      { status: 500 }
    );
  }
}
