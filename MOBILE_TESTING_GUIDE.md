# Mobile Dashboard Testing Guide

This guide covers how to test the mobile-optimized event dashboard for the Real Estate Open House Tool.

## Overview

The mobile dashboard is specifically designed for real estate agents to use at open houses on their smartphones. It includes:

1. **Real-time sign-in notifications** with sound and vibration
2. **Swipe gestures** for lead categorization (HOT/WARM/COLD)
3. **Quick actions** (call, email, notes with voice-to-text)
4. **Manual check-in** for visitors without smartphones
5. **Live Mode** - full-screen display mode
6. **Offline capability** - works without internet connection
7. **Native sharing** - share sign-in links via text/social media

## Prerequisites

### 1. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

#### Required for Real-Time Features (Optional for Basic Testing)

If you want to test real-time push notifications:

1. Sign up for free account at [Pusher.com](https://pusher.com)
2. Create a new Channels app
3. Add credentials to `.env`:

```env
NEXT_PUBLIC_PUSHER_APP_KEY="your_pusher_app_key"
PUSHER_APP_ID="your_pusher_app_id"
PUSHER_SECRET="your_pusher_secret"
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"
```

**Note:** The app will work without Pusher, but real-time notifications will be disabled. You'll still see updates via polling (every 10 seconds).

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

## Testing on Physical Devices

### iOS Testing

#### Option 1: Using ngrok (Recommended for Mobile Testing)

1. Install ngrok: https://ngrok.com/download
2. Start your Next.js dev server: `npm run dev`
3. In a new terminal, expose it: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update `.env`: `NEXT_PUBLIC_BASE_URL="https://abc123.ngrok.io"`
6. Restart the dev server
7. Open the ngrok URL on your iPhone

#### Option 2: Local Network (Same WiFi Required)

1. Find your computer's local IP:
   - Mac: System Preferences → Network
   - Windows: `ipconfig` in command prompt
   - Linux: `ifconfig` or `ip addr`
2. Update `.env`: `NEXT_PUBLIC_BASE_URL="http://192.168.1.XXX:3000"`
3. Restart the dev server
4. Open `http://192.168.1.XXX:3000` on your iPhone

### Android Testing

Same as iOS - use ngrok or local network IP.

## Testing Checklist

### 1. Accessing Mobile Dashboard

- [ ] Create a test event from desktop view
- [ ] Navigate to event dashboard
- [ ] Click "Mobile View" button in header
- [ ] Verify mobile dashboard loads
- [ ] Verify responsive layout on phone

### 2. Real-Time Notifications

#### Setup
- [ ] Ensure Pusher credentials are configured (or skip for polling-only mode)
- [ ] Have two devices ready: one for agent (mobile dashboard), one for visitor (sign-in)

#### Test
- [ ] Open mobile dashboard on agent phone
- [ ] Enable sound and vibration in settings
- [ ] Open sign-in page on visitor device
- [ ] Submit a sign-in
- [ ] **Verify on agent phone:**
  - [ ] New lead appears immediately (or within 10 seconds if no Pusher)
  - [ ] Toast notification shows visitor name
  - [ ] Sound plays (if enabled)
  - [ ] Phone vibrates (if enabled and supported)

### 3. Swipe Gestures

- [ ] Open mobile dashboard with at least one lead
- [ ] Swipe lead card **right** (>100px)
  - [ ] Lead should be marked as HOT (red)
  - [ ] Toast shows "Marked as HOT"
- [ ] Swipe same lead **left** (>100px)
  - [ ] Lead should be marked as COLD (blue)
  - [ ] Toast shows "Marked as COLD"
- [ ] Swipe with medium distance (50-100px)
  - [ ] Lead should be marked as WARM (yellow)
  - [ ] Toast shows "Marked as WARM"
- [ ] Verify visual indicators during swipe (colored circles)

### 4. Quick Actions

#### Call
- [ ] Tap "Call" button on lead card
- [ ] Verify phone dialer opens with correct number
- [ ] Cancel or complete call

#### Email
- [ ] Tap "Email" button on lead card
- [ ] Verify email app opens with correct address
- [ ] Cancel or send email

#### Quick Note
- [ ] Tap "Note" button on lead card
- [ ] Verify modal slides up from bottom
- [ ] Type a test note
- [ ] Tap "Save Note"
- [ ] Verify note is saved
- [ ] Check lead notes in desktop view

### 5. Voice-to-Text (Chrome on Android/Safari on iOS)

- [ ] Open Quick Note modal
- [ ] Tap "Start Voice Input" button
- [ ] Grant microphone permission if prompted
- [ ] Speak: "This is a test note about the kitchen"
- [ ] Verify text appears in note field
- [ ] Tap "Stop Recording"
- [ ] Save note and verify

**Note:** Voice recognition may not work in all browsers. Chrome on Android and Safari on iOS have best support.

### 6. Manual Check-In

- [ ] Tap "Manual Check-In" button
- [ ] Fill in visitor details:
  - First Name: John
  - Last Name: Doe
  - Phone: (555) 123-4567
  - Email: john@example.com
  - Timeline: 1-3 months
  - Pre-approved: Yes
  - Has Agent: No
- [ ] Tap "Add Lead"
- [ ] Verify new lead appears in list
- [ ] Verify lead is automatically scored (should be HOT)

### 7. Live Mode

- [ ] Tap "Live Mode" button
- [ ] Verify full-screen gradient display
- [ ] Verify large visitor counter
- [ ] Verify HOT/WARM/COLD breakdown
- [ ] Verify recent sign-ins (last 5)
- [ ] Have someone sign in
- [ ] Verify live counter updates
- [ ] Verify newest sign-in appears with "NEW" badge
- [ ] Tap X to close Live Mode

### 8. Share Functionality

#### Native Share (iOS/Android)
- [ ] Tap "Share" button in Share Panel
- [ ] Verify native share sheet opens
- [ ] Select text message/WhatsApp
- [ ] Verify link is included
- [ ] Send to yourself and test link

#### Copy Link
- [ ] Tap "Copy" button
- [ ] Verify toast shows "Link copied"
- [ ] Paste in notes app
- [ ] Verify correct URL

#### QR Code
- [ ] Tap "QR" button
- [ ] Verify QR code modal opens
- [ ] Scan QR code with another device
- [ ] Verify it opens sign-in page
- [ ] On iOS: Test "Share QR Code" button
- [ ] Close modal

### 9. Offline Capability

#### Test Offline Sign-In Queue
- [ ] Open mobile dashboard
- [ ] Turn on Airplane Mode
- [ ] Verify offline indicator appears at top
- [ ] Tap "Manual Check-In"
- [ ] Fill in test lead
- [ ] Submit form
- [ ] Verify lead is queued (check offline indicator count)
- [ ] Turn off Airplane Mode
- [ ] Verify "Back online • Syncing..." appears
- [ ] Verify lead is synced to server
- [ ] Verify offline counter resets to 0

#### Test Cached Data
- [ ] Open mobile dashboard while online
- [ ] Let it load completely
- [ ] Turn on Airplane Mode
- [ ] Refresh the page
- [ ] Verify event data loads from cache
- [ ] Verify offline indicator shows
- [ ] Note: Real-time updates won't work offline

### 10. Filter & Sort

- [ ] Tap "Total" stat card
- [ ] Verify all leads shown
- [ ] Tap "Hot" stat card
- [ ] Verify only HOT leads shown
- [ ] Verify filter badge appears
- [ ] Tap "Clear" in filter badge
- [ ] Verify all leads shown again

### 11. Notification Settings Persistence

- [ ] Disable sound
- [ ] Close and reopen mobile dashboard
- [ ] Verify sound is still disabled
- [ ] Disable vibration
- [ ] Close and reopen
- [ ] Verify vibration is still disabled
- [ ] Re-enable both for continued testing

### 12. Multi-Device Sync

- [ ] Open mobile dashboard on Device A
- [ ] Open mobile dashboard on Device B (same event)
- [ ] Have someone sign in
- [ ] Verify both devices update (real-time or within 10 seconds)
- [ ] On Device A: Change lead status via swipe
- [ ] Verify Device B reflects the change

### 13. Performance & UX

- [ ] Verify all animations are smooth
- [ ] Verify tap targets are large enough (min 44x44px)
- [ ] Verify text is readable without zoom
- [ ] Verify buttons don't overlap
- [ ] Test in portrait and landscape
- [ ] Verify no horizontal scrolling

### 14. Edge Cases

#### Empty State
- [ ] Create new event with no leads
- [ ] Open mobile dashboard
- [ ] Verify empty state message
- [ ] Verify share panel still works

#### Many Leads
- [ ] Create event with 20+ leads
- [ ] Open mobile dashboard
- [ ] Verify scrolling works smoothly
- [ ] Verify filter/sort works
- [ ] Verify swipe gestures still work

#### Long Names
- [ ] Add lead with very long name
- [ ] Verify text doesn't overflow card
- [ ] Verify card layout doesn't break

## Browser Support

### Recommended Browsers

- **iOS**: Safari 14+, Chrome 90+
- **Android**: Chrome 90+, Samsung Internet 14+

### Feature Support by Browser

| Feature | iOS Safari | iOS Chrome | Android Chrome | Android Samsung |
|---------|-----------|-----------|----------------|-----------------|
| Real-time (Pusher) | ✅ | ✅ | ✅ | ✅ |
| Swipe gestures | ✅ | ✅ | ✅ | ✅ |
| Voice-to-text | ✅ | ⚠️ Limited | ✅ | ✅ |
| Vibration | ⚠️ Limited | ⚠️ Limited | ✅ | ✅ |
| Native Share API | ✅ | ✅ | ✅ | ✅ |
| Offline (IndexedDB) | ✅ | ✅ | ✅ | ✅ |

## Known Limitations

1. **Voice-to-text**: Requires microphone permission and may not work in all browsers
2. **Vibration**: iOS has limited vibration API support (haptic feedback may not work)
3. **Background notifications**: Only works when app is open (no service worker push notifications yet)
4. **Sound**: Requires user interaction before first play (browser security)

## Troubleshooting

### Real-Time Updates Not Working

1. **Check Pusher Configuration**
   - Verify environment variables are set
   - Check browser console for errors
   - Verify Pusher dashboard shows connections

2. **Fallback to Polling**
   - Even without Pusher, updates should appear within 10 seconds
   - Check network tab for API calls every 10 seconds

### Voice Input Not Working

1. **Check Permissions**
   - iOS: Settings → Safari → Microphone
   - Android: Settings → Apps → Chrome → Permissions

2. **Try Different Browser**
   - iOS: Use Safari (best support)
   - Android: Use Chrome (best support)

### Offline Sync Not Working

1. **Check Browser Storage**
   - IndexedDB must be enabled
   - Check browser settings for storage permissions
   - Clear browser data and try again

2. **Verify Network Connectivity**
   - Offline indicator should appear when offline
   - Check browser console for sync errors

### Swipe Gestures Not Responsive

1. **Check Touch Events**
   - Verify device supports touch
   - Try harder/longer swipes
   - Check if browser is in desktop mode (should be mobile)

2. **Visual Feedback**
   - Colored circles should appear during swipe
   - Card should rotate slightly during swipe

## Performance Tips

1. **Clear Cache**: If experiencing issues, clear browser cache and reload
2. **Close Other Tabs**: For best performance, close other browser tabs
3. **Update Browser**: Use latest version of your browser
4. **Disable Extensions**: Some browser extensions may interfere with functionality

## Production Deployment Checklist

Before deploying to production:

- [ ] Configure production Pusher credentials
- [ ] Set up proper authentication for dashboard
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Test on multiple physical devices
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure HTTPS (required for PWA features)
- [ ] Test offline functionality thoroughly
- [ ] Set up analytics to track mobile usage
- [ ] Create user documentation
- [ ] Train agents on mobile features

## Support

For issues or questions:
1. Check the browser console for errors
2. Review this testing guide
3. Check GitHub issues
4. Contact support team

---

**Last Updated:** 2025-11-12
**Version:** 1.0.0
