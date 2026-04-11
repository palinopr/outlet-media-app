# agent/src / events

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 2
- File kinds: test file (1), TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `agent/src/events/message-handler.test.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / events
- Ownership: agent event handling layer
- Type: test file
- Construction: test specification
- Lines: 145
- Bytes: 4560
- Imports (internal): agent/src/events/message-handler.ts, agent/src/runner.ts, agent/src/discord/core/router.ts, agent/src/services/webhook-service.ts, agent/src/discord/core/entry.ts
- Imports (packages): vitest, discord.js
- Depends on groups: agent/src / events, agent/src / root, agent/src / discord, agent/src / services
- Symbol details: function makeMessage, const mocks
- Defines: makeMessage, mocks, runClaude, sendAsAgent, getAgentForChannel, channelSessions, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, working, reply, channel, … (+4 more)
- Tests / describe labels: message-handler, acquires the channel lock before live processing and releases it after, stores the claude session id and resumes follow-up turns in the same channel
- Contents summary: tests/describes: message-handler; acquires the channel lock before live processing and releases it after; stores the claude session id and resumes follow-up turns in the same channel; internal imports: 5; package imports: 2

## `agent/src/events/message-handler.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / events
- Ownership: agent event handling layer
- Type: TypeScript module
- Construction: code module
- Lines: 220
- Bytes: 6872
- Imports (internal): agent/src/runner.ts, agent/src/discord/core/entry.ts, agent/src/discord/core/router.ts, agent/src/services/webhook-service.ts, agent/src/utils/error-helpers.ts
- Imports (packages): discord.js
- Imported by: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts
- Depends on groups: agent/src / root, agent/src / discord, agent/src / services, agent/src / utils
- Used by groups: agent/src / discord, agent/src / events
- Tests related: agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/events/message-handler.test.ts
- Exports: cleanForDiscord, chunkText, isChannelLocked, acquireChannelLock, releaseChannelLock, handleMessage
- Symbol details: function cleanForDiscord (exported), function chunkText (exported), function isChannelLocked (exported), function acquireChannelLock (exported), function releaseChannelLock (exported), function handleMessage (exported), function summarizeHistoryAttachments, function buildConversationContext, function deliverResponse, const channelLocks, const HISTORY_DEPTH
- Defines: cleanForDiscord, chunkText, summarizeHistoryAttachments, isChannelLocked, acquireChannelLock, releaseChannelLock, buildConversationContext, deliverResponse, handleMessage, channelLocks, HISTORY_DEPTH, names, … (+22 more)
- Tests / describe labels: \|
- Contents summary: exports: cleanForDiscord, chunkText, isChannelLocked, acquireChannelLock, releaseChannelLock, handleMessage; tests/describes: \|; internal imports: 5; package imports: 1
