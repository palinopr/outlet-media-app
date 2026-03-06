# Engineering Principles

## 1. Model The Real Business Objects

Do not let generic docs become the only data model.

Prefer first-class entities for:
- client
- campaign
- asset
- contact
- approval
- report
- task
- event
- agent job

Use pages/docs as context and collaboration surfaces around those entities, not as a substitute for them.

## 2. Prefer Event-Driven Architecture

Every meaningful action should be able to emit a structured event.

Examples:
- `asset_uploaded`
- `campaign_updated`
- `approval_requested`
- `client_comment_added`
- `report_generated`
- `agent_action_requested`
- `agent_action_completed`

If a workflow depends on "someone noticing something," look for the missing event.

## 3. Build The Audit Trail In By Default

Important actions should be traceable.

Every autonomous or semi-autonomous action should answer:
- what happened
- why it happened
- who or what triggered it
- what changed
- whether approval was required

Use the right trace for the right audience:
- `system_events` for the shared product timeline
- `approval_requests` for explicit decision workflows
- internal audit logs for operator-only/admin-only tracking

## 4. Keep Admin And Client In The Same System, Not Separate Products

Admin and client views can differ in permissions and depth, but they should operate on the same underlying objects and events.

Avoid duplicated business logic split by route trees when possible.

## 5. Treat Agents As Bounded Workers

Agents should not be generic chat wrappers.

Agents should:
- observe structured inputs
- make narrow decisions
- draft actions
- request approval when needed
- write outcomes back to the system

Agents should not:
- mutate core state without traceability
- rely on hidden context
- become the only place business logic lives

## 6. Design For Multi-Tenant Visibility

For every new surface, ask:
- what should admins see?
- what should clients see?
- what should collaborators/contractors see?
- what should agents be allowed to do?

Permissions should be explicit, composable, and tied to real domain rules.

## 7. Put Cross-App Workflows First

The moat is not a single feature. It is the connection between features.

Design examples:
- asset upload -> campaign review -> Meta agent -> approval -> launch/update
- Ticketmaster change -> event update -> alert/report -> client visibility
- CRM note -> task -> follow-up agent -> activity feed

## 8. Favor Feature Modules Over Route-Local Logic

Keep `src/app/**` thin.

Prefer reusable feature modules for:
- data loading
- mutations
- view models
- event emission
- access rules

## 9. Capture Durable Learnings In Repo Docs

When a pattern becomes repeatable, update `docs/context/` or `AGENTS.md`.

Do not rely on:
- one-off chat context
- memory of a single agent session
- scattered TODO comments

## 10. Optimize For The Next System, Not Just The Next Page

Before adding a new feature, ask:
- is this a one-off surface or a reusable app pattern?
- does it fit the event model?
- does it strengthen the shared operating system?
- will future agents be able to reason over it?

## 11. Correct Weak Architecture Early

If an implementation is clearly heading in the wrong direction, do not keep building on top of it just to avoid touching existing code.

Prefer to:
- extract shared logic
- introduce the right domain model
- move route-local logic into feature modules
- replace duplicated flows with one backbone

Small refactors are cheaper than letting the wrong architecture become the default.

## 12. Update Durable Context When The Shape Changes

When a refactor changes the intended system shape, update the repo context in the same pass.

That means:
- `AGENTS.md` for repo-wide operating rules
- `docs/context/` for durable architectural guidance
- `README.md` only for short high-level framing

## 13. Own Verification And Delivery

Each work slice should be treated as owned end to end.

That means:
- make the code change
- run the relevant verification yourself
- fix the failures you introduced
- update durable context if the pattern changed
- commit and push only the related files when the user wants autonomous delivery

Minimum verification bias:
- type-check for app changes
- targeted lint for touched files
- targeted tests when the path has coverage or the behavior is risky

Do not hand the user a partially verified change when the repo and tools allow you to finish it properly.
