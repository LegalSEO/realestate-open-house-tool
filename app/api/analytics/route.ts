import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch all events with their leads
    const events = await prisma.openHouseEvent.findMany({
      include: {
        leads: true,
      },
      orderBy: {
        eventDate: 'desc',
      },
    });

    // Filter events from last 30 days for overview stats
    const recentEvents = events.filter(
      (event) => new Date(event.eventDate) >= thirtyDaysAgo
    );

    // Calculate overview stats
    const totalEvents = recentEvents.length;
    const allRecentLeads = recentEvents.flatMap((event) => event.leads);
    const totalLeads = allRecentLeads.length;
    const avgLeadsPerEvent =
      totalEvents > 0 ? (totalLeads / totalEvents).toFixed(1) : '0';

    // Count lead scores
    const hotLeads = allRecentLeads.filter((lead) => lead.score === 'HOT').length;
    const warmLeads = allRecentLeads.filter((lead) => lead.score === 'WARM').length;
    const coldLeads = allRecentLeads.filter((lead) => lead.score === 'COLD').length;
    const hotLeadsPercentage =
      totalLeads > 0 ? ((hotLeads / totalLeads) * 100).toFixed(1) : '0';

    // Count converted leads (check if notes contain "Marked as converted")
    const convertedLeads = allRecentLeads.filter(
      (lead) => lead.notes && lead.notes.includes('Marked as converted')
    ).length;
    const conversionRate =
      totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

    // Performance chart data (leads per event)
    const performanceData = recentEvents.map((event) => {
      const leads = event.leads;
      return {
        eventId: event.id,
        address: event.address.split(',')[0], // Short address
        date: new Date(event.eventDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        totalLeads: leads.length,
        hotLeads: leads.filter((l) => l.score === 'HOT').length,
        warmLeads: leads.filter((l) => l.score === 'WARM').length,
        coldLeads: leads.filter((l) => l.score === 'COLD').length,
      };
    });

    // Lead source analysis (mock data since we don't track source yet)
    // In production, you'd add a 'source' field to Lead model
    const leadSourceData = [
      {
        name: 'QR Code Scan',
        value: Math.floor(totalLeads * 0.65), // 65% mock
        color: '#3b82f6',
      },
      {
        name: 'Typed URL',
        value: Math.floor(totalLeads * 0.25), // 25% mock
        color: '#8b5cf6',
      },
      {
        name: 'Other',
        value: Math.floor(totalLeads * 0.1), // 10% mock
        color: '#6b7280',
      },
    ];

    // Fetch scheduled messages for response rate analysis
    const messages = await prisma.scheduledMessage.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const sentMessages = messages.filter((m) => m.status === 'sent').length;
    const failedMessages = messages.filter((m) => m.status === 'failed').length;
    const pendingMessages = messages.filter((m) => m.status === 'pending').length;

    // Response rate data (mock data - would need tracking system in production)
    const responseRateData = [
      {
        type: 'Email Open Rate',
        rate: 68, // Mock percentage
        color: '#3b82f6',
      },
      {
        type: 'SMS Response Rate',
        rate: 42, // Mock percentage
        color: '#8b5cf6',
      },
      {
        type: 'Follow-up Engagement',
        rate: 35, // Mock percentage
        color: '#10b981',
      },
    ];

    // Best performing properties
    const bestPerformingProperties = events
      .map((event) => ({
        eventId: event.id,
        address: event.address,
        eventDate: new Date(event.eventDate).toLocaleDateString('en-US'),
        totalSignIns: event.leads.length,
        hotLeads: event.leads.filter((l) => l.score === 'HOT').length,
        avgScore:
          event.leads.length > 0
            ? (
                event.leads.reduce((sum, lead) => {
                  const scores = { HOT: 3, WARM: 2, COLD: 1 };
                  return sum + scores[lead.score as keyof typeof scores];
                }, 0) / event.leads.length
              ).toFixed(1)
            : '0',
      }))
      .sort((a, b) => b.totalSignIns - a.totalSignIns)
      .slice(0, 10);

    // Timeline analysis
    const timelineData = [
      {
        timeline: '0-30 days',
        count: allRecentLeads.filter((l) => l.timeline === '0-30 days').length,
        color: '#ef4444',
      },
      {
        timeline: '1-3 months',
        count: allRecentLeads.filter((l) => l.timeline === '1-3 months').length,
        color: '#f97316',
      },
      {
        timeline: '3-6 months',
        count: allRecentLeads.filter((l) => l.timeline === '3-6 months').length,
        color: '#eab308',
      },
      {
        timeline: '6+ months',
        count: allRecentLeads.filter((l) => l.timeline === '6+ months').length,
        color: '#3b82f6',
      },
    ];

    // Export data - all leads from all events
    const exportData = events.flatMap((event) =>
      event.leads.map((lead) => ({
        leadName: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        propertyAddress: event.address,
        eventDate: new Date(event.eventDate).toLocaleDateString('en-US'),
        leadScore: lead.score,
        timeline: lead.timeline,
        preApproved: lead.preApproved,
        hasAgent: lead.hasAgent ? 'Yes' : 'No',
        interestedIn: lead.interestedIn,
        notes: lead.notes || '',
        createdAt: new Date(lead.createdAt).toLocaleString('en-US'),
      }))
    );

    return NextResponse.json({
      overview: {
        totalEvents,
        totalLeads,
        avgLeadsPerEvent,
        conversionRate,
        hotLeadsPercentage,
        convertedLeads,
        hotLeads,
        warmLeads,
        coldLeads,
      },
      performanceData,
      leadSourceData,
      responseRateData,
      bestPerformingProperties,
      timelineData,
      exportData,
      messaging: {
        sent: sentMessages,
        failed: failedMessages,
        pending: pendingMessages,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
