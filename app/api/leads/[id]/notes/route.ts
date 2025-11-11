import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;
    const body = await request.json();
    const { note } = body;

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note is required' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const timestamp = new Date().toLocaleString();
    const newNote = `[${timestamp}] ${note}`;
    const updatedNotes = lead.notes
      ? `${lead.notes}\n\n${newNote}`
      : newNote;

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        notes: updatedNotes,
      },
    });

    console.log(`Note added to lead ${leadId}`);

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Error adding note to lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
