# Current Priorities

This file is the short-term product and architecture guide. Update it when priorities shift in a durable way.

## Current Product Focus

Outlet is being built as a client-facing autonomous agency operating system.

The short-term focus is:

1. Make the client portal feel extremely clear and trustworthy for current customers, centered on campaign status, reporting, outcomes, and clean access.
2. Keep the customer-facing web surface focused on `Campaigns`, optional `Events`, `Reports`, and the new optional `Agent` tab, with other workflow embedded inside those areas before earning separate routes.
3. Keep live Meta account linking, campaign creation, and campaign mutation as internal/admin workflows by default rather than general client self-serve surfaces.
4. Make Outlet admin the source of truth for client accounts, enabled apps, branding, memberships, and invites instead of relying on Clerk metadata or slug-only routing assumptions.
5. Keep admin as the broader operating surface for the surviving campaign/report/event backbone plus client/account operations, and collapse standalone non-core web apps when they are no longer justified.
6. Build the event backbone that lets agents react to real system activity.
7. Preserve the shared operating-system backbone so more surfaces can be exposed later without rebuilding the model.

## Current Surface Packaging

Until current customers prove otherwise, treat the product packaging like this:

- Client web:
  - campaigns
  - agent
  - events
  - reports
- Admin web:
  - campaigns
  - reports
  - events
  - client/account operations
  - narrowly justified support surfaces only
- Discord/internal control plane:
  - owner email
  - meetings
  - internal autonomous teams

> Reset note: older bullets below may reference historical CRM, workspace, approvals, assets, or WhatsApp surfaces from before the current reset. Current product truth is the packaging above. Do not treat retired workspace UI or old `/api/workspace/*` endpoints as live product slices unless a new product decision explicitly revives them.

Implications:

- Do not keep broad client navigation just because the backend supports it.
- Client analytics, approvals, conversations, activity, assets, and agent follow-through should usually be embedded inside campaign and event views first, with reports as the one explicit summary surface that stays top-level.
- `Agent` is the approved exception to the older top-level packaging limit: it is allowed because it is a read-only conversational reporting surface over the same campaign and event backbone, not a new client workspace domain.
- Do not expose Meta account connection, campaign creation, or live campaign mutation as default client self-serve flows unless a later product decision explicitly reopens that surface.
- The client account record plus `client_members` is the authority for client portal access. Slug is URL metadata, not the membership source of truth.
- Client onboarding should flow through a DB-backed invite ledger and one canonical landing resolver so invited members land in the correct portal or a real pending state instead of a false "no access" screen.
- CRM is not a current standalone web-product priority during the reset. Preserve client/account/member operations first, and keep any surviving CRM references narrowly historical or admin-maintenance scoped.
- Customer WhatsApp is not a current web-product surface. Do not reintroduce it through CRM or a parallel inbox unless a later product decision explicitly revives a bounded operator surface.

## Near-Term Architecture Focus

- Keep the current customer-facing packaging narrow: client portal top-level navigation should stay focused on campaigns, optional events, reports, and the new optional `Agent` reporting surface rather than broad workspace apps.
- Reports and `Agent` now count as the justified client top-level summary surfaces. Keep both on the same data layer as campaign and event detail instead of creating route-local reporting logic.
- Make client campaign and event pages the primary analytics and collaboration surfaces instead of spreading customer value across many top-level tabs.
- Keep `Agent` read-only and client-safe: it can aggregate campaign and event insights conversationally, but it must not expose internal structure, source systems, or admin-only workflow state.
- Keep client `Agent` on the tool-driven runtime: the model should choose among normalized read-only analytics tools at answer time, default vague business questions to lifetime Meta ads first, and use stored thread context for follow-ups instead of a regex planner deciding the route in advance.
- Make the root landing and `/client` entrypoints resolve from actual Outlet account membership and pending invites before consulting route preferences or old metadata.
- Keep admin client/account hubs as the main web operating surfaces for access, portal packaging, and the surviving campaign/report/event backbone.
- Do not treat CRM, standalone asset/conversation/inbox rebuilds, customer WhatsApp, or the retired workspace shell as near-term web rebuild targets during the current reset.
- When simplifying a shipped surface, remove or redirect the old client routes too. Do not leave broad direct-route access alive behind a simplified sidebar.
- Prefer deleting or hard-gating replaced client surfaces after stabilization instead of carrying dead pages indefinitely.
- Do not expose placeholder, low-confidence, or weakly integrated top-level pages just because the data exists.
- Keep first-class business objects and clear domain modules ahead of generic workspace abstractions or placeholder shells.
- Record meaningful system actions as structured events.
- Use `system_events` as the shared activity backbone instead of creating separate ad hoc logs per feature.
- Harden `system_events` into a replay-safe event envelope before more automation depends on it. That means version, source, occurred-at time, correlation, causation, and idempotency data instead of a summary-only event row.
- Use `approval_requests` for explicit decision flows with audience-aware visibility (`admin`, `client`, `shared`).
- Treat approvals as first-class workflow objects, and keep client approval context embedded inside campaign and event views until a separate surface is clearly justified.
- Keep approval visibility scope-aware for assigned client members, so limited members only see campaign/event-linked approvals that match their allowed scope when context exists.
- Use campaign-native action items for campaign next steps.
- Design agents as bounded workers attached to those events.
- Keep new internal growth and customer-acquisition teams Discord-first too, so content operations, publishing, lead routing, and internal platform execution use the same control-plane and ledger model as email and other bounded operator ledgers instead of fragmenting into ad hoc scripts or premature web apps.
- Build new internal autonomous teams as pods with supervisor, worker, executor, and evaluator roles instead of one undifferentiated swarm, so decision rights and side effects stay controllable as the team grows.
- Reuse the email-agent learning pattern across new pods: durable event/draft/example/correction/outcome/playbook ledgers behind Discord, with markdown memory files only as secondary notes.
- Build new autonomous systems one vertical slice at a time. Once a slice has intake, routing, approvals, execution, and visible outcomes connected, stop adding breadth and switch to stabilization, evals, and operational testing before cloning the pattern to more pods or platforms.
- Push tenant enforcement downward. Route-level auth checks are not enough by themselves for long-term safety; important client boundaries should also be enforced through Clerk-aware or claim-aware database policies where practical.
- Treat `clients`, `client_members`, `client_member_campaigns`, and `client_member_events` as the tenant access backbone. Harden those membership tables before relying on RLS in downstream client-facing tables.
- Move user-facing server reads off `supabaseAdmin` incrementally once the matching RLS exists. Use a Clerk-scoped Supabase client for those reads, and keep service-role access only on admin-global or backend-only paths until equivalent admin-safe policies exist.
- Keep new autonomous workflows in shadow, draft-only, or assisted mode until logs and evals show they are stable enough for live outbound actions.
- Keep admin and client experiences on the same backbone with different permissions and visibility.
- Keep traditional dashboards as first-class surfaces, not as an afterthought layered on top of workflow views.
- Make traditional reporting surfaces pull from the same workflow backbone too, so graphs and summaries stay connected to next steps.
- Keep report pages actionable with shared approvals, open discussion, and agent follow-through, so traditional users can move from charts to execution without leaving the reporting surface.
- Keep event operations visible on summary-first dashboard and report surfaces too, so show-level promotion pressure and open event responses are not buried behind the dedicated events app.
- Keep reports on a shared feature/data layer across admin and client surfaces, so KPI math, trend data, and top-performer logic do not drift into separate route-local implementations.
- Do not keep test-only workflow wrapper loaders or convenience aggregator helpers in `src/features/*` once shipped pages stop calling them. If campaigns, events, dashboards, conversations, or reports can read the surviving shared loaders directly, delete the extra wrapper layer instead of preserving dead indirection.
- Do not rebuild a standalone cross-app work-queue surface by default. Keep routed notifications, assignee state, and next steps embedded inside the surviving dashboard, report, campaign, and event surfaces instead of reviving a separate queue app.
- Keep event detail and other analytics-heavy pages tied to the same workflow/activity backbone, so performance views do not become dead ends.
- Turn admin event surfaces into operating views, not only bulk-edit tables, so ticketing state and promotion workflow live together.
- Treat the event index pages as operating surfaces too, not only pressure summaries and lists, so users can work through event approvals, discussion, and agent follow-through before opening a single show.
- Keep any surviving asset-linked context and follow-through scope-aware for assigned members.
- Do not prioritize a broad standalone asset app during the current reset; embed asset work inside surviving campaign, event, and admin account flows first.
- On client campaign and event detail routes, prove the entity belongs to that client and matches assigned scope before loading detailed data, so a guessed id cannot bypass tenant or scope boundaries.
- Keep client campaign and event comment APIs scope-aware too, so guessed ids inside the same client account cannot reveal or mutate discussions outside the member's assigned campaigns or events.
- Treat event discussions and event follow-up items as first-class workflow objects so ticketing context, promotion questions, and show-level next steps stay attached to the event instead of being lost in generic notes.
- On event pages, combine event-specific agent outcomes with linked campaign agent outcomes so the show-level operating view stays complete instead of forcing users to infer work from campaign pages alone.
- Do not treat `/admin/activity` as a shipped operations center during the current reset. Keep direct admin activity access collapsed to `/admin/dashboard`, and only preserve low-level audit logging backend pieces if they still serve operator support or debugging.
- Treat `/admin/agents` as an operating surface too, not only chat plus raw run history, so runtime health, actionable agent follow-through, and urgent agent runs are visible together in one command center.
- Keep `/admin/agents` triage-first too, so actionable follow-through is grouped by surface and automated run history can be filtered quickly down to failures or in-flight work instead of forcing operators to scan a flat mixed table.
- Keep admin summary surfaces event-aware too, so show-level pressure is visible on dashboards and reports and not only inside the dedicated events app.
- Keep `admin_activity` as a secondary audit trail behind the dashboard and surviving admin operating surfaces instead of letting low-level page-view logs become the main operating surface.
- Keep asset review pressure visible on the regular dashboards too, so summary-first users can spot creative bottlenecks without drilling into deeper admin creative tooling first.
- Derive dashboard workflow summaries from the same campaign-native approvals, action items, comments, and `system_events` backbone instead of introducing separate summary-only state.
- Make dashboard-first users actionable by surfacing pending approvals and unresolved campaign discussion directly on the dashboard.
- Do not give clients a dedicated updates surface yet. Keep approvals, discussion, agent follow-through, and shared activity visible inside campaign and event views until a separate updates center is clearly justified by live customer use.
- Do not prioritize a broad standalone client settings/connect center while the client portal is intentionally narrowed to campaigns and events.
- Keep invite cleanup, member access governance, and connected-account management primarily on admin users, admin settings, and admin client/account hubs.
- If limited client-owner account controls remain exposed, keep them minimal, safety-focused, and consistent with the same invite-governance rules used by admin surfaces.
- Keep Meta connection health primarily visible on admin client/account hubs before exposing it as a broader client-facing management surface.
- Keep Meta connect/disconnect owner-gated on both the client UI and the server routes, so non-owner client members can see connection health without being able to change the client account wiring.
- Keep Meta campaign and creative mutation routes owner-or-admin gated too, so authenticated client members cannot create, edit, pause, or upload creative against a client ad account just by knowing its slug and account id.
- Treat the admin users page as an access-governance surface, not only a roster, so admins can spot pending invites, unassigned client users, and client accounts with weak coverage before access problems grow.
- Keep pending invites actionable on those admin access-governance surfaces, so admins can revoke stale invites directly from the admin users page and admin settings control center instead of detouring into a separate table first.
- Keep invite-state copy accurate on those access-governance surfaces too, so expired invites stay visible and actionable without being mislabeled as generic pending invites.
- Prioritize pending access invites ahead of expired cleanup on those shared lists, so operators see people still waiting to join before stale cleanup work.
- Keep unfinished local-only features out of the shipped TypeScript and Vitest program until they are actually integrated, so local experiments do not break the production verification loop.
- Treat the admin settings page as a platform control center, not only a static config screen, so integration health, pending access pressure, and client setup issues are visible next to onboarding actions.
- Filter shared client activity by assigned campaign/event scope where possible, so limited-scope members get a coherent feed without seeing unrelated workflow context.
- Keep shared activity and notifications entity-aware, so links land on the correct campaign, event, approval, or surviving support surface instead of dead-ending on generic pages.
- On client surfaces, keep notifications client-slug scoped and assignment-scope-aware so limited members only see the work they are actually allowed to view.
- Keep access-management mutations on shared revalidation too, so admin users/settings/client-detail member surfaces stay in sync after invite, membership, or access-role changes.
- Treat `campaign_client_overrides` as part of the real campaign ownership model, not as an admin-only bulk-edit side table, so loaders that group or authorize campaigns use the effective client slug instead of trusting raw `meta_campaigns.client_slug`.
- Keep campaign-aware asset classification on that same effective ownership model, so uploads and folder imports can still match reassigned campaigns instead of falling back to stale raw `meta_campaigns.client_slug` data.
- When a campaign is reassigned, migrate the linked campaign workflow rows with it too, so campaign comments, action items, approvals, notifications, and shared activity do not stay attached to the previous client slug after ownership changes.
- On cross-campaign readers, prefer effective campaign ids over the denormalized `client_slug` on campaign-native rows, so conversations, queues, and workflow summaries stay correct even if older rows were written before ownership was reassigned.
- Treat campaign comments the same way: read and mutate them by `campaign_id` plus effective campaign ownership, not by the stored comment `client_slug`, so older discussion threads remain visible and actionable after reassignment.
- Treat campaign action items the same way: read them by `campaign_id`, and derive notifications, logging, and revalidation from the campaign's effective owner instead of the stored item `client_slug`, so reassigned campaign next steps remain visible and route correctly.
- Treat campaign-linked notifications and approval inbox reads the same way: backfill them from effective campaign ownership instead of only `notifications.client_slug` or `approval_requests.client_slug`, so reassigned campaign work still appears in client/admin inboxes and approval centers.
- Treat dashboard action-center approval queues the same way: filter campaign-linked approvals by effective campaign ownership instead of only `approval_requests.client_slug`, so reassigned campaign approvals remain visible on dashboards, reports, updates, campaigns, and events surfaces.
- Treat client slug mutations the same way: renames and deactivations should update the active `client_slug` references and operate on effectively assigned campaigns, not only the raw `meta_campaigns.client_slug` column.
- Treat shared discussions as incomplete unless they also notify the right audience.
- Keep notifications summary-first, filterable, and route-aware so they read like an operating queue instead of a flat message dump.
- Treat follow-up items like real assignments so campaign, asset, and event assignees get notified consistently.
- Keep shared client approval and discussion broadcasts assignment-scope-aware so limited client members are not even notified about work outside their allowed scope.
- When route handlers create or mutate workflow items or discussion state, revalidate the affected admin/client summary and detail surfaces instead of relying on route-local `revalidatePath` lists.
- Keep unresolved discussion attached to campaign and event context unless a later product decision explicitly revives a broader conversation surface.
- When client members have assigned scope, shared workflow loaders should honor both campaign scope and event scope so dashboards, notifications, and agent follow-through stay complete without leaking unrelated work.
- Treat the admin clients index as an account health surface, not just a billing roster, so operators can see which client accounts need approvals, discussion responses, next steps, or creative review.
- Keep Meta connection risk visible on that admin clients index too, so expiring, stale, or disconnected ad-account links are visible before operators drill into a specific client hub.
- Treat admin client detail pages as account operating hubs too, not only membership/service management, so operators can manage access, portal packaging, activity, agent follow-through, and show-level context from the client record itself.
- Keep Meta connection health visible inside those admin client account hubs too, so operators can catch expiring, stale, or disconnected ad-account links from the client record instead of detouring into global settings.
- Keep pending invites visible and actionable inside that client account hub too, so operators can manage stale access setup from the client record instead of detouring back to the global users/settings surfaces.
- Treat the campaign index pages as operating surfaces too, not only charts and tables, so users can see campaign workflow pressure, approvals, conversation, and agent follow-through before drilling into a single campaign.
- Prefer direct workflow controls on action/follow-up panels so operators can move work between statuses without opening a form for every change.
- Surface agent follow-through inside campaigns and dashboards so users can see what the system asked agents to do and what came back.
- Let useful agent outcomes turn into source-linked campaign action items so recommendations and failures become operational next steps.
- Do not treat CRM contact records, CRM follow-up items, or CRM discussions as current web-product priorities during the reset. Preserve only the client/account/member backbone plus narrow historical maintenance that still protects retained data.

## Immediate Build Bias

When choosing what to build next, bias toward:

- shared visibility
- familiar dashboards and graph-based reporting for traditional users
- campaign-centered collaboration
- approval and activity flows
- campaign-native comments and discussion
- event-driven automation
- first-class business objects over generic page abstractions
- finishing and testing the current slice before adding the next pod or platform
- fully owned, production-ready slices with verification and durable context updates

Bias away from:

- isolated UI polish with no operational payoff
- one-off route logic that duplicates domain behavior
- agent features that are just chat without structured triggers or outcomes
- expanding into new pods, platforms, or channels before the current slice has been proven end to end
- preserving weak architecture just because it already exists
