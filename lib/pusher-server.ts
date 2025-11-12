import Pusher from 'pusher';

let pusherServer: Pusher | null = null;

export function getPusherServer(): Pusher | null {
  if (!pusherServer) {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1';

    if (!appId || !key || !secret) {
      console.warn('Pusher server credentials not configured. Real-time features will be disabled.');
      return null;
    }

    pusherServer = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }

  return pusherServer;
}

export async function triggerNewLead(eventId: string, lead: any): Promise<void> {
  const pusher = getPusherServer();
  if (!pusher) {
    console.warn('Pusher not configured, skipping real-time notification');
    return;
  }

  try {
    await pusher.trigger(`event-${eventId}`, 'new-lead', {
      lead,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to trigger Pusher event:', error);
  }
}

export async function triggerLeadUpdate(eventId: string, lead: any): Promise<void> {
  const pusher = getPusherServer();
  if (!pusher) {
    console.warn('Pusher not configured, skipping real-time notification');
    return;
  }

  try {
    await pusher.trigger(`event-${eventId}`, 'lead-updated', {
      lead,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to trigger Pusher event:', error);
  }
}
