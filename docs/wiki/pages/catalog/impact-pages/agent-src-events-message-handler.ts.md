# Impact: agent/src/events/message-handler.ts

Generated from the current working tree on 2026-04-10 21:27:09.

- Category: Agent runtime files
- Impact score: 9
- Ownership: agent event handling layer
- Feature module: none
- Route owners: none
- Imported by: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts
- Tests related: agent/src/events/message-handler.test.ts
- DB objects: calls
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: agent/src / root, agent/src / discord, agent/src / services, agent/src / utils
- Used by groups: agent/src / discord, agent/src / events
- Summary: exports: cleanForDiscord, chunkText, isChannelLocked, acquireChannelLock, releaseChannelLock, handleMessage; tests/describes: \|; internal imports: 5; package imports: 1
