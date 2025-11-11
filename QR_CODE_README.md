# QR Code Generation and Sign-In Sheet Features

This document describes the QR code generation and printable sign-in sheet functionality for the Real Estate Open House Tool.

## Features Overview

### 1. QR Code Generation
- **Automatic Generation**: QR codes are generated on-demand for each open house event
- **High Resolution**: 1000x1000px PNG images, optimized for printing and scanning
- **Property Address Label**: QR codes include the property address below for easy identification
- **Scannable from Distance**: High error correction level ensures reliable scanning from 3 feet away

### 2. Download QR Code
- **Location**: Agent Event Dashboard (`/dashboard/events/[id]`)
- **Format**: PNG image with property address label
- **Filename**: `qr-code-{shortCode}.png`
- **Use Case**: Print and display at open house entrance

### 3. Print Sign-In Sheet
- **Location**: Agent Event Dashboard (`/dashboard/events/[id]`)
- **Format**: Professional PDF document
- **Filename**: `sign-in-sheet-{shortCode}.pdf`
- **Contents**:
  - Large QR code (350x350px)
  - "Scan to Sign In" header
  - Sign-in URL (for manual entry)
  - Property address
  - Open house date and time
  - Agent contact information
  - Professional layout ready to print

### 4. QR Code Display
- **Empty State**: Shows large QR code when no leads have signed in yet
- **Dashboard Header**: QR code prominently displayed for easy access
- **Mobile Optimized**: Responsive design for all screen sizes

## Usage Guide

### For Agents

#### Before the Open House
1. Navigate to your event dashboard: `/dashboard/events/[eventId]`
2. Click "Download QR Code" to save high-resolution PNG
3. Click "Print Sign-In Sheet" to generate printable PDF
4. Print the sign-in sheet and display at property entrance
5. Optional: Print additional QR codes for different rooms

#### During the Open House
1. Direct visitors to scan QR code with smartphone camera
2. Or share sign-in link via text/email: `{baseUrl}/event/{shortCode}`
3. Monitor real-time sign-ins on dashboard
4. View lead scores and contact information immediately

#### After the Open House
1. Export all leads to CSV
2. Send broadcast thank you messages
3. Follow up with hot leads first

### For Visitors

1. **Scan QR Code**: Use smartphone camera to scan QR code
2. **Fill Out Form**: Complete mobile-optimized sign-in form (30 seconds)
3. **View Property**: See photos, features, and property details
4. **Receive Welcome**: Automatically receive welcome message

## Technical Implementation

### QR Code Generation

#### Utility Functions (`lib/qr-code.ts`)

```typescript
// Generate basic QR code as data URL
const qrDataUrl = await generateQRCode(url, 1000);

// Generate QR code as Buffer (for server-side)
const qrBuffer = await generateQRCodeBuffer(url, 1000);

// Generate QR code with property address label
const qrDataUrl = await generateQRCodeWithLabel(url, propertyAddress, 1000);

// Generate unique short code (6 characters)
const shortCode = generateShortCode(); // Example: "AB3K7N"
```

#### API Endpoints

**Generate QR Code**
```
POST /api/qr-code/generate
Body: { url: string, width?: number }
Response: { success: boolean, dataUrl: string }
```

**Generate Sign-In Sheet PDF**
```
GET /api/events/[id]/pdf
Response: PDF file (application/pdf)
```

### PDF Sign-In Sheet Component

The PDF is generated using `@react-pdf/renderer`:

```typescript
import { SignInSheetPDF } from '@/components/SignInSheetPDF';
import { renderToStream } from '@react-pdf/renderer';

const pdfStream = await renderToStream(
  SignInSheetPDF({
    qrCodeDataUrl,
    signInUrl,
    propertyAddress,
    agentName,
    agentPhone,
    agentEmail,
    agentBrokerage,
    eventDate,
  })
);
```

### Database Schema

```prisma
model OpenHouseEvent {
  id                   String   @id @default(cuid())
  shortCode            String   @unique
  qrCodeUrl            String?  // URL to stored QR code image (optional)
  propertyAddress      String
  // ... other fields
}
```

## Configuration

### Environment Variables

```env
# Base URL for QR code generation (production)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Optional: Vercel Blob Storage (for storing QR codes)
BLOB_READ_WRITE_TOKEN=your_token_here
```

### QR Code Specifications

- **Size**: 1000x1000 pixels (high resolution)
- **Format**: PNG
- **Error Correction**: High (Level H - 30% recovery)
- **Margin**: 2 modules
- **Colors**: Black on white (#000000 on #FFFFFF)

### PDF Specifications

- **Page Size**: US Letter (8.5" x 11")
- **Orientation**: Portrait
- **Margins**: 40pt (approx 0.56 inches)
- **QR Code Size**: 350x350 pixels
- **Font**: System default (Helvetica)

## Deployment Considerations

### Vercel Blob Storage (Optional)

For production, you can store QR codes in Vercel Blob Storage:

1. **Install package**:
   ```bash
   npm install @vercel/blob
   ```

2. **Set environment variable**:
   ```env
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

3. **Update API endpoint** (`app/api/qr-code/generate/route.ts`):
   ```typescript
   import { put } from '@vercel/blob';

   const { url: blobUrl } = await put(
     `qr-codes/${shortCode}.png`,
     qrBuffer,
     {
       access: 'public',
       contentType: 'image/png',
     }
   );

   // Save to database
   await prisma.openHouseEvent.update({
     where: { id: eventId },
     data: { qrCodeUrl: blobUrl },
   });
   ```

### Alternative Storage Options

- **Cloudinary**: Use Cloudinary's upload API
- **AWS S3**: Use AWS SDK to upload to S3 bucket
- **Local Storage**: Store in `public/qr-codes/` directory (not recommended for production)

## Testing QR Codes

### Testing Checklist

- [ ] QR code scans correctly with iPhone Camera app
- [ ] QR code scans correctly with Android Camera app
- [ ] QR code is scannable from 3 feet away
- [ ] QR code is scannable in poor lighting
- [ ] QR code includes property address label
- [ ] PDF downloads correctly
- [ ] PDF prints without quality loss
- [ ] PDF shows all information correctly
- [ ] Sign-in page loads correctly from QR code scan
- [ ] Mobile form works on iOS and Android

### Testing Tools

- **QR Code Reader Apps**:
  - iOS: Built-in Camera app
  - Android: Built-in Camera app or Google Lens
  - Desktop: QR Code extensions for Chrome/Firefox

- **PDF Viewers**:
  - Adobe Acrobat Reader
  - Browser built-in PDF viewer
  - Preview (macOS)

## Troubleshooting

### QR Code Not Scanning

1. **Check lighting**: Ensure adequate lighting when scanning
2. **Check distance**: Scan from 1-3 feet away
3. **Check quality**: Ensure printed version is high quality (300 DPI)
4. **Check URL**: Verify the URL is correct and accessible

### PDF Generation Fails

1. **Check dependencies**: Ensure `@react-pdf/renderer` is installed
2. **Check image data**: Verify QR code data URL is valid
3. **Check memory**: Large PDFs may require more memory
4. **Check logs**: Review server logs for specific errors

### Download Button Not Working

1. **Check browser**: Ensure browser supports download attribute
2. **Check CORS**: Verify API endpoints are accessible
3. **Check network**: Ensure network connection is stable
4. **Check console**: Review browser console for errors

## Best Practices

### For Printing

1. **Use high quality printer**: 300 DPI or higher recommended
2. **Use white paper**: QR codes require good contrast
3. **Avoid glare**: Use matte finish paper or laminate
4. **Test before event**: Scan printed QR code to verify

### For Display

1. **Eye level placement**: Display at visitor eye level
2. **Good lighting**: Ensure adequate lighting near QR code
3. **Clear instructions**: Add "Scan to Sign In" text
4. **Multiple locations**: Place QR codes in multiple rooms

### For Sharing

1. **Text/Email**: Share sign-in URL for easy access
2. **Social Media**: Share QR code image on social platforms
3. **Print materials**: Include QR code on flyers and brochures
4. **Tablet/iPad**: Have tablet available for easy sign-in

## Future Enhancements

- [ ] Dynamic QR codes with tracking
- [ ] Custom QR code colors and branding
- [ ] Multiple PDF templates
- [ ] Batch QR code generation
- [ ] QR code analytics (scan count, location)
- [ ] Integration with email marketing
- [ ] Automated follow-up based on QR code scans

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Test with different devices
4. Contact support team

## References

- **QR Code Library**: [node-qrcode](https://github.com/soldair/node-qrcode)
- **PDF Library**: [@react-pdf/renderer](https://react-pdf.org/)
- **Vercel Blob**: [Vercel Blob Storage Docs](https://vercel.com/docs/storage/vercel-blob)
