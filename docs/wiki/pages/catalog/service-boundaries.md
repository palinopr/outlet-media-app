# Service Boundary Map

Generated from the current working tree on 2026-04-10 17:55:29.

This page summarizes the major system boundaries in the repo: web, agent runtime, database, and the bridge files that connect them.

## Web system
- Route files: 69
- Admin routes: 18
- Client routes: 17
- API routes: 25
- Web files touching DB objects: 123
- Web↔agent touchpoints: src/app/admin/agents/data.ts, src/app/admin/agents/error.tsx, src/app/admin/agents/loading.tsx, src/app/admin/agents/page.tsx, src/app/admin/dashboard/data.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/email/watch/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, … (+58 more)

## Agent system
- Agent files tracked: 43
- Agent files touching DB objects: 12
- Agent DB touchpoints: agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, agent/scripts/growth-ledger.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/runner.test.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, agent/src/services/system-events-service.ts

## Database system
- Schema objects tracked: 98
- Tables tracked: 68
- Functions/views/triggers tracked: 30

## Shared boundary libraries
- src/lib/agent-dispatch.ts, src/lib/agent-jobs.ts, src/lib/google-ads.test.ts, src/lib/google-ads.ts, src/lib/member-access.ts, src/lib/meta-api.test.ts, src/lib/meta-api.ts, src/lib/meta-campaigns.ts, src/lib/meta-oauth.test.ts, src/lib/meta-oauth.ts, src/lib/supabase.ts, src/lib/ticketmaster/tm1-client.test.ts, src/lib/ticketmaster/tm1-client.ts

## Integration services seen in env registry
- Anthropic / Claude: ANTHROPIC_API_KEY, CLAUDE_PATH, CLIENT_AGENT_CLAUDE_MODEL
- App / Runtime: INGEST_SECRET, INGEST_URL, NEXT_PUBLIC_APP_URL
- Clerk: CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL
- Discord: DISCORD_ADMIN_ROLE_NAME, DISCORD_BANNED_WORDS, DISCORD_BOT_ROLE_NAME, DISCORD_CHANNEL_ID, DISCORD_CLIENT_ID, DISCORD_DEFAULT_ROLE_ID, DISCORD_EXEMPT_CHANNELS, DISCORD_GUILD_ID, DISCORD_LOG_CHANNEL_ID, DISCORD_OWNER_ROLE_NAME, DISCORD_OWNER_USER_IDS, DISCORD_RESTRUCTURE_PRUNE, DISCORD_TEAM_ROLE_NAME, DISCORD_TOKEN, DISCORD_USER_TOKEN, DISCORD_VIEWER_ROLE_NAME, … (+2 more)
- Google / Gmail / Calendar: GMAIL_IMPERSONATE_USER, GMAIL_PUBSUB_TOPIC, GMAIL_PUSH_LABEL_IDS, GMAIL_PUSH_WEBHOOK_SECRET, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_LOGIN_CUSTOMER_ID, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_DRIVE_REFRESH_TOKEN, GOOGLE_REFRESH_TOKEN
- Meta: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID, META_APP_ID, META_APP_SECRET, META_PAGE_ID
- Other / App: CHECK_CRON, CHROME_DEBUG_URL, CLIENT_AGENT_OPENAI_MODEL, CODEX_FINAL_MESSAGE, CONTACT_FORM_TO_EMAIL, EATA_PASSWORD, EATA_SCHEDULER_ENABLED, EATA_USERNAME, EMAIL_HISTORY_POLL_CRON, EVOLUTION_API_KEY, EVOLUTION_API_URL, EVOLUTION_INSTANCE_NAME, EVOLUTION_WEBHOOK_SECRET, NEXT_PHASE, PR_NUMBER, SCHEDULED_OWNER_NOTIFICATIONS, … (+16 more)
- Resend: RESEND_API_KEY, RESEND_FROM_EMAIL
- Supabase: NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
- Ticketmaster: TICKETMASTER_API_KEY, TM1_API_PREFIX, TM1_BASE_URL, TM1_COOKIE, TM1_DEFAULT_EVENT_END, TM1_DEFAULT_EVENT_START, TM1_EVENTBASE_API_PREFIX, TM1_TCODE, TM1_TIMEOUT_MS, TM1_XSRF_TOKEN

## Boundary bridge files
### `src/lib/agent-dispatch.ts`
- Ownership: shared web library
- DB objects: agent_tasks
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, … (+2 more)
- Summary: exports: enqueueExternalAgentTask; internal imports: 2; package imports: 1

### `src/lib/agent-jobs.ts`
- Ownership: shared web library
- DB objects: agent_tasks, agent_runtime_state
- Route owners: src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/admin/agents/page.tsx, src/app/admin/dashboard/page.tsx
- Related tests: __tests__/api/agents-jobs.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/api/agents.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- Summary: exports: mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, AgentJobView; internal imports: 2

### `src/lib/google-ads.test.ts`
- Ownership: shared web library
- DB objects: calls
- Route owners: none
- Related tests: none
- Summary: tests/describes: normalizeGoogleAdsCustomerId; strips resource prefixes and dashes; googleAdsSearchStreamUrl; internal imports: 1; package imports: 1

### `src/lib/google-ads.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: none
- Related tests: src/lib/google-ads.test.ts
- Summary: exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION

### `src/lib/member-access.ts`
- Ownership: shared web library
- DB objects: clients, client_members, client_member_campaigns, client_member_events
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/reports/page.tsx, … (+10 more)
- Related tests: src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, __tests__/features/approvals/server.test.ts, … (+50 more)
- Summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

### `src/lib/meta-api.test.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: none
- Related tests: none
- Summary: tests/describes: metaInsightsUrl; builds URL with fields and token; includes optional params; internal imports: 1; package imports: 1

### `src/lib/meta-api.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+17 more)
- Summary: exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange; internal imports: 1

### `src/lib/meta-campaigns.ts`
- Ownership: shared web library
- DB objects: meta_campaigns, clients
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Related tests: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/server.test.ts, … (+15 more)
- Summary: exports: fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult; internal imports: 5

### `src/lib/meta-oauth.test.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: none
- Related tests: none
- Summary: tests/describes: meta-oauth; verifySignedRequest validates HMAC signature; verifySignedRequest rejects tampered payload; internal imports: 1; package imports: 2

### `src/lib/meta-oauth.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: src/app/api/meta/data-deletion/route.ts
- Related tests: src/lib/meta-oauth.test.ts, src/app/api/meta/data-deletion/route.test.ts
- Summary: exports: verifySignedRequest; tests/describes: .; package imports: 1

### `src/lib/supabase.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, … (+29 more)
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+71 more)
- Summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

### `src/lib/ticketmaster/tm1-client.test.ts`
- Ownership: shared Ticketmaster library
- DB objects: calls
- Route owners: none
- Related tests: none
- Summary: tests/describes: normalizeTm1Summary; normalizes nested TM1 figures and derives available values; falls back across alternate field names; internal imports: 1; package imports: 1

### `src/lib/ticketmaster/tm1-client.ts`
- Ownership: shared Ticketmaster library
- DB objects: none
- Route owners: src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts
- Related tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Summary: exports: normalizeTm1Summary, createTm1ClientFromEnv, TM1_DEFAULT_BASE_URL, TM1_DEFAULT_API_PREFIX, TM1_DEFAULT_EVENTBASE_API_PREFIX, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_EXTERNAL_EVENT_VERSION_HEADER; tests/describes: .; package imports: 1
