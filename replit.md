# AffiliateXchange - Project Documentation

## Overview
AffiliateXchange is a comprehensive affiliate marketplace platform that connects video content creators with companies offering affiliate programs. The platform enables companies to showcase their affiliate offers with example promotional videos, while creators can browse, apply, and promote products/services for commission.

## Architecture

### Tech Stack
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Shadcn UI components with Tailwind CSS
- **Design**: Custom purple-blue brand color scheme optimized for trust and engagement

### User Roles
1. **Creators** - Video content creators looking for affiliate opportunities
2. **Companies** - Brands offering affiliate programs
3. **Super Admin** - Platform operators managing approvals and reviews

## Key Features

### For Creators
- Browse and filter affiliate offers across multiple niches
- Auto-approval system (7 minutes after application)
- Unique tracking links for each creator-offer pair
- Real-time analytics dashboard (clicks, conversions, earnings)
- In-app messaging with companies
- Review and rating system
- Favorites/saved offers

### For Companies
- Create offers with 6-12 example videos (required)
- Manual company verification for quality control
- Detailed creator analytics and performance tracking
- Commission structures: per-sale, per-lead, per-click, monthly retainer, or hybrid
- Priority listing options
- Creator management dashboard

### For Admins
- Manual approval for companies and offers
- Review management (edit, add, delete)
- Platform-wide analytics
- User management
- Configuration settings

## Database Schema

### Core Tables
- `users` - All user accounts with role-based access
- `creators` - Creator profiles with social links and payment info
- `companies` - Company profiles with verification status
- `offers` - Affiliate offers with commission details
- `example_videos` - Video gallery for each offer (6-12 required)
- `applications` - Creator applications with auto-approval
- `tracking_links` - Unique tracking codes for analytics
- `click_events` - Click tracking data
- `messages` - In-app messaging between creators and companies
- `reviews` - Creator reviews of companies
- `transactions` - Payment processing records
- `favorites` - Saved offers for creators

## Revenue Model
- One-time listing fee (configurable by admin)
- 7% platform fee (3% processing + 4% platform fee)
- Priority listing upgrades

## Auto-Approval Workflow
1. Creator submits application
2. System sends confirmation
3. After 7 minutes, status automatically changes to "Approved"
4. Unique tracking link generated (format: `/track/{8-char-code}`)
5. Approval notification sent to creator

## Recent Changes
- 2025-01-20: Database successfully configured with PostgreSQL
- 2025-01-20: Comprehensive schema created with all required tables
- 2025-01-20: Frontend components built: Landing, Auth, Browse, Offer Detail, Dashboards

## Development Status
- Phase 1 (Schema & Frontend): In Progress
- Database: Configured ✓
- Schema: Complete ✓
- Frontend Components: Major pages complete, need backend integration
- Backend: Pending
- Integration & Testing: Pending
