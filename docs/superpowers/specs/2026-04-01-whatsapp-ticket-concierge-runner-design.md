# WhatsApp Ticket Concierge Runner Design

> **Historical note (2026-04-02):** The WhatsApp transport and concierge slice described here were later removed from the active repo. Keep this document only as historical design context, not as a current implementation target.

## Purpose

This document defines the first internal test slice for a WhatsApp ticket concierge runner.

The goal is to prove the selling engine before adding any new app surface. A customer should be able to send a natural message such as `I need 2 tickets for Zamora under $300`, have the system infer the target show from ad context, receive 3 seat options with lightweight location visuals, choose one, and get a regular Ticketmaster checkout link immediately.

This is not a client portal feature yet. It is not a Discord workflow. It is not a broad autonomous sales platform. It is an internal deterministic runner that can be tested end to end on one Zamora event.

## Product Outcome

After this work:

- the system can accept a plain customer-style ticket request plus known event context
- the runner can parse quantity and budget from the message
- the event/show/date can be inferred from ad context instead of asking the customer again
- the runner can produce 3 ranked seat options using all-in totals after fees
- each option can include a simplified section map so the customer can see roughly where the seats are
- the customer can choose an option with WhatsApp buttons when supported, or with `1 / 2 / 3` as a fallback
- the runner can generate a real regular Ticketmaster checkout link for the chosen option immediately
- if the selected seats disappear, the runner can regenerate 3 fresh options instead of silently swapping inventory

The intended user feeling is:

- "I can just say what I need."
- "I can see where the seats are, not only the price."
- "When I pick one, I get the payment link right away."

The first test should not feel like:

- a back-office workflow exposed to customers
- a Discord-driven operator flow
- a brittle screenshot bot
- a generic chatbot improvising seat choices

## Scope

### In scope for v1

- one Zamora event only
- internal runner / harness only
- plain-language customer request parsing
- event inference from ad context
- live candidate-seat collection
- all-in pricing after fees
- deterministic ranking
- 3 presented options
- simplified section mini map
- immediate regular Ticketmaster checkout-link generation after customer selection
- option refresh when inventory changes

### Explicitly out of scope for v1

- general support for every event and venue
- Discord routing or Discord supervision
- new app pages or customer-facing web UI
- exact seat-dot visualization
- full screenshot-based seat previews as the default path
- autonomous seat substitution without customer visibility
- generalized CRM or lifecycle automation

## Core Decisions

### 1. The runner is deterministic

The first slice should be rules-based, not prompt-led.

An LLM may help parse a message in the future, but the selection and ranking logic for seats should remain deterministic:

- quantity parsing should be explicit
- budget should be treated as final total after fees
- option filtering should be explicit
- ranking should be explicit
- failure handling should be explicit

The goal is trust and debuggability, not conversational cleverness.

### 2. Show context is inferred, not re-asked

The runner should receive ad-level event context out of band.

If the customer comes from a specific ad or WhatsApp entry path tied to one show, the runner should use that event/show/date automatically. It should not ask "which show?" unless the event context is actually missing or ambiguous.

### 3. The customer gets up to 3 options

The runner should target 3 options, not 1 and not an unbounded list.

Three is enough to create meaningful choice without making the chat noisy. It also supports the desired fallback behavior when the customer has a strict budget but needs alternatives.

Scarce-inventory fallback must be explicit:

- if 3 valid options exist, return 3
- if only 2 valid options exist, return 2 and explicitly say live inventory is limited
- if only 1 valid option exists, return 1 and explicitly say live inventory is limited
- if no valid options exist, return a structured `no_inventory` result instead of broadening constraints silently

### 4. Budget means all-in after fees

If the customer says `under $300`, the runner should evaluate options using final totals after fees, not face value.

This is a trust requirement. The customer should not feel tricked by low face values that turn into over-budget checkouts.

If nothing is available under budget, the runner should return the 3 closest over-budget options rather than stopping and asking for a new budget first.

For v1, `all-in` means:

- base ticket price
- mandatory service fees
- mandatory facility / venue fees
- mandatory order-processing fees prorated across the requested quantity when the quote source returns them only at order level

`All-in` does not include optional add-ons such as:

- ticket insurance
- parking
- merchandise
- donations

Fee source-of-truth rule for v1:

- use the exact consumer-side or inventory-side quote that already includes mandatory fees when available
- if the quote source cannot produce a trustworthy mandatory-fee total, exclude that option from v1 instead of showing an estimated all-in number

### 5. Seat visuals should use a simplified real section map

The recommended default is a simplified venue map generated from TM1 geometry.

The mini map should:

- show `STAGE`
- show the venue at section level
- gray out non-selected sections
- highlight the offered section in one clear color
- optionally label the section
- avoid exact seat-dot rendering in v1

If the TM1 geometry for a venue is too messy or incomplete, the runner may fall back to a generic bowl template that still indicates the approximate area:

- floor / lower / upper
- left / center / right

The runner should not use a seat-map screenshot crop as the default first implementation. That path is more brittle and should be treated as a later enhancement or premium proof path.

### 6. Selection should produce the checkout link immediately

When the customer chooses an option:

- preferred path: WhatsApp interactive buttons
- fallback path: `Reply 1, 2, or 3`

After the customer selects one option, the runner should immediately attempt to generate the regular Ticketmaster checkout link for that exact selection. It should not add an intermediate confirmation step such as "locking now" before attempting the checkout flow.

The checkout executor boundary for v1 is:

- assume an already-authenticated browser/session context exists for the internal test runner
- generate the checkout URL only
- do not attempt payment
- do not attempt fulfillment
- do not mutate the selected option into a different seat choice without surfacing that change to the customer

### 7. Inventory conflicts must be visible

If the selected seats are gone by the time the runner tries to generate the checkout link:

- do not silently substitute another option
- do not auto-pick the next best choice
- tell the customer those seats are no longer available
- rebuild 3 fresh options
- send the refreshed set clearly

This preserves trust and avoids hidden substitution.

## Customer Journey

### Entry

1. Customer clicks a Zamora ad that routes into WhatsApp.
2. The entry path provides event context for a single show.
3. The customer sends a first message such as `I need 2 tickets for Zamora under $300`.

### Option preparation

4. The runner parses the message into a strict intent:
   - quantity
   - maximum all-in budget
   - any supported optional preference cues
5. The runner loads live candidate inventory for the inferred event.
6. The runner normalizes all candidate prices to final totals after fees.
7. The runner filters and ranks candidates.
8. The runner returns up to 3 options, depending on valid live inventory.

### Customer-facing option payload

Each option should contain:

- option number
- total all-in price
- section
- row
- confirmation that seats are together
- one short note such as `best value`, `closer to stage`, or `clean center view`
- mini map image showing the highlighted section

The choice UI should be:

- WhatsApp buttons when supported
- `Reply 1, 2, or 3` when buttons are unavailable

### Selection

9. The customer picks one option.
10. The runner immediately runs the checkout-link generation path.
11. If successful, it sends the regular Ticketmaster checkout link with time-sensitive wording.
12. If unsuccessful because inventory changed, it sends a clear refresh message and the current valid result set: up to 3 fresh options, or `no_inventory` if no viable seats remain.

## Selection State Rules

The selection flow must be explicit so the fallback path is deterministic.

### Valid selection

- a button tap for one presented option
- a reply of `1`, `2`, or `3` that matches one currently active option

### Invalid selection

If the customer replies with anything else while option selection is active:

- do not discard the active options immediately
- send a short correction such as `Reply 1, 2, or 3 to pick one of these options.`
- preserve the current option set until timeout or refresh

### Duplicate selection

If the customer selects the same option twice:

- treat the second selection as idempotent
- do not generate a second independent checkout flow if a live checkout result already exists for that option

### Timeout

Prepared option sets should expire after a short window because inventory is live.

For v1:

- an option set should carry an explicit expiry timestamp
- if the customer replies after expiry, the old set is stale
- the runner should tell the customer those options expired and regenerate fresh options instead of attempting the old selection

### Refresh invalidates old choices

Once a refreshed option set is sent:

- the prior option ids are no longer valid
- a reply referring to the previous set should be treated as stale
- the runner should tell the customer inventory changed and direct them to choose from the current set

## Internal Architecture

The v1 runner should be split into small internal modules with clear responsibilities.

### `message-parser`

Input:

- free-text customer request

Output:

- strict intent object, for example:

```json
{
  "quantity": 2,
  "maxTotalCents": 30000,
  "preferences": ["near_stage"]
}
```

This parser should stay narrow and predictable. It does not need to become a general natural-language platform.

For v1, supported preference tokens should be fixed and small:

- `near_stage`
- `center_view`
- `lower_level`
- `aisle`

Unknown preference language should be ignored in v1 rather than guessed.

### `event-context-resolver`

Input:

- internal ad or entry context

Output:

- one explicit event context object:
  - event id
  - event name
  - date
  - venue

For the first test harness, this can be passed in manually or from a fixture. The runner should still treat it as a separate module so the inference path can be wired later without rewriting the selection engine.

### `inventory-collector`

Input:

- event context
- requested quantity

Output:

- candidate seat options from live Ticketmaster / TM1-aware sources

This module should be responsible only for collecting candidate inventory and enough metadata to support pricing, section labeling, and selection later.

### `price-normalizer`

Input:

- candidate inventory entries

Output:

- comparable final totals after fees

This module should convert every option into one canonical number the ranking engine can trust. If an option does not have a trustworthy all-in total, it should be excluded from v1.

### `option-ranker`

Input:

- normalized candidate options
- intent object

Output:

- up to 3 options

Ranking priority:

1. under budget
2. closest to budget without going over
3. supported preference match when one of the fixed v1 preference tokens is present
4. better section quality / viewing angle
5. cleaner row and seat pairing

If nothing is under budget:

1. closest over-budget totals
2. supported preference match when one of the fixed v1 preference tokens is present
3. better section quality
4. cleaner row and seat pairing

The ranker should not attempt hidden preference learning in v1.

### `mini-map-renderer`

Input:

- venue layout / TM1 geometry
- highlighted section

Output:

- simple map image or SVG

Default path:

- simplified real section map from TM1 geometry

Fallback path:

- abstract bowl template with area highlight

### `checkout-executor`

Input:

- chosen option

Output:

- Ticketmaster checkout link or a structured conflict result

This module should use the regular consumer checkout flow and capture the generated checkout URL. It should remain narrowly responsible for turning one chosen option into one checkout attempt.

### `result-formatter`

Input:

- ranked options or checkout result

Output:

- customer-facing payloads

This module is responsible for final wording, choice labels, and refreshed-option messaging. It should not own ranking or checkout logic.

## Data Contracts

### Runner input

The first harness should accept:

- `customerMessage`
- `eventContext`

Example:

```json
{
  "customerMessage": "I need 2 tickets for Zamora under $300",
  "eventContext": {
    "artist": "Ricardo Arjona",
    "city": "Miami",
    "date": "2026-04-02",
    "eventId": "0D0062FF195A626B"
  }
}
```

### Prepared options output

Example shape:

```json
{
  "options": [
    {
      "id": "opt_1",
      "label": "Option 1",
      "totalCents": 28600,
      "section": "114",
      "row": "K",
      "seatLabels": ["7", "8"],
      "quantity": 2,
      "note": "Best value",
      "mapImagePath": "/tmp/seat-map-opt-1.svg",
      "quoteSource": "exact",
      "expiresAt": "2026-04-01T20:10:00.000Z",
      "execution": {
        "source": "tm1",
        "sectionId": "114",
        "rowId": "K",
        "seatIds": ["7", "8"],
        "inventoryVersion": 123,
        "layoutVersion": "45",
        "externalEventVersion": 67,
        "selectionPayload": {
          "placeSelections": [
            { "sectionId": "114", "rowId": "K", "placeId": "7" },
            { "sectionId": "114", "rowId": "K", "placeId": "8" }
          ]
        }
      }
    }
  ]
}
```

The `execution` object is required. The checkout executor must not depend on hidden in-memory seat state that is absent from the prepared option contract.

### Selection output

Success:

```json
{
  "status": "checkout_ready",
  "optionId": "opt_1",
  "checkoutUrl": "https://auth.ticketmaster.com/..."
}
```

Conflict:

```json
{
  "status": "inventory_changed",
  "reason": "selected_seats_unavailable"
}
```

No inventory:

```json
{
  "status": "no_inventory",
  "reason": "no_viable_options"
}
```

Lookup failure:

```json
{
  "status": "lookup_failed",
  "reason": "upstream_inventory_error"
}
```

## Failure Handling

### Missing event context

If the ad or entry path does not provide one unambiguous event, the runner may ask a follow-up. This should be rare and treated as an exception path.

### Weak parsing

If quantity or budget cannot be parsed, the runner may ask a minimal clarification question. It should not ask for show/date when event context is already known.

### No under-budget inventory

Return the 3 closest over-budget options.

### Fewer than 3 viable options

If filtering leaves fewer than 3 valid options:

- return the valid 1-2 options that remain
- make the limited live inventory explicit in the customer-facing wording
- do not widen constraints silently just to manufacture 3 choices

### No viable inventory at all

If no valid options remain after filtering:

- return a structured `no_inventory` result
- for internal testing, the formatter should produce a short out-of-stock message instead of inventing substitutes

### Partial pricing data

If an option does not have a trustworthy mandatory-fee-inclusive total:

- exclude it from v1
- do not estimate final totals from face value alone

### Inventory changed after selection

Tell the customer the selected seats are no longer available and send the current valid result set: up to 3 fresh options, or `no_inventory` if no viable seats remain. Do not auto-substitute.

### Map rendering failure

If the simplified real section map cannot be built, use the abstract bowl fallback. If that also fails, return the option without a map for internal testing rather than blocking the entire runner.

### Checkout-link generation failure

Return a structured failure and retry path. Do not pretend the link exists. If the failure is due to seat loss, treat it as an inventory refresh case.

### Upstream lookup failures

If Ticketmaster, TM1, or the browser collection step fails upstream:

- return a structured `lookup_failed` result
- do not fall back to stale inventory
- do not present incomplete options as if they were live

## Testing Strategy

The first test slice should be verified in layers.

### 1. Parser fixtures

Use a small set of customer-style message fixtures:

- `need 2 tickets under $300`
- `2 tickets near the stage under 500`
- `looking for 4 seats together`

Verify that quantity and budget parse deterministically.

### 2. Ranking fixtures

Use controlled candidate-option fixtures and verify:

- under-budget options win
- closest under-budget option ranks highest
- over-budget fallback works when necessary
- split seats are excluded
- fixed preference tokens affect ranking deterministically
- fewer-than-3 valid options return 1-2 options without widening constraints

### 3. Mini-map rendering checks

Verify:

- section highlighting works for the target Zamora event
- abstract fallback works when geometry is unavailable
- prepared option expiry is attached to rendered outputs

### 4. Checkout executor proof

Run the real browser checkout path on the chosen Zamora event and confirm:

- one selection can produce a real Ticketmaster checkout URL
- the URL is short-lived and should be treated as time-sensitive

### 5. End-to-end harness

Run:

- message + event context in
- up to 3 options out
- choice in
- checkout link or refreshed options out

Also verify:

- invalid numeric reply handling
- stale reply after option expiry
- stale reply after a refresh
- zero-inventory and upstream-failure result shapes

This is the actual stop gate for the first slice.

## Rollout and Non-Goals

This spec intentionally stops at one proven internal vertical slice.

It does not commit the product to:

- a client app feature
- a Discord workflow
- a CRM workflow
- a general multi-event seller

The next step after proving this slice is to decide how to expose it. That decision should happen after the runner works end to end on one Zamora event.
