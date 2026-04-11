# Impact: agent/src/discord/core/entry.ts

Generated from the current working tree on 2026-04-10 21:51:44.

- Category: Agent runtime files
- Impact score: 17
- Ownership: agent Discord adapter layer
- Feature module: none
- Route owners: none
- Imported by: agent/src/discord/commands/slash.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts
- Tests related: agent/src/events/message-handler.test.ts
- DB objects: notifications
- Env vars: DISCORD_TOKEN, DISCORD_CHANNEL_ID
- Mutation symbols: startDiscordBot, stopDiscordRuntimeState
- Auth signals: none
- Behavior signals: none
- Depends on groups: agent/src / services, agent/src / events, agent/src / discord, agent/src / root, agent/src / utils
- Used by groups: agent/src / discord, agent/src / events, agent/src / root
- Summary: exports: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, notifyChannel, discordClient; internal imports: 9; package imports: 1
