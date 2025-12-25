# MentorAI Codebase Map

A comprehensive documentation of the entire codebase structure, components, types, and features.

---

## 1. FILE STRUCTURE

### Root Files
| File | Description |
|------|-------------|
| `package.json` | Node.js dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vite build configuration with aliases |
| `tailwind.config.ts` | Tailwind CSS theme and plugins |
| `postcss.config.js` | PostCSS configuration |
| `drizzle.config.ts` | Drizzle ORM configuration |
| `components.json` | shadcn/ui component configuration |
| `design_guidelines.md` | UI/UX design system documentation |
| `replit.md` | Project overview and preferences |
| `BUILD_SUMMARY.md` | Build phase 1 documentation |
| `BUILD_SUMMARY_FIX_1.md` | Build fixes documentation |
| `BUILD_SUMMARY_PHASE_3_5.md` | Phase 3.5 feature documentation |
| `PROJECT_DOCUMENTATION.md` | Detailed project documentation |

### Client Source (`client/src/`)

#### Pages (`client/src/pages/`)
| File | Description |
|------|-------------|
| `dashboard.tsx` | Main analytics dashboard with KPI cards and AI forecasting |
| `clients.tsx` | Client list with AI tags, search, and filtering |
| `directives.tsx` | PT Directives management page |
| `groups.tsx` | Group management list page |
| `group-detail.tsx` | Individual group detail view with tabs |
| `calendar.tsx` | Week view calendar with availability editing |
| `analytics.tsx` | Advanced analytics and charts |
| `settings.tsx` | User settings with multiple tabs |
| `program-templates.tsx` | Program library with template cards |
| `program-template-builder.tsx` | Template creation/editing page |
| `login.tsx` | User login page |
| `signup.tsx` | User registration page |
| `landing.tsx` | Public landing page |
| `booking.tsx` | Public booking page for clients |
| `referral-landing.tsx` | Referral link landing page |
| `organization.tsx` | Organization dashboard |
| `organization-team.tsx` | Organization team management |
| `not-found.tsx` | 404 error page |

#### Components (`client/src/components/`)
| File | Description |
|------|-------------|
| `app-sidebar.tsx` | Main navigation sidebar with MentorAI branding |
| `header.tsx` | Page header with title, search, and actions |
| `client-drawer.tsx` | Slide-over panel for client details (6 tabs) |
| `client-table.tsx` | Client list table with sorting and actions |
| `directive-modal.tsx` | Create/edit directive modal form |
| `delete-directive-dialog.tsx` | Confirmation dialog for directive deletion |
| `ask-pat-modal.tsx` | AI assistant chat modal |
| `invite-client-dialog.tsx` | Client invitation modal |
| `export-dropdown.tsx` | Export data dropdown (CSV, PDF, JSON) |
| `metric-card.tsx` | Reusable metric display card |
| `domain-assignment.tsx` | Domain assignment configuration |
| `theme-provider.tsx` | Dark/light mode theme context |

#### Client Drawer Tabs (`client/src/components/client-drawer/`)
| File | Description |
|------|-------------|
| `overview-tab.tsx` | Client overview with goals and metrics |
| `progress-tab.tsx` | Client progress charts and history |
| `insights-tab.tsx` | AI-generated insights for client |
| `directives-tab.tsx` | Client-specific directives list |
| `workout-plans-tab.tsx` | Assigned workout plans |
| `permissions-tab.tsx` | Data access permissions configuration |

#### Dashboard Components (`client/src/components/dashboard/`)
| File | Description |
|------|-------------|
| `index.ts` | Barrel export for dashboard components |
| `activity-feed-section.tsx` | Real-time client activity feed |
| `business-snapshot-section.tsx` | Business metrics summary |
| `needs-attention-section.tsx` | Clients needing immediate attention |
| `todays-sessions-section.tsx` | Today's scheduled sessions |
| `priority-card.tsx` | Priority item display card |

#### Group Components (`client/src/components/groups/`)
| File | Description |
|------|-------------|
| `index.ts` | Barrel export for group components |
| `group-overview-tab.tsx` | Group summary and stats |
| `group-members-tab.tsx` | Member list with management actions |
| `group-message-board-tab.tsx` | Group posts and comments |
| `group-directives-tab.tsx` | Group-specific directives |
| `group-progress-tab.tsx` | Group progress analytics |
| `create-group-modal.tsx` | New group creation form |
| `create-group-directive-modal.tsx` | Group directive creation form |

#### Program Template Components (`client/src/components/program-templates/`)
| File | Description |
|------|-------------|
| `create-group-from-template-modal.tsx` | Create cohort from template |

#### UI Components (`client/src/components/ui/`)
Full shadcn/ui component library including:
- Layout: `card`, `sidebar`, `sheet`, `drawer`, `dialog`, `tabs`, `accordion`
- Forms: `input`, `textarea`, `select`, `checkbox`, `switch`, `radio-group`, `form`, `label`
- Buttons: `button`, `toggle`, `toggle-group`
- Display: `avatar`, `badge`, `skeleton`, `progress`, `chart`, `table`
- Overlays: `popover`, `tooltip`, `dropdown-menu`, `context-menu`, `hover-card`
- Feedback: `toast`, `toaster`, `alert`, `alert-dialog`
- Navigation: `breadcrumb`, `navigation-menu`, `menubar`, `pagination`

#### Services (`client/src/services/`)
| File | Description |
|------|-------------|
| `index.ts` | Barrel export for all services |
| `auth.service.ts` | Authentication (login, signup, logout) |
| `clients.service.ts` | Client CRUD and data operations |
| `directives.service.ts` | Directive CRUD operations |
| `bookings.service.ts` | Booking/calendar operations |
| `groups.service.ts` | Group and post management |
| `referrals.service.ts` | Referral link operations |
| `organizations.service.ts` | Organization management |

#### Mock Data (`client/src/mocks/`)
| File | Description |
|------|-------------|
| `clients.mock.ts` | Sample client data with metrics |
| `directives.mock.ts` | Sample PT directives |
| `groups.mock.ts` | Sample groups, posts, and comments |
| `mentors.mock.ts` | Mentor profile and bookings |
| `dashboard.mock.ts` | Dashboard activity and stats |
| `analytics.mock.ts` | Analytics data and charts |
| `calendar.mock.ts` | Availability and blocked times |
| `program-templates.mock.ts` | Program template samples |
| `organizations.mock.ts` | Organization data |
| `referrals.mock.ts` | Referral link data |

#### Other Client Files
| File | Description |
|------|-------------|
| `App.tsx` | Root component with routing and providers |
| `main.tsx` | Application entry point |
| `index.css` | Global styles and CSS variables |
| `types/index.ts` | All TypeScript interfaces |
| `store/useStore.ts` | Zustand global state |
| `hooks/use-toast.ts` | Toast notification hook |
| `hooks/use-mobile.tsx` | Mobile detection hook |
| `lib/utils.ts` | Utility functions (cn, etc.) |
| `lib/queryClient.ts` | React Query configuration |
| `lib/export-utils.ts` | Export to CSV/PDF/JSON utilities |

### Server (`server/`)
| File | Description |
|------|-------------|
| `index.ts` | Express server entry point |
| `routes.ts` | API route definitions |
| `storage.ts` | In-memory storage interface |
| `static.ts` | Static file serving configuration |
| `vite.ts` | Vite dev server integration |

### Shared (`shared/`)
| File | Description |
|------|-------------|
| `schema.ts` | Drizzle database schema (currently minimal) |

---

## 2. ROUTES

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | `Landing` / redirect | No | Landing page or redirect to dashboard |
| `/login` | `Login` | No | User login form |
| `/signup` | `Signup` | No | User registration form |
| `/ref/:code` | `ReferralLanding` | No | Referral link landing |
| `/dashboard` | `Dashboard` | Yes | Main analytics dashboard |
| `/clients` | `Clients` | Yes | Client management list |
| `/directives` | `Directives` | Yes | PT Directives management |
| `/groups` | `Groups` | Yes | Group management list |
| `/groups/:id` | `GroupDetail` | Yes | Individual group detail |
| `/calendar` | `CalendarPage` | Yes | Calendar and availability |
| `/analytics` | `Analytics` | Yes | Advanced analytics |
| `/settings` | `Settings` | Yes | User settings |
| `/program-templates` | `ProgramTemplates` | Yes | Program library |
| `/program-templates/:id` | `ProgramTemplateBuilder` | Yes | Template builder |
| `/org/:id` | `OrganizationDashboard` | Yes | Organization view |
| `/org/:id/team` | Redirect | Yes | Redirects to org with team tab |
| `/book/:mentorSlug` | `BookingPage` | No | Public booking page |
| `*` | `NotFound` | No | 404 page |

---

## 3. COMPONENTS

### Core Components

#### `AppSidebar`
- **Props:** None
- **Purpose:** Main navigation sidebar with MentorAI branding, user profile, and navigation links
- **Features:** Collapsible, 8 nav items, Ask Pat button, dark mode toggle

#### `Header`
- **Props:** `{ title: string, showInvite?: boolean, showExport?: boolean, onAskPat?: () => void }`
- **Purpose:** Page header with title, actions, and optional features
- **Features:** Search, invite client, export dropdown

#### `ClientDrawer`
- **Props:** None (uses Zustand store for state)
- **Purpose:** Slide-over panel showing client details with 6 tabs
- **Tabs:** Overview, Progress, AI Summary, Directives, Workouts, Permissions

#### `ClientTable`
- **Props:** `{ clients: Client[], onViewClient: (id: string) => void, onMessageClient: (id: string) => void }`
- **Purpose:** Sortable client list with AI tags, status badges, and actions

#### `DirectiveModal`
- **Props:** `{ isOpen: boolean, onClose: () => void, directive?: MentorDirective, onSave: (directive) => void }`
- **Purpose:** Create/edit directive with multi-step form

#### `AskPatModal`
- **Props:** `{ isOpen: boolean, onClose: () => void }`
- **Purpose:** AI assistant chat interface

### Dashboard Components

#### `NeedsAttentionSection`
- **Props:** `{ clients: NeedsAttentionClient[], onViewClient, onMessageClient }`
- **Purpose:** Lists clients with declining compliance

#### `TodaysSessionsSection`
- **Props:** `{ sessions: Booking[] }`
- **Purpose:** Shows today's scheduled sessions

#### `ActivityFeedSection`
- **Props:** `{ activities: ClientActivity[], onViewClient }`
- **Purpose:** Real-time client activity feed

#### `BusinessSnapshotSection`
- **Props:** `{ stats: BusinessStats }`
- **Purpose:** Business metrics summary cards

### Group Components

#### `GroupOverviewTab`
- **Props:** `{ group: ClientGroup }`
- **Purpose:** Group summary with type, program info, and stats

#### `GroupMembersTab`
- **Props:** `{ group: ClientGroup, clients: Client[], onAddMembers, onRemoveMember }`
- **Purpose:** Member list with add/remove functionality

#### `GroupMessageBoardTab`
- **Props:** `{ group: ClientGroup }`
- **Purpose:** Posts with comments and reactions

#### `GroupDirectivesTab`
- **Props:** `{ group: ClientGroup }`
- **Purpose:** Group-specific directives management

#### `GroupProgressTab`
- **Props:** `{ group: ClientGroup, clients: Client[] }`
- **Purpose:** Group progress analytics and charts

---

## 4. TYPES

### Core Entities

```typescript
interface User {
  id: string;
  email: string;
  role: 'mentor' | 'manager' | 'admin';
  createdAt: Date;
}

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

interface ClientMetrics {
  tdee: number;
  bmr: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  hydrationGoal: number;
  bodyFatPercent?: number;
  weight?: number;
}
```

### Directives

```typescript
type TriggerEvent = 
  | 'workout_completed' | 'workout_missed' | 'meal_logged' | 'day_end'
  | 'week_end' | 'streak_milestone' | 'weight_logged' | 'goal_achieved'
  | 'check_in_time' | 'rest_day' | 'before_workout' | 'app_opened' | 'inactive_period';

type DirectiveType = 'analysis' | 'summary' | 'alert' | 'reminder' | 'encouragement' | 'check_in' | 'coaching_cue';

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
  recipients: { sendToClient: boolean; sendToMentor: boolean };
  delivery: { tone: string; urgency: string; format: string };
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

### Groups

```typescript
type GroupType = 'program_cohort' | 'custom' | 'promotion' | 'organization';

interface ClientGroup {
  id: string;
  mentorId: string;
  name: string;
  description?: string;
  type: GroupType;
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
  reactions: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Programs

```typescript
type PatInsightType = 'positive' | 'optimization' | 'data_trend';

interface ProgramTemplate {
  id: string;
  mentorId: string;
  name: string;
  description: string;
  coverImage?: string;
  coverGradient?: string;
  durationWeeks: number;
  modules: ProgramModule[];
  directives: TemplateDirective[];
  requireSequentialCompletion: boolean;
  allowSelfEnroll: boolean;
  price?: number;
  timesUsed: number;
  avgCompletionRate: number;
  activeUsers: number;
  patInsight?: PatInsight;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProgramModule {
  id: string;
  week: number;
  day?: number;
  title: string;
  description?: string;
  type: 'video' | 'pdf' | 'workout' | 'quiz' | 'checkin' | 'text';
  content: { url?: string; videoUrl?: string; pdfUrl?: string; workoutId?: string; textContent?: string; questions?: QuizQuestion[] };
  requiresCompletion: boolean;
  estimatedMinutes?: number;
}
```

### Calendar & Booking

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

interface Availability {
  id: string;
  mentorId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

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

### Analytics

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

---

## 5. SERVICES

### `authService`
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `login` | `email: string, password: string` | `Promise<User>` | Authenticate user |
| `signup` | `email: string, password: string, role: string` | `Promise<User>` | Register new user |
| `logout` | None | `Promise<void>` | Clear session |
| `getCurrentUser` | None | `Promise<User \| null>` | Get logged-in user from localStorage |
| `getMentorProfile` | `userId: string` | `Promise<MentorProfile \| null>` | Get mentor profile |
| `updateMentorProfile` | `profile: Partial<MentorProfile>` | `Promise<MentorProfile>` | Update profile |

**Demo Credentials:** `info@hipat.app` / `admin123`

### `clientsService`
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getClients` | `mentorId: string` | `Promise<Client[]>` | Get all clients |
| `getClient` | `clientId: string` | `Promise<Client \| null>` | Get single client |
| `getClientProgress` | `clientId: string, days: number` | `Promise<ProgressData[]>` | Get progress data |
| `getClientInsights` | `clientId: string` | `Promise<AIInsight[]>` | Get AI insights |
| `getClientPermissions` | `clientId: string, mentorId: string` | `Promise<ClientPermission[]>` | Get permissions |
| `updateClientPermission` | `permission: Partial<ClientPermission>` | `Promise<ClientPermission>` | Update permission |
| `inviteClient` | `email: string, mentorId: string` | `Promise<{ inviteLink: string }>` | Generate invite |
| `updateClientStatus` | `clientId: string, status: string` | `Promise<Client>` | Update status |
| `getWorkoutPlans` | `clientId: string` | `Promise<WorkoutPlan[]>` | Get workout plans |

### `directivesService`
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getDirectives` | `mentorId: string` | `Promise<MentorDirective[]>` | Get all directives |
| `getDirectivesByClient` | `clientId: string` | `Promise<MentorDirective[]>` | Get client directives |
| `createDirective` | `directive: Omit<...>` | `Promise<MentorDirective>` | Create new directive |
| `updateDirective` | `id: string, updates: Partial<...>` | `Promise<MentorDirective>` | Update directive |
| `deleteDirective` | `id: string` | `Promise<void>` | Delete directive |
| `toggleDirectiveActive` | `id: string` | `Promise<MentorDirective>` | Toggle active state |
| `duplicateDirective` | `id: string` | `Promise<MentorDirective>` | Duplicate directive |

### `bookingsService`
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getBookings` | `mentorId: string` | `Promise<Booking[]>` | Get all bookings |
| `getBookingsByDate` | `mentorId: string, date: Date` | `Promise<Booking[]>` | Get bookings for date |
| `createBooking` | `booking: Omit<Booking, 'id'>` | `Promise<Booking>` | Create booking |
| `updateBooking` | `id: string, updates: Partial<...>` | `Promise<Booking>` | Update booking |
| `cancelBooking` | `id: string` | `Promise<void>` | Cancel booking |

### `groupsService`
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getAll` | None | `Promise<ClientGroup[]>` | Get all groups |
| `getById` | `id: string` | `Promise<ClientGroup \| undefined>` | Get single group |
| `getByType` | `type: GroupType` | `Promise<ClientGroup[]>` | Get by type |
| `create` | `group: Omit<...>` | `Promise<ClientGroup>` | Create group |
| `update` | `id: string, updates: Partial<...>` | `Promise<ClientGroup \| undefined>` | Update group |
| `delete` | `id: string` | `Promise<boolean>` | Delete group |
| `archive` | `id: string` | `Promise<ClientGroup \| undefined>` | Archive group |
| `addMembers` | `id: string, clientIds: string[]` | `Promise<ClientGroup \| undefined>` | Add members |
| `removeMembers` | `id: string, clientIds: string[]` | `Promise<ClientGroup \| undefined>` | Remove members |
| `getPosts` | `groupId: string` | `Promise<GroupPost[]>` | Get group posts |
| `getPostsWithComments` | `groupId: string` | `Promise<{posts, comments}>` | Get posts + comments |
| `createPost` | `post: Omit<...>` | `Promise<GroupPost>` | Create post |
| `updatePost` | `id: string, updates: Partial<...>` | `Promise<GroupPost \| undefined>` | Update post |
| `deletePost` | `id: string` | `Promise<boolean>` | Delete post |
| `addReaction` | `postId, userId, reaction` | `Promise<GroupPost \| undefined>` | Add reaction |
| `removeReaction` | `postId, userId, reaction` | `Promise<GroupPost \| undefined>` | Remove reaction |
| `getComments` | `postId: string` | `Promise<GroupComment[]>` | Get comments |
| `addComment` | `comment: Omit<...>` | `Promise<GroupComment>` | Add comment |
| `deleteComment` | `id: string` | `Promise<boolean>` | Delete comment |

---

## 6. MOCK DATA

| File | Contents |
|------|----------|
| `clients.mock.ts` | 6 sample clients with full profiles, metrics, progress data, AI insights, permissions, workout plans |
| `directives.mock.ts` | 8 sample directives across categories (workout, nutrition, recovery, motivation) |
| `groups.mock.ts` | 4 sample groups (program cohort, custom, promotion, organization), posts with comments |
| `mentors.mock.ts` | Mentor profile, sample bookings |
| `dashboard.mock.ts` | Recent activity feed, needs attention clients, business stats, today's sessions |
| `analytics.mock.ts` | Full analytics data: MRR, revenue charts, retention cohorts, at-risk clients |
| `calendar.mock.ts` | Weekly availability, blocked times |
| `program-templates.mock.ts` | 6 program templates with Pat's Insights, modules, directives |
| `organizations.mock.ts` | Organization data |
| `referrals.mock.ts` | Referral link data |

---

## 7. STATE MANAGEMENT

### Zustand Store (`useStore`)

```typescript
interface AppState {
  // Auth
  user: User | null;
  mentorProfile: MentorProfile | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setMentorProfile: (profile: MentorProfile | null) => void;
  
  // Clients
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

### Local Storage Keys
| Key | Purpose |
|-----|---------|
| `hipat_user` | Persisted user session |
| `hipat_theme` | Dark/light mode preference |

### React Context
- `AskPatContext` - Provides `openAskPat()` function globally via `useAskPat()` hook

---

## 8. FEATURES BY PAGE

### Dashboard (`/dashboard`)

| Feature | Element | Action |
|---------|---------|--------|
| Date Range Filter | Button | Opens date picker dropdown |
| Export Report | Dropdown | Export to CSV, PDF, or JSON |
| Active Clients KPI | Card | Shows count with % change |
| Monthly Revenue KPI | Card | Shows MRR with % change |
| Avg Session Rating KPI | Card | Shows rating (1-5) |
| Mentor Score KPI | Card | Shows score (0-100) |
| Churn Risk Radar | Panel | Lists at-risk clients with risk level |
| View All Churn | Link | Navigates to full churn list |
| Revenue Forecast | Chart | Bar chart with 30-day prediction |
| Directive Effectiveness | Bars | Progress bars per directive type |
| Needs Attention | Section | Cards for clients needing follow-up |
| Message Client | Button | Opens messaging |
| View Client | Button | Opens client drawer |
| Today's Sessions | List | Scheduled sessions with times |
| Activity Feed | List | Real-time client activities |
| Business Snapshot | Cards | MRR, new clients, churned, compliance |

### Clients (`/clients`)

| Feature | Element | Action |
|---------|---------|--------|
| Search Clients | Input | Filter by name |
| Status Filter | Dropdown | Filter by status |
| Sort By | Dropdown | Sort by name/progress/activity |
| Invite Client | Button | Opens invite dialog |
| AI Tags | Badges | Shows At Risk, High Anxiety, Achieving Goal, etc. |
| Client Row | Table Row | Click to open drawer |
| Message | Button | Opens messaging |
| View | Button | Opens client drawer |
| Status Badge | Badge | Shows active/inactive/trial/suspended |
| Progress Bar | Visual | Shows completion percentage |

### Client Drawer (6 Tabs)

| Tab | Features |
|-----|----------|
| Overview | Goals list, metrics display, domain assignments |
| Progress | 30-day chart, workout/nutrition/sleep scores |
| AI Summary | AI insights with priority badges, suggestions |
| Directives | Client-specific directive list, toggle active |
| Workouts | Assigned plans, completion %, schedule |
| Permissions | Data access toggles per category |

### Directives (`/directives`)

| Feature | Element | Action |
|---------|---------|--------|
| Create Directive | Button | Opens directive modal |
| Search | Input | Filter by name |
| Category Filter | Dropdown | Filter by category |
| Status Filter | Dropdown | Active/inactive |
| Directive Card | Card | Shows name, description, stats |
| Toggle Active | Switch | Enable/disable directive |
| Edit | Button | Opens edit modal |
| Duplicate | Button | Creates copy |
| Delete | Button | Opens confirmation dialog |
| Triggered Count | Badge | Times directive fired |
| Effectiveness | Badge | % effectiveness score |

### Groups (`/groups`)

| Feature | Element | Action |
|---------|---------|--------|
| Create Group | Button | Opens create modal |
| Type Filter | Tabs | Program Cohorts, Custom, Promotions, Organizations |
| Group Card | Card | Shows name, member count, type badge |
| View Group | Click | Navigates to group detail |
| Member Avatars | Stack | Shows first 5 members |
| Week Progress | Badge | Current week of program |

### Group Detail (`/groups/:id`)

| Tab | Features |
|-----|----------|
| Overview | Type info, program progress, quick stats |
| Members | Member list, add/remove, search |
| Message Board | Create post, comments, reactions, pin posts |
| Directives | Group directives, create new, toggle active |
| Progress | Group analytics, member comparison chart |

### Calendar (`/calendar`)

| Feature | Element | Action |
|---------|---------|--------|
| Week Navigation | Arrows | Previous/next week |
| Today Button | Button | Jump to current week |
| Day View | Column | Shows hours 7am-9pm |
| Booking Block | Block | Shows client session |
| Edit Availability | Button | Opens availability modal |
| Time Slot | Block | Add/edit availability |
| Blocked Time | Overlay | Shows blocked periods |

### Program Templates (`/program-templates`)

| Feature | Element | Action |
|---------|---------|--------|
| Build from Scratch | Card | Navigates to template builder |
| Template Card | Card | Shows cover, name, stats |
| Pat's Insight | Badge | Positive/optimization/data_trend |
| Duration | Badge | X weeks |
| Active Users | Count | Number using template |
| Completion Rate | Percentage | Avg completion |
| Create Cohort | Button | Opens cohort creation modal |
| Edit Template | Button | Opens template builder |

### Settings (`/settings`)

| Tab | Features |
|-----|----------|
| Profile | Display name, bio, specializations, certifications, hourly rate |
| Notifications | Email preferences, push settings |
| Referrals | Referral link, stats, copy link |
| Security | Password change, 2FA settings |

### Public Booking (`/book/:mentorSlug`)

| Feature | Element | Action |
|---------|---------|--------|
| Mentor Info | Display | Shows name, bio, rate |
| Date Picker | Calendar | Select booking date |
| Time Slots | Buttons | Available times |
| Session Type | Dropdown | In-person/Zoom/Google Meet |
| Client Info | Form | Name, email, notes |
| Book Session | Button | Confirms booking |

---

## 9. AI TAGS SYSTEM

Clients can have AI-generated tags based on their behavior:

| Tag | Color | Trigger Condition |
|-----|-------|-------------------|
| At Risk | Red | Low compliance, inactivity |
| High Anxiety | Orange | Stress indicators |
| Achieving Goal | Green | On track to goals |
| Consistent | Blue | Regular engagement |
| Needs Check-in | Yellow | Missed sessions |
| Improving | Teal | Upward trend |
| Goal Met | Purple | Completed objectives |

---

## 10. PAT'S INSIGHT TYPES

Program templates and analytics can have Pat's Insights:

| Type | Color | Icon | Purpose |
|------|-------|------|---------|
| `positive` | Indigo | check_circle | Celebrate success |
| `optimization` | Amber | lightbulb | Suggest improvement |
| `data_trend` | Cyan | trending_up | Highlight patterns |

---

*Generated: December 2024*
*Version: MentorAI 1.0*
