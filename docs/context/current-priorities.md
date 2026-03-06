# Current Priorities

This file is the short-term product and architecture guide. Update it when priorities shift in a durable way.

## Current Product Focus

Outlet is being built as a client-facing autonomous agency operating system.

The short-term focus is:

1. Make the workspace feel coherent across admin and client views.
2. Turn campaigns, assets, approvals, reports, CRM, and activity into first-class product areas.
3. Build the event backbone that lets agents react to real system activity.
4. Improve customer visibility so clients can follow work, comment, approve, and understand progress.
5. Preserve a familiar dashboard/reporting layer with charts and summaries for traditional users.
6. Keep adding apps that fit the same shared operating environment instead of building isolated tools.

## Near-Term Architecture Focus

- Keep the Notion-like workspace shell, but do not let generic documents become the only product model.
- Prefer feature modules around domain areas such as `campaigns`, `assets`, `crm`, `workspace`, and `agents`.
- Record meaningful system actions as structured events.
- Use `system_events` as the shared activity backbone instead of creating separate ad hoc logs per feature.
- Use `approval_requests` for explicit decision flows with audience-aware visibility (`admin`, `client`, `shared`).
- Treat approvals as a first-class app surface with dedicated admin/client routes instead of only embedding approval panels inside other pages.
- Keep approval visibility scope-aware for assigned client members, so limited members only see campaign/event-linked approvals that match their allowed scope when context exists.
- Use campaign-native action items for campaign next steps instead of forcing campaign operations into only the generic workspace task board.
- Design agents as bounded workers attached to those events.
- Keep admin and client experiences on the same backbone with different permissions and visibility.
- Keep traditional dashboards as first-class surfaces, not as an afterthought layered on top of workflow views.
- Make traditional reporting surfaces pull from the same workflow backbone too, so graphs and summaries stay connected to next steps.
- Keep reports on a shared feature/data layer across admin and client surfaces, so KPI math, trend data, and top-performer logic do not drift into separate route-local implementations.
- Treat the workspace tasks pages as the operating queue entry point, not only the generic board, so cross-app next steps from campaigns, CRM, events, and assets stay visible in one place.
- Keep event detail and other analytics-heavy pages tied to the same workflow/activity backbone, so performance views do not become dead ends.
- Turn admin event surfaces into operating views, not only bulk-edit tables, so ticketing state and promotion workflow live together.
- Treat assets as a first-class admin app surface with index/detail operating views, instead of hiding creative review inside client detail widgets or raw APIs.
- Treat asset discussion as a first-class collaboration surface so creative feedback, internal review, and client-visible context stay attached to the asset itself.
- Treat asset follow-up items as first-class workflow objects so creative review notes, agent outcomes, and production next steps become visible work instead of passive comments.
- Treat the assets index pages as operating surfaces too, not only file libraries, so creative discussions, follow-up work, and agent recommendations stay visible before users drill into a single asset.
- Reuse the shared conversations, work queue, and agent follow-through modules on asset surfaces instead of creating asset-only summary logic that drifts from campaigns, CRM, and events.
- Keep client asset visibility scope-aware for assigned members, so asset lists, asset detail routes, asset summaries, and asset discussion APIs only expose creative linked to the campaigns or events that member is actually allowed to see.
- On client campaign and event detail routes, prove the entity belongs to that client and matches assigned scope before loading detailed data, so a guessed id cannot bypass tenant or scope boundaries.
- Keep client campaign and event comment APIs scope-aware too, so guessed ids inside the same client account cannot reveal or mutate discussions outside the member's assigned campaigns or events.
- Treat event discussions and event follow-up items as first-class workflow objects so ticketing context, promotion questions, and show-level next steps stay attached to the event instead of being lost in generic notes.
- On event pages, combine event-specific agent outcomes with linked campaign agent outcomes so the show-level operating view stays complete instead of forcing users to infer work from campaign pages alone.
- Treat `/admin/activity` as the shared operations center, not only a legacy audit table, so admins can manage approvals, discussions, agent follow-through, and cross-app activity from one place.
- Keep `admin_activity` as a secondary audit trail behind the operations center instead of letting low-level page-view logs become the main operating surface.
- Keep asset review pressure visible on the regular dashboards too, so summary-first users can spot creative bottlenecks without opening the full asset app first.
- Derive dashboard workflow summaries from the same campaign-native approvals, action items, comments, and `system_events` backbone instead of introducing separate summary-only state.
- Make dashboard-first users actionable by surfacing pending approvals and unresolved campaign discussion directly on the dashboard.
- Give clients a dedicated updates surface, not just dashboards, so they can follow approvals, discussion, agent follow-through, and shared activity without hunting across tabs.
- Filter shared client activity by assigned campaign/event scope where possible, so limited-scope members get a coherent feed without seeing unrelated workflow context.
- Keep cross-app activity links entity-aware, so shared activity opens the correct campaign, asset, CRM contact, or event detail page instead of dropping users into the wrong surface.
- Keep notifications entity-aware and route-aware too, so admin and client users land on the correct campaign, asset, approval, CRM, event, or workspace surface instead of dead-ending in a generic inbox.
- Treat notifications as first-class inbox surfaces on both admin and client, not only a bell popover, so users can work through routed updates in a full-screen flow.
- On client surfaces, load notifications with client-slug scoping so client users and admin previews never pull unrelated admin notifications into the client portal.
- Treat conversations as a first-class app surface on both admin and client, not only as dashboard widgets or detail-page side panels, so unresolved discussion can be managed in one place.
- Reuse the shared conversations feature module anywhere open discussion is summarized, instead of re-querying each comment table per route and letting discussion logic drift.
- When client members have assigned scope, shared workflow loaders should honor both campaign scope and event scope so dashboards, conversations, notifications, and agent follow-through stay complete without leaking unrelated work.
- Treat the admin clients index as an account health surface, not just a billing roster, so operators can see which client accounts need approvals, discussion responses, next steps, or creative review.
- Treat admin client detail pages as account operating hubs too, not only membership/assets/service management, so operators can manage workflow pressure, CRM relationship work, activity, agent follow-through, and show-level context from the client record itself.
- Prefer direct workflow controls on action/follow-up panels so operators can move work between statuses without opening a form for every change.
- Surface agent follow-through inside campaigns and dashboards so users can see what the system asked agents to do and what came back.
- Let useful agent outcomes turn into source-linked campaign action items so recommendations and failures become operational next steps.
- Treat `crm_contacts` as the tenant-aware CRM backbone for the in-product CRM app instead of hiding CRM state in unrelated lead tables or ad hoc notes.
- Treat CRM contact detail pages as first-class routes so search, activity, dashboards, and CRM lists can all deep-link into the same record.
- Queue bounded CRM follow-up triage when a contact becomes urgent or due soon, and surface that follow-through back on the CRM record instead of leaving it hidden in the agent runtime.
- Treat CRM follow-up items as first-class CRM workflow objects so agent recommendations and human next steps become visible work, not just notes or passive output.
- Surface active CRM next steps on the regular dashboards so summary-first users can still see relationship work that needs attention.
- Surface unresolved CRM discussions on the regular dashboards too, so summary-first users do not miss client relationship issues that only live on the contact record.
- Keep unresolved CRM discussions visible inside the CRM app itself, not only on the dashboard or the individual contact page.
- Treat CRM contact discussions as first-class collaboration surfaces so client requests, internal notes, and follow-up creation stay attached to the relationship record itself.
- Keep CRM contact activity timelines broad enough to include linked follow-up items, comments, and agent requests instead of only direct contact edits.

## Immediate Build Bias

When choosing what to build next, bias toward:

- shared visibility
- familiar dashboards and graph-based reporting for traditional users
- campaign-centered collaboration
- approval and activity flows
- campaign-native comments and discussion
- event-driven automation
- first-class business objects over generic page abstractions
- fully owned, production-ready slices with verification and durable context updates

Bias away from:

- isolated UI polish with no operational payoff
- one-off route logic that duplicates domain behavior
- agent features that are just chat without structured triggers or outcomes
- preserving weak architecture just because it already exists
