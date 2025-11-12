'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getPusherClient } from '@/lib/pusher-client';
import {
  cacheEventData,
  getCachedEvent,
  syncPendingLeads,
  getPendingLeads
} from '@/lib/offline-storage';
import { SwipeableLeadCard } from './components/SwipeableLeadCard';
import { QuickNoteModal } from './components/QuickNoteModal';
import { ManualCheckIn } from './components/ManualCheckIn';
import { LiveMode } from './components/LiveMode';
import { SharePanel } from './components/SharePanel';
import { NotificationSettings } from './components/NotificationSettings';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Toast } from '../../components/Toast';
import {
  UserPlus,
  Tv,
  Filter,
  ArrowLeft,
  Flame,
  ThermometerSun,
  Snowflake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

export default function MobileDashboardPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<OpenHouseEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'HOT' | 'WARM' | 'COLD'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showManualCheckIn, setShowManualCheckIn] = useState(false);
  const [showLiveMode, setShowLiveMode] = useState(false);

  // Notification settings
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('soundEnabled') !== 'false';
    }
    return true;
  });
  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vibrationEnabled') !== 'false';
    }
    return true;
  });

  // Offline state
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Audio for notifications
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSaK1vjInTcJFV236+iwWRgMRp7h8r5zIwYoitj3yZk8CRZetvDqrmIfC0Of4PO7dCQGKorY98maPAkXYLfx7K9jHwtCo+D';
    }
  }, []);

  // Fetch event data
  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        // Try to load from cache if offline
        const cached = await getCachedEvent(eventId);
        if (cached) {
          setEvent(cached);
          setIsOffline(true);
          return;
        }
        throw new Error('Failed to fetch event');
      }
      const data = await response.json();
      setEvent(data);

      // Cache the data
      await cacheEventData(eventId, data);

      setIsOffline(false);
    } catch (err) {
      // Try cache as fallback
      const cached = await getCachedEvent(eventId);
      if (cached) {
        setEvent(cached);
        setIsOffline(true);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      }
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Check pending leads count
  const checkPendingLeads = useCallback(async () => {
    const pending = await getPendingLeads();
    setPendingCount(pending.length);
  }, []);

  // Sync pending leads when online
  useEffect(() => {
    const syncWhenOnline = async () => {
      if (!isOffline && pendingCount > 0) {
        const result = await syncPendingLeads();
        if (result.success > 0) {
          showToast(`Synced ${result.success} sign-in${result.success > 1 ? 's' : ''}!`, 'success');
          await fetchEvent();
          await checkPendingLeads();
        }
      }
    };

    syncWhenOnline();
  }, [isOffline, pendingCount, fetchEvent, checkPendingLeads]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial fetch and check pending
  useEffect(() => {
    fetchEvent();
    checkPendingLeads();
  }, [fetchEvent, checkPendingLeads]);

  // Set up Pusher real-time updates
  useEffect(() => {
    if (!event) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`event-${eventId}`);

    channel.bind('new-lead', (data: { lead: Lead }) => {
      setEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          leads: [data.lead, ...prev.leads],
        };
      });

      // Play notification sound
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch((e) => console.error('Audio play failed:', e));
      }

      // Vibrate
      if (vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      // Show toast
      showToast(
        `${data.lead.firstName} ${data.lead.lastName} just signed in!`,
        'success'
      );
    });

    channel.bind('lead-updated', (data: { lead: Lead }) => {
      setEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          leads: prev.leads.map((l) => (l.id === data.lead.id ? data.lead : l)),
        };
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`event-${eventId}`);
    };
  }, [eventId, event, soundEnabled, vibrationEnabled]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (leadId: string, newStatus: 'HOT' | 'WARM' | 'COLD') => {
    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update local state
      setEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === leadId ? { ...l, score: newStatus } : l
          ),
        };
      });

      showToast(`Marked as ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveNote = async (leadId: string, note: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) throw new Error('Failed to save note');

      const { lead } = await response.json();

      // Update local state
      setEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          leads: prev.leads.map((l) => (l.id === leadId ? lead : l)),
        };
      });

      showToast('Note saved!', 'success');
    } catch (error) {
      console.error('Error saving note:', error);
      showToast('Failed to save note', 'error');
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', String(newValue));
  };

  const toggleVibration = () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    localStorage.setItem('vibrationEnabled', String(newValue));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">{error || 'The event you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  // Filter leads
  const filteredLeads = event.leads.filter((lead) => {
    if (filter === 'all') return true;
    return lead.score === filter;
  });

  const sortedLeads = [...filteredLeads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const stats = {
    total: event.leads.length,
    hot: event.leads.filter((l) => l.score === 'HOT').length,
    warm: event.leads.filter((l) => l.score === 'WARM').length,
    cold: event.leads.filter((l) => l.score === 'COLD').length,
  };

  return (
    <>
      {/* Offline Indicator */}
      <OfflineIndicator isOffline={isOffline} pendingCount={pendingCount} />

      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/dashboard/events/${eventId}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Desktop View</span>
            </Link>
            <Button
              onClick={() => setShowLiveMode(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <Tv className="w-4 h-4" />
              <span>Live Mode</span>
            </Button>
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {event.propertyAddress}
            </h1>
            <p className="text-sm text-gray-600">
              {new Date(event.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`bg-white rounded-xl shadow-md p-4 transition-all ${
                filter === 'all' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600 mt-1">Total</div>
            </button>
            <button
              onClick={() => setFilter('HOT')}
              className={`bg-white rounded-xl shadow-md p-4 transition-all ${
                filter === 'HOT' ? 'ring-2 ring-red-500' : ''
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.hot}</div>
              <div className="text-xs text-gray-600 mt-1">Hot</div>
            </button>
            <button
              onClick={() => setFilter('WARM')}
              className={`bg-white rounded-xl shadow-md p-4 transition-all ${
                filter === 'WARM' ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <ThermometerSun className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.warm}</div>
              <div className="text-xs text-gray-600 mt-1">Warm</div>
            </button>
            <button
              onClick={() => setFilter('COLD')}
              className={`bg-white rounded-xl shadow-md p-4 transition-all ${
                filter === 'COLD' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Snowflake className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.cold}</div>
              <div className="text-xs text-gray-600 mt-1">Cold</div>
            </button>
          </div>

          {/* Notification Settings */}
          <NotificationSettings
            soundEnabled={soundEnabled}
            vibrationEnabled={vibrationEnabled}
            onSoundToggle={toggleSound}
            onVibrationToggle={toggleVibration}
          />

          {/* Share Panel */}
          <div className="mt-6">
            <SharePanel
              shortCode={event.shortCode}
              propertyAddress={event.propertyAddress}
              showToast={showToast}
            />
          </div>

          {/* Manual Check-In Button */}
          <div className="mt-6">
            <Button
              onClick={() => setShowManualCheckIn(true)}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-6"
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-lg font-semibold">Manual Check-In</span>
            </Button>
          </div>

          {/* Filter Info */}
          {filter !== 'all' && (
            <div className="mt-6 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-900">
                  Showing {filter} leads only
                </span>
              </div>
              <button
                onClick={() => setFilter('all')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear
              </button>
            </div>
          )}

          {/* Leads List */}
          <div className="mt-6">
            {sortedLeads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">
                  {filter === 'all'
                    ? 'No sign-ins yet. Share the link to get started!'
                    : `No ${filter} leads yet.`}
                </p>
              </div>
            ) : (
              sortedLeads.map((lead) => (
                <SwipeableLeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={handleStatusChange}
                  onQuickNote={setSelectedLead}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedLead && (
        <QuickNoteModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={handleSaveNote}
        />
      )}

      {showManualCheckIn && (
        <ManualCheckIn
          eventId={eventId}
          onClose={() => setShowManualCheckIn(false)}
          onSuccess={fetchEvent}
          showToast={showToast}
        />
      )}

      {showLiveMode && (
        <LiveMode
          leads={event.leads}
          onClose={() => setShowLiveMode(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
