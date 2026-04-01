# Client Agent Tool-Driven Runtime Design

## Purpose

This document defines a refactor of the client-facing `Agent` tab from a planner-driven response system into a tool-driven read-only analytics agent.

The goal is to make `Agent` behave like a real ChatGPT-style assistant for client reporting:

- it should infer likely meaning from the conversation
- it should call as many read-only analytics tools as needed in one turn
- it should answer naturally in prose
- it should stay client-safe and never reveal internal setup, strategy, structure, source plumbing, or admin-only state

This is a refactor of the current client `Agent` runtime, not a new product surface. The top-level `Agent` tab, thread model, scope enforcement, and client-safe packaging rules remain in place.

## Product Outcome

After this refactor:

- `Agent` behaves like a conversational assistant instead of a regex-routed report formatter
- the model can chain multiple read-only tool calls in one turn before answering
- vague questions default to Meta ads performance first
- broad questions without a timeframe default to `lifetime`
- event questions are answered when the message or thread clearly points to shows, tickets, event dates, or event performance
- creative-level questions work naturally
- demographic questions work naturally
- `Agent` still refuses structure, strategy, setup, and internal-process questions

The intended user feeling is:

- "It understands what I mean."
- "It can look through my data and figure it out."
- "It feels like ChatGPT for my ads and shows."

The feature should not feel like:

- a brittle intent router
- a dashboard block renderer
- a client-facing window into Outlet internals
- an admin assistant reused in the client portal

## Core Decisions

### 1. Replace planner-first routing with a tool-driven agent loop

The current runtime relies too heavily on deterministic intent routing before the model can reason.

That causes failures like:

- vague campaign questions being routed to the wrong breakdown
- wording such as `ads` or `show` causing hardcoded branch mistakes
- the assistant returning the wrong domain answer even when the needed data is available

Version 2 should reverse that architecture:

- backend enforces policy and scope first
- backend exposes a small set of broad read-only analytics tools
- model chooses which tools to call, and in what order
- model can call multiple tools in one turn
- model answers only after it has enough evidence

The model should do the interpretation work. The backend should do the safety work.

### 2. Keep hard server-side boundaries

This refactor does not loosen the security boundary.

The backend must still enforce:

- client membership and preview access
- campaign/event assignment scope
- read-only tool access
- normalized client-safe data only
- refusal for internal setup, structure, strategy, and process questions

The model must not receive:

- raw provider payloads
- arbitrary database access
- shell access
- internal task ledgers
- prompts
- account ids, token data, or integration plumbing

### 3. Use normalized data, not raw provider payloads

Tools should return normalized client-safe analytics objects, not raw Meta or Ticketmaster payloads.

This keeps the runtime:

- easier for the model to reason over
- less likely to leak source-system structure
- more stable when provider payloads change
- more aligned with the existing client-safe reporting layer

### 4. Default domain inference is ads first

When a question is broad or vague, the assistant should infer Meta ads performance first.

Examples:

- `how much we have spent and made`
- `how are we doing`
- `what is working best`

Those should default to ads first because the normal client mental model is ad performance unless the message clearly pivots to events.

Event answers should be preferred when:

- the user explicitly mentions show, event, ticket, sell-through, venue, event date, last show, or similar cues
- the thread is already clearly focused on an event

Only truly mixed questions should return a short split answer such as:

- `On ads, ...`
- `On shows, ...`

### 5. Default timeframe is lifetime

When the user does not specify a timeframe, the default is `lifetime`.

Examples:

- `how much have we spent`
- `how much have we made`
- `how are my campaigns doing`

When the message explicitly asks for:

- today
- yesterday
- last 7 days
- last 30 days
- this week
- this month
- this quarter
- lifetime / life time / all time

the agent should honor that range.

### 6. Output stays prose-only

The chat output remains plain conversational text only.

The assistant must not render:

- cards
- tables
- charts
- report sections

If users want structured analytics views, they should use `Campaigns` or `Events`.

### 7. `Agent` remains client-safe but broad

The assistant can answer broadly about:

- campaign performance
- event performance
- creatives
- demographics
- geography
- placements
- trends
- comparisons

It must not answer:

- ad set counts
- strategy
- account structure
- setup details
- how Outlet or the source systems are wired internally

## Runtime Architecture

## Request flow

Each user message should run through this sequence:

1. authenticate the portal viewer
2. load current client-member scope
3. apply deterministic refusal and scope guards
4. build the agent tool registry for that client
5. send the model the current message, recent thread history, tool definitions, and policy
6. execute any tool calls the model makes
7. continue the loop until the model returns a final prose answer
8. persist the user and assistant turns

## Thin deterministic layer

The deterministic layer should be intentionally small.

It is responsible for:

- auth
- client/member scope
- read-only enforcement
- internal-question refusal
- thread ownership and visibility
- preview-mode persistence rules

It should not be responsible for:

- interpreting normal business questions
- choosing one analytics path up front
- guessing whether the user meant campaigns, creatives, demographics, or events

## Agent loop

The tool-driven loop should support multiple tool calls per turn.

Typical turns may look like:

1. `search_scope("last show")`
2. `get_event_details([eventId], range=lifetime)`
3. final answer

or:

1. `get_ads_overview(range=lifetime)`
2. `get_timeseries(domain=campaigns, metric=spend, range=lifetime, interval=month)`
3. final answer

or:

1. `search_scope("Bay Area creative")`
2. `get_creative_details([...], range=last_30_days)`
3. `compare_entities([...], metric=roas, range=last_30_days)`
4. final answer

The runtime should not artificially force one tool call per message.

## Runtime guardrails

The multi-tool runtime must have explicit budgets and loop controls so planning does not invent them later.

Version 1 guardrails:

- maximum `6` tool calls per turn
- maximum `12` seconds total tool-loop wall time before fallback
- maximum `1` correction cycle after an invalid tool argument response
- no identical tool call may be executed more than twice in the same turn
- tool calls must be executed sequentially in version 1 so state and traces stay easy to reason about

If the model reaches the tool-call limit or timeout:

- use the successful tool results already gathered if they are enough to answer safely
- otherwise return a brief safe error instead of inventing or looping

If a tool call is invalid:

- runtime returns a typed invalid-arguments error to the model
- the model may correct itself once within the same turn budget
- after that, the turn ends with a safe error or with a safe partial answer if enough evidence already exists

If a later tool fails after one or more earlier tools succeeded:

- answer from the successful reads when they are sufficient for the user question
- otherwise return a brief safe error
- never drop into a misleading broad fallback that ignores the successful earlier reads

## Tool Surface

The tool surface should be broad enough that the model does not need a brittle planner, but small enough to stay understandable and safe.

### Required tools

- `search_scope`
  - purpose: search campaigns, events, and creatives within the current client scope
  - inputs: query
  - outputs: normalized matches with entity ids, entity types, names, and optional simple metadata

- `get_ads_overview`
  - purpose: summarize ad performance across the allowed campaign scope
  - inputs: range, optional campaign filters, optional creative filters
  - outputs: normalized totals such as spend, revenue, roas, impressions, clicks, ctr

- `get_events_overview`
  - purpose: summarize event performance across the allowed event scope
  - inputs: range, optional event filters
  - outputs: normalized totals such as tickets sold, gross, sell-through snapshots, views, conversion

- `get_campaign_details`
  - purpose: deep-dive campaign performance
  - inputs: campaign ids, range
  - outputs: normalized campaign metrics and optionally narrow supporting series/breakdowns

- `get_event_details`
  - purpose: deep-dive event performance
  - inputs: event ids, range
  - outputs: normalized event metrics, date-aware history, and current snapshot fields

- `get_creative_details`
  - purpose: answer creative/ad performance questions
  - inputs: creative ids or search terms, range
  - outputs: normalized creative metrics inside allowed campaign scope

- `get_demographic_breakdown`
  - purpose: answer age/gender questions
  - inputs: optional campaign/event anchors, range
  - outputs: normalized demographic performance rows

- `get_geography_breakdown`
  - purpose: answer city/market/region questions
  - inputs: optional anchors, range
  - outputs: normalized geography performance rows

- `get_placement_breakdown`
  - purpose: answer placement/platform questions
  - inputs: optional anchors, range
  - outputs: normalized placement performance rows

- `compare_entities`
  - purpose: compare campaigns, events, or creatives
  - inputs: entity ids, range, optional metric
  - outputs: normalized comparison rows

- `get_timeseries`
  - purpose: answer trend questions over time
  - inputs: domain, entity ids or filters, metric, range, interval
  - outputs: normalized series points

### Explicit non-tools

Do not expose tools for:

- ad set counts
- ad set strategy
- account structure
- provider setup
- integration diagnostics
- raw API payload access
- arbitrary SQL or arbitrary internal fetches

If the user asks for those topics, the agent should refuse in prose.

## Tool Contracts

The planning phase must treat the following request and response contracts as canonical for version 1. Tools may add fields later, but the listed fields and semantics are the required baseline.

### Shared request rules

- all ids are Outlet internal ids already safe to use server-side
- all dates use `YYYY-MM-DD`
- all ranges use the normalized client-agent range contract
- all currency values are returned as `usd` decimal numbers plus formatted display strings when useful
- all percentage-like values are returned as percentage numbers, not ratios
- null means unavailable, not zero

### Shared enums

- `domain`: `ads` | `events`
- `entity_type`: `campaign` | `creative` | `event`
- `interval`: `day` | `week` | `month`
- `range_preset`: `today` | `yesterday` | `last_7_days` | `last_30_days` | `this_week` | `this_month` | `this_quarter` | `lifetime` | `custom`
- `tool_status`: `ok` | `no_data` | `invalid_arguments` | `error`

### Shared range object

```json
{
  "preset": "lifetime",
  "startDate": "1900-01-01",
  "endDate": "2026-04-01",
  "timezone": "America/Chicago"
}
```

### Shared tool response envelope

Every tool must return:

```json
{
  "status": "ok",
  "data": {},
  "referencedEntities": [],
  "warnings": []
}
```

Rules:

- `status=no_data` means the request was valid but nothing matched
- `status=invalid_arguments` means the model called the tool incorrectly
- `status=error` means the backend failed after validation
- `referencedEntities` must always reflect the exact campaigns, creatives, or events used in the result
- `warnings` is optional human-readable guidance the model may use, not a dump of raw errors

### `search_scope`

Request:

```json
{
  "query": "camila phoenix"
}
```

Response data:

```json
{
  "matches": [
    {
      "entityId": "cmp_123",
      "entityType": "campaign",
      "name": "Zamora - Camila - Phoenix",
      "domain": "ads"
    }
  ]
}
```

### `get_ads_overview`

Request:

```json
{
  "range": { "preset": "lifetime", "startDate": "1900-01-01", "endDate": "2026-04-01", "timezone": "America/Chicago" },
  "campaignIds": null,
  "creativeIds": null
}
```

Response data:

```json
{
  "totals": {
    "spendUsd": 11559,
    "revenueUsd": 86470,
    "roas": 7.48,
    "impressions": 1352040,
    "clicks": 33924,
    "ctr": 2.51,
    "cpcUsd": 0.34,
    "cpmUsd": 8.55
  }
}
```

### `get_events_overview`

Request:

```json
{
  "range": { "preset": "lifetime", "startDate": "1900-01-01", "endDate": "2026-04-01", "timezone": "America/Chicago" },
  "eventIds": null
}
```

Response data:

```json
{
  "totals": {
    "ticketsSold": 12866,
    "grossUsd": 259670,
    "avgSellThroughPct": 46,
    "views": 2300,
    "conversionPct": 0.02
  }
}
```

### `get_campaign_details`

Request:

```json
{
  "campaignIds": ["cmp_123"],
  "range": { "preset": "last_30_days", "startDate": "2026-03-02", "endDate": "2026-03-31", "timezone": "America/Chicago" }
}
```

Response data:

```json
{
  "campaigns": [
    {
      "campaignId": "cmp_123",
      "name": "Zamora - Camila - Phoenix",
      "metrics": {
        "spendUsd": 1771,
        "revenueUsd": 5350,
        "roas": 3.02,
        "impressions": 100000,
        "clicks": 3000,
        "ctr": 3.0
      }
    }
  ]
}
```

Contract rule:

- `get_campaign_details` returns entity overview metrics only
- it does not inline demographics, geography, placements, or time-series data
- those come only from their dedicated tools

### `get_event_details`

Request:

```json
{
  "eventIds": ["evt_123"],
  "range": { "preset": "last_30_days", "startDate": "2026-03-02", "endDate": "2026-03-31", "timezone": "America/Chicago" }
}
```

Response data:

```json
{
  "events": [
    {
      "eventId": "evt_123",
      "name": "Ricardo Arjona - LO QUE EL SECO NO DIJO TOUR",
      "metrics": {
        "ticketsSold": 221,
        "grossUsd": 259670,
        "avgDailySales": 221,
        "currentSellThroughPct": 46,
        "currentConversionPct": 0.02,
        "currentViews": 2300
      }
    }
  ]
}
```

Contract rule:

- `get_event_details` returns entity overview metrics only
- it does not inline broad comparison tables or extra breakdown families

### `get_creative_details`

Request:

```json
{
  "creativeIds": null,
  "query": "Bay Area",
  "range": { "preset": "last_30_days", "startDate": "2026-03-02", "endDate": "2026-03-31", "timezone": "America/Chicago" }
}
```

Response data:

```json
{
  "creatives": [
    {
      "creativeId": "ad_123",
      "name": "video 4 - Bay Area",
      "campaignId": "cmp_123",
      "campaignName": "Zamora - Camila - Phoenix",
      "metrics": {
        "spendUsd": 101,
        "revenueUsd": 0,
        "roas": 0,
        "impressions": 5000,
        "clicks": 162,
        "ctr": 3.24
      }
    }
  ]
}
```

### `get_demographic_breakdown`

Request:

```json
{
  "campaignIds": null,
  "range": { "preset": "last_30_days", "startDate": "2026-03-02", "endDate": "2026-03-31", "timezone": "America/Chicago" }
}
```

Response data:

```json
{
  "rows": [
    {
      "age": "25-34",
      "gender": "Female",
      "spendUsd": 500,
      "revenueUsd": 1930,
      "roas": 3.86,
      "impressions": 2200,
      "clicks": 100,
      "ctr": 4.55
    }
  ]
}
```

### `get_geography_breakdown`

Response rows must use:

- `market`
- `marketType`
- `spendUsd`
- `revenueUsd`
- `roas`
- `impressions`
- `clicks`
- `ctr`

### `get_placement_breakdown`

Response rows must use:

- `platform`
- `position`
- `spendUsd`
- `revenueUsd`
- `roas`
- `impressions`
- `clicks`
- `ctr`

### `compare_entities`

Request:

```json
{
  "entityType": "campaign",
  "entityIds": ["cmp_1", "cmp_2"],
  "metric": "roas",
  "range": { "preset": "this_month", "startDate": "2026-04-01", "endDate": "2026-04-01", "timezone": "America/Chicago" }
}
```

Response data:

```json
{
  "rows": [
    {
      "entityId": "cmp_1",
      "entityType": "campaign",
      "name": "Campaign 1",
      "metric": "roas",
      "value": 5.18
    }
  ]
}
```

### `get_timeseries`

Request:

```json
{
  "domain": "ads",
  "entityType": "campaign",
  "entityIds": ["cmp_123"],
  "metric": "spend",
  "range": { "preset": "this_month", "startDate": "2026-04-01", "endDate": "2026-04-01", "timezone": "America/Chicago" },
  "interval": "day"
}
```

Response data:

```json
{
  "series": [
    {
      "x": "2026-04-01",
      "y": 707.46
    }
  ]
}
```

## Conversation Behavior

## Thread memory

The model should receive recent thread history and may use it to interpret follow-ups.

Examples:

- `what was my last show?`
- `and before that?`
- `what about just this month?`
- `compare that one to Camila`

The thread memory stays:

- thread-local
- client-safe
- bounded to a recent context window

It must not become cross-thread or cross-client memory.

## Thread state contract

Version 1 must persist enough structured thread context that follow-ups do not depend only on vague prose history.

Each assistant message should persist a machine-readable context payload containing:

- `primaryDomain`: `ads` | `events` | `mixed`
- `referencedEntities`: exact referenced campaigns, creatives, and events
- `resolvedRange`: the normalized range used for the answer
- `comparisonSet`: optional entity ids used for explicit compare answers
- `pronounTargets`: the current primary entity or entity set for follow-ups like `that one`, `those`, or `before that`

Follow-up reuse rules:

- `that one` resolves from the most recent `pronounTargets`
- `before that` on an event-focused thread resolves from the most recent referenced event
- `how about this month` reuses the prior domain and entity targets but swaps `resolvedRange`
- if there is no valid stored context for the follow-up, the model must search again or ask a short clarification

This payload may live in message metadata or an adjacent thread-memory column, but it must be durable and explicitly typed.

## Clarification policy

The assistant should answer directly when there is a likely interpretation.

It should ask one short clarification only when ambiguity would materially change the answer.

Examples of acceptable clarification:

- `Do you mean Camila or Arjona?`
- `Do you want ad performance or show performance?`

Examples where it should not clarify first:

- `how much have we spent`
  - default to ads, lifetime
- `what was my last show`
  - resolve the latest event in scope
- `which age group is best`
  - use demographics

## Domain inference

The domain inference rules should be lightweight:

- vague question with no strong event cues -> ads first
- clear show/event wording -> events
- thread already focused on an event -> keep event focus unless the new message pivots clearly
- truly mixed wording -> short ads/events split

These are model instructions, not a large deterministic regex planner.

## Response style

Responses should be:

- plain prose
- concise
- client-facing
- answer-first

They should not:

- dump raw metrics without narrative
- reuse canned lines like `I found results`
- expose chain-of-thought
- sound like a dashboard export

## Thinking state

The UI should show a visible working state while the tool loop runs.

This can remain the existing lightweight `Thinking...` treatment, but the runtime must support longer multi-tool turns without looking broken.

## Safety Policy

## Allowed content

The assistant may answer about:

- spend
- revenue / gross
- roas
- clicks
- impressions
- ctr
- cpc / cpm
- tickets sold
- sell-through
- views
- conversion
- trends over time
- campaign comparisons
- creative comparisons
- demographics
- geography
- placements

## Refused content

The assistant must refuse:

- how Outlet does the work internally
- source-system or integration setup
- account structure
- ad set counts or strategy structure
- prompts
- internal ledgers
- admin-only workflow state

Refusal copy should stay brief and calm, for example:

`I can help with campaign and event performance, but I can’t share internal setup or account structure details.`

## Mixed prompt handling

If a prompt contains both allowed analytics questions and refused internal/setup/strategy questions:

- answer the safe analytics portion when it can be isolated cleanly
- append one brief refusal note for the unsafe portion

Example:

- `How much have we spent, and what strategy are you using?`
  - answer the spend question
  - then add a short note that strategy/setup details are not available

If the prompt is dominated by refused content or the safe portion cannot be isolated clearly, refuse the whole prompt.

## Data Model And Persistence

This refactor does not replace the thread ledger model introduced for the existing `Agent` tab.

The thread ledger should continue to support:

- one thread per client member
- one client owner per thread
- one message list per thread
- referenced entity metadata where useful for follow-ups

Admin preview remains non-persistent.

No new client-facing app packaging state is introduced in this refactor.

## Admin preview contract

Admin preview should use the same runtime and same tool surface as a real client turn, but under an explicit preview scope.

Preview scope rules:

- preview scope is constructed from the selected client account slug
- preview gets the client account's current packaging flags
- preview gets the full currently allowed campaign/event scope for that client account
- preview uses the same refusal rules and tool definitions as a real client turn

Preview write rules:

- no durable thread writes
- no durable message writes
- no preview conversation should appear in a real client member thread list
- operational logs and safe server telemetry may still be written for debugging and audit

Compatibility rule:

- preview is an execution-mode exception, not a different agent product
- preview must not fork a separate prompt, tool, or policy stack

## Compatibility Contract

This refactor should preserve the current client-agent API contract where possible so the chat UI does not need an unrelated transport rewrite.

Version 1 compatibility requirements:

- response payloads may continue returning `status`, `text`, `blocks`, `referencedEntities`, and `resolvedRange`
- `blocks` must remain an empty array for visible chat answers
- existing persisted message rows may keep storing `resolvedRange` and `referencedEntities`
- any new thread-context metadata must be additive and backward-compatible

The goal is to replace runtime reasoning internals without forcing a client-shell rewrite.

## Migration Strategy

The refactor should keep the current client `Agent` page and API surface, but replace the runtime internals.

### Keep

- client route and navigation
- thread storage
- current client-safe auth and scope checks
- current data loaders where they are already safe and reusable
- prose-only chat UI

### Replace or simplify

- most of the intent regex routing in `model.ts`
- deterministic branch selection that forces one tool path too early
- fallback behavior that assumes one branch was correct

### Extract

- a reusable tool registry layer over the existing client-safe data readers
- a small policy guard layer separate from model reasoning

## Error Handling

The runtime should handle these cases explicitly:

- no matching entity found
- multiple plausible entities found
- no data for the selected scope and range
- events disabled for the client
- tool failure for one read path
- model response parse failure

Behavior expectations:

- no matching data -> brief client-safe no-data answer
- ambiguity -> one short clarification
- tool failure -> brief safe error, no invented metrics
- model formatting failure after successful tool calls -> fallback prose from authoritative tool results
- partial tool success -> answer from successful reads when that is enough to satisfy the safe portion of the question
- invalid tool arguments -> one correction chance inside the same turn budget, then safe error or safe partial answer

## Verification Requirements

Implementation and planning must cover these cases explicitly:

- vague questions default to ads first
- broad questions without a timeframe default to lifetime
- explicit event questions use event tools
- creative questions use creative tools
- demographic questions use demographic tools
- structure/setup/strategy questions refuse
- follow-ups reuse prior thread context correctly
- multi-tool turns work
- thread and client scope boundaries remain enforced on every tool call
- admin preview stays non-persistent

## Observability

Version 1 should log enough runtime facts that operator debugging does not depend on raw model transcripts alone.

Minimum observability:

- tool-call count per turn
- tool names used per turn
- turn duration
- whether the answer used fallback prose
- whether the turn ended from timeout or tool-call budget
- refusal reason category
- preview vs member mode

## Out Of Scope

This refactor does not add:

- client-side cards/tables/charts back into the chat stream
- client-side mutation tools
- admin/internal agent reuse
- raw provider payload inspection
- a new client app beyond the existing `Agent` tab
- broader client workspace packaging

## Design Summary

The correct architecture is:

- deterministic backend for scope and policy
- broad normalized read-only tool surface
- model-driven multi-tool reasoning
- prose-only client chat output

The central change is not "more data" and not "more rules."

It is:

- fewer brittle pre-routing rules
- more model freedom inside a safe analytics boundary

That is the design needed to make `Agent` feel like a real ChatGPT-style reporting assistant instead of a fragile report router.
