# Current Priorities

This file is the short-term product and architecture guide. Update it when priorities shift in a durable way.

## Current Product Focus

Outlet is being built as a client-facing autonomous agency operating system.

The short-term focus is:

1. Make the client portal feel extremely clear and trustworthy for current customers, centered on Meta ads reporting, campaign status, and outcomes.
2. Keep the customer-facing web surface focused on campaigns first, with events present only when they materially improve client understanding.
3. Keep live Meta account linking, campaign creation, and campaign mutation as internal/admin workflows by default rather than general client self-serve surfaces.
4. Keep admin as the broader operating surface for CRM, approvals, assets, account management, and internal workflow.
5. Build the event backbone that lets agents react to real system activity.
6. Preserve the shared operating-system backbone so more surfaces can be exposed later without rebuilding the model.

## Current Surface Packaging

Until current customers prove otherwise, treat the product packaging like this:

- Client web:
  - campaigns
  - events
- Admin web:
  - campaigns
  - events
  - CRM
  - approvals
  - assets
  - client/account operations
- Discord/internal control plane:
  - owner email
  - meetings
  - customer WhatsApp operations
  - internal autonomous teams

Implications:

- Do not keep broad client navigation just because the backend supports it.
- Client analytics, approvals, conversations, activity, assets, and agent follow-through should usually be embedded inside campaign and event views first.
- Do not expose Meta account connection, campaign creation, or live campaign mutation as default client self-serve flows unless a later product decision explicitly reopens that surface.
- CRM is admin-first right now.
- Evolution/WhatsApp should enrich CRM and client/account context through durable records, routing, and summaries, but should not become a separate public client inbox.
- If admin needs WhatsApp visibility in the web app, prefer CRM-linked conversation context and account health views over a second standalone chat surface that duplicates Discord operations.

## Near-Term Architecture Focus

- Keep the current customer-facing packaging narrow: client portal top-level navigation should stay focused on campaigns and events until another surface is clearly justified by live customer use.
- Make client campaign and event pages the primary analytics and collaboration surfaces instead of spreading customer value across many top-level tabs.
- Keep admin CRM and client/account hubs as the main web operating surfaces for relationship management, including CRM state that may be informed by WhatsApp/Evolution communication history.
- Keep customer WhatsApp transport and operator handling Discord-first even if the admin web later shows CRM-linked WhatsApp summaries, statuses, or recent-message context. The current default transport is Evolution on a phone-linked WhatsApp account, not Twilio.
- When simplifying a shipped surface, remove or redirect the old client routes too. Do not leave broad direct-route access alive behind a simplified sidebar.
- Prefer deleting or hard-gating replaced client surfaces after stabilization instead of carrying dead pages indefinitely.
- Do not expose placeholder, low-confidence, or weakly integrated top-level pages just because the data exists.
- Keep the Notion-like workspace shell, but do not let generic documents become the only product model.
- Treat the workspace home as an operating shell, not only a page list, so queue pressure, approvals, activity, and agent follow-through stay visible next to the docs layer.
- Prefer feature modules around domain areas such as `campaigns`, `assets`, `crm`, `workspace`, and `agents`.
- Record meaningful system actions as structured events.
- Use `system_events` as the shared activity backbone instead of creating separate ad hoc logs per feature.
- Harden `system_events` into a replay-safe event envelope before more automation depends on it. That means version, source, occurred-at time, correlation, causation, and idempotency data instead of a summary-only event row.
- Use `approval_requests` for explicit decision flows with audience-aware visibility (`admin`, `client`, `shared`).
- Treat approvals as a first-class app surface for admin, and keep client approval context embedded inside campaign and event views until a dedicated client approval center is clearly justified.
- Keep approval visibility scope-aware for assigned client members, so limited members only see campaign/event-linked approvals that match their allowed scope when context exists.
- Use campaign-native action items for campaign next steps instead of forcing campaign operations into only the generic workspace task board.
- Design agents as bounded workers attached to those events.
- Keep new internal growth and customer-acquisition teams Discord-first too, so content operations, publishing, lead routing, and internal platform execution use the same control-plane and ledger model as email and WhatsApp instead of fragmenting into ad hoc scripts or premature web apps.
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
- Treat the workspace tasks pages as the operating queue entry point, not only the generic board, so cross-app next steps from campaigns, CRM, events, and assets stay visible in one place.
- Keep a dedicated "assigned to you" queue on the main admin/client operating surfaces, so routed notifications and assignee fields turn into a clear personal workload view instead of only a generic shared queue.
- Keep event detail and other analytics-heavy pages tied to the same workflow/activity backbone, so performance views do not become dead ends.
- Turn admin event surfaces into operating views, not only bulk-edit tables, so ticketing state and promotion workflow live together.
- Treat the event index pages as operating surfaces too, not only pressure summaries and lists, so users can work through event approvals, discussion, and agent follow-through before opening a single show.
- Treat assets as a first-class admin app surface with index/detail operating views, instead of hiding creative review inside client detail widgets or raw APIs.
- Treat asset discussion as a first-class collaboration surface so creative feedback, internal review, and client-visible context stay attached to the asset itself.
- Treat asset follow-up items as first-class workflow objects so creative review notes, agent outcomes, and production next steps become visible work instead of passive comments.
- Treat the assets index pages as operating surfaces too, not only file libraries, so creative discussions, follow-up work, and agent recommendations stay visible before users drill into a single asset.
- Reuse the shared conversations, work queue, and agent follow-through modules on asset surfaces instead of creating asset-only summary logic that drifts from campaigns, CRM, and events.
- Keep any client-facing asset context scope-aware for assigned members, so embedded asset panels, linked asset detail routes, summaries, and asset discussion APIs only expose creative tied to the campaigns or events that member is actually allowed to see.
- Keep shared client loaders asset-scope-aware too, so conversations, work queues, approvals, and activity feeds do not leak asset-linked work outside the member's allowed campaign or event context.
- Keep shared client agent follow-through asset-scope-aware too, so dashboard and updates surfaces do not leak asset-only agent work outside the member's allowed campaign or event context.
- On client campaign and event detail routes, prove the entity belongs to that client and matches assigned scope before loading detailed data, so a guessed id cannot bypass tenant or scope boundaries.
- Keep client campaign and event comment APIs scope-aware too, so guessed ids inside the same client account cannot reveal or mutate discussions outside the member's assigned campaigns or events.
- Treat event discussions and event follow-up items as first-class workflow objects so ticketing context, promotion questions, and show-level next steps stay attached to the event instead of being lost in generic notes.
- On event pages, combine event-specific agent outcomes with linked campaign agent outcomes so the show-level operating view stays complete instead of forcing users to infer work from campaign pages alone.
- Treat `/admin/activity` as the shared operations center, not only a legacy audit table, so admins can manage approvals, discussions, agent follow-through, and cross-app activity from one place.
- Treat `/admin/agents` as an operating surface too, not only chat plus raw run history, so runtime health, actionable agent follow-through, and urgent agent runs are visible together in one command center.
- Keep `/admin/agents` triage-first too, so actionable follow-through is grouped by surface and automated run history can be filtered quickly down to failures or in-flight work instead of forcing operators to scan a flat mixed table.
- Keep the admin operations center event-aware too, so show-level pressure is visible on queue-first admin surfaces and not only inside the dedicated events app.
- Keep the admin operations center queue-first too, so operators can move from visibility into the actual cross-app next steps without leaving that surface.
- Keep `admin_activity` as a secondary audit trail behind the operations center instead of letting low-level page-view logs become the main operating surface.
- Keep asset review pressure visible on the regular dashboards too, so summary-first users can spot creative bottlenecks without opening the full asset app first.
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
- Keep cross-app activity links entity-aware, so shared activity opens the correct campaign, asset, CRM contact, or event detail page instead of dropping users into the wrong surface.
- Keep notifications entity-aware and route-aware too, so admin and client users land on the correct campaign, asset, approval, CRM, event, or workspace surface instead of dead-ending in a generic inbox.
- Treat notifications as first-class inbox surfaces on both admin and client, not only a bell popover, so users can work through routed updates in a full-screen flow.
- Keep the dedicated inbox pages connected to approvals and assigned work too, so notifications remain an execution surface instead of a dead-end message list.
- On client surfaces, load notifications with client-slug scoping so client users and admin previews never pull unrelated admin notifications into the client portal.
- Keep any client notification reads assignment-scope-aware, whether they appear in embedded campaign/event context or a future dedicated inbox, so limited client members only see campaign, event, asset, and approval updates tied to the work they are actually allowed to see.
- Keep client-side people search and mention autocomplete client-slug scoped too, so workspace collaboration surfaces never fall back to global user lookup for non-admin users.
- Keep workspace page, comment, and task APIs client-scoped too, and treat the admin workspace as its own internal `admin` tenant instead of defaulting those routes to all signed-in users or all workspace pages.
- Keep the live workspace page/comment APIs on the same notification and revalidation path as the older workspace server actions, so the real editor flows refresh workspace shells and inboxes instead of drifting out of parity.
- Keep access-management mutations on shared revalidation too, so admin users/settings/client-detail member surfaces stay in sync after invite, membership, or access-role changes, and any future client-owner controls inherit the same behavior.
- Treat `campaign_client_overrides` as part of the real campaign ownership model, not as an admin-only bulk-edit side table, so loaders that group or authorize campaigns use the effective client slug instead of trusting raw `meta_campaigns.client_slug`.
- Keep campaign-aware asset classification on that same effective ownership model, so uploads and folder imports can still match reassigned campaigns instead of falling back to stale raw `meta_campaigns.client_slug` data.
- When a campaign is reassigned, migrate the linked campaign workflow rows with it too, so campaign comments, action items, approvals, notifications, and shared activity do not stay attached to the previous client slug after ownership changes.
- On cross-campaign readers, prefer effective campaign ids over the denormalized `client_slug` on campaign-native rows, so conversations, queues, and workflow summaries stay correct even if older rows were written before ownership was reassigned.
- Treat campaign comments the same way: read and mutate them by `campaign_id` plus effective campaign ownership, not by the stored comment `client_slug`, so older discussion threads remain visible and actionable after reassignment.
- Treat campaign action items the same way: read them by `campaign_id`, and derive notifications, logging, and revalidation from the campaign's effective owner instead of the stored item `client_slug`, so reassigned campaign next steps remain visible and route correctly.
- Treat campaign-linked notifications and approval inbox reads the same way: backfill them from effective campaign ownership instead of only `notifications.client_slug` or `approval_requests.client_slug`, so reassigned campaign work still appears in client/admin inboxes and approval centers.
- Treat dashboard action-center approval queues the same way: filter campaign-linked approvals by effective campaign ownership instead of only `approval_requests.client_slug`, so reassigned campaign approvals remain visible on dashboards, reports, updates, campaigns, and events surfaces.
- Treat client slug mutations the same way: renames and deactivations should update the active `client_slug` references and operate on effectively assigned campaigns, not only the raw `meta_campaigns.client_slug` column.
- Treat shared discussions as incomplete unless they also notify the right inbox audience, so campaign, asset, event, and CRM collaboration cannot get lost between the thread view and the routed inbox.
- Keep notifications summary-first and filterable, so the inbox reads like an operating queue instead of a flat message dump.
- Treat non-workspace follow-up items like real assignments too, so campaign, CRM, asset, and event assignees get notified the same way workspace-task assignees do.
- Keep shared client approval and discussion broadcasts assignment-scope-aware too, so limited client members are not even notified about campaigns, events, or assets outside their allowed scope.
- Keep notification deep links app-aware for discussion and follow-up entity types too, so routed updates land in conversations, campaigns, CRM, assets, or events instead of dead-ending in generic pages.
- Prefer enriching notifications with route context at read time when the raw notification points at a comment, follow-up item, or approval id, so inbox navigation lands on the exact campaign, asset, event, CRM, or workspace surface without changing every notification writer first.
- When route handlers create or mutate cross-app workflow items or discussion state, revalidate the affected admin/client operating surfaces too, so the next visit to dashboards, detail pages, queues, updates pages, and conversations reflects the new work immediately.
- Keep approval creation and resolution on that same shared revalidation path too, so direct approval actions and system-created approvals from uploads refresh approvals centers, inboxes, dashboards, reports, workspace shells, and linked entity views without relying on individual callers.
- Prefer the shared workflow revalidation helpers over handwritten `revalidatePath` lists in admin mutations, so conversations, notifications, updates, and workspace surfaces do not drift out of sync as more product areas are added.
- Use layout-aware workspace revalidation for page, comment, and task mutations too, so admin/client workspace sidebars, page detail views, task boards, inboxes, and activity surfaces stay coherent after workspace changes.
- Treat conversations as a first-class admin app surface. On client, keep unresolved discussion attached to campaign and event context until a standalone cross-context conversation surface is clearly justified.
- Keep admin conversations actionable too, so operators can create linked action or follow-up items directly from open campaign, CRM, asset, and event threads without detouring into each detail page first.
- Reuse the shared conversations feature module anywhere open discussion is summarized, instead of re-querying each comment table per route and letting discussion logic drift.
- When client members have assigned scope, shared workflow loaders should honor both campaign scope and event scope so dashboards, conversations, notifications, and agent follow-through stay complete without leaking unrelated work.
- Treat the admin clients index as an account health surface, not just a billing roster, so operators can see which client accounts need approvals, discussion responses, next steps, or creative review.
- Keep Meta connection risk visible on that admin clients index too, so expiring, stale, or disconnected ad-account links are visible before operators drill into a specific client hub.
- Treat admin client detail pages as account operating hubs too, not only membership/assets/service management, so operators can manage workflow pressure, CRM relationship work, activity, agent follow-through, and show-level context from the client record itself.
- Keep Meta connection health visible inside those admin client account hubs too, so operators can catch expiring, stale, or disconnected ad-account links from the client record instead of detouring into global settings.
- Keep pending invites visible and actionable inside that client account hub too, so operators can manage stale access setup from the client record instead of detouring back to the global users/settings surfaces.
- Treat the campaign index pages as operating surfaces too, not only charts and tables, so users can see campaign workflow pressure, approvals, conversation, and agent follow-through before drilling into a single campaign.
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
- finishing and testing the current slice before adding the next pod or platform
- fully owned, production-ready slices with verification and durable context updates

Bias away from:

- isolated UI polish with no operational payoff
- one-off route logic that duplicates domain behavior
- agent features that are just chat without structured triggers or outcomes
- expanding into new pods, platforms, or channels before the current slice has been proven end to end
- preserving weak architecture just because it already exists
