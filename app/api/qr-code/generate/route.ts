import { NextRequest, NextResponse } from 'next/server';
import { generateQRCodeBuffer } from '@/lib/qr-code';

/**
 * API endpoint to generate QR codes
 * POST /api/qr-code/generate
 *
 * Body: { url: string, width?: number }
 *
 * Returns the QR code as a PNG image or base64 data URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, width = 1000 } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Generate QR code buffer
    const qrBuffer = await generateQRCodeBuffer(url, width);

    // Convert buffer to base64
    const base64 = qrBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // In production with Vercel Blob:
    // 1. Install @vercel/blob package
    // 2. Upload to Vercel Blob:
    //    const { url: blobUrl } = await put(`qr-codes/${shortCode}.png`, qrBuffer, {
    //      access: 'public',
    //      contentType: 'image/png',
    //    });
    // 3. Return blobUrl instead of dataUrl

    // For now, return the data URL
    return NextResponse.json({
      success: true,
      dataUrl,
      // In production, also return:
      // storageUrl: blobUrl, // URL to stored image
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

/**
 * Example with Vercel Blob Storage (for production):
 *
 * 1. Install package:
 *    npm install @vercel/blob
 *
 * 2. Set environment variable:
 *    BLOB_READ_WRITE_TOKEN=your_token_here
 *
 * 3. Use this code:
 *    import { put } from '@vercel/blob';
 *
 *    const { url: blobUrl } = await put(
 *      `qr-codes/${shortCode}.png`,
 *      qrBuffer,
 *      {
 *        access: 'public',
 *        contentType: 'image/png',
 *      }
 *    );
 *
 * 4. Save blobUrl to database:
 *    await prisma.openHouseEvent.update({
 *      where: { id: eventId },
 *      data: { qrCodeUrl: blobUrl },
 *    });
 */
