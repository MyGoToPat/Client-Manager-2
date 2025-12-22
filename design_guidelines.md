# HiPat Client Management Tool - Design Guidelines

## Design Approach
**System-Based Approach** - This is a productivity-focused dashboard application requiring efficiency and clarity. Drawing inspiration from **Linear** (clean data presentation), **Notion** (flexible layouts), and **Carbon Design** (enterprise data visualization).

## Design Principles
1. **Information Density with Clarity**: Pack relevant data without overwhelming users
2. **Scannable Hierarchy**: Enable quick navigation through client lists and metrics
3. **Action-Oriented**: CTAs and critical actions always visible and accessible
4. **Professional Polish**: Clean, modern aesthetic that builds trust with B2B users

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - for UI and data
- Accent: JetBrains Mono (Google Fonts) - for metrics/numbers

**Type Scale**:
- Hero/Dashboard Title: text-3xl font-bold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body/Table Data: text-sm font-normal (14px)
- Captions/Metadata: text-xs font-medium (12px)
- Large Metrics: text-4xl font-mono font-bold (36px)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12** exclusively
- Component padding: p-6
- Section gaps: space-y-8
- Card spacing: p-4 or p-6
- Tight groupings: gap-4

**Grid System**:
- Dashboard: 12-column grid with gap-6
- Client cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Metric cards: grid-cols-2 md:grid-cols-4
- Detail views: 2-column layout (8-col main + 4-col sidebar)

**Container**: max-w-7xl mx-auto px-6

---

## Component Library

### Navigation
**Sidebar** (left, fixed):
- Width: w-64
- Logo + mentor profile at top (p-6)
- Navigation items with icons (Heroicons)
- Collapsible sections for organization structure
- Active state: subtle background treatment

**Top Bar**:
- Search bar (w-96, prominent placement)
- Notifications bell icon
- User avatar dropdown (right-aligned)
- Breadcrumb navigation for context

### Dashboard Components

**Client Table**:
- Alternating row treatment for scannability
- Avatar + name + status badge in first column
- Progress bars inline (h-2 rounded-full)
- Last seen timestamp with relative formatting
- Action menu (3-dot) on hover
- Sortable column headers with icons

**Metric Cards** (4-grid):
- Large number display (font-mono text-4xl)
- Label below (text-xs uppercase tracking-wide)
- Trend indicator (arrow icon + percentage)
- Minimal borders, subtle shadow on hover

**Client Detail Card**:
- Full-width header with avatar, name, status
- Tabbed interface: Overview | Progress | Permissions | Notes
- Charts use Recharts with line graphs for progress tracking
- Goal tags displayed as rounded pills

**AI Insights Panel**:
- Card-based layout with priority indicators
- Icon badge for insight type (pattern/alert/suggestion)
- Confidence score as small progress ring
- "Suggested Action" displayed as secondary button
- Timestamp with relative date

### Forms & Inputs

**Invite Client Modal**:
- Centered modal (max-w-md)
- Email input with validation states
- Permission checkboxes in grid (grid-cols-2)
- Primary CTA button (w-full)

**Directive Builder**:
- Multi-step form with progress indicator
- Condition builder with tag-based inputs
- Message template with character count
- Preview panel (right sidebar)

### Data Visualization

**Progress Charts**:
- Multi-line chart for workout/nutrition/sleep
- Time range selector (tabs: 7d | 30d | 90d)
- Legend with toggle functionality
- Tooltips on hover showing exact values

**Client Status Distribution**:
- Donut chart with status breakdown
- Center displays total client count
- Legend with count next to each status

---

## Interaction Patterns

**Card Hover States**: Subtle lift (shadow-md to shadow-lg transition)

**Table Row Selection**: Click entire row to navigate to client detail

**Quick Actions**: Floating action button (bottom-right) for "Invite Client"

**Notifications**: Toast notifications (top-right) for success/error states

**Loading States**: Skeleton screens matching layout structure (not spinners)

---

## Images

This application uses **functional imagery only** - no decorative hero images.

**Image Usage**:
- Client/Mentor avatars: Circular, 40px (lists) or 80px (profiles)
- Empty states: Simple illustration placeholders for zero-data states
- Organization logos: Square, 48px in sidebar/settings

**Avatar Fallbacks**: Initials with generated background colors based on name hash

---

## Accessibility Standards

- Focus rings visible on all interactive elements
- ARIA labels on icon-only buttons
- Keyboard navigation through tables and forms
- Color is never the only indicator (use icons + text)
- Minimum contrast ratio 4.5:1 for all text

---

## Responsive Behavior

**Desktop (1280px+)**: Full sidebar + multi-column layouts
**Tablet (768-1279px)**: Collapsible sidebar + 2-column grids
**Mobile (<768px)**: Hidden sidebar (hamburger menu) + single-column stacks, bottom navigation bar for primary actions