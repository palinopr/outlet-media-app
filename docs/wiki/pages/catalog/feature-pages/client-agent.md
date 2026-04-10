# Feature: client-agent

Generated from the current working tree on 2026-04-10 18:46:37.

- Files: 33
- Entry files: src/features/client-agent/model.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.ts, src/features/client-agent/readers.ts, src/features/client-agent/runtime.ts, src/features/client-agent/server.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.ts, … (+4 more)
- Component files: src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx
- Client files: src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx
- Server files: src/features/client-agent/server.ts
- Route users: src/app/client/[slug]/agent/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Database objects touched: calls, leads, client_agent_threads, client_agent_messages, clients
- Depends on feature modules: reports (10), client-portal (6), system-events (2), workflow (2)
- Used by feature modules: none
- Auth/access signals: references membership/scope access concepts
- Behavior signals: client component/module, calls notFound()
- Direct tests: src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/features/client-agent/policy.test.ts, src/features/client-agent/range.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+8 more)
- All linked tests: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/features/client-agent/policy.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/range.test.ts, … (+8 more)

## Exporting files
- `src/features/client-agent/components/agent-shell.tsx` — exports: AgentShell, AgentThreadSummary, AgentThreadMessage
- `src/features/client-agent/components/conversation-pane.tsx` — exports: ConversationPane
- `src/features/client-agent/components/thread-list.tsx` — exports: ThreadList
- `src/features/client-agent/model.ts` — exports: type ClientAgentModelResponse, type ClientAgentRuntimeHistoryMessage, type GenerateClientAgentModelResponseInput, generateClientAgentModelResponse
- `src/features/client-agent/policy.ts` — exports: evaluatePromptPolicy
- `src/features/client-agent/range.ts` — exports: normalizeRange, resolveRangeFromMessage
- `src/features/client-agent/readers.ts` — exports: loadClientAgentCampaignDetail, loadClientAgentEventDetail
- `src/features/client-agent/runtime.ts` — exports: runClientAgentRuntime, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput, ClientAgentModelResponse
- `src/features/client-agent/server.ts` — exports: listThreads, createThread, getThread, sendMessage
- `src/features/client-agent/store.ts` — exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage
- `src/features/client-agent/thread-context.ts` — exports: ThreadContextPayloadSchema, ThreadContextPayload
- `src/features/client-agent/tool-contracts.ts` — exports: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, SearchScopeRequestSchema, AdsOverviewRequestSchema, EventsOverviewRequestSchema, CampaignDetailsRequestSchema, EventDetailsRequestSchema, CreativeDetailsRequestSchema, … (+38 more)
- `src/features/client-agent/tools/breakdowns.ts` — exports: getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown
- `src/features/client-agent/tools/compare-timeseries.ts` — exports: compareEntities, getTimeseries
- `src/features/client-agent/tools/details.ts` — exports: getCampaignDetails, getEventDetails, getCreativeDetails
- `src/features/client-agent/tools/index.ts` — exports: searchScope, getAdsOverview, getEventsOverview, getCampaignDetails, getCreativeDetails, getEventDetails, getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown, compareEntities, getTimeseries
- `src/features/client-agent/tools/overview.ts` — exports: getAdsOverview, getEventsOverview
- `src/features/client-agent/tools/search.ts` — exports: searchScope
- `src/features/client-agent/types.ts` — exports: AgentResponseStatusSchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryMessageSchema, MetricCardsBlockSchema, TableBlockSchema, ChartBlockSchema, AgentAnswerBlockSchema, AgentResponseStatus, ReferencedEntity, … (+4 more)

## File list
- `src/features/client-agent/components/agent-shell.test.tsx` — tests/describes: AgentShell; renders updated customer prompt chips and omits event prompt chips when events are disabled; shows natural event prompt chips when events are enabled; internal imports: 1; package imports: 2
- `src/features/client-agent/components/agent-shell.tsx` — contains `use client`; exports: AgentShell, AgentThreadSummary, AgentThreadMessage; internal imports: 4; package imports: 1
- `src/features/client-agent/components/conversation-pane.tsx` — contains `use client`; exports: ConversationPane; internal imports: 1
- `src/features/client-agent/components/thread-list.tsx` — contains `use client`; exports: ThreadList; internal imports: 1; package imports: 1
- `src/features/client-agent/model.test.ts` — tests/describes: client-agent model wrapper; delegates to the tool-driven runtime without changing the transport shape; internal imports: 2; package imports: 1
- `src/features/client-agent/model.ts` — exports: type ClientAgentModelResponse, type ClientAgentRuntimeHistoryMessage, type GenerateClientAgentModelResponseInput, generateClientAgentModelResponse; internal imports: 1
- `src/features/client-agent/policy.test.ts` — tests/describes: evaluatePromptPolicy; refuses pure internal or admin-only questions; keeps the safe analytics portion of mixed prompts; internal imports: 1; package imports: 1
- `src/features/client-agent/policy.ts` — exports: evaluatePromptPolicy
- `src/features/client-agent/range.test.ts` — tests/describes: normalizeRange; normalizes today; normalizes yesterday; internal imports: 1; package imports: 1
- `src/features/client-agent/range.ts` — exports: normalizeRange, resolveRangeFromMessage; tests/describes: -; internal imports: 1
- `src/features/client-agent/readers.ts` — exports: loadClientAgentCampaignDetail, loadClientAgentEventDetail; internal imports: 4
- `src/features/client-agent/runtime.test.ts` — tests/describes: client-agent runtime; executes the ads overview tool through the Claude SDK and returns final prose; returns a safe error when the anthropic api key is missing; internal imports: 2; package imports: 2
- `src/features/client-agent/runtime.ts` — exports: runClientAgentRuntime, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput, ClientAgentModelResponse; internal imports: 6; package imports: 2
- `src/features/client-agent/server.test.ts` — tests/describes: client-agent server orchestration; returns 401 for unauthenticated access; creates durable threads for members and logs + revalidates; internal imports: 8; package imports: 1
- `src/features/client-agent/server.ts` — exports: listThreads, createThread, getThread, sendMessage; internal imports: 9
- `src/features/client-agent/store.test.ts` — tests/describes: client-agent store; lists only the current member rows and hides out-of-scope thread references; returns null when a referenced entity drops out of scope; internal imports: 3; package imports: 1
- `src/features/client-agent/store.ts` — exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage; internal imports: 3
- `src/features/client-agent/thread-context.test.ts` — tests/describes: ThreadContextPayloadSchema; accepts campaign, event, and creative references for follow-ups; rejects creative references without a parent campaign id; internal imports: 1; package imports: 1
- `src/features/client-agent/thread-context.ts` — exports: ThreadContextPayloadSchema, ThreadContextPayload; internal imports: 1; package imports: 1
- `src/features/client-agent/tool-contracts.test.ts` — tests/describes: client agent tool contracts; accepts the ads overview request shape; rejects compare requests with an invalid metric for campaign comparisons; internal imports: 1; package imports: 1
- `src/features/client-agent/tool-contracts.ts` — exports: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, SearchScopeRequestSchema, AdsOverviewRequestSchema; internal imports: 1; package imports: 1
- `src/features/client-agent/tools/breakdowns.test.ts` — tests/describes: breakdown tools; returns normalized demographic rows; returns normalized geography rows; internal imports: 3; package imports: 1
- `src/features/client-agent/tools/breakdowns.ts` — exports: getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown; internal imports: 4
- `src/features/client-agent/tools/compare-timeseries.test.ts` — tests/describes: compare and timeseries tools; compares campaigns with a valid ads metric; returns a monthly spend series; internal imports: 3; package imports: 1
- `src/features/client-agent/tools/compare-timeseries.ts` — exports: compareEntities, getTimeseries; internal imports: 4
- `src/features/client-agent/tools/details.test.ts` — tests/describes: detail tools; returns campaign details without inlining breakdown families; returns event details with range metrics and current snapshot fields; internal imports: 3; package imports: 1
- `src/features/client-agent/tools/details.ts` — exports: getCampaignDetails, getEventDetails, getCreativeDetails; internal imports: 4
- `src/features/client-agent/tools/index.ts` — exports: searchScope, getAdsOverview, getEventsOverview, getCampaignDetails, getCreativeDetails, getEventDetails, getDemographicBreakdown, getGeographyBreakdown; internal imports: 5
- `src/features/client-agent/tools/overview.test.ts` — tests/describes: overview tools; returns normalized lifetime ads overview totals; returns normalized events overview totals; internal imports: 3; package imports: 1
- `src/features/client-agent/tools/overview.ts` — exports: getAdsOverview, getEventsOverview; internal imports: 4
- `src/features/client-agent/tools/search.test.ts` — tests/describes: searchScope; searches campaigns, creatives, and events within scope; lists the full visible scope when the query is wildcarded; internal imports: 3; package imports: 1
- `src/features/client-agent/tools/search.ts` — exports: searchScope; internal imports: 5
- `src/features/client-agent/types.ts` — exports: AgentResponseStatusSchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryMessageSchema, MetricCardsBlockSchema, TableBlockSchema; package imports: 1
