# HiPat Client Management Tool - Design Guidelines

## Design System

**UI Framework**: Dark mode-first design with Material Symbols Outlined icons

### Color Palette

**Primary**: #135bec (HSL: 218 88% 50%) - Used for primary actions, active states, links
**Background Dark**: #101622 (HSL: 218 35% 10%)
**Card/Surface Dark**: #1e293b (HSL: 217 33% 17%)
**Border Dark**: #232f48 (HSL: 218 34% 21%)
**Text Secondary**: #92a4c9 (HSL: 218 32% 68%)
**Text Primary**: White (#ffffff)

### Typography

**Font Stack**:
- Primary: Inter - for UI text, labels, and body
- Display: Space Grotesk - for headings and titles
- Body: Noto Sans - alternative for body text
- Mono: JetBrains Mono - for code and metrics

**Type Scale**:
- Hero/Dashboard Title: text-2xl font-bold (24px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body/Table Data: text-sm font-normal (14px)
- Captions/Metadata: text-xs font-medium (12px)
- Large Metrics: text-3xl font-mono font-bold (30px)

### Icons

**Icon System**: Material Symbols Outlined (Google Fonts)
- Load via: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1`
- Usage: `<span className="material-symbols-outlined">icon_name</span>`
- Filled variant: Add `filled` class for filled icons
- Icon size: Control via text-lg, text-xl, text-2xl classes

**Common Icon Mappings**:
- Dashboard: 'dashboard'
- Clients/Group: 'group'
- Calendar: 'calendar_month'
- Analytics: 'pie_chart'
- Settings: 'settings'
- Add/Plus: 'add'
- Search: 'search'
- Notifications: 'notifications'
- Bot/AI: 'smart_toy'
- Directives: 'bolt'
- Delete: 'delete'
- Edit: 'edit'
- Close: 'close'
- Arrow navigation: 'chevron_left', 'chevron_right', 'arrow_back'

### Layout

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12
- Component padding: p-4 to p-6
- Section gaps: space-y-6 or gap-6
- Card spacing: p-4 or p-6

**Border Radius**:
- Small: 0.25rem (rounded-sm)
- Default: 0.375rem (rounded-md)
- Large: 0.5rem (rounded-lg)
- Extra Large: 0.75rem (rounded-xl)

### Navigation

**Sidebar**:
- Width: 16rem (--sidebar-width)
- Active state: bg-primary/10 with border-l-2 border-primary
- Hover state: bg-sidebar-accent
- Icons use Material Symbols with filled variant when active

**Header**:
- Height: auto with py-3 px-6
- Contains: SidebarTrigger, page title, search (optional), action buttons
- Sticky positioning with backdrop blur

### Components

**Cards**: Use `bg-card` with subtle `border-border` 
**Buttons**: Use shadcn variants (default, outline, ghost, destructive)
**Badges**: Use for status indicators with appropriate color variants
**Tables**: Alternating row treatment, hover states
**Forms**: Use shadcn form components with proper validation

### Dark Mode

Dark mode is the primary/default theme. Color variables are defined in CSS custom properties that automatically adapt. The theme toggle switches between light and dark classes on the document root.

---

## Accessibility

- Focus rings visible on all interactive elements
- ARIA labels on icon-only buttons
- Keyboard navigation support
- Color is never the only indicator (use icons + text)
- Minimum contrast ratio 4.5:1 for all text

---

## Responsive Behavior

- Desktop (1280px+): Full sidebar + multi-column layouts
- Tablet (768-1279px): Collapsible sidebar + 2-column grids
- Mobile (<768px): Hidden sidebar (hamburger menu) + single-column stacks
