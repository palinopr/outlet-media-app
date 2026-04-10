# agent/src / discord

Generated from the current working tree on 2026-04-10 18:02:26.

- Files: 3
- File kinds: TypeScript module (3)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `agent/src/discord/commands/slash.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / discord
- Ownership: agent Discord adapter layer
- Type: TypeScript module
- Construction: code module
- Lines: 116
- Bytes: 3673
- Imports (internal): agent/src/utils/error-helpers.ts, agent/src/events/message-handler.ts, agent/src/discord/core/entry.ts
- Imports (packages): discord.js
- Imported by: agent/src/discord/core/entry.ts
- Depends on groups: agent/src / utils, agent/src / events, agent/src / discord
- Used by groups: agent/src / discord
- Tests related: agent/src/events/message-handler.test.ts
- Exports: registerSlashCommands, registerSlashHandler
- Symbol details: function registerSlashCommands (exported), function registerSlashHandler (exported), function buildHelpText, const CLIENT_ID, const GUILD_ID, const commands
- Defines: registerSlashCommands, registerSlashHandler, buildHelpText, CLIENT_ID, GUILD_ID, commands, rest, msg, cmd, busy, Client, ChatInputCommandInteraction
- Contents summary: exports: registerSlashCommands, registerSlashHandler; internal imports: 3; package imports: 1

## `agent/src/discord/core/entry.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / discord
- Ownership: agent Discord adapter layer
- Type: TypeScript module
- Construction: code module
- Lines: 181
- Bytes: 6064
- Imports (internal): agent/src/services/webhook-service.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.ts, agent/src/services/web-task-executor.ts, agent/src/events/message-handler.ts, agent/src/discord/core/router.ts, agent/src/runner.ts, agent/src/utils/error-helpers.ts, agent/src/discord/commands/slash.ts
- Imports (packages): discord.js
- Imported by: agent/src/discord/commands/slash.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts
- Depends on groups: agent/src / services, agent/src / events, agent/src / discord, agent/src / root, agent/src / utils
- Used by groups: agent/src / discord, agent/src / events, agent/src / root
- Tests related: agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/events/message-handler.test.ts
- Exports: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, notifyChannel, discordClient, channelSessions
- Symbol details: function checkAndReleaseStaleLock (exported), function markChannelLockAcquired (exported), function markChannelLockHeartbeat (exported), function markChannelLockReleased (exported), function startDiscordBot (exported), function stopDiscordRuntimeState (exported), function notifyChannel (exported), function resolveChannelId, const discordClient (exported), const channelSessions (exported), const token, const channelId, const channelLockTimestamps, const CHANNEL_LOCK_MAX_AGE_MS, const channelIdCache
- Defines: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, resolveChannelId, notifyChannel, token, channelId, discordClient, channelSessions, … (+17 more)
- Contents summary: exports: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, notifyChannel, discordClient; internal imports: 9; package imports: 1

## `agent/src/discord/core/router.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / discord
- Ownership: agent Discord adapter layer
- Type: TypeScript module
- Construction: code module
- Lines: 45
- Bytes: 811
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts
- Used by groups: agent/src / discord, agent/src / events
- Tests related: agent/src/events/message-handler.test.ts
- Tests related (direct): agent/src/events/message-handler.test.ts
- Exports: getAgentForChannel, hasAgentRoute, isInternalChannel, isConfigChannel, AgentConfig
- Symbol details: function getAgentForChannel (exported), function hasAgentRoute (exported), function isInternalChannel (exported), function isConfigChannel (exported), const READ_ONLY_CHANNELS, interface AgentConfig (exported)
- Defines: getAgentForChannel, hasAgentRoute, isInternalChannel, isConfigChannel, READ_ONLY_CHANNELS, AgentConfig
- Contents summary: exports: getAgentForChannel, hasAgentRoute, isInternalChannel, isConfigChannel, AgentConfig
