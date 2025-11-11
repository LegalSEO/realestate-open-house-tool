# Real Estate Open House Lead Capture Tool

A modern, mobile-optimized web application for capturing leads at real estate open houses.

## Features

- **Public Sign-In Page**: Visitors scan a QR code to access event-specific pages
- **Property Showcase**: Beautiful photo carousel, key stats, and property details
- **Smart Lead Capture**: Mobile-friendly form with auto-formatting phone numbers
- **Lead Scoring**: Automatic HOT/WARM/COLD scoring based on visitor responses
- **Property Details**: Full property information with photos, features, and map
- **Agent Contact**: Easy contact options for interested buyers

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Prisma with SQLite (easily switchable to PostgreSQL/MySQL)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

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

## Next Steps (Future Enhancements)

- SMS/Email notifications to agents on lead submission
- Lead dashboard for agents
- QR code generator
- Analytics and reporting
- CRM integration

## License

MIT
