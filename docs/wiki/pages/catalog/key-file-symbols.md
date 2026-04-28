# Key File Symbol Map

Generated from the current working tree on 2026-04-28 02:30:43.

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
- Defines: CampaignsPage, clientSlug, range, totalSpend, totalImpressions, totalClicks, avgRoas, overallCtr, unassignedCampaignCount, metaAdAccountId, hasData, Props
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/campaigns`; exports: CampaignsPage, default; internal imports: 10; package imports: 2

### `src/app/admin/campaigns/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/campaigns/[campaignId]
- Exports: AdminCampaignDetailPage, default
- Symbol details: default function AdminCampaignDetailPage (exported), interface Props
- Defines: AdminCampaignDetailPage, data, statusCfg, Props
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Contents summary: Next.js page for `/admin/campaigns/[campaignId]`; exports: AdminCampaignDetailPage, default; internal imports: 5; package imports: 3

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
- Defines: ClientsPage, clients, totalSpend, totalCampaigns, activeCampaigns, connectionRiskAccounts, blendedRoas, clientsNeedingAttention, attentionClients, stats
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
- Symbol details: default function AdminDashboard (exported)
- Defines: AdminDashboard, totalSpend, totalImpressions, avgRoas, now, heroStats
- Imported by: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/dashboard`; exports: AdminDashboard, default; internal imports: 8; package imports: 1

### `src/app/admin/events/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/events
- Exports: AdminEventsPage, default
- Symbol details: default function AdminEventsPage (exported)
- Defines: AdminEventsPage
- Imported by: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/events`; exports: AdminEventsPage, default; package imports: 1

### `src/app/admin/events/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/events/[eventId]
- Exports: AdminEventDetailPage, default
- Symbol details: default function AdminEventDetailPage (exported)
- Defines: AdminEventDetailPage
- Imported by: src/app/admin/events/[eventId]/page.test.tsx
- Tests related: src/app/admin/events/[eventId]/page.test.tsx
- Contents summary: Next.js page for `/admin/events/[eventId]`; exports: AdminEventDetailPage, default; package imports: 1

### `src/app/admin/reports/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/reports
- Exports: AdminReportsPage, default
- Symbol details: default function AdminReportsPage (exported)
- Defines: AdminReportsPage
- Imported by: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/reports`; exports: AdminReportsPage, default; package imports: 1

### `src/app/admin/settings/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Route: /admin/settings
- Exports: SettingsPage, default
- Symbol details: default function SettingsPage (exported), function getApiKeyStatus, function formatErrorDate
- Defines: getApiKeyStatus, formatErrorDate, SettingsPage, keys, value, configured, masked, apiKeys, connectedAccountsRes, connectedAccounts, connectionSummary, configuredIntegrationCount, missingIntegrationCount, connectionIssues, applicationErrorsRes, applicationErrors, … (+1 more)
- Imported by: src/app/shell-import-smoke.test.ts
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/settings`; exports: SettingsPage, default; internal imports: 6; package imports: 1

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
- Imported by: src/app/api/admin/users/[id]/route.test.ts
- Tests related: src/app/api/admin/users/[id]/route.test.ts
- Contents summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

### `src/app/api/contact/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/contact
- Exports: POST
- Symbol details: function POST (exported), function withLabel, function sendContactEmail, const contactRecipient
- Defines: withLabel, sendContactEmail, POST, contactRecipient, trimmed, apiKey, response, body, fullMessage
- Imported by: src/app/api/contact/route.test.ts
- Tests related: src/app/api/contact/route.test.ts
- Contents summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

### `src/app/api/health/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/health
- Exports: GET
- Symbol details: function GET (exported), function getDatabaseHealth
- Defines: getDatabaseHealth, GET, database
- Imported by: src/app/api/health/route.test.ts
- Tests related: src/app/api/health/route.test.ts
- Contents summary: Next.js route handler for `/api/health`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

### `src/app/api/ingest/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/ingest
- Exports: POST, GET
- Symbol details: function POST (exported), function GET (exported)
- Defines: POST, GET, secretErr
- Imported by: __tests__/api/ingest.test.ts
- Tests related: __tests__/api/ingest.test.ts
- Contents summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 4; package imports: 1

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

### `src/app/api/observability/client-error/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Route: /api/observability/client-error
- Exports: POST
- Symbol details: function POST (exported), function scrub, const ClientErrorSchema
- Defines: scrub, POST, ClientErrorSchema, user
- Imported by: src/app/api/observability/client-error/route.test.ts
- Tests related: src/app/api/observability/client-error/route.test.ts
- Contents summary: Next.js route handler for `/api/observability/client-error`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

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
- Defines: generateMetadata, ClientLayout, clientName, portalConfig, clerkEnabled, meta, isAdmin, entry, theme, Props
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
- Symbol details: default function CampaignDetailPage (exported), function MetricCard, function SnapshotCard, function FallbackCard, function DashboardSection, function getDaysLive, function formatHour, function formatDay, interface Props
- Defines: CampaignDetailPage, MetricCard, SnapshotCard, FallbackCard, DashboardSection, getDaysLive, formatHour, formatDay, rawSearchParams, range, data, theme, trackedDays, totalDailySpend, avgDailySpend, daysLive, … (+17 more)
- Imported by: src/app/shell-import-smoke.test.ts
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/campaign/[campaignId]`; exports: CampaignDetailPage, default; internal imports: 10; package imports: 3

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
- Defines: generateMetadata, ClientCampaigns, clientName, rawSearchParams, range, rangeLabel, trendData, totalSpend, totalRevenue, hasRevenue, totalImpressions, totalClicks, blendedRoas, hasData, avgCtr, avgCpc, … (+5 more)
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/campaigns`; exports: ClientCampaigns, generateMetadata, default; internal imports: 10; package imports: 2

### `src/app/client/[slug]/event/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/event/[eventId]
- Exports: EventDetailPage, default
- Symbol details: default function EventDetailPage (exported), interface EventDetailPageProps
- Defines: EventDetailPage, EventDetailPageProps
- Imported by: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/event/[eventId]`; exports: EventDetailPage, default; package imports: 1

### `src/app/client/[slug]/events/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/events
- Exports: ClientEventsPage, default
- Symbol details: default function ClientEventsPage (exported), interface ClientEventsPageProps
- Defines: ClientEventsPage, ClientEventsPageProps
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/events`; exports: ClientEventsPage, default; package imports: 1

### `src/app/client/[slug]/reports/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Route: /client/[slug]/reports
- Exports: ClientReportsPage, generateMetadata, default
- Symbol details: default function ClientReportsPage (exported), function generateMetadata (exported), interface ClientReportsPageProps
- Defines: generateMetadata, ClientReportsPage, clientName, ClientReportsPageProps
- Imported by: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/reports`; exports: ClientReportsPage, generateMetadata, default; internal imports: 1; package imports: 2

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
- Symbol details: default function LandingPage (exported), const headingFont, const bodyFont, const monoFont, const BRAND_TOKENS
- Defines: LandingPage, headingFont, bodyFont, monoFont, BRAND_TOKENS
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
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1

### `src/features/campaigns/revalidation.ts`
- Type: TypeScript module
- Ownership: feature module: campaigns
- Exports: getCampaignRevalidationPaths, revalidateCampaignPaths
- Symbol details: function getCampaignRevalidationPaths (exported), function revalidateCampaignPaths (exported), function uniquePaths, function clientPaths
- Defines: uniquePaths, clientPaths, getCampaignRevalidationPaths, revalidateCampaignPaths
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/revalidation.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/features/campaigns/revalidation.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getCampaignRevalidationPaths, revalidateCampaignPaths; package imports: 1

### `src/features/campaigns/server.ts`
- Type: TypeScript module
- Ownership: feature module: campaigns
- Exports: getCampaignOperatingData, CampaignOperatingData
- Symbol details: function getCampaignOperatingData (exported), function toNumber, function centsToDollars, interface CampaignOperatingData (exported), interface CampaignOperatingRow
- Defines: toNumber, centsToDollars, getCampaignOperatingData, amount, data, metaResult, spend, roas, CampaignOperatingRow, CampaignOperatingData
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/campaigns/server.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts
- Contents summary: exports: getCampaignOperatingData, CampaignOperatingData; internal imports: 3

### `src/features/client-portal/access.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: resolveClientPortalAccess, requireClientAccess
- Symbol details: function resolveClientPortalAccess (exported), function requireClientAccess (exported), function isAdminPortalViewer, function requireResolvedClientAccess, type Viewer, type PortalAccessAllowed, type PortalAccessRedirect, type PortalAccessResolution
- Defines: isAdminPortalViewer, resolveClientPortalAccess, requireResolvedClientAccess, requireClientAccess, user, meta, entry, access, scope, Viewer, PortalAccessAllowed, PortalAccessRedirect, PortalAccessResolution
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/features/client-portal/access.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: resolveClientPortalAccess, requireClientAccess; internal imports: 2; package imports: 2

### `src/features/client-portal/campaign-detail.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: getCampaignDetail, type CampaignDetailRangeInput
- Defines: CampaignDetailRangeInput
- Contents summary: exports: getCampaignDetail, type CampaignDetailRangeInput; internal imports: 1

### `src/features/client-portal/config.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: getClientPortalConfig, ClientPortalConfig
- Symbol details: const getClientPortalConfig (exported), interface ClientPortalConfig (exported)
- Defines: getClientPortalConfig, user, role, clerkDb, ClientPortalConfig
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/config.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2

### `src/features/client-portal/entry.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput
- Symbol details: function resolveClientPortalEntry (exported), function listPendingClientAccessInvites (exported), function acceptClientAccessInvite (exported), function getUserEmailAddresses (exported), function normalizeEmails, function normalizeClientSlug, function normalizeClient, type ClientPortalEntry (exported), interface PendingClientAccessInvite (exported), interface ResolveClientPortalEntryInput (exported), interface ResolveClientPortalEntryDeps
- Defines: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, normalizeEmails, normalizeClientSlug, normalizeClient, memberships, preferredMembership, pendingInvites, normalizedEmails, client, inviteRole, membershipWrite, emails, primaryEmail, … (+5 more)
- Imported by: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx
- Contents summary: exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2

### `src/features/client-portal/insights.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative, generateRecommendations, DATE_OPTIONS, TrendPoint, getCampaignStatusCfg
- Symbol details: function buildTrendData (exported), function roasLabel (exported), function generateCampaignInsights (exported), function findBestHour (exported), function summarizeDayOfWeekPerformance (exported), function findBestDayOfWeek (exported), function findTopMarket (exported), function findTopCreative (exported), function generateRecommendations (exported), function formatHour, function formatWeekday, interface TrendPoint (exported), interface DayOfWeekPerformance
- Defines: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative, generateRecommendations, formatHour, formatWeekday, date, totalClicks, totalImpressions, withRoas, sorted, … (+34 more)
- Imported by: src/app/client/[slug]/lib.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Contents summary: exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative; internal imports: 4

### `src/features/client-portal/scope.ts`
- Type: TypeScript module
- Ownership: feature module: client-portal
- Exports: allowsCampaignInScope
- Symbol details: function allowsCampaignInScope (exported)
- Defines: allowsCampaignInScope
- Imported by: __tests__/features/client-portal/scope.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: __tests__/features/client-portal/scope.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: allowsCampaignInScope; internal imports: 1

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
- Exports: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, GeographyBreakdown, Recommendation, CampaignDetailData
- Symbol details: const DAY_LABELS (exported), interface CampaignCard (exported), interface HeroStats (exported), interface Insight (exported), interface AgeGenderBreakdown (exported), interface PlacementBreakdown (exported), interface AdCard (exported), interface HourlyBreakdown (exported), interface DailyPoint (exported), interface GeographyBreakdown (exported), interface Recommendation (exported), interface CampaignDetailData (exported)
- Defines: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, GeographyBreakdown, Recommendation, CampaignDetailData
- Imported by: src/app/client/[slug]/types.ts, src/features/client-portal/insights.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Tests related: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
- Contents summary: exports: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown

### `src/features/clients/summary.ts`
- Type: TypeScript module
- Ownership: feature module: clients
- Exports: getClientAttentionPressure, hasClientAttention, compareClientAccountHealth, ClientAccountHealth
- Symbol details: function getClientAttentionPressure (exported), function hasClientAttention (exported), function compareClientAccountHealth (exported), interface ClientAccountHealth (exported)
- Defines: getClientAttentionPressure, hasClientAttention, compareClientAccountHealth, rightPressure, leftPressure, ClientAccountHealth
- Imported by: __tests__/features/clients/summary.test.ts, src/app/admin/clients/page.tsx
- Route owners: src/app/admin/clients/page.tsx
- Tests related: __tests__/features/clients/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getClientAttentionPressure, hasClientAttention, compareClientAccountHealth, ClientAccountHealth

### `src/features/invitations/server.ts`
- Type: TypeScript module
- Ownership: feature module: invitations
- Exports: buildActionableInvitations, listActionableInvitations
- Symbol details: function buildActionableInvitations (exported), function listActionableInvitations (exported), function toActionableInvitationStatus, function normalizeClientSlug, interface ClientAccessInviteLike, interface ListActionableInvitationsOptions
- Defines: buildActionableInvitations, listActionableInvitations, toActionableInvitationStatus, normalizeClientSlug, excluded, email, status, rows, clerkIds, clerkStatuses, clerk, invitations, effectiveStatus, ClientAccessInviteLike, ListActionableInvitationsOptions
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/features/invitations/server.test.ts
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: buildActionableInvitations, listActionableInvitations; internal imports: 3; package imports: 1

### `src/features/invitations/sort.ts`
- Type: TypeScript module
- Ownership: feature module: invitations
- Exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses
- Symbol details: function invitationStatusPriority (exported), function compareActionableInvitationState (exported), function countActionableInvitationStatuses (exported), function toTimestamp
- Defines: toTimestamp, invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses, statusOrder
- Imported by: src/components/admin/clients/members-section.tsx, src/features/invitations/server.ts, src/features/users/summary.ts
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/users/summary.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses; internal imports: 1

### `src/features/invitations/types.ts`
- Type: TypeScript module
- Ownership: feature module: invitations
- Exports: ActionableInvitationStatus, ActionableInvitation
- Symbol details: type ActionableInvitationStatus (exported), interface ActionableInvitation (exported)
- Defines: ActionableInvitationStatus, ActionableInvitation
- Imported by: src/app/admin/users/data.ts, src/features/invitations/server.ts, src/features/invitations/sort.ts, src/features/shared/admin-summary-types.ts, src/lib/formatters.tsx
- Route owners: src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/users/summary.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, … (+12 more)
- Contents summary: exports: ActionableInvitationStatus, ActionableInvitation

### `src/features/settings/connected-accounts.ts`
- Type: TypeScript module
- Ownership: feature module: settings
- Exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary
- Symbol details: function getConnectedAccountHealth (exported), function buildConnectedAccountsSummary (exported), function asDate, function daysUntil, const DAY_MS, const EXPIRING_SOON_DAYS, const STALE_DAYS, type ConnectedAccountHealthKey (exported), interface ConnectedAccount (exported), interface ConnectedAccountHealth (exported), interface ConnectedAccountsSummary (exported)
- Defines: asDate, daysUntil, getConnectedAccountHealth, buildConnectedAccountsSummary, DAY_MS, EXPIRING_SOON_DAYS, STALE_DAYS, parsed, expiry, daysRemaining, recentActivity, inactiveDays, counts, health, ConnectedAccountHealthKey, ConnectedAccount, … (+2 more)
- Imported by: __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/settings/page.tsx
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary

### `src/features/shared/admin-summary-types.ts`
- Type: TypeScript module
- Ownership: feature module: shared
- Exports: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike
- Symbol details: const CLIENT_SUMMARY_FIELDS (exported), const USER_ROW_FIELDS (exported), interface ClientSummaryLike (exported), interface UserRowLike (exported)
- Defines: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike
- Imported by: __tests__/features/shared/admin-summary-types.test.ts, src/features/users/summary.ts
- Route owners: src/app/admin/users/page.tsx
- Tests related: __tests__/features/shared/admin-summary-types.test.ts, __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike; internal imports: 1

### `src/features/system-events/server.ts`
- Type: TypeScript module
- Ownership: feature module: system-events
- Exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent
- Symbol details: function getCurrentActor (exported), function logSystemEvent (exported), function listSystemEvents (exported), function metadataString, function normalizeOccurredAt, function resolveEventSource, function resolveCorrelationId, function resolveCausationId, function resolveIdempotencyKey, function isEnvelopeSchemaError, function isSystemEventIdempotencyConflict, function mapSystemEventRow, function buildSystemEventsQuery, function toActorName, function resolveActor, const LEGACY_SYSTEM_EVENT_SELECT, const SYSTEM_EVENT_SELECT, type SystemEventName (exported), type SystemEventVisibility (exported), type SystemEventActorType (exported), … (+4 more)
- Defines: metadataString, normalizeOccurredAt, resolveEventSource, resolveCorrelationId, resolveCausationId, resolveIdempotencyKey, isEnvelopeSchemaError, isSystemEventIdempotencyConflict, mapSystemEventRow, buildSystemEventsQuery, toActorName, resolveActor, getCurrentActor, logSystemEvent, listSystemEvents, LEGACY_SYSTEM_EVENT_SELECT, … (+19 more)
- Imported by: __tests__/features/system-events/list.test.ts, src/app/admin/actions/campaigns.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent; internal imports: 1; package imports: 1

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

## Shared web libraries

### `src/lib/api-helpers.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest
- Symbol details: function apiError (exported), function dbError (exported), function authGuard (exported), function secretGuard (exported), function adminGuard (exported), function parseJsonBody (exported), function validateRequest (exported)
- Defines: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, caller, meta, role, raw, parsed
- Imported by: src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/admin/users/[id]/route.ts, … (+7 more)
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/observability/client-error/route.ts, src/app/api/user/profile/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, … (+5 more)
- Tests related: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/actions/search.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/api/contact/route.test.ts, … (+4 more)
- Contents summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest; package imports: 3

### `src/lib/api-schemas.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema, IngestPayload
- Symbol details: const IngestPayloadSchema (exported), const InviteSchema (exported), const CreateClientSchema (exported), const UpdateClientSchema (exported), const AddClientMemberSchema (exported), const RemoveClientMemberSchema (exported), const ChangeClientMemberRoleSchema (exported), const ContactFormSchema (exported), const MetaCampaignSchema, type IngestPayload (exported)
- Defines: MetaCampaignSchema, IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema, IngestPayload
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/route.ts
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema; package imports: 1

### `src/lib/campaign-client-assignment.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, CampaignClientAssignmentRow
- Symbol details: function getCampaignClientOverrideMap (exported), function resolveEffectiveCampaignClientSlug (exported), function applyEffectiveCampaignClientSlugs (exported), function getEffectiveCampaignRowById (exported), function getEffectiveCampaignClientSlug (exported), function listEffectiveCampaignRowsForClientSlug (exported), function listEffectiveCampaignIdsForClientSlug (exported), function campaignBelongsToClientSlug (exported), function normalizeGuessedClientSlug, interface CampaignClientAssignmentRow (exported)
- Defines: normalizeGuessedClientSlug, getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, overrides, uniqueCampaignIds, override, row, baseRows, existingIds, overrideCampaignIds, … (+4 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/features/campaigns/server.test.ts, … (+3 more)
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/layout.tsx, … (+1 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, … (+5 more)
- Contents summary: exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug; internal imports: 2

### `src/lib/client-error-reporting.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: reportClientError
- Symbol details: function reportClientError (exported)
- Defines: reportClientError, payload
- Imported by: src/app/global-error.tsx, src/components/shared/error-boundary.tsx
- Contents summary: contains `use client`; exports: reportClientError

### `src/lib/client-slug.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: guessClientSlug
- Symbol details: function guessClientSlug (exported)
- Defines: guessClientSlug, lower
- Imported by: __tests__/lib/client-slug.test.ts, src/lib/campaign-client-assignment.ts
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/layout.tsx, … (+1 more)
- Tests related: __tests__/lib/client-slug.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, … (+6 more)
- Contents summary: exports: guessClientSlug

### `src/lib/constants.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: parseRange, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, META_PRESETS, RANGE_LABELS, DateRange, CampaignRangeInput, CampaignRangeSearchParams
- Symbol details: function parseRange (exported), function parseCampaignRange (exported), function parseClientCampaignRange (exported), function getRangeLabel (exported), function getRangeQuery (exported), function isIsoDate, function formatCustomRangeLabel, const META_API_VERSION (exported), const CLIENT_CAMPAIGN_RANGES, type DateRange (exported), type CampaignRangeInput (exported), interface CampaignRangeSearchParams (exported)
- Defines: parseRange, isIsoDate, formatCustomRangeLabel, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, CLIENT_CAMPAIGN_RANGES, start, end, formatter, DateRange, CampaignRangeInput, CampaignRangeSearchParams
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/data.ts, … (+3 more)
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, … (+5 more)
- Contents summary: exports: parseRange, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, META_PRESETS, RANGE_LABELS

### `src/lib/database.types.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: Constants, Json, Database, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes
- Symbol details: const Constants (exported), type Json (exported), type Database (exported), type Tables (exported), type TablesInsert (exported), type TablesUpdate (exported), type Enums (exported), type CompositeTypes (exported), type DatabaseWithoutInternals, type DefaultSchema
- Defines: Constants, Json, Database, DatabaseWithoutInternals, DefaultSchema, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes
- Contents summary: exports: Constants, Json, Database, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes

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
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/users/user-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: exportToCsv, todayFilename; tests/describes: T

### `src/lib/formatters.tsx`
- Type: React/TSX module
- Ownership: shared web library
- Exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, statusBadge, describeCount, MarginalRoasPoint
- Symbol details: function centsToUsd (exported), function fmtUsd (exported), function fmtNum (exported), function fmtDate (exported), function fmtTodayLong (exported), function slugToLabel (exported), function getInvitationStatusCfg (exported), function timeAgo (exported), function roasColor (exported), function fmtObjective (exported), function computeMarginalRoas (exported), function computeBlendedRoas (exported), function statusBadge (exported), function describeCount (exported), const CAMPAIGN_STATUSES, interface MarginalRoasPoint (exported), interface SpendRoasItem
- Defines: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, statusBadge, describeCount, date, diff, … (+9 more)
- Imported by: __tests__/lib/formatters.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, … (+24 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Tests related: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, … (+9 more)
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
- Defines: getMemberships, client, getMemberAccessForSlug, campaignsRes, ScopeFilter, MemberAccess, ScopedAccess
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/data.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/scope.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx
- Tests related: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/entry-accept.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Contents summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

### `src/lib/meta-api.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange
- Symbol details: function fetchMetaApi (exported), function metaGet (exported), function metaInsightsUrl (exported), function metaUrl (exported), class MetaApiError (exported), type MetaInsightsTimeRange (exported)
- Defines: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, parsed, res, err, message, json, url, MetaApiError, MetaInsightsTimeRange
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/lib/meta-api.test.ts, src/lib/meta-campaigns.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+1 more)
- Contents summary: exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange; internal imports: 1

### `src/lib/meta-campaigns.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: fetchCampaignById, fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult
- Symbol details: function fetchCampaignById (exported), function fetchAllCampaigns (exported), function getCredentials, function fetchAllPages, function loadCampaignTypes, function loadAllClientSlugs, function readOptionalSupabaseData, function safeParseFloat, function getPurchaseRoas, function toCampaignCard, function fetchMetaJson, function buildCampaignFilter, function buildInsightsUrl, interface MetaCampaignCard (exported), interface DailyInsight (exported), interface MetaCampaignsResult (exported), interface MetaPagedResponse, interface RawCampaign, interface RawInsight, interface RawDailyInsight
- Defines: getCredentials, fetchAllPages, loadCampaignTypes, loadAllClientSlugs, readOptionalSupabaseData, safeParseFloat, getPurchaseRoas, toCampaignCard, fetchMetaJson, buildCampaignFilter, buildInsightsUrl, fetchCampaignById, fetchAllCampaigns, token, rawAccountId, accountId, … (+36 more)
- Imported by: src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/lib/meta-campaigns.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Contents summary: exports: fetchCampaignById, fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult; internal imports: 5

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
- Exports: getCampaignStatusCfg, getGenericStatusCfg
- Symbol details: function getCampaignStatusCfg (exported), function getGenericStatusCfg (exported), type CampaignStatus
- Defines: getCampaignStatusCfg, getGenericStatusCfg, key, CampaignStatus
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/insights.ts, src/lib/formatters.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/lib/formatters.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/lib.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, … (+9 more)
- Contents summary: exports: getCampaignStatusCfg, getGenericStatusCfg

### `src/lib/supabase.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin
- Symbol details: function createClerkSupabaseClient (exported), function getFeatureReadClient (exported), const supabaseAdmin (exported), const getCachedUser, const url, const anonKey, const serviceKey
- Defines: createClerkSupabaseClient, getFeatureReadClient, getCachedUser, url, anonKey, serviceKey, supabaseAdmin, user, role
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/admin/clients/data.test.ts, … (+32 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, … (+13 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, … (+22 more)
- Contents summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

### `src/lib/text-utils.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: excerpt
- Symbol details: function excerpt (exported)
- Defines: excerpt, normalized
- Contents summary: exports: excerpt

### `src/lib/to-slug.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: toSlug
- Symbol details: function toSlug (exported)
- Defines: toSlug
- Imported by: src/components/admin/clients/client-table.tsx, src/lib/to-slug.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/lib/to-slug.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: toSlug

### `src/lib/utils.ts`
- Type: TypeScript module
- Ownership: shared web library
- Exports: cn
- Symbol details: function cn (exported)
- Defines: cn
- Imported by: src/components/admin/collapsible-sidebar.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/nav-links.tsx, src/components/landing/sample-metric-card.tsx, src/components/ui/badge.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/command.tsx, src/components/ui/dialog.tsx, … (+6 more)
- Route owners: src/app/admin/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/admin/campaigns/loading.tsx, … (+10 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx
- Contents summary: exports: cn; package imports: 2

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
- Symbol details: function CampaignDetailDashboard (exported), function KpiCard, interface Props
- Defines: KpiCard, CampaignDetailDashboard, Props
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Contents summary: exports: CampaignDetailDashboard; internal imports: 2

### `src/components/admin/campaigns/campaign-table.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: CampaignTable
- Symbol details: function CampaignTable (exported), function AssignToolbar, const campaignCsvColumns, interface CampaignTableProps
- Defines: AssignToolbar, handleAssign, CampaignTable, router, target, ids, count, campaignCsvColumns, columns, CampaignTableProps
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
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx
- Route owners: src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
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

### `src/components/admin/clients/assignment-manager.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AssignmentManager
- Symbol details: function AssignmentManager (exported)
- Defines: AssignmentManager, toggleCampaign, handleSave, next, totalAssigned
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
- Contents summary: contains `use client`; exports: ClientDetailView; internal imports: 6; package imports: 3

### `src/components/admin/clients/client-overview-tab.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: ClientOverviewTab
- Symbol details: function ClientOverviewTab (exported), type ClientUpdatePatch, interface ClientOverviewTabProps
- Defines: ClientOverviewTab, savePortalSettings, handleBrandingSave, ClientUpdatePatch, ClientOverviewTabProps
- Imported by: src/components/admin/clients/client-detail.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: ClientOverviewTab; internal imports: 3; package imports: 3

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
- Defines: CommandPalette, onKeyDown, router, navigate, campaigns, clients, Icon, SearchableRecord
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
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx
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
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/users/columns.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: ColumnHeader; internal imports: 1; package imports: 2

### `src/components/admin/data-table/data-table-pagination.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: DataTablePagination
- Symbol details: function DataTablePagination (exported), interface PaginationProps
- Defines: DataTablePagination, PaginationProps
- Imported by: src/components/admin/data-table/data-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: DataTablePagination; internal imports: 1; package imports: 2

### `src/components/admin/data-table/data-table-toolbar.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: DataTableToolbar
- Symbol details: function DataTableToolbar (exported), interface ToolbarProps
- Defines: DataTableToolbar, column, ToolbarProps
- Imported by: src/components/admin/data-table/data-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: DataTableToolbar; internal imports: 3; package imports: 2

### `src/components/admin/data-table/data-table.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: DataTable
- Symbol details: function DataTable (exported), interface DataTableProps
- Defines: DataTable, table, selectedRows, DataTableProps
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/users/user-table.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: DataTable; internal imports: 4; package imports: 2

### `src/components/admin/data-table/select-column.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: createSelectColumn
- Symbol details: function createSelectColumn (exported)
- Defines: createSelectColumn, checked, indeterminate
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/users/columns.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: createSelectColumn; package imports: 1

### `src/components/admin/error-boundary.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: AdminError, default
- Symbol details: default function AdminError (exported)
- Defines: AdminError
- Imported by: src/app/admin/campaigns/error.tsx, src/app/admin/clients/error.tsx, src/app/admin/dashboard/error.tsx, src/app/admin/users/error.tsx
- Contents summary: contains `use client`; exports: AdminError, default; internal imports: 1

### `src/components/admin/inline-edit.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: InlineEdit
- Symbol details: function InlineEdit (exported), interface Props
- Defines: InlineEdit, save, Props
- Imported by: src/components/admin/clients/columns.tsx
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
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
- Imported by: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
- Contents summary: exports: AdminPageHeader; package imports: 1

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
- Imported by: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/components/admin/clients/client-detail.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: StatCard, StatCardProps; internal imports: 1; package imports: 1

### `src/components/admin/status-select.tsx`
- Type: React/TSX module
- Ownership: shared admin UI components
- Exports: StatusSelect
- Symbol details: function StatusSelect (exported), interface Props
- Defines: StatusSelect, handleChange, Props
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/users/columns.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
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
- Imported by: src/app/admin/users/page.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
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

### `src/components/client/ads-preview.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: AdsPreview, AdPreview
- Symbol details: function AdsPreview (exported), const TH, const TD, interface AdPreview (exported)
- Defines: AdsPreview, TH, TD, sorted, showRevenue, AdPreview
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
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: AgeDistributionChart; internal imports: 1; package imports: 1

### `src/components/client/charts/age-gender-heatmap.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: AgeGenderHeatmap
- Symbol details: function AgeGenderHeatmap (exported)
- Defines: AgeGenderHeatmap, cellColor, genders, maxPct, opacity, cell, pct
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: AgeGenderHeatmap; internal imports: 1

### `src/components/client/charts/audience-demographics.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: AudienceDemographics
- Symbol details: function AudienceDemographics (exported), function aggregateByAge, function aggregateByGender, function buildHeatCells, function AgeTab, function GenderTab, function HeatmapTab, const AGE_ORDER, type Tab, interface AgeRow, interface GenderRow, interface HeatCell
- Defines: aggregateByAge, aggregateByGender, buildHeatCells, AudienceDemographics, AgeTab, GenderTab, HeatmapTab, cellBg, AGE_ORDER, map, total, ageSet, genderSet, key, ages, genders, … (+11 more)
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: AudienceDemographics; internal imports: 2; package imports: 2

### `src/components/client/charts/gender-donut-chart.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: GenderDonutChart
- Symbol details: function GenderDonutChart (exported)
- Defines: GenderDonutChart
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: GenderDonutChart; internal imports: 1; package imports: 1

### `src/components/client/charts/index.ts`
- Type: TypeScript module
- Ownership: shared client UI components
- Exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart, PerformanceTrendTabs, MarketPerformanceTable, AudienceDemographics, PlacementBarChart
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart; internal imports: 10

### `src/components/client/charts/market-charts.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: MarketPerformanceTable
- Symbol details: function MarketPerformanceTable (exported)
- Defines: MarketPerformanceTable, sorted, maxPct
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: exports: MarketPerformanceTable; internal imports: 2

### `src/components/client/charts/performance-trend-tabs.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PerformanceTrendTabs
- Symbol details: function PerformanceTrendTabs (exported), function moneyFormatter, function LegendItem, type MetricKey, interface Props
- Defines: moneyFormatter, PerformanceTrendTabs, LegendItem, formatted, chartData, availableMetrics, value, metric, row, numericValue, v, selected, PerformanceTrendRow, MetricKey, Props
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: PerformanceTrendTabs; internal imports: 1; package imports: 2

### `src/components/client/charts/placement-bar-chart.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PlacementBarChart
- Symbol details: function PlacementBarChart (exported), function normalizePlacement, function titleCase, interface PlacementBarData, interface ChartRow
- Defines: normalizePlacement, titleCase, PlacementBarChart, platformLower, positionLower, platformName, placementName, badge, badgeClassName, placement, maxPct, PlacementBarData, ChartRow
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: exports: PlacementBarChart; tests/describes:

### `src/components/client/charts/placement-charts.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PlacementTreemap, PlacementTable
- Symbol details: function PlacementTreemap (exported), function PlacementTable (exported)
- Defines: PlacementTreemap, PlacementTable, byPlatform, prev, totalImp, platforms, maxPct, barColor, sorted, pct
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: exports: PlacementTreemap, PlacementTable; internal imports: 2

### `src/components/client/charts/time-charts.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: HourlyHeatmap, DailyTrendChart, DayOfWeekChart
- Symbol details: function HourlyHeatmap (exported), function DailyTrendChart (exported), function DayOfWeekChart (exported), function formatHourLabel
- Defines: formatHourLabel, HourlyHeatmap, cellOpacity, DailyTrendChart, DayOfWeekChart, maxImp, byHour, hours, row, imp, opacity, chartData, dt, label
- Imported by: src/components/client/charts/index.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: contains `use client`; exports: HourlyHeatmap, DailyTrendChart, DayOfWeekChart; internal imports: 1; package imports: 1

### `src/components/client/charts/types.ts`
- Type: TypeScript module
- Ownership: shared client UI components
- Exports: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow, PerformanceTrendRow, MarketRow
- Symbol details: function kFormatter (exported), function usdKFormatter (exported), const tooltipStyle (exported), const sharedAxisProps (exported), const gridProps (exported), interface AgeRow (exported), interface GenderRow (exported), interface AgeGenderCell (exported), interface PlacementRow (exported), interface HourlyRow (exported), interface DailyRow (exported), interface DayOfWeekRow (exported), interface PerformanceTrendRow (exported), interface MarketRow (exported)
- Defines: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow, PerformanceTrendRow, MarketRow
- Imported by: src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/index.ts, src/components/client/charts/market-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: exports: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell

### `src/components/client/error-boundary.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: ClientError, default
- Symbol details: default function ClientError (exported)
- Defines: ClientError
- Imported by: src/app/client/[slug]/campaign/[campaignId]/error.tsx, src/app/client/[slug]/campaigns/error.tsx, src/app/client/[slug]/error.tsx
- Contents summary: contains `use client`; exports: ClientError, default; internal imports: 1

### `src/components/client/loading-skeleton.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: ClientLoadingSkeleton, default
- Symbol details: default function ClientLoadingSkeleton (exported)
- Defines: ClientLoadingSkeleton
- Imported by: src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Contents summary: exports: ClientLoadingSkeleton, default; internal imports: 1

### `src/components/client/platform-icons.tsx`
- Type: React/TSX module
- Ownership: shared client UI components
- Exports: PlatformIcon
- Symbol details: function PlatformIcon (exported)
- Defines: PlatformIcon, icon
- Imported by: src/components/client/charts/placement-charts.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Contents summary: exports: PlatformIcon

### `src/components/landing/contact-form.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: buildLandingContactPayload, ContactForm
- Symbol details: function buildLandingContactPayload (exported), function ContactForm (exported), function formString, const INPUT_CLS, const TEXTAREA_CLS, const RAW_BOOKING_URL, const BOOKING_EMBED_URL, const WHATSAPP_AUDIT_URL
- Defines: formString, buildLandingContactPayload, ContactForm, handleSubmit, INPUT_CLS, TEXTAREA_CLS, RAW_BOOKING_URL, BOOKING_EMBED_URL, WHATSAPP_AUDIT_URL, value, name, phone, email, company, monthlyBudget, goal, … (+4 more)
- Imported by: __tests__/lib/contact-form.test.ts, src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Tests related: __tests__/lib/contact-form.test.ts
- Contents summary: contains `use client`; exports: buildLandingContactPayload, ContactForm; package imports: 2

### `src/components/landing/credibility.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingCredibility
- Symbol details: function LandingCredibility (exported), const FEATURED_VISUALS, const PARTNER_ITEMS, const DIFFERENTIATORS, const QUICK_WINS, const PORTAL_METRICS, const TOUR_METRICS, const COMPARISON_ROWS, type LandingBarStyle
- Defines: LandingCredibility, FEATURED_VISUALS, PARTNER_ITEMS, DIFFERENTIATORS, QUICK_WINS, PORTAL_METRICS, TOUR_METRICS, COMPARISON_ROWS, LandingBarStyle
- Contents summary: exports: LandingCredibility; internal imports: 3; package imports: 3

### `src/components/landing/faq.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingFAQ
- Symbol details: function LandingFAQ (exported), const QA
- Defines: LandingFAQ, QA
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: contains `use client`; exports: LandingFAQ; package imports: 1

### `src/components/landing/features.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingFeatures
- Symbol details: function LandingFeatures (exported), const PORTAL_FEATURES
- Defines: LandingFeatures, PORTAL_FEATURES, Icon
- Contents summary: exports: LandingFeatures; internal imports: 2; package imports: 2

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
- Symbol details: function LandingHero (exported), const fadeUp, const stagger
- Defines: LandingHero, fadeUp, stagger
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: contains `use client`; exports: LandingHero; package imports: 2

### `src/components/landing/how-it-works.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingHowItWorks
- Symbol details: function LandingHowItWorks (exported), const STEPS
- Defines: LandingHowItWorks, STEPS
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: contains `use client`; exports: LandingHowItWorks; package imports: 1

### `src/components/landing/lead-funnel.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingProofStats, LandingProblemSection, LandingAuditDeliverables, LandingProofCarousel, LandingMidPageCTA, LandingFounderTrust, LandingScarcitySection, LandingBookingSection
- Symbol details: function LandingProofStats (exported), function LandingProblemSection (exported), function LandingAuditDeliverables (exported), function LandingProofCarousel (exported), function LandingMidPageCTA (exported), function LandingFounderTrust (exported), function LandingScarcitySection (exported), function LandingBookingSection (exported), const STATS, const PROBLEMS, const DELIVERABLES, const PROOF_CARDS, const RAW_BOOKING_URL, const BOOKING_EMBED_URL, const WHATSAPP_AUDIT_URL, const reveal
- Defines: LandingProofStats, LandingProblemSection, LandingAuditDeliverables, LandingProofCarousel, LandingMidPageCTA, LandingFounderTrust, LandingScarcitySection, LandingBookingSection, STATS, PROBLEMS, DELIVERABLES, PROOF_CARDS, RAW_BOOKING_URL, BOOKING_EMBED_URL, WHATSAPP_AUDIT_URL, reveal
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: contains `use client`; exports: LandingProofStats, LandingProblemSection, LandingAuditDeliverables, LandingProofCarousel, LandingMidPageCTA, LandingFounderTrust, LandingScarcitySection, LandingBookingSection; package imports: 2

### `src/components/landing/nav.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingNav
- Symbol details: function LandingNav (exported)
- Defines: LandingNav
- Contents summary: exports: LandingNav; package imports: 2

### `src/components/landing/sample-metric-card.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingSampleMetricCard
- Symbol details: function LandingSampleMetricCard (exported), type LandingMetricAccent, type LandingMetricSize, type LandingMetricTrack, interface LandingSampleMetricCardProps
- Defines: LandingSampleMetricCard, gradientId, accentStyle, trackStyle, compact, LandingMetricAccent, LandingMetricSize, LandingMetricTrack, LandingSampleMetricCardProps
- Imported by: src/components/landing/credibility.tsx, src/components/landing/features.tsx
- Contents summary: exports: LandingSampleMetricCard; internal imports: 1; package imports: 1

### `src/components/landing/stats.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingStats
- Symbol details: function LandingStats (exported), const PRINCIPLES, const FIT_MARKETS
- Defines: LandingStats, PRINCIPLES, FIT_MARKETS, Icon
- Contents summary: contains `use client`; exports: LandingStats; package imports: 2

### `src/components/landing/sticky-cta.tsx`
- Type: React/TSX module
- Ownership: landing page UI components
- Exports: LandingStickyCTA
- Symbol details: function LandingStickyCTA (exported)
- Defines: LandingStickyCTA, heroCta, booking, form, recompute, io
- Imported by: src/app/landing/page.tsx
- Route owners: src/app/landing/page.tsx
- Contents summary: contains `use client`; exports: LandingStickyCTA; package imports: 1

### `src/components/shared/error-boundary.tsx`
- Type: React/TSX module
- Ownership: shared app components
- Exports: ErrorBoundary
- Symbol details: function ErrorBoundary (exported)
- Defines: ErrorBoundary
- Imported by: src/components/admin/error-boundary.tsx, src/components/client/error-boundary.tsx
- Contents summary: contains `use client`; exports: ErrorBoundary; internal imports: 2; package imports: 1

### `src/components/ui/badge.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Badge, badgeVariants
- Symbol details: function Badge, const badgeVariants
- Defines: Badge, badgeVariants, Comp
- Imported by: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
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
- Imported by: src/app/admin/users/page.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/clients/members-section.tsx, … (+7 more)
- Route owners: src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/client/[slug]/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, … (+1 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/page.test.tsx
- Contents summary: exports: Button, buttonVariants; internal imports: 1; package imports: 3

### `src/components/ui/card.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent
- Symbol details: function Card, function CardHeader, function CardTitle, function CardDescription, function CardAction, function CardContent, function CardFooter
- Defines: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- Imported by: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/loading.tsx, src/app/admin/users/page.tsx, … (+4 more)
- Route owners: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/loading.tsx, … (+2 more)
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
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
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- Contents summary: contains `use client`; exports: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem; internal imports: 1; package imports: 3

### `src/components/ui/input.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Input
- Symbol details: function Input
- Defines: Input
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/data-table/data-table-toolbar.tsx
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx
- Contents summary: exports: Input; internal imports: 1; package imports: 1

### `src/components/ui/sheet.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription
- Symbol details: function Sheet, function SheetTrigger, function SheetClose, function SheetPortal, function SheetOverlay, function SheetContent, function SheetHeader, function SheetFooter, function SheetTitle, function SheetDescription
- Defines: Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription
- Imported by: src/components/admin/mobile-sidebar.tsx
- Route owners: src/app/admin/layout.tsx
- Contents summary: contains `use client`; exports: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription; internal imports: 1; package imports: 3

### `src/components/ui/skeleton.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Skeleton
- Symbol details: function Skeleton
- Defines: Skeleton
- Imported by: src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/users/loading.tsx, src/components/client/loading-skeleton.tsx
- Route owners: src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/users/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Contents summary: exports: Skeleton; internal imports: 1

### `src/components/ui/table.tsx`
- Type: React/TSX module
- Ownership: UI primitive / design-system components
- Exports: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption
- Symbol details: function Table, function TableHeader, function TableBody, function TableFooter, function TableRow, function TableHead, function TableCell, function TableCaption
- Defines: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption
- Imported by: src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/data-table/data-table.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
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
