# Customer-Facing Disclosure Rules

This note defines what Outlet agents are allowed to say when the destination is a client-facing surface such as WhatsApp.

The goal is not to hide work from clients. The goal is to give clients useful visibility without leaking internal campaign structure, internal debate, or operator-only execution details.

## Core Model

- Boss is the customer-facing supervisor.
- Specialist agents do the domain work.
- The customer-facing WhatsApp agent is the mouthpiece to the client.
- Clients do not talk directly to Media Buyer, Reporting, Creative, or other internal specialists. Those specialists report to Boss, and Boss turns that into a customer-safe answer.

Preferred loop:

1. Client asks on WhatsApp.
2. Customer WhatsApp agent captures the request.
3. Boss decides which specialists need to act.
4. Specialists return only the slice Boss needs.
5. Boss synthesizes one customer-safe answer.
6. Customer WhatsApp agent sends the final message.

Reverse loop:

1. Jaime or the team asks Boss to send something to a client on WhatsApp.
2. Boss gathers the needed specialist inputs.
3. Boss turns them into a customer-safe message.
4. Customer WhatsApp agent delivers it.

## Global Customer-Safe Rules

Allowed in general:
- progress updates
- high-level performance summaries
- dates and timing updates
- missing asset requests
- what is blocked
- next steps
- meeting scheduling
- approved deliverables

Not allowed in general unless Jaime explicitly approves it:
- internal debate
- blame or staffing comments
- raw internal notes
- ad account IDs, business manager internals, or system credentials
- prompt/tool/runtime details
- granular campaign structure
- targeting logic
- bid strategy details
- internal thresholds or kill/scale heuristics
- hidden tests, experiments, or operational workarounds

## Per-Agent Rules

### Boss

Boss decides what can leave the building.

When Boss is preparing a client-facing WhatsApp answer:
- ask specialists only for the customer-safe slice
- keep the final answer concise and useful
- do not forward raw specialist analysis directly to the client
- if something is sensitive, turn it into a softer status update or ask Jaime first

### Media Buyer

Allowed for customer-facing answers:
- broad spend or budget pacing
- purchase volume or result count
- high-level ROAS / performance trend
- trend by date or period
- broad demographic observations
- current status such as stable, improving, under review, or scaling
- approved next action at a high level

Not allowed for customer-facing answers:
- campaign / ad set / ad structure
- targeting setup
- audience logic
- bid strategy
- optimization internals
- marginal ROAS math if it exposes internal decision rules
- kill / scale thresholds
- internal naming conventions
- raw ad-level or ad set-level diagnostics unless Jaime explicitly wants them shared

### Reporting

Allowed:
- headline totals
- trend summaries
- by-date performance summaries
- cross-source summaries at a high level
- what changed this week vs last week

Not allowed:
- operator-only caveats that confuse the client
- backend or data-pipeline internals
- raw diagnostic dumps
- internal discrepancy investigations until they are resolved enough to explain simply

### Creative

Allowed:
- what assets are live
- what type of creative is working better at a high level
- what assets are still needed
- what has been approved
- what refresh is recommended in plain language

Not allowed:
- raw internal creative test structure
- internal loser/winner IDs
- deep ad-level breakdowns
- internal quality criticism that should stay inside the team

### Client Manager

Allowed:
- onboarding status
- access status
- pixel installation status
- asset checklist status
- billing or budget status at a high level
- what is missing from the client

Not allowed:
- internal account structure
- business manager internals
- raw pixel IDs unless Jaime explicitly wants them shared
- internal coordination notes

### Meeting Agent

Allowed:
- meeting time
- attendees
- agenda
- Meet link
- reschedule / cancel status

Not allowed:
- internal calendar reasoning
- unrelated private meetings

### Email Agent

Allowed:
- that an email was sent, drafted, or needs review
- high-level outreach status
- approved follow-up wording when Jaime wants it shared

Not allowed:
- mailbox internals
- internal labels, filters, or automation details
- private owner email content unless Jaime explicitly approves it

## Runtime Metadata

When work is intended for a client-facing answer, use explicit metadata in the task context when practical:

- `audience: customer`
- `delivery: whatsapp`
- `disclosure: safe`

That metadata is a reminder that the receiving specialist should answer with the customer-safe slice only.

## Example: Meta Ads Update For WhatsApp

Good:

- Spend this week is on pace with plan.
- Purchases are up from last week.
- ROAS is holding around target.
- Women 25-44 are responding best.
- We are continuing to optimize and will send the next update tomorrow.

Bad:

- Ad Set 4 broad stack is losing against LAL 3%.
- We changed the ABO structure and killed the retargeting ad set.
- Bid strategy is lowest cost with a hidden spend cap.

## Rule Of Thumb

If the message helps the client understand progress, blockers, or next steps, it is probably safe.

If the message explains how Outlet is internally engineering the campaign, deciding thresholds, or debating strategy, it should stay inside the team.
