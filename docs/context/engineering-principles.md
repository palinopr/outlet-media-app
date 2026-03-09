# Engineering Principles

## 1. Model The Real Business Objects

Do not let generic docs become the only data model.

Prefer first-class entities for:
- client
- campaign
- asset
- campaign action item
- contact
- approval
- report
- task
- event
- agent job

Use pages/docs as context and collaboration surfaces around those entities, not as a substitute for them.
Dashboards and reporting views are also first-class product surfaces for users who prefer summary-first workflows.

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

Event-driven does not just mean "write a log row."

For product-critical events, store enough envelope data to make the event safe later:
- `event_version` so event shape changes do not break older consumers
- `occurred_at` so business time is explicit
- `source` so the producer is explicit
- `correlation_id` and `causation_id` so cross-step traces can be reconstructed
- `idempotency_key` when the producer or consumer may retry

Consumers must be safe to replay.

If the same event is delivered twice, the second pass should be a no-op instead of creating duplicate work, duplicate notifications, or duplicate external actions.

If a database mutation and an external side effect both matter, do not rely on "write state now, enqueue later if nothing fails."
Write the business change and the outbound work record in the same transaction through an outbox-style pattern.

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

Production agents need more than a prompt.

Ship autonomous workflows with:
- narrow tool scope
- structured inputs and outputs where possible
- explicit approval gates for risky actions
- visible failure paths
- eval or fixture coverage before enabling real outbound side effects

## 6. Design For Multi-Tenant Visibility

For every new surface, ask:
- what should admins see?
- what should clients see?
- what should collaborators/contractors see?
- what should agents be allowed to do?

Permissions should be explicit, composable, and tied to real domain rules.

App-level checks are necessary but not sufficient.

Important tenant boundaries should also be enforced in the database layer.
Prefer Clerk/Supabase claim-backed RLS for tenant reads and writes where practical, and reserve service-role access for tightly controlled server paths.
For user-facing server reads, prefer a Clerk-scoped Supabase client so those RLS policies are actually exercised in production paths instead of only documented. Keep service-role reads only for internal/admin-global surfaces that do not yet have an equivalent admin-safe RLS model.
Do not partially migrate a loader that joins multiple tables unless every user-facing table in that read path has compatible RLS. Mixed permission models force hidden service-role fallbacks and make the access story harder to reason about.
Use the database to enforce the tenant boundary first, and keep finer campaign or event scope filters in app loaders when the row model does not encode that scope directly.
For workflow rows linked to a parent entity, derive tenant access from the parent when that parent is the real owner. Do not trust a copied `client_slug` alone if the parent record can be reassigned later.
For campaign-owned workflow rows, derive access from the effective campaign owner, including explicit overrides, before falling back to copied row-level client fields.
For background worker ledgers such as `agent_tasks`, do not grant direct broad reads just because the runtime needs access. Client-facing reads should inherit from the shared product event or owning entity that requested the work.
Keep credential-bearing tables such as OAuth token stores server-only. Expose them through safe server queries or views, not direct user-readable tables.
Do not put secrets in member-readable config tables. If a setting must be readable by client members for feature gating, keep it non-secret or split the secret part into a separate server-only table.
For shared roster tables such as `client_members`, member-readable RLS is acceptable when the surface explicitly needs same-client team visibility. Keep those rows limited to non-secret identity and role metadata.
When adding Postgres helper functions, set an explicit `search_path` instead of relying on the session default so security linting stays clean and function resolution cannot drift.

## 7. Put Cross-App Workflows First

The moat is not a single feature. It is the connection between features.

Design examples:
- asset upload -> campaign review -> Meta agent -> approval -> launch/update
- Ticketmaster change -> event update -> alert/report -> client visibility
- CRM note -> task -> follow-up agent -> activity feed

When work starts in one app but belongs to another context, preserve that linkage in structured metadata and events immediately. Do not let campaign context disappear just because the upload started in the asset library.
Campaign-specific next steps should stay attached to the campaign itself instead of falling back to generic workspace task boards.
Campaign discussion should stay attached to the campaign itself instead of living only in generic workspace pages.
When campaign discussion turns into real work, convert it into a source-linked campaign action item instead of letting the request stay buried in comments.

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

## 11. Support Both Summary Users And Workflow Users

Do not force every user into the same experience depth.

Some users want:
- charts
- KPIs
- trend lines
- summaries
- a simple dashboard

Other users want:
- comments
- approvals
- tasks
- activity
- deeper operating workflows

Build both layers on the same underlying objects and events.
Traditional dashboard summaries should be composed from the same first-class approvals, action items, comments, and `system_events` backbone as the deeper workflow views.
Summary-first dashboards should include clear action queues, not only passive metrics, so traditional users can see what needs review without navigating the full workflow surface.
When a new first-class app such as CRM becomes operationally important, surface its key pressure points on the main dashboards instead of burying it only inside a dedicated tab.

## 12. Correct Weak Architecture Early

If an implementation is clearly heading in the wrong direction, do not keep building on top of it just to avoid touching existing code.

Prefer to:
- extract shared logic
- introduce the right domain model
- move route-local logic into feature modules
- replace duplicated flows with one backbone

Small refactors are cheaper than letting the wrong architecture become the default.

## 13. Update Durable Context When The Shape Changes

When a refactor changes the intended system shape, update the repo context in the same pass.

That means:
- `AGENTS.md` for repo-wide operating rules
- `docs/context/` for durable architectural guidance
- `README.md` only for short high-level framing

## 14. Own Verification And Delivery

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

## 15. Check Primary Sources Before Assuming

When implementation details are uncertain, do not guess.

Use:
- GitHub MCP for codebase search, repo patterns, and external implementation references
- Context7 for current library and framework documentation

Prefer primary sources and concrete examples over memory when:
- a library API is unclear
- a framework behavior is version-sensitive
- a pattern choice would affect architecture or production behavior

## 16. Earn Standalone Surfaces

Do not promote every capability into its own top-level page.

Prefer to:
- start with the primary operating context such as campaign detail, event detail, admin CRM, or the admin client/account hub
- embed supporting workflow panels inside that context first
- add a standalone navigation item only when current users clearly need to manage that capability directly and the surface will not duplicate existing workflow logic

Current packaging rule:
- client-facing top-level web should stay focused on campaigns and events until another surface has clearly earned its way in
- deeper capabilities such as approvals, conversations, assets, agent follow-through, and CRM should usually be embedded first instead of immediately becoming separate client tabs

## 17. Remove Dead Paths And Duplicate Flows

Dead code and dead UI both create product drag.

Do not ship:
- dead nav items
- parked placeholder routes
- old and new versions of the same workflow exposed at the same time by default
- separate loaders and mutations for the same business concept when one shared feature module should exist

When replacing or narrowing a surface:
- remove the old navigation entry
- redirect or gate the direct route in the same pass
- delete the replaced code after the new path is stable instead of letting it linger indefinitely

"Maybe later" is not enough reason to keep a weak or duplicate surface alive.
