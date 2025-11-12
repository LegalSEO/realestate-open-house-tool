'use client';

import { WifiOff, Wifi } from 'lucide-react';

interface OfflineIndicatorProps {
  isOffline: boolean;
  pendingCount: number;
}

export function OfflineIndicator({ isOffline, pendingCount }: OfflineIndicatorProps) {
  if (!isOffline && pendingCount === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 px-4 py-3 text-center text-white ${
        isOffline ? 'bg-red-600' : 'bg-green-600'
      } transition-all`}
    >
      <div className="flex items-center justify-center gap-2">
        {isOffline ? (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">
              You're offline
              {pendingCount > 0 && ` • ${pendingCount} pending sign-in${pendingCount > 1 ? 's' : ''}`}
            </span>
          </>
        ) : (
          <>
            <Wifi className="w-5 h-5" />
            <span className="font-medium">
              Back online • Syncing {pendingCount} sign-in{pendingCount > 1 ? 's' : ''}...
            </span>
          </>
        )}
      </div>
    </div>
  );
}
