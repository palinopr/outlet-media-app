# Feature: client-portal

Generated from the current working tree on 2026-04-10 21:27:09.

- Files: 13
- Entry files: src/features/client-portal/access.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/insights.ts, src/features/client-portal/scope.ts, src/features/client-portal/theme.ts, src/features/client-portal/types.ts
- Component files: none
- Client files: none
- Server files: none
- Route users: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, … (+4 more)
- Database objects touched: clients, client_members, client_access_invites, leads, tm_events, tm_event_demographics
- Depends on feature modules: none
- Used by feature modules: client-agent (6), reports (2), campaigns (1), events (1)
- Auth/access signals: imports Clerk server auth, references membership/scope access concepts, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Direct tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/features/client-portal/entry.test.ts, … (+6 more)
- All linked tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+27 more)

## Exporting files
- `src/features/client-portal/access.ts` — exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi
- `src/features/client-portal/campaign-detail.ts` — exports: getCampaignDetail, type CampaignDetailRangeInput
- `src/features/client-portal/config.ts` — exports: getClientPortalConfig, ClientPortalConfig
- `src/features/client-portal/entry.ts` — exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput
- `src/features/client-portal/event-detail.ts` — exports: getEventDetail
- `src/features/client-portal/insights.ts` — exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, … (+6 more)
- `src/features/client-portal/scope.ts` — exports: allowsCampaignInScope, allowsEventInScope
- `src/features/client-portal/theme.ts` — exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides
- `src/features/client-portal/types.ts` — exports: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, … (+10 more)

## File list
- `src/features/client-portal/access.test.ts` — tests/describes: requireClientAccess; allows admins to preview client portal routes without membership; returns assigned scope for scoped client members; internal imports: 4; package imports: 3
- `src/features/client-portal/access.ts` — exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi; internal imports: 3; package imports: 2
- `src/features/client-portal/campaign-detail.ts` — exports: getCampaignDetail, type CampaignDetailRangeInput; internal imports: 1
- `src/features/client-portal/config.test.ts` — tests/describes: getClientPortalConfig; returns the expanded portal config shape from the clients table; internal imports: 2; package imports: 1
- `src/features/client-portal/config.ts` — exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2
- `src/features/client-portal/entry.test.ts` — tests/describes: resolveClientPortalEntry; routes admins into the admin dashboard immediately; accepts an invite id before computing the final portal destination; internal imports: 2; package imports: 1
- `src/features/client-portal/entry.ts` — exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2
- `src/features/client-portal/event-detail.ts` — exports: getEventDetail; internal imports: 1
- `src/features/client-portal/insights.ts` — exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights; internal imports: 4
- `src/features/client-portal/scope.ts` — exports: allowsCampaignInScope, allowsEventInScope; internal imports: 1
- `src/features/client-portal/theme.test.ts` — tests/describes: getClientPortalTheme; returns the homebuyer readiness branding for known aliases; falls back to the default outlet portal theme; internal imports: 1; package imports: 1
- `src/features/client-portal/theme.ts` — exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides; package imports: 1
- `src/features/client-portal/types.ts` — exports: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile; internal imports: 1
