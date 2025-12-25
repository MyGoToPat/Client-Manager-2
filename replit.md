# HiPat Client Management Tool

## Overview
A web-based Client Management Tool for personal trainers and mentors to manage clients who use the HiPat AI iOS fitness app. The unique value is "Pat" - an AI assistant that acts as a 24/7 bridge between mentors and clients.

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Icons:** Material Symbols Outlined (via Google Fonts CDN)
- **Fonts:** Inter (primary), Space Grotesk (display), Noto Sans (body), Manrope (alternative)
- **State Management:** Zustand
- **Data Layer:** Abstract service layer with mock implementation (backend-agnostic)
- **Auth:** Mock auth context with localStorage persistence
- **Charts:** Recharts
- **Routing:** Wouter

## Design System
- **Primary Color:** #135bec (HSL: 218 88% 50%)
- **Dark Mode First:** Backgrounds #101622/#111722, surfaces #1e293b/#232f48
- **HSL Color System:** All colors defined using HSL format for consistency
- **Icon Pattern:** `<span className="material-symbols-outlined text-base">icon_name</span>`
- See `design_guidelines.md` for complete design documentation

## Architecture

### Service Layer Pattern
All data access goes through services - easily swappable later:
```
client/src/
├── services/           # Service layer
│   ├── index.ts        # Export all services
│   ├── auth.service.ts
│   ├── clients.service.ts
│   ├── directives.service.ts
│   ├── bookings.service.ts
│   ├── referrals.service.ts
│   └── groups.service.ts
├── mocks/              # Mock data
│   ├── clients.mock.ts
│   ├── directives.mock.ts
│   ├── mentors.mock.ts
│   ├── groups.mock.ts
│   └── dashboard-briefing-v2.mock.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── store/              # Zustand state
│   └── useStore.ts
├── components/         # React components
│   ├── app-sidebar.tsx
│   ├── header.tsx
│   ├── client-drawer.tsx
│   ├── client-table.tsx
│   └── client-drawer/  # Drawer tab components
├── pages/              # Page components
│   ├── dashboard.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── directives.tsx
│   ├── groups.tsx
│   ├── group-detail.tsx
│   ├── calendar.tsx
│   ├── analytics.tsx
│   ├── settings.tsx
│   ├── program-templates.tsx
│   ├── booking.tsx      # Public booking page
│   └── ...
├── components/groups/   # Group tab components
│   ├── group-overview-tab.tsx
│   ├── group-members-tab.tsx
│   ├── group-message-board-tab.tsx
│   ├── group-directives-tab.tsx
│   ├── group-progress-tab.tsx
│   └── create-group-directive-modal.tsx
└── App.tsx
```

## Features

### Implemented
- **Dashboard (Pat as Co-Pilot V2 - Smart Client Organization):** AI briefing-style dashboard organizing clients by engagement type:
  - **Smart Greeting:** Context-aware greeting with segment pills (In-Person, Online 1:1, Programs) showing counts
  - **In-Person Sessions (Today):** Compact session rows for TODAY's in-person clients with venue, time, status, and prep notes
  - **Online Sessions (This Week):** Weekly grouped sessions for online 1:1 clients organized by day (Today, Tomorrow, etc.)
  - **Program Health:** Program cards showing health %, flagged members, and recent wins - "Pat's handling these" philosophy
  - Needs Attention items with urgency levels, patterns noticed, and suggested actions
  - Celebrations section for client wins (PRs, streaks, milestones)
  - Activity summary with workout/nutrition progress
  - Components: SmartGreetingComponent, InPersonSessions, OnlineSessionsWeek, ProgramHealth (V2), plus V1 components for detail views
- **Client Drawer:** 6-tab slide-over panel (Overview, Progress, AI Summary, Directives, Workouts, Permissions)
- **PT Directives:** Full management page with filters
- **Groups:** Comprehensive group management system with 4 group types:
  - Program Cohorts: Structured programs with start dates, duration, and week tracking
  - Custom Groups: General grouping (e.g., morning clients, advanced level)
  - Promotions: Limited-time groups for special offers
  - Organizations: Gym/studio based groups
  - Features: Message board with posts/comments/reactions, group-specific directives, member management, progress tracking
- **Group Detail Tabs:** Overview, Members, Message Board, Directives, Progress tabs
- **Program Templates:** Create program cohorts from templates with member selection
- **Group Directives:** Program-timed (Week X Day Y relative to member start) and event-based triggers
- **Calendar:** Week view with booking display, enhanced availability editing with multiple time slots per day
- **Public Booking:** Client-facing booking page at /book/:mentorSlug (no auth required)
- **Analytics:** Charts showing client and directive stats
- **Settings:** Profile, notifications, referrals, security tabs
- **Auth:** Mock login/signup with localStorage persistence (demo: info@hipat.app / admin123)
- **Dark Mode:** Theme toggle with localStorage persistence

### Authentication
Mock auth - any email/password works for login. User state is stored in localStorage under `hipat_user` key.

## Running the App
The app runs on `npm run dev` which starts both the Express backend and Vite frontend on port 5000.

## User Preferences
- Backend-agnostic: All data access through service layer
- Mock data for development
- Dark mode support
- Responsive design
