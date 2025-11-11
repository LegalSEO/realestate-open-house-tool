interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  score: 'HOT' | 'WARM' | 'COLD';
  timeline: string;
  createdAt: string;
}

interface LeadCardProps {
  lead: Lead;
  onAddNote: () => void;
  onMarkConverted: () => void;
}

export function LeadCard({ lead, onAddNote, onMarkConverted }: LeadCardProps) {
  const scoreConfig = {
    HOT: { bg: 'bg-red-100', text: 'text-red-800', icon: '🔥' },
    WARM: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '⚡' },
    COLD: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '❄️' },
  };
  const config = scoreConfig[lead.score];

  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {lead.firstName} {lead.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(lead.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          <span className="mr-1">{config.icon}</span>
          {lead.score}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📞</span>
          <a
            href={`tel:${lead.phone}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {lead.phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📧</span>
          <a
            href={`mailto:${lead.email}`}
            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            {lead.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">⏰</span>
          <span className="text-sm text-gray-600">{lead.timeline}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAddNote}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Note
        </button>
        <button
          onClick={onMarkConverted}
          className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Mark Converted
        </button>
      </div>
    </div>
  );
}
