import PusherClient from 'pusher-js';

// Singleton Pusher client instance
let pusherClient: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherClient) {
    const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1';

    if (!appKey) {
      console.warn('Pusher app key not configured. Real-time features will be disabled.');
      // Return a mock pusher client for development
      return {
        subscribe: () => ({
          bind: () => {},
          unbind: () => {},
        }),
        unsubscribe: () => {},
        disconnect: () => {},
      } as unknown as PusherClient;
    }

    pusherClient = new PusherClient(appKey, {
      cluster,
      forceTLS: true,
    });
  }

  return pusherClient;
}

export function disconnectPusher() {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
}
