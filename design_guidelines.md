# AffiliateXchange Design Guidelines

## Design Approach
**Reference-Based Approach** inspired by modern SaaS marketplaces and affiliate platforms (Stripe, Gumroad, PartnerStack) combined with clean dashboard aesthetics (Linear, Vercel).

**Core Design Principles:**
- Professional trust-building through clean, modern interface
- Data visibility with clear metrics and performance indicators
- Action-oriented design encouraging conversions and engagement
- Balanced personality between marketplace vibrancy and professional utility

---

## Color Palette

### Light Mode
- **Primary Brand:** 250 70% 50% (Purple-blue for CTAs, links, brand elements)
- **Primary Muted:** 250 50% 95% (Subtle backgrounds, hover states)
- **Background:** 0 0% 100% (Pure white canvas)
- **Surface:** 240 10% 98% (Cards, elevated surfaces)
- **Border:** 240 6% 90% (Dividers, card borders)
- **Text Primary:** 240 8% 12% (Headings, primary content)
- **Text Secondary:** 240 5% 45% (Descriptions, labels)

### Dark Mode
- **Primary Brand:** 250 65% 60% (Lighter purple-blue for visibility)
- **Primary Muted:** 250 40% 15% (Subtle backgrounds)
- **Background:** 240 8% 8% (Deep charcoal)
- **Surface:** 240 6% 12% (Cards, elevated surfaces)
- **Border:** 240 5% 20% (Dividers)
- **Text Primary:** 0 0% 98% (Headings)
- **Text Secondary:** 240 3% 65% (Descriptions)

### Accent Colors
- **Success:** 142 76% 45% (Earnings, positive metrics)
- **Warning:** 38 92% 50% (Alerts, pending status)
- **Danger:** 0 72% 55% (Errors, declined)

---

## Typography

**Font Families:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for codes, IDs, API keys)

**Scale:**
- Hero Display: text-5xl md:text-6xl font-bold (landing hero)
- Page Heading: text-3xl md:text-4xl font-bold
- Section Heading: text-2xl font-semibold
- Card Title: text-lg font-semibold
- Body: text-base font-normal
- Small: text-sm font-normal
- Tiny: text-xs font-medium (labels, badges)

---

## Layout System

**Spacing Primitives:** Consistently use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24

**Container Strategy:**
- Marketing pages: max-w-7xl mx-auto px-6
- Dashboard: Full-width with max-w-screen-2xl mx-auto px-6
- Content cards: p-6 spacing
- Form sections: p-8 spacing

**Grid Systems:**
- Dashboard widgets: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Offer listings: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature cards: grid-cols-1 md:grid-cols-3

---

## Component Library

### Navigation
**Main Header:**
- Sticky navigation with backdrop blur
- Logo left, primary navigation center, user menu + CTA right
- Mobile: Hamburger menu with slide-out drawer
- Include notification bell with badge counter

### Cards
**Offer Card:**
- Image thumbnail (16:9 ratio)
- Commission badge (top-right overlay)
- Merchant name, offer title, description
- CTA button + secondary "View Details" link
- Hover: Subtle lift with shadow increase

**Stats Card:**
- Large metric number (text-4xl font-bold)
- Label below (text-sm text-secondary)
- Trend indicator (percentage change with colored arrow)
- Sparkline chart (optional)

**Dashboard Widget:**
- Header with title + action dropdown
- Content area with appropriate data visualization
- Footer with "View All" link

### Forms
**Input Fields:**
- Floating labels or top-aligned labels
- Focus ring using primary brand color
- Error states with danger color border + message below
- Dark mode: Subtle background (surface color) with lighter border

**Buttons:**
- Primary: Filled with brand color, white text
- Secondary: Outlined with brand color border
- Ghost: Text-only hover background
- Sizes: sm, default, lg
- On images: Use backdrop-blur-sm with outline variant

### Data Display
**Table:**
- Zebra striping for rows (subtle)
- Sticky header on scroll
- Sortable columns with icons
- Action menu (three dots) per row

**Metrics Dashboard:**
- 4-column grid on desktop
- Large numbers with labels
- Comparison indicators (vs. previous period)
- Color-coded performance (green for growth, red for decline)

### Modals & Overlays
- Center-aligned with backdrop blur
- max-w-2xl for standard modals
- Close button top-right
- Action buttons bottom-right (Cancel + Primary)

---

## Page-Specific Layouts

### Marketing Landing Page (5 sections)

**Hero Section (80vh):**
- Split layout: Left (60%) headline + subheadline + dual CTA buttons, Right (40%) hero illustration/mockup
- Headline: "Connect Affiliates & Merchants Seamlessly"
- Trust indicator below CTA: "Join 10,000+ active affiliates"
- Background: Subtle gradient from background to primary-muted

**Features Grid (3 columns):**
- Icon + title + description cards
- Features: Real-time Analytics, Automated Payouts, Easy Integration
- Icons from Heroicons (chart-bar, currency-dollar, code-bracket)

**How It Works (Timeline):**
- 3-step horizontal timeline (mobile: vertical)
- Numbers in circles, connecting lines
- Each step: Title + description + supporting icon

**Social Proof:**
- 2-column: Left (testimonial carousel), Right (metrics: earnings processed, active partnerships, conversion rate)
- Merchant logos below

**CTA Section:**
- Centered, full-width background with primary-muted
- Headline + subheadline + single prominent CTA
- Secondary text: "No credit card required"

### Dashboard Layout

**Sidebar Navigation (240px):**
- Logo at top
- Main menu items with icons
- Bottom: Settings + user profile
- Collapsible on mobile

**Main Content Area:**
- Top bar: Page title + breadcrumbs left, search + notifications + user menu right
- Stats overview: 4-card grid (Total Earnings, Click-through Rate, Active Offers, Pending Commissions)
- Performance chart: Full-width area chart showing 30-day earnings
- Recent Activity table below

---

## Images

**Hero Section:**
- Use a high-quality dashboard mockup or abstract connection/network illustration
- Placement: Right side of hero (40% width)
- Style: Modern, clean, with subtle depth/perspective

**Feature Icons:**
- Use Heroicons for all feature/benefit sections
- No custom photography needed for features

**Merchant Logos:**
- Display real/placeholder merchant logos in social proof section
- Grid layout, grayscale with opacity, full color on hover

---

## Animations
Use sparingly and only for micro-interactions:
- Card hover: translate-y-[-4px] + shadow increase
- Button hover: subtle scale or background darkening
- Page transitions: Simple fade (150ms)
- Loading states: Subtle skeleton screens or spinner