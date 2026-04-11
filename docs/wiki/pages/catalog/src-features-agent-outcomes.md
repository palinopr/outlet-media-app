# src/features / agent-outcomes

Generated from the current working tree on 2026-04-10 21:51:44.

- Files: 2
- File kinds: TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/agent-outcomes/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / agent-outcomes
- Ownership: feature module: agent-outcomes
- Type: TypeScript module
- Construction: code module
- Lines: 362
- Bytes: 12387
- Imports (internal): src/features/assets/server.ts, src/lib/supabase.ts, src/features/agent-outcomes/summary.ts
- Imports (internal unresolved): src/lib/database.types
- Imported by: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/agents/data.ts, src/app/api/agent-outcomes/action-item/route.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, src/features/reports/server.ts
- Depends on groups: src/features / assets, src/lib, src/features / agent-outcomes
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/features / campaigns, src/features / events, src/features / reports
- Feature module: agent-outcomes
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts
- Tests related: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/reports/integration.test.ts, … (+18 more)
- Tests related (direct): __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts
- Exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext
- Symbol details: function matchesContext (exported), function listAgentOutcomes (exported), function getAgentOutcomeContext (exported), function mapRequestRow, function mapTaskRow, interface AgentOutcomeContext (exported), interface ListAgentOutcomesOptions
- Defines: mapRequestRow, mapTaskRow, matchesContext, listAgentOutcomes, getAgentOutcomeContext, requestAssetId, requestCampaignId, requestEventId, matchesScopedCampaign, matchesScopedEvent, matchesScopedAsset, matchesRequestedEvent, … (+18 more)
- Contents summary: exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext; internal imports: 4

## `src/features/agent-outcomes/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / agent-outcomes
- Ownership: feature module: agent-outcomes
- Type: TypeScript module
- Construction: code module
- Lines: 114
- Bytes: 3905
- Imports (internal unresolved): src/lib/database.types
- Imported by: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/app/api/agent-outcomes/action-item/route.ts, src/components/admin/agents/command-summary.tsx, src/features/agent-outcomes/server.ts, src/features/agents/summary.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts, src/features/operations-center/summary.ts, src/features/reports/server.ts
- Used by groups: Tests / Features, src/app / api, src/components / admin, src/features / agent-outcomes, src/features / agents, src/features / campaigns, src/features / events, src/features / operations-center, src/features / reports
- Feature module: agent-outcomes
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts
- Tests related: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/agents/summary.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+21 more)
- Tests related (direct): __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts
- Exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView
- Symbol details: function jsonToText (exported), function taskStatusToOutcomeStatus (exported), function buildAgentOutcomeView (exported), function isRecord, function metadataString, type AgentOutcomeStatus (exported), type AgentOutcomeVisibility (exported), interface AgentOutcomeRequestRecord (exported), interface AgentOutcomeTaskRecord (exported), interface AgentOutcomeView (exported)
- Defines: isRecord, jsonToText, taskStatusToOutcomeStatus, metadataString, buildAgentOutcomeView, value, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView
- Contents summary: exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView; internal imports: 1
