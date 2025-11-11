import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface EmptyStateProps {
  status: 'upcoming' | 'active' | 'completed';
  shortCode: string;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function EmptyState({ status, shortCode, showToast }: EmptyStateProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const signInUrl = `${baseUrl}/event/${shortCode}`;

  useEffect(() => {
    // Generate QR code
    QRCode.toDataURL(signInUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [signInUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(signInUrl);
      showToast('Sign-in link copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No sign-ins yet
        </h3>
        <p className="text-gray-600 mb-8">
          {status === 'upcoming'
            ? 'Share the QR code or sign-in link below to start collecting leads for your open house.'
            : 'Share the QR code or sign-in link below to start collecting leads.'}
        </p>

        {/* QR Code */}
        {qrCodeUrl && (
          <div className="mb-8">
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Scan this QR code to access the sign-in page
            </p>
          </div>
        )}

        {/* Sign-in URL */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-4">
            <input
              type="text"
              value={signInUrl}
              readOnly
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-600"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
          <h4 className="font-semibold text-blue-900 mb-3">Tips to get started:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Print the QR code and display it prominently at your open house</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Share the sign-in link via text or email to interested visitors</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use a tablet or iPad to help visitors sign in easily</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Leads will automatically receive welcome messages after signing in</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
