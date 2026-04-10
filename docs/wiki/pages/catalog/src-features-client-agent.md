# src/features / client-agent

Generated from the current working tree on 2026-04-10 17:55:29.

- Files: 33
- File kinds: TypeScript module (16), test file (14), React/TSX module (3)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/client-agent/components/agent-shell.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 569
- Bytes: 19098
- Imports (internal): src/features/client-agent/components/agent-shell.tsx
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/features / client-agent
- Feature module: client-agent
- Symbol details: function makeJsonResponse, const fetchMock
- Defines: makeJsonResponse, fetchMock, url, composer, textarea, body, secondMessageCall
- Tests / describe labels: AgentShell, renders updated customer prompt chips and omits event prompt chips when events are disabled, shows natural event prompt chips when events are enabled, creates a new chat, loads a thread, submits a message optimistically, and keeps the chat text-only, allows unsaved preview chats for admins, reuses assistant context payload for preview follow-up turns, clears the working state when the first message on a new thread fails, submits on Enter and keeps Shift+Enter as a newline
- Contents summary: tests/describes: AgentShell; renders updated customer prompt chips and omits event prompt chips when events are disabled; shows natural event prompt chips when events are enabled; internal imports: 1; package imports: 2

## `src/features/client-agent/components/agent-shell.tsx`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 410
- Bytes: 12387
- Imports (internal): src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx, src/features/client-agent/thread-context.ts, src/features/client-agent/types.ts
- Imports (packages): react
- Imported by: src/app/client/[slug]/agent/page.tsx, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx
- Depends on groups: src/features / client-agent
- Used by groups: src/app / client, src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/components/agent-shell.test.tsx
- Exports: AgentShell, AgentThreadSummary, AgentThreadMessage
- Symbol details: function AgentShell (exported), function nowIso, function normalizePreviewText, function buildOptimisticUserMessage, function buildAssistantMessage, function parseJson, function buildHistoryPayload, const CAMPAIGN_PROMPTS, const EVENT_PROMPTS, type AgentThreadSummary (exported), type AgentThreadMessage (exported), type AgentThreadDetail, type AgentShellProps, type SendMessagePayload, type HistoryPayload
- Defines: nowIso, normalizePreviewText, buildOptimisticUserMessage, buildAssistantMessage, parseJson, buildHistoryPayload, AgentShell, createThreadAndSelect, handleNewChat, handleSendMessage, handlePromptClick, CAMPAIGN_PROMPTS, … (+21 more)
- Contents summary: contains `use client`; exports: AgentShell, AgentThreadSummary, AgentThreadMessage; internal imports: 4; package imports: 1

## `src/features/client-agent/components/conversation-pane.tsx`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 187
- Bytes: 6395
- Imports (internal): src/features/client-agent/components/agent-shell.tsx
- Imported by: src/features/client-agent/components/agent-shell.tsx
- Depends on groups: src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx
- Exports: ConversationPane
- Symbol details: function ConversationPane (exported), function statusClass, function statusLabel, type ConversationPaneProps
- Defines: statusClass, statusLabel, ConversationPane, handleComposerKeyDown, showEmptyState, ConversationPaneProps
- Contents summary: contains `use client`; exports: ConversationPane; internal imports: 1

## `src/features/client-agent/components/thread-list.tsx`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 68
- Bytes: 2367
- Imports (internal): src/features/client-agent/components/agent-shell.tsx
- Imports (packages): lucide-react
- Imported by: src/features/client-agent/components/agent-shell.tsx
- Depends on groups: src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx
- Exports: ThreadList
- Symbol details: function ThreadList (exported), type ThreadListProps
- Defines: ThreadList, active, ThreadListProps
- Contents summary: contains `use client`; exports: ThreadList; internal imports: 1; package imports: 1

## `src/features/client-agent/model.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 83
- Bytes: 2238
- Imports (internal): src/features/client-agent/model.ts, src/features/client-agent/runtime.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent
- Feature module: client-agent
- Defines: runtimeResponse, input, result
- Tests / describe labels: client-agent model wrapper, delegates to the tool-driven runtime without changing the transport shape
- Contents summary: tests/describes: client-agent model wrapper; delegates to the tool-driven runtime without changing the transport shape; internal imports: 2; package imports: 1

## `src/features/client-agent/model.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 7
- Bytes: 210
- Imports (internal): src/features/client-agent/runtime.ts
- Imported by: src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts
- Exports: type ClientAgentModelResponse, type ClientAgentRuntimeHistoryMessage, type GenerateClientAgentModelResponseInput, generateClientAgentModelResponse
- Defines: ClientAgentModelResponse, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput
- Contents summary: exports: type ClientAgentModelResponse, type ClientAgentRuntimeHistoryMessage, type GenerateClientAgentModelResponseInput, generateClientAgentModelResponse; internal imports: 1

## `src/features/client-agent/policy.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 36
- Bytes: 1082
- Imports (internal): src/features/client-agent/policy.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent
- Feature module: client-agent
- Tests / describe labels: evaluatePromptPolicy, refuses pure internal or admin-only questions, keeps the safe analytics portion of mixed prompts, treats internally as an internal disclosure cue, marks setup and diagnostics prompts as refused
- Contents summary: tests/describes: evaluatePromptPolicy; refuses pure internal or admin-only questions; keeps the safe analytics portion of mixed prompts; internal imports: 1; package imports: 1

## `src/features/client-agent/policy.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 42
- Bytes: 1247
- Imported by: src/features/client-agent/policy.test.ts, src/features/client-agent/runtime.ts
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/policy.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/policy.test.ts
- Exports: evaluatePromptPolicy
- Symbol details: function evaluatePromptPolicy (exported), const REFUSED_PATTERN, const REFUSAL_NOTE, const REFUSAL_MESSAGE, type PromptPolicyResult
- Defines: evaluatePromptPolicy, REFUSED_PATTERN, REFUSAL_NOTE, REFUSAL_MESSAGE, trimmed, safePrompt, PromptPolicyResult
- Contents summary: exports: evaluatePromptPolicy

## `src/features/client-agent/range.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 111
- Bytes: 3076
- Imports (internal): src/features/client-agent/range.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent
- Feature module: client-agent
- Defines: now
- Tests / describe labels: normalizeRange, normalizes today, normalizes yesterday, normalizes last 7 days, normalizes this month, normalizes this quarter, normalizes lifetime to a full-history range, returns null when multiple supported ranges appear in the same message, … (+2 more)
- Contents summary: tests/describes: normalizeRange; normalizes today; normalizes yesterday; internal imports: 1; package imports: 1

## `src/features/client-agent/range.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 193
- Bytes: 4933
- Imports (internal): src/features/client-agent/types.ts
- Imported by: src/features/client-agent/range.test.ts, src/features/client-agent/runtime.ts, src/features/client-agent/tools/search.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/range.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, … (+1 more)
- Tests related (direct): src/features/client-agent/range.test.ts
- Exports: normalizeRange, resolveRangeFromMessage
- Symbol details: function normalizeRange (exported), function resolveRangeFromMessage (exported), function getFormatter, function getLocalDateString, function parseDate, function formatDate, function addDays, function startOfWeek, function startOfMonth, function startOfQuarter, const RANGE_ALIASES, const formatterCache, type NormalizeRangeOptions
- Defines: getFormatter, getLocalDateString, parseDate, formatDate, addDays, startOfWeek, startOfMonth, startOfQuarter, normalizeRange, resolveRangeFromMessage, RANGE_ALIASES, formatterCache, … (+17 more)
- Tests / describe labels: -
- Contents summary: exports: normalizeRange, resolveRangeFromMessage; tests/describes: -; internal imports: 1

## `src/features/client-agent/readers.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 57
- Bytes: 1520
- Imports (internal): src/features/client-portal/campaign-detail.ts, src/features/client-portal/event-detail.ts, src/lib/member-access.ts, src/features/client-agent/types.ts
- Imported by: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/overview.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/tools/search.ts
- Depends on groups: src/features / client-portal, src/lib, src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
- Tests related (direct): src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts
- Exports: loadClientAgentCampaignDetail, loadClientAgentEventDetail
- Symbol details: function loadClientAgentCampaignDetail (exported), function loadClientAgentEventDetail (exported), function toCampaignDetailRange
- Defines: toCampaignDetailRange, loadClientAgentCampaignDetail, loadClientAgentEventDetail, CampaignDetailRangeInput
- Contents summary: exports: loadClientAgentCampaignDetail, loadClientAgentEventDetail; internal imports: 4

## `src/features/client-agent/runtime.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 430
- Bytes: 12300
- Imports (internal): src/features/client-agent/runtime.ts, src/features/client-agent/tools/index.ts
- Imports (packages): vitest, @anthropic-ai/claude-agent-sdk
- Depends on groups: src/features / client-agent
- Feature module: client-agent
- Symbol details: function sdkResultSuccess, function sdkAssistantMessage, function getServerFromQueryCall, function makeMockQuery, const memberScope, const lifetimeRange
- Defines: sdkResultSuccess, sdkAssistantMessage, getServerFromQueryCall, makeMockQuery, memberScope, lifetimeRange, firstCall, close, server, adsTool, result
- Tests / describe labels: client-agent runtime, executes the ads overview tool through the Claude SDK and returns final prose, returns a safe error when the anthropic api key is missing, appends the refusal note after safe analytics for mixed prompts, resets prior creative context when a new turn broadens back to overall ads, passes only the current user message and resolved context memo for real follow-ups
- Contents summary: tests/describes: client-agent runtime; executes the ads overview tool through the Claude SDK and returns final prose; returns a safe error when the anthropic api key is missing; internal imports: 2; package imports: 2

## `src/features/client-agent/runtime.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 989
- Bytes: 30386
- Imports (internal): src/features/client-agent/policy.ts, src/features/client-agent/range.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/types.ts, src/features/client-agent/tools/index.ts, src/features/client-agent/tool-contracts.ts
- Imports (packages): @anthropic-ai/claude-agent-sdk, zod
- Imported by: src/features/client-agent/model.test.ts, src/features/client-agent/model.ts, src/features/client-agent/runtime.test.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts
- Exports: runClientAgentRuntime, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput, ClientAgentModelResponse
- Symbol details: function runClientAgentRuntime (exported), function uniqueReferencedEntities, function inferPrimaryDomainFromEntities, function initializeAuthorityState, function buildContextPayload, function safeError, function buildHistoryContextMemo, function looksLikeBroadAdsQuestion, function looksLikeBroadEventsQuestion, function looksLikeContextDependentFollowUp, function resetAuthorityStateForBroadMessage, function buildInstructions, function parseTaggedOutput, function extractRangeFromArgs, function mergeAuthorityState, function getToolShape, … (+8 more)
- Defines: uniqueReferencedEntities, inferPrimaryDomainFromEntities, initializeAuthorityState, buildContextPayload, safeError, buildHistoryContextMemo, looksLikeBroadAdsQuestion, looksLikeBroadEventsQuestion, looksLikeContextDependentFollowUp, resetAuthorityStateForBroadMessage, buildInstructions, parseTaggedOutput, … (+72 more)
- Contents summary: exports: runClientAgentRuntime, ClientAgentRuntimeHistoryMessage, GenerateClientAgentModelResponseInput, ClientAgentModelResponse; internal imports: 6; package imports: 2

## `src/features/client-agent/server.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 687
- Bytes: 19382
- Imports (internal): src/features/client-agent/server.ts, src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/lib/member-access.ts, src/features/client-agent/store.ts, src/features/client-agent/model.ts, src/features/system-events/server.ts, src/features/workflow/revalidation.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent, src/features / client-portal, src/lib, src/features / system-events, src/features / workflow
- Feature module: client-agent
- Defines: result
- Tests / describe labels: client-agent server orchestration, returns 401 for unauthenticated access, creates durable threads for members and logs + revalidates, skips persistence for admin preview createThread, allows admin preview sendMessage without persistence, returns 404 for thread get when out of scope, persists member sendMessage flow, emits answer event, and revalidates, emits refusal and failure events for model outputs, … (+2 more)
- Contents summary: tests/describes: client-agent server orchestration; returns 401 for unauthenticated access; creates durable threads for members and logs + revalidates; internal imports: 8; package imports: 1

## `src/features/client-agent/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 460
- Bytes: 11385
- Imports (internal): src/features/client-portal/config.ts, src/features/client-portal/access.ts, src/features/system-events/server.ts, src/features/workflow/revalidation.ts, src/lib/member-access.ts, src/features/client-agent/model.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/types.ts
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/features/client-agent/server.test.ts
- Depends on groups: src/features / client-portal, src/features / system-events, src/features / workflow, src/lib, src/features / client-agent
- Used by groups: src/app / api, src/app / client, src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- Tests related (direct): src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- Exports: listThreads, createThread, getThread, sendMessage
- Symbol details: function listThreads (exported), function createThread (exported), function getThread (exported), function sendMessage (exported), function errorResult, function mapAccessFailure, function mapStoreFailure, function resolveScope, function blankThread, function eventNameForStatus, function fallbackAssistantResponseId, type ErrorResult, type SuccessResult, type ServiceResult, type ThreadListBody, type PreviewThread, … (+2 more)
- Defines: errorResult, mapAccessFailure, mapStoreFailure, resolveScope, blankThread, listThreads, createThread, getThread, eventNameForStatus, fallbackAssistantResponseId, sendMessage, access, … (+17 more)
- Contents summary: exports: listThreads, createThread, getThread, sendMessage; internal imports: 9

## `src/features/client-agent/store.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 628
- Bytes: 20045
- Imports (internal): src/features/client-agent/types.ts, src/features/client-agent/store.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent, src/lib
- Feature module: client-agent
- Symbol details: function makeThread, function makeMessage, const memberScope
- Defines: applyFilters, makeThread, makeMessage, state, values, supabaseAdmin, query, result, tableRows, tableFailures, field, leftValue, … (+13 more)
- Tests / describe labels: client-agent store, lists only the current member rows and hides out-of-scope thread references, returns null when a referenced entity drops out of scope, hides creative-only thread rows when the parent campaign is out of scope, returns null when persisted assistant messages drift out of scope even if thread summary still looks visible, hides list rows when persisted assistant messages drift out of scope even if the summary row still looks visible, short-circuits preview mode before any durable reads or writes, derives title and preview text, aggregates assistant references, and refreshes durable timestamps, … (+4 more)
- Contents summary: tests/describes: client-agent store; lists only the current member rows and hides out-of-scope thread references; returns null when a referenced entity drops out of scope; internal imports: 3; package imports: 1

## `src/features/client-agent/store.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 511
- Bytes: 13295
- Imports (internal): src/lib/supabase.ts, src/features/client-agent/types.ts, src/features/client-agent/thread-context.ts
- Imported by: src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/store.test.ts
- Depends on groups: src/lib, src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts
- Exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage
- Symbol details: function createThread (exported), function listThreads (exported), function getThread (exported), function appendUserMessage (exported), function appendAssistantMessage (exported), function previewUnavailable, function notFound, function writeFailed, function isEntityAllowed, function normalizeReferencedEntities, function normalizeThreadContextPayload, function isThreadVisible, function uniqueReferencedEntities, function truncate, function mapThreadRow, function mapMessageRow, … (+8 more)
- Defines: previewUnavailable, notFound, writeFailed, isEntityAllowed, normalizeReferencedEntities, normalizeThreadContextPayload, isThreadVisible, uniqueReferencedEntities, truncate, mapThreadRow, mapMessageRow, isMessageVisible, … (+34 more)
- Contents summary: exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage; internal imports: 3

## `src/features/client-agent/thread-context.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 51
- Bytes: 1322
- Imports (internal): src/features/client-agent/thread-context.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent
- Feature module: client-agent
- Tests / describe labels: ThreadContextPayloadSchema, accepts campaign, event, and creative references for follow-ups, rejects creative references without a parent campaign id
- Contents summary: tests/describes: ThreadContextPayloadSchema; accepts campaign, event, and creative references for follow-ups; rejects creative references without a parent campaign id; internal imports: 1; package imports: 1

## `src/features/client-agent/thread-context.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 14
- Bytes: 483
- Imports (internal): src/features/client-agent/types.ts
- Imports (packages): zod
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/runtime.ts, src/features/client-agent/server.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.test.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/app / api, src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Routes related (direct): src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts
- Tests related: src/features/client-agent/thread-context.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, … (+2 more)
- Tests related (direct): src/features/client-agent/thread-context.test.ts
- Exports: ThreadContextPayloadSchema, ThreadContextPayload
- Symbol details: const ThreadContextPayloadSchema (exported), type ThreadContextPayload (exported)
- Defines: ThreadContextPayloadSchema, ThreadContextPayload
- Contents summary: exports: ThreadContextPayloadSchema, ThreadContextPayload; internal imports: 1; package imports: 1

## `src/features/client-agent/tool-contracts.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 121
- Bytes: 3107
- Imports (internal): src/features/client-agent/tool-contracts.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent
- Feature module: client-agent
- Tests / describe labels: client agent tool contracts, accepts the ads overview request shape, rejects compare requests with an invalid metric for campaign comparisons, accepts the search request shape, accepts event and creative detail request shapes, accepts geography and placement breakdown request shapes, rejects a timeseries request with an unsupported interval
- Contents summary: tests/describes: client agent tool contracts; accepts the ads overview request shape; rejects compare requests with an invalid metric for campaign comparisons; internal imports: 1; package imports: 1

## `src/features/client-agent/tool-contracts.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 341
- Bytes: 10589
- Imports (internal): src/features/client-agent/types.ts
- Imports (packages): zod
- Imported by: src/features/client-agent/runtime.ts, src/features/client-agent/tool-contracts.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.ts, src/features/client-agent/tools/search.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tool-contracts.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+5 more)
- Tests related (direct): src/features/client-agent/tool-contracts.test.ts
- Exports: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, SearchScopeRequestSchema, AdsOverviewRequestSchema, EventsOverviewRequestSchema, CampaignDetailsRequestSchema, EventDetailsRequestSchema, CreativeDetailsRequestSchema, … (+38 more)
- Symbol details: const DomainSchema (exported), const EntityTypeSchema (exported), const AdsMetricSchema (exported), const EventsMetricSchema (exported), const CompareMetricSchema (exported), const IntervalSchema (exported), const SearchScopeRequestSchema (exported), const AdsOverviewRequestSchema (exported), const EventsOverviewRequestSchema (exported), const CampaignDetailsRequestSchema (exported), const EventDetailsRequestSchema (exported), const CreativeDetailsRequestSchema (exported), const DemographicBreakdownRequestSchema (exported), const GeographyBreakdownRequestSchema (exported), const PlacementBreakdownRequestSchema (exported), const CompareEntitiesRequestSchema (exported), … (+8 more)
- Defines: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, adsOnlyMetrics, eventsOnlyMetrics, SearchScopeRequestSchema, AdsOverviewRequestSchema, EventsOverviewRequestSchema, CampaignDetailsRequestSchema, … (+52 more)
- Contents summary: exports: DomainSchema, EntityTypeSchema, AdsMetricSchema, EventsMetricSchema, CompareMetricSchema, IntervalSchema, SearchScopeRequestSchema, AdsOverviewRequestSchema; internal imports: 1; package imports: 1

## `src/features/client-agent/tools/breakdowns.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 157
- Bytes: 3880
- Imports (internal): src/features/client-agent/tools/breakdowns.ts, src/features/reports/server.ts, src/features/client-agent/readers.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent, src/features / reports
- Feature module: client-agent
- Symbol details: const broadScope, const lifetimeRange
- Defines: broadScope, lifetimeRange, result
- Tests / describe labels: breakdown tools, returns normalized demographic rows, returns normalized geography rows, returns normalized placement rows
- Contents summary: tests/describes: breakdown tools; returns normalized demographic rows; returns normalized geography rows; internal imports: 3; package imports: 1

## `src/features/client-agent/tools/breakdowns.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 320
- Bytes: 8960
- Imports (internal): src/features/reports/server.ts, src/features/client-agent/readers.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/types.ts
- Imported by: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/index.ts
- Depends on groups: src/features / reports, src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/tools/breakdowns.test.ts
- Exports: getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown
- Symbol details: function getDemographicBreakdown (exported), function getGeographyBreakdown (exported), function getPlacementBreakdown (exported), function toScopeFilter, function isCampaignAllowed, function toReportsRange, function loadScopedCampaignDetails, type ToolResult, type CampaignDetail
- Defines: toScopeFilter, isCampaignAllowed, toReportsRange, loadScopedCampaignDetails, getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown, requestedIds, details, request, rows, key, … (+10 more)
- Contents summary: exports: getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown; internal imports: 4

## `src/features/client-agent/tools/compare-timeseries.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 188
- Bytes: 4294
- Imports (internal): src/features/client-agent/tools/compare-timeseries.ts, src/features/reports/server.ts, src/features/client-agent/readers.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent, src/features / reports
- Feature module: client-agent
- Symbol details: const broadScope, const lifetimeRange
- Defines: broadScope, lifetimeRange, result
- Tests / describe labels: compare and timeseries tools, compares campaigns with a valid ads metric, returns a monthly spend series, compares creatives even when the member has broad campaign scope
- Contents summary: tests/describes: compare and timeseries tools; compares campaigns with a valid ads metric; returns a monthly spend series; internal imports: 3; package imports: 1

## `src/features/client-agent/tools/compare-timeseries.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 431
- Bytes: 12719
- Imports (internal): src/features/reports/server.ts, src/features/client-agent/readers.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/types.ts
- Imported by: src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/index.ts
- Depends on groups: src/features / reports, src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/tools/compare-timeseries.test.ts
- Exports: compareEntities, getTimeseries
- Symbol details: function compareEntities (exported), function getTimeseries (exported), function toScopeFilter, function isCampaignAllowed, function isEventAllowed, function loadVisibleCampaignIds, function toReportsRange, function sum, function filterByDateRange, function summarizeEventRange, function startOfWeek, function monthKey, function bucketKey, function groupSeries, type ToolResult, type EventDetail
- Defines: toScopeFilter, isCampaignAllowed, isEventAllowed, loadVisibleCampaignIds, toReportsRange, sum, filterByDateRange, summarizeEventRange, startOfWeek, monthKey, bucketKey, groupSeries, … (+29 more)
- Contents summary: exports: compareEntities, getTimeseries; internal imports: 4

## `src/features/client-agent/tools/details.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 205
- Bytes: 5374
- Imports (internal): src/features/client-agent/tools/details.ts, src/features/reports/server.ts, src/features/client-agent/readers.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent, src/features / reports
- Feature module: client-agent
- Symbol details: const broadScope, const lifetimeRange
- Defines: broadScope, lifetimeRange, result
- Tests / describe labels: detail tools, returns campaign details without inlining breakdown families, returns event details with range metrics and current snapshot fields, returns creative details scoped to allowed campaigns, returns creative details for broad client scope without explicit campaign ids
- Contents summary: tests/describes: detail tools; returns campaign details without inlining breakdown families; returns event details with range metrics and current snapshot fields; internal imports: 3; package imports: 1

## `src/features/client-agent/tools/details.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 308
- Bytes: 8882
- Imports (internal): src/features/reports/server.ts, src/features/client-agent/readers.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/types.ts
- Imported by: src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/index.ts
- Depends on groups: src/features / reports, src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/details.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/tools/details.test.ts
- Exports: getCampaignDetails, getEventDetails, getCreativeDetails
- Symbol details: function getCampaignDetails (exported), function getEventDetails (exported), function getCreativeDetails (exported), function toScopeFilter, function isCampaignAllowed, function isEventAllowed, function loadVisibleCampaignIds, function sum, function average, function filterByDateRange, function summarizeCampaignDaily, function summarizeEventRange, type ToolResult, type EventDetail
- Defines: toScopeFilter, isCampaignAllowed, isEventAllowed, loadVisibleCampaignIds, sum, average, filterByDateRange, summarizeCampaignDaily, summarizeEventRange, getCampaignDetails, getEventDetails, getCreativeDetails, … (+30 more)
- Contents summary: exports: getCampaignDetails, getEventDetails, getCreativeDetails; internal imports: 4

## `src/features/client-agent/tools/index.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 14
- Bytes: 376
- Imports (internal): src/features/client-agent/tools/search.ts, src/features/client-agent/tools/overview.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.ts
- Imported by: src/features/client-agent/runtime.test.ts, src/features/client-agent/runtime.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/runtime.test.ts
- Exports: searchScope, getAdsOverview, getEventsOverview, getCampaignDetails, getCreativeDetails, getEventDetails, getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown, compareEntities, getTimeseries
- Contents summary: exports: searchScope, getAdsOverview, getEventsOverview, getCampaignDetails, getCreativeDetails, getEventDetails, getDemographicBreakdown, getGeographyBreakdown; internal imports: 5

## `src/features/client-agent/tools/overview.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 123
- Bytes: 2954
- Imports (internal): src/features/client-agent/tools/overview.ts, src/features/reports/server.ts, src/features/client-agent/readers.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent, src/features / reports
- Feature module: client-agent
- Symbol details: const broadScope, const lifetimeRange
- Defines: broadScope, lifetimeRange, result
- Tests / describe labels: overview tools, returns normalized lifetime ads overview totals, returns normalized events overview totals
- Contents summary: tests/describes: overview tools; returns normalized lifetime ads overview totals; returns normalized events overview totals; internal imports: 3; package imports: 1

## `src/features/client-agent/tools/overview.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 292
- Bytes: 8810
- Imports (internal): src/features/reports/server.ts, src/features/client-agent/readers.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/types.ts
- Imported by: src/features/client-agent/tools/index.ts, src/features/client-agent/tools/overview.test.ts
- Depends on groups: src/features / reports, src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/overview.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/tools/overview.test.ts
- Exports: getAdsOverview, getEventsOverview
- Symbol details: function getAdsOverview (exported), function getEventsOverview (exported), function toScopeFilter, function isCampaignAllowed, function isEventAllowed, function toReportsRange, function sum, function average, function buildCampaignReference, function buildCreativeReference, function buildEventReference, function filterByDateRange, function summarizeEventRange, type ToolResult, type EventDetail
- Defines: toScopeFilter, isCampaignAllowed, isEventAllowed, toReportsRange, sum, average, buildCampaignReference, buildCreativeReference, buildEventReference, filterByDateRange, summarizeEventRange, getAdsOverview, … (+25 more)
- Contents summary: exports: getAdsOverview, getEventsOverview; internal imports: 4

## `src/features/client-agent/tools/search.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: test file
- Construction: test specification
- Lines: 134
- Bytes: 3339
- Imports (internal): src/features/client-agent/tools/search.ts, src/features/reports/server.ts, src/features/client-agent/readers.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-agent, src/features / reports
- Feature module: client-agent
- Symbol details: const broadScope
- Defines: broadScope, result
- Tests / describe labels: searchScope, searches campaigns, creatives, and events within scope, lists the full visible scope when the query is wildcarded, returns event chronology metadata for follow-up reasoning
- Contents summary: tests/describes: searchScope; searches campaigns, creatives, and events within scope; lists the full visible scope when the query is wildcarded; internal imports: 3; package imports: 1

## `src/features/client-agent/tools/search.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 146
- Bytes: 4302
- Imports (internal): src/features/reports/server.ts, src/features/client-agent/range.ts, src/features/client-agent/readers.ts, src/features/client-agent/types.ts, src/features/client-agent/tool-contracts.ts
- Imported by: src/features/client-agent/tools/index.ts, src/features/client-agent/tools/search.test.ts
- Depends on groups: src/features / reports, src/features / client-agent
- Used by groups: src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/features/client-agent/tools/search.test.ts
- Exports: searchScope
- Symbol details: function searchScope (exported), function toScopeFilter, function isCampaignAllowed, function isEventAllowed, function uniqueMatches, type SearchMatch, type ToolResult
- Defines: toScopeFilter, isCampaignAllowed, isEventAllowed, uniqueMatches, searchScope, seen, key, request, query, includeAllVisible, reports, searchRange, … (+9 more)
- Contents summary: exports: searchScope; internal imports: 5

## `src/features/client-agent/types.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-agent
- Ownership: feature module: client-agent
- Type: TypeScript module
- Construction: code module
- Lines: 144
- Bytes: 4327
- Imports (packages): zod
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/range.ts, src/features/client-agent/readers.ts, src/features/client-agent/runtime.ts, src/features/client-agent/server.ts, src/features/client-agent/store.test.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/tool-contracts.ts, … (+5 more)
- Used by groups: src/app / api, src/features / client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Routes related (direct): src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts
- Tests related: src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/range.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, … (+9 more)
- Tests related (direct): src/features/client-agent/store.test.ts
- Exports: AgentResponseStatusSchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryMessageSchema, MetricCardsBlockSchema, TableBlockSchema, ChartBlockSchema, AgentAnswerBlockSchema, AgentResponseStatus, ReferencedEntity, … (+4 more)
- Symbol details: const AgentResponseStatusSchema (exported), const ReferencedEntitySchema (exported), const ResolvedRangePresetSchema (exported), const ResolvedRangeSchema (exported), const ClientAgentScopeSchema (exported), const AgentHistoryMessageSchema (exported), const MetricCardsBlockSchema (exported), const TableBlockSchema (exported), const ChartBlockSchema (exported), const AgentAnswerBlockSchema (exported), const CampaignReferencedEntitySchema, const EventReferencedEntitySchema, const CreativeReferencedEntitySchema, const AgentHistoryContextPayloadSchema, const MetricCardSchema, const TableCellSchema, … (+8 more)
- Defines: AgentResponseStatusSchema, CampaignReferencedEntitySchema, EventReferencedEntitySchema, CreativeReferencedEntitySchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryContextPayloadSchema, AgentHistoryMessageSchema, MetricCardSchema, MetricCardsBlockSchema, … (+14 more)
- Contents summary: exports: AgentResponseStatusSchema, ReferencedEntitySchema, ResolvedRangePresetSchema, ResolvedRangeSchema, ClientAgentScopeSchema, AgentHistoryMessageSchema, MetricCardsBlockSchema, TableBlockSchema; package imports: 1
