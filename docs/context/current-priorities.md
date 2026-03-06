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
- Use campaign-native action items for campaign next steps instead of forcing campaign operations into only the generic workspace task board.
- Design agents as bounded workers attached to those events.
- Keep admin and client experiences on the same backbone with different permissions and visibility.
- Keep traditional dashboards as first-class surfaces, not as an afterthought layered on top of workflow views.
- Derive dashboard workflow summaries from the same campaign-native approvals, action items, comments, and `system_events` backbone instead of introducing separate summary-only state.
- Make dashboard-first users actionable by surfacing pending approvals and unresolved campaign discussion directly on the dashboard.
- Surface agent follow-through inside campaigns and dashboards so users can see what the system asked agents to do and what came back.
- Let useful agent outcomes turn into source-linked campaign action items so recommendations and failures become operational next steps.

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
