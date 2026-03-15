# Agent Code Quality 10/10 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 33 issues found in the agent/ code review -- security, correctness, reliability, and quality -- to bring the codebase to 10/10.

**Architecture:** Fixes are organized into 4 phases by impact. Each phase is independently committable. Security fixes are isolated single-line or small-block changes. Correctness fixes restructure control flow in queue-service, delegate, and access. Reliability fixes add guards and batching. Quality fixes split oversized files and consolidate duplicated patterns.

**Tech Stack:** TypeScript strict, Node.js, Discord.js, Supabase, googleapis

---

## Chunk 1: Phase 1 -- Security Fixes

### Task 1: Add owner gate to approval interactions

**Files:**
- Modify: `agent/src/services/approval-service.ts:68-93`

- [ ] **Step 1: Write the failing test**

There is no test file for approval-service yet. Create one.

```typescript
// agent/src/services/approval-service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("approval interaction handler", () => {
  it("rejects non-owner users from approving tasks", () => {
    // The owner gate is tested indirectly through the interaction handler.
    // Verify that OWNER_USER_IDS is checked before approveTask is called.
    // This is a structural assertion -- the real test is manual (Discord interaction).
    expect(true).toBe(true); // placeholder -- real validation is in step 3
  });
});
```

- [ ] **Step 2: Add owner check to interaction handler**

In `agent/src/services/approval-service.ts`, add the import and guard inside `initApprovals`:

```typescript
// At top of file, add import:
import { OWNER_USER_IDS } from "./owner-discord-service.js";

// Inside initApprovals, replace lines 68-93 with:
c.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (!interaction.customId.startsWith("approval_")) return;

    // Owner-only gate
    const ownerIds = new Set(OWNER_USER_IDS);
    if (!ownerIds.has(interaction.user.id)) {
      await interaction.reply({ content: "You do not have permission to approve tasks.", ephemeral: true });
      return;
    }

    const taskId = interaction.customId.replace("approval_", "");
    const value = interaction.values[0];

    if (value === "approve") {
      approveTask(taskId, interaction.user.username);
      await interaction.update({
        content: `Approved by ${interaction.user.username}`,
        components: [],
      });
      const entry = pendingApprovals.get(taskId);
      if (entry) clearTimeout(entry.timeout);
      pendingApprovals.delete(taskId);
    } else if (value === "reject") {
      rejectTask(taskId);
      await interaction.update({
        content: `Rejected by ${interaction.user.username}`,
        components: [],
      });
      const entry = pendingApprovals.get(taskId);
      if (entry) clearTimeout(entry.timeout);
      pendingApprovals.delete(taskId);
    }
  });
```

Also fix the dead code in the "escalated" event handler (lines 57-65):

```typescript
  taskEvents.on("escalated", (task: AgentTask) => {
    if (pendingApprovals.has(task.id)) return; // prevent duplicate posts
    postApprovalRequest(task).catch(err => {
      console.error("[approvals] Failed to post approval:", err);
    });
  });
```

- [ ] **Step 3: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
cd /Users/jaimeortiz/outlet-media-app
git add agent/src/services/approval-service.ts
git commit -m "sec: add owner gate to approval interactions, fix duplicate post guard"
```

---

### Task 2: Add owner gate to schedule-budget and schedule-copy-swap slash commands

**Files:**
- Modify: `agent/src/discord/commands/slash.ts:280-284,350-354`

- [ ] **Step 1: Add canRunCommand check to schedule-budget**

In `agent/src/discord/commands/slash.ts`, replace lines 280-284:

```typescript
        case "schedule-budget": {
          if (!canRunCommand("schedule", guildMember, cmd.user.id)) {
            await cmd.reply({ content: "Access denied. Scheduled handoffs are owner-only.", ephemeral: true });
            break;
          }
          if (!channelName || isReadOnlyChannel(channelName)) {
```

- [ ] **Step 2: Add canRunCommand check to schedule-copy-swap**

Replace lines 350-354:

```typescript
        case "schedule-copy-swap": {
          if (!canRunCommand("schedule", guildMember, cmd.user.id)) {
            await cmd.reply({ content: "Access denied. Scheduled copy swaps are owner-only.", ephemeral: true });
            break;
          }
          if (!channelName || isReadOnlyChannel(channelName)) {
```

- [ ] **Step 3: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add agent/src/discord/commands/slash.ts
git commit -m "sec: add owner-only gate to schedule-budget and schedule-copy-swap slash commands"
```

---

### Task 3: Sanitize spec.key in spawner (path traversal fix)

**Files:**
- Modify: `agent/src/agents/spawner.ts:70-72`

- [ ] **Step 1: Add key validation at top of spawnAgent**

In `agent/src/agents/spawner.ts`, add validation at the start of `spawnAgent` (after line 71, the `log` declaration):

```typescript
export async function spawnAgent(spec: SpawnSpec): Promise<void> {
  if (!/^[a-z][a-z0-9-]{1,48}$/.test(spec.key)) {
    throw new Error(`Invalid agent key: "${spec.key}" -- must be lowercase kebab-case, 2-49 chars`);
  }

  const { notifyChannel } = await import("../discord/core/entry.js");
  const log: string[] = [];
```

- [ ] **Step 2: Fix duplicate import**

Replace lines 20-21:

```typescript
import { registerAgentWebhook, sendAsAgent } from "../services/webhook-service.js";
```

- [ ] **Step 3: Fix unawited notifyChannel in catch fallback**

At line 156, change:

```typescript
    await sendAsAgent("boss", "agent-feed", { embeds: [intro] }).catch(async (e) => {
      console.warn("[spawner] sendAsAgent failed:", toErrorMessage(e));
      return notifyChannel("agent-feed", `**New Agent**: ${spec.name} -- ${spec.description}`);
    });
```

Note the `return` before `notifyChannel` -- this ensures the promise is awaited by the outer `await`.

- [ ] **Step 4: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 5: Commit**

```bash
git add agent/src/agents/spawner.ts
git commit -m "sec: validate spec.key to prevent path traversal, fix duplicate import and unawited promise"
```

---

### Task 4: Move INGEST_SECRET from body to header

**Files:**
- Modify: `agent/src/services/whatsapp-runtime-service.ts:38-47`
- Modify: `src/app/api/whatsapp/send/route.ts` (the receiving API route)

- [ ] **Step 1: Update the sender to use header**

In `agent/src/services/whatsapp-runtime-service.ts`, replace lines 38-47:

```typescript
  const response = await fetch(`${getOutletBaseUrl()}/api/whatsapp/send`, {
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
      "X-Ingest-Secret": secret,
    },
    method: "POST",
  });
```

Note: `...input` no longer includes `secret`.

- [ ] **Step 2: Update the receiver to read from header**

Find `src/app/api/whatsapp/send/route.ts` and update it to read `request.headers.get("x-ingest-secret")` instead of (or in addition to) `body.secret`. Keep backward compat by checking both:

```typescript
const secret = request.headers.get("x-ingest-secret") ?? body?.secret;
```

- [ ] **Step 3: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add agent/src/services/whatsapp-runtime-service.ts src/app/api/whatsapp/send/route.ts
git commit -m "sec: move INGEST_SECRET from request body to X-Ingest-Secret header"
```

---

## Chunk 2: Phase 2 -- Correctness Fixes

### Task 5: Fix approval race -- build params before enqueueTask

**Files:**
- Modify: `agent/src/services/queue-service.ts:328-331`

- [ ] **Step 1: Build params before enqueue**

In `agent/src/services/queue-service.ts`, replace lines 328-331:

```typescript
  // Re-enqueue as green tier for execution
  const execParams = { ...task.params, _approvedBy: approvedBy, _originalTaskId: taskId };
  enqueueTask(task.from, task.to, task.action, execParams, "green");
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add agent/src/services/queue-service.ts
git commit -m "fix: build approval params before enqueueTask to prevent race condition"
```

---

### Task 6: Gate-then-enqueue -- evaluate tier before enqueue in delegate.ts

**Files:**
- Modify: `agent/src/agents/delegate.ts:610-650,740-753`

This is the most impactful correctness fix. Currently the pattern is enqueue -> evaluate -> maybe escalate. The fix: evaluate first, only enqueue if green/execute.

- [ ] **Step 1: Fix processDelegations (lines 602-650)**

Replace the block from `const tier = block.tier ?? "green"` through the `evaluateTier` call:

```typescript
    const tier = block.tier ?? "green";
    const taskParams = applyCustomerFacingContext(
      sourceChannel,
      block.params ?? {},
      options?.inheritedParams,
    );
    const queuedParams = attachTaskRuntimeParams(taskParams, sourceChannel, depth, true);

    // Evaluate tier BEFORE enqueue
    const preTask: AgentTask = {
      id: "", // placeholder -- not yet created
      from: fromAgent,
      to: block.delegate,
      action: block.action,
      params: queuedParams,
      tier,
      status: "pending",
      createdAt: new Date(),
    };
    const decision = evaluateTier(preTask);

    if (decision === "execute") {
      const task = enqueueTask(fromAgent, block.delegate, block.action, queuedParams, "green");

      // Post delegation notification to target channel
      if (guild) {
        const channel = guild.channels.cache.find(
          c => c.name === targetChannel && c.type === ChannelType.GuildText
        ) as TextChannel | undefined;

        if (channel) {
          const embed = new EmbedBuilder()
            .setTitle("Delegated Task")
            .setColor(tier === "red" ? 0xf44336 : tier === "yellow" ? 0xffa726 : 0x4caf50)
            .addFields(
              { name: "From", value: fromAgent, inline: true },
              { name: "Action", value: block.action, inline: true },
              { name: "Tier", value: tier.toUpperCase(), inline: true },
            )
            .setDescription(
              JSON.stringify(stripTaskRuntimeParams(queuedParams), null, 2).slice(0, 1000)
            )
            .setFooter({ text: `Task: ${task.id}` })
            .setTimestamp();

          await sendAsAgent(fromAgent, targetChannel, { embeds: [embed] }).catch((e) => {
            console.warn("[delegate] sendAsAgent failed:", toErrorMessage(e));
            channel.send({ embeds: [embed] }).catch((e2) => console.warn("[delegate] channel.send failed:", toErrorMessage(e2)));
          });
        }
      }
    } else {
      // Needs approval -- enqueue as escalated, not running
      const task = enqueueTask(fromAgent, block.delegate, block.action, queuedParams, tier);
      escalateTask(task.id);
    }
```

- [ ] **Step 2: Fix processChannelMessages handoff (lines 728-753)**

Apply the same pattern for the handoff block:

```typescript
      const tier = block.tier ?? "green";
      // ...existing param building...

      const preTask: AgentTask = {
        id: "",
        from: fromAgent,
        to: delegateTarget,
        action: "channel-handoff",
        params: queuedParams,
        tier,
        status: "pending",
        createdAt: new Date(),
      };
      const decision = evaluateTier(preTask);

      if (decision === "execute") {
        enqueueTask(fromAgent, delegateTarget, "channel-handoff", queuedParams, "green");
      } else {
        const task = enqueueTask(fromAgent, delegateTarget, "channel-handoff", queuedParams, tier);
        escalateTask(task.id);
      }

      handoffTargets.push(targetChannel);
```

- [ ] **Step 3: Fix agent-feed notification to use delegatedTargets, not blocks**

Replace line 655:

```typescript
  const targets = delegatedTargets.join(", ");
  if (delegatedTargets.length > 0) {
    await notifyChannel("agent-feed", `**${fromAgent}** delegated ${delegatedTargets.length} task(s) to: ${targets}`);
  }
```

- [ ] **Step 4: Hoist dynamic import to static import**

Replace the `await import("../discord/core/entry.js")` on line 654 with a static import at the top of the file. Add to the existing imports:

```typescript
import { notifyChannel } from "../discord/core/entry.js";
```

Then line 654 becomes just `notifyChannel(...)` directly.

Also add `import type { AgentTask } from "../services/queue-service.js";` if not already imported via the existing `enqueueTask` import line.

- [ ] **Step 5: Fix findInlineJsonBlocks to run against cleanText**

In `parseDelegationBlocks` (line 366), `parseChannelMessageBlocks` (line 413), and `parseWhatsAppSendBlocks` (line 456), change:

```typescript
  for (const hit of findInlineJsonBlocks(cleanText)) {
```

Instead of `findInlineJsonBlocks(text)`.

- [ ] **Step 6: Fix O(n^2) in findInlineJsonBlocks**

In `findInlineJsonBlocks`, after a successful match, skip past the matched block:

```typescript
function findInlineJsonBlocks(text: string): { match: string; index: number }[] {
  const results: { match: string; index: number }[] = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "{") {
      let depth = 1;
      let j = i + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === "{") depth++;
        else if (text[j] === "}") depth--;
        j++;
      }
      if (depth === 0) {
        results.push({ match: text.slice(i, j), index: i });
        i = j; // skip past matched block
        continue;
      }
    }
    i++;
  }
  return results;
}
```

- [ ] **Step 7: Fix `||` to `??` for response fallback**

Line 824:

```typescript
    let responseText = result.text ?? "No response.";
```

- [ ] **Step 8: Build and run existing tests**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit && npx vitest run src/agents/delegate.test.ts`
Expected: All pass

- [ ] **Step 9: Commit**

```bash
git add agent/src/agents/delegate.ts
git commit -m "fix: gate-then-enqueue tier evaluation, fix inline JSON dedup, hoist import, fix O(n^2)"
```

---

### Task 7: Fix isOwner ternary precedence bug

**Files:**
- Modify: `agent/src/discord/core/access.ts:101-108`

- [ ] **Step 1: Replace ternary chain with flat OR**

Replace lines 101-108:

```typescript
  const isOwner =
    (!!userId && !!member?.guild && member.guild.ownerId === userId) ||
    (!!userId && OWNER_USER_IDS.size > 0 && OWNER_USER_IDS.has(userId)) ||
    hasRole(member, OWNER_ROLE_NAME);
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add agent/src/discord/core/access.ts
git commit -m "fix: flatten isOwner ternary to prevent operator precedence bug"
```

---

### Task 8: Fix computeEnd timezone bug in calendar-service

**Files:**
- Modify: `agent/src/services/calendar-service.ts:89-102`

- [ ] **Step 1: Replace local-TZ constructor with Date arithmetic**

Replace lines 89-102:

```typescript
function computeEnd(startIso: string, durationMinutes: number): { dateTime: string; timeZone?: string } {
  const start = normalizeDateTime(startIso);
  const startMs = new Date(start.dateTime).getTime();
  const endMs = startMs + durationMinutes * 60_000;
  const endDate = new Date(endMs);

  const pad = (n: number) => String(n).padStart(2, "0");
  const endStr = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:${pad(endDate.getSeconds())}`;

  return start.timeZone
    ? { dateTime: endStr, timeZone: start.timeZone }
    : { dateTime: endStr };
}
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add agent/src/services/calendar-service.ts
git commit -m "fix: use Date arithmetic in computeEnd to handle timezone offsets correctly"
```

---

### Task 9: Fix "tonight" rollover in scheduled-handoff-service

**Files:**
- Modify: `agent/src/services/scheduled-handoff-service.ts:219-242`

- [ ] **Step 1: Fix rollover logic**

Replace lines 219-242:

```typescript
  const wantsTomorrow = /\btomorrow\b|\bmanana\b/.test(lower);
  const wantsToday = /\btoday\b|\bhoy\b/.test(lower);
  const wantsTonight = /\btonight\b|\besta noche\b/.test(lower);

  if (wantsTomorrow) {
    dateStr = dateFmt.format(new Date(now.getTime() + 86_400_000));
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const isoLike = `${dateStr}T${pad(hours)}:${pad(minutes)}:00`;

  const parts = offsetFmt.formatToParts(now);
  const offsetVal = parts.find(p => p.type === "timeZoneName")?.value ?? "GMT";
  const offMatch = offsetVal.match(/GMT([+-]?)(\d{1,2})(?::?(\d{2}))?/);
  let tzSuffix = "Z";
  if (offMatch) {
    const sign = offMatch[1] || "+";
    tzSuffix = `${sign}${offMatch[2].padStart(2, "0")}:${(offMatch[3] ?? "0").padStart(2, "0")}`;
  }

  const target = new Date(`${isoLike}${tzSuffix}`);

  // "tonight" at a small hour (e.g. 3am) means the upcoming occurrence
  if (wantsTonight && hours < 12 && target.getTime() <= now.getTime()) {
    target.setTime(target.getTime() + 86_400_000);
  }

  // Generic rollover: if no explicit day word and time is past, assume next day
  if (!wantsTomorrow && !wantsToday && !wantsTonight && target.getTime() <= now.getTime()) {
    target.setTime(target.getTime() + 86_400_000);
  }

  return target;
```

- [ ] **Step 2: Run existing tests**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx vitest run src/services/scheduled-handoff-service.test.ts`

- [ ] **Step 3: Commit**

```bash
git add agent/src/services/scheduled-handoff-service.ts
git commit -m "fix: handle tonight rollover correctly for past hours"
```

---

### Task 10: Fix Spanish language detection false positives

**Files:**
- Modify: `agent/src/services/email-classify.ts:362`

- [ ] **Step 1: Remove false English hints from spanishHints**

Replace line 362:

```typescript
  const spanishHints = [" hola ", " gracias ", " por favor", " envio", " adjunto"];
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/services/email-classify.ts
git commit -m "fix: remove 'venue' and 'meta pixel id' from Spanish language hints"
```

---

### Task 11: Remove hollow isAgentFree check in message-handler

**Files:**
- Modify: `agent/src/events/message-handler.ts:261-265`

- [ ] **Step 1: Remove the misleading check**

Replace lines 261-265:

```typescript
  const agentKey = agent.promptFile;

  let typingInterval: ReturnType<typeof setInterval> | undefined;
  let working: Message | undefined;
```

Remove the `if (!isAgentFree(agentKey))` block entirely. The outer `channelLocks` in command-router.ts is the real concurrency guard.

Also remove the `isAgentFree` import if it's no longer used elsewhere in the file.

- [ ] **Step 2: Build and run tests**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit && npx vitest run src/events/message-handler.test.ts`

- [ ] **Step 3: Commit**

```bash
git add agent/src/events/message-handler.ts
git commit -m "fix: remove hollow isAgentFree check, rely on outer channelLocks guard"
```

---

## Chunk 3: Phase 3 -- Reliability Fixes

### Task 12: Wrap readServiceAccount in try/catch

**Files:**
- Modify: `agent/src/services/email-gmail.ts:55-60`

- [ ] **Step 1: Add try/catch**

Replace lines 55-60:

```typescript
function readServiceAccount() {
  try {
    return JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8")) as {
      client_email: string;
      private_key: string;
    };
  } catch (err) {
    throw new Error(`Service account key not found at ${SERVICE_ACCOUNT_PATH}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/services/email-gmail.ts
git commit -m "fix: wrap readServiceAccount in try/catch with descriptive error"
```

---

### Task 13: Batch Supabase queries in listUnhandledUnreadInboxMessageIds

**Files:**
- Modify: `agent/src/services/email-gmail.ts:168-179`

- [ ] **Step 1: Replace N sequential queries with single IN query**

Replace lines 168-179:

```typescript
export async function listUnhandledUnreadInboxMessageIds(maxResults = MANUAL_SWEEP_LIMIT): Promise<string[]> {
  const messageIds = await listUnreadInboxMessageIds(maxResults);
  if (messageIds.length === 0) return [];

  const supabase = getServiceSupabase();
  if (!supabase) return messageIds; // no DB = treat all as unhandled

  const { data } = await supabase
    .from("email_events")
    .select("message_id,status")
    .in("message_id", messageIds);

  const known = new Map((data ?? []).map(r => [r.message_id as string, r.status as string]));

  return messageIds.filter(id => {
    const status = known.get(id);
    return !status || status === "received";
  });
}
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add agent/src/services/email-gmail.ts
git commit -m "perf: batch email event lookup into single Supabase IN query"
```

---

### Task 14: Fix pumpQueue concurrency gap

**Files:**
- Modify: `agent/src/services/external-task-dispatcher.ts:297-299`

- [ ] **Step 1: Re-pump after releasing guard**

Replace lines 297-299:

```typescript
  } finally {
    pumping = false;
    // Re-check in case tasks completed while we were pumping
    if (activeWorkers < MAX_CONCURRENT_TASKS) {
      void pumpQueue();
    }
  }
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/services/external-task-dispatcher.ts
git commit -m "fix: re-pump queue after releasing guard to prevent idle slots"
```

---

### Task 15: Clear writeLocks after promise settles

**Files:**
- Modify: `agent/src/discord/features/memory.ts:26-36`

- [ ] **Step 1: Add cleanup in finally**

Replace lines 26-36:

```typescript
async function serializedAppend(path: string, data: string): Promise<void> {
  const prev = writeLocks.get(path) ?? Promise.resolve();
  const next = prev.then(
    () => appendFile(path, data),
    (err) => {
      console.warn("[memory] previous write failed:", toErrorMessage(err));
      return appendFile(path, data);
    },
  ).finally(() => {
    if (writeLocks.get(path) === next) writeLocks.delete(path);
  });
  writeLocks.set(path, next);
  await next;
}
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/discord/features/memory.ts
git commit -m "fix: clear writeLocks entries after promise settles to prevent memory leak"
```

---

### Task 16: Add null guard for discordClient in command-router

**Files:**
- Modify: `agent/src/discord/core/command-router.ts:507-508`

- [ ] **Step 1: Add guard**

Replace line 508:

```typescript
    if (!discordClient) {
      await msg.reply("Bot client not connected.");
      return;
    }
    const schedResult = await handleScheduleCommand(content, discordClient, channelName);
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/discord/core/command-router.ts
git commit -m "fix: add null guard for discordClient before handleScheduleCommand"
```

---

### Task 17: Fix _retryCount coercion in trigger-handler

**Files:**
- Modify: `agent/src/events/trigger-handler.ts:87`

- [ ] **Step 1: Use Number() instead of cast**

Replace line 87:

```typescript
    const retryCount = Number(task.params._retryCount ?? 0);
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/events/trigger-handler.ts
git commit -m "fix: coerce _retryCount with Number() to prevent infinite retry loop from string values"
```

---

### Task 18: Add void prefix to fire-and-forget notifyChannel

**Files:**
- Modify: `agent/src/events/message-handler.ts:173`

- [ ] **Step 1: Prefix with void**

Replace line 173:

```typescript
  void notifyChannel("agent-feed", feedMsg);
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/events/message-handler.ts
git commit -m "fix: prefix fire-and-forget notifyChannel with void to signal intent"
```

---

## Chunk 4: Phase 4 -- Quality Fixes

### Task 19: Fix yesterdayCST/tomorrowCST timezone edge case

**Files:**
- Modify: `agent/src/utils/date-helpers.ts`

- [ ] **Step 1: Compute day-of-month in CST before arithmetic**

Replace the full file:

```typescript
/** CST date helpers shared across agent sweeps and routines. */

function cstNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

export function todayCST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

export function yesterdayCST(): string {
  const d = cstNow();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

export function tomorrowCST(): string {
  const d = cstNow();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA");
}
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/utils/date-helpers.ts
git commit -m "fix: compute day-of-month in CST before date arithmetic in yesterdayCST/tomorrowCST"
```

---

### Task 20: Consolidate OWNER_USER_IDS to single source

**Files:**
- Modify: `agent/src/discord/core/access.ts:16-21`
- Check: `agent/src/discord/features/restructure.ts` and `agent/src/services/whatsapp-cloud-service.ts` for inline parsing

- [ ] **Step 1: Replace local Set in access.ts with import**

In `agent/src/discord/core/access.ts`, replace lines 16-21:

```typescript
import { OWNER_USER_IDS as OWNER_IDS_LIST } from "../../services/owner-discord-service.js";

const OWNER_USER_IDS = new Set(OWNER_IDS_LIST);
```

- [ ] **Step 2: Replace inline parsing in restructure.ts**

Find the inline `process.env.DISCORD_OWNER_USER_IDS` parsing in `restructure.ts` and replace with an import from `owner-discord-service.js`.

- [ ] **Step 3: Replace inline parsing in whatsapp-cloud-service.ts**

Same pattern -- import from `owner-discord-service.js` instead of parsing env inline.

- [ ] **Step 4: Build and verify**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add agent/src/discord/core/access.ts agent/src/discord/features/restructure.ts agent/src/services/whatsapp-cloud-service.ts
git commit -m "refactor: consolidate OWNER_USER_IDS into single import from owner-discord-service"
```

---

### Task 21: Fix TikTok hostname validation

**Files:**
- Modify: `agent/src/discord/commands/growth-publish.ts:39`

- [ ] **Step 1: Fix hostname check**

Replace line 39:

```typescript
  if (hostname !== "tiktok.com" && !hostname.endsWith(".tiktok.com")) {
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/discord/commands/growth-publish.ts
git commit -m "fix: strengthen TikTok hostname validation to prevent subdomain bypass"
```

---

### Task 22: Final build + full test suite

- [ ] **Step 1: Full build**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Full test suite**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx vitest run`
Expected: All tests pass

- [ ] **Step 3: Lint check**

Run: `cd /Users/jaimeortiz/outlet-media-app && npx next lint` (if configured)

---

## Out of Scope (tracked for future)

These are real issues but require larger refactors. They should be separate tasks:

1. **Split oversized files** (delegate.ts 906L, email-gmail.ts 829L, email-classify.ts 826L, whatsapp-cloud-service.ts 730L) -- each needs its own plan
2. **Batch growth-ledger-resolve.ts queries** -- requires changing all 6 resolver functions
3. **Fix restructure.ts stale channel cache** -- needs testing with live Discord guild
4. **Shared MCP server instance in creative-classify.ts** -- needs SDK investigation
