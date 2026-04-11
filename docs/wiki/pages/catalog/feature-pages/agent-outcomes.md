# Feature: agent-outcomes

Generated from the current working tree on 2026-04-10 22:05:59.

- Files: 2
- Entry files: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- Component files: none
- Client files: none
- Server files: src/features/agent-outcomes/server.ts
- Route users: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: agent_tasks, system_events, campaign_action_items, asset_follow_up_items, event_follow_up_items
- Depends on feature modules: assets (1)
- Used by feature modules: campaigns (2), events (2), reports (2), agents (1), operations-center (1)
- Auth/access signals: none
- Behavior signals: none
- Direct tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts
- All linked tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+19 more)

## Exporting files
- `src/features/agent-outcomes/server.ts` — exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext
- `src/features/agent-outcomes/summary.ts` — exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView

## File list
- `src/features/agent-outcomes/server.ts` — exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext; internal imports: 4
- `src/features/agent-outcomes/summary.ts` — exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView; internal imports: 1
