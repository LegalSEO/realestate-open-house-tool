'use client';

import { X, Users, Flame, ThermometerSun, Snowflake } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  score: 'HOT' | 'WARM' | 'COLD';
  createdAt: string;
}

interface LiveModeProps {
  leads: Lead[];
  onClose: () => void;
}

export function LiveMode({ leads, onClose }: LiveModeProps) {
  const recentLeads = leads.slice(0, 5);
  const hotCount = leads.filter((l) => l.score === 'HOT').length;
  const warmCount = leads.filter((l) => l.score === 'WARM').length;
  const coldCount = leads.filter((l) => l.score === 'COLD').length;

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'HOT':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'WARM':
        return <ThermometerSun className="w-5 h-5 text-yellow-500" />;
      case 'COLD':
        return <Snowflake className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 z-50 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 rounded-full p-2 z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Open House LIVE</h1>
          <p className="text-white/80">Real-time visitor tracking</p>
        </div>

        {/* Main Counter */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Users className="w-12 h-12" />
            <div className="text-8xl font-bold tabular-nums">{leads.length}</div>
          </div>
          <p className="text-center text-2xl font-medium">
            {leads.length === 1 ? 'Visitor' : 'Visitors'}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
          {/* HOT */}
          <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-4 border border-red-400/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-6 h-6" />
              <span className="text-3xl font-bold">{hotCount}</span>
            </div>
            <p className="text-center text-sm font-medium">HOT</p>
          </div>

          {/* WARM */}
          <div className="bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-4 border border-yellow-400/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThermometerSun className="w-6 h-6" />
              <span className="text-3xl font-bold">{warmCount}</span>
            </div>
            <p className="text-center text-sm font-medium">WARM</p>
          </div>

          {/* COLD */}
          <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-4 border border-blue-400/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Snowflake className="w-6 h-6" />
              <span className="text-3xl font-bold">{coldCount}</span>
            </div>
            <p className="text-center text-sm font-medium">COLD</p>
          </div>
        </div>

        {/* Recent Sign-Ins */}
        {recentLeads.length > 0 && (
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Recent Sign-Ins</h2>
            <div className="space-y-3">
              {recentLeads.map((lead, index) => (
                <div
                  key={lead.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 transform transition-all ${
                    index === 0 ? 'scale-105 bg-white/15' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getScoreIcon(lead.score)}
                      <div>
                        <p className="font-semibold">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <p className="text-sm text-white/70">
                          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentLeads.length === 0 && (
          <div className="text-center text-white/60">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">Waiting for first visitor...</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>Updates in real-time</p>
        </div>
      </div>
    </div>
  );
}
