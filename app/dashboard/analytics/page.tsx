'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Download, TrendingUp, Users, Calendar, Target } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalEvents: number;
    totalLeads: number;
    avgLeadsPerEvent: string;
    conversionRate: string;
    hotLeadsPercentage: string;
    convertedLeads: number;
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
  };
  performanceData: Array<{
    eventId: string;
    address: string;
    date: string;
    totalLeads: number;
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
  }>;
  leadSourceData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  responseRateData: Array<{
    type: string;
    rate: number;
    color: string;
  }>;
  bestPerformingProperties: Array<{
    eventId: string;
    address: string;
    eventDate: string;
    totalSignIns: number;
    hotLeads: number;
    avgScore: string;
  }>;
  timelineData: Array<{
    timeline: string;
    count: number;
    color: string;
  }>;
  exportData: Array<any>;
  messaging: {
    sent: number;
    failed: number;
    pending: number;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;

    const headers = [
      'Lead Name',
      'Email',
      'Phone',
      'Property Address',
      'Event Date',
      'Lead Score',
      'Timeline',
      'Pre-Approved',
      'Has Agent',
      'Interested In',
      'Notes',
      'Created At',
    ];

    const csvContent = [
      headers.join(','),
      ...data.exportData.map((row) =>
        [
          `"${row.leadName}"`,
          `"${row.email}"`,
          `"${row.phone}"`,
          `"${row.propertyAddress}"`,
          `"${row.eventDate}"`,
          row.leadScore,
          `"${row.timeline}"`,
          row.preApproved,
          row.hasAgent,
          row.interestedIn,
          `"${row.notes.replace(/"/g, '""')}"`,
          `"${row.createdAt}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Performance insights from the last 30 days
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export All Data
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Open Houses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.overview.totalEvents}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.overview.totalLeads}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Leads/Event</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.overview.avgLeadsPerEvent}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.overview.conversionRate}%
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Leads</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {data.overview.hotLeadsPercentage}%
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Performance by Open House
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Lead volume and quality across your events
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.address}</p>
                        <p className="text-sm text-gray-600">{data.date}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="text-red-600">🔥 Hot:</span>{' '}
                            {data.hotLeads}
                          </p>
                          <p className="text-sm">
                            <span className="text-orange-600">⚡ Warm:</span>{' '}
                            {data.warmLeads}
                          </p>
                          <p className="text-sm">
                            <span className="text-blue-600">❄️ Cold:</span>{' '}
                            {data.coldLeads}
                          </p>
                          <p className="text-sm font-semibold mt-2">
                            Total: {data.totalLeads}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="hotLeads" stackId="a" fill="#ef4444" name="Hot" />
              <Bar dataKey="warmLeads" stackId="a" fill="#f97316" name="Warm" />
              <Bar dataKey="coldLeads" stackId="a" fill="#3b82f6" name="Cold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Lead Source Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Lead Source Analysis
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              How visitors find your open houses
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.leadSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Response Rate Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Response & Engagement Rates
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Lead engagement with follow-up messages
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.responseRateData}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="type" />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                  {data.responseRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Buyer Timeline Analysis
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            When your leads are planning to buy
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeline" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.timelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {data.timelineData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">
                  {item.timeline}: {item.count} leads
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Performing Properties */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Best Performing Properties
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Properties that generated the most interest
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Address
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sign-Ins
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hot Leads
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.bestPerformingProperties.map((property, index) => (
                  <tr
                    key={property.eventId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/dashboard/events/${property.eventId}`)
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.eventDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {property.totalSignIns}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        🔥 {property.hotLeads}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.avgScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.bestPerformingProperties.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No events with leads yet
            </div>
          )}
        </div>

        {/* Messaging Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Automated Messaging Performance
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Status of automated follow-up messages
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {data.messaging.sent}
              </p>
              <p className="text-sm text-gray-600 mt-1">Sent Successfully</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {data.messaging.pending}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {data.messaging.failed}
              </p>
              <p className="text-sm text-gray-600 mt-1">Failed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
