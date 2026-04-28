# Feature: client-portal

Generated from the current working tree on 2026-04-28 02:31:12.

- Files: 13
- Entry files: src/features/client-portal/access.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/scope.ts, src/features/client-portal/theme.ts, src/features/client-portal/types.ts
- Component files: none
- Client files: none
- Server files: none
- Route users: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/admin/dashboard/page.tsx
- Database objects touched: if, clients, client_members, client_access_invites, leads
- Depends on feature modules: none
- Used by feature modules: none
- Auth/access signals: imports Clerk server auth, references membership/scope access concepts, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts, src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, … (+4 more)

## Exporting files
- `src/features/client-portal/access.ts` — exports: resolveClientPortalAccess, requireClientAccess
- `src/features/client-portal/campaign-detail.ts` — exports: getCampaignDetail, type CampaignDetailRangeInput
- `src/features/client-portal/config.ts` — exports: getClientPortalConfig, ClientPortalConfig
- `src/features/client-portal/entry.ts` — exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput
- `src/features/client-portal/insights.ts` — exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative, generateRecommendations, DATE_OPTIONS, TrendPoint, getCampaignStatusCfg
- `src/features/client-portal/scope.ts` — exports: allowsCampaignInScope
- `src/features/client-portal/theme.ts` — exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides
- `src/features/client-portal/types.ts` — exports: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, GeographyBreakdown, Recommendation, CampaignDetailData

## File list
- `src/features/client-portal/access.test.ts` — tests/describes: requireClientAccess; allows admins to preview client portal routes without membership; returns assigned scope for scoped client members; internal imports: 3; package imports: 3
- `src/features/client-portal/access.ts` — exports: resolveClientPortalAccess, requireClientAccess; internal imports: 2; package imports: 2
- `src/features/client-portal/campaign-detail.ts` — exports: getCampaignDetail, type CampaignDetailRangeInput; internal imports: 1
- `src/features/client-portal/config.test.ts` — tests/describes: getClientPortalConfig; returns the portal branding config from the clients table; internal imports: 2; package imports: 1
- `src/features/client-portal/config.ts` — exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2
- `src/features/client-portal/entry-accept.test.ts` — tests/describes: acceptClientAccessInvite; preserves an existing member row so assigned campaigns and events stay attached; creates a member row when the invitee has not been assigned yet; internal imports: 2; package imports: 1
- `src/features/client-portal/entry.test.ts` — tests/describes: resolveClientPortalEntry; routes admins into the admin dashboard immediately; accepts an invite id before computing the final portal destination; internal imports: 2; package imports: 1
- `src/features/client-portal/entry.ts` — exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2
- `src/features/client-portal/insights.ts` — exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative; internal imports: 4
- `src/features/client-portal/scope.ts` — exports: allowsCampaignInScope; internal imports: 1
- `src/features/client-portal/theme.test.ts` — tests/describes: getClientPortalTheme; returns the homebuyer readiness branding for known aliases; falls back to the default outlet portal theme; internal imports: 1; package imports: 1
- `src/features/client-portal/theme.ts` — exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides; package imports: 1
- `src/features/client-portal/types.ts` — exports: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown
