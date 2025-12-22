# HiPat Client Management Tool

## Overview
A web-based Client Management Tool for personal trainers and mentors to manage clients who use the HiPat AI iOS fitness app. The unique value is "Pat" - an AI assistant that acts as a 24/7 bridge between mentors and clients.

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand
- **Data Layer:** Abstract service layer with mock implementation (backend-agnostic)
- **Auth:** Mock auth context with localStorage persistence
- **Charts:** Recharts
- **Routing:** Wouter

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
│   └── groups.mock.ts
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
- **Dashboard:** Summary metrics, client list with filtering, search
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
