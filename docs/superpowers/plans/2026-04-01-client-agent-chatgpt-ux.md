# Client Agent ChatGPT UX Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the client `Agent` tab into a pure ChatGPT-style prose chat that infers campaign/event intent across the customer's allowed data, uses `gpt-5.4`, and never renders report blocks in the chat stream.

**Architecture:** Keep the existing scoped data layer and per-thread persistence, but change the visible answer contract from block-first reporting to prose-only chat. Add a small event-intent resolver for `show`, `shows`, and `last show`, then route the model through a prose formatter that summarizes hidden analytics instead of dumping overview tables.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, OpenAI Responses API, Clerk, Supabase

---

## File Structure

**Modify**
- `src/features/client-agent/model.ts`
  - Switch the model target to `gpt-5.4`, remove canned report fallback copy, keep analytics hidden behind prose-only formatting, and stop returning block-driven answers as the primary UX.
- `src/features/client-agent/model.test.ts`
  - Lock the prose-only formatter contract, `gpt-5.4` model selection, and fallback behavior for formatter failures and broad questions, including replacing the existing block-oriented fallback expectation.
- `src/features/client-agent/planner.ts`
  - Improve intent detection for event/show phrasing such as `show`, `shows`, `last show`, and similar conversational asks.
- `src/features/client-agent/planner.test.ts`
  - Add failing planner tests for `how many shows we have`, `how we did last show`, and clarification behavior when multiple plausible shows exist.
- `src/features/client-agent/data.ts`
  - Add a small event-resolution helper for recency-aware event selection and broad show counting without exposing block output to the UI.
- `src/features/client-agent/data.test.ts`
  - Add focused tests for `last show` resolution, broad show counts, and event fallback behavior.
- `src/features/client-agent/components/agent-shell.tsx`
  - Preserve the thread UX, but make the pending state feel like ChatGPT with per-thread pending assistant state and ensure the UI no longer depends on answer blocks for useful replies.
- `src/features/client-agent/components/conversation-pane.tsx`
  - Remove visible block rendering from the chat stream and replace it with a lightweight working state.
- `src/features/client-agent/components/agent-shell.test.tsx`
  - Lock the prose-only chat behavior and working indicator by replacing the existing table/chart rendering test with text-only expectations.
- `src/features/client-agent/components/conversation-pane.test.tsx`
  - Add a focused rendering test if needed once the component contract changes enough to justify its own file-level coverage.

**Optional create**
- `src/features/client-agent/intents.ts`
  - If planner/model logic becomes too dense, extract small helpers for show/event intent classification and keep them unit-testable.
- `src/features/client-agent/intents.test.ts`
  - Unit tests for extracted intent helpers.

**Operational change**
- Railway production variable `CLIENT_AGENT_OPENAI_MODEL`
  - Change from `gpt-5` to `gpt-5.4` after the code ships.

**Deliberately unchanged in this slice**
- Supabase schema and persisted message shape
  - Do not run a migration just to remove stored `blocks`; keep backward-compatible storage for now, but stop rendering or depending on block output in `Agent`.

## Chunk 1: Lock The Chat Contract

### Task 1: Write the failing prose-only model contract tests

**Files:**
- Modify: `src/features/client-agent/model.test.ts`

- [ ] **Step 1: Write the failing tests for prose-only answers and model selection**

Add tests covering:

```ts
it("defaults client agent responses to gpt-5.4 when no override is configured", async () => {
  const previousModel = process.env.CLIENT_AGENT_OPENAI_MODEL;
  delete process.env.CLIENT_AGENT_OPENAI_MODEL;
  responsesParse.mockResolvedValue(validAnswerResponse("Direct answer."));

  try {
    await generateClientAgentModelResponse({
      history: [],
      message: "How are my campaigns doing?",
      scope: memberScope(),
      scopeSummary: { clientSlug: "zamora", eventsEnabled: true },
    });

    expect(responsesParse).toHaveBeenCalledWith(
      expect.objectContaining({ model: "gpt-5.4" }),
    );
  } finally {
    process.env.CLIENT_AGENT_OPENAI_MODEL = previousModel;
  }
});

it("returns prose-only answers even when analytics tools return blocks", async () => {
  getOverview.mockResolvedValue(okOverviewWithBlocks());
  responsesParse.mockResolvedValue(validAnswerResponse("Your campaigns are pacing well this month."));

  const result = await generateClientAgentModelResponse({
    history: [],
    message: "How are my campaigns doing this month?",
    scope: memberScope(),
    scopeSummary: { clientSlug: "zamora", eventsEnabled: true },
  });

  expect(result.status).toBe("answer");
  expect(result.text).toContain("pacing well");
  expect(result.blocks).toEqual([]);
});

it("falls back to conversational prose instead of canned report copy when formatting fails", async () => {
  responsesParse.mockRejectedValue(new Error("formatter failed"));
  getOverview.mockResolvedValue(okOverviewWithBlocks());

  const result = await generateClientAgentModelResponse({
    history: [],
    message: "How are my campaigns doing this month?",
    scope: memberScope(),
    scopeSummary: { clientSlug: "zamora", eventsEnabled: true },
  });

  expect(result.status).toBe("answer");
  expect(result.text).not.toContain("latest comparison summary");
  expect(result.text).not.toContain("latest summary I found");
  expect(result.blocks).toEqual([]);
});
```

- [ ] **Step 2: Run the focused model tests to verify they fail**

Run: `npx vitest run src/features/client-agent/model.test.ts`

Expected: FAIL because the suite still forces `CLIENT_AGENT_OPENAI_MODEL = "gpt-5"` in `beforeEach`, still preserves block output, and still falls back to canned report-style copy.

- [ ] **Step 3: Implement the minimal model contract change**

In `src/features/client-agent/model.test.ts`, first replace the existing legacy expectations instead of adding parallel tests:

```ts
beforeEach(() => {
  ...
  delete process.env.CLIENT_AGENT_OPENAI_MODEL;
});
```

Rewrite the existing formatter-failure test around the current fallback-block assertion so it now expects prose text and `blocks: []`.

Then in `src/features/client-agent/model.ts`:

```ts
const CLIENT_AGENT_MODEL = process.env.CLIENT_AGENT_OPENAI_MODEL || "gpt-5.4";
```

Change the public answer path so:

```ts
return {
  status: "answer",
  text: parsed.data.text,
  blocks: [],
  referencedEntities: authoritativeReferencedEntities,
  resolvedRange,
  providerResponseId: response.id ?? null,
};
```

Replace canned fallback copy with a conversational summarizer helper that does not mention "summary" or "comparison summary":

```ts
function buildConversationalFallbackText(...) {
  // Example shape:
  // "You spent $11.6K across your campaigns in the last 30 days."
}
```

- [ ] **Step 4: Run the focused model tests to verify they pass**

Run: `npx vitest run src/features/client-agent/model.test.ts`

Expected: PASS

- [ ] **Step 5: Commit the model contract checkpoint**

```bash
git add src/features/client-agent/model.ts src/features/client-agent/model.test.ts
git commit -m "refactor: make client agent responses prose-only"
```

### Task 2: Write the failing planner tests for show intent

**Files:**
- Modify: `src/features/client-agent/planner.test.ts`
- Modify: `src/features/client-agent/planner.ts`

- [ ] **Step 1: Add failing planner tests for conversational show asks**

Add tests like:

```ts
it("treats 'how many shows we have' as a broad event question", () => {
  const result = planQuestion({
    message: "how many shows we have",
    timezone: "America/Chicago",
    eventsEnabled: true,
    history: [],
    resolvedEntities: [],
    ambiguousEntities: [],
  });

  expect(result).toMatchObject({
    disposition: "answer",
  });
});

it("does not treat 'show me spend by date' as an event question", () => {
  const result = planQuestion({
    message: "show me spend by date for Camila",
    timezone: "America/Chicago",
    eventsEnabled: true,
    history: [],
    resolvedEntities: [],
    ambiguousEntities: [],
  });

  expect(result.disposition).toBe("answer");
});

it("marks 'last show' questions as event-intent questions", () => {
  const result = planQuestion({
    message: "how we did last show",
    timezone: "America/Chicago",
    eventsEnabled: true,
    history: [],
    resolvedEntities: [],
    ambiguousEntities: [],
  });

  expect(result).toMatchObject({
    disposition: "answer",
  });
});
```

- [ ] **Step 2: Run the planner tests to verify they fail**

Run: `npx vitest run src/features/client-agent/planner.test.ts`

Expected: FAIL because broad `show/shows` and `last show` intent is not explicitly modeled yet.

- [ ] **Step 3: Implement the minimal planner helpers**

In `src/features/client-agent/planner.ts`, add small helpers instead of widening the existing regex blindly:

```ts
function isShowInventoryQuestion(message: string) {
  return /\bhow many shows\b|\bhow many events\b/.test(message.toLowerCase());
}

function isLastShowQuestion(message: string) {
  return /\blast show\b|\bmost recent show\b|\blast event\b/.test(message.toLowerCase());
}

function isBroadEventQuestion(message: string) {
  const lower = message.toLowerCase();
  if (/\bshow me\b/.test(lower)) return false;
  return /\bevents?\b|\bshows?\b/.test(lower) || isLastShowQuestion(lower);
}
```

- [ ] **Step 4: Run the planner tests to verify they pass**

Run: `npx vitest run src/features/client-agent/planner.test.ts`

Expected: PASS

- [ ] **Step 5: Commit the planner checkpoint**

```bash
git add src/features/client-agent/planner.ts src/features/client-agent/planner.test.ts
git commit -m "feat: add conversational show intent detection"
```

## Chunk 2: Teach The Agent To Infer Event Meaning

### Task 3: Add failing data tests for `last show` and show counts

**Files:**
- Modify: `src/features/client-agent/data.test.ts`
- Modify: `src/features/client-agent/data.ts`

- [ ] **Step 1: Add failing data-layer tests for event recency inference**

Add tests covering:

```ts
it("returns the count of allowed events for broad show inventory questions", async () => {
  // mock reports.events with 3 allowed events
  const result = await resolveEventIntent({
    message: "how many shows we have",
    scope: memberScope(),
  });

  expect(result).toMatchObject({
    kind: "count",
    totalEvents: 3,
  });
});

it("picks the most recent dated event for 'last show'", async () => {
  // mock event details with dated events
  const result = await resolveEventIntent({
    message: "how we did last show",
    scope: memberScope(),
  });

  expect(result).toMatchObject({
    kind: "entity",
    eventId: "evt_latest",
  });
});

it("returns clarify when multiple events share the same latest date", async () => {
  const result = await resolveEventIntent({
    message: "how we did last show",
    scope: memberScope(),
  });

  expect(result).toMatchObject({
    kind: "clarify",
    choices: expect.arrayContaining([
      expect.objectContaining({ entityType: "event" }),
    ]),
  });
});

it("returns none when no allowed events exist", async () => {
  const result = await resolveEventIntent({
    message: "how we did last show",
    scope: memberScope({ allowedEventIds: [] }),
  });

  expect(result).toEqual({ kind: "none" });
});
```

- [ ] **Step 2: Run the focused data tests to verify they fail**

Run: `npx vitest run src/features/client-agent/data.test.ts`

Expected: FAIL because no recency-aware event resolver exists yet.

- [ ] **Step 3: Implement the smallest event-intent resolver**

In `src/features/client-agent/data.ts`, either add helpers in place or extract `src/features/client-agent/intents.ts`:

```ts
type EventIntentResolution =
  | { kind: "count"; totalEvents: number; referencedEntities: ReferencedEntity[] }
  | { kind: "entity"; eventId: string; referencedEntities: ReferencedEntity[] }
  | { kind: "clarify"; choices: ReferencedEntity[] }
  | { kind: "none" };
```

Use existing event card data from `getReportsData()` and event detail dates from `getEventDetail()` / `loadClientAgentEventDetail()` with explicit tie-break rules:

```ts
const datedEvents = reports.events
  .filter((event) => isEventAllowed(scope, event.id) && event.date)
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
```

Resolution contract:
- If there are no allowed events at all, return `{ kind: "none" }`.
- If exactly one event has the max date, return `{ kind: "entity" }` for that event.
- If multiple allowed events share the same max date, return `{ kind: "clarify" }` with the tied choices.
- If there are no dated events but exactly one allowed undated event, return that event.
- If there are multiple undated allowed events and no dated winner, return `{ kind: "clarify" }`.

Do not add a new database table or schema change.

- [ ] **Step 4: Run the data tests to verify they pass**

Run: `npx vitest run src/features/client-agent/data.test.ts`

Expected: PASS

- [ ] **Step 5: Commit the event-resolution checkpoint**

```bash
git add src/features/client-agent/data.ts src/features/client-agent/data.test.ts
git commit -m "feat: resolve show inventory and last show intents"
```

### Task 4: Route broad conversational asks away from generic overview dumps

**Files:**
- Modify: `src/features/client-agent/model.ts`
- Modify: `src/features/client-agent/model.test.ts`

- [ ] **Step 1: Add failing model tests for broad show/event chat**

Add tests like:

```ts
it("answers 'how many shows we have' with prose instead of overview blocks", async () => {
  searchEntities.mockResolvedValue([]);
  mockShowCountIntent(5);
  responsesParse.mockResolvedValue(validAnswerResponse("You currently have 5 shows in scope."));

  const result = await generateClientAgentModelResponse({
    history: [],
    message: "how many shows we have",
    scope: memberScope(),
    scopeSummary: { clientSlug: "zamora", eventsEnabled: true },
  });

  expect(result.text).toContain("5 shows");
  expect(result.blocks).toEqual([]);
});

it("answers 'how we did last show' using the inferred most recent event", async () => {
  mockLastShowIntent("evt_latest", "Camila Phoenix");
  responsesParse.mockResolvedValue(validAnswerResponse("Your most recent show was Camila Phoenix."));

  const result = await generateClientAgentModelResponse({
    history: [],
    message: "how we did last show",
    scope: memberScope(),
    scopeSummary: { clientSlug: "zamora", eventsEnabled: true },
  });

  expect(result.text).toContain("most recent show");
  expect(result.referencedEntities).toMatchObject([
    { entityId: "evt_latest", entityType: "event" },
  ]);
});

it("asks a short clarification when multiple latest shows are tied", async () => {
  mockLastShowClarifyIntent(["evt_camila", "evt_arjona"]);

  const result = await generateClientAgentModelResponse({
    history: [],
    message: "how we did last show",
    scope: memberScope(),
    scopeSummary: { clientSlug: "zamora", eventsEnabled: true },
  });

  expect(result.status).toBe("clarify");
  expect(result.text).toMatch(/camila|arjona/i);
  expect(result.blocks).toEqual([]);
});

it("returns a prose answer when no allowed shows are available", async () => {
  mockLastShowNoneIntent();

  const result = await generateClientAgentModelResponse({
    history: [],
    message: "how we did last show",
    scope: memberScope({ allowedEventIds: [] }),
    scopeSummary: { clientSlug: "zamora", eventsEnabled: true },
  });

  expect(result.status).toBe("answer");
  expect(result.text).toMatch(/no shows|no events/i);
  expect(result.blocks).toEqual([]);
});
```

- [ ] **Step 2: Run the focused model tests to verify they fail**

Run: `npx vitest run src/features/client-agent/model.test.ts`

Expected: FAIL because broad event asks still fall through to generic overview/report logic.

- [ ] **Step 3: Implement the model routing change**

In `src/features/client-agent/model.ts`:

```ts
if (isShowInventoryQuestion(message)) {
  const resolution = await resolveEventIntent(...);
  // build prose-only tool context for count
}

if (isLastShowQuestion(message)) {
  const resolution = await resolveEventIntent(...);
  // entity => load that specific event's metrics and summarize in prose
  // clarify => return a short clarification question with no blocks
  // none => return an answer-status prose message with no blocks
}
```

Keep hidden analytics blocks as internal execution context if useful for summarization, but always return:

```ts
blocks: []
```

Avoid the old fallback path:

```ts
return getOverview(...)
```

for conversational show questions unless the user explicitly asked for a broad portfolio overview.

- [ ] **Step 4: Run the focused model tests to verify they pass**

Run: `npx vitest run src/features/client-agent/model.test.ts`

Expected: PASS

- [ ] **Step 5: Commit the conversational routing checkpoint**

```bash
git add src/features/client-agent/model.ts src/features/client-agent/model.test.ts src/features/client-agent/data.ts src/features/client-agent/data.test.ts
git commit -m "refactor: route client agent broad chat to conversational event answers"
```

## Chunk 3: Make The UI Feel Like ChatGPT

### Task 5: Write the failing UI tests for prose-only chat and working state

**Files:**
- Modify: `src/features/client-agent/components/agent-shell.test.tsx`
- Modify: `src/features/client-agent/components/agent-shell.tsx`
- Modify: `src/features/client-agent/components/conversation-pane.tsx`

- [ ] **Step 1: Add failing UI tests**

Replace the existing `"renders typed blocks"` test rather than keeping both versions. Add tests covering:

```tsx
it("does not render answer blocks in the chat stream", async () => {
  renderConversationWithAssistantMessage({
    text: "Your campaigns are pacing well.",
    blocks: [
      { type: "metric_cards", cards: [{ label: "Spend", value: "$10K" }] },
    ],
  });

  expect(screen.getByText("Your campaigns are pacing well.")).toBeInTheDocument();
  expect(screen.queryByText("Spend")).not.toBeInTheDocument();
});

it("shows a lightweight working state while the assistant response is pending", async () => {
  mockPendingMessagePost();
  render(...);

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "How are things going?" } });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Thinking…")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the UI tests to verify they fail**

Run: `npx vitest run src/features/client-agent/components/agent-shell.test.tsx`

Expected: FAIL because `ConversationPane` still renders `AnswerBlocks` and there is no ChatGPT-style thinking indicator.

- [ ] **Step 3: Implement the minimal UI change**

In `src/features/client-agent/components/conversation-pane.tsx`:

```tsx
// remove:
import { AnswerBlocks } from "./answer-blocks";

// remove:
{message.blocks.length > 0 ? <AnswerBlocks ... /> : null}
```

Add a small pending assistant treatment:

```tsx
{isWorking ? (
  <div className="...">
    <p className="text-[11px] ...">Agent</p>
    <p className="text-sm leading-6">Thinking…</p>
  </div>
) : null}
```

In `src/features/client-agent/components/agent-shell.tsx`, track per-thread pending assistant state without inventing a fake final answer:

```tsx
const [pendingThreadIds, setPendingThreadIds] = useState<Record<string, boolean>>({});
```

Set `pendingThreadIds[activeThreadId] = true` before the message POST resolves, clear it in `finally`, and pass:

```tsx
<ConversationPane
  ...
  isWorking={Boolean(activeThreadId && pendingThreadIds[activeThreadId])}
/>
```

so the working indicator is tied to the active thread instead of global page loading.

- [ ] **Step 4: Run the UI tests to verify they pass**

Run: `npx vitest run src/features/client-agent/components/agent-shell.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit the UI checkpoint**

```bash
git add src/features/client-agent/components/agent-shell.tsx src/features/client-agent/components/conversation-pane.tsx src/features/client-agent/components/agent-shell.test.tsx
git commit -m "refactor: make client agent chat text-only"
```

### Task 6: Verify, switch the live model, and smoke-test

**Files:**
- No new source files unless verification reveals a missing contract

- [ ] **Step 1: Run the focused verification suite**

Run:

```bash
npx vitest run \
  src/features/client-agent/model.test.ts \
  src/features/client-agent/planner.test.ts \
  src/features/client-agent/data.test.ts \
  src/features/client-agent/components/agent-shell.test.tsx
```

Expected: PASS

- [ ] **Step 2: Run targeted lint**

Run:

```bash
npx eslint \
  src/features/client-agent/model.ts \
  src/features/client-agent/model.test.ts \
  src/features/client-agent/planner.ts \
  src/features/client-agent/planner.test.ts \
  src/features/client-agent/data.ts \
  src/features/client-agent/data.test.ts \
  src/features/client-agent/components/agent-shell.tsx \
  src/features/client-agent/components/agent-shell.test.tsx \
  src/features/client-agent/components/conversation-pane.tsx
```

Expected: PASS

- [ ] **Step 3: Run the app type-check**

Run: `npm run type-check`

Expected: PASS

- [ ] **Step 4: Update the production model variable**

Run:

```bash
railway variables --set CLIENT_AGENT_OPENAI_MODEL=gpt-5.4 --service e08125fc-7385-4121-a42f-1d381181de28
```

Expected: variable updated successfully

- [ ] **Step 5: Push and deploy**

```bash
git push origin <current-branch>
railway up --detach
```

- [ ] **Step 6: Live smoke test**

Verify on the deployed site as both:
- a real scoped client member
- an admin preview user

Use these prompts:
- `how many shows we have`
- `how we did last show`
- `show me spend by date for Camila`

Expected:
- plain chat prose only
- no cards/tables/charts in chat
- visible working state while pending
- reasonable inference for event/show questions
- clarification only when ambiguity is real

- [ ] **Step 7: Commit the final verification checkpoint**

```bash
git add <relevant files only>
git commit -m "feat: make client agent feel like chatgpt"
```
