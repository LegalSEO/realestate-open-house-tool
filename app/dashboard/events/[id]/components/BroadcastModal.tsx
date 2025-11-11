import { useState } from 'react';

interface BroadcastModalProps {
  eventId: string;
  leadCount: number;
  onClose: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function BroadcastModal({
  eventId,
  leadCount,
  onClose,
  showToast,
}: BroadcastModalProps) {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'both'>('both');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      showToast('Please enter a message', 'error');
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`/api/events/${eventId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          messageType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send broadcast');
      }

      showToast(
        `Broadcast ${messageType === 'both' ? 'messages' : messageType} sent to ${leadCount} leads!`,
        'success'
      );
      onClose();
    } catch (error) {
      showToast('Failed to send broadcast', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Send Broadcast Message
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            This message will be sent to <strong>{leadCount}</strong> lead
            {leadCount !== 1 ? 's' : ''}.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sms"
                  checked={messageType === 'sms'}
                  onChange={(e) => setMessageType(e.target.value as 'sms')}
                  className="mr-2"
                />
                <span className="text-sm">SMS Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={messageType === 'email'}
                  onChange={(e) => setMessageType(e.target.value as 'email')}
                  className="mr-2"
                />
                <span className="text-sm">Email Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="both"
                  checked={messageType === 'both'}
                  onChange={(e) => setMessageType(e.target.value as 'both')}
                  className="mr-2"
                />
                <span className="text-sm">Both SMS & Email</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                messageType === 'sms'
                  ? 'Enter your SMS message (keep it short and concise)...'
                  : messageType === 'email'
                  ? 'Enter your email message...'
                  : 'Enter your message (will be sent via both SMS and email)...'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            {messageType === 'sms' && (
              <p className="mt-1 text-sm text-gray-500">
                {message.length} / 160 characters
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim() || sending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
