import { useState } from 'react';
import { BroadcastModal } from './BroadcastModal';
import QRCode from 'qrcode';
import { generateQRCodeWithLabel } from '@/lib/qr-code';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  score: string;
  timeline: string;
  preApproved: string;
  hasAgent: boolean;
  interestedIn: string;
  createdAt: string;
}

interface ActionButtonsProps {
  event: {
    id: string;
    shortCode: string;
    propertyAddress: string;
  };
  leads: Lead[];
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function ActionButtons({ event, leads, showToast }: ActionButtonsProps) {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const signInUrl = `${baseUrl}/event/${event.shortCode}`;

  const handleExportCSV = () => {
    try {
      // Create CSV header
      const headers = [
        'Name',
        'Email',
        'Phone',
        'Lead Score',
        'Timeline',
        'Pre-Approved',
        'Has Agent',
        'Interested In',
        'Signed In At',
      ];

      // Create CSV rows
      const rows = leads.map((lead) => [
        `${lead.firstName} ${lead.lastName}`,
        lead.email,
        lead.phone,
        lead.score,
        lead.timeline,
        lead.preApproved,
        lead.hasAgent ? 'Yes' : 'No',
        lead.interestedIn,
        new Date(lead.createdAt).toLocaleString(),
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `leads-${event.shortCode}-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('CSV exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export CSV', 'error');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(signInUrl);
      showToast('Sign-in link copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleDownloadQR = async () => {
    try {
      // Generate QR code with property address label
      const qrDataUrl = await generateQRCodeWithLabel(
        signInUrl,
        event.propertyAddress,
        1000
      );

      // Create download link
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-code-${event.shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('QR code downloaded!', 'success');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      showToast('Failed to download QR code', 'error');
    }
  };

  const handlePrintSignInSheet = async () => {
    try {
      // Fetch PDF from API
      const response = await fetch(`/api/events/${event.id}/pdf`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sign-in-sheet-${event.shortCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('Sign-in sheet downloaded!', 'success');
    } catch (error) {
      console.error('Error downloading sign-in sheet:', error);
      showToast('Failed to download sign-in sheet', 'error');
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3 justify-end">
        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export to CSV
        </button>

        <button
          onClick={() => setShowBroadcastModal(true)}
          disabled={leads.length === 0}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          Send Broadcast
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy Sign-In Link
        </button>

        <button
          onClick={handleDownloadQR}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
          Download QR Code
        </button>

        <button
          onClick={handlePrintSignInSheet}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Sign-In Sheet
        </button>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          eventId={event.id}
          leadCount={leads.length}
          onClose={() => setShowBroadcastModal(false)}
          showToast={showToast}
        />
      )}
    </>
  );
}
