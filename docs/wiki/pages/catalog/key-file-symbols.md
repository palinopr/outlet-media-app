# Key File Symbol Map

Generated from the current working tree on 2026-04-10 18:02:26.

This page highlights key code files and lists their exported symbols, top-level definitions, and route/test ownership links.

## Web route files

### `src/app/layout.tsx`
- Type: Next.js layout
- Ownership: web root/shared route surface
- Route: /
- Exports: RootLayout, metadata, default
- Symbol details: default function RootLayout (exported), const geistSans, const geistMono
- Defines: RootLayout, geistSans, geistMono, publishableKey, content
- Contents summary: Next.js layout for `/`; exports: RootLayout, metadata, default; internal imports: 1; package imports: 4

### `src/app/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /
- Exports: RootPage, default
- Symbol details: default function RootPage (exported), interface RootPageProps
- Defines: RootPage, clerkEnabled, meta, params, entry, RootPageProps
- Contents summary: Next.js page for `/`; exports: RootPage, default; internal imports: 1; package imports: 2

### `src/app/admin/layout.tsx`
- Type: Next.js layout
- Ownership: web admin route surface
- Route: /admin
- Exports: AdminLayout, dynamic, metadata, default
- Symbol details: default function AdminLayout (exported), const dynamic (exported)
- Defines: AdminLayout, dynamic, clerkEnabled, role, full
- Contents summary: Next.js layout for `/admin`; exports: AdminLayout, dynamic, metadata, default; internal imports: 5; package imports: 5

### `src/app/admin/agents/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Route: /admin/agents
- Exports: AgentsLoading, default
- Symbol details: default function AgentsLoading (exported)
- Defines: AgentsLoading
- Contents summary: Next.js loading UI for `/admin/agents`; exports: AgentsLoading, default; internal imports: 2

### `src/app/admin/agents/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/agents
- Exports: AgentsPage, dynamic, default
- Symbol details: default function AgentsPage (exported), const dynamic (exported)
- Defines: AgentsPage, dynamic, chatJobs
- Imported by: src/app/shell-import-smoke.test.ts
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/agents`; exports: AgentsPage, dynamic, default; internal imports: 8; package imports: 1

### `src/app/admin/campaigns/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Route: /admin/campaigns
- Exports: CampaignsLoading, default
- Symbol details: default function CampaignsLoading (exported)
- Defines: CampaignsLoading
- Contents summary: Next.js loading UI for `/admin/campaigns`; exports: CampaignsLoading, default; internal imports: 2

### `src/app/admin/campaigns/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/campaigns
- Exports: CampaignsPage, default
- Symbol details: default function CampaignsPage (exported), interface Props
- Defines: CampaignsPage, clientSlug, range, totalSpend, totalImpressions, totalClicks, avgRoas, overallCtr, metaAdAccountId, hasData, Props
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/campaigns`; exports: CampaignsPage, default; internal imports: 10; package imports: 2

### `src/app/admin/campaigns/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/campaigns/[campaignId]
- Exports: AdminCampaignDetailPage, default
- Symbol details: default function AdminCampaignDetailPage (exported), interface Props
- Defines: AdminCampaignDetailPage, activeTab, data, statusCfg, requestClientSlug, openRequestCount, Props
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Contents summary: Next.js page for `/admin/campaigns/[campaignId]`; exports: AdminCampaignDetailPage, default; internal imports: 6; package imports: 3

### `src/app/admin/clients/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Route: /admin/clients
- Exports: ClientsLoading, default
- Symbol details: default function ClientsLoading (exported)
- Defines: ClientsLoading
- Contents summary: Next.js loading UI for `/admin/clients`; exports: ClientsLoading, default; internal imports: 2

### `src/app/admin/clients/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/clients
- Exports: ClientsPage, default
- Symbol details: default function ClientsPage (exported)
- Defines: ClientsPage, clients, totalSpend, totalCampaigns, activeCampaigns, assetsNeedingReview, connectionRiskAccounts, blendedRoas, clientsNeedingAttention, attentionClients, stats
- Imported by: src/app/shell-import-smoke.test.ts
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/clients`; exports: ClientsPage, default; internal imports: 8; package imports: 2

### `src/app/admin/clients/[id]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/clients/[id]
- Exports: ClientDetailPage, dynamic, default
- Symbol details: default function ClientDetailPage (exported), const dynamic (exported), interface Props
- Defines: ClientDetailPage, dynamic, client, Props
- Contents summary: Next.js page for `/admin/clients/[id]`; exports: ClientDetailPage, dynamic, default; internal imports: 2; package imports: 1

### `src/app/admin/dashboard/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Route: /admin/dashboard
- Exports: DashboardLoading, default
- Symbol details: default function DashboardLoading (exported)
- Defines: DashboardLoading
- Contents summary: Next.js loading UI for `/admin/dashboard`; exports: DashboardLoading, default; internal imports: 2

### `src/app/admin/dashboard/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/dashboard
- Exports: AdminDashboard, default
- Symbol details: default function AdminDashboard (exported), function getUpcomingShows
- Defines: getUpcomingShows, AdminDashboard, nowMs, d, upcomingShows, totalSold, totalCap, totalGross, totalSpend, avgRoas, now, heroStats, secondaryStats, agent, Icon, label, … (+4 more)
- Imported by: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/dashboard`; exports: AdminDashboard, default; internal imports: 12; package imports: 1

### `src/app/admin/events/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Route: /admin/events
- Exports: EventsLoading, default
- Symbol details: default function EventsLoading (exported)
- Defines: EventsLoading
- Contents summary: Next.js loading UI for `/admin/events`; exports: EventsLoading, default; internal imports: 2

### `src/app/admin/events/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/events
- Exports: EventsPage, default
- Symbol details: default function EventsPage (exported), interface Props
- Defines: EventsPage, clientSlug, totalSold, eventsWithCap, capSold, capTotal, totalGross, avgSellPct, totalFans, Props
- Imported by: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/events`; exports: EventsPage, default; internal imports: 8; package imports: 2

### `src/app/admin/events/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/events/[eventId]
- Exports: AdminEventDetailPage, default
- Symbol details: default function AdminEventDetailPage (exported), function eventSellThrough, interface Props
- Defines: eventSellThrough, AdminEventDetailPage, capacity, activeTab, data, totalCampaignSpend, averageRoas, sellThrough, openRequestCount, Props
- Imported by: src/app/admin/events/[eventId]/page.test.tsx
- Tests related: src/app/admin/events/[eventId]/page.test.tsx
- Contents summary: Next.js page for `/admin/events/[eventId]`; exports: AdminEventDetailPage, default; internal imports: 6; package imports: 3

### `src/app/admin/reports/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/reports
- Exports: AdminReportsPage, default
- Symbol details: default function AdminReportsPage (exported)
- Defines: AdminReportsPage
- Imported by: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/reports`; exports: AdminReportsPage, default; internal imports: 3

### `src/app/admin/settings/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/settings
- Exports: SettingsPage, default
- Symbol details: default function SettingsPage (exported), function getApiKeyStatus
- Defines: getApiKeyStatus, SettingsPage, keys, value, configured, masked, apiKeys, connectedAccounts, summary, Icon, inviteStatus
- Imported by: src/app/shell-import-smoke.test.ts
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/settings`; exports: SettingsPage, default; internal imports: 14; package imports: 2

### `src/app/admin/users/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Route: /admin/users
- Exports: UsersLoading, default
- Symbol details: default function UsersLoading (exported)
- Defines: UsersLoading
- Contents summary: Next.js loading UI for `/admin/users`; exports: UsersLoading, default; internal imports: 2

### `src/app/admin/users/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/users
- Exports: UsersPage, dynamic, default
- Symbol details: default function UsersPage (exported), const dynamic (exported)
- Defines: UsersPage, dynamic, activeUsers, invitedCount, adminCount, clientCount, pendingCount, accessSummary, stats, inviteStatus
- Imported by: src/app/shell-import-smoke.test.ts
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/users`; exports: UsersPage, dynamic, default; internal imports: 10; package imports: 2

### `src/app/api/admin/activity/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/admin/activity
- Exports: POST
- Symbol details: function POST (exported), const ActivitySchema
- Defines: POST, ActivitySchema, adminErr, caller
- Contents summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

### `src/app/api/admin/invite/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/admin/invite
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, adminErr, normalizedEmail, baseUrl, redirectUrl, client, invitation, clerkErr, detail, status
- Imported by: src/app/api/admin/invite/route.test.ts
- Tests related: src/app/api/admin/invite/route.test.ts
- Contents summary: Next.js route handler for `/api/admin/invite`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

### `src/app/api/admin/users/[id]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/admin/users/[id]
- Exports: PATCH
- Symbol details: function PATCH (exported), const UpdateUserSchema
- Defines: PATCH, UpdateUserSchema, adminErr, id, remainingSlugs
- Contents summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

### `src/app/api/agent-outcomes/action-item/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/agent-outcomes/action-item
- Exports: POST
- Symbol details: function POST (exported), function metadataString, function agentLabel, function buildActionItemTitle, function buildActionItemDescription
- Defines: metadataString, agentLabel, buildActionItemTitle, buildActionItemDescription, POST, value, agentName, assetName, eventName, outcomeText, sections, guard, parsed, taskId, context, campaignId, … (+8 more)
- Contents summary: Next.js route handler for `/api/agent-outcomes/action-item`; route handlers: POST; exports: POST; internal imports: 9; package imports: 1

### `src/app/api/agents/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/agents
- Exports: POST, GET
- Symbol details: function POST (exported), function GET (exported)
- Defines: POST, GET, adminErr, raw, parsed, taskId, action, agents
- Imported by: __tests__/api/agents.test.ts
- Tests related: __tests__/api/agents.test.ts
- Contents summary: Next.js route handler for `/api/agents`; route handlers: POST, GET; exports: POST, GET; internal imports: 5; package imports: 2

### `src/app/api/agents/email/watch/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/agents/email/watch
- Exports: POST
- Symbol details: function POST (exported), function unauthorized
- Defines: unauthorized, POST, expectedSecret, url, secret
- Contents summary: Next.js route handler for `/api/agents/email/watch`; route handlers: POST; exports: POST; package imports: 1

### `src/app/api/agents/heartbeat/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/agents/heartbeat
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, raw, parsed, secretErr
- Imported by: __tests__/api/agents-heartbeat.test.ts
- Tests related: __tests__/api/agents-heartbeat.test.ts
- Contents summary: Next.js route handler for `/api/agents/heartbeat`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

### `src/app/api/agents/job/[id]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/agents/job/[id]
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET, adminErr, id, job
- Contents summary: Next.js route handler for `/api/agents/job/[id]`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

### `src/app/api/agents/jobs/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/agents/jobs
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET, adminErr, jobs
- Imported by: __tests__/api/agents-jobs.test.ts
- Tests related: __tests__/api/agents-jobs.test.ts
- Contents summary: Next.js route handler for `/api/agents/jobs`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

### `src/app/api/alerts/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/alerts
- Exports: POST, PATCH, GET
- Symbol details: function POST (exported), function PATCH (exported), function GET (exported)
- Defines: POST, PATCH, GET, secretErr
- Imported by: __tests__/api/alerts.test.ts
- Tests related: __tests__/api/alerts.test.ts
- Contents summary: Next.js route handler for `/api/alerts`; route handlers: POST, PATCH, GET; exports: POST, PATCH, GET; internal imports: 3; package imports: 1

### `src/app/api/campaign-comments/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/campaign-comments
- Exports: GET, POST, PATCH, DELETE
- Symbol details: function GET (exported), function POST (exported), function PATCH (exported), function DELETE (exported), function getCampaignName, function getCampaignContext, function campaignCommentTriagePrompt
- Defines: getCampaignName, getCampaignContext, campaignCommentTriagePrompt, GET, POST, PATCH, DELETE, campaignId, clientSlug, access, commentsDb, user, authorName, campaignName, taskId, id, … (+3 more)
- Imported by: src/app/api/campaign-comments/route.test.ts
- Tests related: src/app/api/campaign-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/campaign-comments`; route handlers: GET, POST, PATCH, DELETE; exports: GET, POST, PATCH, DELETE; internal imports: 11; package imports: 2

### `src/app/api/campaign-comments/action-item/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/campaign-comments/action-item
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, guard, parsed, body, commentId, existingItem, campaign, effectiveClientSlug, item
- Contents summary: Next.js route handler for `/api/campaign-comments/action-item`; route handlers: POST; exports: POST; internal imports: 6; package imports: 1

### `src/app/api/client/[slug]/agent/threads/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/client/[slug]/agent/threads
- Exports: GET, POST
- Symbol details: function GET (exported), function POST (exported), type RouteContext
- Defines: GET, POST, result, RouteContext
- Imported by: src/app/api/client/[slug]/agent/threads/route.test.ts
- Tests related: src/app/api/client/[slug]/agent/threads/route.test.ts
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads`; route handlers: GET, POST; exports: GET, POST; internal imports: 1; package imports: 1

### `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/client/[slug]/agent/threads/[threadId]
- Exports: GET
- Symbol details: function GET (exported), type RouteContext
- Defines: GET, result, RouteContext
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Tests related: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]`; route handlers: GET; exports: GET; internal imports: 1; package imports: 1

### `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/client/[slug]/agent/threads/[threadId]/messages
- Exports: POST
- Symbol details: function POST (exported), const SendMessageSchema, type RouteContext
- Defines: POST, SendMessageSchema, parsed, result, RouteContext
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Tests related: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]/messages`; route handlers: POST; exports: POST; internal imports: 4; package imports: 2

### `src/app/api/contact/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/contact
- Exports: POST
- Symbol details: function POST (exported), function withLabel, const resend, const contactRecipient
- Defines: withLabel, POST, resend, contactRecipient, trimmed, fullMessage
- Contents summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

### `src/app/api/event-comments/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/event-comments
- Exports: GET, POST, PATCH
- Symbol details: function GET (exported), function POST (exported), function PATCH (exported), function eventCommentTriagePrompt, const CreateScopedEventCommentSchema
- Defines: eventCommentTriagePrompt, GET, POST, PATCH, CreateScopedEventCommentSchema, eventId, clientSlug, access, event, commentsDb, user, authorName, eventName, taskId, id, effectiveClientSlug, … (+1 more)
- Imported by: src/app/api/event-comments/route.test.ts
- Tests related: src/app/api/event-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/event-comments`; route handlers: GET, POST, PATCH; exports: GET, POST, PATCH; internal imports: 11; package imports: 3

### `src/app/api/health/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/health
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET
- Imported by: src/app/api/health/route.test.ts
- Tests related: src/app/api/health/route.test.ts
- Contents summary: Next.js route handler for `/api/health`; route handlers: GET; exports: GET; internal imports: 1; package imports: 1

### `src/app/api/ingest/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/ingest
- Exports: POST, GET
- Symbol details: function POST (exported), function GET (exported)
- Defines: POST, GET, secretErr
- Imported by: __tests__/api/ingest.test.ts
- Tests related: __tests__/api/ingest.test.ts
- Contents summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 6; package imports: 1

### `src/app/api/meta/callback/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/meta/callback
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET, url, error, appUrl, errorDesc
- Imported by: src/app/api/meta/callback/route.test.ts
- Tests related: src/app/api/meta/callback/route.test.ts
- Contents summary: Next.js route handler for `/api/meta/callback`; route handlers: GET; exports: GET; package imports: 1

### `src/app/api/meta/data-deletion/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/meta/data-deletion
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, appUrl, formData, confirmationCode
- Imported by: src/app/api/meta/data-deletion/route.test.ts
- Tests related: src/app/api/meta/data-deletion/route.test.ts
- Contents summary: Next.js route handler for `/api/meta/data-deletion`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

### `src/app/api/ticketmaster/tm1/move-selection/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/ticketmaster/tm1/move-selection
- Exports: POST
- Symbol details: function POST (exported), function guard, const StringIdSchema, const PlaceSelectionSchema, const RowSelectionSchema, const ReservedSectionSelectionSchema, const PartialGaSelectionSchema, const FullGaSelectionSchema, const BackendSelectionSchema, const SuccessActionSchema, const MoveTargetSchema, const BodySchema
- Defines: guard, POST, StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, SuccessActionSchema, MoveTargetSchema, BodySchema, url, authHeader, bearer, secret, … (+6 more)
- Imported by: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Tests related: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

### `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/ticketmaster/tm1/request-move-selection
- Exports: POST
- Symbol details: function POST (exported), function guard, const StringIdSchema, const PlaceSelectionSchema, const RowSelectionSchema, const ReservedSectionSelectionSchema, const PartialGaSelectionSchema, const FullGaSelectionSchema, const BackendSelectionSchema, const AllocationTargetSchema, const ResolutionStatusSchema, const BodySchema
- Defines: guard, POST, StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, AllocationTargetSchema, ResolutionStatusSchema, BodySchema, url, authHeader, bearer, secret, … (+7 more)
- Imported by: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Tests related: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/request-move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

### `src/app/api/ticketmaster/tm1/snapshot/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/ticketmaster/tm1/snapshot
- Exports: GET
- Symbol details: function GET (exported), function wantsRaw, function guard, const QuerySchema
- Defines: wantsRaw, guard, GET, QuerySchema, url, authHeader, bearer, secret, secretErr, authErr, parsed, client, snapshot
- Imported by: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Tests related: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/snapshot`; route handlers: GET; exports: GET; internal imports: 2; package imports: 2

### `src/app/api/user/profile/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/user/profile
- Exports: POST
- Symbol details: function POST (exported), const ProfileSchema
- Defines: POST, ProfileSchema, raw, parsed, client
- Contents summary: Next.js route handler for `/api/user/profile`; route handlers: POST; exports: POST; internal imports: 1; package imports: 3

### `src/app/client/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client
- Exports: ClientPickerPage, default
- Symbol details: default function ClientPickerPage (exported), interface ClientPickerPageProps
- Defines: ClientPickerPage, user, meta, params, entry, memberships, firstName, ClientPickerPageProps
- Contents summary: Next.js page for `/client`; exports: ClientPickerPage, default; internal imports: 2; package imports: 6

### `src/app/client/[slug]/layout.tsx`
- Type: Next.js layout
- Ownership: web client route surface
- Route: /client/[slug]
- Exports: ClientLayout, generateMetadata, default
- Symbol details: default function ClientLayout (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientLayout, clientName, portalConfig, clerkEnabled, meta, isAdmin, entry, agentEnabled, eventsEnabled, reportsEnabled, theme, Props
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js layout for `/client/[slug]`; exports: ClientLayout, generateMetadata, default; internal imports: 7; package imports: 5

### `src/app/client/[slug]/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Route: /client/[slug]
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]`; exports: default; internal imports: 1

### `src/app/client/[slug]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]
- Exports: ClientPortalRootPage, default
- Symbol details: default function ClientPortalRootPage (exported), interface ClientPortalRootPageProps
- Defines: ClientPortalRootPage, ClientPortalRootPageProps
- Imported by: src/app/client/[slug]/page.test.tsx
- Tests related: src/app/client/[slug]/page.test.tsx
- Contents summary: Next.js page for `/client/[slug]`; exports: ClientPortalRootPage, default; package imports: 1

### `src/app/client/[slug]/agent/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Route: /client/[slug]/agent
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/agent`; exports: default; internal imports: 1

### `src/app/client/[slug]/agent/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/agent
- Exports: ClientAgentPage, generateMetadata, default
- Symbol details: default function ClientAgentPage (exported), function generateMetadata (exported), interface ClientAgentPageProps
- Defines: generateMetadata, ClientAgentPage, clientName, access, portalConfig, initialThreads, result, ClientAgentPageProps
- Imported by: src/app/client/[slug]/agent/page.test.tsx
- Tests related: src/app/client/[slug]/agent/page.test.tsx
- Contents summary: Next.js page for `/client/[slug]/agent`; exports: ClientAgentPage, generateMetadata, default; internal imports: 5; package imports: 1

### `src/app/client/[slug]/campaign/[campaignId]/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Route: /client/[slug]/campaign/[campaignId]
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/campaign/[campaignId]`; exports: default; internal imports: 1

### `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/campaign/[campaignId]
- Exports: CampaignDetailPage, default
- Symbol details: default function CampaignDetailPage (exported), function SnapshotCard, function FallbackCard, function OperatingRecommendations, function findTopAge, function findLeadingGender, function getDaysLive, function CampaignIntelligenceBrief, function hasMeaningfulCampaignWindow, function buildCampaignBrief, function formatStatus, function formatHour, function formatDay, interface Props
- Defines: CampaignDetailPage, SnapshotCard, FallbackCard, OperatingRecommendations, findTopAge, findLeadingGender, getDaysLive, CampaignIntelligenceBrief, hasMeaningfulCampaignWindow, buildCampaignBrief, formatStatus, formatHour, formatDay, range, theme, trackedDays, … (+31 more)
- Imported by: src/app/shell-import-smoke.test.ts
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/campaign/[campaignId]`; exports: CampaignDetailPage, default; internal imports: 13; package imports: 2

### `src/app/client/[slug]/campaigns/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Route: /client/[slug]/campaigns
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/campaigns`; exports: default; internal imports: 1

### `src/app/client/[slug]/campaigns/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/campaigns
- Exports: ClientCampaigns, generateMetadata, default
- Symbol details: default function ClientCampaigns (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientCampaigns, clientName, trendData, totalSpend, totalRevenue, totalImpressions, totalClicks, blendedRoas, hasData, avgCtr, avgCpc, avgCpm, insights, now, heroStats, … (+1 more)
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/campaigns`; exports: ClientCampaigns, generateMetadata, default; internal imports: 8; package imports: 2

### `src/app/client/[slug]/event/[eventId]/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Route: /client/[slug]/event/[eventId]
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/event/[eventId]`; exports: default; internal imports: 1

### `src/app/client/[slug]/event/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/event/[eventId]
- Exports: EventDetailPage, default
- Symbol details: default function EventDetailPage (exported), function PlatformBadge, function MetricCard, function MomentumRow, function TrendIcon, function ChannelCell, function buildEventBrief, interface Props
- Defines: EventDetailPage, PlatformBadge, MetricCard, MomentumRow, TrendIcon, ChannelCell, buildEventBrief, data, operatingView, dt, daysUntilEvent, hasTodayData, hasEdpData, currency, revenuePerTicket, briefText, … (+4 more)
- Imported by: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/event/[eventId]`; exports: EventDetailPage, default; internal imports: 12; package imports: 2

### `src/app/client/[slug]/events/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Route: /client/[slug]/events
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/events`; exports: default; internal imports: 1

### `src/app/client/[slug]/events/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/events
- Exports: ClientEventsPage, generateMetadata, default
- Symbol details: default function ClientEventsPage (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientEventsPage, clientName, Props
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/events`; exports: ClientEventsPage, generateMetadata, default; internal imports: 4; package imports: 3

### `src/app/client/[slug]/reports/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/reports
- Exports: ClientReportsPage, generateMetadata, default
- Symbol details: default function ClientReportsPage (exported), function generateMetadata (exported), interface ClientReportsPageProps
- Defines: generateMetadata, ClientReportsPage, clientName, ClientReportsPageProps
- Imported by: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/reports`; exports: ClientReportsPage, generateMetadata, default; internal imports: 4; package imports: 2

### `src/app/client/pending/layout.tsx`
- Type: Next.js layout
- Ownership: web client route surface
- Route: /client/pending
- Exports: PendingLayout, default
- Symbol details: default function PendingLayout (exported)
- Defines: PendingLayout, clerkEnabled
- Contents summary: Next.js layout for `/client/pending`; exports: PendingLayout, default; package imports: 3

### `src/app/client/pending/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/pending
- Exports: PendingPage, default
- Symbol details: default function PendingPage (exported)
- Defines: PendingPage
- Contents summary: Next.js page for `/client/pending`; exports: PendingPage, default; internal imports: 1; package imports: 1

### `src/app/connect-error/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /connect-error
- Exports: ConnectErrorPage, default
- Symbol details: default function ConnectErrorPage (exported), interface Props
- Defines: ConnectErrorPage, key, copy, detail, Props
- Contents summary: Next.js page for `/connect-error`; exports: ConnectErrorPage, default; package imports: 2

### `src/app/deletion-status/[code]/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /deletion-status/[code]
- Exports: DeletionStatusPage, metadata, default
- Symbol details: default function DeletionStatusPage (exported), const metadata (exported)
- Defines: DeletionStatusPage, metadata
- Contents summary: Next.js page for `/deletion-status/[code]`; exports: DeletionStatusPage, metadata, default

### `src/app/landing/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /landing
- Exports: LandingPage, metadata, default
- Symbol details: default function LandingPage (exported), const landingFont
- Defines: LandingPage, landingFont
- Contents summary: Next.js page for `/landing`; exports: LandingPage, metadata, default; internal imports: 6; package imports: 3

### `src/app/privacy/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /privacy
- Exports: PrivacyPage, metadata, default
- Symbol details: default function PrivacyPage (exported), const metadata (exported)
- Defines: PrivacyPage, metadata
- Contents summary: Next.js page for `/privacy`; exports: PrivacyPage, metadata, default

### `src/app/sign-in/[[...sign-in]]/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /sign-in/[[...sign-in]]
- Exports: SignInPage, dynamic, default
- Symbol details: default function SignInPage (exported), const dynamic (exported), interface SignInPageProps
- Defines: SignInPage, dynamic, params, inviteId, forceRedirectUrl, SignInPageProps
- Contents summary: Next.js page for `/sign-in/[[...sign-in]]`; exports: SignInPage, dynamic, default; package imports: 1

### `src/app/sign-up/[[...sign-up]]/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /sign-up/[[...sign-up]]
- Exports: SignUpPage, dynamic, default
- Symbol details: default function SignUpPage (exported), const dynamic (exported), interface SignUpPageProps
- Defines: SignUpPage, dynamic, params, inviteId, forceRedirectUrl, SignUpPageProps
- Imported by: src/app/sign-up/invite-flow.test.tsx
- Tests related: src/app/sign-up/invite-flow.test.tsx
- Contents summary: Next.js page for `/sign-up/[[...sign-up]]`; exports: SignUpPage, dynamic, default; package imports: 1

### `src/app/terms/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Route: /terms
- Exports: TermsPage, metadata, default
- Symbol details: default function TermsPage (exported), const metadata (exported)
- Defines: TermsPage, metadata
- Contents summary: Next.js page for `/terms`; exports: TermsPage, metadata, default

## Feature entry files

### `src/features/access/revalidation.ts`
- Type: TypeScript module
- Ownership: feature module: access
- Exports: getAccessManagementPaths, revalidateAccessManagementPaths
- Symbol details: function getAccessManagementPaths (exported), function revalidateAccessManagementPaths (exported), interface AccessManagementPathsInput
- Defines: getAccessManagementPaths, revalidateAccessManagementPaths, paths, AccessManagementPathsInput
- Imported by: __tests__/features/access/revalidation.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1

### `src/features/agent-outcomes/server.ts`
- Type: TypeScript module
- Ownership: feature module: agent-outcomes
- Exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext
- Symbol details: function matchesContext (exported), function listAgentOutcomes (exported), function getAgentOutcomeContext (exported), function mapRequestRow, function mapTaskRow, interface AgentOutcomeContext (exported), interface ListAgentOutcomesOptions
- Defines: mapRequestRow, mapTaskRow, matchesContext, listAgentOutcomes, getAgentOutcomeContext, requestAssetId, requestCampaignId, requestEventId, matchesScopedCampaign, matchesScopedEvent, matchesScopedAsset, matchesRequestedEvent, db, scopeCampaignIds, scopeEventIds, scopeAssetIds, … (+14 more)
- Imported by: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/agents/data.ts, src/app/api/agent-outcomes/action-item/route.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, src/features/reports/server.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Tests related: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/reports/integration.test.ts, … (+18 more)
- Contents summary: exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext; internal imports: 4

### `src/features/agent-outcomes/summary.ts`
- Type: TypeScript module
- Ownership: feature module: agent-outcomes
- Exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView
- Symbol details: function jsonToText (exported), function taskStatusToOutcomeStatus (exported), function buildAgentOutcomeView (exported), function isRecord, function metadataString, type AgentOutcomeStatus (exported), type AgentOutcomeVisibility (exported), interface AgentOutcomeRequestRecord (exported), interface AgentOutcomeTaskRecord (exported), interface AgentOutcomeView (exported)
- Defines: isRecord, jsonToText, taskStatusToOutcomeStatus, metadataString, buildAgentOutcomeView, value, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView
- Imported by: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/app/api/agent-outcomes/action-item/route.ts, src/components/admin/agents/command-summary.tsx, src/features/agent-outcomes/server.ts, src/features/agents/summary.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, src/features/operations-center/summary.ts, src/features/reports/server.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Tests related: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/agents/summary.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+21 more)
- Contents summary: exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView; internal imports: 1

### `src/features/agents/summary.ts`
- Type: TypeScript module
- Ownership: feature module: agents
- Exports: buildAgentCommandSummary, AgentCommandMetric, AgentCommandOutcomeBucket, AgentCommandSummary
- Symbol details: function buildAgentCommandSummary (exported), function runtimeDetail, function recentCutoff, function isRecent, function compareAttentionJobs, function hasLinkedWork, function isActionableOutcome, function outcomeBucketKey, function compareActionableOutcomes, interface AgentCommandMetric (exported), interface AgentCommandOutcomeBucket (exported), interface AgentCommandSummary (exported)
- Defines: runtimeDetail, recentCutoff, isRecent, compareAttentionJobs, hasLinkedWork, isActionableOutcome, outcomeBucketKey, compareActionableOutcomes, buildAgentCommandSummary, statusWeight, statusDiff, now, nonAssistantJobs, running, failedRecent, actionableOutcomes, … (+6 more)
- Imported by: __tests__/features/agents/summary.test.ts, src/app/admin/agents/data.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/command-summary.tsx
- Route owners: src/app/admin/agents/page.tsx
- Tests related: __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: buildAgentCommandSummary, AgentCommandMetric, AgentCommandOutcomeBucket, AgentCommandSummary; internal imports: 3

### `src/features/approvals/server.ts`
- Type: TypeScript module
- Ownership: feature module: approvals
- Exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest
- Symbol details: function approvalMatchesCampaign (exported), function listApprovalRequests (exported), function listCampaignApprovalRequests (exported), function listEventApprovalRequests (exported), function mapApproval, function buildApprovalListQuery, const APPROVAL_SELECT, type ApprovalAudience (exported), type ApprovalStatus (exported), interface ApprovalRequest (exported), interface ListApprovalRequestsOptions, interface ListCampaignApprovalRequestsOptions, interface ListEventApprovalRequestsOptions
- Defines: approvalMatchesCampaign, mapApproval, buildApprovalListQuery, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, APPROVAL_SELECT, approvalReadDb, requestedLimit, shouldOverfetchForScope, effectiveCampaignIds, effectiveCampaignIdSet, approvals, approval, campaignId, allowedAssetIds, … (+8 more)
- Imported by: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/features/approvals/summary.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts, src/features/dashboard/server.ts, src/features/events/client-operating.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Tests related: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+21 more)
- Contents summary: exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest; internal imports: 5

### `src/features/approvals/summary.ts`
- Type: TypeScript module
- Ownership: feature module: approvals
- Exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope
- Symbol details: function approvalCampaignId (exported), function approvalEventId (exported), function approvalAssetId (exported), function approvalIsWithinScope (exported), function filterApprovalRequestsByScope (exported), function approvalString, function normalizeScopeSet
- Defines: approvalString, normalizeScopeSet, approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope, value, campaignIds, eventIds, assetIds, campaignId, eventId, assetId
- Imported by: __tests__/features/approvals/summary.test.ts, src/features/approvals/server.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Tests related: __tests__/features/approvals/summary.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+21 more)
- Contents summary: exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope; internal imports: 2

### `src/features/asset-follow-up-items/server.ts`
- Type: TypeScript module
- Ownership: feature module: asset-follow-up-items
- Exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem
- Symbol details: function listAssetFollowUpItems (exported), function findAssetFollowUpItemBySource (exported), function getAssetFollowUpItemById (exported), function maybeEnqueueAssetFollowUpItemTriage (exported), function createSystemAssetFollowUpItem (exported), function shouldEnqueueAssetFollowUpItemTriage, function assetFollowUpItemTriagePrompt, function listAssetNames, function mapAssetFollowUpItem, const ASSET_FOLLOW_UP_ITEM_SELECT, type AssetFollowUpItemVisibility (exported), interface AssetFollowUpItem (exported), interface AssetFollowUpItemActor, interface AssetFollowUpItemTriagePreviousState, interface ListAssetFollowUpItemsOptions, interface CreateSystemAssetFollowUpItemInput
- Defines: shouldEnqueueAssetFollowUpItemTriage, assetFollowUpItemTriagePrompt, listAssetNames, mapAssetFollowUpItem, listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, ASSET_FOLLOW_UP_ITEM_SELECT, assetId, db, rows, assetIds, assetNames, taskId, … (+16 more)
- Imported by: src/app/api/agent-outcomes/action-item/route.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts
- Contents summary: exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem; internal imports: 6

### `src/features/assets/lib.ts`
- Type: TypeScript module
- Ownership: feature module: assets
- Exports: statusColor, mapAssetRow, mapAssetRows
- Symbol details: function statusColor (exported), function mapAssetRow (exported), function mapAssetRows (exported)
- Defines: statusColor, mapAssetRow, mapAssetRows
- Imported by: src/features/campaigns/server.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Contents summary: exports: statusColor, mapAssetRow, mapAssetRows; internal imports: 2

### `src/features/assets/server.ts`
- Type: TypeScript module
- Ownership: feature module: assets
- Exports: getClientAssetScope, assetMatchesScopedCampaigns, listVisibleAssetIdsForScope, getAssetRecordById, listAssetLibrary, getAssetOperatingData, listCampaignAssets, AssetOperatingRecord, AssetLinkedCampaign, AssetLibraryRecord, AssetOperatingData
- Symbol details: function getClientAssetScope (exported), function assetMatchesScopedCampaigns (exported), function listVisibleAssetIdsForScope (exported), function getAssetRecordById (exported), function listAssetLibrary (exported), function getAssetOperatingData (exported), function listCampaignAssets (exported), function filterCampaignsForScope, function listClientCampaignsForAssets, function getAssetReadContext, function normalizeCampaignName, function assetNameTokens, function assetMatchesCampaignName, function toNullableNumber, const ASSET_SELECT, const ASSET_OPERATING_SELECT, interface AssetOperatingRecord (exported), interface AssetLinkedCampaign (exported), interface AssetLibraryRecord (exported), interface AssetOperatingData (exported), … (+1 more)
- Defines: getClientAssetScope, filterCampaignsForScope, assetMatchesScopedCampaigns, listClientCampaignsForAssets, getAssetReadContext, listVisibleAssetIdsForScope, getAssetRecordById, normalizeCampaignName, assetNameTokens, assetMatchesCampaignName, toNullableNumber, listAssetLibrary, getAssetOperatingData, listCampaignAssets, ASSET_SELECT, ASSET_OPERATING_SELECT, … (+30 more)
- Imported by: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, src/features/campaigns/server.ts, … (+2 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, … (+6 more)
- Tests related: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/agent-outcomes/server.test.ts, … (+39 more)
- Contents summary: exports: getClientAssetScope, assetMatchesScopedCampaigns, listVisibleAssetIdsForScope, getAssetRecordById, listAssetLibrary, getAssetOperatingData, listCampaignAssets, AssetOperatingRecord; tests/describes: /; internal imports: 4; package imports: 1

### `src/features/assets/types.ts`
- Type: TypeScript module
- Ownership: feature module: assets
- Exports: Asset, AssetRow
- Symbol details: interface Asset (exported), interface AssetRow (exported)
- Defines: Asset, AssetRow
- Imported by: src/features/assets/lib.ts, src/features/assets/server.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, … (+6 more)
- Tests related: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+39 more)
- Contents summary: exports: Asset, AssetRow

### `src/features/campaign-action-items/server.ts`
- Type: TypeScript module
- Ownership: feature module: campaign-action-items
- Exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem
- Symbol details: function listCampaignActionItems (exported), function findCampaignActionItemBySource (exported), function getCampaignActionItemById (exported), function maybeEnqueueCampaignActionItemTriage (exported), function createSystemCampaignActionItem (exported), function updateSystemCampaignActionItem (exported), function shouldEnqueueCampaignActionItemTriage, function campaignActionItemTriagePrompt, function mapCampaignActionItem, const CAMPAIGN_ACTION_ITEM_SELECT, type CampaignActionItemVisibility (exported), interface CampaignActionItem (exported), interface CampaignActionItemActor, interface CampaignActionItemTriagePreviousState, interface ListCampaignActionItemsOptions, interface CreateSystemCampaignActionItemInput, interface UpdateSystemCampaignActionItemInput
- Defines: shouldEnqueueCampaignActionItemTriage, campaignActionItemTriagePrompt, mapCampaignActionItem, listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CAMPAIGN_ACTION_ITEM_SELECT, db, taskId, effectiveClientSlug, existing, status, priority, … (+17 more)
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/features/campaign-action-items/server.test.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem; internal imports: 7

### `src/features/campaign-comments/server.ts`
- Type: TypeScript module
- Ownership: feature module: campaign-comments
- Exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment
- Symbol details: function listCampaignComments (exported), function canAccessCampaignComments (exported), function mapCampaignComment, type CampaignCommentVisibility (exported), interface CampaignComment (exported), interface ListCampaignCommentsOptions
- Defines: mapCampaignComment, listCampaignComments, canAccessCampaignComments, db, user, role, isAdmin, access, CampaignCommentVisibility, CampaignComment, ListCampaignCommentsOptions
- Imported by: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment; internal imports: 2; package imports: 1

### `src/features/campaigns/client-operating.ts`
- Type: TypeScript module
- Ownership: feature module: campaigns
- Exports: getClientCampaignOperatingView, ClientCampaignOperatingView
- Symbol details: function getClientCampaignOperatingView (exported), interface ClientCampaignOperatingView (exported)
- Defines: getClientCampaignOperatingView, CampaignActionItem, CampaignComment, SystemEvent, ClientCampaignOperatingView
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getClientCampaignOperatingView, ClientCampaignOperatingView; internal imports: 8

### `src/features/campaigns/ownership-sync.ts`
- Type: TypeScript module
- Ownership: feature module: campaigns
- Exports: approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership
- Symbol details: function approvalMatchesCampaignOwnership (exported), function notificationMatchesCampaignOwnership (exported), function systemEventMatchesCampaignOwnership (exported), function isRecord, function metadataCampaignId, interface CampaignLinkedEntitySets
- Defines: isRecord, metadataCampaignId, approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership, campaignId, entityType, entityId, CampaignLinkedEntitySets
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/ownership-sync.test.ts, src/features/notifications/server.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/features/campaigns/ownership-sync.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, … (+9 more)
- Contents summary: exports: approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership

### `src/features/campaigns/server.ts`
- Type: TypeScript module
- Ownership: feature module: campaigns
- Exports: getCampaignOperatingData, CampaignOperatingData
- Symbol details: function getCampaignOperatingData (exported), function toNumber, function centsToDollars, interface CampaignOperatingData (exported), interface CampaignOperatingRow
- Defines: toNumber, centsToDollars, getCampaignOperatingData, amount, data, CampaignOperatingRow, CampaignOperatingData
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Contents summary: exports: getCampaignOperatingData, CampaignOperatingData; internal imports: 10

### `src/features/client-agent/model.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: type ClientAgentModelResponse, type ClientAgentRuntimeHistoryMessage, type GenerateClientAgentModelResponseInput, generateClientAgentModelResponse
- Defines: ClientAgentModelResponse, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput
- Imported by: src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Contents summary: exports: type ClientAgentModelResponse, type ClientAgentRuntimeHistoryMessage, type GenerateClientAgentModelResponseInput, generateClientAgentModelResponse; internal imports: 1

### `src/features/client-agent/policy.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: evaluatePromptPolicy
- Symbol details: function evaluatePromptPolicy (exported), const REFUSED_PATTERN, const REFUSAL_NOTE, const REFUSAL_MESSAGE, type PromptPolicyResult
- Defines: evaluatePromptPolicy, REFUSED_PATTERN, REFUSAL_NOTE, REFUSAL_MESSAGE, trimmed, safePrompt, PromptPolicyResult
- Imported by: src/features/client-agent/policy.test.ts, src/features/client-agent/runtime.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/policy.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Contents summary: exports: evaluatePromptPolicy

### `src/features/client-agent/range.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: normalizeRange, resolveRangeFromMessage
- Symbol details: function normalizeRange (exported), function resolveRangeFromMessage (exported), function getFormatter, function getLocalDateString, function parseDate, function formatDate, function addDays, function startOfWeek, function startOfMonth, function startOfQuarter, const RANGE_ALIASES, const formatterCache, type NormalizeRangeOptions
- Defines: getFormatter, getLocalDateString, parseDate, formatDate, addDays, startOfWeek, startOfMonth, startOfQuarter, normalizeRange, resolveRangeFromMessage, RANGE_ALIASES, formatterCache, parts, year, month, day, … (+13 more)
- Imported by: src/features/client-agent/range.test.ts, src/features/client-agent/runtime.ts, src/features/client-agent/tools/search.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/range.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, … (+1 more)
- Contents summary: exports: normalizeRange, resolveRangeFromMessage; tests/describes: -; internal imports: 1

### `src/features/client-agent/readers.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: loadClientAgentCampaignDetail, loadClientAgentEventDetail
- Symbol details: function loadClientAgentCampaignDetail (exported), function loadClientAgentEventDetail (exported), function toCampaignDetailRange
- Defines: toCampaignDetailRange, loadClientAgentCampaignDetail, loadClientAgentEventDetail, CampaignDetailRangeInput
- Imported by: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/overview.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/tools/search.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
- Contents summary: exports: loadClientAgentCampaignDetail, loadClientAgentEventDetail; internal imports: 4

### `src/features/client-agent/runtime.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: runClientAgentRuntime, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput, ClientAgentModelResponse
- Symbol details: function runClientAgentRuntime (exported), function uniqueReferencedEntities, function inferPrimaryDomainFromEntities, function initializeAuthorityState, function buildContextPayload, function safeError, function buildHistoryContextMemo, function looksLikeBroadAdsQuestion, function looksLikeBroadEventsQuestion, function looksLikeContextDependentFollowUp, function resetAuthorityStateForBroadMessage, function buildInstructions, function parseTaggedOutput, function extractRangeFromArgs, function mergeAuthorityState, function getToolShape, function buildAllowedToolNames, function extractAssistantText, function isSuccessfulResultMessage, function buildToolServer, … (+4 more)
- Defines: uniqueReferencedEntities, inferPrimaryDomainFromEntities, initializeAuthorityState, buildContextPayload, safeError, buildHistoryContextMemo, looksLikeBroadAdsQuestion, looksLikeBroadEventsQuestion, looksLikeContextDependentFollowUp, resetAuthorityStateForBroadMessage, buildInstructions, parseTaggedOutput, extractRangeFromArgs, mergeAuthorityState, getToolShape, buildAllowedToolNames, … (+68 more)
- Imported by: src/features/client-agent/model.test.ts, src/features/client-agent/model.ts, src/features/client-agent/runtime.test.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Contents summary: exports: runClientAgentRuntime, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput, ClientAgentModelResponse; internal imports: 6; package imports: 2

### `src/features/client-agent/server.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: listThreads, createThread, getThread, sendMessage
- Symbol details: function listThreads (exported), function createThread (exported), function getThread (exported), function sendMessage (exported), function errorResult, function mapAccessFailure, function mapStoreFailure, function resolveScope, function blankThread, function eventNameForStatus, function fallbackAssistantResponseId, type ErrorResult, type SuccessResult, type ServiceResult, type ThreadListBody, type PreviewThread, type ThreadBody, type SendMessageBody
- Defines: errorResult, mapAccessFailure, mapStoreFailure, resolveScope, blankThread, listThreads, createThread, getThread, eventNameForStatus, fallbackAssistantResponseId, sendMessage, access, portalConfig, memberAccess, now, result, … (+13 more)
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/features/client-agent/server.test.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- Contents summary: exports: listThreads, createThread, getThread, sendMessage; internal imports: 9

### `src/features/client-agent/store.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage
- Symbol details: function createThread (exported), function listThreads (exported), function getThread (exported), function appendUserMessage (exported), function appendAssistantMessage (exported), function previewUnavailable, function notFound, function writeFailed, function isEntityAllowed, function normalizeReferencedEntities, function normalizeThreadContextPayload, function isThreadVisible, function uniqueReferencedEntities, function truncate, function mapThreadRow, function mapMessageRow, function isMessageVisible, function loadThreadRow, function loadThreadMessages, function loadMessageByField, … (+4 more)
- Defines: previewUnavailable, notFound, writeFailed, isEntityAllowed, normalizeReferencedEntities, normalizeThreadContextPayload, isThreadVisible, uniqueReferencedEntities, truncate, mapThreadRow, mapMessageRow, isMessageVisible, loadThreadRow, loadThreadMessages, loadMessageByField, refreshThreadSummary, … (+30 more)
- Imported by: src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/store.test.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Contents summary: exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage; internal imports: 3

### `src/features/client-agent/thread-context.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: ThreadContextPayloadSchema, ThreadContextPayload
- Symbol details: const ThreadContextPayloadSchema (exported), type ThreadContextPayload (exported)
- Defines: ThreadContextPayloadSchema, ThreadContextPayload
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/runtime.ts, src/features/client-agent/server.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.test.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Tests related: src/features/client-agent/thread-context.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, … (+2 more)
- Contents summary: exports: ThreadContextPayloadSchema, ThreadContextPayload; internal imports: 1; package imports: 1

### `src/features/client-agent/tool-contracts.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, SearchScopeRequestSchema, AdsOverviewRequestSchema, EventsOverviewRequestSchema, CampaignDetailsRequestSchema, EventDetailsRequestSchema, CreativeDetailsRequestSchema, DemographicBreakdownRequestSchema, GeographyBreakdownRequestSchema, PlacementBreakdownRequestSchema, CompareEntitiesRequestSchema, … (+34 more)
- Symbol details: const DomainSchema (exported), const EntityTypeSchema (exported), const AdsMetricSchema (exported), const EventsMetricSchema (exported), const CompareMetricSchema (exported), const IntervalSchema (exported), const SearchScopeRequestSchema (exported), const AdsOverviewRequestSchema (exported), const EventsOverviewRequestSchema (exported), const CampaignDetailsRequestSchema (exported), const EventDetailsRequestSchema (exported), const CreativeDetailsRequestSchema (exported), const DemographicBreakdownRequestSchema (exported), const GeographyBreakdownRequestSchema (exported), const PlacementBreakdownRequestSchema (exported), const CompareEntitiesRequestSchema (exported), const TimeseriesRequestSchema (exported), const SearchScopeResponseSchema (exported), const AdsOverviewResponseSchema (exported), const EventsOverviewResponseSchema (exported), … (+4 more)
- Defines: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, adsOnlyMetrics, eventsOnlyMetrics, SearchScopeRequestSchema, AdsOverviewRequestSchema, EventsOverviewRequestSchema, CampaignDetailsRequestSchema, EventDetailsRequestSchema, CreativeDetailsRequestSchema, OptionalCampaignEventAnchorsSchema, DemographicBreakdownRequestSchema, … (+48 more)
- Imported by: src/features/client-agent/runtime.ts, src/features/client-agent/tool-contracts.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.ts, src/features/client-agent/tools/search.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tool-contracts.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+5 more)
- Contents summary: exports: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, SearchScopeRequestSchema, AdsOverviewRequestSchema; internal imports: 1; package imports: 1

### `src/features/client-agent/types.ts`
- Type: TypeScript module
- Ownership: feature module: client-agent
- Exports: AgentResponseStatusSchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryMessageSchema, MetricCardsBlockSchema, TableBlockSchema, ChartBlockSchema, AgentAnswerBlockSchema, AgentResponseStatus, ReferencedEntity, ResolvedRange, ClientAgentScope, AgentHistoryMessage, AgentAnswerBlock
- Symbol details: const AgentResponseStatusSchema (exported), const ReferencedEntitySchema (exported), const ResolvedRangePresetSchema (exported), const ResolvedRangeSchema (exported), const ClientAgentScopeSchema (exported), const AgentHistoryMessageSchema (exported), const MetricCardsBlockSchema (exported), const TableBlockSchema (exported), const ChartBlockSchema (exported), const AgentAnswerBlockSchema (exported), const CampaignReferencedEntitySchema, const EventReferencedEntitySchema, const CreativeReferencedEntitySchema, const AgentHistoryContextPayloadSchema, const MetricCardSchema, const TableCellSchema, const ChartPointSchema, const ChartSeriesSchema, type AgentResponseStatus (exported), type ReferencedEntity (exported), … (+4 more)
- Defines: AgentResponseStatusSchema, CampaignReferencedEntitySchema, EventReferencedEntitySchema, CreativeReferencedEntitySchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryContextPayloadSchema, AgentHistoryMessageSchema, MetricCardSchema, MetricCardsBlockSchema, TableCellSchema, TableBlockSchema, sortedColumns, sortedKeys, … (+10 more)
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/range.ts, src/features/client-agent/readers.ts, src/features/client-agent/runtime.ts, src/features/client-agent/server.ts, src/features/client-agent/store.test.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/tool-contracts.ts, … (+5 more)
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Tests related: src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/range.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, … (+9 more)
- Contents summary: exports: AgentResponseStatusSchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryMessageSchema, MetricCardsBlockSchema, TableBlockSchema; package imports: 1

### `src/features/client-portal/access.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi
- Symbol details: function resolveClientPortalAccess (exported), function requireClientAccess (exported), function requireClientAgentAccess (exported), function requireClientEventsAccess (exported), function requireClientReportsAccess (exported), function resolveClientAgentAccessForApi (exported), function isAdminPortalViewer, function requireResolvedClientAccess, function resolveClientPortalFeatureAccess, type Viewer, type PortalAccessAllowed, type PortalAccessRedirect, type PortalAccessResolution
- Defines: isAdminPortalViewer, resolveClientPortalAccess, requireResolvedClientAccess, resolveClientPortalFeatureAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi, user, meta, entry, access, scope, destination, featureEnabled, … (+4 more)
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.test.tsx, … (+4 more)
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+1 more)
- Tests related: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts, … (+3 more)
- Contents summary: exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi; internal imports: 3; package imports: 2

### `src/features/client-portal/campaign-detail.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: getCampaignDetail, type CampaignDetailRangeInput
- Defines: CampaignDetailRangeInput
- Imported by: src/features/client-agent/readers.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
- Contents summary: exports: getCampaignDetail, type CampaignDetailRangeInput; internal imports: 1

### `src/features/client-portal/config.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: getClientPortalConfig, ClientPortalConfig
- Symbol details: const getClientPortalConfig (exported), interface ClientPortalConfig (exported)
- Defines: getClientPortalConfig, user, role, clerkDb, ClientPortalConfig
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/config.test.ts
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, … (+2 more)
- Tests related: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+5 more)
- Contents summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2

### `src/features/client-portal/entry.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput
- Symbol details: function resolveClientPortalEntry (exported), function listPendingClientAccessInvites (exported), function acceptClientAccessInvite (exported), function getUserEmailAddresses (exported), function normalizeEmails, function normalizeClientSlug, function normalizeClient, type ClientPortalEntry (exported), interface PendingClientAccessInvite (exported), interface ResolveClientPortalEntryInput (exported), interface ResolveClientPortalEntryDeps
- Defines: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, normalizeEmails, normalizeClientSlug, normalizeClient, memberships, preferredMembership, pendingInvites, normalizedEmails, client, emails, primaryEmail, value, ClientPortalEntry, … (+3 more)
- Imported by: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.test.ts
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, … (+4 more)
- Tests related: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, … (+5 more)
- Contents summary: exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2

### `src/features/client-portal/event-detail.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: getEventDetail
- Imported by: src/features/client-agent/readers.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
- Contents summary: exports: getEventDetail; internal imports: 1

### `src/features/client-portal/insights.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative, generateRecommendations, DATE_OPTIONS, TrendPoint, … (+2 more)
- Symbol details: function buildTrendData (exported), function buildEventCard (exported), function computeDailyDeltas (exported), function getDaysUntilEvent (exported), function computeVelocity (exported), function roasLabel (exported), function buildAudienceProfile (exported), function generateCampaignInsights (exported), function findBestHour (exported), function summarizeDayOfWeekPerformance (exported), function findBestDayOfWeek (exported), function findTopMarket (exported), function findTopCreative (exported), function generateRecommendations (exported), function detectPlatform, function sliceRate, function computeTrendRate, function weightedAvg, function formatHour, function formatWeekday, … (+2 more)
- Defines: buildTrendData, detectPlatform, buildEventCard, computeDailyDeltas, sliceRate, computeTrendRate, getDaysUntilEvent, computeVelocity, roasLabel, weightedAvg, buildAudienceProfile, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, … (+62 more)
- Imported by: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/lib.ts, src/features/reports/server.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Tests related: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+19 more)
- Contents summary: exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights; internal imports: 4

### `src/features/client-portal/scope.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: allowsCampaignInScope, allowsEventInScope
- Symbol details: function allowsCampaignInScope (exported), function allowsEventInScope (exported)
- Defines: allowsCampaignInScope, allowsEventInScope
- Imported by: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, … (+13 more)
- Contents summary: exports: allowsCampaignInScope, allowsEventInScope; internal imports: 1

### `src/features/client-portal/theme.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides
- Symbol details: function getClientPortalTheme (exported), function createTheme, const DEFAULT_THEME, const HOMEBUYER_ALIASES, const HOMEBUYER_THEME, interface ClientPortalTheme (exported), interface ClientPortalThemeOverrides (exported)
- Defines: getClientPortalTheme, createTheme, DEFAULT_THEME, HOMEBUYER_ALIASES, HOMEBUYER_THEME, normalized, baseTheme, brandBadge, brandLogoSrc, brandLogoAlt, ClientPortalTheme, ClientPortalThemeOverrides
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/theme.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Contents summary: exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides; package imports: 1

### `src/features/client-portal/types.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, GeographyBreakdown, Recommendation, … (+6 more)
- Symbol details: const DAY_LABELS (exported), type TmEvent (exported), type DemographicsRow (exported), type TicketPlatform (exported), interface CampaignCard (exported), interface HeroStats (exported), interface EventCard (exported), interface AudienceProfile (exported), interface Insight (exported), interface AgeGenderBreakdown (exported), interface PlacementBreakdown (exported), interface AdCard (exported), interface HourlyBreakdown (exported), interface DailyPoint (exported), interface GeographyBreakdown (exported), interface Recommendation (exported), interface CampaignDetailData (exported), interface TicketSnapshot (exported), interface LinkedCampaign (exported), interface DailyDelta (exported), … (+2 more)
- Defines: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, GeographyBreakdown, Recommendation, … (+6 more)
- Imported by: src/app/client/[slug]/types.ts, src/features/client-portal/insights.ts, src/features/reports/server.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/dashboard/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Tests related: src/app/client/[slug]/lib.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+19 more)
- Contents summary: exports: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile; internal imports: 1

### `src/features/clients/summary.ts`
- Type: TypeScript module
- Ownership: feature module: clients
- Exports: buildClientWorkflowHealth, compareClientWorkflowHealth, getClientAttentionPressure, hasClientAttention, compareClientAccountHealth, ClientWorkflowCounts, ClientWorkflowHealth, ClientAccountHealth
- Symbol details: function buildClientWorkflowHealth (exported), function compareClientWorkflowHealth (exported), function getClientAttentionPressure (exported), function hasClientAttention (exported), function compareClientAccountHealth (exported), interface ClientWorkflowCounts (exported), interface ClientWorkflowHealth (exported), interface ClientAccountHealth (exported)
- Defines: buildClientWorkflowHealth, compareClientWorkflowHealth, getClientAttentionPressure, hasClientAttention, compareClientAccountHealth, rightPressure, leftPressure, ClientWorkflowCounts, ClientWorkflowHealth, ClientAccountHealth
- Imported by: __tests__/features/clients/summary.test.ts, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: __tests__/features/clients/summary.test.ts, src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: buildClientWorkflowHealth, compareClientWorkflowHealth, getClientAttentionPressure, hasClientAttention, compareClientAccountHealth, ClientWorkflowCounts, ClientWorkflowHealth, ClientAccountHealth

### `src/features/conversations/server.ts`
- Type: TypeScript module
- Ownership: feature module: conversations
- Exports: matchesConversationKinds, listConversationThreads
- Symbol details: function matchesConversationKinds (exported), function listConversationThreads (exported), function stringValue, function sortThreads, interface GetConversationsCenterOptions
- Defines: stringValue, sortThreads, matchesConversationKinds, listConversationThreads, db, limitPerKind, effectiveClientCampaignIds, allowedCampaignIds, allowedEventIds, campaignRows, rawAssetRows, eventRows, scopedAssetIds, assetRows, campaignNames, assetNames, … (+13 more)
- Imported by: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/features/dashboard/server.ts
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, … (+16 more)
- Contents summary: exports: matchesConversationKinds, listConversationThreads; internal imports: 5

### `src/features/conversations/summary.ts`
- Type: TypeScript module
- Ownership: feature module: conversations
- Exports: ConversationThreadKind, ConversationThread
- Symbol details: type ConversationThreadKind (exported), interface ConversationThread (exported)
- Defines: ConversationThreadKind, ConversationThread
- Imported by: src/features/conversations/server.ts, src/features/dashboard/server.ts
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, … (+16 more)
- Contents summary: exports: ConversationThreadKind, ConversationThread

### `src/features/dashboard/server.ts`
- Type: TypeScript module
- Ownership: feature module: dashboard
- Exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter
- Symbol details: function getDashboardOpsSummary (exported), function getDashboardActionCenter (exported), function emptySummary, function resolveCampaignId, function resolveCampaignName, function resolveAssetId, function resolveAssetName, function resolveEventId, function resolveEventName, type DashboardActionCenterDiscussion (exported), interface DashboardActionCenterApproval (exported), interface DashboardActionCenter (exported), interface GetDashboardOpsSummaryOptions, interface GetDashboardActionCenterOptions
- Defines: emptySummary, resolveCampaignId, resolveCampaignName, resolveAssetId, resolveAssetName, resolveEventId, resolveEventName, getDashboardOpsSummary, getDashboardActionCenter, campaignId, metadataName, assetId, assetName, eventId, db, effectiveClientCampaignIds, … (+25 more)
- Imported by: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/features/reports/server.ts
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Contents summary: exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter; internal imports: 6

### `src/features/dashboard/summary.ts`
- Type: TypeScript module
- Ownership: feature module: dashboard
- Exports: buildDashboardOpsSummary, DashboardSummaryMode, DashboardMetricKey, DashboardCampaignRecord, DashboardApprovalRecord, DashboardActionItemRecord, DashboardCommentRecord, DashboardEventRecord, DashboardOpsMetric, DashboardAttentionCampaign, DashboardOpsSummary
- Symbol details: function buildDashboardOpsSummary (exported), function fallbackCampaignName, function metadataString, function resolveCampaignId, function sortDateDesc, function buildMetrics, function ensureAggregate, function bumpLastActivity, type DashboardSummaryMode (exported), type DashboardMetricKey (exported), type CampaignAggregate, interface DashboardCampaignRecord (exported), interface DashboardApprovalRecord (exported), interface DashboardActionItemRecord (exported), interface DashboardCommentRecord (exported), interface DashboardEventRecord (exported), interface DashboardOpsMetric (exported), interface DashboardAttentionCampaign (exported), interface DashboardOpsSummary (exported), interface BuildDashboardOpsSummaryInput
- Defines: fallbackCampaignName, metadataString, resolveCampaignId, sortDateDesc, buildMetrics, ensureAggregate, bumpLastActivity, buildDashboardOpsSummary, value, existing, aggregates, campaignId, aggregate, rankedAttentionCampaigns, attentionCampaigns, pendingApprovals, … (+16 more)
- Imported by: __tests__/features/dashboard/summary.test.ts, src/features/dashboard/server.ts, src/features/reports/server.ts
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/dashboard/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, … (+15 more)
- Contents summary: exports: buildDashboardOpsSummary, DashboardSummaryMode, DashboardMetricKey, DashboardCampaignRecord, DashboardApprovalRecord, DashboardActionItemRecord, DashboardCommentRecord, DashboardEventRecord; internal imports: 2

### `src/features/event-comments/server.ts`
- Type: TypeScript module
- Ownership: feature module: event-comments
- Exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment
- Symbol details: function listEventComments (exported), function canAccessEventComments (exported), function mapEventComment, type EventCommentVisibility (exported), interface EventComment (exported), interface ListEventCommentsOptions
- Defines: mapEventComment, listEventComments, canAccessEventComments, db, user, role, isAdmin, access, EventCommentVisibility, EventComment, ListEventCommentsOptions
- Imported by: src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/components/event-operating-panel.tsx, src/features/events/client-operating.ts, src/features/events/server.ts
- Route owners: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Tests related: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, … (+18 more)
- Contents summary: exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment; internal imports: 2; package imports: 1

### `src/features/event-follow-up-items/server.ts`
- Type: TypeScript module
- Ownership: feature module: event-follow-up-items
- Exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility, EventFollowUpItem
- Symbol details: function listEventFollowUpItems (exported), function findEventFollowUpItemBySource (exported), function getEventFollowUpItemById (exported), function maybeEnqueueEventFollowUpItemTriage (exported), function createSystemEventFollowUpItem (exported), function updateSystemEventFollowUpItem (exported), function deleteEventFollowUpItem (exported), function shouldEnqueueEventFollowUpItemTriage, function eventFollowUpItemTriagePrompt, function listEventInfo, function mapEventFollowUpItem, const EVENT_FOLLOW_UP_ITEM_SELECT, type EventFollowUpItemVisibility (exported), interface EventFollowUpItem (exported), interface EventFollowUpItemActor, interface EventFollowUpItemTriagePreviousState, interface ListEventFollowUpItemsOptions, interface CreateSystemEventFollowUpItemInput, interface UpdateSystemEventFollowUpItemInput
- Defines: shouldEnqueueEventFollowUpItemTriage, eventFollowUpItemTriagePrompt, listEventInfo, mapEventFollowUpItem, listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EVENT_FOLLOW_UP_ITEM_SELECT, record, eventId, event, db, … (+19 more)
- Imported by: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/api/agent-outcomes/action-item/route.ts, src/features/events/client-operating.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility; internal imports: 6

### `src/features/events/client-operating.ts`
- Type: TypeScript module
- Ownership: feature module: events
- Exports: getClientEventOperatingView, ClientEventOperatingView
- Symbol details: function getClientEventOperatingView (exported), interface ClientEventOperatingView (exported)
- Defines: getClientEventOperatingView, linkedCampaignIds, EventComment, EventFollowUpItem, SystemEvent, ClientEventOperatingView
- Imported by: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getClientEventOperatingView, ClientEventOperatingView; internal imports: 8

### `src/features/events/server.ts`
- Type: TypeScript module
- Ownership: feature module: events
- Exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData
- Symbol details: function getEventRecordById (exported), function getEventOperatingData (exported), function getEventOperationsSummary (exported), function mapEventRow, interface EventOperatingRecord (exported), interface EventLinkedCampaign (exported), interface EventClientOption (exported), interface EventOperatingData (exported), interface EventLinkedCampaignRow, interface GetEventOperationsSummaryOptions
- Defines: mapEventRow, getEventRecordById, getEventOperatingData, getEventOperationsSummary, event, linkedCampaignRows, comments, db, allowedEventIds, recentSince, allowedEventSet, eventId, EventOperationsCommentRecord, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsUpdateRecord, … (+6 more)
- Imported by: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/components/admin/events/event-operating-panel.tsx, src/features/campaigns/server.ts, … (+1 more)
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Tests related: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/api/event-comments/route.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, … (+16 more)
- Contents summary: exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData; internal imports: 6

### `src/features/events/summary.ts`
- Type: TypeScript module
- Ownership: feature module: events
- Exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord, EventOperationsSummary
- Symbol details: function buildEventOperationsSummary (exported), function sortDateDesc, function ensureAggregate, function bumpLastActivity, type EventOperationsMetricKey (exported), interface EventOperationsMetric (exported), interface EventOperationsEventRecord (exported), interface EventOperationsFollowUpRecord (exported), interface EventOperationsCommentRecord (exported), interface EventOperationsUpdateRecord (exported), interface EventAttentionRecord (exported), interface EventOperationsSummary (exported), interface BuildEventOperationsSummaryInput
- Defines: sortDateDesc, ensureAggregate, bumpLastActivity, buildEventOperationsSummary, existing, aggregates, aggregate, ranked, openFollowUps, urgentFollowUps, openDiscussions, recentUpdates, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, … (+5 more)
- Imported by: __tests__/features/events/summary.test.ts, src/features/events/server.ts, src/features/reports/server.ts
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Tests related: __tests__/features/events/summary.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/api/event-comments/route.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, … (+17 more)
- Contents summary: exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord; internal imports: 2

### `src/features/invitations/server.ts`
- Type: TypeScript module
- Ownership: feature module: invitations
- Exports: buildActionableInvitations, listActionableInvitations
- Symbol details: function buildActionableInvitations (exported), function listActionableInvitations (exported), function toActionableInvitationStatus, function normalizeClientSlug, interface ClientAccessInviteLike, interface ListActionableInvitationsOptions
- Defines: buildActionableInvitations, listActionableInvitations, toActionableInvitationStatus, normalizeClientSlug, excluded, email, status, rows, clerkIds, clerkStatuses, clerk, invitations, effectiveStatus, ClientAccessInviteLike, ListActionableInvitationsOptions
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/features/invitations/server.test.ts
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: buildActionableInvitations, listActionableInvitations; internal imports: 3; package imports: 1

### `src/features/invitations/sort.ts`
- Type: TypeScript module
- Ownership: feature module: invitations
- Exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses
- Symbol details: function invitationStatusPriority (exported), function compareActionableInvitationState (exported), function countActionableInvitationStatuses (exported), function toTimestamp
- Defines: toTimestamp, invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses, statusOrder
- Imported by: src/components/admin/clients/members-section.tsx, src/features/invitations/server.ts, src/features/settings/summary.ts, src/features/users/summary.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses; internal imports: 1

### `src/features/invitations/types.ts`
- Type: TypeScript module
- Ownership: feature module: invitations
- Exports: ActionableInvitationStatus, ActionableInvitation
- Symbol details: type ActionableInvitationStatus (exported), interface ActionableInvitation (exported)
- Defines: ActionableInvitationStatus, ActionableInvitation
- Imported by: src/app/admin/users/data.ts, src/features/invitations/server.ts, src/features/invitations/sort.ts, src/features/shared/admin-summary-types.ts, src/lib/formatters.tsx
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, … (+14 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+45 more)
- Contents summary: exports: ActionableInvitationStatus, ActionableInvitation

### `src/features/notifications/discussions.ts`
- Type: TypeScript module
- Ownership: feature module: notifications
- Exports: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, DiscussionNotificationInput
- Symbol details: function listDiscussionNotificationRecipientIds (exported), function notifyDiscussionAudience (exported), type DiscussionNotificationVisibility, interface DiscussionNotificationInput (exported), interface DiscussionRecipientOptions
- Defines: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, recipientIds, DiscussionNotificationVisibility, DiscussionRecipientOptions, DiscussionNotificationInput
- Imported by: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Tests related: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Contents summary: exports: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, DiscussionNotificationInput; internal imports: 1

### `src/features/notifications/server.ts`
- Type: TypeScript module
- Ownership: feature module: notifications
- Exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope
- Symbol details: function createNotification (exported), function listNotificationsForUser (exported), function listClientNotificationRecipients (exported), function listAdminNotificationRecipients (exported), function isRetiredCrmApprovalRow (exported), function filterNotificationsByScope (exported), function isRetiredCrmNotificationEntityType, function isRetiredCrmRouteEntityType, function isRetiredCrmNotification, function mapNotificationRow, function getNotificationReadClient, function isScopedNotificationEntity, function emptyNotificationEntityContext, function emptyNotificationRouteContext, function extractNotificationContextFromApprovalRow, function extractNotificationRouteContextFromApprovalRow, function mapScopedEntityRelations, function mapNotificationRouteRelations, function resolveNotificationRouteMaps, function enrichNotificationsForRouting, … (+4 more)
- Defines: isRetiredCrmNotificationEntityType, isRetiredCrmRouteEntityType, isRetiredCrmNotification, mapNotificationRow, getNotificationReadClient, createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isScopedNotificationEntity, emptyNotificationEntityContext, emptyNotificationRouteContext, extractNotificationContextFromApprovalRow, isRetiredCrmApprovalRow, extractNotificationRouteContextFromApprovalRow, mapScopedEntityRelations, … (+58 more)
- Imported by: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/features/notifications/discussions.ts, src/features/notifications/workflow.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, … (+7 more)
- Contents summary: exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope; internal imports: 6; package imports: 1

### `src/features/notifications/types.ts`
- Type: TypeScript module
- Ownership: feature module: notifications
- Exports: AppNotification, CreateNotificationInput
- Symbol details: interface AppNotification (exported), interface CreateNotificationInput (exported)
- Defines: AppNotification, CreateNotificationInput
- Imported by: src/features/notifications/server.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, … (+7 more)
- Contents summary: exports: AppNotification, CreateNotificationInput

### `src/features/notifications/workflow.ts`
- Type: TypeScript module
- Ownership: feature module: notifications
- Exports: notifyWorkflowAssignee
- Symbol details: function notifyWorkflowAssignee (exported), type WorkflowAssignmentVisibility, interface WorkflowAssignmentNotificationInput
- Defines: notifyWorkflowAssignee, adminIds, WorkflowAssignmentVisibility, WorkflowAssignmentNotificationInput
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+3 more)
- Contents summary: exports: notifyWorkflowAssignee; internal imports: 1

### `src/features/operations-center/summary.ts`
- Type: TypeScript module
- Ownership: feature module: operations-center
- Exports: countActionableAgentOutcomes
- Symbol details: function countActionableAgentOutcomes (exported), function hasLinkedWork
- Defines: hasLinkedWork, countActionableAgentOutcomes
- Imported by: __tests__/features/operations-center/summary.test.ts, src/features/agents/summary.ts
- Route owners: src/app/admin/agents/page.tsx
- Tests related: __tests__/features/operations-center/summary.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: countActionableAgentOutcomes; internal imports: 1

### `src/features/reports/server.ts`
- Type: TypeScript module
- Ownership: feature module: reports
- Exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData
- Symbol details: function getReportsData (exported), function getReportsWorkflowData (exported), function detectPlatform, function toReportsCampaign, function toReportsEvent, interface ReportsData (exported), interface ReportsWorkflowData (exported), interface GetReportsDataOptions, interface GetReportsWorkflowDataOptions
- Defines: detectPlatform, toReportsCampaign, toReportsEvent, getReportsData, getReportsWorkflowData, sold, available, capacity, sellThrough, reportsDb, result, allowed, campaignIds, snapshots, eventsRes, events, … (+11 more)
- Imported by: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/client/[slug]/reports/page.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+8 more)
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+10 more)
- Contents summary: exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData; internal imports: 14

### `src/features/reports/summary.ts`
- Type: TypeScript module
- Ownership: feature module: reports
- Exports: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary
- Symbol details: function buildReportsSummary (exported), interface ReportsCampaignCard (exported), interface ReportsEventCard (exported), interface ReportsSummary (exported)
- Defines: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary
- Imported by: __tests__/features/reports/summary.test.ts, src/features/reports/server.ts
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/reports/summary.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+11 more)
- Contents summary: exports: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary

### `src/features/settings/connected-accounts.ts`
- Type: TypeScript module
- Ownership: feature module: settings
- Exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary
- Symbol details: function getConnectedAccountHealth (exported), function buildConnectedAccountsSummary (exported), function asDate, function daysUntil, const DAY_MS, const EXPIRING_SOON_DAYS, const STALE_DAYS, type ConnectedAccountHealthKey (exported), interface ConnectedAccount (exported), interface ConnectedAccountHealth (exported), interface ConnectedAccountsSummary (exported)
- Defines: asDate, daysUntil, getConnectedAccountHealth, buildConnectedAccountsSummary, DAY_MS, EXPIRING_SOON_DAYS, STALE_DAYS, parsed, expiry, daysRemaining, recentActivity, inactiveDays, counts, health, ConnectedAccountHealthKey, ConnectedAccount, … (+2 more)
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/settings/page.tsx, src/features/settings/summary.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, __tests__/features/settings/summary.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary

### `src/features/settings/summary.ts`
- Type: TypeScript module
- Ownership: feature module: settings
- Exports: buildPlatformSettingsSummary, PlatformSettingsMetricKey, PlatformKeyStatus, PlatformSettingsMetric, PlatformSettingsSummary
- Symbol details: function buildPlatformSettingsSummary (exported), type PlatformSettingsMetricKey (exported), interface PlatformKeyStatus (exported), interface PlatformSettingsMetric (exported), interface PlatformSettingsSummary (exported)
- Defines: buildPlatformSettingsSummary, now, configuredIntegrations, missingIntegrations, connectionSummary, accessInvites, pendingInviteCount, expiredInviteCount, clientsNeedingSetup, accountsBySlug, existing, connectionRiskClients, accounts, healthyAccounts, attentionAccounts, ConnectedAccount, … (+4 more)
- Imported by: __tests__/features/settings/summary.test.ts, src/app/admin/settings/page.tsx
- Route owners: src/app/admin/settings/page.tsx
- Tests related: __tests__/features/settings/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: buildPlatformSettingsSummary, PlatformSettingsMetricKey, PlatformKeyStatus, PlatformSettingsMetric, PlatformSettingsSummary; internal imports: 3

### `src/features/shared/admin-summary-types.ts`
- Type: TypeScript module
- Ownership: feature module: shared
- Exports: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike
- Symbol details: const CLIENT_SUMMARY_FIELDS (exported), const USER_ROW_FIELDS (exported), interface ClientSummaryLike (exported), interface UserRowLike (exported)
- Defines: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike
- Imported by: __tests__/features/shared/admin-summary-types.test.ts, src/features/settings/summary.ts, src/features/users/summary.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: __tests__/features/shared/admin-summary-types.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike; internal imports: 1

### `src/features/system-events/server.ts`
- Type: TypeScript module
- Ownership: feature module: system-events
- Exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, listEventSystemEvents, summarizeChangedFields, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent
- Symbol details: function filterSystemEventsByScope (exported), function getCurrentActor (exported), function logSystemEvent (exported), function listSystemEvents (exported), function listCampaignSystemEvents (exported), function listEventSystemEvents (exported), function summarizeChangedFields (exported), function eventMatchesCampaign, function eventMatchesEventContext, function systemEventCampaignId, function systemEventEventId, function systemEventAssetId, function normalizeScopeSet, function metadataString, function normalizeOccurredAt, function agentTaskEventId, function resolveEventSource, function resolveCorrelationId, function resolveCausationId, function resolveIdempotencyKey, … (+4 more)
- Defines: eventMatchesCampaign, eventMatchesEventContext, systemEventCampaignId, systemEventEventId, systemEventAssetId, normalizeScopeSet, metadataString, normalizeOccurredAt, agentTaskEventId, resolveEventSource, resolveCorrelationId, resolveCausationId, resolveIdempotencyKey, isEnvelopeSchemaError, isSystemEventIdempotencyConflict, mapSystemEventRow, … (+44 more)
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/events.ts, … (+17 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+9 more)
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, … (+29 more)
- Contents summary: exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, listEventSystemEvents, summarizeChangedFields, SystemEventName; internal imports: 1; package imports: 1

### `src/features/users/summary.ts`
- Type: TypeScript module
- Ownership: feature module: users
- Exports: buildUsersAccessSummary, UsersAccessSummary
- Symbol details: function buildUsersAccessSummary (exported), function compareCreatedAtDesc, function compareAccessInvitePriority, function compareClientCoverage, interface UsersAccessSummary (exported)
- Defines: compareCreatedAtDesc, compareAccessInvitePriority, compareClientCoverage, buildUsersAccessSummary, accessInvites, pendingInviteCount, expiredInviteCount, unassignedClientUsers, clientsNeedingCoverage, UsersAccessSummary
- Imported by: __tests__/features/users/summary.test.ts, src/app/admin/users/page.tsx
- Route owners: src/app/admin/users/page.tsx
- Tests related: __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: buildUsersAccessSummary, UsersAccessSummary; internal imports: 2

### `src/features/workflow/revalidation.ts`
- Type: TypeScript module
- Ownership: feature module: workflow
- Exports: getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath
- Symbol details: function getCampaignWorkflowPaths (exported), function getAssetWorkflowPaths (exported), function getEventWorkflowPaths (exported), function getApprovalWorkflowPaths (exported), function revalidateWorkflowPaths (exported), function revalidateClientAgentPath (exported), function uniquePaths, function clientPaths, function metadataString, function clientCampaignsPath, interface ApprovalWorkflowPathsInput
- Defines: uniquePaths, clientPaths, metadataString, clientCampaignsPath, getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath, value, clientSlug, campaignId, eventId, assetId, ApprovalWorkflowPathsInput
- Imported by: src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, … (+4 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, … (+4 more)
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, … (+6 more)
- Contents summary: exports: getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath; package imports: 1

## Shared web libraries

### `src/lib/action-item-labels.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: taskStatusLabel, FIELD_LABELS
- Symbol details: function taskStatusLabel (exported)
- Defines: taskStatusLabel
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, … (+2 more)
- Contents summary: exports: taskStatusLabel, FIELD_LABELS; internal imports: 1

### `src/lib/agent-dispatch.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: enqueueExternalAgentTask
- Symbol details: function enqueueExternalAgentTask (exported), interface EnqueueExternalAgentTaskInput
- Defines: enqueueExternalAgentTask, taskId, EnqueueExternalAgentTaskInput
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+4 more)
- Contents summary: exports: enqueueExternalAgentTask; internal imports: 2; package imports: 1

### `src/lib/agent-jobs.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, AgentJobView
- Symbol details: function mapTaskToJob (exported), function listAgentJobs (exported), function getAgentJob (exported), function getLatestAgentStatuses (exported), function getHeartbeatStatus (exported), function isRecord, function taskStatusToUiStatus, function jsonToText, function taskPrompt, function isDisplayableTask, const DISPLAYABLE_TO_AGENTS, const DISPLAYABLE_FROM_AGENTS, type AgentTaskRow, type RuntimeStateRow, type AgentTaskJobRow, interface AgentJobView (exported)
- Defines: isRecord, taskStatusToUiStatus, jsonToText, taskPrompt, isDisplayableTask, mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, DISPLAYABLE_TO_AGENTS, DISPLAYABLE_FROM_AGENTS, jobs, latest, job, value, … (+6 more)
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/agents/data.ts, src/app/admin/dashboard/data.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/features/agents/summary.ts
- Route owners: src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/admin/agents/page.tsx, src/app/admin/dashboard/page.tsx
- Tests related: __tests__/api/agents-jobs.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/api/agents.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- Contents summary: exports: mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, AgentJobView; internal imports: 2

### `src/lib/api-helpers.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName, shouldEnqueueCommentTriage
- Symbol details: function apiError (exported), function dbError (exported), function authGuard (exported), function secretGuard (exported), function adminGuard (exported), function parseJsonBody (exported), function validateRequest (exported), function getAuthorName (exported), function shouldEnqueueCommentTriage (exported)
- Defines: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName, shouldEnqueueCommentTriage, caller, meta, role, raw, parsed
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, … (+29 more)
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, … (+20 more)
- Tests related: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, … (+14 more)
- Contents summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName; package imports: 3

### `src/lib/api-schemas.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, HeartbeatPayloadSchema, ContactFormSchema, CreateCampaignCommentSchema, CreateAssetCommentSchema, CreateEventCommentSchema, … (+2 more)
- Symbol details: const IngestPayloadSchema (exported), const AlertPostSchema (exported), const AlertPatchSchema (exported), const VALID_AGENTS (exported), const AgentPostSchema (exported), const InviteSchema (exported), const CreateClientSchema (exported), const UpdateClientSchema (exported), const AddClientMemberSchema (exported), const RemoveClientMemberSchema (exported), const ChangeClientMemberRoleSchema (exported), const HeartbeatPayloadSchema (exported), const ContactFormSchema (exported), const CreateCampaignCommentSchema (exported), const CreateAssetCommentSchema (exported), const CreateEventCommentSchema (exported), const ResolveCommentSchema (exported), const TmEventSchema, const MetaCampaignSchema, const TmDemographicsSchema, … (+1 more)
- Defines: TmEventSchema, MetaCampaignSchema, TmDemographicsSchema, IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, HeartbeatPayloadSchema, ContactFormSchema, … (+5 more)
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, … (+4 more)
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, … (+3 more)
- Tests related: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, src/app/api/campaign-comments/route.test.ts, … (+3 more)
- Contents summary: exports: IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema; package imports: 1

### `src/lib/campaign-client-assignment.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, CampaignClientAssignmentRow
- Symbol details: function getCampaignClientOverrideMap (exported), function resolveEffectiveCampaignClientSlug (exported), function applyEffectiveCampaignClientSlugs (exported), function getEffectiveCampaignRowById (exported), function getEffectiveCampaignClientSlug (exported), function listEffectiveCampaignRowsForClientSlug (exported), function listEffectiveCampaignIdsForClientSlug (exported), function campaignBelongsToClientSlug (exported), function normalizeGuessedClientSlug, interface CampaignClientAssignmentRow (exported)
- Defines: normalizeGuessedClientSlug, getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, overrides, uniqueCampaignIds, override, row, baseRows, existingIds, overrideCampaignIds, … (+4 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, … (+21 more)
- Route owners: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, … (+17 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/search.test.ts, … (+54 more)
- Contents summary: exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug; internal imports: 2

### `src/lib/campaign-event-match.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: matchedCampaigns, MatchableCampaign, MatchableEvent
- Symbol details: function matchedCampaigns (exported), function campaignCity, function campaignArtist, const CITY_KEYWORDS, type MatchableCampaign (exported), type MatchableEvent (exported)
- Defines: campaignCity, campaignArtist, matchedCampaigns, CITY_KEYWORDS, lower, eventArtist, eventCity, cArtist, cCity, MatchableCampaign, MatchableEvent
- Imported by: src/app/admin/dashboard/upcoming-shows.tsx, src/components/admin/events/columns.tsx
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/events/page.test.tsx
- Contents summary: exports: matchedCampaigns, MatchableCampaign, MatchableEvent

### `src/lib/client-slug.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: guessClientSlug
- Symbol details: function guessClientSlug (exported)
- Defines: guessClientSlug, lower
- Imported by: __tests__/lib/client-slug.test.ts, src/lib/campaign-client-assignment.ts
- Route owners: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, … (+17 more)
- Tests related: __tests__/lib/client-slug.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, … (+55 more)
- Contents summary: exports: guessClientSlug

### `src/lib/constants.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: parseRange, META_API_VERSION, META_PRESETS, RANGE_LABELS, EVENT_STATUS_OPTIONS, ASSET_STATUSES, ASSET_STATUS_COLORS, DateRange, AssetStatus
- Symbol details: function parseRange (exported), const META_API_VERSION (exported), const EVENT_STATUS_OPTIONS (exported), const ASSET_STATUSES (exported), type DateRange (exported), type AssetStatus (exported)
- Defines: parseRange, META_API_VERSION, EVENT_STATUS_OPTIONS, ASSET_STATUSES, DateRange, AssetStatus
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-section.tsx, src/app/client/[slug]/components/date-range-picker.tsx, src/app/client/[slug]/data.ts, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, … (+6 more)
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, … (+7 more)
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, … (+25 more)
- Contents summary: exports: parseRange, META_API_VERSION, META_PRESETS, RANGE_LABELS, EVENT_STATUS_OPTIONS, ASSET_STATUSES, ASSET_STATUS_COLORS, DateRange

### `src/lib/database.types.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: Constants, Json, Database, Tables, Enums, CompositeTypes
- Symbol details: const Constants (exported), type Json (exported), type Database (exported), type Tables (exported), type Enums (exported), type CompositeTypes (exported), type DatabaseWithoutInternals, type DefaultSchema
- Defines: Constants, Json, Database, DatabaseWithoutInternals, DefaultSchema, Tables, Enums, CompositeTypes
- Contents summary: exports: Constants, Json, Database, Tables, Enums, CompositeTypes

### `src/lib/env.ts`
- Type: TypeScript module
- Ownership: shared web library
- Symbol details: function validateEnv, const serverSchema, const publicSchema
- Defines: validateEnv, serverSchema, publicSchema, publicResult, missing, serverResult
- Imported by: src/instrumentation.ts
- Contents summary: package imports: 1

### `src/lib/export-csv.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: exportToCsv, todayFilename
- Symbol details: function exportToCsv (exported), function todayFilename (exported), function sanitize, type CsvColumn
- Defines: sanitize, exportToCsv, todayFilename, headers, csvRows, csv, blob, url, a, d, CsvColumn
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/events/event-table.tsx, src/components/admin/users/user-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: exportToCsv, todayFilename; tests/describes: T

### `src/lib/formatters.tsx`
- Type: React/TSX module
- Ownership: shared web library
- Exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, statusBadge, describeCount, MarginalRoasPoint
- Symbol details: function centsToUsd (exported), function fmtUsd (exported), function fmtNum (exported), function fmtDate (exported), function fmtTodayLong (exported), function slugToLabel (exported), function getInvitationStatusCfg (exported), function timeAgo (exported), function roasColor (exported), function fmtObjective (exported), function computeMarginalRoas (exported), function computeBlendedRoas (exported), function statusBadge (exported), function describeCount (exported), const CAMPAIGN_STATUSES, interface MarginalRoasPoint (exported), interface SpendRoasItem
- Defines: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, statusBadge, describeCount, date, diff, … (+9 more)
- Imported by: __tests__/lib/formatters.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/page.tsx, … (+50 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, … (+14 more)
- Tests related: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, … (+41 more)
- Contents summary: exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo; tests/describes: _; internal imports: 2

### `src/lib/google-ads.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION, GoogleAdsApiError, GoogleAdsCredentials, GoogleAdsAccessToken, GoogleAdsSearchStreamChunk, GoogleAdsSearchStreamResult, GoogleAdsSearchOptions, GoogleAdsCustomerSnapshot, GoogleAdsChildAccountSnapshot, … (+2 more)
- Symbol details: function normalizeGoogleAdsCustomerId (exported), function googleAdsSearchStreamUrl (exported), function getGoogleAdsCredentials (exported), function refreshGoogleAdsAccessToken (exported), function flattenGoogleAdsSearchStream (exported), function googleAdsSearchStream (exported), function fetchGoogleAdsFirstReadSnapshot (exported), function mapGoogleAdsCustomer, function mapGoogleAdsChildAccount, function mapGoogleAdsCampaign, function toNumber, function getGoogleAdsErrorMessage, function parseJsonResponse, const GOOGLE_ADS_API_VERSION (exported), class GoogleAdsApiError (exported), interface GoogleAdsCredentials (exported), interface GoogleAdsAccessToken (exported), interface GoogleAdsSearchStreamChunk (exported), interface GoogleAdsSearchStreamResult (exported), interface GoogleAdsSearchOptions (exported), … (+4 more)
- Defines: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, mapGoogleAdsCustomer, mapGoogleAdsChildAccount, mapGoogleAdsCampaign, toNumber, getGoogleAdsErrorMessage, parseJsonResponse, GOOGLE_ADS_API_VERSION, normalizedCustomerId, developerToken, … (+42 more)
- Imported by: src/lib/google-ads.test.ts, src/scripts/google-ads-discover-accounts.ts
- Tests related: src/lib/google-ads.test.ts
- Contents summary: exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION

### `src/lib/member-access.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess
- Symbol details: function getMemberships (exported), const getMemberAccessForSlug (exported), interface ScopeFilter (exported), interface MemberAccess (exported), interface ScopedAccess (exported)
- Defines: getMemberships, client, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/assets/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/client-agent/readers.ts, src/features/client-agent/server.test.ts, … (+12 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+12 more)
- Tests related: src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, … (+52 more)
- Contents summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

### `src/lib/meta-api.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange
- Symbol details: function fetchMetaApi (exported), function metaGet (exported), function metaInsightsUrl (exported), function metaUrl (exported), class MetaApiError (exported), type MetaInsightsTimeRange (exported)
- Defines: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, parsed, res, err, message, json, url, MetaApiError, MetaInsightsTimeRange
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/features/reports/server.ts, src/lib/meta-api.test.ts, src/lib/meta-campaigns.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+19 more)
- Contents summary: exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange; internal imports: 1

### `src/lib/meta-campaigns.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult
- Symbol details: function fetchAllCampaigns (exported), function getCredentials, function fetchAllPages, function loadCampaignTypes, function loadAllClientSlugs, function safeParseFloat, function buildCampaignFilter, function buildInsightsUrl, interface MetaCampaignCard (exported), interface DailyInsight (exported), interface MetaCampaignsResult (exported), interface MetaPagedResponse, interface RawCampaign, interface RawInsight, interface RawDailyInsight
- Defines: getCredentials, fetchAllPages, loadCampaignTypes, loadAllClientSlugs, safeParseFloat, buildCampaignFilter, buildInsightsUrl, fetchAllCampaigns, token, rawAccountId, accountId, res, body, json, paged, types, … (+28 more)
- Imported by: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx, src/features/campaigns/server.ts, … (+1 more)
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Tests related: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+17 more)
- Contents summary: exports: fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult; internal imports: 5

### `src/lib/meta-oauth.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: verifySignedRequest
- Symbol details: function verifySignedRequest (exported), function getAppSecret
- Defines: getAppSecret, verifySignedRequest, secret, expectedSig, actualSig
- Imported by: src/app/api/meta/data-deletion/route.ts, src/lib/meta-oauth.test.ts
- Route owners: src/app/api/meta/data-deletion/route.ts
- Tests related: src/lib/meta-oauth.test.ts, src/app/api/meta/data-deletion/route.test.ts
- Contents summary: exports: verifySignedRequest; tests/describes: .; package imports: 1

### `src/lib/shopify-admin.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, ShopifyAdminApiError, ShopifyAdminCredentials, ShopifyFirstReadSnapshot
- Symbol details: function getShopifyAdminCredentials (exported), function shopifyAdminGraphql (exported), function fetchShopifyFirstReadSnapshot (exported), const SHOPIFY_ADMIN_DEFAULT_API_VERSION (exported), class ShopifyAdminApiError (exported), interface ShopifyAdminCredentials (exported), interface ShopifyFirstReadSnapshot (exported), interface ShopifyGraphqlEnvelope, interface ShopifyFirstReadQueryResult
- Defines: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, storeDomain, accessToken, apiVersion, missing, credentials, response, body, data, ShopifyAdminApiError, ShopifyAdminCredentials, ShopifyFirstReadSnapshot, ShopifyGraphqlEnvelope, … (+1 more)
- Imported by: src/lib/shopify-admin.test.ts
- Tests related: src/lib/shopify-admin.test.ts
- Contents summary: exports: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, ShopifyAdminApiError, ShopifyAdminCredentials, ShopifyFirstReadSnapshot

### `src/lib/status.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: getCampaignStatusCfg, getEventStatusCfg
- Symbol details: function getCampaignStatusCfg (exported), function getEventStatusCfg (exported), type CampaignStatus, type EventStatus
- Defines: getCampaignStatusCfg, getEventStatusCfg, key, CampaignStatus, EventStatus
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/insights.ts, src/lib/formatters.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, … (+14 more)
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/lib/formatters.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+41 more)
- Contents summary: exports: getCampaignStatusCfg, getEventStatusCfg

### `src/lib/supabase.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin
- Symbol details: function createClerkSupabaseClient (exported), function getFeatureReadClient (exported), const supabaseAdmin (exported), const getCachedUser, const url, const anonKey, const serviceKey
- Defines: createClerkSupabaseClient, getFeatureReadClient, getCachedUser, url, anonKey, serviceKey, supabaseAdmin, user, role
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+75 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, … (+31 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, … (+73 more)
- Contents summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

### `src/lib/text-utils.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: excerpt
- Symbol details: function excerpt (exported)
- Defines: excerpt, normalized
- Imported by: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Tests related: src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Contents summary: exports: excerpt

### `src/lib/ticketmaster/tm1-client.ts`
- Type: TypeScript module
- Ownership: shared Ticketmaster library
- Exports: normalizeTm1Summary, createTm1ClientFromEnv, TM1_DEFAULT_BASE_URL, TM1_DEFAULT_API_PREFIX, TM1_DEFAULT_EVENTBASE_API_PREFIX, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_EXTERNAL_EVENT_VERSION_HEADER, TM1_IF_MATCH_HEADER, TM1_INVENTORY_ASSOCIATED_ACTION, TM1_INVENTORY_SET_TYPE_ALLOCATION, TM1_OPEN_SEAT_STATUS, TM1_EVENTBASE_ACCESS_TOKEN_HEADER, TM1_COLLABORATION_REQUEST_APPROVAL_MESSAGE, TM1_COLLABORATION_MOVE_TO_ALLOCATION, TM1_ALLOCATION_DESTINATION_TYPE, … (+25 more)
- Symbol details: function normalizeTm1Summary (exported), function createTm1ClientFromEnv (exported), function isRecord, function toNumber, function extractNumericValue, function firstNumericValue, function parseEtagVersion, function encodeIfMatch, function isUuid, function ensureRecordPayload, function extractInventoryVersion, function extractLayoutVersion, function extractExternalEventVersion, function withQuery, function sanitizeSuccessAction, function defaultSuccessAction, function decodeJwtPayload, function normalizeCollaborationSelection, function deriveSelectionTotalPlaces, function normalizeEventbaseAccessToken, … (+4 more)
- Defines: isRecord, toNumber, extractNumericValue, firstNumericValue, parseEtagVersion, encodeIfMatch, isUuid, ensureRecordPayload, extractInventoryVersion, extractLayoutVersion, extractExternalEventVersion, withQuery, sanitizeSuccessAction, defaultSuccessAction, decodeJwtPayload, normalizeCollaborationSelection, … (+99 more)
- Imported by: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/lib/ticketmaster/tm1-client.test.ts
- Route owners: src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts
- Tests related: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Contents summary: exports: normalizeTm1Summary, createTm1ClientFromEnv, TM1_DEFAULT_BASE_URL, TM1_DEFAULT_API_PREFIX, TM1_DEFAULT_EVENTBASE_API_PREFIX, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_EXTERNAL_EVENT_VERSION_HEADER; tests/describes: .; package imports: 1

### `src/lib/to-slug.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: toSlug
- Symbol details: function toSlug (exported)
- Defines: toSlug
- Imported by: src/components/admin/client-onboard-form.tsx, src/components/admin/clients/client-table.tsx, src/lib/to-slug.test.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx
- Tests related: src/lib/to-slug.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: toSlug

### `src/lib/utils.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: cn
- Symbol details: function cn (exported)
- Defines: cn
- Imported by: src/components/admin/agents/command-summary.tsx, src/components/admin/collapsible-sidebar.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/nav-links.tsx, src/components/ui/badge.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/command.tsx, src/components/ui/dialog.tsx, … (+7 more)
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, … (+21 more)
- Tests related: src/components/admin/agents/command-summary.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-discussion-form.test.tsx, … (+9 more)
- Contents summary: exports: cn; package imports: 2

### `src/lib/workspace-types.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: TASK_STATUSES, TASK_PRIORITIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TaskStatus, TaskPriority
- Symbol details: const TASK_STATUSES (exported), const TASK_PRIORITIES (exported), type TaskStatus (exported), type TaskPriority (exported)
- Defines: TASK_STATUSES, TASK_PRIORITIES, TaskStatus, TaskPriority
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/dashboard/summary.ts, src/features/event-follow-up-items/server.ts, src/features/events/summary.ts, … (+1 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/events/[eventId]/page.tsx, … (+5 more)
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/dashboard/summary.test.ts, … (+28 more)
- Contents summary: exports: TASK_STATUSES, TASK_PRIORITIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TaskStatus, TaskPriority

## Agent runtime files

### `agent/src/discord/commands/slash.ts`
- Type: TypeScript module
- Ownership: agent Discord adapter layer
- Exports: registerSlashCommands, registerSlashHandler
- Symbol details: function registerSlashCommands (exported), function registerSlashHandler (exported), function buildHelpText, const CLIENT_ID, const GUILD_ID, const commands
- Defines: registerSlashCommands, registerSlashHandler, buildHelpText, CLIENT_ID, GUILD_ID, commands, rest, msg, cmd, busy, Client, ChatInputCommandInteraction
- Imported by: agent/src/discord/core/entry.ts
- Tests related: agent/src/events/message-handler.test.ts
- Contents summary: exports: registerSlashCommands, registerSlashHandler; internal imports: 3; package imports: 1

### `agent/src/discord/core/entry.ts`
- Type: TypeScript module
- Ownership: agent Discord adapter layer
- Exports: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, notifyChannel, discordClient, channelSessions
- Symbol details: function checkAndReleaseStaleLock (exported), function markChannelLockAcquired (exported), function markChannelLockHeartbeat (exported), function markChannelLockReleased (exported), function startDiscordBot (exported), function stopDiscordRuntimeState (exported), function notifyChannel (exported), function resolveChannelId, const discordClient (exported), const channelSessions (exported), const token, const channelId, const channelLockTimestamps, const CHANNEL_LOCK_MAX_AGE_MS, const channelIdCache
- Defines: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, resolveChannelId, notifyChannel, token, channelId, discordClient, channelSessions, channelLockTimestamps, CHANNEL_LOCK_MAX_AGE_MS, acquiredAt, heldMs, … (+13 more)
- Imported by: agent/src/discord/commands/slash.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts
- Tests related: agent/src/events/message-handler.test.ts
- Contents summary: exports: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, notifyChannel, discordClient; internal imports: 9; package imports: 1

### `agent/src/discord/core/router.ts`
- Type: TypeScript module
- Ownership: agent Discord adapter layer
- Exports: getAgentForChannel, hasAgentRoute, isInternalChannel, isConfigChannel, AgentConfig
- Symbol details: function getAgentForChannel (exported), function hasAgentRoute (exported), function isInternalChannel (exported), function isConfigChannel (exported), const READ_ONLY_CHANNELS, interface AgentConfig (exported)
- Defines: getAgentForChannel, hasAgentRoute, isInternalChannel, isConfigChannel, READ_ONLY_CHANNELS, AgentConfig
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts
- Tests related: agent/src/events/message-handler.test.ts
- Contents summary: exports: getAgentForChannel, hasAgentRoute, isInternalChannel, isConfigChannel, AgentConfig

### `agent/src/events/message-handler.ts`
- Type: TypeScript module
- Ownership: agent event handling layer
- Exports: cleanForDiscord, chunkText, isChannelLocked, acquireChannelLock, releaseChannelLock, handleMessage
- Symbol details: function cleanForDiscord (exported), function chunkText (exported), function isChannelLocked (exported), function acquireChannelLock (exported), function releaseChannelLock (exported), function handleMessage (exported), function summarizeHistoryAttachments, function buildConversationContext, function deliverResponse, const channelLocks, const HISTORY_DEPTH
- Defines: cleanForDiscord, chunkText, summarizeHistoryAttachments, isChannelLocked, acquireChannelLock, releaseChannelLock, buildConversationContext, deliverResponse, handleMessage, channelLocks, HISTORY_DEPTH, names, suffix, channel, fetched, history, … (+18 more)
- Imported by: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts
- Tests related: agent/src/events/message-handler.test.ts
- Contents summary: exports: cleanForDiscord, chunkText, isChannelLocked, acquireChannelLock, releaseChannelLock, handleMessage; tests/describes: \|; internal imports: 5; package imports: 1

### `agent/src/index.ts`
- Type: TypeScript module
- Ownership: agent runtime source
- Symbol details: function readCommandForPid, function registerRuntimePid, function cleanupRuntimePid, function validateEnv, function shutdown, function gracefulExit, const agentRootDir, const sessionDir, const runtimePidFile
- Defines: readCommandForPid, registerRuntimePid, cleanupRuntimePid, validateEnv, shutdown, gracefulExit, agentRootDir, sessionDir, runtimePidFile, previousPid, command, registeredPid, required, missing, msg
- Contents summary: tests/describes: SIGINT; SIGTERM; SIGHUP; internal imports: 3; package imports: 2

### `agent/src/runner.ts`
- Type: TypeScript module
- Ownership: agent runtime source
- Exports: killAllClaude, runClaude, RUNNER_INACTIVITY_TIMEOUT_MS, RunnerOptions, RunnerResult
- Symbol details: function killAllClaude (exported), function runClaude (exported), function loadPrompt, const RUNNER_INACTIVITY_TIMEOUT_MS (exported), const __dirname, const AGENT_DIR, const PROMPTS_DIR, const CLAUDE_PATH, const activeProcs, interface RunnerOptions (exported), interface RunnerResult (exported)
- Defines: killAllClaude, loadPrompt, runClaude, __dirname, AGENT_DIR, PROMPTS_DIR, CLAUDE_PATH, activeProcs, path, RUNNER_INACTIVITY_TIMEOUT_MS, msg, baseArgs, args, proc, resetInactivityTimer, lines, … (+9 more)
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts
- Tests related: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts
- Contents summary: exports: killAllClaude, runClaude, RUNNER_INACTIVITY_TIMEOUT_MS, RunnerOptions, RunnerResult; tests/describes: \n; internal imports: 1; package imports: 4

### `agent/src/services/queue-service.ts`
- Type: TypeScript module
- Ownership: agent runtime service layer
- Exports: setTaskExecutor, stopPersistedTaskPoller, pollPersistedTasksNow, initQueue, enqueueTask, completeTask, failTask, escalateTask, approveTask, rejectTask, deferTask, waitForTaskTerminal, isAgentFree, getQueueDepth, getActiveTasks, pruneTaskRegistry, … (+2 more)
- Symbol details: function setTaskExecutor (exported), function stopPersistedTaskPoller (exported), function pollPersistedTasksNow (exported), function initQueue (exported), function enqueueTask (exported), function completeTask (exported), function failTask (exported), function escalateTask (exported), function approveTask (exported), function rejectTask (exported), function deferTask (exported), function waitForTaskTerminal (exported), function isAgentFree (exported), function getQueueDepth (exported), function getActiveTasks (exported), function pruneTaskRegistry (exported), function retirePendingTask, function reviveTask, function toTimelineTask, function runTask, … (+4 more)
- Defines: retirePendingTask, reviveTask, toTimelineTask, runTask, clearTaskTimeout, clearTaskRetry, clearTaskRetryState, setTaskExecutor, stopPersistedTaskPoller, fetchPendingPersistedTasks, pollPersistedTasksNow, startPersistedTaskPoller, initQueue, generateTaskId, countActive, enqueueTask, … (+57 more)
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: setTaskExecutor, stopPersistedTaskPoller, pollPersistedTasksNow, initQueue, enqueueTask, completeTask, failTask, escalateTask; tests/describes: queued; started; completed; internal imports: 2; package imports: 2

### `agent/src/services/runtime-state-service.ts`
- Type: TypeScript module
- Ownership: agent runtime service layer
- Exports: writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat
- Symbol details: function writeRuntimeHeartbeat (exported), function startRuntimeHeartbeat (exported), function stopRuntimeHeartbeat (exported), function getHeartbeatClient, const HEARTBEAT_INTERVAL_MS
- Defines: getHeartbeatClient, writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat, HEARTBEAT_INTERVAL_MS, url, key, client
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/runtime-state-service.test.ts
- Tests related: agent/src/services/runtime-state-service.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat; package imports: 1

### `agent/src/services/supabase-service.ts`
- Type: TypeScript module
- Ownership: agent runtime service layer
- Exports: getServiceSupabase
- Symbol details: function getServiceSupabase (exported)
- Defines: getServiceSupabase, url, key
- Imported by: agent/src/services/system-events-service.ts
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: getServiceSupabase; package imports: 1

### `agent/src/services/system-events-service.ts`
- Type: TypeScript module
- Ownership: agent runtime service layer
- Exports: logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, safeLogAgentTaskRequested, safeLogAgentTaskStarted, safeLogAgentTaskDeferred, safeLogAgentTaskStatus, logDiscordAgentTurn, AGENT_ACTIVITY_EVENT_NAMES, AgentSystemEventVisibility, AgentSystemEventActorType, AgentSystemEventInput, AgentSystemEvent, … (+4 more)
- Symbol details: function logAgentSystemEvent (exported), function safeLogAgentSystemEvent (exported), function listAgentSystemEvents (exported), function listRecentAgentActivity (exported), function formatAgentActivityLine (exported), function buildAgentActivityDigest (exported), function safeLogAgentTaskRequested (exported), function safeLogAgentTaskStarted (exported), function safeLogAgentTaskDeferred (exported), function safeLogAgentTaskStatus (exported), function logDiscordAgentTurn (exported), function clipText, function normalizeOccurredAt, function metadataString, function isEnvelopeSchemaError, function isIdempotencyConflict, function mapSystemEventRow, function matchesKeywords, function baseTaskMetadata, function taskStatusEventName, … (+4 more)
- Defines: clipText, normalizeOccurredAt, metadataString, isEnvelopeSchemaError, isIdempotencyConflict, mapSystemEventRow, logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, matchesKeywords, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, baseTaskMetadata, safeLogAgentTaskRequested, safeLogAgentTaskStarted, … (+37 more)
- Imported by: agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, safeLogAgentTaskRequested, safeLogAgentTaskStarted; internal imports: 2

### `agent/src/services/web-task-executor.ts`
- Type: TypeScript module
- Ownership: agent runtime service layer
- Exports: executeWebTask, createWebTaskExecutor
- Symbol details: function executeWebTask (exported), function createWebTaskExecutor (exported), function isSupportedWebAgent, function resolveTaskPrompt, const DEFAULT_PROMPTS, type SupportedWebAgent
- Defines: isSupportedWebAgent, resolveTaskPrompt, executeWebTask, createWebTaskExecutor, DEFAULT_PROMPTS, prompt, spec, result, SupportedWebAgent
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/web-task-executor.test.ts
- Tests related: agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: executeWebTask, createWebTaskExecutor; internal imports: 2

### `agent/src/services/webhook-service.ts`
- Type: TypeScript module
- Ownership: agent runtime service layer
- Exports: initWebhooks, sendAsAgent
- Symbol details: function initWebhooks (exported), function sendAsAgent (exported), function withWebhookInitTimeout, function ensureWebhook, const WEBHOOK_CACHE_TTL_MS, const WEBHOOK_INIT_TIMEOUT_MS, const WEBHOOK_NAME, const AGENT_DISPLAY_NAME, const AGENT_AVATAR_URL, const webhookCache, interface CachedWebhook
- Defines: withWebhookInitTimeout, initWebhooks, ensureWebhook, sendAsAgent, WEBHOOK_CACHE_TTL_MS, WEBHOOK_INIT_TIMEOUT_MS, WEBHOOK_NAME, AGENT_DISPLAY_NAME, AGENT_AVATAR_URL, webhookCache, guild, textChannels, webhooks, existing, created, channel, … (+5 more)
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts
- Tests related: agent/src/events/message-handler.test.ts
- Contents summary: exports: initWebhooks, sendAsAgent; internal imports: 1; package imports: 1

### `agent/src/utils/date-helpers.ts`
- Type: TypeScript module
- Ownership: agent utility layer
- Exports: todayCST, yesterdayCST, tomorrowCST
- Symbol details: function todayCST (exported), function yesterdayCST (exported), function tomorrowCST (exported), function cstNow
- Defines: cstNow, todayCST, yesterdayCST, tomorrowCST, d
- Imported by: agent/src/utils/session-loader.ts
- Contents summary: exports: todayCST, yesterdayCST, tomorrowCST

### `agent/src/utils/error-helpers.ts`
- Type: TypeScript module
- Ownership: agent utility layer
- Exports: toErrorMessage
- Symbol details: function toErrorMessage (exported)
- Defines: toErrorMessage
- Imported by: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.ts, agent/src/services/queue-service.ts, agent/src/services/system-events-service.ts, agent/src/services/webhook-service.ts
- Tests related: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/queue-service.test.ts
- Contents summary: exports: toErrorMessage

### `agent/src/utils/prompt-formatters.ts`
- Type: TypeScript module
- Ownership: agent utility layer
- Exports: campaignsSummary, eventsSummary
- Symbol details: function campaignsSummary (exported), function eventsSummary (exported)
- Defines: campaignsSummary, eventsSummary, status, spend, budget, roas, tickets
- Contents summary: exports: campaignsSummary, eventsSummary; internal imports: 1

### `agent/src/utils/session-loader.ts`
- Type: TypeScript module
- Ownership: agent utility layer
- Exports: loadEvents, loadCampaigns, categorizeEvents, EventData, CampaignData
- Symbol details: function loadEvents (exported), function loadCampaigns (exported), function categorizeEvents (exported), const __dir, const SESSION_DIR, interface EventData (exported), interface CampaignData (exported)
- Defines: loadEvents, loadCampaigns, categorizeEvents, __dir, SESSION_DIR, filePath, raw, t, y, tm, d, EventData, CampaignData
- Imported by: agent/src/utils/prompt-formatters.ts
- Contents summary: exports: loadEvents, loadCampaigns, categorizeEvents, EventData, CampaignData; internal imports: 1; package imports: 3

## Shared components

### `src/components/admin/activity-tracker.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: getPageLabel, ActivityTracker
- Symbol details: function getPageLabel (exported), function ActivityTracker (exported), function postActivity, const PAGE_LABELS, interface Props
- Defines: getPageLabel, postActivity, ActivityTracker, handleError, handleRejection, PAGE_LABELS, pathname, lastPathRef, sessionLoggedRef, debounceRef, msg, Props
- Imported by: src/app/admin/layout.tsx, src/components/admin/activity-tracker.test.ts
- Route owners: src/app/admin/layout.tsx
- Tests related: src/components/admin/activity-tracker.test.ts
- Contents summary: contains `use client`; exports: getPageLabel, ActivityTracker; internal imports: 1; package imports: 2

### `src/components/admin/agents/agent-sidebar.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AgentSidebar
- Symbol details: function AgentSidebar (exported), interface AgentSidebarProps
- Defines: AgentSidebar, agent, Icon, AgentSidebarProps
- Imported by: src/app/admin/agents/page.tsx
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: AgentSidebar; internal imports: 4; package imports: 1

### `src/components/admin/agents/chat-panel.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ChatPanel
- Symbol details: function ChatPanel (exported), function ResultText, function JobBubble, const POLL_MS, const REFRESH_MS, interface ChatPanelProps
- Defines: ResultText, JobBubble, ChatPanel, send, handleKeyDown, isLong, shown, Icon, label, hasPrompt, POLL_MS, REFRESH_MS, bottomRef, textareaRef, interval, res, … (+4 more)
- Imported by: src/app/admin/agents/page.tsx
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: ChatPanel; internal imports: 5; package imports: 3

### `src/components/admin/agents/command-summary.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AgentCommandSummarySection
- Symbol details: function AgentCommandSummarySection (exported), function outcomeContext, function actionableOutcomeNote, function nonZeroBuckets, function metricTone, function attentionIcon, interface AgentCommandSummaryProps
- Defines: outcomeContext, actionableOutcomeNote, nonZeroBuckets, metricTone, attentionIcon, AgentCommandSummarySection, buckets, tone, Icon, context, AgentCommandSummaryProps
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/command-summary.test.tsx
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/command-summary.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: AgentCommandSummarySection; internal imports: 9; package imports: 2

### `src/components/admin/agents/constants.ts`
- Type: TypeScript module
- Ownership: shared admin UI components
- Exports: agentName, AGENT_CONFIG, AGENT_TYPE_KEYS, QUICK_RUN_AGENTS, DASHBOARD_AGENTS, AgentInfo
- Symbol details: function agentName (exported), const AGENT_TYPE_KEYS (exported), const QUICK_RUN_AGENTS (exported), const DASHBOARD_AGENTS (exported), interface AgentInfo (exported)
- Defines: agentName, AGENT_TYPE_KEYS, QUICK_RUN_AGENTS, DASHBOARD_AGENTS, AgentInfo
- Imported by: src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/constants.test.ts, src/components/admin/agents/job-history.tsx
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/constants.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx
- Contents summary: exports: agentName, AGENT_CONFIG, AGENT_TYPE_KEYS, QUICK_RUN_AGENTS, DASHBOARD_AGENTS, AgentInfo; package imports: 1

### `src/components/admin/agents/job-history.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: JobHistory
- Symbol details: function JobHistory (exported), function durationMs, function fmtDuration, function outputText, function ExpandableRow, type JobHistoryFilter, interface Props, interface ExpandableRowProps
- Defines: durationMs, fmtDuration, outputText, JobHistory, handleFilterChange, handleQueryChange, toggleRow, ExpandableRow, text, preview, data, normalizedQuery, filteredData, haystack, table, filterCounts, … (+10 more)
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/job-history.test.tsx
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: JobHistory; internal imports: 10; package imports: 3

### `src/components/admin/agents/status-badge.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: StatusBadge
- Symbol details: function StatusBadge (exported), interface StatusBadgeProps
- Defines: StatusBadge, StatusBadgeProps
- Imported by: src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/job-history.tsx
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: StatusBadge; package imports: 1

### `src/components/admin/breadcrumbs.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AdminBreadcrumbs
- Symbol details: function AdminBreadcrumbs (exported)
- Defines: AdminBreadcrumbs, pathname, segments, crumbs
- Imported by: src/app/admin/layout.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: AdminBreadcrumbs; tests/describes: /; internal imports: 1; package imports: 2

### `src/components/admin/campaigns/campaign-cells.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: BudgetBar, RoasBadge, RoasSparkline, SyncButton
- Symbol details: function BudgetBar (exported), function RoasBadge (exported), function RoasSparkline (exported), function SyncButton (exported)
- Defines: BudgetBar, RoasBadge, RoasSparkline, SyncButton, pct, color, vals, W, min, max, range, coords, x, y, first, trend, … (+4 more)
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/columns.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: BudgetBar, RoasBadge, RoasSparkline, SyncButton; tests/describes: ,; internal imports: 4; package imports: 2

### `src/components/admin/campaigns/campaign-detail-dashboard.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: CampaignDetailDashboard
- Symbol details: function CampaignDetailDashboard (exported), function SectionCard, function EmptyState, function KpiCard, function badgeClass, interface Props
- Defines: SectionCard, EmptyState, KpiCard, badgeClass, CampaignDetailDashboard, unresolvedComments, openActionItems, Props
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Contents summary: exports: CampaignDetailDashboard; internal imports: 4

### `src/components/admin/campaigns/campaign-table.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: CampaignTable
- Symbol details: function CampaignTable (exported), function AssignToolbar, const campaignCsvColumns, interface CampaignTableProps
- Defines: AssignToolbar, handleAssign, CampaignTable, router, slug, target, ids, count, campaignCsvColumns, columns, CampaignTableProps
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx
- Route owners: src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: CampaignTable; internal imports: 6; package imports: 3

### `src/components/admin/campaigns/client-filter.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ClientFilter
- Symbol details: function ClientFilter (exported), interface Props
- Defines: ClientFilter, value, v, Props
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: ClientFilter; internal imports: 1; package imports: 1

### `src/components/admin/campaigns/columns.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: getCampaignColumns
- Symbol details: function getCampaignColumns (exported), const STATUS_OPTIONS, const TYPE_OPTIONS, interface CampaignColumnsOptions
- Defines: getCampaignColumns, STATUS_OPTIONS, TYPE_OPTIONS, m, CampaignColumnsOptions
- Imported by: src/components/admin/campaigns/campaign-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: getCampaignColumns; internal imports: 7; package imports: 4

### `src/components/admin/campaigns/date-range-filter.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: DateRangeFilter
- Symbol details: function DateRangeFilter (exported), const DATE_OPTIONS
- Defines: DateRangeFilter, DATE_OPTIONS, v
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx
- Route owners: src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: DateRangeFilter; package imports: 1

### `src/components/admin/client-onboard-form.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ClientOnboardForm
- Symbol details: function ClientOnboardForm (exported)
- Defines: ClientOnboardForm, handleNameChange, handleSubmit, client, res, data
- Imported by: src/app/admin/settings/page.tsx
- Route owners: src/app/admin/settings/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: ClientOnboardForm; internal imports: 4; package imports: 3

### `src/components/admin/client-requests-panel.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ClientRequestsPanel, AdminRequestComment
- Symbol details: function ClientRequestsPanel (exported), function groupDiscussionThreads, function requestEndpoint, function requestEntityKey, type AdminRequestComment (exported), interface ThreadComment, interface ClientRequestsPanelProps
- Defines: groupDiscussionThreads, requestEndpoint, requestEntityKey, ClientRequestsPanel, handleReply, handleResolvedChange, repliesByParent, current, router, threads, openThreadCount, endpoint, entityKey, nextContent, response, body, … (+7 more)
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/[eventId]/page.tsx, src/components/admin/client-requests-panel.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/events/[eventId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/components/admin/client-requests-panel.test.tsx
- Contents summary: contains `use client`; exports: ClientRequestsPanel, AdminRequestComment; internal imports: 2; package imports: 3

### `src/components/admin/clients/assignment-manager.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AssignmentManager
- Symbol details: function AssignmentManager (exported)
- Defines: AssignmentManager, toggleCampaign, toggleEvent, handleSave, next, totalAssigned
- Imported by: src/components/admin/clients/members-section.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: AssignmentManager; internal imports: 3; package imports: 3

### `src/components/admin/clients/campaigns-section.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: CampaignsSection
- Symbol details: function CampaignsSection (exported)
- Defines: CampaignsSection
- Imported by: src/components/admin/clients/client-detail.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: CampaignsSection; internal imports: 4

### `src/components/admin/clients/client-detail.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ClientDetailView
- Symbol details: function ClientDetailView (exported), type Tab, interface Props
- Defines: ClientDetailView, Tab, Props
- Imported by: src/app/admin/clients/[id]/page.tsx, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: ClientDetailView; internal imports: 7; package imports: 3

### `src/components/admin/clients/client-overview-tab.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ClientOverviewTab
- Symbol details: function ClientOverviewTab (exported), type ClientUpdatePatch, interface ClientOverviewTabProps
- Defines: ClientOverviewTab, savePortalSettings, handleEventsToggle, handleReportsToggle, handleAgentToggle, handleBrandingSave, ClientUpdatePatch, ClientOverviewTabProps
- Imported by: src/components/admin/clients/client-detail.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: ClientOverviewTab; internal imports: 4; package imports: 3

### `src/components/admin/clients/client-table.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ClientTable
- Symbol details: function ClientTable (exported), function CreateClientForm, function ClientSelectionToolbar, const clientCsvColumns, interface Props
- Defines: CreateClientForm, handleNameChange, submit, ClientSelectionToolbar, handleDeactivate, ClientTable, router, ids, confirmed, clientCsvColumns, createToolbar, Props
- Imported by: src/app/admin/clients/page.tsx
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: ClientTable; internal imports: 9; package imports: 5

### `src/components/admin/clients/columns.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: clientColumns
- Defines: c, joined, client, needsAttention, detail, healthyCount, roas, portalUrl
- Imported by: src/components/admin/clients/client-table.tsx
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: clientColumns; internal imports: 10; package imports: 3

### `src/components/admin/clients/events-section.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: EventsSection
- Symbol details: function EventsSection (exported), interface EventsSectionProps
- Defines: EventsSection, EventsSectionProps
- Imported by: src/components/admin/clients/client-detail.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: EventsSection; internal imports: 4; package imports: 1

### `src/components/admin/clients/invite-member-form.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: InviteMemberForm
- Symbol details: function InviteMemberForm (exported)
- Defines: InviteMemberForm, submit, router, res, d
- Imported by: src/components/admin/clients/members-section.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: InviteMemberForm; internal imports: 2; package imports: 4

### `src/components/admin/clients/members-section.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: MembersSection
- Symbol details: function MembersSection (exported)
- Defines: MembersSection, inviteCounts, inviteStatus
- Imported by: src/components/admin/clients/client-detail.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: MembersSection; internal imports: 13; package imports: 3

### `src/components/admin/clients/role-select.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: RoleSelect
- Symbol details: function RoleSelect (exported), const ROLE_OPTIONS
- Defines: RoleSelect, ROLE_OPTIONS
- Imported by: src/components/admin/clients/members-section.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: RoleSelect; internal imports: 2

### `src/components/admin/clients/saving-select.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: SavingSelect
- Symbol details: function SavingSelect (exported), interface Option, interface SavingSelectProps
- Defines: SavingSelect, handleChange, Option, SavingSelectProps
- Imported by: src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: SavingSelect; package imports: 3

### `src/components/admin/clients/scope-select.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ScopeSelect
- Symbol details: function ScopeSelect (exported), const SCOPE_OPTIONS
- Defines: ScopeSelect, SCOPE_OPTIONS
- Imported by: src/components/admin/clients/members-section.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: ScopeSelect; internal imports: 2

### `src/components/admin/collapsible-sidebar.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: CollapsibleSidebar
- Symbol details: function CollapsibleSidebar (exported), interface CollapsibleSidebarProps
- Defines: CollapsibleSidebar, CollapsibleSidebarProps
- Imported by: src/app/admin/layout.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: CollapsibleSidebar; internal imports: 3

### `src/components/admin/command-palette.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: CommandPalette
- Symbol details: function CommandPalette (exported)
- Defines: CommandPalette, onKeyDown, router, navigate, campaigns, events, clients, Icon, SearchableRecord
- Imported by: src/app/admin/layout.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: CommandPalette; internal imports: 3; package imports: 3

### `src/components/admin/confirm-dialog.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ConfirmDialog
- Symbol details: function ConfirmDialog (exported), interface Props
- Defines: ConfirmDialog, handleKeyDown, handleConfirm, dialogRef, titleId, dialog, focusable, first, last, Props
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- Contents summary: contains `use client`; exports: ConfirmDialog; internal imports: 1; package imports: 2

### `src/components/admin/copy-button.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: CopyButton
- Symbol details: function CopyButton (exported), interface CopyButtonProps
- Defines: CopyButton, handleCopy, el, CopyButtonProps
- Imported by: src/components/admin/clients/columns.tsx
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: CopyButton; package imports: 2

### `src/components/admin/data-table/column-header.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ColumnHeader
- Symbol details: function ColumnHeader (exported), interface ColumnHeaderProps
- Defines: ColumnHeader, sorted, ColumnHeaderProps
- Imported by: src/components/admin/agents/job-history.tsx, src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/users/columns.tsx
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Contents summary: contains `use client`; exports: ColumnHeader; internal imports: 1; package imports: 2

### `src/components/admin/data-table/data-table-pagination.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: DataTablePagination
- Symbol details: function DataTablePagination (exported), interface PaginationProps
- Defines: DataTablePagination, PaginationProps
- Imported by: src/components/admin/agents/job-history.tsx, src/components/admin/data-table/data-table.tsx
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Contents summary: contains `use client`; exports: DataTablePagination; internal imports: 1; package imports: 2

### `src/components/admin/data-table/data-table-toolbar.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: DataTableToolbar
- Symbol details: function DataTableToolbar (exported), interface ToolbarProps
- Defines: DataTableToolbar, column, ToolbarProps
- Imported by: src/components/admin/data-table/data-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: DataTableToolbar; internal imports: 3; package imports: 2

### `src/components/admin/data-table/data-table.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: DataTable
- Symbol details: function DataTable (exported), interface DataTableProps
- Defines: DataTable, table, selectedRows, DataTableProps
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/events/event-table.tsx, src/components/admin/users/user-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: DataTable; internal imports: 4; package imports: 2

### `src/components/admin/data-table/select-column.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: createSelectColumn
- Symbol details: function createSelectColumn (exported)
- Defines: createSelectColumn, checked, indeterminate
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/users/columns.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: createSelectColumn; package imports: 1

### `src/components/admin/error-boundary.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AdminError, default
- Symbol details: default function AdminError (exported)
- Defines: AdminError
- Imported by: src/app/admin/agents/error.tsx, src/app/admin/campaigns/error.tsx, src/app/admin/clients/error.tsx, src/app/admin/dashboard/error.tsx, src/app/admin/events/error.tsx, src/app/admin/users/error.tsx
- Contents summary: contains `use client`; exports: AdminError, default; internal imports: 1

### `src/components/admin/events/columns.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: getEventColumns
- Symbol details: function getEventColumns (exported), interface EventColumnsOptions
- Defines: getEventColumns, parsed, linked, active, avgRoas, totalSpend, fansTotal, EventColumnsOptions
- Imported by: src/components/admin/events/event-table.tsx
- Route owners: src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: getEventColumns; internal imports: 10; package imports: 4

### `src/components/admin/events/event-cells.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: SellBarVisual, ClientSelect
- Symbol details: function SellBarVisual (exported), function ClientSelect (exported)
- Defines: SellBarVisual, ClientSelect, handleChange, capacity, pct, barColor
- Imported by: src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: SellBarVisual, ClientSelect; internal imports: 1; package imports: 2

### `src/components/admin/events/event-operating-panel.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: EventOperatingPanel
- Symbol details: function EventOperatingPanel (exported), interface EventOperatingPanelProps
- Defines: EventOperatingPanel, parsed, EventOperatingPanelProps
- Imported by: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/[eventId]/page.tsx
- Route owners: src/app/admin/events/[eventId]/page.tsx
- Tests related: src/app/admin/events/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: EventOperatingPanel; internal imports: 7; package imports: 3

### `src/components/admin/events/event-table.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: EventTable
- Symbol details: function EventTable (exported), function EventSelectionToolbar, const eventCsvColumns, interface EventTableProps
- Defines: EventSelectionToolbar, handleAssignClient, handleUpdateStatus, EventTable, router, ids, eventCsvColumns, columns, soldPct, EventTableProps
- Imported by: src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx
- Route owners: src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: EventTable; internal imports: 7; package imports: 3

### `src/components/admin/inline-edit.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: InlineEdit
- Symbol details: function InlineEdit (exported), interface Props
- Defines: InlineEdit, save, Props
- Imported by: src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: InlineEdit; package imports: 2

### `src/components/admin/mobile-sidebar.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: MobileSidebar
- Symbol details: function MobileSidebar (exported), interface MobileSidebarProps
- Defines: MobileSidebar, MobileSidebarProps
- Imported by: src/app/admin/layout.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: MobileSidebar; internal imports: 2; package imports: 3

### `src/components/admin/nav-config.ts`
- Type: TypeScript module
- Ownership: shared admin UI components
- Exports: adminNavItems, NavItem
- Symbol details: interface NavItem (exported)
- Defines: LucideIcon, NavItem
- Imported by: src/components/admin/activity-tracker.test.ts, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/nav-config.test.ts, src/components/admin/nav-links.tsx
- Route owners: src/app/admin/layout.tsx
- Tests related: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts
- Contents summary: exports: adminNavItems, NavItem; package imports: 1

### `src/components/admin/nav-links.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: NavLinks
- Symbol details: function NavLinks (exported), interface NavLinksProps
- Defines: NavLinks, pathname, active, NavLinksProps
- Imported by: src/components/admin/sidebar-content.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: NavLinks; internal imports: 3; package imports: 2

### `src/components/admin/page-header.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AdminPageHeader
- Symbol details: function AdminPageHeader (exported), interface AdminPageHeaderProps
- Defines: AdminPageHeader, AdminPageHeaderProps
- Imported by: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, … (+1 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/admin/reports/page.test.tsx
- Contents summary: exports: AdminPageHeader; package imports: 1

### `src/components/admin/run-button.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: RunButton
- Symbol details: function RunButton (exported), type State, interface RunButtonProps
- Defines: RunButton, handleRun, res, body, State, RunButtonProps
- Imported by: src/components/admin/agents/agent-sidebar.tsx
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: RunButton; internal imports: 1; package imports: 2

### `src/components/admin/sidebar-content.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: SidebarContent
- Symbol details: function SidebarContent (exported), interface SidebarContentProps
- Defines: SidebarContent, SidebarContentProps
- Imported by: src/components/admin/collapsible-sidebar.tsx, src/components/admin/mobile-sidebar.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: exports: SidebarContent; internal imports: 2; package imports: 2

### `src/components/admin/stat-card.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: StatCard, StatCardProps
- Symbol details: function StatCard (exported), interface StatCardProps (exported)
- Defines: StatCard, isLg, StatCardProps
- Imported by: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/components/stat-card.tsx, src/components/admin/clients/client-detail.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: StatCard, StatCardProps; internal imports: 1; package imports: 1

### `src/components/admin/status-select.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: StatusSelect
- Symbol details: function StatusSelect (exported), interface Props
- Defines: StatusSelect, handleChange, Props
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/users/columns.tsx
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: StatusSelect; package imports: 2

### `src/components/admin/user-avatar.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: UserAvatar
- Symbol details: function UserAvatar (exported), const ClerkUserButton, interface Props
- Defines: UserAvatar, ClerkUserButton, Props
- Imported by: src/components/admin/sidebar-content.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: UserAvatar; package imports: 2

### `src/components/admin/users/columns.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: getUserColumns, ClientOption
- Symbol details: function getUserColumns (exported), function AssignCell, interface ClientOption (exported), interface UserColumnsOptions
- Defines: AssignCell, toggle, getUserColumns, isAdding, res, next, count, u, inviteStatus, ClientOption, UserColumnsOptions
- Imported by: src/components/admin/users/user-table.tsx
- Route owners: src/app/admin/users/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: getUserColumns, ClientOption; internal imports: 10; package imports: 4

### `src/components/admin/users/revoke-invitation-button.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: RevokeInvitationButton
- Symbol details: function RevokeInvitationButton (exported), interface RevokeInvitationButtonProps
- Defines: RevokeInvitationButton, router, RevokeInvitationButtonProps
- Imported by: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: RevokeInvitationButton; internal imports: 2; package imports: 2

### `src/components/admin/users/user-table.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: UserTable
- Symbol details: function UserTable (exported), function InviteForm, function UserSelectionToolbar, const ROLE_OPTIONS, const userCsvColumns, interface Props
- Defines: InviteForm, submit, UserSelectionToolbar, handleUpdateRole, UserTable, res, text, ROLE_OPTIONS, router, ids, userCsvColumns, columns, Props
- Imported by: src/app/admin/users/page.tsx
- Route owners: src/app/admin/users/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: UserTable; internal imports: 7; package imports: 4

### `src/components/charts/roas-trend-chart.tsx`
- Type: React/TSX module
- Ownership: shared chart UI components
- Exports: SpendTrendChart, RoasTrendChart
- Symbol details: function SpendTrendChart (exported), function RoasTrendChart (exported), function CustomTooltip, interface DataPoint, interface Props
- Defines: CustomTooltip, SpendTrendChart, RoasTrendChart, DataPoint, Props
- Imported by: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Route owners: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: SpendTrendChart, RoasTrendChart; package imports: 1

### `src/components/charts/ticket-velocity-chart.tsx`
- Type: React/TSX module
- Ownership: shared chart UI components
- Exports: TicketVelocityChart
- Symbol details: function TicketVelocityChart (exported), function CustomTooltip, interface DataPoint
- Defines: CustomTooltip, TicketVelocityChart, DataPoint
- Imported by: src/app/admin/dashboard/page.tsx
- Route owners: src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: TicketVelocityChart; package imports: 1

### `src/components/client/ads-preview.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: AdsPreview, AdPreview
- Symbol details: function AdsPreview (exported), const TH, const TD, interface AdPreview (exported)
- Defines: AdsPreview, TH, TD, sorted, AdPreview
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: AdsPreview, AdPreview; internal imports: 1; package imports: 1

### `src/components/client/charts/age-distribution-chart.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: AgeDistributionChart
- Symbol details: function AgeDistributionChart (exported)
- Defines: AgeDistributionChart, maxImp
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: AgeDistributionChart; internal imports: 1; package imports: 1

### `src/components/client/charts/age-gender-heatmap.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: AgeGenderHeatmap
- Symbol details: function AgeGenderHeatmap (exported)
- Defines: AgeGenderHeatmap, cellColor, genders, maxPct, opacity, cell, pct
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: AgeGenderHeatmap; internal imports: 1

### `src/components/client/charts/audience-demographics.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: AudienceDemographics
- Symbol details: function AudienceDemographics (exported), function aggregateByAge, function aggregateByGender, function buildHeatCells, function AgeTab, function GenderTab, function HeatmapTab, const AGE_ORDER, type Tab, interface AgeRow, interface GenderRow, interface HeatCell
- Defines: aggregateByAge, aggregateByGender, buildHeatCells, AudienceDemographics, AgeTab, GenderTab, HeatmapTab, cellBg, AGE_ORDER, map, total, ageSet, genderSet, key, ages, genders, … (+11 more)
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: AudienceDemographics; internal imports: 2; package imports: 2

### `src/components/client/charts/daily-sales-chart.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: DailySalesChart
- Symbol details: function DailySalesChart (exported)
- Defines: DailySalesChart, hasRevenue, v
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: DailySalesChart; internal imports: 2; package imports: 1

### `src/components/client/charts/gender-donut-chart.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: GenderDonutChart
- Symbol details: function GenderDonutChart (exported)
- Defines: GenderDonutChart
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: GenderDonutChart; internal imports: 1; package imports: 1

### `src/components/client/charts/index.ts`
- Type: TypeScript module
- Ownership: shared client UI components
- Exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart, PerformanceTrendTabs, MarketPerformanceTable, AudienceDemographics, PlacementBarChart, TicketSalesChart, type TicketChartRow, DailySalesChart
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart; internal imports: 12

### `src/components/client/charts/market-charts.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: MarketPerformanceTable
- Symbol details: function MarketPerformanceTable (exported)
- Defines: MarketPerformanceTable, sorted, maxPct
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: exports: MarketPerformanceTable; internal imports: 1

### `src/components/client/charts/performance-trend-tabs.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PerformanceTrendTabs
- Symbol details: function PerformanceTrendTabs (exported), function LegendItem, interface Props
- Defines: PerformanceTrendTabs, LegendItem, v, PerformanceTrendRow, Props
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: PerformanceTrendTabs; internal imports: 1; package imports: 2

### `src/components/client/charts/placement-bar-chart.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PlacementBarChart
- Symbol details: function PlacementBarChart (exported), function CustomTooltip, interface PlacementBarData, interface ChartRow
- Defines: CustomTooltip, PlacementBarChart, row, PlacementBarData, ChartRow
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: PlacementBarChart; internal imports: 1; package imports: 1

### `src/components/client/charts/placement-charts.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PlacementTreemap, PlacementTable
- Symbol details: function PlacementTreemap (exported), function PlacementTable (exported)
- Defines: PlacementTreemap, PlacementTable, byPlatform, prev, totalImp, platforms, maxPct, barColor, sorted, pct
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: exports: PlacementTreemap, PlacementTable; internal imports: 2

### `src/components/client/charts/ticket-sales-chart.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: TicketSalesChart, TicketChartRow
- Symbol details: function TicketSalesChart (exported), interface TicketChartRow (exported)
- Defines: TicketSalesChart, hasGross, v, TicketChartRow
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: TicketSalesChart, TicketChartRow; internal imports: 1; package imports: 1

### `src/components/client/charts/time-charts.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: HourlyHeatmap, DailyTrendChart, DayOfWeekChart
- Symbol details: function HourlyHeatmap (exported), function DailyTrendChart (exported), function DayOfWeekChart (exported), function formatHourLabel
- Defines: formatHourLabel, HourlyHeatmap, cellOpacity, DailyTrendChart, DayOfWeekChart, maxImp, byHour, hours, row, imp, opacity, chartData, dt, label
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: contains `use client`; exports: HourlyHeatmap, DailyTrendChart, DayOfWeekChart; internal imports: 1; package imports: 1

### `src/components/client/charts/types.ts`
- Type: TypeScript module
- Ownership: shared client UI components
- Exports: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow, PerformanceTrendRow, MarketRow
- Symbol details: function kFormatter (exported), function usdKFormatter (exported), const tooltipStyle (exported), const sharedAxisProps (exported), const gridProps (exported), interface AgeRow (exported), interface GenderRow (exported), interface AgeGenderCell (exported), interface PlacementRow (exported), interface HourlyRow (exported), interface DailyRow (exported), interface DayOfWeekRow (exported), interface PerformanceTrendRow (exported), interface MarketRow (exported)
- Defines: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow, PerformanceTrendRow, MarketRow
- Imported by: src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/daily-sales-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/index.ts, src/components/client/charts/market-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/placement-bar-chart.tsx, src/components/client/charts/placement-charts.tsx, … (+2 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: exports: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell

### `src/components/client/error-boundary.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: ClientError, default
- Symbol details: default function ClientError (exported)
- Defines: ClientError
- Imported by: src/app/client/[slug]/agent/error.tsx, src/app/client/[slug]/campaign/[campaignId]/error.tsx, src/app/client/[slug]/campaigns/error.tsx, src/app/client/[slug]/error.tsx, src/app/client/[slug]/event/[eventId]/error.tsx, src/app/client/[slug]/events/error.tsx
- Contents summary: contains `use client`; exports: ClientError, default; internal imports: 1

### `src/components/client/loading-skeleton.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: ClientLoadingSkeleton, default
- Symbol details: default function ClientLoadingSkeleton (exported)
- Defines: ClientLoadingSkeleton
- Imported by: src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/loading.tsx
- Route owners: src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/loading.tsx
- Contents summary: exports: ClientLoadingSkeleton, default; internal imports: 1

### `src/components/client/platform-icons.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PlatformIcon
- Symbol details: function PlatformIcon (exported)
- Defines: PlatformIcon, icon
- Imported by: src/components/client/charts/placement-charts.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Contents summary: exports: PlatformIcon

### `src/components/landing/contact-form.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: ContactForm
- Symbol details: function ContactForm (exported)
- Defines: ContactForm, handleSubmit, form, data, res, body
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: contains `use client`; exports: ContactForm; internal imports: 2; package imports: 2

### `src/components/landing/credibility.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingCredibility
- Symbol details: function LandingCredibility (exported), const TRUST_ITEMS, const RESULT_CARDS, const DIFFERENTIATORS
- Defines: LandingCredibility, TRUST_ITEMS, RESULT_CARDS, DIFFERENTIATORS
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: exports: LandingCredibility; package imports: 2

### `src/components/landing/faq.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingFAQ
- Symbol details: function LandingFAQ (exported), const FAQS
- Defines: LandingFAQ, FAQS, open
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: contains `use client`; exports: LandingFAQ; package imports: 2

### `src/components/landing/features.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingFeatures
- Symbol details: function LandingFeatures (exported)
- Defines: LandingFeatures
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: exports: LandingFeatures; package imports: 1

### `src/components/landing/footer.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingFooter
- Symbol details: function LandingFooter (exported)
- Defines: LandingFooter
- Contents summary: exports: LandingFooter; package imports: 1

### `src/components/landing/hero.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingHero
- Symbol details: function LandingHero (exported), const PROOF_PILLS, const HERO_STATS
- Defines: LandingHero, PROOF_PILLS, HERO_STATS
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: exports: LandingHero; package imports: 1

### `src/components/landing/how-it-works.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingHowItWorks
- Symbol details: function LandingHowItWorks (exported), const STEPS
- Defines: LandingHowItWorks, STEPS, Icon
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: exports: LandingHowItWorks; package imports: 1

### `src/components/landing/nav.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingNav
- Symbol details: function LandingNav (exported)
- Defines: LandingNav
- Contents summary: exports: LandingNav; package imports: 2

### `src/components/landing/stats.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingStats
- Symbol details: function LandingStats (exported), const PRINCIPLES, const FIT_MARKETS
- Defines: LandingStats, PRINCIPLES, FIT_MARKETS, Icon
- Contents summary: contains `use client`; exports: LandingStats; package imports: 2

### `src/components/shared/error-boundary.tsx`
- Type: React/TSX module
- Ownership: shared app components
- Exports: ErrorBoundary
- Symbol details: function ErrorBoundary (exported)
- Defines: ErrorBoundary
- Imported by: src/components/admin/error-boundary.tsx, src/components/client/error-boundary.tsx
- Contents summary: contains `use client`; exports: ErrorBoundary; internal imports: 1; package imports: 1

### `src/components/ui/badge.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Badge, badgeVariants
- Symbol details: function Badge, const badgeVariants
- Defines: Badge, badgeVariants, Comp
- Imported by: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/components/admin/agents/command-summary.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/agents/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/components/admin/agents/command-summary.test.tsx
- Contents summary: exports: Badge, badgeVariants; internal imports: 1; package imports: 3

### `src/components/ui/breadcrumb.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis
- Symbol details: function Breadcrumb, function BreadcrumbList, function BreadcrumbItem, function BreadcrumbLink, function BreadcrumbPage, function BreadcrumbSeparator, function BreadcrumbEllipsis
- Defines: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, Comp
- Imported by: src/components/admin/breadcrumbs.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: exports: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis; internal imports: 1; package imports: 3

### `src/components/ui/button.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Button, buttonVariants
- Symbol details: function Button, const buttonVariants
- Defines: Button, buttonVariants, Comp
- Imported by: src/app/admin/agents/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/components/campaign-discussion-form.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/[slug]/components/event-discussion-form.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/components/admin/agents/chat-panel.tsx, … (+18 more)
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/client/[slug]/layout.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, … (+8 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/events/page.test.tsx, src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+7 more)
- Contents summary: exports: Button, buttonVariants; internal imports: 1; package imports: 3

### `src/components/ui/card.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent
- Symbol details: function Card, function CardHeader, function CardTitle, function CardDescription, function CardAction, function CardContent, function CardFooter
- Defines: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- Imported by: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/loading.tsx, … (+12 more)
- Route owners: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/loading.tsx, … (+7 more)
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/admin/events/[eventId]/page.test.tsx
- Contents summary: exports: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent; internal imports: 1; package imports: 1

### `src/components/ui/command.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator
- Symbol details: function Command, function CommandDialog, function CommandInput, function CommandList, function CommandEmpty, function CommandGroup, function CommandSeparator, function CommandItem, function CommandShortcut
- Defines: Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandSeparator, CommandItem, CommandShortcut
- Imported by: src/components/admin/command-palette.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut; internal imports: 2; package imports: 3

### `src/components/ui/dialog.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger
- Symbol details: function Dialog, function DialogTrigger, function DialogPortal, function DialogClose, function DialogOverlay, function DialogContent, function DialogHeader, function DialogFooter, function DialogTitle, function DialogDescription
- Defines: Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/ui/command.tsx
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal; internal imports: 2; package imports: 3

### `src/components/ui/dropdown-menu.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent
- Symbol details: function DropdownMenu, function DropdownMenuPortal, function DropdownMenuTrigger, function DropdownMenuContent, function DropdownMenuGroup, function DropdownMenuItem, function DropdownMenuCheckboxItem, function DropdownMenuRadioGroup, function DropdownMenuRadioItem, function DropdownMenuLabel, function DropdownMenuSeparator, function DropdownMenuShortcut, function DropdownMenuSub, function DropdownMenuSubTrigger, function DropdownMenuSubContent
- Defines: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent
- Imported by: src/components/admin/clients/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/users/columns.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Contents summary: contains `use client`; exports: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem; internal imports: 1; package imports: 3

### `src/components/ui/input.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Input
- Symbol details: function Input
- Defines: Input
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/agents/job-history.tsx, src/components/admin/client-onboard-form.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/landing/contact-form.tsx
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/agents/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/landing/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx, … (+1 more)
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Contents summary: exports: Input; internal imports: 1; package imports: 1

### `src/components/ui/sheet.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription
- Symbol details: function Sheet, function SheetTrigger, function SheetClose, function SheetPortal, function SheetOverlay, function SheetContent, function SheetHeader, function SheetFooter, function SheetTitle, function SheetDescription
- Defines: Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/mobile-sidebar.tsx
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/layout.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription; internal imports: 1; package imports: 3

### `src/components/ui/skeleton.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Skeleton
- Symbol details: function Skeleton
- Defines: Skeleton
- Imported by: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/events/loading.tsx, src/app/admin/users/loading.tsx, src/components/client/loading-skeleton.tsx
- Route owners: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/events/loading.tsx, src/app/admin/users/loading.tsx, src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, … (+4 more)
- Contents summary: exports: Skeleton; internal imports: 1

### `src/components/ui/switch.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Switch
- Symbol details: const Switch
- Defines: Switch
- Imported by: src/components/admin/clients/client-overview-tab.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: Switch; internal imports: 1; package imports: 2

### `src/components/ui/table.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption
- Symbol details: function Table, function TableHeader, function TableBody, function TableFooter, function TableRow, function TableHead, function TableCell, function TableCaption
- Defines: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption
- Imported by: src/app/admin/dashboard/events-preview-table.tsx, src/components/admin/agents/job-history.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/events-section.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/data-table/data-table.tsx
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/agents/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Contents summary: contains `use client`; exports: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption; internal imports: 1; package imports: 1

### `src/components/ui/tooltip.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
- Symbol details: function TooltipProvider, function Tooltip, function TooltipTrigger, function TooltipContent
- Defines: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
- Imported by: src/components/admin/nav-links.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider; internal imports: 1; package imports: 2
