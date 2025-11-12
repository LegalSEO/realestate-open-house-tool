# Real Estate Open House Lead Capture Tool

A modern, mobile-optimized web application for capturing leads at real estate open houses.

## Features

### Visitor Experience
- **Public Sign-In Page**: Visitors scan a QR code to access event-specific pages
- **QR Code Generation**: High-resolution (1000x1000px) QR codes with property address labels
- **Printable Sign-In Sheets**: Professional PDF sign-in sheets with QR codes, ready to print
- **Property Showcase**: Beautiful photo carousel, key stats, and property details
- **Smart Lead Capture**: Mobile-friendly form with auto-formatting phone numbers
- **Property Details**: Full property information with photos, features, and map
- **Agent Contact**: Easy contact options for interested buyers

### Agent Desktop Dashboard
- **Real-time Lead Monitoring**: Live updates with polling (10-second refresh)
- **Lead Scoring**: Automatic HOT/WARM/COLD scoring based on visitor responses
- **Broadcast Messaging**: Send SMS/email to all leads
- **CSV Export**: Download leads for CRM import
- **Analytics Dashboard**: Comprehensive metrics across all events
- **Automated Messaging**: SMS and email sequences for lead nurturing

### 🆕 Mobile Agent Dashboard (NEW!)
- **Real-Time Push Notifications**: Instant alerts when visitors sign in (Pusher integration)
- **Sound & Vibration Alerts**: Customizable notifications with opt-in settings
- **Swipe Gestures**: Swipe lead cards to categorize as HOT/WARM/COLD
- **Quick Actions**: One-tap call, email, or add notes to leads
- **Voice-to-Text Notes**: Speak notes using Web Speech API (hands-free!)
- **Manual Check-In**: Add leads manually when QR code isn't available
- **Live Display Mode**: Full-screen counter for propping up phone like a display
- **Offline Mode**: Queue sign-ins when offline, auto-sync when back online
- **Native Sharing**: Share sign-in link via text, social media, or copy-to-clipboard
- **Mobile-Optimized UI**: Touch-friendly interface designed for on-site use

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Prisma with SQLite (easily switchable to PostgreSQL/MySQL)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Real-Time**: Pusher (optional - falls back to polling)
- **Offline Storage**: IndexedDB (idb library)
- **Gestures**: react-swipeable
- **Voice Input**: Web Speech API (browser native)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   # In a production environment with Prisma binaries available:
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Mobile Dashboard Setup (Optional)

The mobile dashboard works without additional configuration, but for the best experience:

1. **Enable Real-Time Notifications (Optional)**:
   - Sign up for a free account at [Pusher.com](https://pusher.com)
   - Create a Channels app
   - Add credentials to `.env`:
     ```env
     NEXT_PUBLIC_PUSHER_APP_KEY="your_pusher_app_key"
     PUSHER_APP_ID="your_pusher_app_id"
     PUSHER_SECRET="your_pusher_secret"
     NEXT_PUBLIC_PUSHER_CLUSTER="mt1"
     ```
   - Without Pusher, the dashboard will use polling (10-second refresh)

2. **Test on Physical Devices**:
   - Use [ngrok](https://ngrok.com) to expose your local server:
     ```bash
     ngrok http 3000
     ```
   - Update `.env` with the ngrok URL:
     ```env
     NEXT_PUBLIC_BASE_URL="https://your-ngrok-url.ngrok.io"
     ```
   - Access the mobile dashboard at: `https://your-ngrok-url.ngrok.io/dashboard/events/[id]/mobile`

3. **See Full Testing Guide**:
   - Read [MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md) for comprehensive testing instructions

## Project Structure

```
├── app/
│   ├── api/
│   │   └── leads/          # API endpoint for lead submission
│   ├── event/
│   │   └── [shortCode]/    # Dynamic event pages
│   │       ├── details/    # Property details page
│   │       └── page.tsx    # Sign-in page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Utility functions
│   └── lead-scoring.ts    # Lead scoring logic
└── prisma/
    └── schema.prisma      # Database schema
```

## Lead Scoring Logic

Leads are automatically scored based on three criteria:

- **HOT**: Pre-approved = Yes AND No agent AND Timeline = 0-30 days
- **WARM**: 2 out of 3 criteria met
- **COLD**: 0-1 criteria met

## Database Schema

### OpenHouseEvent
- Property details (address, photos, price, beds, baths, sqft)
- Agent information (name, photo, brokerage, contact)
- Property description and features

### Lead
- Contact information (name, email, phone)
- Qualification data (pre-approved, has agent, timeline, interest)
- Calculated score (HOT/WARM/COLD)
- Relationship to OpenHouseEvent

## Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly form inputs
- Auto-formatting phone numbers
- Fast-loading image carousel
- Optimized for sign-in within 30 seconds

## Documentation

- **[Agent Dashboard Guide](./DASHBOARD_README.md)**: Comprehensive guide to the agent dashboard features
- **[QR Code Features](./QR_CODE_README.md)**: Complete guide to QR code generation and sign-in sheets
- **[Messaging Setup](./MESSAGING_SETUP.md)**: Instructions for setting up SMS and email messaging

## Next Steps (Future Enhancements)

- Real-time WebSocket updates (currently uses polling)
- Production messaging integration (Twilio/Resend)
- Analytics and reporting dashboard
- CRM integration (Salesforce, HubSpot)
- Multi-agent support and team features

## License

MIT
