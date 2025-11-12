'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Phone, Mail, MessageSquare, Flame, Snowflake, ThermometerSun } from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  score: 'HOT' | 'WARM' | 'COLD';
  timeline: string;
  preApproved: string;
  createdAt: string;
}

interface SwipeableLeadCardProps {
  lead: Lead;
  onStatusChange: (leadId: string, newStatus: 'HOT' | 'WARM' | 'COLD') => void;
  onQuickNote: (lead: Lead) => void;
}

export function SwipeableLeadCard({ lead, onStatusChange, onQuickNote }: SwipeableLeadCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const offset = eventData.deltaX;
      setSwipeOffset(offset);

      if (offset > 50) {
        setSwipeDirection('right');
      } else if (offset < -50) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection(null);
      }
    },
    onSwiped: (eventData) => {
      const offset = eventData.deltaX;

      if (offset > 100) {
        // Swipe right: Mark as HOT
        onStatusChange(lead.id, 'HOT');
      } else if (offset < -100) {
        // Swipe left: Mark as COLD
        onStatusChange(lead.id, 'COLD');
      } else if (Math.abs(offset) > 50 && Math.abs(offset) <= 100) {
        // Medium swipe: Mark as WARM
        onStatusChange(lead.id, 'WARM');
      }

      // Reset
      setSwipeOffset(0);
      setSwipeDirection(null);
    },
    trackMouse: true,
    trackTouch: true,
  });

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'HOT':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'WARM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'COLD':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'HOT':
        return <Flame className="w-4 h-4" />;
      case 'WARM':
        return <ThermometerSun className="w-4 h-4" />;
      case 'COLD':
        return <Snowflake className="w-4 h-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const cardStyle = {
    transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 20}deg)`,
    transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none',
  };

  const getSwipeIndicatorColor = () => {
    if (swipeDirection === 'right') {
      return 'bg-red-500';
    } else if (swipeDirection === 'left') {
      return 'bg-blue-500';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="relative mb-4">
      {/* Swipe Indicators */}
      {swipeDirection && (
        <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none z-0">
          {swipeDirection === 'right' && (
            <div className="bg-red-500 text-white rounded-full p-4">
              <Flame className="w-8 h-8" />
            </div>
          )}
          <div className="flex-1"></div>
          {swipeDirection === 'left' && (
            <div className="bg-blue-500 text-white rounded-full p-4">
              <Snowflake className="w-8 h-8" />
            </div>
          )}
        </div>
      )}

      {/* Card */}
      <div
        {...handlers}
        style={cardStyle}
        className={`bg-white rounded-lg shadow-md border-2 ${getScoreColor(lead.score)} p-4 relative z-10`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h3>
            <p className="text-sm text-gray-500">{formatTime(lead.createdAt)}</p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getScoreColor(lead.score)}`}>
            {getScoreIcon(lead.score)}
            <span className="text-xs font-semibold">{lead.score}</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Timeline:</span>
            <span>{lead.timeline}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Pre-approved:</span>
            <span className="capitalize">{lead.preApproved}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Call</span>
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">Email</span>
          </a>
          <button
            onClick={() => onQuickNote(lead)}
            className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Note</span>
          </button>
        </div>

        {/* Swipe Hint */}
        <div className="mt-3 text-center text-xs text-gray-400">
          ← Swipe to change status →
        </div>
      </div>
    </div>
  );
}
