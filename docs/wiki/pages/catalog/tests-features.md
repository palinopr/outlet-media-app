# Tests / Features

Generated from the current working tree on 2026-04-10 21:27:09.

- Files: 36
- File kinds: test file (36)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `__tests__/features/access/revalidation.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 29
- Bytes: 769
- Imports (internal): src/features/access/revalidation.ts
- Imports (packages): vitest
- Depends on groups: src/features / access
- Tests / describe labels: access management revalidation paths, covers the shared admin access surfaces, includes client detail and portal settings when client context is present
- Contents summary: tests/describes: access management revalidation paths; covers the shared admin access surfaces; includes client detail and portal settings when client context is present; internal imports: 1; package imports: 1

## `__tests__/features/agent-outcomes/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 217
- Bytes: 6792
- Imports (internal): src/features/agent-outcomes/server.ts, src/lib/supabase.ts, src/features/assets/server.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / agent-outcomes, src/lib, src/features / assets
- Symbol details: function makeRequest, function makeTask
- Defines: applyFilters, buildClient, makeRequest, makeTask, serviceState, userScopedState, values, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, … (+6 more)
- Tests / describe labels: agent outcomes read clients, prefers the Clerk-scoped client for shared client outcomes, keeps admin viewers on the service role for client outcomes
- Contents summary: tests/describes: agent outcomes read clients; prefers the Clerk-scoped client for shared client outcomes; keeps admin viewers on the service role for client outcomes; internal imports: 3; package imports: 2

## `__tests__/features/agent-outcomes/server.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 162
- Bytes: 3497
- Imports (internal): src/features/agent-outcomes/summary.ts, src/features/agent-outcomes/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / agent-outcomes
- Symbol details: function request
- Defines: request, result, eventScoped, campaignScoped, assetScoped, campaignOnly, allowed, blocked
- Tests / describe labels: matchesContext, keeps event-linked outcomes visible for scoped event members, allows event detail pages to show outcomes linked through either the event or a scoped campaign, filters unrelated outcomes when neither the campaign nor event scope matches, keeps only asset-linked outcomes when the asset context is requested, keeps asset-linked outcomes visible on generic client surfaces only when the asset id is allowed, does not widen event-specific views with unrelated allowed asset ids
- Contents summary: tests/describes: matchesContext; keeps event-linked outcomes visible for scoped event members; allows event detail pages to show outcomes linked through either the event or a scoped campaign; internal imports: 2; package imports: 1

## `__tests__/features/agent-outcomes/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 211
- Bytes: 6603
- Imports (internal): src/features/agent-outcomes/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / agent-outcomes
- Defines: outcome
- Tests / describe labels: agent outcome summary helpers, converts task status into UI status, extracts text from JSON task results, merges request and task records into a campaign-linked outcome, keeps a linked action item when the outcome already created follow-up work, does not expose retired CRM context keys on non-core agent outcomes, preserves asset context on creative-focused agent outcomes, keeps a linked asset follow-up item when agent work already created it, … (+1 more)
- Contents summary: tests/describes: agent outcome summary helpers; converts task status into UI status; extracts text from JSON task results; internal imports: 1; package imports: 1

## `__tests__/features/agents/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 210
- Bytes: 6679
- Imports (internal): src/features/agents/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / agents
- Defines: summary
- Tests / describe labels: buildAgentCommandSummary, prioritizes failed and active jobs and counts actionable outcomes, groups actionable outcomes by surface and prioritizes failures first
- Contents summary: tests/describes: buildAgentCommandSummary; prioritizes failed and active jobs and counts actionable outcomes; groups actionable outcomes by surface and prioritizes failures first; internal imports: 1; package imports: 1

## `__tests__/features/approvals/server.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 368
- Bytes: 11089
- Imports (internal): src/features/approvals/server.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/assets/server.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / approvals, src/lib, src/features / assets
- Defines: applyFilters, buildClient, serviceState, userScopedState, values, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, … (+4 more)
- Tests / describe labels: listApprovalRequests, prefers the Clerk-scoped client for client approval lists, keeps the reassigned-campaign fallback on the service role, keeps admin viewers on the service role for client-scoped approval lists, listCampaignApprovalRequests, keeps client campaign approval helpers on the Clerk-scoped client, listEventApprovalRequests, keeps event approval helpers event-aware across event and linked campaign approvals
- Contents summary: tests/describes: listApprovalRequests; prefers the Clerk-scoped client for client approval lists; keeps the reassigned-campaign fallback on the service role; internal imports: 4; package imports: 2

## `__tests__/features/approvals/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 110
- Bytes: 3090
- Imports (internal): src/features/approvals/server.ts, src/features/approvals/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / approvals
- Symbol details: function makeApproval
- Defines: makeApproval, filtered, unscoped, allowed, blocked
- Tests / describe labels: approval scope filtering, keeps approvals tied to allowed campaigns or events, preserves approvals with no campaign or event context, keeps asset approvals only when the asset id is allowed, blocks scoped approvals when the assigned campaign and event lists are empty
- Contents summary: tests/describes: approval scope filtering; keeps approvals tied to allowed campaigns or events; preserves approvals with no campaign or event context; internal imports: 2; package imports: 1

## `__tests__/features/assets/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 205
- Bytes: 6158
- Imports (internal): src/features/assets/server.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / assets, src/lib
- Symbol details: function makeAsset
- Defines: applyFilters, buildClient, makeAsset, serviceState, userScopedState, query, rows, data, actual, summary, assets
- Tests / describe labels: asset read clients, prefers the Clerk-scoped client for client asset summaries, prefers the Clerk-scoped client for campaign asset reads, prefers the Clerk-scoped client for client asset detail reads, keeps admin asset detail reads on the service role
- Contents summary: tests/describes: asset read clients; prefers the Clerk-scoped client for client asset summaries; prefers the Clerk-scoped client for campaign asset reads; internal imports: 3; package imports: 2

## `__tests__/features/assets/server.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 32
- Bytes: 845
- Imports (internal): src/features/assets/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / assets
- Defines: asset
- Tests / describe labels: assetMatchesScopedCampaigns, keeps assets that match an allowed campaign label or folder, blocks assets when no allowed campaign matches
- Contents summary: tests/describes: assetMatchesScopedCampaigns; keeps assets that match an allowed campaign label or folder; blocks assets when no allowed campaign matches; internal imports: 1; package imports: 1

## `__tests__/features/campaign-action-items/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 220
- Bytes: 6324
- Imports (internal): src/features/campaign-action-items/server.ts, src/lib/supabase.ts, src/lib/agent-dispatch.ts, src/features/notifications/workflow.ts, src/features/system-events/server.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / campaign-action-items, src/lib, src/features / notifications, src/features / system-events
- Defines: applyFilters, buildClient, serviceState, userScopedState, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, getFeatureReadClientFn, … (+3 more)
- Tests / describe labels: campaign action items read clients, prefers the Clerk-scoped client for shared campaign action items, keeps admin viewers on the service role for shared campaign action items
- Contents summary: tests/describes: campaign action items read clients; prefers the Clerk-scoped client for shared campaign action items; keeps admin viewers on the service role for shared campaign action items; internal imports: 5; package imports: 2

## `__tests__/features/campaign-comments/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 174
- Bytes: 5023
- Imports (internal): src/features/campaign-comments/server.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / campaign-comments, src/lib
- Defines: applyFilters, buildClient, serviceState, userScopedState, query, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, getFeatureReadClientFn, user, … (+2 more)
- Tests / describe labels: campaign comments read clients, prefers the Clerk-scoped client for shared campaign comments, keeps admin viewers on the service role for campaign comments
- Contents summary: tests/describes: campaign comments read clients; prefers the Clerk-scoped client for shared campaign comments; keeps admin viewers on the service role for campaign comments; internal imports: 2; package imports: 2

## `__tests__/features/client-portal/scope.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 22
- Bytes: 842
- Imports (internal): src/features/client-portal/scope.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-portal
- Defines: scope
- Tests / describe labels: client portal scope helpers, allows campaigns and events when no assigned scope exists, restricts access to the explicitly assigned campaign and event ids
- Contents summary: tests/describes: client portal scope helpers; allows campaigns and events when no assigned scope exists; restricts access to the explicitly assigned campaign and event ids; internal imports: 1; package imports: 1

## `__tests__/features/clients/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 95
- Bytes: 2500
- Imports (internal): src/features/clients/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / clients
- Defines: ranked
- Tests / describe labels: client workflow summary helpers, weights approvals and discussions above passive review counts, ranks clients by workflow pressure before spend, lets connection risk outrank lighter workflow pressure
- Contents summary: tests/describes: client workflow summary helpers; weights approvals and discussions above passive review counts; ranks clients by workflow pressure before spend; internal imports: 1; package imports: 1

## `__tests__/features/conversations/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 247
- Bytes: 7637
- Imports (internal): src/features/conversations/server.ts, src/lib/supabase.ts, src/features/assets/server.ts, src/lib/campaign-client-assignment.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / conversations, src/lib, src/features / assets
- Defines: applyFilters, buildClient, serviceState, userScopedState, values, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, … (+4 more)
- Tests / describe labels: conversation read clients, prefers the Clerk-scoped client for client campaign threads and names, keeps admin viewers on the service role for client conversation threads
- Contents summary: tests/describes: conversation read clients; prefers the Clerk-scoped client for client campaign threads and names; keeps admin viewers on the service role for client conversation threads; internal imports: 4; package imports: 2

## `__tests__/features/conversations/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 11
- Bytes: 488
- Imports (internal): src/features/conversations/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / conversations
- Tests / describe labels: matchesConversationKinds, keeps only requested conversation surfaces
- Contents summary: tests/describes: matchesConversationKinds; keeps only requested conversation surfaces; internal imports: 1; package imports: 1

## `__tests__/features/dashboard/integration.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 166
- Bytes: 5594
- Imports (internal): src/features/dashboard/server.ts, src/lib/supabase.ts, src/features/approvals/server.ts, src/features/conversations/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / dashboard, src/lib, src/features / approvals, src/features / conversations
- Defines: applyFilters, state, values, supabaseAdmin, query, rows, data, getFeatureReadClientFn, result, actionItemMetric
- Tests / describe labels: getDashboardOpsSummary integration, returns complete dashboard summary shape with empty data, aggregates campaign metrics from active campaigns, scopes results to a specific client slug
- Contents summary: tests/describes: getDashboardOpsSummary integration; returns complete dashboard summary shape with empty data; aggregates campaign metrics from active campaigns; internal imports: 4; package imports: 1

## `__tests__/features/dashboard/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 226
- Bytes: 7041
- Imports (internal): src/features/dashboard/server.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/features/approvals/server.ts, src/features/conversations/server.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / dashboard, src/lib, src/features / approvals, src/features / conversations
- Defines: applyFilters, buildClient, serviceState, userScopedState, values, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, … (+4 more)
- Tests / describe labels: dashboard read clients, prefers the Clerk-scoped client for client dashboard summaries, keeps admin viewers on the service role for client dashboard summaries
- Contents summary: tests/describes: dashboard read clients; prefers the Clerk-scoped client for client dashboard summaries; keeps admin viewers on the service role for client dashboard summaries; internal imports: 5; package imports: 2

## `__tests__/features/dashboard/server.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 207
- Bytes: 5881
- Imports (internal): src/features/conversations/server.ts, src/features/approvals/server.ts, src/features/dashboard/server.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / conversations, src/features / approvals, src/features / dashboard, src/lib
- Defines: applyFilters, state, values, supabaseAdmin, query, rows, data, createClerkSupabaseClientFn, currentUserFn, getFeatureReadClientFn, user, role, … (+1 more)
- Tests / describe labels: getDashboardActionCenter, backfills reassigned campaign approvals on client action-center surfaces, does not fetch or expose CRM follow-ups in the action center
- Contents summary: tests/describes: getDashboardActionCenter; backfills reassigned campaign approvals on client action-center surfaces; does not fetch or expose CRM follow-ups in the action center; internal imports: 4; package imports: 2

## `__tests__/features/dashboard/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 120
- Bytes: 3240
- Imports (internal): src/features/dashboard/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / dashboard
- Defines: summary
- Tests / describe labels: buildDashboardOpsSummary, ranks campaigns by pending work and recent activity, uses urgent-item metrics for admin summaries
- Contents summary: tests/describes: buildDashboardOpsSummary; ranks campaigns by pending work and recent activity; uses urgent-item metrics for admin summaries; internal imports: 1; package imports: 1

## `__tests__/features/event-follow-up-items/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 272
- Bytes: 7560
- Imports (internal): src/features/event-follow-up-items/server.ts, src/lib/supabase.ts, src/lib/agent-dispatch.ts, src/features/notifications/workflow.ts, src/features/system-events/server.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / event-follow-up-items, src/lib, src/features / notifications, src/features / system-events
- Defines: applyFilters, buildClient, serviceState, userScopedState, values, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, … (+4 more)
- Tests / describe labels: event follow-up items read clients, prefers the Clerk-scoped client for shared event follow-up items, keeps admin viewers on the service role for shared event follow-up items
- Contents summary: tests/describes: event follow-up items read clients; prefers the Clerk-scoped client for shared event follow-up items; keeps admin viewers on the service role for shared event follow-up items; internal imports: 5; package imports: 2

## `__tests__/features/events/integration.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 88
- Bytes: 2569
- Imports (internal): src/features/events/server.ts, src/lib/supabase.ts, src/features/system-events/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / events, src/lib, src/features / system-events
- Symbol details: function makeChainable, const mockEventRows, const mockFollowUpRows
- Defines: makeChainable, mockEventRows, mockFollowUpRows, terminal, db, result, event, followUpsMetric
- Tests / describe labels: getEventOperationsSummary integration, returns complete event operations summary with events and metrics
- Contents summary: tests/describes: getEventOperationsSummary integration; returns complete event operations summary with events and metrics; internal imports: 3; package imports: 1

## `__tests__/features/events/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 259
- Bytes: 7620
- Imports (internal): src/features/events/server.ts, src/lib/supabase.ts, src/features/system-events/server.ts, src/features/dashboard/server.ts, src/features/agent-outcomes/server.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / events, src/lib, src/features / system-events, src/features / dashboard, src/features / agent-outcomes
- Symbol details: function makeEvent
- Defines: applyFilters, buildClient, makeEvent, serviceState, userScopedState, values, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, … (+5 more)
- Tests / describe labels: event read clients, prefers the Clerk-scoped client for client event summaries, keeps admin users on the service role for client event summaries
- Contents summary: tests/describes: event read clients; prefers the Clerk-scoped client for client event summaries; keeps admin users on the service role for client event summaries; internal imports: 5; package imports: 2

## `__tests__/features/events/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 75
- Bytes: 2005
- Imports (internal): src/features/events/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / events
- Defines: summary
- Tests / describe labels: event operations summary, ranks events with the most workflow pressure
- Contents summary: tests/describes: event operations summary; ranks events with the most workflow pressure; internal imports: 1; package imports: 1

## `__tests__/features/notifications/discussions.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 101
- Bytes: 3078
- Imports (internal): src/features/notifications/discussions.ts, src/features/notifications/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / notifications
- Defines: recipients
- Tests / describe labels: discussion notifications, notifies admins and shared client members for shared comments, limits admin-only comments to admins, creates comment notifications that deep-link to the parent entity
- Contents summary: tests/describes: discussion notifications; notifies admins and shared client members for shared comments; limits admin-only comments to admins; internal imports: 2; package imports: 1

## `__tests__/features/notifications/server.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 901
- Bytes: 27919
- Imports (internal): src/features/assets/server.ts, src/features/notifications/server.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / assets, src/features / notifications, src/lib
- Symbol details: const mockedListVisibleAssetIdsForScope
- Defines: applyFilters, state, userScopedState, values, supabaseAdmin, query, rows, data, userScopedSupabase, mockedListVisibleAssetIdsForScope, notifications, recipientIds
- Tests / describe labels: isRetiredCrmApprovalRow, detects CRM-backed approval rows from entity type or metadata, listNotificationsForUser, prefers the Clerk-scoped notifications client when it is available, does not fall back to the service role for non-admin client notification reads when the Clerk-scoped client is unavailable, filters scoped client notifications by campaign, event, asset, and approval context, keeps unscoped client-wide notifications when assigned scope is otherwise empty, enriches comment, follow-up, and approval notifications with direct route targets, … (+4 more)
- Contents summary: tests/describes: isRetiredCrmApprovalRow; detects CRM-backed approval rows from entity type or metadata; listNotificationsForUser; internal imports: 3; package imports: 2

## `__tests__/features/notifications/workflow.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 66
- Bytes: 1914
- Imports (internal): src/features/notifications/workflow.ts, src/features/notifications/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / notifications
- Defines: result
- Tests / describe labels: workflow assignment notifications, notifies assigned shared-workflow users, skips admin-only assignment notifications for non-admin assignees
- Contents summary: tests/describes: workflow assignment notifications; notifies assigned shared-workflow users; skips admin-only assignment notifications for non-admin assignees; internal imports: 2; package imports: 1

## `__tests__/features/operations-center/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 91
- Bytes: 2952
- Imports (internal): src/features/operations-center/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / operations-center
- Tests / describe labels: operations center summary, counts queued and untriaged agent outcomes as actionable follow-through
- Contents summary: tests/describes: operations center summary; counts queued and untriaged agent outcomes as actionable follow-through; internal imports: 1; package imports: 1

## `__tests__/features/reports/integration.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 182
- Bytes: 5540
- Imports (internal): src/features/reports/server.ts, src/lib/supabase.ts, src/lib/meta-campaigns.ts, src/features/client-portal/insights.ts
- Imports (packages): vitest
- Depends on groups: src/features / reports, src/lib, src/features / client-portal
- Symbol details: const mockEventData
- Defines: makeChain, mockEventData, methods, next, result, campaign, event
- Tests / describe labels: getReportsData integration, returns complete reports shape for a client slug, transforms campaign data correctly, transforms event data correctly, builds snapshots from dailyInsights filtered to matching campaign ids, sets dataSource to meta_api when no error, returns clients list from fetchAllCampaigns, filters campaigns by scope allowedCampaignIds
- Contents summary: tests/describes: getReportsData integration; returns complete reports shape for a client slug; transforms campaign data correctly; internal imports: 4; package imports: 1

## `__tests__/features/reports/read-clients.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 189
- Bytes: 5507
- Imports (internal): src/features/reports/server.ts, src/lib/supabase.ts, src/lib/meta-campaigns.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / reports, src/lib
- Symbol details: function makeEvent
- Defines: applyFilters, buildClient, makeEvent, serviceState, userScopedState, values, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, … (+4 more)
- Tests / describe labels: reports read clients, prefers the Clerk-scoped client for client report event reads, keeps admin report viewers on the service role for event reads
- Contents summary: tests/describes: reports read clients; prefers the Clerk-scoped client for client report event reads; keeps admin report viewers on the service role for event reads; internal imports: 3; package imports: 2

## `__tests__/features/reports/server.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 106
- Bytes: 2873
- Imports (internal): src/features/dashboard/server.ts, src/features/events/server.ts, src/features/agent-outcomes/server.ts, src/features/reports/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / dashboard, src/features / events, src/features / agent-outcomes, src/features / reports
- Tests / describe labels: getReportsWorkflowData, passes client scope through to workflow loaders, uses admin audience for admin report surfaces
- Contents summary: tests/describes: getReportsWorkflowData; passes client scope through to workflow loaders; uses admin audience for admin report surfaces; internal imports: 4; package imports: 1

## `__tests__/features/reports/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 88
- Bytes: 1955
- Imports (internal): src/features/reports/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / reports
- Symbol details: function makeCampaign, function makeEvent
- Defines: makeCampaign, makeEvent, summary, ReportsCampaignCard, ReportsEventCard
- Tests / describe labels: buildReportsSummary, aggregates spend, revenue, ROAS, and ticket totals
- Contents summary: tests/describes: buildReportsSummary; aggregates spend, revenue, ROAS, and ticket totals; internal imports: 1; package imports: 1

## `__tests__/features/settings/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 114
- Bytes: 3729
- Imports (internal): src/features/settings/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / settings
- Defines: now, summary
- Tests / describe labels: buildPlatformSettingsSummary, builds integration and setup pressure metrics
- Contents summary: tests/describes: buildPlatformSettingsSummary; builds integration and setup pressure metrics; internal imports: 1; package imports: 1

## `__tests__/features/shared/admin-summary-types.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 11
- Bytes: 382
- Imports (internal): src/features/shared/admin-summary-types.ts
- Imports (packages): vitest
- Depends on groups: src/features / shared
- Tests / describe labels: admin summary shared types module, exports shared admin summary contracts for feature modules
- Contents summary: tests/describes: admin summary shared types module; exports shared admin summary contracts for feature modules; internal imports: 1; package imports: 1

## `__tests__/features/system-events/list.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 212
- Bytes: 5977
- Imports (internal): src/features/system-events/server.ts, src/features/assets/server.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / system-events, src/features / assets, src/lib
- Defines: applyFilters, buildClient, serviceState, userScopedState, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, getFeatureReadClientFn, … (+3 more)
- Tests / describe labels: listSystemEvents, prefers the Clerk-scoped client for client-scoped event lists, keeps admin viewers on the service role for client-scoped event lists
- Contents summary: tests/describes: listSystemEvents; prefers the Clerk-scoped client for client-scoped event lists; keeps admin viewers on the service role for client-scoped event lists; internal imports: 3; package imports: 2

## `__tests__/features/system-events/scope-filter.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 103
- Bytes: 2794
- Imports (internal): src/features/system-events/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / system-events
- Symbol details: function makeEvent
- Defines: makeEvent, filtered
- Tests / describe labels: filterSystemEventsByScope, keeps events that match allowed campaign or event ids, preserves unscoped shared events when no campaign or event context exists, blocks scoped asset and campaign events when the assigned scope is empty
- Contents summary: tests/describes: filterSystemEventsByScope; keeps events that match allowed campaign or event ids; preserves unscoped shared events when no campaign or event context exists; internal imports: 1; package imports: 1

## `__tests__/features/users/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 101
- Bytes: 2881
- Imports (internal): src/features/users/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / users
- Defines: summary
- Tests / describe labels: buildUsersAccessSummary, surfaces pending invites, unassigned client users, and weak client coverage
- Contents summary: tests/describes: buildUsersAccessSummary; surfaces pending invites, unassigned client users, and weak client coverage; internal imports: 1; package imports: 1
