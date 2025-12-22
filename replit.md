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
│   └── referrals.service.ts
├── mocks/              # Mock data
│   ├── clients.mock.ts
│   ├── directives.mock.ts
│   └── mentors.mock.ts
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
│   ├── calendar.tsx
│   ├── analytics.tsx
│   └── settings.tsx
└── App.tsx
```

## Features

### Implemented
- **Dashboard:** Summary metrics, client list with filtering, search
- **Client Drawer:** 6-tab slide-over panel (Overview, Progress, AI Summary, Directives, Workouts, Permissions)
- **PT Directives:** Full management page with filters
- **Calendar:** Week view with booking display
- **Analytics:** Charts showing client and directive stats
- **Settings:** Profile, notifications, referrals, security tabs
- **Auth:** Mock login/signup with localStorage persistence
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
