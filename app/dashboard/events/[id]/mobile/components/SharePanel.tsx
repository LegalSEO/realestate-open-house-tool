'use client';

import { useState } from 'react';
import { Share2, Copy, QrCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SharePanelProps {
  shortCode: string;
  propertyAddress: string;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export function SharePanel({ shortCode, propertyAddress, showToast }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const signInUrl = `${baseUrl}/event/${shortCode}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Open House Sign-In',
          text: `Join the open house at ${propertyAddress}`,
          url: signInUrl,
        });
        showToast('Shared successfully!', 'success');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          showToast('Failed to share', 'error');
        }
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(signInUrl);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  const handleShowQR = async () => {
    if (!qrCodeUrl) {
      try {
        const response = await fetch('/api/qr-code/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: signInUrl,
            width: 800,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setQrCodeUrl(data.dataUrl);
        }
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        showToast('Failed to generate QR code', 'error');
        return;
      }
    }
    setShowQR(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Share Sign-In Link</h3>

        {/* URL Display */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm font-mono text-gray-600 truncate">{signInUrl}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* Native Share */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          )}

          {/* Copy Link */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex items-center justify-center gap-2"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </Button>

          {/* Show QR */}
          <Button
            onClick={handleShowQR}
            variant="outline"
            className="flex items-center justify-center gap-2"
            size="sm"
          >
            <QrCode className="w-4 h-4" />
            <span>QR</span>
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && qrCodeUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">QR Code</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
              <img
                src={qrCodeUrl}
                alt="Sign-in QR Code"
                className="w-full h-auto"
              />
            </div>

            <p className="text-sm text-gray-600 text-center mb-4">
              Visitors can scan this to sign in
            </p>

            {/* Share QR Code (if supported) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <Button
                onClick={async () => {
                  try {
                    // Convert data URL to blob
                    const response = await fetch(qrCodeUrl);
                    const blob = await response.blob();
                    const file = new File([blob], 'qr-code.png', { type: 'image/png' });

                    await navigator.share({
                      files: [file],
                      title: 'Open House QR Code',
                      text: 'Scan to sign in',
                    });
                  } catch (error) {
                    console.error('Error sharing QR code:', error);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share QR Code
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
