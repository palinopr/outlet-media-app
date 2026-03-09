# TM1 Dynamic Seating

Use this note for Ticketmaster One seat-map inventory work, especially staged releases and FOMO-driven visibility control.

## Confirmed Rule

TM1 manages dynamic seating in the operational sense:
- move sections, rows, or seats between `Open`, hold buckets, and restricted inventory
- release held inventory in waves
- tighten or expand visible inventory by section

TM1 does **not** automatically maintain a fixed target like `30% open` once you set it.

Practical meaning:
- set the initial visible inventory target manually
- let sales reduce open inventory naturally
- release the next wave only when the operator decides to do it
- browserless automation can execute the TM1 move, but it still needs a valid TM1 session and an event-specific section plan

Do not assume TM1 has a built-in "always keep X% open" automation unless the exact event or account has a separate custom rule that has been verified live.

## What Is Confirmed vs Inferred

Confirmed from live TM1 UI:
- `Seat Map -> Inventory` supports `Seat`, `Row`, and `Section`
- selecting a section surfaces a `Move` action
- inventory status buckets such as `Open`, holds, `Restricted`, and `Kill` are operator-managed from this workflow

Confirmed from public Ticketmaster materials:
- TM1/Event Management supports inventory distribution, reclassification, and real-time re-allocation
- public Ticketmaster materials describe operator-controlled inventory strategy, not an auto-maintain percentage rule

Inference:
- standard TM1 inventory behavior is staged manual control, not automatic replenishment back to a target percentage

## Working Rule for Strategy

For soft events where scarcity matters:
- start with about `30%` to `35%` visible open inventory
- do not touch inventory after every individual sale
- close weak outer or upper sections first
- keep better camera-facing and better-converting sections visible
- release additional sections in deliberate waves only when needed

For stronger events:
- keep inventory tighter
- avoid over-releasing sections just because demand is healthy

## Event-Specific Rule

The TM1 move engine can be reused across all events, but the seat strategy cannot be hardcoded globally.

What changes by event:
- section IDs
- row IDs
- seat IDs
- hold/allocation target IDs
- venue shape and weak/strong inventory areas

What should stay generic:
- the TM1 move workflow
- the optimistic-lock/version handling
- the strategy pattern of tightening weak sections first and releasing inventory in waves

So the correct automation shape is:
- one generic TM1 move engine
- one event-specific selection plan built from that event's live TM1 inventory and layout

## Separate This From Pricing

Dynamic seating here means inventory visibility and section release strategy.

It is not the same as dynamic pricing:
- inventory staging happens in `Seat Map -> Inventory`
- price changes are a separate pricing/offer workflow

## Operator Workflow

1. Open the live event in TM1.
2. Go to `Seat Map -> Inventory`.
3. Switch to `Section` mode unless a smaller unit is required.
4. Inspect current `Open`, hold, and restricted counts.
5. Select the weakest visible sections first.
6. Use `Move` to change those sections into the target hold or restricted status.
7. Re-check visible inventory after the move.

## Browser Note

If Codex browser MCP is unhealthy:
- prefer the official cleanup in `docs/context/codex-workflow.md`
- if Chrome DevTools MCP still fails, a live Chrome-tab fallback is acceptable for inspection and operator assistance

## Browserless Note

Browserless TM1 seat moves are now possible through the repo's server-side TM1 client.

Important constraints:
- TM1 sign-in is still required in principle
- automation uses env-managed TM1 session values rather than a visible browser session
- if the TM1 session expires, browserless writes stop working until the session values are refreshed
