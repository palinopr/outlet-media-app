# Service Boundary Map

Generated from the current working tree on 2026-04-28 02:57:59.

This page summarizes the major system boundaries in the repo: web, agent runtime, database, and the bridge files that connect them.

## Web system
- Route files: 47
- Admin routes: 15
- Client routes: 13
- API routes: 10
- Web files touching DB objects: 147
- Web↔agent touchpoints: none

## Agent system
- Agent files tracked: 0
- Agent files touching DB objects: 0
- Agent DB touchpoints: none

## Database system
- Schema objects tracked: 83
- Tables tracked: 61
- Functions/views/triggers tracked: 22

## Shared boundary libraries
- src/lib/google-ads.test.ts, src/lib/google-ads.ts, src/lib/member-access.ts, src/lib/meta-api.test.ts, src/lib/meta-api.ts, src/lib/meta-campaigns.test.ts, src/lib/meta-campaigns.ts, src/lib/meta-oauth.test.ts, src/lib/meta-oauth.ts, src/lib/supabase.ts

## Integration services seen in env registry
- Anthropic / Claude: ANTHROPIC_API_KEY, CLIENT_AGENT_CLAUDE_MODEL
- App / Runtime: E2E_BASE_URL, INGEST_SECRET, NEXT_PUBLIC_APP_URL
- Clerk: CLERK_SECRET_KEY, E2E_CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL
- Google / Gmail / Calendar: GMAIL_PUSH_WEBHOOK_SECRET, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_LOGIN_CUSTOMER_ID, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_DRIVE_REFRESH_TOKEN, GOOGLE_REFRESH_TOKEN
- Meta: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID, META_APP_ID, META_APP_SECRET, META_PAGE_ID
- Other / App: CI, CODEX_FINAL_MESSAGE, CONTACT_FORM_TO_EMAIL, E2E_CLIENT_SLUG, EVOLUTION_API_KEY, EVOLUTION_API_URL, EVOLUTION_INSTANCE_NAME, EVOLUTION_WEBHOOK_SECRET, NEXT_PHASE, NEXT_PUBLIC_AUDIT_BOOKING_URL, PR_NUMBER, SHOPIFY_ADMIN_ACCESS_TOKEN, SHOPIFY_ADMIN_API_VERSION, SHOPIFY_STORE_DOMAIN, SHOPIFY_WEBHOOK_SECRET, TELEGRAM_WEBHOOK_SECRET, … (+1 more)
- Resend: RESEND_API_KEY, RESEND_FROM_EMAIL
- Supabase: NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL

## Boundary bridge files
### `src/lib/google-ads.test.ts`
- Ownership: shared web library
- DB objects: calls
- Route owners: none
- Related tests: none
- Summary: tests/describes: normalizeGoogleAdsCustomerId; strips resource prefixes and dashes; googleAdsSearchStreamUrl; internal imports: 1; package imports: 1

### `src/lib/google-ads.ts`
- Ownership: shared web library
- DB objects: if
- Route owners: none
- Related tests: src/lib/google-ads.test.ts
- Summary: exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION

### `src/lib/member-access.ts`
- Ownership: shared web library
- DB objects: clients, client_members, client_member_campaigns, if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/entry-accept.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

### `src/lib/meta-api.test.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: none
- Related tests: none
- Summary: tests/describes: metaInsightsUrl; builds URL with fields and token; includes optional params; internal imports: 1; package imports: 1

### `src/lib/meta-api.ts`
- Ownership: shared web library
- DB objects: if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Summary: exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange; internal imports: 1

### `src/lib/meta-campaigns.test.ts`
- Ownership: shared web library
- DB objects: if
- Route owners: none
- Related tests: none
- Summary: tests/describes: fetchAllCampaigns; fetches one live campaign for detail-page fallback; still returns Meta campaigns when optional Supabase enrichment is unavailable; internal imports: 2; package imports: 1

### `src/lib/meta-campaigns.ts`
- Ownership: shared web library
- DB objects: meta_campaigns, clients, if
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Related tests: src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Summary: exports: fetchCampaignById, fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult; internal imports: 5

### `src/lib/meta-oauth.test.ts`
- Ownership: shared web library
- DB objects: none
- Route owners: none
- Related tests: none
- Summary: tests/describes: meta-oauth; verifySignedRequest validates HMAC signature; verifySignedRequest rejects tampered payload; internal imports: 1; package imports: 2

### `src/lib/meta-oauth.ts`
- Ownership: shared web library
- DB objects: if
- Route owners: src/app/api/meta/data-deletion/route.ts
- Related tests: src/lib/meta-oauth.test.ts, src/app/api/meta/data-deletion/route.test.ts
- Summary: exports: verifySignedRequest; tests/describes: .; package imports: 1

### `src/lib/supabase.ts`
- Ownership: shared web library
- DB objects: if
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, src/app/api/observability/client-error/route.ts, src/app/admin/clients/[id]/page.tsx, … (+11 more)
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, src/app/api/observability/client-error/route.test.ts, … (+20 more)
- Summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3
