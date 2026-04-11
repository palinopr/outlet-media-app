# agent/src / utils

Generated from the current working tree on 2026-04-10 21:27:09.

- Files: 4
- File kinds: TypeScript module (4)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `agent/src/utils/date-helpers.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / utils
- Ownership: agent utility layer
- Type: TypeScript module
- Construction: code module
- Lines: 22
- Bytes: 575
- Imported by: agent/src/utils/session-loader.ts
- Used by groups: agent/src / utils
- Exports: todayCST, yesterdayCST, tomorrowCST
- Symbol details: function todayCST (exported), function yesterdayCST (exported), function tomorrowCST (exported), function cstNow
- Defines: cstNow, todayCST, yesterdayCST, tomorrowCST, d
- Contents summary: exports: todayCST, yesterdayCST, tomorrowCST

## `agent/src/utils/error-helpers.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / utils
- Ownership: agent utility layer
- Type: TypeScript module
- Construction: code module
- Lines: 4
- Bytes: 108
- Imported by: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.ts, agent/src/services/queue-service.ts, agent/src/services/system-events-service.ts, agent/src/services/webhook-service.ts
- Used by groups: agent/src / discord, agent/src / events, agent/src / root, agent/src / services
- Tests related: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/queue-service.test.ts
- Exports: toErrorMessage
- Symbol details: function toErrorMessage (exported)
- Defines: toErrorMessage
- Contents summary: exports: toErrorMessage

## `agent/src/utils/prompt-formatters.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / utils
- Ownership: agent utility layer
- Type: TypeScript module
- Construction: code module
- Lines: 35
- Bytes: 1264
- Imports (internal): agent/src/utils/session-loader.ts
- Depends on groups: agent/src / utils
- Exports: campaignsSummary, eventsSummary
- Symbol details: function campaignsSummary (exported), function eventsSummary (exported)
- Defines: campaignsSummary, eventsSummary, status, spend, budget, roas, tickets
- Contents summary: exports: campaignsSummary, eventsSummary; internal imports: 1

## `agent/src/utils/session-loader.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / utils
- Ownership: agent utility layer
- Type: TypeScript module
- Construction: code module
- Lines: 101
- Bytes: 2630
- Imports (internal): agent/src/utils/date-helpers.ts
- Imports (packages): node:fs/promises, node:path, node:url
- Imported by: agent/src/utils/prompt-formatters.ts
- Depends on groups: agent/src / utils
- Used by groups: agent/src / utils
- Exports: loadEvents, loadCampaigns, categorizeEvents, EventData, CampaignData
- Symbol details: function loadEvents (exported), function loadCampaigns (exported), function categorizeEvents (exported), const __dir, const SESSION_DIR, interface EventData (exported), interface CampaignData (exported)
- Defines: loadEvents, loadCampaigns, categorizeEvents, __dir, SESSION_DIR, filePath, raw, t, y, tm, d, EventData, … (+1 more)
- Contents summary: exports: loadEvents, loadCampaigns, categorizeEvents, EventData, CampaignData; internal imports: 1; package imports: 3
