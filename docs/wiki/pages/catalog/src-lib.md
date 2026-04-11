# src/lib

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 32
- File kinds: TypeScript module (24), test file (7), React/TSX module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/lib/action-item-labels.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 27
- Bytes: 898
- Imports (internal): src/lib/workspace-types.ts
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / event-follow-up-items
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, … (+2 more)
- Exports: taskStatusLabel, FIELD_LABELS
- Symbol details: function taskStatusLabel (exported)
- Defines: taskStatusLabel
- Contents summary: exports: taskStatusLabel, FIELD_LABELS; internal imports: 1

## `src/lib/agent-dispatch.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 62
- Bytes: 1565
- Imports (internal): src/features/system-events/server.ts, src/lib/supabase.ts
- Imports (packages): node:crypto
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Depends on groups: src/features / system-events, src/lib
- Used by groups: Tests / Features, src/app / api, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / event-follow-up-items
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Routes related (direct): src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+4 more)
- Tests related (direct): __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts
- Exports: enqueueExternalAgentTask
- Symbol details: function enqueueExternalAgentTask (exported), interface EnqueueExternalAgentTaskInput
- Defines: enqueueExternalAgentTask, taskId, EnqueueExternalAgentTaskInput
- Contents summary: exports: enqueueExternalAgentTask; internal imports: 2; package imports: 1

## `src/lib/agent-jobs.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 182
- Bytes: 5021
- Imports (internal): src/lib/supabase.ts
- Imports (internal unresolved): src/lib/database.types
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/agents/data.ts, src/app/admin/dashboard/data.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/features/agents/summary.ts
- Depends on groups: src/lib
- Used by groups: Tests / API, src/app / admin, src/app / api, src/features / agents
- Route owners: src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/admin/agents/page.tsx, src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts
- Tests related: __tests__/api/agents-jobs.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/api/agents.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- Tests related (direct): __tests__/api/agents-jobs.test.ts
- Exports: mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, AgentJobView
- Symbol details: function mapTaskToJob (exported), function listAgentJobs (exported), function getAgentJob (exported), function getLatestAgentStatuses (exported), function getHeartbeatStatus (exported), function isRecord, function taskStatusToUiStatus, function jsonToText, function taskPrompt, function isDisplayableTask, const DISPLAYABLE_TO_AGENTS, const DISPLAYABLE_FROM_AGENTS, type AgentTaskRow, type RuntimeStateRow, type AgentTaskJobRow, interface AgentJobView (exported)
- Defines: isRecord, taskStatusToUiStatus, jsonToText, taskPrompt, isDisplayableTask, mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, DISPLAYABLE_TO_AGENTS, DISPLAYABLE_FROM_AGENTS, … (+10 more)
- Contents summary: exports: mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, AgentJobView; internal imports: 2

## `src/lib/api-helpers.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 193
- Bytes: 6640
- Imports (internal): src/lib/api-helpers.ts
- Imports (packages): vitest, @clerk/nextjs/server, zod
- Depends on groups: src/lib
- Symbol details: const mockedAuth, const mockedCurrentUser
- Defines: mockedAuth, mockedCurrentUser, res, body, result, originalEnv, request, TestSchema
- Tests / describe labels: apiError, returns JSON response with error message and status, defaults to status 500, authGuard, returns userId when authenticated, returns error response when not authenticated, secretGuard, returns null when secret matches, … (+4 more)
- Contents summary: tests/describes: apiError; returns JSON response with error message and status; defaults to status 500; internal imports: 1; package imports: 3

## `src/lib/api-helpers.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 107
- Bytes: 3606
- Imports (packages): next/server, @clerk/nextjs/server, zod
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, … (+29 more)
- Used by groups: Tests / API, src/app / admin, src/app / api, src/lib
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, … (+20 more)
- Routes related (direct): src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, … (+11 more)
- Tests related: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, … (+14 more)
- Tests related (direct): __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, … (+1 more)
- Exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName, shouldEnqueueCommentTriage
- Symbol details: function apiError (exported), function dbError (exported), function authGuard (exported), function secretGuard (exported), function adminGuard (exported), function parseJsonBody (exported), function validateRequest (exported), function getAuthorName (exported), function shouldEnqueueCommentTriage (exported)
- Defines: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName, shouldEnqueueCommentTriage, caller, meta, role, … (+2 more)
- Contents summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName; package imports: 3

## `src/lib/api-schemas.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 223
- Bytes: 8101
- Imports (packages): zod
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, … (+4 more)
- Used by groups: Tests / Lib, src/app / admin, src/app / api
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, … (+3 more)
- Routes related (direct): src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts
- Tests related: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, src/app/api/campaign-comments/route.test.ts, … (+3 more)
- Tests related (direct): __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts
- Exports: IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, HeartbeatPayloadSchema, … (+6 more)
- Symbol details: const IngestPayloadSchema (exported), const AlertPostSchema (exported), const AlertPatchSchema (exported), const VALID_AGENTS (exported), const AgentPostSchema (exported), const InviteSchema (exported), const CreateClientSchema (exported), const UpdateClientSchema (exported), const AddClientMemberSchema (exported), const RemoveClientMemberSchema (exported), const ChangeClientMemberRoleSchema (exported), const HeartbeatPayloadSchema (exported), const ContactFormSchema (exported), const CreateCampaignCommentSchema (exported), const CreateAssetCommentSchema (exported), const CreateEventCommentSchema (exported), … (+5 more)
- Defines: TmEventSchema, MetaCampaignSchema, TmDemographicsSchema, IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, … (+9 more)
- Contents summary: exports: IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema; package imports: 1

## `src/lib/campaign-client-assignment.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 175
- Bytes: 4933
- Imports (internal): src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: applyFilters, state, values, supabaseAdmin, query, rows, data, campaigns, row
- Tests / describe labels: campaign client assignment helpers, applies overrides before stored slug and guessed fallback, lists campaigns for a client using effective assignment, checks client ownership against the effective assignment, lists effective campaign ids for a client
- Contents summary: tests/describes: campaign client assignment helpers; applies overrides before stored slug and guessed fallback; lists campaigns for a client using effective assignment; internal imports: 2; package imports: 1

## `src/lib/campaign-client-assignment.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 156
- Bytes: 4816
- Imports (internal): src/lib/client-slug.ts, src/lib/supabase.ts
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, … (+21 more)
- Depends on groups: src/lib
- Used by groups: Tests / App, Tests / Features, src/app / admin, src/app / api, src/app / client, src/features / approvals, src/features / assets, src/features / campaign-action-items, src/features / campaigns, src/features / conversations, … (+4 more)
- Route owners: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, … (+17 more)
- Routes related (direct): src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/search.test.ts, … (+54 more)
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/search.test.ts, … (+3 more)
- Exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, CampaignClientAssignmentRow
- Symbol details: function getCampaignClientOverrideMap (exported), function resolveEffectiveCampaignClientSlug (exported), function applyEffectiveCampaignClientSlugs (exported), function getEffectiveCampaignRowById (exported), function getEffectiveCampaignClientSlug (exported), function listEffectiveCampaignRowsForClientSlug (exported), function listEffectiveCampaignIdsForClientSlug (exported), function campaignBelongsToClientSlug (exported), function normalizeGuessedClientSlug, interface CampaignClientAssignmentRow (exported)
- Defines: normalizeGuessedClientSlug, getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, overrides, uniqueCampaignIds, override, … (+8 more)
- Contents summary: exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug; internal imports: 2

## `src/lib/campaign-event-match.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 51
- Bytes: 1712
- Imported by: src/app/admin/dashboard/upcoming-shows.tsx, src/components/admin/events/columns.tsx
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/events/page.test.tsx
- Exports: matchedCampaigns, MatchableCampaign, MatchableEvent
- Symbol details: function matchedCampaigns (exported), function campaignCity, function campaignArtist, const CITY_KEYWORDS, type MatchableCampaign (exported), type MatchableEvent (exported)
- Defines: campaignCity, campaignArtist, matchedCampaigns, CITY_KEYWORDS, lower, eventArtist, eventCity, cArtist, cCity, MatchableCampaign, MatchableEvent
- Contents summary: exports: matchedCampaigns, MatchableCampaign, MatchableEvent

## `src/lib/client-slug.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 19
- Bytes: 689
- Imported by: __tests__/lib/client-slug.test.ts, src/lib/campaign-client-assignment.ts
- Used by groups: Tests / Lib, src/lib
- Route owners: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, … (+17 more)
- Tests related: __tests__/lib/client-slug.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, … (+55 more)
- Tests related (direct): __tests__/lib/client-slug.test.ts
- Exports: guessClientSlug
- Symbol details: function guessClientSlug (exported)
- Defines: guessClientSlug, lower
- Contents summary: exports: guessClientSlug

## `src/lib/constants.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 45
- Bytes: 1477
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-section.tsx, src/app/client/[slug]/components/date-range-picker.tsx, src/app/client/[slug]/data.ts, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, … (+6 more)
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / assets, src/features / client-portal, src/features / reports, src/lib
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, … (+7 more)
- Routes related (direct): src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, … (+25 more)
- Exports: parseRange, META_API_VERSION, META_PRESETS, RANGE_LABELS, EVENT_STATUS_OPTIONS, ASSET_STATUSES, ASSET_STATUS_COLORS, DateRange, AssetStatus
- Symbol details: function parseRange (exported), const META_API_VERSION (exported), const EVENT_STATUS_OPTIONS (exported), const ASSET_STATUSES (exported), type DateRange (exported), type AssetStatus (exported)
- Defines: parseRange, META_API_VERSION, EVENT_STATUS_OPTIONS, ASSET_STATUSES, DateRange, AssetStatus
- Contents summary: exports: parseRange, META_API_VERSION, META_PRESETS, RANGE_LABELS, EVENT_STATUS_OPTIONS, ASSET_STATUSES, ASSET_STATUS_COLORS, DateRange

## `src/lib/database.types.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 1952
- Bytes: 57621
- Exports: Constants, Json, Database, Tables, Enums, CompositeTypes
- Symbol details: const Constants (exported), type Json (exported), type Database (exported), type Tables (exported), type Enums (exported), type CompositeTypes (exported), type DatabaseWithoutInternals, type DefaultSchema
- Defines: Constants, Json, Database, DatabaseWithoutInternals, DefaultSchema, Tables, Enums, CompositeTypes
- Contents summary: exports: Constants, Json, Database, Tables, Enums, CompositeTypes

## `src/lib/env.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 105
- Bytes: 4616
- Imports (packages): zod
- Imported by: src/instrumentation.ts
- Used by groups: src / Root
- Symbol details: function validateEnv, const serverSchema, const publicSchema
- Defines: validateEnv, serverSchema, publicSchema, publicResult, missing, serverResult
- Contents summary: package imports: 1

## `src/lib/export-csv.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 42
- Bytes: 1100
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/events/event-table.tsx, src/components/admin/users/user-table.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: exportToCsv, todayFilename
- Symbol details: function exportToCsv (exported), function todayFilename (exported), function sanitize, type CsvColumn
- Defines: sanitize, exportToCsv, todayFilename, headers, csvRows, csv, blob, url, a, d, CsvColumn
- Tests / describe labels: T
- Contents summary: exports: exportToCsv, todayFilename; tests/describes: T

## `src/lib/formatters.tsx`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 192
- Bytes: 7730
- Imports (internal): src/features/invitations/types.ts, src/lib/status.ts
- Imported by: __tests__/lib/formatters.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/page.tsx, … (+50 more)
- Depends on groups: src/features / invitations, src/lib
- Used by groups: Tests / Lib, src/app / admin, src/app / client, src/components / admin, src/components / client, src/features / client-portal, src/features / dashboard, src/features / events, src/features / reports, src/lib
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, … (+14 more)
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, … (+7 more)
- Tests related: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, … (+41 more)
- Tests related (direct): __tests__/lib/formatters.test.ts
- Exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, … (+3 more)
- Symbol details: function centsToUsd (exported), function fmtUsd (exported), function fmtNum (exported), function fmtDate (exported), function fmtTodayLong (exported), function slugToLabel (exported), function getInvitationStatusCfg (exported), function timeAgo (exported), function roasColor (exported), function fmtObjective (exported), function computeMarginalRoas (exported), function computeBlendedRoas (exported), function statusBadge (exported), function describeCount (exported), const CAMPAIGN_STATUSES, interface MarginalRoasPoint (exported), … (+1 more)
- Defines: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, … (+13 more)
- Tests / describe labels: _
- Contents summary: exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo; tests/describes: _; internal imports: 2

## `src/lib/google-ads.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 158
- Bytes: 4976
- Imports (internal): src/lib/google-ads.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: result, fetchMock
- Tests / describe labels: normalizeGoogleAdsCustomerId, strips resource prefixes and dashes, googleAdsSearchStreamUrl, builds the searchStream endpoint for a customer, flattenGoogleAdsSearchStream, flattens chunked rows and preserves metadata, refreshGoogleAdsAccessToken, refreshes an access token from OAuth, … (+3 more)
- Contents summary: tests/describes: normalizeGoogleAdsCustomerId; strips resource prefixes and dashes; googleAdsSearchStreamUrl; internal imports: 1; package imports: 1

## `src/lib/google-ads.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 489
- Bytes: 15372
- Imported by: src/lib/google-ads.test.ts, src/scripts/google-ads-discover-accounts.ts
- Used by groups: src/lib, src / scripts
- Tests related: src/lib/google-ads.test.ts
- Tests related (direct): src/lib/google-ads.test.ts
- Exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION, GoogleAdsApiError, GoogleAdsCredentials, GoogleAdsAccessToken, GoogleAdsSearchStreamChunk, … (+6 more)
- Symbol details: function normalizeGoogleAdsCustomerId (exported), function googleAdsSearchStreamUrl (exported), function getGoogleAdsCredentials (exported), function refreshGoogleAdsAccessToken (exported), function flattenGoogleAdsSearchStream (exported), function googleAdsSearchStream (exported), function fetchGoogleAdsFirstReadSnapshot (exported), function mapGoogleAdsCustomer, function mapGoogleAdsChildAccount, function mapGoogleAdsCampaign, function toNumber, function getGoogleAdsErrorMessage, function parseJsonResponse, const GOOGLE_ADS_API_VERSION (exported), class GoogleAdsApiError (exported), interface GoogleAdsCredentials (exported), … (+8 more)
- Defines: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, mapGoogleAdsCustomer, mapGoogleAdsChildAccount, mapGoogleAdsCampaign, toNumber, getGoogleAdsErrorMessage, … (+46 more)
- Contents summary: exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION

## `src/lib/member-access.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 110
- Bytes: 2884
- Imports (internal): src/lib/supabase.ts
- Imports (packages): react
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/assets/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/client-agent/readers.ts, src/features/client-agent/server.test.ts, … (+12 more)
- Depends on groups: src/lib
- Used by groups: src/app / client, src/features / approvals, src/features / assets, src/features / campaign-comments, src/features / campaigns, src/features / client-agent, src/features / client-portal, src/features / conversations, src-features-event-comments, src/features / events, … (+2 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+12 more)
- Tests related: src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, … (+52 more)
- Tests related (direct): src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts
- Exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess
- Symbol details: function getMemberships (exported), const getMemberAccessForSlug (exported), interface ScopeFilter (exported), interface MemberAccess (exported), interface ScopedAccess (exported)
- Defines: getMemberships, client, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess
- Contents summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

## `src/lib/meta-api.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 125
- Bytes: 3870
- Imports (internal): src/lib/meta-api.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: url, result
- Tests / describe labels: metaInsightsUrl, builds URL with fields and token, includes optional params, prefers explicit time_range over date_preset when provided, metaUrl, builds a URL with path and token, fetchMetaApi, returns parsed JSON on success, … (+4 more)
- Contents summary: tests/describes: metaInsightsUrl; builds URL with fields and token; includes optional params; internal imports: 1; package imports: 1

## `src/lib/meta-api.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 118
- Bytes: 3608
- Imports (internal): src/lib/constants.ts
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/features/reports/server.ts, src/lib/meta-api.test.ts, src/lib/meta-campaigns.ts
- Depends on groups: src/lib
- Used by groups: Tests / App, src/app / client, src/features / reports, src/lib
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+19 more)
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts
- Exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange
- Symbol details: function fetchMetaApi (exported), function metaGet (exported), function metaInsightsUrl (exported), function metaUrl (exported), class MetaApiError (exported), type MetaInsightsTimeRange (exported)
- Defines: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, parsed, res, err, message, json, url, MetaApiError, MetaInsightsTimeRange
- Contents summary: exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange; internal imports: 1

## `src/lib/meta-campaigns.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 297
- Bytes: 9170
- Imports (internal): src/lib/constants.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/meta-api.ts, src/lib/supabase.ts
- Imported by: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx, src/features/campaigns/server.ts, … (+1 more)
- Depends on groups: src/lib
- Used by groups: Tests / App, Tests / Features, src/app / admin, src/app / client, src/components / admin, src/features / campaigns, src/features / reports
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Routes related (direct): src/app/admin/campaigns/page.tsx
- Tests related: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+17 more)
- Tests related (direct): __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts
- Exports: fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult
- Symbol details: function fetchAllCampaigns (exported), function getCredentials, function fetchAllPages, function loadCampaignTypes, function loadAllClientSlugs, function safeParseFloat, function buildCampaignFilter, function buildInsightsUrl, interface MetaCampaignCard (exported), interface DailyInsight (exported), interface MetaCampaignsResult (exported), interface MetaPagedResponse, interface RawCampaign, interface RawInsight, interface RawDailyInsight
- Defines: getCredentials, fetchAllPages, loadCampaignTypes, loadAllClientSlugs, safeParseFloat, buildCampaignFilter, buildInsightsUrl, fetchAllCampaigns, token, rawAccountId, accountId, res, … (+32 more)
- Contents summary: exports: fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult; internal imports: 5

## `src/lib/meta-oauth.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 37
- Bytes: 1219
- Imports (internal): src/lib/meta-oauth.ts
- Imports (packages): vitest, node:crypto
- Depends on groups: src/lib
- Defines: crypto, payload, encodedPayload, sig, encodedSig, signedRequest, result
- Tests / describe labels: meta-oauth, verifySignedRequest validates HMAC signature, verifySignedRequest rejects tampered payload
- Contents summary: tests/describes: meta-oauth; verifySignedRequest validates HMAC signature; verifySignedRequest rejects tampered payload; internal imports: 1; package imports: 2

## `src/lib/meta-oauth.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 30
- Bytes: 924
- Imports (packages): node:crypto
- Imported by: src/app/api/meta/data-deletion/route.ts, src/lib/meta-oauth.test.ts
- Used by groups: src/app / api, src/lib
- Route owners: src/app/api/meta/data-deletion/route.ts
- Routes related (direct): src/app/api/meta/data-deletion/route.ts
- Tests related: src/lib/meta-oauth.test.ts, src/app/api/meta/data-deletion/route.test.ts
- Tests related (direct): src/lib/meta-oauth.test.ts
- Exports: verifySignedRequest
- Symbol details: function verifySignedRequest (exported), function getAppSecret
- Defines: getAppSecret, verifySignedRequest, secret, expectedSig, actualSig
- Tests / describe labels: .
- Contents summary: exports: verifySignedRequest; tests/describes: .; package imports: 1

## `src/lib/shopify-admin.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 89
- Bytes: 2333
- Imports (internal): src/lib/shopify-admin.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: result
- Tests / describe labels: getShopifyAdminCredentials, reads Shopify credentials from env, throws when required env is missing, shopifyAdminGraphql, posts a graphql query and returns the data payload, throws ShopifyAdminApiError when graphql returns top-level errors
- Contents summary: tests/describes: getShopifyAdminCredentials; reads Shopify credentials from env; throws when required env is missing; internal imports: 1; package imports: 1

## `src/lib/shopify-admin.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 268
- Bytes: 7077
- Imported by: src/lib/shopify-admin.test.ts
- Used by groups: src/lib
- Tests related: src/lib/shopify-admin.test.ts
- Tests related (direct): src/lib/shopify-admin.test.ts
- Exports: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, ShopifyAdminApiError, ShopifyAdminCredentials, ShopifyFirstReadSnapshot
- Symbol details: function getShopifyAdminCredentials (exported), function shopifyAdminGraphql (exported), function fetchShopifyFirstReadSnapshot (exported), const SHOPIFY_ADMIN_DEFAULT_API_VERSION (exported), class ShopifyAdminApiError (exported), interface ShopifyAdminCredentials (exported), interface ShopifyFirstReadSnapshot (exported), interface ShopifyGraphqlEnvelope, interface ShopifyFirstReadQueryResult
- Defines: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, storeDomain, accessToken, apiVersion, missing, credentials, response, body, data, … (+5 more)
- Contents summary: exports: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, ShopifyAdminApiError, ShopifyAdminCredentials, ShopifyFirstReadSnapshot

## `src/lib/status.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 50
- Bytes: 1960
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/insights.ts, src/lib/formatters.tsx
- Used by groups: src/app / admin, src/app / client, src/features / client-portal, src/lib
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, … (+14 more)
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/lib/formatters.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+41 more)
- Exports: getCampaignStatusCfg, getEventStatusCfg
- Symbol details: function getCampaignStatusCfg (exported), function getEventStatusCfg (exported), type CampaignStatus, type EventStatus
- Defines: getCampaignStatusCfg, getEventStatusCfg, key, CampaignStatus, EventStatus
- Contents summary: exports: getCampaignStatusCfg, getEventStatusCfg

## `src/lib/supabase.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 79
- Bytes: 2572
- Imports (packages): react, @clerk/nextjs/server, @supabase/supabase-js
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+75 more)
- Used by groups: Tests / App, Tests / Features, Tests / Root, src/app / admin, src/app / api, src/app / client, src/features / agent-outcomes, src/features / approvals, src/features / asset-follow-up-items, src/features / assets, … (+15 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, … (+31 more)
- Routes related (direct): src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, … (+5 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, … (+73 more)
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, … (+23 more)
- Exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin
- Symbol details: function createClerkSupabaseClient (exported), function getFeatureReadClient (exported), const supabaseAdmin (exported), const getCachedUser, const url, const anonKey, const serviceKey
- Defines: createClerkSupabaseClient, getFeatureReadClient, getCachedUser, url, anonKey, serviceKey, supabaseAdmin, user, role
- Contents summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

## `src/lib/text-utils.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 11
- Bytes: 396
- Imported by: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Used by groups: src/app / api
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Tests related: src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Exports: excerpt
- Symbol details: function excerpt (exported)
- Defines: excerpt, normalized
- Contents summary: exports: excerpt

## `src/lib/to-slug.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 33
- Bytes: 925
- Imports (internal): src/lib/to-slug.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Tests / describe labels: toSlug, converts a simple name to lowercase underscore slug, handles multiple spaces and special characters, strips leading and trailing underscores, returns empty string for empty input, preserves numbers, handles single word, collapses consecutive separators into one underscore
- Contents summary: tests/describes: toSlug; converts a simple name to lowercase underscore slug; handles multiple spaces and special characters; internal imports: 1; package imports: 1

## `src/lib/to-slug.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 9
- Bytes: 228
- Imported by: src/components/admin/client-onboard-form.tsx, src/components/admin/clients/client-table.tsx, src/lib/to-slug.test.ts
- Used by groups: src/components / admin, src/lib
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx
- Tests related: src/lib/to-slug.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/lib/to-slug.test.ts
- Exports: toSlug
- Symbol details: function toSlug (exported)
- Defines: toSlug
- Contents summary: exports: toSlug

## `src/lib/utils.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 7
- Bytes: 166
- Imports (packages): clsx, tailwind-merge
- Imported by: src/components/admin/agents/command-summary.tsx, src/components/admin/collapsible-sidebar.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/nav-links.tsx, src/components/landing/sample-metric-card.tsx, src/components/ui/badge.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/command.tsx, … (+8 more)
- Used by groups: src/components / admin, src/components / landing, src/components / ui
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, … (+21 more)
- Tests related: src/components/admin/agents/command-summary.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-discussion-form.test.tsx, … (+9 more)
- Exports: cn
- Symbol details: function cn (exported)
- Defines: cn
- Contents summary: exports: cn; package imports: 2

## `src/lib/workspace-types.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 22
- Bytes: 669
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/dashboard/summary.ts, src/features/event-follow-up-items/server.ts, src/features/events/summary.ts, … (+1 more)
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / dashboard, src/features / event-follow-up-items, src/features / events, src/lib
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/events/[eventId]/page.tsx, … (+5 more)
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/dashboard/summary.test.ts, … (+28 more)
- Exports: TASK_STATUSES, TASK_PRIORITIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TaskStatus, TaskPriority
- Symbol details: const TASK_STATUSES (exported), const TASK_PRIORITIES (exported), type TaskStatus (exported), type TaskPriority (exported)
- Defines: TASK_STATUSES, TASK_PRIORITIES, TaskStatus, TaskPriority
- Contents summary: exports: TASK_STATUSES, TASK_PRIORITIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TaskStatus, TaskPriority
