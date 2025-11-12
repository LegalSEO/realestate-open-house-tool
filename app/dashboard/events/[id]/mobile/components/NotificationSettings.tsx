'use client';

import { Bell, Volume2, Vibrate } from 'lucide-react';

interface NotificationSettingsProps {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onSoundToggle: () => void;
  onVibrationToggle: () => void;
}

export function NotificationSettings({
  soundEnabled,
  vibrationEnabled,
  onSoundToggle,
  onVibrationToggle,
}: NotificationSettingsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-900">Alert Settings</h3>
      </div>

      <div className="space-y-3">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Sound</p>
              <p className="text-xs text-gray-500">Play sound on new sign-in</p>
            </div>
          </div>
          <button
            onClick={onSoundToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Vibration Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vibrate className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Vibration</p>
              <p className="text-xs text-gray-500">Vibrate on new sign-in</p>
            </div>
          </div>
          <button
            onClick={onVibrationToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              vibrationEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
