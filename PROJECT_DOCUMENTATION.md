# HiPat Client Management Tool - Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** December 23, 2025  
**Status:** MVP Complete (Frontend-Only with Mock Data)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Directory Structure](#directory-structure)
5. [Data Models](#data-models)
6. [Services Layer](#services-layer)
7. [State Management](#state-management)
8. [Components Library](#components-library)
9. [Pages & Routing](#pages--routing)
10. [Authentication Flow](#authentication-flow)
11. [Key Features](#key-features)
12. [Mock Data Strategy](#mock-data-strategy)
13. [Testing Guidelines](#testing-guidelines)
14. [Improvement Recommendations](#improvement-recommendations)

---

## Executive Summary

### What is HiPat?

HiPat is a web-based **Client Management Tool** designed for personal trainers, fitness coaches, and mentors who use the HiPat AI iOS fitness app. The unique value proposition is **"Pat"** - an AI assistant that acts as a 24/7 bridge between mentors and their clients.

### Target Users

- **Personal Trainers** managing multiple clients
- **Fitness Coaches** running group programs
- **Health Mentors** providing nutrition and wellness guidance
- **Gym Owners** overseeing teams of trainers

### Core Value Proposition

1. **AI-Powered Communication**: Pat handles routine check-ins, motivation, and data analysis
2. **Directive System**: Mentors configure automated responses based on client behavior
3. **Group Management**: Run structured programs with cohorts of clients
4. **Time Savings**: Automate repetitive tasks while maintaining personal touch

### Demo Credentials

```
Email: info@hipat.app
Password: admin123
```

---

## Tech Stack

### Frontend Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool & dev server |

### Styling

| Technology | Purpose |
|------------|---------|
| Tailwind CSS | Utility-first CSS |
| shadcn/ui | Component library (Radix-based) |
| Lucide React | Icon library |
| react-icons | Additional icons (company logos) |

### State Management

| Technology | Purpose |
|------------|---------|
| Zustand | Global state management |
| TanStack Query | Server state & caching |

### Routing & Forms

| Technology | Purpose |
|------------|---------|
| Wouter | Lightweight routing |
| React Hook Form | Form management |
| Zod | Schema validation |

### Charts & Visualization

| Technology | Purpose |
|------------|---------|
| Recharts | Data visualization |

### Backend (Placeholder)

| Technology | Purpose |
|------------|---------|
| Express | HTTP server |
| Drizzle ORM | Database toolkit (prepared, not active) |

---

## Architecture Overview

### Pattern: Frontend-First with Service Abstraction

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │  Pages  │  │Components│  │  Hooks  │  │  Store  │            │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘            │
│       │            │            │            │                  │
│       └────────────┴────────────┴────────────┘                  │
│                           │                                     │
│                    ┌──────┴──────┐                              │
│                    │  SERVICES   │ ← Abstraction Layer          │
│                    └──────┬──────┘                              │
│                           │                                     │
│               ┌───────────┴───────────┐                         │
│               │                       │                         │
│         ┌─────┴─────┐          ┌──────┴──────┐                  │
│         │ Mock Data │          │ Real API    │ ← Future         │
│         │ (Current) │          │ (Swappable) │                  │
│         └───────────┘          └─────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Service Layer Pattern**: All data access goes through service interfaces, making backend integration seamless
2. **Frontend-Heavy**: Business logic lives in the frontend; backend is for persistence only
3. **Mock-First Development**: Full functionality with mock data, real backend optional
4. **Zustand for Global State**: Lightweight, TypeScript-friendly state management
5. **localStorage Persistence**: Auth and theme persist across sessions

---

## Directory Structure

```
client/src/
├── App.tsx                    # Root component, routing, providers
├── main.tsx                   # Entry point
├── index.css                  # Global styles, Tailwind config
│
├── types/
│   └── index.ts               # All TypeScript interfaces (40+ types)
│
├── store/
│   └── useStore.ts            # Zustand global state
│
├── services/                  # Service layer (mock implementations)
│   ├── index.ts               # Export barrel
│   ├── auth.service.ts        # Authentication
│   ├── clients.service.ts     # Client CRUD
│   ├── directives.service.ts  # Directive management
│   ├── groups.service.ts      # Group management
│   ├── bookings.service.ts    # Calendar & bookings
│   ├── referrals.service.ts   # Referral links
│   └── organizations.service.ts
│
├── mocks/                     # Mock data files
│   ├── clients.mock.ts
│   ├── directives.mock.ts
│   ├── groups.mock.ts
│   ├── mentors.mock.ts
│   ├── calendar.mock.ts
│   ├── dashboard.mock.ts
│   ├── analytics.mock.ts
│   ├── organizations.mock.ts
│   ├── program-templates.mock.ts
│   └── referrals.mock.ts
│
├── pages/                     # Route components
│   ├── dashboard.tsx          # Action center
│   ├── clients.tsx            # Client management table
│   ├── directives.tsx         # PT Directives management
│   ├── groups.tsx             # Group list
│   ├── group-detail.tsx       # Single group view (5 tabs)
│   ├── calendar.tsx           # Week view & availability
│   ├── analytics.tsx          # Business metrics
│   ├── settings.tsx           # Profile, notifications, security
│   ├── program-templates.tsx  # Template library
│   ├── program-template-builder.tsx
│   ├── booking.tsx            # Public booking page
│   ├── login.tsx              # Authentication
│   ├── signup.tsx
│   ├── landing.tsx            # Marketing page
│   ├── organization.tsx       # Org dashboard
│   ├── referral-landing.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                    # shadcn/ui components (50+ files)
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── priority-card.tsx
│   │   ├── needs-attention-section.tsx
│   │   ├── todays-sessions-section.tsx
│   │   ├── activity-feed-section.tsx
│   │   └── business-snapshot-section.tsx
│   ├── client-drawer/         # Client drawer tabs
│   │   ├── overview-tab.tsx
│   │   ├── progress-tab.tsx
│   │   ├── insights-tab.tsx
│   │   ├── directives-tab.tsx
│   │   ├── workout-plans-tab.tsx
│   │   └── permissions-tab.tsx
│   ├── groups/                # Group-specific components
│   │   ├── group-overview-tab.tsx
│   │   ├── group-members-tab.tsx
│   │   ├── group-message-board-tab.tsx
│   │   ├── group-directives-tab.tsx
│   │   ├── group-progress-tab.tsx
│   │   ├── create-group-modal.tsx
│   │   └── create-group-directive-modal.tsx
│   ├── program-templates/
│   │   └── create-group-from-template-modal.tsx
│   ├── app-sidebar.tsx        # Navigation sidebar
│   ├── header.tsx             # Page headers
│   ├── client-drawer.tsx      # Slide-over panel
│   ├── client-table.tsx       # Deprecated (use clients.tsx)
│   ├── directive-modal.tsx    # Create/edit directives
│   ├── delete-directive-dialog.tsx
│   ├── theme-provider.tsx     # Dark/light mode
│   ├── ask-pat-modal.tsx      # AI assistant modal
│   └── ...
│
├── hooks/
│   ├── use-toast.ts           # Toast notifications
│   └── use-mobile.tsx         # Responsive detection
│
└── lib/
    ├── queryClient.ts         # TanStack Query setup
    ├── utils.ts               # Utility functions (cn)
    └── export-utils.ts        # CSV/PDF export helpers
```

---

## Data Models

### Core Entities

#### User
```typescript
interface User {
  id: string;
  email: string;
  role: 'mentor' | 'manager' | 'admin';
  createdAt: Date;
}
```

#### MentorProfile
```typescript
interface MentorProfile {
  id: string;
  userId: string;
  displayName: string;
  specializations: string[];
  certifications: string[];
  bio: string;
  hourlyRate: number;
  availability: Record<string, string[]>;
  referralCode: string;
  avatarUrl: string;
  createdAt: Date;
}
```

#### Client
```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'pending' | 'trial' | 'suspended';
  role: 'client' | 'premium' | 'enterprise';
  progress: number;
  lastLogin: string;
  lastActive: string;
  joinedAt: Date;
  goals?: string[];
  metrics?: ClientMetrics;
  orgId?: string;
  groups?: string[];
}
```

### Directive System

#### MentorDirective
```typescript
interface MentorDirective {
  id: string;
  mentorId: string;
  name: string;
  description?: string;
  assignmentType: 'all' | 'group' | 'individual';
  clientId?: string;
  groupId?: string;
  directiveType: DirectiveType;
  trigger: DirectiveTrigger;
  dataPoints: DataPointConfig[];
  action: DirectiveAction;
  recipients: {
    sendToClient: boolean;
    sendToMentor: boolean;
  };
  delivery: {
    tone: 'encouraging' | 'neutral' | 'direct' | 'celebratory';
    urgency: 'low' | 'medium' | 'high';
    format: 'brief' | 'detailed' | 'bullet_points';
  };
  customMessage?: string;
  isActive: boolean;
  category: 'workout' | 'nutrition' | 'recovery' | 'motivation' | 'general';
  triggeredCount: number;
  effectivenessScore?: number;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Trigger Types
- **Event-based**: `workout_completed`, `meal_logged`, `streak_milestone`, etc.
- **Schedule-based**: Daily, weekly, monthly at specific times
- **Condition-based**: Metrics above/below thresholds
- **Program-timed**: Week X, Day Y relative to program start

### Group System

#### ClientGroup
```typescript
interface ClientGroup {
  id: string;
  mentorId: string;
  name: string;
  description?: string;
  type: GroupType;  // 'program_cohort' | 'custom' | 'promotion' | 'organization'
  color?: string;
  icon?: string;
  program?: ProgramInfo;
  clientIds: string[];
  maxCapacity?: number;
  isActive: boolean;
  isArchived: boolean;
  allowNewMembers: boolean;
  memberCount: number;
  avgProgress: number;
  avgCompliance: number;
  modules?: ProgramModule[];
  directives?: TemplateDirective[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Group Types
| Type | Purpose | Example |
|------|---------|---------|
| `program_cohort` | Structured program with timeline | "12-Week Shred - January Cohort" |
| `custom` | General grouping | "Morning Warriors" |
| `promotion` | Limited-time offers | "New Year Special" |
| `organization` | Gym/studio based | "FitLife Gym Members" |

### Program Templates

#### ProgramTemplate
```typescript
interface ProgramTemplate {
  id: string;
  mentorId: string;
  name: string;
  description: string;
  coverImage?: string;
  durationWeeks: number;
  modules: ProgramModule[];
  directives: TemplateDirective[];
  requireSequentialCompletion: boolean;
  allowSelfEnroll: boolean;
  price?: number;
  timesUsed: number;
  avgCompletionRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ProgramOffset (Program-Timed Directives)
```typescript
interface ProgramOffset {
  week: number;  // 1-based week number
  day: number;   // 1-7 (Mon-Sun)
}
```

### Additional Core Types

#### ClientMentorRelationship
```typescript
interface ClientMentorRelationship {
  id: string;
  clientId: string;
  mentorId: string;
  orgId?: string;
  domains: ('workout' | 'nutrition' | 'mindset' | 'all')[];
  status: 'pending' | 'active' | 'paused' | 'ended';
  createdAt: Date;
}
```

#### ClientPermission
```typescript
interface ClientPermission {
  id: string;
  clientId: string;
  mentorId: string;
  dataCategory: 'workout' | 'nutrition' | 'sleep' | 'chat' | 'progress_photos' | 'body_metrics';
  accessLevel: 'none' | 'view' | 'view_edit' | 'full';
}
```

#### Booking
```typescript
interface Booking {
  id: string;
  mentorId: string;
  clientId: string;
  clientName?: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  calendarEventId?: string;
  notes?: string;
}
```

#### GroupPost
```typescript
interface GroupPost {
  id: string;
  groupId: string;
  mentorId: string;
  title?: string;
  content: string;
  attachments?: GroupPostAttachment[];
  isPinned: boolean;
  notifyMembers: boolean;
  viewCount: number;
  reactions: Record<string, string[]>;  // reaction -> userIds
  createdAt: Date;
  updatedAt: Date;
}
```

#### GroupComment
```typescript
interface GroupComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userType: 'mentor' | 'client';
  content: string;
  createdAt: Date;
}
```

#### Organization
```typescript
interface Organization {
  id: string;
  name: string;
  type: 'gym' | 'studio' | 'independent';
  logoUrl?: string;
  brandingConfig: Record<string, unknown>;
  createdAt: Date;
}
```

#### AIInsight
```typescript
interface AIInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'alert' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionable?: boolean;
  suggestedAction?: string;
}
```

#### ReferralLink
```typescript
interface ReferralLink {
  id: string;
  mentorId: string;
  code: string;
  orgId?: string;
  clickCount: number;
  conversions: number;
  createdAt: Date;
}
```

#### Availability (Calendar)
```typescript
interface Availability {
  id: string;
  mentorId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  isActive: boolean;
}
```

#### BookingSettings
```typescript
interface BookingSettings {
  mentorId: string;
  defaultSessionLength: number;
  bufferBetweenSessions: number;
  minimumNotice: number;
  maximumAdvanceBooking: number;
  defaultMeetingType: 'in_person' | 'zoom' | 'google_meet';
  zoomConnected: boolean;
  googleMeetConnected: boolean;
  autoGenerateMeetingLink: boolean;
  sendReminder24h: boolean;
  sendReminder1h: boolean;
}
```

#### AnalyticsData
```typescript
interface AnalyticsData {
  mrr: number;
  mrrChange: number;
  revenueByMonth: { month: string; revenue: number }[];
  revenueBySource: { source: string; amount: number; percentage: number }[];
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  churnedClientsThisMonth: number;
  churnRate: number;
  retentionRate: number;
  avgClientLifespan: number;
  revenuePerClient: number;
  ltv: number;
  avgCompliance: number;
  complianceChange: number;
  sessionsCompleted: number;
  directivesTriggered: number;
  avgDirectiveEffectiveness: number;
  complianceByGroup: { groupName: string; compliance: number }[];
  retentionCohort: { month: string; retained: number }[];
  topClientsByLtv: { client: Client; ltv: number }[];
  atRiskClients: { client: Client; compliance: number }[];
}
```

### Trigger & Action Types

#### TriggerEvent (14 types)
```typescript
type TriggerEvent = 
  | 'workout_completed' | 'workout_missed' | 'meal_logged'
  | 'day_end' | 'week_end' | 'streak_milestone'
  | 'weight_logged' | 'goal_achieved' | 'check_in_time'
  | 'rest_day' | 'before_workout' | 'app_opened'
  | 'inactive_period';
```

#### DataPoint (18 types)
```typescript
type DataPoint =
  | 'workout_summary' | 'workout_volume' | 'workout_duration'
  | 'exercises_completed' | 'intensity_rating' | 'calories_burned'
  | 'protein_intake' | 'calorie_intake' | 'water_intake'
  | 'sleep_hours' | 'sleep_quality' | 'weight'
  | 'body_measurements' | 'streak_count' | 'weekly_compliance'
  | 'mood_rating' | 'energy_level' | 'progress_photos'
  | 'personal_records';
```

---

## Services Layer

### Service Pattern

Each service follows this pattern:
1. **Interface definition** with typed methods
2. **Mock implementation** with simulated delays
3. **In-memory state** for CRUD operations
4. **Promise-based** for async compatibility

### Available Services

#### authService
```typescript
interface AuthService {
  login(email: string, password: string): Promise<User>;
  signup(email: string, password: string, role: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getMentorProfile(userId: string): Promise<MentorProfile | null>;
  updateMentorProfile(profile: Partial<MentorProfile>): Promise<MentorProfile>;
}
```

#### clientsService
```typescript
interface ClientsService {
  getClients(mentorId: string): Promise<Client[]>;
  getClient(clientId: string): Promise<Client | null>;
  getClientProgress(clientId: string, days: number): Promise<ProgressData[]>;
  getClientInsights(clientId: string): Promise<AIInsight[]>;
  getClientPermissions(clientId: string, mentorId: string): Promise<ClientPermission[]>;
  updateClientPermission(permission: Partial<ClientPermission>): Promise<ClientPermission>;
  inviteClient(email: string, mentorId: string): Promise<{ inviteLink: string }>;
  updateClientStatus(clientId: string, status: Client['status']): Promise<Client>;
  getWorkoutPlans(clientId: string): Promise<WorkoutPlan[]>;
}
```

#### directivesService
```typescript
interface DirectivesService {
  getDirectives(mentorId: string): Promise<MentorDirective[]>;
  getDirectivesByClient(clientId: string): Promise<MentorDirective[]>;
  createDirective(directive: Omit<...>): Promise<MentorDirective>;
  updateDirective(id: string, updates: Partial<MentorDirective>): Promise<MentorDirective>;
  deleteDirective(id: string): Promise<void>;
  toggleDirectiveActive(id: string): Promise<MentorDirective>;
  duplicateDirective(id: string): Promise<MentorDirective>;
}
```

#### groupsService
```typescript
const groupsService = {
  getAll(): Promise<ClientGroup[]>;
  getById(id: string): Promise<ClientGroup | undefined>;
  getByType(type: GroupType): Promise<ClientGroup[]>;
  create(group: Omit<...>): Promise<ClientGroup>;
  update(id: string, updates: Partial<ClientGroup>): Promise<ClientGroup | undefined>;
  delete(id: string): Promise<boolean>;
  archive(id: string): Promise<ClientGroup | undefined>;
  addMembers(id: string, clientIds: string[]): Promise<ClientGroup | undefined>;
  removeMembers(id: string, clientIds: string[]): Promise<ClientGroup | undefined>;
  
  // Message Board
  getPosts(groupId: string): Promise<GroupPost[]>;
  getPostsWithComments(groupId: string): Promise<{ posts: GroupPost[]; comments: Record<string, GroupComment[]> }>;
  createPost(post: Omit<...>): Promise<GroupPost>;
  updatePost(id: string, updates: Partial<GroupPost>): Promise<GroupPost | undefined>;
  deletePost(id: string): Promise<boolean>;
  addReaction(postId: string, userId: string, reaction: string): Promise<GroupPost | undefined>;
  removeReaction(postId: string, userId: string, reaction: string): Promise<GroupPost | undefined>;
  
  // Comments
  getComments(postId: string): Promise<GroupComment[]>;
  addComment(comment: Omit<...>): Promise<GroupComment>;
  deleteComment(id: string): Promise<boolean>;
}
```

---

## State Management

### Zustand Store Structure

```typescript
interface AppState {
  // Authentication
  user: User | null;
  mentorProfile: MentorProfile | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setMentorProfile: (profile: MentorProfile | null) => void;
  
  // Client Management
  clients: Client[];
  selectedClientId: string | null;
  setClients: (clients: Client[]) => void;
  setSelectedClientId: (id: string | null) => void;
  
  // UI State
  sidebarOpen: boolean;
  clientDrawerOpen: boolean;
  darkMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  setClientDrawerOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}
```

### State Flow

```
User Action
    │
    ▼
┌─────────────┐
│   Service   │  ← API call (mock or real)
└─────────────┘
    │
    ▼
┌─────────────┐
│   Zustand   │  ← Update global state
│   Store     │
└─────────────┘
    │
    ▼
┌─────────────┐
│  Component  │  ← Re-render with new state
│  Re-render  │
└─────────────┘
```

### localStorage Keys

| Key | Purpose |
|-----|---------|
| `hipat_user` | Persisted user session (JSON) |
| `hipat_theme` | Dark/light mode preference ('dark' or 'light') |

---

## Components Library

### UI Components (shadcn/ui)

50+ pre-built components including:
- **Layout**: Card, Sheet, Dialog, Drawer, Sidebar
- **Forms**: Input, Textarea, Select, Checkbox, Switch, Form
- **Display**: Avatar, Badge, Progress, Skeleton, Table
- **Navigation**: Tabs, Menubar, Dropdown, Breadcrumb
- **Feedback**: Toast, Alert, Tooltip

### Custom Components

#### AppSidebar
Main navigation with collapsible groups:
- Dashboard, Clients, Directives, Groups, Calendar, Analytics, Settings

#### ClientDrawer
6-tab slide-over panel:
1. **Overview**: Basic info, goals, domain assignments
2. **Progress**: Charts, compliance metrics
3. **AI Summary**: Pat-generated insights
4. **Directives**: Client-specific directives
5. **Workouts**: Assigned workout plans
6. **Permissions**: Data access controls

#### AskPatModal
AI assistant interface (Cmd+K to open):
- Quick actions
- Context-aware suggestions
- Chat interface placeholder

---

## Pages & Routing

### Route Configuration

| Route | Component | Auth | Purpose |
|-------|-----------|------|---------|
| `/` | Landing/Dashboard | Conditional | Home page |
| `/login` | Login | No | Authentication |
| `/signup` | Signup | No | Registration |
| `/dashboard` | Dashboard | Yes | Action center |
| `/clients` | Clients | Yes | Client management |
| `/directives` | Directives | Yes | PT Directives |
| `/groups` | Groups | Yes | Group list |
| `/groups/:id` | GroupDetail | Yes | Group detail (5 tabs) |
| `/calendar` | Calendar | Yes | Week view, availability |
| `/analytics` | Analytics | Yes | Business metrics |
| `/settings` | Settings | Yes | Profile, notifications |
| `/program-templates` | ProgramTemplates | Yes | Template library |
| `/program-templates/:id` | ProgramTemplateBuilder | Yes | Template editor |
| `/org/:id` | OrganizationDashboard | Yes | Org management |
| `/book/:mentorSlug` | BookingPage | No | Public booking |
| `/ref/:code` | ReferralLanding | No | Referral tracking |

### Page Purposes

#### Dashboard (Action Center)
- Priority cards (awaiting input, check-ins)
- Needs Attention list (compliance drops)
- Today's Sessions
- Activity Feed
- Business Snapshot

#### Clients (Data Management)
- Searchable data table
- Status/group filtering
- Sortable columns
- Bulk actions
- CSV export

#### Directives
- Full CRUD interface
- Category filtering
- Active/inactive toggle
- Assignment type management

#### Groups
- 4 group types with visual indicators
- Create from templates
- Member management
- Message board with reactions/comments

---

## Authentication Flow

### Current Implementation (Mock)

```
┌──────────────┐
│  Login Page  │
│  Get Started │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  authService.login() │
│  Validate credentials│
└──────────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  Store user in       │
│  localStorage        │
└──────────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  setUser() in store  │
│  isAuthenticated=true│
└──────────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  Redirect to         │
│  /dashboard          │
└──────────────────────┘
```

### Protected Routes

```typescript
function ProtectedRoute({ children }) {
  // 1. Check localStorage for existing session
  // 2. If found, restore user to store
  // 3. If not found, redirect to /login
  // 4. Show loading state while checking
}
```

---

## Key Features

### Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| Dashboard | Complete | Action center with priority cards |
| Client Table | Complete | Sortable, filterable, exportable |
| Client Drawer | Complete | 6-tab detail panel |
| PT Directives | Complete | Full CRUD with triggers |
| Groups | Complete | 4 types with message board |
| Program Templates | Complete | Create cohorts from templates |
| Calendar | Complete | Week view, availability editing |
| Public Booking | Complete | Client-facing booking page |
| Analytics | Complete | Business metrics dashboard |
| Settings | Complete | Profile, notifications, security |
| Dark Mode | Complete | Theme toggle with persistence |
| Ask Pat Modal | Partial | UI only, no AI integration |

### Directive Capabilities

- **Trigger Events**: 14 event types (workout_completed, meal_logged, etc.)
- **Data Points**: 18 metrics (calories, sleep, weight, etc.)
- **Actions**: Analyze, summarize, compare, alert, remind, encourage
- **Delivery**: Tone, urgency, format customization
- **Assignment**: All clients, specific group, individual

---

## Mock Data Strategy

### Data Files

| File | Records | Purpose |
|------|---------|---------|
| clients.mock.ts | 6 clients | Sample client profiles |
| directives.mock.ts | 4 directives | Example directive configurations |
| groups.mock.ts | 4 groups | One of each group type |
| mentors.mock.ts | 1 mentor | Demo mentor profile |
| dashboard.mock.ts | Activities | Dashboard feed data |
| analytics.mock.ts | Metrics | Business statistics |
| calendar.mock.ts | Bookings | Sample appointments |

### Simulated Delays

All service methods include artificial delays (100-500ms) to simulate network latency and provide realistic loading states.

---

## Testing Guidelines

### data-testid Convention

All interactive elements have `data-testid` attributes:

```
Pattern: {action}-{target} or {type}-{content}-{id}

Examples:
- button-login
- input-email
- row-client-${clientId}
- badge-status-${clientId}
- menu-view-profile-${clientId}
```

### Test Coverage Areas

1. **Authentication**: Login, logout, session persistence
2. **Client Management**: CRUD, filtering, sorting, export
3. **Directives**: Create, edit, toggle, delete
4. **Groups**: Create, add/remove members, message board
5. **Routing**: Protected routes, public routes, redirects

---

## Improvement Recommendations

### Priority 1: Critical (Before Production)

#### 1.1 Real Backend Integration
**Current**: Mock services with in-memory data  
**Recommended**: 
- Implement Express API routes in `server/routes.ts`
- Use Drizzle ORM with PostgreSQL (already installed)
- Swap service implementations to call real API

```typescript
// Future: client/src/services/clients.service.ts
export const clientsService: ClientsService = {
  async getClients(mentorId: string): Promise<Client[]> {
    const response = await fetch(`/api/clients?mentorId=${mentorId}`);
    return response.json();
  },
  // ...
};
```

#### 1.2 Real Authentication
**Current**: Hardcoded demo credentials, localStorage  
**Recommended**:
- Integrate Replit Auth or third-party OAuth (Google, Apple)
- Implement proper session management with httpOnly cookies
- Add password hashing with bcrypt

#### 1.3 Input Validation & Sanitization
**Current**: Basic form validation  
**Recommended**:
- Add Zod validation on all API endpoints
- Sanitize user inputs to prevent XSS
- Add rate limiting on authentication endpoints

### Priority 2: High (Production Ready)

#### 2.1 Error Handling
**Current**: Console.log errors, generic toast messages  
**Recommended**:
- Implement error boundary components
- Add structured error logging (Sentry, LogRocket)
- Create user-friendly error states

#### 2.2 Loading States
**Current**: Simple loading spinners  
**Recommended**:
- Add skeleton screens for all data-heavy pages
- Implement optimistic updates for better UX
- Add retry logic for failed requests

#### 2.3 Accessibility
**Current**: Basic semantic HTML  
**Recommended**:
- Add ARIA labels to all interactive elements
- Implement keyboard navigation for modals
- Test with screen readers
- Add focus management for drawer/modal

### Priority 3: Medium (Enhanced UX)

#### 3.1 Real-time Updates
**Current**: Manual refresh required  
**Recommended**:
- Implement WebSocket connection for live updates
- Add notification system for new activities
- Real-time message board updates

#### 3.2 Offline Support
**Current**: No offline capability  
**Recommended**:
- Add service worker for caching
- Implement offline-first data strategy
- Queue actions for sync when online

#### 3.3 Performance Optimization
**Current**: Loads all data upfront  
**Recommended**:
- Implement pagination for client list
- Add virtual scrolling for large lists
- Lazy load route components
- Optimize bundle size with code splitting

### Priority 4: Nice to Have

#### 4.1 AI Integration
**Current**: UI placeholder only  
**Recommended**:
- Integrate OpenAI/Anthropic API
- Implement actual directive execution
- Add Pat conversation history

#### 4.2 Notifications
**Current**: Toast messages only  
**Recommended**:
- Push notifications for mobile
- Email notifications for important events
- In-app notification center

#### 4.3 Analytics Enhancement
**Current**: Mock data visualization  
**Recommended**:
- Real data aggregation
- Custom date ranges
- Export reports as PDF

#### 4.4 Mobile App
**Current**: Responsive web only  
**Recommended**:
- React Native companion app
- Mentor mobile experience
- Push notification integration

### Technical Debt

1. **Unused Imports**: Clean up unused imports across files
2. **Component Consolidation**: Merge similar components
3. **Type Exports**: Some types should be in shared schema
4. **Service Interfaces**: Not all services have TypeScript interfaces
5. **Test Coverage**: No automated tests currently exist

### Security Checklist

- [ ] Move to httpOnly cookies for auth
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy headers
- [ ] Rate limit API endpoints
- [ ] Validate file uploads
- [ ] Encrypt sensitive data at rest
- [ ] Audit third-party dependencies
- [ ] Implement proper CORS configuration

---

## Appendix

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Express session encryption |
| `DATABASE_URL` | PostgreSQL connection (future) |
| `VITE_*` | Frontend environment variables |

### Build Commands

```bash
# Development
npm run dev        # Start dev server on port 5000

# Production
npm run build      # Build for production
npm run start      # Start production server
```

### Database Schema (Future)

When implementing the real backend, create these tables:
- users
- mentor_profiles
- clients
- client_mentor_relationships
- directives
- groups
- group_posts
- group_comments
- bookings
- referral_links
- organizations

---

*Document generated for HiPat Client Management Tool v1.0.0*
