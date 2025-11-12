import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { Smartphone } from 'lucide-react';

interface EventHeaderProps {
  event: {
    id: string;
    propertyAddress: string;
    eventDate: string;
  };
  status: 'upcoming' | 'active' | 'completed';
  eventDate: Date;
}

export function EventHeader({ event, status, eventDate }: EventHeaderProps) {
  const now = new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const statusConfig = {
    upcoming: {
      label: 'Upcoming',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
    },
    active: {
      label: 'Active Now',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
    },
    completed: {
      label: 'Completed',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {event.propertyAddress}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-lg text-gray-600">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' at '}
              {eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
            >
              {config.label}
            </span>
          </div>
          {status === 'upcoming' && daysUntil > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Event starts in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/events/${event.id}/mobile`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile View</span>
          </Link>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => alert('Edit functionality coming soon!')}
          >
            Edit Event
          </button>
        </div>
      </div>
    </div>
  );
}
