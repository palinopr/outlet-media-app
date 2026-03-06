# Current Priorities

This file is the short-term product and architecture guide. Update it when priorities shift in a durable way.

## Current Product Focus

Outlet is being built as a client-facing autonomous agency operating system.

The short-term focus is:

1. Make the workspace feel coherent across admin and client views.
2. Turn campaigns, assets, approvals, reports, CRM, and activity into first-class product areas.
3. Build the event backbone that lets agents react to real system activity.
4. Improve customer visibility so clients can follow work, comment, approve, and understand progress.
5. Keep adding apps that fit the same shared operating environment instead of building isolated tools.

## Near-Term Architecture Focus

- Keep the Notion-like workspace shell, but do not let generic documents become the only product model.
- Prefer feature modules around domain areas such as `campaigns`, `assets`, `crm`, `workspace`, and `agents`.
- Record meaningful system actions as structured events.
- Use `system_events` as the shared activity backbone instead of creating separate ad hoc logs per feature.
- Use `approval_requests` for explicit decision flows with audience-aware visibility (`admin`, `client`, `shared`).
- Design agents as bounded workers attached to those events.
- Keep admin and client experiences on the same backbone with different permissions and visibility.

## Immediate Build Bias

When choosing what to build next, bias toward:

- shared visibility
- campaign-centered collaboration
- approval and activity flows
- event-driven automation
- first-class business objects over generic page abstractions
- fully owned, production-ready slices with verification and durable context updates

Bias away from:

- isolated UI polish with no operational payoff
- one-off route logic that duplicates domain behavior
- agent features that are just chat without structured triggers or outcomes
- preserving weak architecture just because it already exists
