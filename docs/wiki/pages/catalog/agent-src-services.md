# agent/src / services

Generated from the current working tree on 2026-04-10 21:27:09.

- Files: 9
- File kinds: TypeScript module (6), test file (3)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `agent/src/services/queue-service.test.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: test file
- Construction: test specification
- Lines: 260
- Bytes: 7928
- Imports (internal): agent/src/services/queue-service.ts, agent/src/services/system-events-service.ts
- Imports (packages): vitest, @supabase/supabase-js
- Depends on groups: agent/src / services
- Defines: queue, firstTaskDone, first, second, task, terminal, runningEq, updateEq, pendingOrder, update, upsert, select
- Tests / describe labels: queue-service, runs queued tasks through the registered executor one at a time per target agent, waits for a task to reach a terminal state, defers a task and retries it without failing the queue slot, recovers pending web-admin tasks and retires unsupported gmail-push tasks, polls newly persisted web-admin tasks after startup
- Contents summary: tests/describes: queue-service; runs queued tasks through the registered executor one at a time per target agent; waits for a task to reach a terminal state; internal imports: 2; package imports: 2

## `agent/src/services/queue-service.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: TypeScript module
- Construction: code module
- Lines: 681
- Bytes: 19750
- Imports (internal): agent/src/services/system-events-service.ts, agent/src/utils/error-helpers.ts
- Imports (packages): @supabase/supabase-js, node:events
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts
- Depends on groups: agent/src / services, agent/src / utils
- Used by groups: agent/src / discord, agent/src / services
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts
- Exports: setTaskExecutor, stopPersistedTaskPoller, pollPersistedTasksNow, initQueue, enqueueTask, completeTask, failTask, escalateTask, approveTask, rejectTask, deferTask, waitForTaskTerminal, … (+6 more)
- Symbol details: function setTaskExecutor (exported), function stopPersistedTaskPoller (exported), function pollPersistedTasksNow (exported), function initQueue (exported), function enqueueTask (exported), function completeTask (exported), function failTask (exported), function escalateTask (exported), function approveTask (exported), function rejectTask (exported), function deferTask (exported), function waitForTaskTerminal (exported), function isAgentFree (exported), function getQueueDepth (exported), function getActiveTasks (exported), function pruneTaskRegistry (exported), … (+8 more)
- Defines: retirePendingTask, reviveTask, toTimelineTask, runTask, clearTaskTimeout, clearTaskRetry, clearTaskRetryState, setTaskExecutor, stopPersistedTaskPoller, fetchPendingPersistedTasks, pollPersistedTasksNow, startPersistedTaskPoller, … (+61 more)
- Tests / describe labels: queued, started, completed, failed, escalated, approved, rejected, deferred
- Contents summary: exports: setTaskExecutor, stopPersistedTaskPoller, pollPersistedTasksNow, initQueue, enqueueTask, completeTask, failTask, escalateTask; tests/describes: queued; started; completed; internal imports: 2; package imports: 2

## `agent/src/services/runtime-state-service.test.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: test file
- Construction: test specification
- Lines: 57
- Bytes: 1490
- Imports (internal): agent/src/services/runtime-state-service.ts
- Imports (packages): vitest, @supabase/supabase-js
- Depends on groups: agent/src / services
- Defines: upsert, runtimeState
- Tests / describe labels: runtime-state-service, writes online and offline heartbeat state to agent_runtime_state
- Contents summary: tests/describes: runtime-state-service; writes online and offline heartbeat state to agent_runtime_state; internal imports: 1; package imports: 2

## `agent/src/services/runtime-state-service.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: TypeScript module
- Construction: code module
- Lines: 57
- Bytes: 1541
- Imports (packages): @supabase/supabase-js
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/runtime-state-service.test.ts
- Used by groups: agent/src / discord, agent/src / services
- Tests related: agent/src/services/runtime-state-service.test.ts, agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/services/runtime-state-service.test.ts
- Exports: writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat
- Symbol details: function writeRuntimeHeartbeat (exported), function startRuntimeHeartbeat (exported), function stopRuntimeHeartbeat (exported), function getHeartbeatClient, const HEARTBEAT_INTERVAL_MS
- Defines: getHeartbeatClient, writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat, HEARTBEAT_INTERVAL_MS, url, key, client
- Contents summary: exports: writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat; package imports: 1

## `agent/src/services/supabase-service.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: TypeScript module
- Construction: code module
- Lines: 15
- Bytes: 457
- Imports (packages): @supabase/supabase-js
- Imported by: agent/src/services/system-events-service.ts
- Used by groups: agent/src / services
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Exports: getServiceSupabase
- Symbol details: function getServiceSupabase (exported)
- Defines: getServiceSupabase, url, key
- Contents summary: exports: getServiceSupabase; package imports: 1

## `agent/src/services/system-events-service.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: TypeScript module
- Construction: code module
- Lines: 549
- Bytes: 17806
- Imports (internal): agent/src/services/supabase-service.ts, agent/src/utils/error-helpers.ts
- Imported by: agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts
- Depends on groups: agent/src / services, agent/src / utils
- Used by groups: agent/src / services
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/services/queue-service.test.ts
- Exports: logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, safeLogAgentTaskRequested, safeLogAgentTaskStarted, safeLogAgentTaskDeferred, safeLogAgentTaskStatus, logDiscordAgentTurn, AGENT_ACTIVITY_EVENT_NAMES, … (+8 more)
- Symbol details: function logAgentSystemEvent (exported), function safeLogAgentSystemEvent (exported), function listAgentSystemEvents (exported), function listRecentAgentActivity (exported), function formatAgentActivityLine (exported), function buildAgentActivityDigest (exported), function safeLogAgentTaskRequested (exported), function safeLogAgentTaskStarted (exported), function safeLogAgentTaskDeferred (exported), function safeLogAgentTaskStatus (exported), function logDiscordAgentTurn (exported), function clipText, function normalizeOccurredAt, function metadataString, function isEnvelopeSchemaError, function isIdempotencyConflict, … (+8 more)
- Defines: clipText, normalizeOccurredAt, metadataString, isEnvelopeSchemaError, isIdempotencyConflict, mapSystemEventRow, logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, matchesKeywords, listRecentAgentActivity, formatAgentActivityLine, … (+41 more)
- Contents summary: exports: logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, safeLogAgentTaskRequested, safeLogAgentTaskStarted; internal imports: 2

## `agent/src/services/web-task-executor.test.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: test file
- Construction: test specification
- Lines: 85
- Bytes: 2160
- Imports (internal): agent/src/services/web-task-executor.ts, agent/src/runner.ts, agent/src/services/queue-service.ts
- Imports (packages): vitest
- Depends on groups: agent/src / services, agent/src / root
- Symbol details: const mocks
- Defines: mocks, execute
- Tests / describe labels: web-task-executor, runs a web-admin task with the canned agent prompt when no prompt is provided, fails retired gmail-push tasks instead of executing them
- Contents summary: tests/describes: web-task-executor; runs a web-admin task with the canned agent prompt when no prompt is provided; fails retired gmail-push tasks instead of executing them; internal imports: 3; package imports: 1

## `agent/src/services/web-task-executor.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: TypeScript module
- Construction: code module
- Lines: 91
- Bytes: 2447
- Imports (internal): agent/src/runner.ts, agent/src/services/queue-service.ts
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/web-task-executor.test.ts
- Depends on groups: agent/src / root, agent/src / services
- Used by groups: agent/src / discord, agent/src / services
- Tests related: agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/services/web-task-executor.test.ts
- Exports: executeWebTask, createWebTaskExecutor
- Symbol details: function executeWebTask (exported), function createWebTaskExecutor (exported), function isSupportedWebAgent, function resolveTaskPrompt, const DEFAULT_PROMPTS, type SupportedWebAgent
- Defines: isSupportedWebAgent, resolveTaskPrompt, executeWebTask, createWebTaskExecutor, DEFAULT_PROMPTS, prompt, spec, result, SupportedWebAgent
- Contents summary: exports: executeWebTask, createWebTaskExecutor; internal imports: 2

## `agent/src/services/webhook-service.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / services
- Ownership: agent runtime service layer
- Type: TypeScript module
- Construction: code module
- Lines: 184
- Bytes: 5051
- Imports (internal): agent/src/utils/error-helpers.ts
- Imports (packages): discord.js
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts
- Depends on groups: agent/src / utils
- Used by groups: agent/src / discord, agent/src / events
- Tests related: agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/events/message-handler.test.ts
- Exports: initWebhooks, sendAsAgent
- Symbol details: function initWebhooks (exported), function sendAsAgent (exported), function withWebhookInitTimeout, function ensureWebhook, const WEBHOOK_CACHE_TTL_MS, const WEBHOOK_INIT_TIMEOUT_MS, const WEBHOOK_NAME, const AGENT_DISPLAY_NAME, const AGENT_AVATAR_URL, const webhookCache, interface CachedWebhook
- Defines: withWebhookInitTimeout, initWebhooks, ensureWebhook, sendAsAgent, WEBHOOK_CACHE_TTL_MS, WEBHOOK_INIT_TIMEOUT_MS, WEBHOOK_NAME, AGENT_DISPLAY_NAME, AGENT_AVATAR_URL, webhookCache, guild, textChannels, … (+9 more)
- Contents summary: exports: initWebhooks, sendAsAgent; internal imports: 1; package imports: 1
