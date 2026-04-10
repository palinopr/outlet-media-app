# Test Coverage Map

Generated from the current working tree on 2026-04-10 16:45:57.

This page maps code files to the exact direct and transitive tests currently linked through imports.

## agent / root
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `agent/vitest.config.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## agent / scripts
- Code files: 3
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 3

### `agent/scripts/growth-ledger.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `agent/scripts/tm1-crawl-capabilities.mjs`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `agent/scripts/tm1-map-source-maps.mjs`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: agent/scripts/tm1-crawl-capabilities.mjs

## agent/src / discord
- Code files: 3
- With direct test links: 2
- With transitive test links: 3
- With no linked tests: 0

### `agent/src/discord/commands/slash.ts`
- Direct tests: none
- All linked tests: agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts

### `agent/src/discord/core/entry.ts`
- Direct tests: agent/src/events/message-handler.test.ts
- All linked tests: agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/commands/slash.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts

### `agent/src/discord/core/router.ts`
- Direct tests: agent/src/events/message-handler.test.ts
- All linked tests: agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts

## agent/src / events
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `agent/src/events/message-handler.ts`
- Direct tests: agent/src/events/message-handler.test.ts
- All linked tests: agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts

## agent/src / root
- Code files: 2
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 1

### `agent/src/index.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `agent/src/runner.ts`
- Direct tests: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts
- All linked tests: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts

## agent/src / services
- Code files: 6
- With direct test links: 5
- With transitive test links: 6
- With no linked tests: 0

### `agent/src/services/queue-service.ts`
- Direct tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts
- All linked tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts

### `agent/src/services/runtime-state-service.ts`
- Direct tests: agent/src/services/runtime-state-service.test.ts
- All linked tests: agent/src/services/runtime-state-service.test.ts, agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/runtime-state-service.test.ts

### `agent/src/services/supabase-service.ts`
- Direct tests: none
- All linked tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/services/system-events-service.ts

### `agent/src/services/system-events-service.ts`
- Direct tests: agent/src/services/queue-service.test.ts
- All linked tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts

### `agent/src/services/web-task-executor.ts`
- Direct tests: agent/src/services/web-task-executor.test.ts
- All linked tests: agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/web-task-executor.test.ts

### `agent/src/services/webhook-service.ts`
- Direct tests: agent/src/events/message-handler.test.ts
- All linked tests: agent/src/events/message-handler.test.ts
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts

## agent/src / utils
- Code files: 4
- With direct test links: 0
- With transitive test links: 1
- With no linked tests: 3

### `agent/src/utils/date-helpers.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: agent/src/utils/session-loader.ts

### `agent/src/utils/error-helpers.ts`
- Direct tests: none
- All linked tests: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/queue-service.test.ts
- Route owners: none
- Imported by: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.ts, agent/src/services/queue-service.ts, agent/src/services/system-events-service.ts, agent/src/services/webhook-service.ts

### `agent/src/utils/prompt-formatters.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `agent/src/utils/session-loader.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: agent/src/utils/prompt-formatters.ts

## Root Mocks
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `__mocks__/discord-stub.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## Root Files
- Code files: 6
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 6

### `eslint.config.mjs`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `next-env.d.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `next.config.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `postcss.config.mjs`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `vitest.config.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `vitest.setup.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/app / admin
- Code files: 44
- With direct test links: 19
- With transitive test links: 26
- With no linked tests: 18

### `src/app/admin/actions/audit.ts`
- Direct tests: src/app/admin/actions/campaign-action-items.test.ts
- All linked tests: src/app/admin/actions/campaign-action-items.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/users.ts

### `src/app/admin/actions/campaign-action-items.ts`
- Direct tests: src/app/admin/actions/campaign-action-items.test.ts
- All linked tests: src/app/admin/actions/campaign-action-items.test.ts
- Route owners: none
- Imported by: src/app/admin/actions/campaign-action-items.test.ts

### `src/app/admin/actions/campaigns.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx

### `src/app/admin/actions/clients.revalidation.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/actions/clients.ts`
- Direct tests: src/components/admin/clients/client-detail.test.tsx
- All linked tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/client-onboard-form.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-detail.test.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/role-select.tsx, … (+1 more)

### `src/app/admin/actions/event-follow-up-items.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/actions/events.ts`
- Direct tests: none
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Imported by: src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/events/event-table.tsx

### `src/app/admin/actions/meta-sync.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts

### `src/app/admin/actions/search.ts`
- Direct tests: src/app/admin/actions/search.test.ts
- All linked tests: src/app/admin/actions/search.test.ts
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/actions/search.test.ts, src/components/admin/command-palette.tsx

### `src/app/admin/actions/users.ts`
- Direct tests: src/components/admin/users/revoke-invitation-button.test.tsx
- All linked tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/users/user-table.tsx

### `src/app/admin/agents/data.ts`
- Direct tests: src/components/admin/agents/job-history.test.tsx
- All linked tests: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/command-summary.test.tsx
- Route owners: src/app/admin/agents/page.tsx
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/job-history.test.tsx, src/components/admin/agents/job-history.tsx

### `src/app/admin/agents/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/agents/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/agents/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

### `src/app/admin/campaigns/[campaignId]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/campaigns/data.ts`
- Direct tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/campaigns/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/campaigns/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/campaigns/page.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/clients/[id]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/clients/data.ts`
- Direct tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/data.test.ts, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/campaigns-section.tsx, … (+5 more)

### `src/app/admin/clients/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/clients/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/clients/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

### `src/app/admin/clients/types.ts`
- Direct tests: none
- All linked tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/data.ts

### `src/app/admin/dashboard/campaign-cards.tsx`
- Direct tests: none
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx

### `src/app/admin/dashboard/data.ts`
- Direct tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/dashboard/upcoming-shows.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/dashboard/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/dashboard/events-preview-table.tsx`
- Direct tests: none
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx

### `src/app/admin/dashboard/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/dashboard/page.tsx`
- Direct tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/dashboard/upcoming-shows.tsx`
- Direct tests: none
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx

### `src/app/admin/events/[eventId]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/events/data.ts`
- Direct tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/events/page.tsx
- Imported by: src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/events/columns.tsx, src/components/admin/events/event-table.tsx

### `src/app/admin/events/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/events/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/events/page.tsx`
- Direct tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/layout.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/reports/page.tsx`
- Direct tests: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/settings/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

### `src/app/admin/users/data.ts`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/users/columns.tsx, src/components/admin/users/user-table.tsx

### `src/app/admin/users/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/users/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/users/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

## src/app / api
- Code files: 28
- With direct test links: 17
- With transitive test links: 20
- With no linked tests: 8

### `src/app/api/admin/activity/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/admin/invite/route.ts`
- Direct tests: src/app/api/admin/invite/route.test.ts
- All linked tests: src/app/api/admin/invite/route.test.ts
- Route owners: none
- Imported by: src/app/api/admin/invite/route.test.ts

### `src/app/api/admin/users/[id]/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/agent-outcomes/action-item/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/agents/email/watch/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/agents/heartbeat/route.ts`
- Direct tests: __tests__/api/agents-heartbeat.test.ts
- All linked tests: __tests__/api/agents-heartbeat.test.ts
- Route owners: none
- Imported by: __tests__/api/agents-heartbeat.test.ts

### `src/app/api/agents/job/[id]/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/agents/jobs/route.ts`
- Direct tests: __tests__/api/agents-jobs.test.ts
- All linked tests: __tests__/api/agents-jobs.test.ts
- Route owners: none
- Imported by: __tests__/api/agents-jobs.test.ts

### `src/app/api/agents/route.ts`
- Direct tests: __tests__/api/agents.test.ts
- All linked tests: __tests__/api/agents.test.ts
- Route owners: none
- Imported by: __tests__/api/agents.test.ts

### `src/app/api/alerts/route.ts`
- Direct tests: __tests__/api/alerts.test.ts
- All linked tests: __tests__/api/alerts.test.ts
- Route owners: none
- Imported by: __tests__/api/alerts.test.ts

### `src/app/api/campaign-comments/action-item/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/campaign-comments/route.ts`
- Direct tests: src/app/api/campaign-comments/route.test.ts
- All linked tests: src/app/api/campaign-comments/route.test.ts
- Route owners: none
- Imported by: src/app/api/campaign-comments/route.test.ts

### `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
- Direct tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- All linked tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Route owners: none
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts

### `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
- Direct tests: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- All linked tests: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Route owners: none
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts

### `src/app/api/client/[slug]/agent/threads/route.ts`
- Direct tests: src/app/api/client/[slug]/agent/threads/route.test.ts
- All linked tests: src/app/api/client/[slug]/agent/threads/route.test.ts
- Route owners: none
- Imported by: src/app/api/client/[slug]/agent/threads/route.test.ts

### `src/app/api/contact/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/event-comments/route.ts`
- Direct tests: src/app/api/event-comments/route.test.ts
- All linked tests: src/app/api/event-comments/route.test.ts
- Route owners: none
- Imported by: src/app/api/event-comments/route.test.ts

### `src/app/api/health/route.ts`
- Direct tests: src/app/api/health/route.test.ts
- All linked tests: src/app/api/health/route.test.ts
- Route owners: none
- Imported by: src/app/api/health/route.test.ts

### `src/app/api/ingest/ingest-meta-campaigns.ts`
- Direct tests: none
- All linked tests: __tests__/api/ingest.test.ts
- Route owners: src/app/api/ingest/route.ts
- Imported by: src/app/api/ingest/route.ts

### `src/app/api/ingest/ingest-tm-demographics.ts`
- Direct tests: none
- All linked tests: __tests__/api/ingest.test.ts
- Route owners: src/app/api/ingest/route.ts
- Imported by: src/app/api/ingest/route.ts

### `src/app/api/ingest/ingest-tm-events.ts`
- Direct tests: none
- All linked tests: __tests__/api/ingest.test.ts
- Route owners: src/app/api/ingest/route.ts
- Imported by: src/app/api/ingest/route.ts

### `src/app/api/ingest/route.ts`
- Direct tests: __tests__/api/ingest.test.ts
- All linked tests: __tests__/api/ingest.test.ts
- Route owners: none
- Imported by: __tests__/api/ingest.test.ts

### `src/app/api/meta/callback/route.ts`
- Direct tests: src/app/api/meta/callback/route.test.ts
- All linked tests: src/app/api/meta/callback/route.test.ts
- Route owners: none
- Imported by: src/app/api/meta/callback/route.test.ts

### `src/app/api/meta/data-deletion/route.ts`
- Direct tests: src/app/api/meta/data-deletion/route.test.ts
- All linked tests: src/app/api/meta/data-deletion/route.test.ts
- Route owners: none
- Imported by: src/app/api/meta/data-deletion/route.test.ts

### `src/app/api/ticketmaster/tm1/move-selection/route.ts`
- Direct tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- All linked tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Route owners: none
- Imported by: src/app/api/ticketmaster/tm1/move-selection/route.test.ts

### `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
- Direct tests: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- All linked tests: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Route owners: none
- Imported by: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts

### `src/app/api/ticketmaster/tm1/snapshot/route.ts`
- Direct tests: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- All linked tests: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Route owners: none
- Imported by: src/app/api/ticketmaster/tm1/snapshot/route.test.ts

### `src/app/api/user/profile/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/app / client
- Code files: 50
- With direct test links: 22
- With transitive test links: 31
- With no linked tests: 19

### `src/app/client/[slug]/agent/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/agent/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/agent/page.tsx`
- Direct tests: src/app/client/[slug]/agent/page.test.tsx
- All linked tests: src/app/client/[slug]/agent/page.test.tsx
- Route owners: none
- Imported by: src/app/client/[slug]/agent/page.test.tsx

### `src/app/client/[slug]/campaign/[campaignId]/data.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/features/client-portal/campaign-detail.ts

### `src/app/client/[slug]/campaign/[campaignId]/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaign/[campaignId]/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/campaigns/campaigns-table.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/app/client/[slug]/campaigns/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaigns/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaigns/page.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/components/audience-section.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/client/[slug]/event/[eventId]/page.tsx

### `src/app/client/[slug]/components/campaign-card.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/app/client/[slug]/components/campaign-section.tsx

### `src/app/client/[slug]/components/campaign-detail-header.tsx`
- Direct tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx
- All linked tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx

### `src/app/client/[slug]/components/campaign-discussion-form.tsx`
- Direct tests: src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx
- All linked tests: src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.tsx

### `src/app/client/[slug]/components/campaign-operating-panel.tsx`
- Direct tests: src/app/client/[slug]/components/campaign-operating-panel.test.tsx
- All linked tests: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx

### `src/app/client/[slug]/components/campaign-section.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/components/campaign-status-badge.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx

### `src/app/client/[slug]/components/client-nav.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.tsx

### `src/app/client/[slug]/components/client-portal-footer.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx

### `src/app/client/[slug]/components/complete-profile-modal.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.tsx

### `src/app/client/[slug]/components/date-range-picker.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/components/event-card.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/events/page.tsx
- Imported by: src/app/client/[slug]/events/events-filter.tsx

### `src/app/client/[slug]/components/event-discussion-form.tsx`
- Direct tests: src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx
- All linked tests: src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.tsx

### `src/app/client/[slug]/components/event-operating-panel.tsx`
- Direct tests: src/app/client/[slug]/components/event-operating-panel.test.tsx
- All linked tests: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx

### `src/app/client/[slug]/components/event-status-badge.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/events/page.test.tsx
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx
- Imported by: src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/event/[eventId]/page.tsx

### `src/app/client/[slug]/components/insights-panel.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/app/client/[slug]/components/mobile-nav.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.tsx

### `src/app/client/[slug]/components/nav-config.ts`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx

### `src/app/client/[slug]/components/progress-bar.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/events/page.test.tsx
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx
- Imported by: src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/event/[eventId]/page.tsx

### `src/app/client/[slug]/components/stat-card.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/data.ts`
- Direct tests: __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx
- All linked tests: __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Route owners: src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/events/page.tsx

### `src/app/client/[slug]/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/event/[eventId]/data.ts`
- Direct tests: __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- All linked tests: __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, … (+5 more)
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/features/client-portal/event-detail.ts

### `src/app/client/[slug]/event/[eventId]/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/event/[eventId]/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/event/[eventId]/page.tsx`
- Direct tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/events/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/events/events-filter.tsx`
- Direct tests: src/app/client/[slug]/events/page.test.tsx
- All linked tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/events/page.tsx
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/events/page.tsx

### `src/app/client/[slug]/events/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/events/page.tsx`
- Direct tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/layout.tsx`
- Direct tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/lib.ts`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, __tests__/app/client/data.test.ts, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, … (+12 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Imported by: src/app/admin/dashboard/data.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/campaign-status-badge.tsx, … (+5 more)

### `src/app/client/[slug]/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/page.tsx`
- Direct tests: src/app/client/[slug]/page.test.tsx
- All linked tests: src/app/client/[slug]/page.test.tsx
- Route owners: none
- Imported by: src/app/client/[slug]/page.test.tsx

### `src/app/client/[slug]/reports/page.tsx`
- Direct tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/types.ts`
- Direct tests: src/app/client/[slug]/lib.test.ts
- All linked tests: src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, __tests__/app/client/data.test.ts, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+11 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/campaign-section.tsx, src/app/client/[slug]/components/event-card.tsx, … (+8 more)

### `src/app/client/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/pending/layout.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/pending/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/app / root routes
- Code files: 11
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 10

### `src/app/connect-error/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/deletion-status/[code]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/global-error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/landing/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/layout.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/not-found.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/privacy/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/sign-in/[[...sign-in]]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/sign-up/[[...sign-up]]/page.tsx`
- Direct tests: src/app/sign-up/invite-flow.test.tsx
- All linked tests: src/app/sign-up/invite-flow.test.tsx
- Route owners: none
- Imported by: src/app/sign-up/invite-flow.test.tsx

### `src/app/terms/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/components / admin
- Code files: 54
- With direct test links: 12
- With transitive test links: 45
- With no linked tests: 9

### `src/components/admin/activity-tracker.tsx`
- Direct tests: src/components/admin/activity-tracker.test.ts
- All linked tests: src/components/admin/activity-tracker.test.ts
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx, src/components/admin/activity-tracker.test.ts

### `src/components/admin/agents/agent-sidebar.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: src/app/admin/agents/page.tsx

### `src/components/admin/agents/chat-panel.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: src/app/admin/agents/page.tsx

### `src/components/admin/agents/command-summary.tsx`
- Direct tests: src/components/admin/agents/command-summary.test.tsx
- All linked tests: src/components/admin/agents/command-summary.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/command-summary.test.tsx

### `src/components/admin/agents/constants.ts`
- Direct tests: src/components/admin/agents/constants.test.ts
- All linked tests: src/components/admin/agents/constants.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/agents/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/constants.test.ts, src/components/admin/agents/job-history.tsx

### `src/components/admin/agents/job-history.tsx`
- Direct tests: src/components/admin/agents/job-history.test.tsx
- All linked tests: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/job-history.test.tsx

### `src/components/admin/agents/status-badge.tsx`
- Direct tests: none
- All linked tests: src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/job-history.tsx

### `src/components/admin/breadcrumbs.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/campaigns/campaign-cells.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/columns.tsx

### `src/components/admin/campaigns/campaign-detail-dashboard.tsx`
- Direct tests: src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- All linked tests: src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx

### `src/components/admin/campaigns/campaign-table.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx

### `src/components/admin/campaigns/client-filter.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx

### `src/components/admin/campaigns/columns.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-table.tsx

### `src/components/admin/campaigns/date-range-filter.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx

### `src/components/admin/client-onboard-form.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx
- Imported by: src/app/admin/settings/page.tsx

### `src/components/admin/clients/assignment-manager.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/clients/campaigns-section.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-detail.tsx

### `src/components/admin/clients/client-detail.tsx`
- Direct tests: src/components/admin/clients/client-detail.test.tsx
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/clients/[id]/page.tsx, src/components/admin/clients/client-detail.test.tsx

### `src/components/admin/clients/client-overview-tab.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-detail.tsx

### `src/components/admin/clients/client-table.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/app/admin/clients/page.tsx

### `src/components/admin/clients/columns.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/client-table.tsx

### `src/components/admin/clients/events-section.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-detail.tsx

### `src/components/admin/clients/invite-member-form.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/clients/members-section.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-detail.tsx

### `src/components/admin/clients/role-select.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/clients/saving-select.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx

### `src/components/admin/clients/scope-select.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/collapsible-sidebar.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/command-palette.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/confirm-dialog.tsx`
- Direct tests: none
- All linked tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.tsx

### `src/components/admin/copy-button.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/columns.tsx

### `src/components/admin/data-table/column-header.tsx`
- Direct tests: none
- All linked tests: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/agents/job-history.tsx, src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/users/columns.tsx

### `src/components/admin/data-table/data-table-pagination.tsx`
- Direct tests: none
- All linked tests: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/agents/job-history.tsx, src/components/admin/data-table/data-table.tsx

### `src/components/admin/data-table/data-table-toolbar.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/data-table/data-table.tsx

### `src/components/admin/data-table/data-table.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/events/event-table.tsx, src/components/admin/users/user-table.tsx

### `src/components/admin/data-table/select-column.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/users/columns.tsx

### `src/components/admin/error-boundary.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/app/admin/agents/error.tsx, src/app/admin/campaigns/error.tsx, src/app/admin/clients/error.tsx, src/app/admin/dashboard/error.tsx, src/app/admin/events/error.tsx, src/app/admin/users/error.tsx

### `src/components/admin/events/columns.tsx`
- Direct tests: none
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/events/page.tsx
- Imported by: src/components/admin/events/event-table.tsx

### `src/components/admin/events/event-cells.tsx`
- Direct tests: none
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Imported by: src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx

### `src/components/admin/events/event-operating-panel.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/events/[eventId]/page.tsx
- Imported by: src/app/admin/events/[eventId]/page.tsx

### `src/components/admin/events/event-table.tsx`
- Direct tests: src/app/admin/events/page.test.tsx
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/events/page.tsx
- Imported by: src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx

### `src/components/admin/inline-edit.tsx`
- Direct tests: none
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx
- Imported by: src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx

### `src/components/admin/mobile-sidebar.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/nav-config.ts`
- Direct tests: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts
- All linked tests: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/activity-tracker.test.ts, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/nav-config.test.ts, src/components/admin/nav-links.tsx

### `src/components/admin/nav-links.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/sidebar-content.tsx

### `src/components/admin/page-header.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/admin/reports/page.test.tsx
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, … (+1 more)
- Imported by: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, … (+1 more)

### `src/components/admin/run-button.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: src/components/admin/agents/agent-sidebar.tsx

### `src/components/admin/sidebar-content.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/collapsible-sidebar.tsx, src/components/admin/mobile-sidebar.tsx

### `src/components/admin/stat-card.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/components/stat-card.tsx, … (+1 more)

### `src/components/admin/status-select.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/users/columns.tsx

### `src/components/admin/user-avatar.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/sidebar-content.tsx

### `src/components/admin/users/columns.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: src/components/admin/users/user-table.tsx

### `src/components/admin/users/revoke-invitation-button.tsx`
- Direct tests: src/components/admin/users/revoke-invitation-button.test.tsx
- All linked tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx

### `src/components/admin/users/user-table.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: src/app/admin/users/page.tsx

## src/components / charts
- Code files: 2
- With direct test links: 1
- With transitive test links: 2
- With no linked tests: 0

### `src/components/charts/roas-trend-chart.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/components/charts/ticket-velocity-chart.tsx`
- Direct tests: none
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx

## src/components / client
- Code files: 17
- With direct test links: 0
- With transitive test links: 15
- With no linked tests: 2

### `src/components/client/ads-preview.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx

### `src/components/client/charts/age-distribution-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/age-gender-heatmap.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/audience-demographics.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/daily-sales-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/gender-donut-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/index.ts`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx

### `src/components/client/charts/market-charts.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/performance-trend-tabs.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/placement-bar-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/placement-charts.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/ticket-sales-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/time-charts.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/types.ts`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/daily-sales-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/index.ts, src/components/client/charts/market-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, … (+4 more)

### `src/components/client/error-boundary.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/app/client/[slug]/agent/error.tsx, src/app/client/[slug]/campaign/[campaignId]/error.tsx, src/app/client/[slug]/campaigns/error.tsx, src/app/client/[slug]/error.tsx, src/app/client/[slug]/event/[eventId]/error.tsx, src/app/client/[slug]/events/error.tsx

### `src/components/client/loading-skeleton.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/loading.tsx
- Imported by: src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/loading.tsx

### `src/components/client/platform-icons.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/components/client/charts/placement-charts.tsx

## src/components / landing
- Code files: 9
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 9

### `src/components/landing/contact-form.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/credibility.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/faq.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/features.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/footer.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/components/landing/hero.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/how-it-works.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/nav.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/components/landing/stats.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/components / shared
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `src/components/shared/error-boundary.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/components/admin/error-boundary.tsx, src/components/client/error-boundary.tsx

## src/components / ui
- Code files: 13
- With direct test links: 0
- With transitive test links: 9
- With no linked tests: 4

### `src/components/ui/badge.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/components/admin/agents/command-summary.test.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/agents/page.tsx
- Imported by: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/components/admin/agents/command-summary.tsx

### `src/components/ui/breadcrumb.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/breadcrumbs.tsx

### `src/components/ui/button.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/events/page.test.tsx, src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/layout.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, … (+2 more)
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/client/[slug]/layout.tsx, src/app/admin/clients/page.tsx, … (+7 more)
- Imported by: src/app/admin/agents/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/components/campaign-discussion-form.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/[slug]/components/event-discussion-form.tsx, src/app/client/page.tsx, … (+19 more)

### `src/components/ui/card.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/loading.tsx, … (+7 more)
- Imported by: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/loading.tsx, … (+14 more)

### `src/components/ui/command.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/command-palette.tsx

### `src/components/ui/dialog.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/layout.tsx
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/ui/command.tsx

### `src/components/ui/dropdown-menu.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx
- Imported by: src/components/admin/clients/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/users/columns.tsx

### `src/components/ui/input.tsx`
- Direct tests: none
- All linked tests: src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/agents/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/landing/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx, … (+1 more)
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/agents/job-history.tsx, src/components/admin/client-onboard-form.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/landing/contact-form.tsx

### `src/components/ui/sheet.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/layout.tsx
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/mobile-sidebar.tsx

### `src/components/ui/skeleton.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/events/loading.tsx, src/app/admin/users/loading.tsx, src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, … (+4 more)
- Imported by: src/app/admin/agents/loading.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/events/loading.tsx, src/app/admin/users/loading.tsx, src/components/client/loading-skeleton.tsx

### `src/components/ui/switch.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-overview-tab.tsx

### `src/components/ui/table.tsx`
- Direct tests: none
- All linked tests: src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/agents/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/dashboard/events-preview-table.tsx, src/components/admin/agents/job-history.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/events-section.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/data-table/data-table.tsx

### `src/components/ui/tooltip.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/nav-links.tsx

## src/features / access
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/access/revalidation.ts`
- Direct tests: __tests__/features/access/revalidation.test.ts
- All linked tests: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: __tests__/features/access/revalidation.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts

## src/features / agent-outcomes
- Code files: 2
- With direct test links: 2
- With transitive test links: 2
- With no linked tests: 0

### `src/features/agent-outcomes/server.ts`
- Direct tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts
- All linked tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+16 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Imported by: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/agents/data.ts, src/app/api/agent-outcomes/action-item/route.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, … (+1 more)

### `src/features/agent-outcomes/summary.ts`
- Direct tests: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts
- All linked tests: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/agents/summary.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/operations-center/summary.test.ts, … (+19 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Imported by: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/app/api/agent-outcomes/action-item/route.ts, src/components/admin/agents/command-summary.tsx, src/features/agent-outcomes/server.ts, src/features/agents/summary.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, … (+2 more)

## src/features / agents
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/agents/summary.ts`
- Direct tests: __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- All linked tests: __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: __tests__/features/agents/summary.test.ts, src/app/admin/agents/data.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/command-summary.tsx

## src/features / approvals
- Code files: 2
- With direct test links: 2
- With transitive test links: 2
- With no linked tests: 0

### `src/features/approvals/server.ts`
- Direct tests: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts
- All linked tests: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, … (+18 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Imported by: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/features/approvals/summary.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts, … (+2 more)

### `src/features/approvals/summary.ts`
- Direct tests: __tests__/features/approvals/summary.test.ts
- All linked tests: __tests__/features/approvals/summary.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, … (+18 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Imported by: __tests__/features/approvals/summary.test.ts, src/features/approvals/server.ts

## src/features / asset-follow-up-items
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `src/features/asset-follow-up-items/server.ts`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/api/agent-outcomes/action-item/route.ts
- Imported by: src/app/api/agent-outcomes/action-item/route.ts

## src/features / assets
- Code files: 3
- With direct test links: 1
- With transitive test links: 3
- With no linked tests: 0

### `src/features/assets/lib.ts`
- Direct tests: none
- All linked tests: src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: src/features/campaigns/server.ts

### `src/features/assets/server.ts`
- Direct tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts
- All linked tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+36 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, … (+6 more)
- Imported by: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, src/features/agent-outcomes/server.ts, … (+4 more)

### `src/features/assets/types.ts`
- Direct tests: none
- All linked tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, … (+36 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, … (+6 more)
- Imported by: src/features/assets/lib.ts, src/features/assets/server.ts

## src/features / campaign-action-items
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/campaign-action-items/server.ts`
- Direct tests: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts
- All linked tests: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/features/campaign-action-items/server.test.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts

## src/features / campaign-comments
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/campaign-comments/server.ts`
- Direct tests: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts
- All linked tests: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts

## src/features / campaigns
- Code files: 3
- With direct test links: 3
- With transitive test links: 3
- With no linked tests: 0

### `src/features/campaigns/client-operating.ts`
- Direct tests: src/app/client/[slug]/components/campaign-operating-panel.test.tsx
- All linked tests: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.tsx

### `src/features/campaigns/ownership-sync.ts`
- Direct tests: src/features/campaigns/ownership-sync.test.ts
- All linked tests: src/features/campaigns/ownership-sync.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, … (+6 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/ownership-sync.test.ts, src/features/notifications/server.ts

### `src/features/campaigns/server.ts`
- Direct tests: src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- All linked tests: src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx

## src/features / client-agent
- Code files: 19
- With direct test links: 17
- With transitive test links: 19
- With no linked tests: 0

### `src/features/client-agent/components/agent-shell.tsx`
- Direct tests: src/features/client-agent/components/agent-shell.test.tsx
- All linked tests: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/client/[slug]/agent/page.tsx
- Imported by: src/app/client/[slug]/agent/page.tsx, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx

### `src/features/client-agent/components/conversation-pane.tsx`
- Direct tests: none
- All linked tests: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/components/agent-shell.tsx

### `src/features/client-agent/components/thread-list.tsx`
- Direct tests: none
- All linked tests: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/components/agent-shell.tsx

### `src/features/client-agent/model.ts`
- Direct tests: src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts
- All linked tests: src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts

### `src/features/client-agent/policy.ts`
- Direct tests: src/features/client-agent/policy.test.ts
- All linked tests: src/features/client-agent/policy.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/policy.test.ts, src/features/client-agent/runtime.ts

### `src/features/client-agent/range.ts`
- Direct tests: src/features/client-agent/range.test.ts
- All linked tests: src/features/client-agent/range.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/range.test.ts, src/features/client-agent/runtime.ts, src/features/client-agent/tools/search.ts

### `src/features/client-agent/readers.ts`
- Direct tests: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts
- All linked tests: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+2 more)
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/overview.ts, … (+2 more)

### `src/features/client-agent/runtime.ts`
- Direct tests: src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts
- All linked tests: src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/model.test.ts, src/features/client-agent/model.ts, src/features/client-agent/runtime.test.ts

### `src/features/client-agent/server.ts`
- Direct tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- All linked tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, … (+1 more)

### `src/features/client-agent/store.ts`
- Direct tests: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts
- All linked tests: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/store.test.ts

### `src/features/client-agent/thread-context.ts`
- Direct tests: src/features/client-agent/thread-context.test.ts
- All linked tests: src/features/client-agent/thread-context.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/runtime.ts, src/features/client-agent/server.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.test.ts

### `src/features/client-agent/tool-contracts.ts`
- Direct tests: src/features/client-agent/tool-contracts.test.ts
- All linked tests: src/features/client-agent/tool-contracts.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, … (+3 more)
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/runtime.ts, src/features/client-agent/tool-contracts.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.ts, src/features/client-agent/tools/search.ts

### `src/features/client-agent/tools/breakdowns.ts`
- Direct tests: src/features/client-agent/tools/breakdowns.test.ts
- All linked tests: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/index.ts

### `src/features/client-agent/tools/compare-timeseries.ts`
- Direct tests: src/features/client-agent/tools/compare-timeseries.test.ts
- All linked tests: src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/index.ts

### `src/features/client-agent/tools/details.ts`
- Direct tests: src/features/client-agent/tools/details.test.ts
- All linked tests: src/features/client-agent/tools/details.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/index.ts

### `src/features/client-agent/tools/index.ts`
- Direct tests: src/features/client-agent/runtime.test.ts
- All linked tests: src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/runtime.test.ts, src/features/client-agent/runtime.ts

### `src/features/client-agent/tools/overview.ts`
- Direct tests: src/features/client-agent/tools/overview.test.ts
- All linked tests: src/features/client-agent/tools/overview.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/tools/index.ts, src/features/client-agent/tools/overview.test.ts

### `src/features/client-agent/tools/search.ts`
- Direct tests: src/features/client-agent/tools/search.test.ts
- All linked tests: src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/tools/index.ts, src/features/client-agent/tools/search.test.ts

### `src/features/client-agent/types.ts`
- Direct tests: src/features/client-agent/store.test.ts
- All linked tests: src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/range.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/model.test.ts, … (+7 more)
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/range.ts, src/features/client-agent/readers.ts, src/features/client-agent/runtime.ts, src/features/client-agent/server.ts, src/features/client-agent/store.test.ts, src/features/client-agent/store.ts, … (+7 more)

## src/features / client-portal
- Code files: 9
- With direct test links: 6
- With transitive test links: 9
- With no linked tests: 0

### `src/features/client-portal/access.ts`
- Direct tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts
- All linked tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+1 more)
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+1 more)
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.test.tsx, … (+6 more)

### `src/features/client-portal/campaign-detail.ts`
- Direct tests: none
- All linked tests: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+2 more)
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/readers.ts

### `src/features/client-portal/config.ts`
- Direct tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts
- All linked tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, … (+3 more)
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, … (+2 more)
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, … (+1 more)

### `src/features/client-portal/entry.ts`
- Direct tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts
- All linked tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, … (+3 more)
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, … (+4 more)
- Imported by: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.test.ts

### `src/features/client-portal/event-detail.ts`
- Direct tests: none
- All linked tests: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+2 more)
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/readers.ts

### `src/features/client-portal/insights.ts`
- Direct tests: __tests__/features/reports/integration.test.ts
- All linked tests: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+17 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Imported by: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/lib.ts, src/features/reports/server.ts

### `src/features/client-portal/scope.ts`
- Direct tests: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- All linked tests: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, … (+11 more)
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/features/campaigns/client-operating.ts, … (+1 more)

### `src/features/client-portal/theme.ts`
- Direct tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts
- All linked tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/theme.test.ts

### `src/features/client-portal/types.ts`
- Direct tests: none
- All linked tests: src/app/client/[slug]/lib.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, … (+17 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/dashboard/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Imported by: src/app/client/[slug]/types.ts, src/features/client-portal/insights.ts, src/features/reports/server.ts

## src/features / clients
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/clients/summary.ts`
- Direct tests: __tests__/features/clients/summary.test.ts
- All linked tests: __tests__/features/clients/summary.test.ts, src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: __tests__/features/clients/summary.test.ts, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx

## src/features / conversations
- Code files: 2
- With direct test links: 1
- With transitive test links: 2
- With no linked tests: 0

### `src/features/conversations/server.ts`
- Direct tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts
- All linked tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/features/dashboard/server.ts

### `src/features/conversations/summary.ts`
- Direct tests: none
- All linked tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/conversations/server.ts, src/features/dashboard/server.ts

## src/features / dashboard
- Code files: 2
- With direct test links: 2
- With transitive test links: 2
- With no linked tests: 0

### `src/features/dashboard/server.ts`
- Direct tests: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts
- All linked tests: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+12 more)
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/features/reports/server.ts

### `src/features/dashboard/summary.ts`
- Direct tests: __tests__/features/dashboard/summary.test.ts
- All linked tests: __tests__/features/dashboard/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, … (+13 more)
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/dashboard/summary.test.ts, src/features/dashboard/server.ts, src/features/reports/server.ts

## src-features-event-comments
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/event-comments/server.ts`
- Direct tests: src/app/api/event-comments/route.test.ts
- All linked tests: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/components/event-operating-panel.tsx, src/features/events/client-operating.ts

## src/features / event-follow-up-items
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/event-follow-up-items/server.ts`
- Direct tests: __tests__/features/event-follow-up-items/read-clients.test.ts
- All linked tests: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/api/agent-outcomes/action-item/route.ts, src/features/events/client-operating.ts

## src/features / events
- Code files: 3
- With direct test links: 3
- With transitive test links: 3
- With no linked tests: 0

### `src/features/events/client-operating.ts`
- Direct tests: src/app/client/[slug]/components/event-operating-panel.test.tsx
- All linked tests: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/app/client/[slug]/event/[eventId]/page.tsx

### `src/features/events/server.ts`
- Direct tests: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/api/event-comments/route.test.ts
- All linked tests: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/api/event-comments/route.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+12 more)
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Imported by: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/components/admin/events/event-operating-panel.tsx, … (+2 more)

### `src/features/events/summary.ts`
- Direct tests: __tests__/features/events/summary.test.ts
- All linked tests: __tests__/features/events/summary.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+13 more)
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Imported by: __tests__/features/events/summary.test.ts, src/features/events/server.ts, src/features/reports/server.ts

## src/features / invitations
- Code files: 3
- With direct test links: 1
- With transitive test links: 3
- With no linked tests: 0

### `src/features/invitations/server.ts`
- Direct tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts
- All linked tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/features/invitations/server.test.ts

### `src/features/invitations/sort.ts`
- Direct tests: none
- All linked tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx, src/features/invitations/server.ts, src/features/settings/summary.ts, src/features/users/summary.ts

### `src/features/invitations/types.ts`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, … (+40 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, … (+14 more)
- Imported by: src/app/admin/users/data.ts, src/features/invitations/server.ts, src/features/invitations/sort.ts, src/features/shared/admin-summary-types.ts, src/lib/formatters.tsx

## src/features / notifications
- Code files: 4
- With direct test links: 3
- With transitive test links: 4
- With no linked tests: 0

### `src/features/notifications/discussions.ts`
- Direct tests: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- All linked tests: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Imported by: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts

### `src/features/notifications/server.ts`
- Direct tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts
- All linked tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+4 more)
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/features/notifications/discussions.ts, src/features/notifications/workflow.ts

### `src/features/notifications/types.ts`
- Direct tests: none
- All linked tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+4 more)
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/features/notifications/server.ts

### `src/features/notifications/workflow.ts`
- Direct tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts
- All linked tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, … (+1 more)

## src/features / operations-center
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/operations-center/summary.ts`
- Direct tests: __tests__/features/operations-center/summary.test.ts
- All linked tests: __tests__/features/operations-center/summary.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/agents/page.tsx
- Imported by: __tests__/features/operations-center/summary.test.ts, src/features/agents/summary.ts

## src/features / reports
- Code files: 3
- With direct test links: 3
- With transitive test links: 3
- With no linked tests: 0

### `src/features/reports/components/reports-surface.tsx`
- Direct tests: src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx
- All linked tests: src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx
- Imported by: src/app/admin/reports/page.test.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/client/[slug]/reports/page.tsx

### `src/features/reports/server.ts`
- Direct tests: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts
- All linked tests: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+8 more)
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/client/[slug]/reports/page.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+10 more)

### `src/features/reports/summary.ts`
- Direct tests: __tests__/features/reports/summary.test.ts
- All linked tests: __tests__/features/reports/summary.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, … (+9 more)
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/reports/summary.test.ts, src/features/reports/server.ts

## src/features / settings
- Code files: 2
- With direct test links: 2
- With transitive test links: 2
- With no linked tests: 0

### `src/features/settings/connected-accounts.ts`
- Direct tests: src/app/admin/clients/data.test.ts
- All linked tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, __tests__/features/settings/summary.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/settings/page.tsx, src/features/settings/summary.ts

### `src/features/settings/summary.ts`
- Direct tests: __tests__/features/settings/summary.test.ts
- All linked tests: __tests__/features/settings/summary.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx
- Imported by: __tests__/features/settings/summary.test.ts, src/app/admin/settings/page.tsx

## src/features / shared
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/shared/admin-summary-types.ts`
- Direct tests: __tests__/features/shared/admin-summary-types.test.ts
- All linked tests: __tests__/features/shared/admin-summary-types.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: __tests__/features/shared/admin-summary-types.test.ts, src/features/settings/summary.ts, src/features/users/summary.ts

## src/features / system-events
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/system-events/server.ts`
- Direct tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, … (+1 more)
- All linked tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, … (+25 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+9 more)
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, … (+19 more)

## src/features / users
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/users/summary.ts`
- Direct tests: __tests__/features/users/summary.test.ts
- All linked tests: __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: __tests__/features/users/summary.test.ts, src/app/admin/users/page.tsx

## src/features / workflow
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/workflow/revalidation.ts`
- Direct tests: src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts
- All linked tests: src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/admin/campaigns/page.test.tsx, … (+2 more)
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, … (+4 more)
- Imported by: src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.test.ts, … (+6 more)

## src / hooks
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `src/hooks/use-sidebar-state.ts`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/collapsible-sidebar.tsx

## src/lib
- Code files: 25
- With direct test links: 15
- With transitive test links: 23
- With no linked tests: 2

### `src/lib/action-item-labels.ts`
- Direct tests: none
- All linked tests: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts

### `src/lib/agent-dispatch.ts`
- Direct tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts
- All linked tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, … (+1 more)
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, … (+2 more)

### `src/lib/agent-jobs.ts`
- Direct tests: __tests__/api/agents-jobs.test.ts
- All linked tests: __tests__/api/agents-jobs.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/api/agents.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- Route owners: src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/admin/agents/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/agents/data.ts, src/app/admin/dashboard/data.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/features/agents/summary.ts

### `src/lib/api-helpers.ts`
- Direct tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts
- All linked tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, … (+10 more)
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, … (+20 more)
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, … (+31 more)

### `src/lib/api-schemas.ts`
- Direct tests: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts
- All linked tests: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/api/ingest.test.ts, … (+1 more)
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, … (+3 more)
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, … (+6 more)

### `src/lib/campaign-client-assignment.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/campaign-comments/route.test.ts, … (+1 more)
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/campaign-comments/route.test.ts, … (+50 more)
- Route owners: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, … (+17 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, … (+23 more)

### `src/lib/campaign-event-match.ts`
- Direct tests: none
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/events/page.test.tsx
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx
- Imported by: src/app/admin/dashboard/upcoming-shows.tsx, src/components/admin/events/columns.tsx

### `src/lib/client-slug.ts`
- Direct tests: __tests__/lib/client-slug.test.ts
- All linked tests: __tests__/lib/client-slug.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, … (+51 more)
- Route owners: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, … (+17 more)
- Imported by: __tests__/lib/client-slug.test.ts, src/lib/campaign-client-assignment.ts

### `src/lib/constants.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/admin/events/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+21 more)
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, … (+7 more)
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-section.tsx, src/app/client/[slug]/components/date-range-picker.tsx, src/app/client/[slug]/data.ts, … (+8 more)

### `src/lib/database.types.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/lib/env.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/instrumentation.ts

### `src/lib/export-csv.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/events/event-table.tsx, src/components/admin/users/user-table.tsx

### `src/lib/formatters.tsx`
- Direct tests: __tests__/lib/formatters.test.ts
- All linked tests: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/agent/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, … (+36 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, … (+14 more)
- Imported by: __tests__/lib/formatters.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/data.ts, … (+51 more)

### `src/lib/google-ads.ts`
- Direct tests: src/lib/google-ads.test.ts
- All linked tests: src/lib/google-ads.test.ts
- Route owners: none
- Imported by: src/lib/google-ads.test.ts, src/scripts/google-ads-discover-accounts.ts

### `src/lib/member-access.ts`
- Direct tests: src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts
- All linked tests: src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, __tests__/features/approvals/server.test.ts, … (+48 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+12 more)
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/assets/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, … (+14 more)

### `src/lib/meta-api.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+16 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/features/reports/server.ts, src/lib/meta-api.test.ts, src/lib/meta-campaigns.ts

### `src/lib/meta-campaigns.ts`
- Direct tests: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts
- All linked tests: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Imported by: __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, … (+3 more)

### `src/lib/meta-oauth.ts`
- Direct tests: src/lib/meta-oauth.test.ts
- All linked tests: src/lib/meta-oauth.test.ts, src/app/api/meta/data-deletion/route.test.ts
- Route owners: src/app/api/meta/data-deletion/route.ts
- Imported by: src/app/api/meta/data-deletion/route.ts, src/lib/meta-oauth.test.ts

### `src/lib/shopify-admin.ts`
- Direct tests: src/lib/shopify-admin.test.ts
- All linked tests: src/lib/shopify-admin.test.ts
- Route owners: none
- Imported by: src/lib/shopify-admin.test.ts

### `src/lib/status.ts`
- Direct tests: none
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/lib/formatters.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+36 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, … (+14 more)
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/insights.ts, src/lib/formatters.tsx

### `src/lib/supabase.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+21 more)
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+69 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, … (+31 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, … (+77 more)

### `src/lib/text-utils.ts`
- Direct tests: none
- All linked tests: src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Imported by: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts

### `src/lib/to-slug.ts`
- Direct tests: src/lib/to-slug.test.ts
- All linked tests: src/lib/to-slug.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx
- Imported by: src/components/admin/client-onboard-form.tsx, src/components/admin/clients/client-table.tsx, src/lib/to-slug.test.ts

### `src/lib/utils.ts`
- Direct tests: none
- All linked tests: src/components/admin/agents/command-summary.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/admin/campaigns/page.test.tsx, … (+4 more)
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, … (+21 more)
- Imported by: src/components/admin/agents/command-summary.tsx, src/components/admin/collapsible-sidebar.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/nav-links.tsx, src/components/ui/badge.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, … (+9 more)

### `src/lib/workspace-types.ts`
- Direct tests: none
- All linked tests: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/summary.test.ts, src/app/shell-import-smoke.test.ts, … (+24 more)
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/events/[eventId]/page.tsx, … (+5 more)
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/dashboard/summary.ts, … (+3 more)

## src/lib / ticketmaster
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/lib/ticketmaster/tm1-client.ts`
- Direct tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- All linked tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Route owners: src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts
- Imported by: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/lib/ticketmaster/tm1-client.test.ts

## src / Root
- Code files: 2
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 2

### `src/instrumentation.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/proxy.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src / scripts
- Code files: 4
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 4

### `src/scripts/google-ads-build-ataca-sergio-search.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/scripts/google-ads-discover-accounts.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/scripts/google-ads-first-read.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/scripts/shopify-first-read.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none
