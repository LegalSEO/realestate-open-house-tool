import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToStream } from '@react-pdf/renderer';
import { SignInSheetPDF } from '@/components/SignInSheetPDF';
import { generateQRCode } from '@/lib/qr-code';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    // Fetch event data
    const event = await prisma.openHouseEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Generate QR code data URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                    request.headers.get('origin') ||
                    'http://localhost:3000';
    const signInUrl = `${baseUrl}/event/${event.shortCode}`;
    const qrCodeDataUrl = await generateQRCode(signInUrl, 1000);

    // Format event date
    const eventDate = new Date(event.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    // Generate PDF
    const pdfStream = await renderToStream(
      SignInSheetPDF({
        qrCodeDataUrl,
        signInUrl,
        propertyAddress: event.propertyAddress,
        agentName: event.agentName,
        agentPhone: event.agentPhone,
        agentEmail: event.agentEmail,
        agentBrokerage: event.agentBrokerage,
        eventDate,
      })
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const reader = pdfStream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sign-in-sheet-${event.shortCode}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
