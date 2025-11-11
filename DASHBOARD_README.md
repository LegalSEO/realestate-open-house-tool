# Agent Event Dashboard

The Agent Event Dashboard provides real estate agents with a comprehensive command center to monitor and manage their open house events in real-time.

## Features

### 1. Event Header
- **Property Information**: Displays property address prominently
- **Event Date & Time**: Shows the scheduled date and time of the open house
- **Status Badge**: Visual indicator showing event status:
  - 🔵 **Upcoming**: Event hasn't started yet (shows countdown)
  - 🟢 **Active Now**: Event is happening today
  - ⚫ **Completed**: Event has ended
- **Edit Button**: Placeholder for future event editing functionality

### 2. Stats Cards
Real-time statistics displayed in prominent cards:
- **Total Sign-Ins**: Total number of leads collected
- **Hot Leads** 🔥: High-priority leads (pre-approved, no agent, immediate timeline)
- **Warm Leads** ⚡: Medium-priority leads
- **Cold Leads** ❄️: Lower-priority leads (long timeline, already has agent)

### 3. Lead Feed
Comprehensive lead management interface with:

#### Desktop Table View
- **Name**: Full name of the lead
- **Contact**: Phone (tel: link) and email (mailto: link) for quick communication
- **Lead Score**: Color-coded badge showing hot/warm/cold status
- **Timeline**: Buying timeline (0-30 days, 1-3 months, etc.)
- **Signed In At**: Timestamp of when lead registered
- **Actions**: Quick action buttons for each lead

#### Mobile Card View
- Responsive card layout optimized for mobile devices
- Same information as desktop but in card format
- Touch-friendly action buttons

#### Filters & Sorting
- **Filter by Lead Score**: All / Hot / Warm / Cold
- **Sort Options**:
  - Newest First (default)
  - Oldest First
  - By Name (alphabetical)

### 4. Action Buttons

#### Export to CSV
- Downloads all leads as a CSV file
- Includes: Name, Email, Phone, Lead Score, Timeline, Pre-Approval Status, Agent Status, Interests, Sign-In Time
- Filename format: `leads-{shortCode}-{date}.csv`

#### Send Broadcast
- Send messages to all leads at once
- Options:
  - SMS Only
  - Email Only
  - Both SMS & Email
- Custom message input
- Shows recipient count before sending

#### Copy Sign-In Link
- Copies the public event URL to clipboard
- Format: `{baseUrl}/event/{shortCode}`
- One-click sharing with visitors

#### Download QR Code
- Generates and downloads QR code as PNG image
- High resolution (1000x1000px)
- Filename format: `qr-code-{shortCode}.png`
- Perfect for printing and displaying at open house

### 5. Lead Actions

#### Add Note
- Quick modal to add notes about a lead
- Timestamped entries
- All notes stored chronologically
- Useful for tracking conversations and follow-ups

#### Mark as Converted
- One-click to mark a lead as converted
- Adds timestamped conversion note
- Helps track ROI and success metrics

### 6. Real-Time Updates

The dashboard includes automatic updates:
- **Polling**: Refreshes lead data every 10 seconds
- **Toast Notifications**: Visual feedback for all actions
- **Live Counter**: When event is active today, shows real-time sign-in count

### 7. Empty State

When no leads have signed in yet:
- **Large QR Code Display**: Prominently shows QR code for easy scanning
- **Sign-In URL**: Displays full URL with copy button
- **Tips Section**: Helpful suggestions for collecting leads:
  - Print and display QR code
  - Share link via text/email
  - Use tablet for easy sign-ins
  - Automatic welcome messages

## API Routes

### GET `/api/events/[id]`
Fetches event details with all leads.

**Response:**
```json
{
  "id": "event-id",
  "shortCode": "ABC123",
  "propertyAddress": "123 Main St",
  "eventDate": "2024-01-15T14:00:00Z",
  "leads": [...]
}
```

### POST `/api/events/[id]/broadcast`
Sends broadcast message to all leads.

**Request:**
```json
{
  "message": "Your message here",
  "messageType": "both" // "sms", "email", or "both"
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "sms": { "sent": 10, "failed": 0 },
    "email": { "sent": 10, "failed": 0 }
  }
}
```

### POST `/api/leads/[id]/convert`
Marks a lead as converted.

**Response:**
```json
{
  "success": true,
  "lead": { ... }
}
```

### POST `/api/leads/[id]/notes`
Adds a note to a lead.

**Request:**
```json
{
  "note": "Had great conversation about the kitchen"
}
```

**Response:**
```json
{
  "success": true,
  "lead": { ... }
}
```

## Usage

### Accessing the Dashboard

Navigate to `/dashboard/events/[eventId]` where `[eventId]` is the UUID of your open house event.

### Before the Event
1. View the QR code and sign-in link
2. Download and print the QR code
3. Share the sign-in link with interested parties
4. Check the countdown to event start

### During the Event
1. Monitor real-time sign-ins
2. Watch stats update automatically
3. Review lead scores as people sign in
4. Add quick notes about conversations
5. Use phone/email links to follow up immediately

### After the Event
1. Export all leads to CSV
2. Send broadcast thank you message
3. Review lead scores and priorities
4. Add detailed notes from memory
5. Mark converted leads

## Technical Details

### Components Structure
```
app/dashboard/events/[id]/
├── page.tsx                    # Main dashboard page
└── components/
    ├── EventHeader.tsx         # Header with status and date
    ├── StatsCards.tsx          # Statistics cards
    ├── LeadFeed.tsx            # Lead table/list with filters
    ├── LeadCard.tsx            # Mobile lead card view
    ├── ActionButtons.tsx       # Top action buttons
    ├── AddNoteModal.tsx        # Modal for adding notes
    ├── BroadcastModal.tsx      # Modal for broadcast messages
    ├── EmptyState.tsx          # Empty state with QR code
    └── Toast.tsx               # Toast notifications
```

### Dependencies
- **qrcode**: For generating QR codes
- **date-fns**: For date formatting and calculations
- **React hooks**: useState, useEffect, useCallback for state management

### Mocked Messaging
The current implementation uses **mocked messaging** that logs to console instead of actually sending SMS/email:
- `lib/twilio.ts`: Mocked SMS sending (logs to console)
- `lib/resend.ts`: Mocked email sending (logs to console)
- See console output for formatted message previews

### Real-Time Updates
Current implementation uses polling (10-second intervals). Can be enhanced with:
- **Supabase Realtime**: WebSocket subscriptions
- **Pusher**: Real-time event broadcasting
- **Socket.io**: Custom WebSocket server

## Future Enhancements

1. **Real Messaging Integration**
   - Add actual Twilio SMS sending
   - Add actual Resend email sending
   - Configure environment variables

2. **Advanced Analytics**
   - Conversion rate tracking
   - Response time metrics
   - Lead source tracking
   - Historical comparisons

3. **Enhanced Real-Time**
   - Replace polling with WebSocket subscriptions
   - Toast notifications for new sign-ins
   - Sound alerts for hot leads

4. **Event Management**
   - Edit event details
   - Duplicate events
   - Archive old events
   - Event templates

5. **Lead Management**
   - Assign leads to team members
   - Lead status workflow
   - Follow-up reminders
   - Task management

6. **Integrations**
   - CRM sync (Salesforce, HubSpot)
   - Calendar integrations
   - MLS data import
   - Social media sharing

## Schema Update Required

The dashboard requires the `eventDate` field in the `OpenHouseEvent` model:

```prisma
model OpenHouseEvent {
  // ... other fields
  eventDate DateTime // Date and time of the open house event
  // ... other fields
}
```

Run the Prisma migration to add this field:
```bash
npx prisma migrate dev --name add_event_date
```

## Notes

- The dashboard is fully responsive (mobile, tablet, desktop)
- All actions provide visual feedback via toast notifications
- Lead data refreshes automatically every 10 seconds
- CSV export includes all lead information
- QR codes are high resolution for printing
- Phone and email links open native apps
