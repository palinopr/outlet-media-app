---
title: Source Map
status: active
updated: 2026-04-10
---

# Source Map

This page is the current structural map of the repo.

## Admin web routes
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/campaigns/page.tsx`
- `src/app/admin/campaigns/[campaignId]/page.tsx`
- `src/app/admin/events/page.tsx`
- `src/app/admin/events/[eventId]/page.tsx`
- `src/app/admin/reports/page.tsx`
- `src/app/admin/agents/page.tsx`
- `src/app/admin/clients/page.tsx`
- `src/app/admin/clients/[id]/page.tsx`
- `src/app/admin/users/page.tsx`
- `src/app/admin/settings/page.tsx`

## Client web routes
- `src/app/client/page.tsx`
- `src/app/client/pending/page.tsx`
- `src/app/client/[slug]/page.tsx`
- `src/app/client/[slug]/campaigns/page.tsx`
- `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- `src/app/client/[slug]/events/page.tsx`
- `src/app/client/[slug]/event/[eventId]/page.tsx`
- `src/app/client/[slug]/reports/page.tsx`
- `src/app/client/[slug]/agent/page.tsx`

## API surfaces currently visible in build output
- `src/app/api/admin/activity/route.ts`
- `src/app/api/admin/invite/route.ts`
- `src/app/api/admin/users/[id]/route.ts`
- `src/app/api/agent-outcomes/action-item/route.ts`
- `src/app/api/agents/**`
- `src/app/api/alerts/route.ts`
- `src/app/api/campaign-comments/**`
- `src/app/api/client/[slug]/agent/**`
- `src/app/api/contact/route.ts`
- `src/app/api/health/route.ts`
- `src/app/api/ingest/route.ts`
- `src/app/api/meta/**`
- `src/app/api/user/profile/route.ts`

## Feature-module directories
- `src/features/access`
- `src/features/agent-outcomes`
- `src/features/agents`
- `src/features/approvals`
- `src/features/asset-follow-up-items`
- `src/features/assets`
- `src/features/campaign-action-items`
- `src/features/campaign-comments`
- `src/features/campaigns`
- `src/features/client-agent`
- `src/features/client-portal`
- `src/features/clients`
- `src/features/conversations`
- `src/features/dashboard`
- `src/features/event-follow-up-items`
- `src/features/events`
- `src/features/invitations`
- `src/features/notifications`
- `src/features/operations-center`
- `src/features/reports`
- `src/features/settings`
- `src/features/shared`
- `src/features/system-events`
- `src/features/users`
- `src/features/workflow`

## Agent runtime files
- `agent/src/index.ts`
- `agent/src/runner.ts`
- `agent/src/events/message-handler.ts`
- `agent/src/discord/core/entry.ts`
- `agent/src/discord/core/router.ts`
- `agent/src/discord/commands/slash.ts`
- `agent/src/services/queue-service.ts`
- `agent/src/services/runtime-state-service.ts`
- `agent/src/services/supabase-service.ts`
- `agent/src/services/system-events-service.ts`
- `agent/src/services/web-task-executor.ts`
- `agent/src/services/webhook-service.ts`
- `agent/src/utils/date-helpers.ts`
- `agent/src/utils/error-helpers.ts`
- `agent/src/utils/prompt-formatters.ts`
- `agent/src/utils/session-loader.ts`

## Notes
- The current route/package shape matches the reset better than the older broad product surface, but feature-module breadth is still wider than the narrow shipped product core.
- That does not automatically mean those modules are dead. Some may still be embedded support layers.
- Use [Feature Modules](./feature-modules.md) and [Dead Ends and Dead Code](../audits/dead-ends-and-dead-code.md) before deciding what to delete.
