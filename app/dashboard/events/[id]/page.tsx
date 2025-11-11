'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { EventHeader } from './components/EventHeader';
import { StatsCards } from './components/StatsCards';
import { LeadFeed } from './components/LeadFeed';
import { ActionButtons } from './components/ActionButtons';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  score: 'HOT' | 'WARM' | 'COLD';
  timeline: string;
  preApproved: string;
  hasAgent: boolean;
  interestedIn: string;
  notes: string | null;
  createdAt: string;
}

interface OpenHouseEvent {
  id: string;
  shortCode: string;
  propertyAddress: string;
  propertyPhotos: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  eventDate: string;
  isActive: boolean;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  leads: Lead[];
}

export default function EventDashboardPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<OpenHouseEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'HOT' | 'WARM' | 'COLD'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();

    // Set up real-time updates polling (will be replaced with Supabase subscriptions)
    const interval = setInterval(() => {
      fetchEvent();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [fetchEvent]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLeadUpdate = async () => {
    await fetchEvent();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">{error || 'The event you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  // Filter and sort leads
  const filteredLeads = event.leads.filter((lead) => {
    if (filter === 'all') return true;
    return lead.score === filter;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      default:
        return 0;
    }
  });

  const stats = {
    total: event.leads.length,
    hot: event.leads.filter((l) => l.score === 'HOT').length,
    warm: event.leads.filter((l) => l.score === 'WARM').length,
    cold: event.leads.filter((l) => l.score === 'COLD').length,
  };

  // Determine event status
  const eventDate = new Date(event.eventDate);
  const now = new Date();
  const isToday = eventDate.toDateString() === now.toDateString();
  const isPast = eventDate < now && !isToday;
  const isUpcoming = eventDate > now;

  let eventStatus: 'upcoming' | 'active' | 'completed';
  if (isUpcoming) {
    eventStatus = 'upcoming';
  } else if (isToday) {
    eventStatus = 'active';
  } else {
    eventStatus = 'completed';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <EventHeader
          event={event}
          status={eventStatus}
          eventDate={eventDate}
        />

        {/* Action Buttons */}
        <ActionButtons
          event={event}
          leads={event.leads}
          showToast={showToast}
        />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Lead Feed or Empty State */}
        {event.leads.length === 0 ? (
          <EmptyState
            status={eventStatus}
            shortCode={event.shortCode}
            showToast={showToast}
          />
        ) : (
          <LeadFeed
            leads={sortedLeads}
            filter={filter}
            sortBy={sortBy}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            onLeadUpdate={handleLeadUpdate}
            showToast={showToast}
          />
        )}
      </div>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
