# Docs / Plans

Generated from the current working tree on 2026-04-10 22:12:57.

- Files: 30
- File kinds: Markdown doc (30)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `docs/plans/2026-02-23-client-portal-redesign-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 511
- Bytes: 18576
- Headings: Client Portal Redesign Implementation Plan, Task 1: Add date-filtered data fetching, Task 2: Rewrite the page JSX — hero numbers + date filter, Task 3: City cards grid, Task 4: Audience profile section, Task 5: Remove campaigns sub-page from sidebar nav, Task 6: Footer + final cleanup, Verification
- Contents summary: headings: Client Portal Redesign Implementation Plan \| Task 1: Add date-filtered data fetching \| Task 2: Rewrite the page JSX — hero numbers + date filter \| Task 3: City cards grid \| Task 4: Audience profile section \| Task 5: Remove campaigns sub-page from sidebar nav

## `docs/plans/2026-02-23-client-portal-redesign.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 92
- Bytes: 3146
- Headings: Client Portal Redesign — 2026-02-23, Goal, What the Client Sees, What the Client Does NOT See, Layout, City Card Contents, Color Palette, Typography, Date Filter Behavior, Data Sources, … (+1 more)
- Contents summary: headings: Client Portal Redesign — 2026-02-23 \| Goal \| What the Client Sees \| What the Client Does NOT See \| Layout \| City Card Contents

## `docs/plans/2026-02-26-discord-agent-architecture-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 276
- Bytes: 10804
- Headings: Discord Multi-Agent Architecture Design, Goal, Architecture Overview, Three Layers, Agent Identity System, Concurrency & Job Queue, Task Object, Flow, Supabase `agent_tasks` Table, Agent-to-Agent Communication, … (+10 more)
- Contents summary: headings: Discord Multi-Agent Architecture Design \| Goal \| Architecture Overview \| Three Layers \| Agent Identity System \| Concurrency & Job Queue

## `docs/plans/2026-02-26-discord-agent-architecture-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 1240
- Bytes: 35113
- Headings: Discord Multi-Agent Architecture Implementation Plan, Phase 1: Foundation (Queue, Webhooks, Code Split), Task 1: Create `agent_tasks` Supabase table, Task 2: Create `agent/src/services/webhook-service.ts`, Task 3: Create `agent/src/services/queue-service.ts`, Task 4: Create `agent/src/services/approval-service.ts`, Task 5: Refactor `discord.ts` into thin entry point + message handler, Task 6: Create structured task delegation (replace @agent-name regex), Task 7: Update server layout (restructure.ts + new channels), Phase 2: Autonomy & Intelligence, … (+10 more)
- Contents summary: headings: Discord Multi-Agent Architecture Implementation Plan \| Phase 1: Foundation (Queue, Webhooks, Code Split) \| Task 1: Create `agent_tasks` Supabase table \| Task 2: Create `agent/src/services/webhook-service.ts` \| Task 3: Create `agent/src/services/queue-service.ts` \| Task 4: Create `agent/src/services/approval-…

## `docs/plans/2026-03-02-admin-crud-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 87
- Bytes: 3231
- Headings: Admin CRUD Design, Goal, Architecture, Server Actions, Shared Helpers, Inline Editing (no new pages), New Components, Audit Log Table, Meta Sync Flow, Entity Actions, … (+4 more)
- Contents summary: headings: Admin CRUD Design \| Goal \| Architecture \| Server Actions \| Shared Helpers \| Inline Editing (no new pages)

## `docs/plans/2026-03-02-admin-crud-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure
- Lines: 805
- Bytes: 24340
- Headings: Admin CRUD Implementation Plan, Task 1: Create admin_audit_log table, Task 2: Reusable UI components, Task 3: Campaign server actions, Task 4: Event server actions, Task 5: Client server actions, Task 6: User server actions, Task 7: Campaign table with inline editing, Task 8: Event table with inline editing, Task 9: Client table with inline editing, … (+7 more)
- Contents summary: headings: Admin CRUD Implementation Plan \| Task 1: Create admin_audit_log table \| Task 2: Reusable UI components \| Task 3: Campaign server actions \| Task 4: Event server actions \| Task 5: Client server actions

## `docs/plans/2026-03-02-meta-oauth-integration-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 179
- Bytes: 7240
- Headings: Meta OAuth Integration Design, Goal, Decisions, Data Model, New table: `client_accounts`, New env vars, OAuth Flow, Token refresh, New API Routes, OAuth, … (+10 more)
- Contents summary: headings: Meta OAuth Integration Design \| Goal \| Decisions \| Data Model \| New table: `client_accounts` \| New env vars

## `docs/plans/2026-03-02-meta-oauth-integration-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure, handlers: GET, POST, PATCH
- Lines: 2909
- Bytes: 88318
- Headings: Meta OAuth Integration Implementation Plan, Task 1: Token Encryption Module, Task 2: Environment Variables Update, Task 3: Supabase Migration -- client_accounts Table, Task 4: Meta OAuth Helper Module, Task 5: OAuth API Routes -- Connect and Callback, Task 6: Disconnect and Data Deletion Routes, Task 7: Middleware Update -- Public Routes, Task 8: Client Settings Page (Connected Accounts), Task 9: Ad Account Picker Page, … (+10 more)
- Contents summary: headings: Meta OAuth Integration Implementation Plan \| Task 1: Token Encryption Module \| Task 2: Environment Variables Update \| Task 3: Supabase Migration -- client_accounts Table \| Task 4: Meta OAuth Helper Module \| Task 5: OAuth API Routes -- Connect and Callback

## `docs/plans/2026-03-02-project-restructure-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 176
- Bytes: 6479
- Headings: Project Restructure Design, Context, Approach: Bottom-Up Cleanup (5 Layers), Layer 1: Delete Dead Code, Files to delete, Dependencies to remove, Imports to clean, Layer 2: Extract Shared Utilities, Frontend: `src/lib/`, Client portal consolidation, … (+10 more)
- Contents summary: headings: Project Restructure Design \| Context \| Approach: Bottom-Up Cleanup (5 Layers) \| Layer 1: Delete Dead Code \| Files to delete \| Dependencies to remove

## `docs/plans/2026-03-02-project-restructure-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 837
- Bytes: 26519
- Headings: Project Restructure Implementation Plan, Task 1: Delete Dead Agent Files, Task 2: Extract Shared Frontend Formatters, Task 3: Extract Meta API Constants, Task 4: Consolidate Client Portal Helpers, Task 5: Extract Agent Shared Utilities, Task 6: Eliminate discord-routines.ts Duplication, Task 7: Split campaign-charts.tsx, Task 8: Extract Dashboard Data Layer, Task 9: Split Client Portal Types, … (+8 more)
- Contents summary: headings: Project Restructure Implementation Plan \| Task 1: Delete Dead Agent Files \| Task 2: Extract Shared Frontend Formatters \| Task 3: Extract Meta API Constants \| Task 4: Consolidate Client Portal Helpers \| Task 5: Extract Agent Shared Utilities

## `docs/plans/2026-03-03-admin-activity-tracking-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 97
- Bytes: 4023
- Headings: Admin Activity Tracking Design, Data Model, Tracking Implementation, 1. Page Views -- `<ActivityTracker>` client component, 2. Actions -- `logActivity()` server action, 3. Errors -- Admin Error Boundary, 4. Sessions -- Login detection, 5. API Endpoint -- `POST /api/admin/activity`, Activity Viewer Page (`/admin/activity`), Top stats (4 cards), … (+5 more)
- Contents summary: headings: Admin Activity Tracking Design \| Data Model \| Tracking Implementation \| 1. Page Views -- `<ActivityTracker>` client component \| 2. Actions -- `logActivity()` server action \| 3. Errors -- Admin Error Boundary

## `docs/plans/2026-03-03-admin-activity-tracking-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure, handlers: POST
- Lines: 1064
- Bytes: 29903
- Headings: Admin Activity Tracking Implementation Plan, Task 1: Create the `admin_activity` Supabase table, Task 2: Add `admin_activity` type to `database.types.ts`, Task 3: Create the `logActivity()` server action, Task 4: Create the API endpoint `POST /api/admin/activity`, Task 5: Create the `<ActivityTracker>` client component, Task 6: Wire `<ActivityTracker>` into admin layout, Task 7: Add admin error boundary that logs errors, Task 8: Create the activity data fetcher, Task 9: Create the activity filter component, … (+4 more)
- Contents summary: headings: Admin Activity Tracking Implementation Plan \| Task 1: Create the `admin_activity` Supabase table \| Task 2: Add `admin_activity` type to `database.types.ts` \| Task 3: Create the `logActivity()` server action \| Task 4: Create the API endpoint `POST /api/admin/activity` \| Task 5: Create the `<ActivityTracker>`…

## `docs/plans/2026-03-03-admin-data-table-upgrade-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 105
- Bytes: 3726
- Headings: Admin Data Table Upgrade Design, Problem, Solution, Architecture, DataTable features, Custom features preserved per table, Campaigns, Events, Users, Clients, … (+3 more)
- Contents summary: headings: Admin Data Table Upgrade Design \| Problem \| Solution \| Architecture \| DataTable features \| Custom features preserved per table

## `docs/plans/2026-03-03-admin-data-table-upgrade.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure
- Lines: 1140
- Bytes: 36712
- Headings: Admin Data Table Upgrade Implementation Plan, Task 1: Install dependencies and add shadcn dropdown-menu, Task 2: Build reusable DataTable components, Task 3: Upgrade clients table, Task 4: Upgrade campaigns table, Task 5: Upgrade events table, Task 6: Upgrade users table, Task 7: Upgrade agents job history table, Task 8: Final verification and cleanup
- Contents summary: headings: Admin Data Table Upgrade Implementation Plan \| Task 1: Install dependencies and add shadcn dropdown-menu \| Task 2: Build reusable DataTable components \| Task 3: Upgrade clients table \| Task 4: Upgrade campaigns table \| Task 5: Upgrade events table

## `docs/plans/2026-03-03-campaign-client-assignment-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 43
- Bytes: 1706
- Headings: Campaign-to-Client Assignment, Problem, Solution, Data Model, Admin UX, Client Portal, Data Flow, Scope
- Contents summary: headings: Campaign-to-Client Assignment \| Problem \| Solution \| Data Model \| Admin UX \| Client Portal

## `docs/plans/2026-03-03-campaign-mobile-polish-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 51
- Bytes: 1827
- Headings: Campaign Detail Mobile Polish Design, Problem, Changes, 1. Platform Icons Component, 2. Placement Breakdown -- Cards on Mobile, 3. ROAS Card Full-Width on Mobile, 4. Tighter Mobile Padding, 5. Section Reorder on Mobile, 6. Desktop Table Icons
- Contents summary: headings: Campaign Detail Mobile Polish Design \| Problem \| Changes \| 1. Platform Icons Component \| 2. Placement Breakdown -- Cards on Mobile \| 3. ROAS Card Full-Width on Mobile

## `docs/plans/2026-03-03-client-accounts-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 132
- Bytes: 4467
- Headings: Client Accounts & Team Management, Problem, Solution, Data Model, `clients` table, `client_members` table, Migration, Auth & Routing, Post-login routing, First-visit auto-enrollment, … (+10 more)
- Contents summary: headings: Client Accounts & Team Management \| Problem \| Solution \| Data Model \| `clients` table \| `client_members` table

## `docs/plans/2026-03-03-client-accounts-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure
- Lines: 1285
- Bytes: 38042
- Headings: Client Accounts & Team Management — Implementation Plan, Task 1: Create Supabase tables, Task 2: Update database types, Task 3: Add client server actions (CRUD), Task 4: Update client data fetching to use `clients` table, Task 5: Update admin clients page and table, Task 6: Create client detail page, Task 7: Update admin users page for pending status + assignment, Task 8: Update `/api/admin/users/[id]` to sync client_members, Task 9: Update root page routing + create pending page, … (+5 more)
- Contents summary: headings: Client Accounts & Team Management — Implementation Plan \| Task 1: Create Supabase tables \| Task 2: Update database types \| Task 3: Add client server actions (CRUD) \| Task 4: Update client data fetching to use `clients` table \| Task 5: Update admin clients page and table

## `docs/plans/2026-03-03-direct-meta-api-campaigns-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 49
- Bytes: 2092
- Headings: Direct Meta API for Campaigns (Admin + Client), Problem, Solution, New modules, `src/lib/meta-campaigns.ts`, `src/lib/client-slug.ts`, Admin page changes (`/admin/campaigns`), Client portal changes (`/client/[slug]`), Meta API calls (per page load), Untouched
- Contents summary: headings: Direct Meta API for Campaigns (Admin + Client) \| Problem \| Solution \| New modules \| `src/lib/meta-campaigns.ts` \| `src/lib/client-slug.ts`

## `docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure
- Lines: 650
- Bytes: 20335
- Headings: Direct Meta API for Campaigns — Implementation Plan, Task 1: Create `guessClientSlug` utility, Task 2: Create shared `meta-campaigns.ts` module, Task 3: Rewrite admin campaigns data layer, Task 4: Update admin campaigns page with date range picker, Task 5: Update campaign table and columns for new data shape, Task 6: Update client portal data layer, Task 7: Add date range filter component to admin campaigns, Task 8: Update pagination to support larger page sizes, Task 9: Full integration test, … (+1 more)
- Contents summary: headings: Direct Meta API for Campaigns — Implementation Plan \| Task 1: Create `guessClientSlug` utility \| Task 2: Create shared `meta-campaigns.ts` module \| Task 3: Rewrite admin campaigns data layer \| Task 4: Update admin campaigns page with date range picker \| Task 5: Update campaign table and columns for new data…

## `docs/plans/2026-03-03-landing-page-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`
- Lines: 137
- Bytes: 4049
- Headings: Landing Page Design, Goal, Routing, Page Sections, 1. Navigation Bar, 2. Hero, 3. Features (4 cards), 4. How It Works (3 steps), 5. Social Proof / Stats, 6. Contact Form, … (+10 more)
- Contents summary: headings: Landing Page Design \| Goal \| Routing \| Page Sections \| 1. Navigation Bar \| 2. Hero

## `docs/plans/2026-03-03-landing-page-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure, handlers: POST
- Lines: 780
- Bytes: 20179
- Headings: Landing Page Implementation Plan, Task 1: Install Resend and add env vars, Task 2: Create Supabase `contact_submissions` table, Task 3: Contact form Zod schema, Task 4: Contact API route, Task 5: Landing page navigation component, Task 6: Hero section component, Task 7: Features section component, Task 8: How It Works section component, Task 9: Stats section component, … (+5 more)
- Contents summary: headings: Landing Page Implementation Plan \| Task 1: Install Resend and add env vars \| Task 2: Create Supabase `contact_submissions` table \| Task 3: Contact form Zod schema \| Task 4: Contact API route \| Task 5: Landing page navigation component

## `docs/plans/2026-03-03-mobile-responsiveness-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 87
- Bytes: 3038
- Headings: Mobile Responsiveness Design, Goal, Current State, Design, 1. Data Tables -> Card Stacks on Mobile, 2. Admin Stat Grids, 3. Admin Agents Chat Panel, 4. Admin Forms & Inputs, 5. Client Campaigns Table, 6. Age-Gender Heatmap, … (+3 more)
- Contents summary: headings: Mobile Responsiveness Design \| Goal \| Current State \| Design \| 1. Data Tables -> Card Stacks on Mobile \| 2. Admin Stat Grids

## `docs/plans/2026-03-03-mobile-responsiveness-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 876
- Bytes: 29747
- Headings: Mobile Responsiveness Implementation Plan, Task 1: Add mobile card rendering to DataTable, Task 2: Campaign table mobile cards, Task 3: Events table mobile cards, Task 4: Clients table mobile cards, Task 5: Users table mobile cards, Task 6: Activity table mobile cards, Task 7: Fix admin stat grids, Task 8: Dashboard shows table mobile cards, Task 9: Agents page -- full-screen chat sheet on mobile, … (+4 more)
- Contents summary: headings: Mobile Responsiveness Implementation Plan \| Task 1: Add mobile card rendering to DataTable \| Task 2: Campaign table mobile cards \| Task 3: Events table mobile cards \| Task 4: Clients table mobile cards \| Task 5: Users table mobile cards

## `docs/plans/2026-03-04-admin-must-have-upgrades-design.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 147
- Bytes: 4835
- Headings: Admin Must-Have Upgrades Design, Overview, Approach, Feature 1: Cmd+K Command Palette, Feature 2: CSV Export on All Tables, Feature 3: Collapsible Sidebar with Icon Rail, Feature 4: URL-Persisted Filters (Nuqs), Feature 5: Breadcrumb Navigation, Feature 6: Page-Specific Loading Skeletons, Feature 7: Bulk Actions on All Tables, … (+2 more)
- Contents summary: headings: Admin Must-Have Upgrades Design \| Overview \| Approach \| Feature 1: Cmd+K Command Palette \| Feature 2: CSV Export on All Tables \| Feature 3: Collapsible Sidebar with Icon Rail

## `docs/plans/2026-03-04-admin-must-have-upgrades.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure
- Lines: 912
- Bytes: 28341
- Headings: Admin Must-Have Upgrades Implementation Plan, Task 1: Install Dependencies and Add Missing shadcn Components, Task 2: Cmd+K Command Palette, Task 3: CSV Export, Task 4: Collapsible Sidebar with Icon Rail, Task 5: URL-Persisted Filters (Nuqs), Task 6: Breadcrumb Navigation, Task 7: Enhance Loading Skeletons, Task 8: Bulk Actions on Events, Clients, and Users Tables, Task Order and Dependencies, … (+1 more)
- Contents summary: headings: Admin Must-Have Upgrades Implementation Plan \| Task 1: Install Dependencies and Add Missing shadcn Components \| Task 2: Cmd+K Command Palette \| Task 3: CSV Export \| Task 4: Collapsible Sidebar with Icon Rail \| Task 5: URL-Persisted Filters (Nuqs)

## `docs/plans/2026-03-07-discord-growth-team-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 275
- Bytes: 7880
- Headings: Discord Growth Team Plan, Goal, Non-Goals, Operating Model, Pod Structure, 1. Boss / Revenue Supervision, 2. Growth Pod, 3. Creative Pod, 4. Paid Media Pod, 5. Lead Ops Pod, … (+10 more)
- Contents summary: headings: Discord Growth Team Plan \| Goal \| Non-Goals \| Operating Model \| Pod Structure \| 1. Boss / Revenue Supervision

## `docs/plans/2026-03-27-shell-reset-implementation-plan.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 859
- Bytes: 33028
- Headings: Outlet Shell Reset Implementation Plan, File Structure, Shell wiring, Removed/redirected routes, Dashboard cleanup, Tests, Safe-pruning follow-through, Chunk 1: Contract Admin And Client Shells, Task 1: Lock the admin nav to the approved shell, Task 2: Keep admin activity labels aligned with the new shell, … (+10 more)
- Contents summary: headings: Outlet Shell Reset Implementation Plan \| File Structure \| Shell wiring \| Removed/redirected routes \| Dashboard cleanup \| Tests

## `docs/plans/README.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 21
- Bytes: 623
- Headings: Historical Plans
- Contents summary: headings: Historical Plans

## `docs/plans/client-analytics-pattern-scan-2026-03-10.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Plans
- Ownership: historical planning documentation
- Type: Markdown doc
- Construction: markdown document
- Lines: 145
- Bytes: 13455
- Headings: Client Analytics Pattern Scan, Scope, What Outlet Should Steal Next, Outlet Translation, 100 Public Projects Scanned
- Contents summary: headings: Client Analytics Pattern Scan \| Scope \| What Outlet Should Steal Next \| Outlet Translation \| 100 Public Projects Scanned
