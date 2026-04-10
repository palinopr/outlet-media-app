# Impact: src/features/agent-outcomes/server.ts

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Feature files
- Impact score: 90
- Ownership: feature module: agent-outcomes
- Feature module: agent-outcomes
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/agents/data.ts, src/app/api/agent-outcomes/action-item/route.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, src/features/reports/server.ts
- Tests related: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+14 more)
- DB objects: agent_tasks, system_events, campaign_action_items, asset_follow_up_items, event_follow_up_items
- Env vars: none
- Mutation symbols: requestAssetId, requestCampaignId, requestEventId
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/features / assets, src/lib, src/features / agent-outcomes
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/features / campaigns, src/features / events, src/features / reports
- Summary: exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext; internal imports: 4
