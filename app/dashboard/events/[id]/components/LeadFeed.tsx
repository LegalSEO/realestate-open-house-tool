import { useState } from 'react';
import { LeadCard } from './LeadCard';
import { AddNoteModal } from './AddNoteModal';

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

interface LeadFeedProps {
  leads: Lead[];
  filter: 'all' | 'HOT' | 'WARM' | 'COLD';
  sortBy: 'newest' | 'oldest' | 'name';
  onFilterChange: (filter: 'all' | 'HOT' | 'WARM' | 'COLD') => void;
  onSortChange: (sortBy: 'newest' | 'oldest' | 'name') => void;
  onLeadUpdate: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function LeadFeed({
  leads,
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
  onLeadUpdate,
  showToast,
}: LeadFeedProps) {
  const [noteModalLead, setNoteModalLead] = useState<Lead | null>(null);

  const filterButtons = [
    { value: 'all' as const, label: 'All Leads', count: leads.length },
    { value: 'HOT' as const, label: 'Hot', icon: '🔥' },
    { value: 'WARM' as const, label: 'Warm', icon: '⚡' },
    { value: 'COLD' as const, label: 'Cold', icon: '❄️' },
  ];

  const handleMarkConverted = async (leadId: string, leadName: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/convert`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark lead as converted');
      }

      showToast(`${leadName} marked as converted!`, 'success');
      onLeadUpdate();
    } catch (error) {
      showToast('Failed to mark lead as converted', 'error');
    }
  };

  const handleAddNote = async (leadId: string, note: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      showToast('Note added successfully!', 'success');
      setNoteModalLead(null);
      onLeadUpdate();
    } catch (error) {
      showToast('Failed to add note', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters and Sorting */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => onFilterChange(btn.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === btn.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {btn.icon && <span className="mr-1">{btn.icon}</span>}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'name')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table (Desktop) / Cards (Mobile) */}
      <div className="overflow-x-auto">
        {/* Desktop Table View */}
        <table className="hidden md:table w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signed In At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => {
              const leadName = `${lead.firstName} ${lead.lastName}`;
              const scoreConfig = {
                HOT: { bg: 'bg-red-100', text: 'text-red-800', icon: '🔥' },
                WARM: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '⚡' },
                COLD: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '❄️' },
              };
              const config = scoreConfig[lead.score];

              return (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leadName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {lead.phone}
                      </a>
                    </div>
                    <div className="text-sm text-gray-500">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {lead.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                    >
                      <span className="mr-1">{config.icon}</span>
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.timeline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNoteModalLead(lead)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Add Note
                      </button>
                      <button
                        onClick={() => handleMarkConverted(lead.id, leadName)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Convert
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onAddNote={() => setNoteModalLead(lead)}
              onMarkConverted={() =>
                handleMarkConverted(lead.id, `${lead.firstName} ${lead.lastName}`)
              }
            />
          ))}
        </div>
      </div>

      {/* Add Note Modal */}
      {noteModalLead && (
        <AddNoteModal
          lead={noteModalLead}
          onClose={() => setNoteModalLead(null)}
          onSave={(note) => handleAddNote(noteModalLead.id, note)}
        />
      )}
    </div>
  );
}
