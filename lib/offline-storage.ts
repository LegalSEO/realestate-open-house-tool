import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  'pending-leads': {
    key: string;
    value: {
      id: string;
      eventId: string;
      data: any;
      timestamp: number;
    };
  };
  'event-cache': {
    key: string;
    value: {
      eventId: string;
      data: any;
      timestamp: number;
    };
  };
}

let db: IDBPDatabase<OfflineDB> | null = null;

async function getDB() {
  if (!db) {
    db = await openDB<OfflineDB>('open-house-offline', 1, {
      upgrade(db) {
        // Store for pending leads that need to be synced
        if (!db.objectStoreNames.contains('pending-leads')) {
          db.createObjectStore('pending-leads', { keyPath: 'id' });
        }
        // Store for cached event data
        if (!db.objectStoreNames.contains('event-cache')) {
          db.createObjectStore('event-cache', { keyPath: 'eventId' });
        }
      },
    });
  }
  return db;
}

export async function queuePendingLead(eventId: string, leadData: any): Promise<string> {
  const db = await getDB();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await db.put('pending-leads', {
    id,
    eventId,
    data: leadData,
    timestamp: Date.now(),
  });

  return id;
}

export async function getPendingLeads(): Promise<any[]> {
  const db = await getDB();
  return db.getAll('pending-leads');
}

export async function removePendingLead(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('pending-leads', id);
}

export async function cacheEventData(eventId: string, eventData: any): Promise<void> {
  const db = await getDB();
  await db.put('event-cache', {
    eventId,
    data: eventData,
    timestamp: Date.now(),
  });
}

export async function getCachedEvent(eventId: string): Promise<any | null> {
  const db = await getDB();
  const cached = await db.get('event-cache', eventId);

  if (!cached) return null;

  // Cache expires after 1 hour
  const ONE_HOUR = 60 * 60 * 1000;
  if (Date.now() - cached.timestamp > ONE_HOUR) {
    await db.delete('event-cache', eventId);
    return null;
  }

  return cached.data;
}

export async function syncPendingLeads(): Promise<{ success: number; failed: number }> {
  const pendingLeads = await getPendingLeads();
  let success = 0;
  let failed = 0;

  for (const pending of pendingLeads) {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pending.data),
      });

      if (response.ok) {
        await removePendingLead(pending.id);
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('Failed to sync lead:', error);
      failed++;
    }
  }

  return { success, failed };
}
