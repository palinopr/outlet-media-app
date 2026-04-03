# Agent Simplification Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 11 persona-based agents with a single operations agent — one prompt, no cron, no delegation.

**Architecture:** All Discord messages route to one agent prompt via a simplified router. Claude CLI spawns per-message with 10 messages of Discord history as context. Agent reads/writes MEMORY.md for persistent context.

**Tech Stack:** Discord.js, Claude CLI (via runner.ts), Meta Graph API, Gmail/Calendar session scripts, Supabase REST.

**Spec:** `docs/superpowers/specs/2026-04-03-agent-simplification-design.md`

---

## Chunk 1: Core Replacement

### Task 1: Write the single agent prompt

**Files:**
- Modify: `agent/prompts/agent.txt` (already exists from prototype, needs MEMORY.md write instruction)

- [ ] **Step 1: Update agent.txt with MEMORY.md write instruction**

Add after the Rules section:

```
## Memory

Before answering any message, read MEMORY.md for current context.

When you learn something important (strategy change, budget decision, client update, new contact, deadline), update MEMORY.md with a short entry. Keep it concise — bullet points, not paragraphs.
```

- [ ] **Step 2: Verify prompt is complete**

Check that agent.txt has all sections: identity, credentials, Meta Ads, Email, Calendar, Database, client aliases, rules, memory, data conventions.

- [ ] **Step 3: Commit**

```bash
git add agent/prompts/agent.txt
git commit -m "feat(agent): write single unified agent prompt"
```

---

### Task 2: Replace router

**Files:**
- Modify: `agent/src/discord/core/router.ts`

- [ ] **Step 1: Replace router.ts with simplified version**

Replace entire file with:

```typescript
export interface AgentConfig {
  promptFile: string;
  maxTurns: number;
  description: string;
  readOnly?: boolean;
}

const AGENT: AgentConfig = {
  promptFile: "agent",
  maxTurns: 25,
  description: "outlet-agent",
};

const READ_ONLY: AgentConfig = {
  promptFile: "agent",
  maxTurns: 5,
  description: "read-only",
  readOnly: true,
};

const READ_ONLY_CHANNELS = new Set([
  "agent-feed",
  "morning-briefing",
  "email-log",
  "approvals",
  "audit-log",
]);

export function getAgentForChannel(channelName: string): AgentConfig {
  if (READ_ONLY_CHANNELS.has(channelName)) return READ_ONLY;
  return AGENT;
}

export function hasAgentRoute(): boolean {
  return true;
}

export function isInternalChannel(): boolean {
  return false;
}

export function isConfigChannel(): boolean {
  return false;
}
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/discord/core/router.ts
git commit -m "refactor(agent): simplify router to single agent"
```

---

### Task 3: Simplify message handler

**Files:**
- Modify: `agent/src/events/message-handler.ts`

- [ ] **Step 1: Replace message-handler.ts**

Strip out: delegation processing, resource locks, per-agent memory sync, per-agent skills sync, agent activity logging, buildSystemPrompt (no snapshot injection, no memory merge — agent reads MEMORY.md itself via Claude CLI), postProcess, logActivity, withResourceLocks wrapper.

Remove ALL of these imports:
- `delegate.js` (processDelegations, processChannelMessages)
- `memory.js` (loadAgentMemory, maybeUpdateMemory)
- `skills.js` (maybeCreateSkill)
- `agent-resource-locks.js` (getInteractiveRouteResources, getDelegatedTaskResources)
- `system-events-service.js` (logDiscordAgentTurn)
- `state.js` (ResourceBusyError, withResourceLocks)
- `admin.js` (buildAdminPrompt)

Simplify `handleMessage()` to: lock channel → build context → runClaude → deliver response → unlock.

- [ ] **Step 2: Run type-check**

```bash
cd agent && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add agent/src/events/message-handler.ts
git commit -m "refactor(agent): simplify message handler — no delegation, no memory sync"
```

---

### Task 4: Rewrite entry.ts

**Files:**
- Modify: `agent/src/discord/core/entry.ts`

**CRITICAL:** This file has ~12 imports from modules being deleted. It must be rewritten to only keep: Discord client setup, webhook init, queue init, slash command registration, simplified messageCreate handler, notifyChannel helper, stale lock detection.

- [ ] **Step 1: Rewrite entry.ts**

Remove ALL of these imports and calls from the `ready` handler:
- `initScheduleJobs` from `../commands/schedule.js`
- `initApprovals` from `../../services/approval-service.js`
- `routeMessage` from `./command-router.js`
- `bindDelegationTaskExecutor` from `../../agents/delegate.js`
- `startExternalTaskDispatcher` from `../../services/external-task-dispatcher.js`
- `initTriggers` from `../../events/trigger-handler.js`
- `initSpawner` from `../../agents/spawner.js`
- `initStatus` from `../../services/status-service.js`
- `initDiscordAdmin` from `../commands/admin.js`
- `getJobRunners` from `../../scheduler.js`
- `registerButtonHandler` from `../features/buttons.js`

Replace the `ready` handler with:
1. `initQueue()`
2. `initWebhooks(discordClient)`
3. `registerSlashCommands(token)` + `registerSlashHandler(discordClient)`

Replace the `messageCreate` handler — instead of calling `routeMessage`, wire directly to the simplified `handleMessage`:
```typescript
import { handleMessage, isChannelLocked } from "../../events/message-handler.js";
import { getAgentForChannel } from "./router.js";

discordClient.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  const channelName = "name" in msg.channel ? (msg.channel as TextChannel).name : "dm";
  const agent = getAgentForChannel(channelName);
  if (agent.readOnly) return;
  if (isChannelLocked(msg.channelId)) {
    checkAndReleaseStaleLock(msg.channelId);
    if (isChannelLocked(msg.channelId)) return;
  }
  const content = msg.content.trim();
  if (!content) return;
  await handleMessage(msg, content, channelName, discordClient);
});
```

Keep: `notifyChannel()`, `discordClient`, `channelSessions`, stale lock functions. Remove CHANNEL_ROUTES aliases (simplify to just looking up by channel name).

- [ ] **Step 2: Run type-check**

```bash
cd agent && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add agent/src/discord/core/entry.ts
git commit -m "refactor(agent): rewrite entry.ts — remove deleted module imports"
```

---

### Task 5: Simplify slash commands

**Files:**
- Modify: `agent/src/discord/commands/slash.ts`

- [ ] **Step 1: Strip slash.ts to 3 commands**

Keep only `/status`, `/help`, `/reset`. Remove: `/supervise`, `/ops`, `/dashboard`, `/schedule`, `/schedule-budget`, `/schedule-copy-swap`, `/roles`, `/threads`, `/publish-confirm`, `/publish-fail`.

Update `/help` response text to reflect the simplified agent (no sweep commands, no bang commands, no multi-agent).

- [ ] **Step 2: Run type-check**

```bash
cd agent && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add agent/src/discord/commands/slash.ts
git commit -m "refactor(agent): keep only /status, /help, /reset slash commands"
```

---

## Chunk 2: Delete Dead Code

### Task 6: Delete old prompts, memory, skills

**Files:**
- Delete: all prompt files except `agent.txt` (17 files)
- Delete: `agent/memory/` (entire directory, 15 files)
- Delete: `agent/skills/` (entire directory, 13 subdirectories)

- [ ] **Step 1: Delete files**

```bash
cd agent
ls prompts/*.txt | grep -v agent.txt | xargs rm
rm -rf memory/ skills/
```

- [ ] **Step 2: Commit**

```bash
git add -A agent/prompts/ agent/memory/ agent/skills/
git commit -m "refactor(agent): delete 17 old prompts, per-agent memory and skills"
```

---

### Task 7: Delete dead source files

**Files to delete:**

Scheduler & jobs:
- `agent/src/scheduler.ts`
- `agent/src/jobs/` (entire directory: `cron-sweeps.ts`, `creative-classify.ts`)

Agents:
- `agent/src/agents/delegate.ts`
- `agent/src/agents/spawner.ts`

Events:
- `agent/src/events/trigger-handler.ts`
- `agent/src/events/inspect-handler.ts`

Discord core:
- `agent/src/discord/core/command-router.ts`
- `agent/src/discord/core/access.ts`
- `agent/src/discord/core/message-prompt.ts`

Discord commands:
- `agent/src/discord/commands/admin.ts`
- `agent/src/discord/commands/schedule.ts`
- `agent/src/discord/commands/dashboard.ts`
- `agent/src/discord/commands/ops.ts`
- `agent/src/discord/commands/supervisor.ts`
- `agent/src/discord/commands/growth-publish.ts`

Discord features (entire directory):
- `agent/src/discord/features/` (`buttons.ts`, `memory.ts`, `skills.ts`, `threads.ts`, `restructure.ts`)

Services:
- `agent/src/services/approval-service.ts`
- `agent/src/services/status-service.ts`
- `agent/src/services/agent-resource-locks.ts`
- `agent/src/services/external-task-dispatcher.ts`
- `agent/src/services/owner-discord-service.ts`
- `agent/src/services/scheduled-handoff-service.ts`
- `agent/src/services/meta-copy-swap-service.ts`
- `agent/src/services/email-intelligence-service.ts`
- `agent/src/services/email-classify.ts`
- `agent/src/services/gmail-watch-service.ts`
- `agent/src/services/calendar-service.ts`

State:
- `agent/src/state.ts`
- `agent/src/services/runtime-state.ts`

Growth (entire directory):
- `agent/src/growth/` (`contracts.ts` and anything else)

Growth ledgers:
- `agent/src/services/growth-ledger-types.ts`
- `agent/src/services/growth-ledger-service.ts`
- `agent/src/services/growth-ledger-writers.ts`
- `agent/src/services/growth-ledger-resolve.ts`
- `agent/src/services/ledger-service.ts`

Other:
- `agent/src/services/email-types.ts`

- [ ] **Step 1: Delete all dead source files**

```bash
cd agent/src
rm -f scheduler.ts state.ts
rm -rf jobs/
rm -f agents/delegate.ts agents/spawner.ts
rm -f events/trigger-handler.ts events/inspect-handler.ts
rm -f discord/core/command-router.ts discord/core/access.ts discord/core/message-prompt.ts
rm -f discord/commands/admin.ts discord/commands/schedule.ts discord/commands/dashboard.ts discord/commands/ops.ts discord/commands/supervisor.ts discord/commands/growth-publish.ts
rm -rf discord/features/
rm -f services/approval-service.ts services/status-service.ts services/agent-resource-locks.ts services/external-task-dispatcher.ts
rm -f services/owner-discord-service.ts services/scheduled-handoff-service.ts services/meta-copy-swap-service.ts
rm -f services/email-intelligence-service.ts services/email-classify.ts
rm -f services/gmail-watch-service.ts services/calendar-service.ts
rm -f services/runtime-state.ts
rm -rf growth/
rm -f services/growth-ledger-types.ts services/growth-ledger-service.ts services/growth-ledger-writers.ts services/growth-ledger-resolve.ts services/ledger-service.ts
rm -f services/email-types.ts
```

- [ ] **Step 2: Delete empty directories**

```bash
find agent/src -type d -empty -delete
```

- [ ] **Step 3: Commit**

```bash
git add -A agent/src/
git commit -m "refactor(agent): delete scheduler, delegation, sweeps, growth, and dead services"
```

---

### Task 8: Delete dead test files

**Keep these tests** (they test kept modules):
- `agent/src/runner.test.ts` — tests Claude CLI spawning (runner.ts is kept)
- `agent/src/services/queue-service.test.ts` — tests queue service (kept)

**Delete these tests** (they test deleted modules):
- `agent/src/scheduler.test.ts`
- `agent/src/agents/delegate.test.ts`
- `agent/src/discord/core/command-router.test.ts`
- `agent/src/discord/core/message-prompt.test.ts`
- `agent/src/discord/commands/ops.test.ts`
- `agent/src/discord/commands/growth-publish.test.ts`
- `agent/src/services/email-classify.test.ts`
- `agent/src/services/scheduled-handoff-service.test.ts`
- `agent/src/services/meta-copy-swap-service.test.ts`
- `agent/src/events/message-handler.test.ts`

- [ ] **Step 1: Delete dead test files**

```bash
cd agent/src
rm -f scheduler.test.ts
rm -f agents/delegate.test.ts
rm -f discord/core/command-router.test.ts discord/core/message-prompt.test.ts
rm -f discord/commands/ops.test.ts discord/commands/growth-publish.test.ts
rm -f services/email-classify.test.ts services/scheduled-handoff-service.test.ts services/meta-copy-swap-service.test.ts
rm -f events/message-handler.test.ts
```

- [ ] **Step 2: Run type-check and tests**

```bash
cd agent && npx tsc --noEmit
cd .. && npm test
```

- [ ] **Step 3: Commit**

```bash
git add -A agent/
git commit -m "refactor(agent): delete tests for removed modules"
```

---

### Task 9: Clean up prototype files and check system-events-service

**Files:**
- Delete: `agent/src/index-v2.ts`
- Delete: `agent/src/discord/core/router-v2.ts`
- Delete: `agent/src/events/message-handler-v2.ts`
- Check: `agent/src/services/system-events-service.ts` — keep if `email-gmail.ts` still imports it, delete if no remaining consumers

- [ ] **Step 1: Delete v2 prototype files**

```bash
rm -f agent/src/index-v2.ts agent/src/discord/core/router-v2.ts agent/src/events/message-handler-v2.ts
```

- [ ] **Step 2: Check system-events-service consumers**

```bash
grep -rn "system-events-service" agent/src/ --include="*.ts" | grep -v test | grep -v "system-events-service.ts"
```

If only `email-gmail.ts` imports it, keep it. If no consumers, delete it.

- [ ] **Step 3: Commit**

```bash
git add -A agent/src/
git commit -m "chore(agent): remove v2 prototype files"
```

---

### Task 10: Simplify webhook service to one identity

**Files:**
- Modify: `agent/src/services/webhook-service.ts`

- [ ] **Step 1: Simplify webhook-service.ts**

The current webhook service manages per-agent identities (Boss, Media Buyer, Creative, etc. — each with different name and avatar). Replace with a single "Outlet Agent" identity. Remove all persona mappings. The `sendAsAgent()` function should still work but always post as the same identity regardless of the `agentKey` parameter.

- [ ] **Step 2: Run type-check**

```bash
cd agent && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add agent/src/services/webhook-service.ts
git commit -m "refactor(agent): simplify webhook service to single Outlet Agent identity"
```

---

### Task 11: Remove unused dependencies

**Files:**
- Modify: `agent/package.json`

- [ ] **Step 1: Remove grammy and node-cron**

```bash
cd agent && npm uninstall grammy node-cron @types/node-cron
```

- [ ] **Step 2: Commit**

```bash
git add agent/package.json agent/package-lock.json
git commit -m "chore(agent): remove grammy and node-cron dependencies"
```

---

## Chunk 3: Verify & Ship

### Task 12: Final verification

- [ ] **Step 1: Run agent type-check**

```bash
cd agent && npx tsc --noEmit
```

Fix any remaining import errors from deleted files.

- [ ] **Step 2: Run web type-check**

```bash
npm run type-check
```

- [ ] **Step 3: Run web tests**

```bash
npm test
```

- [ ] **Step 4: Verify file count reduction**

```bash
find agent/src -type f -name '*.ts' | wc -l
# Should be ~15 or fewer (down from 62)
```

- [ ] **Step 5: Verify prompt count**

```bash
ls agent/prompts/
# Should show only agent.txt
```

- [ ] **Step 6: Push and deploy**

```bash
git push origin main
railway up --detach
```
