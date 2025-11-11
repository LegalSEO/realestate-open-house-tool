import QRCode from 'qrcode';

/**
 * Generate a unique 6-character alphanumeric short code
 * Uses uppercase letters and numbers (excluding similar looking chars like 0, O, I, 1)
 */
export function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding 0, O, I, 1
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate QR code as a data URL (base64)
 * @param url - URL to encode in QR code
 * @param width - Width/height of QR code in pixels (default: 1000)
 * @returns Promise<string> - Data URL of QR code image
 */
export async function generateQRCode(url: string, width: number = 1000): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction for better scanning
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as a Buffer (for server-side storage)
 * @param url - URL to encode in QR code
 * @param width - Width/height of QR code in pixels (default: 1000)
 * @returns Promise<Buffer> - Buffer containing PNG image data
 */
export async function generateQRCodeBuffer(url: string, width: number = 1000): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(url, {
      width,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction for better scanning
    });
    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Generate QR code with property address label
 * @param url - URL to encode in QR code
 * @param propertyAddress - Address to display below QR code
 * @param width - Width of QR code in pixels (default: 1000)
 * @returns Promise<string> - Data URL of QR code image with label
 */
export async function generateQRCodeWithLabel(
  url: string,
  propertyAddress: string,
  width: number = 1000
): Promise<string> {
  try {
    // Generate QR code first
    const qrDataUrl = await generateQRCode(url, width);

    // Create canvas to add label
    if (typeof window === 'undefined') {
      // Server-side: just return QR code without label for now
      // In production, use node-canvas or similar
      return qrDataUrl;
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Set canvas size with extra space for label
        const padding = 40;
        const labelHeight = 60;
        canvas.width = width + padding * 2;
        canvas.height = width + padding * 2 + labelHeight;

        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code
        ctx.drawImage(img, padding, padding, width, width);

        // Add address label
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(propertyAddress, canvas.width / 2, width + padding + 40);

        // Convert to data URL
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('Failed to load QR code image'));
      img.src = qrDataUrl;
    });
  } catch (error) {
    console.error('Error generating QR code with label:', error);
    throw new Error('Failed to generate QR code with label');
  }
}
