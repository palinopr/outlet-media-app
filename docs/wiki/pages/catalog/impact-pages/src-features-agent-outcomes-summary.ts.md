# Impact: src/features/agent-outcomes/summary.ts

Generated from the current working tree on 2026-04-10 16:52:39.

- Category: Feature files
- Impact score: 79
- Ownership: feature module: agent-outcomes
- Feature module: agent-outcomes
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/app/api/agent-outcomes/action-item/route.ts, src/components/admin/agents/command-summary.tsx, src/features/agent-outcomes/server.ts, src/features/agents/summary.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, src/features/operations-center/summary.ts, src/features/reports/server.ts
- Tests related: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/agents/summary.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/operations-center/summary.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, … (+17 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: Tests / Features, src/app / api, src/components / admin, src/features / agent-outcomes, src/features / agents, src/features / campaigns, src/features / events, src/features / operations-center, src/features / reports
- Summary: exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView; internal imports: 1
