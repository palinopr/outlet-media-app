# Context Docs

Read these files before making major product or architecture decisions.

- [product-direction.md](./product-direction.md): what Outlet is becoming, who it serves, and what the product is optimizing for
- [engineering-principles.md](./engineering-principles.md): build rules for domain modeling, events, permissions, and app structure
- [agent-patterns.md](./agent-patterns.md): current retirement note for the old agent runtime and what not to rebuild by default
- [current-priorities.md](./current-priorities.md): what matters most right now so work stays aligned
- [codex-workflow.md](./codex-workflow.md): how this repo should be operated inside the Codex app, including threads, branches, review, and default settings
- [meta-ads-playbook.md](./meta-ads-playbook.md): durable rules for Context7-first uncertainty handling, canonical local Meta credential sourcing, and cross-repo ads workflow boundaries
- [google-ads-api.md](./google-ads-api.md): manager-level developer-token setup, OAuth Playground rules, Cloud project/API enablement, and dedicated Google Ads env naming
- [shopify-merch-sync.md](./shopify-merch-sync.md): how to connect an existing Shopify merch store into Outlet's reporting, audience, and ticket-buyer join workflow

These docs are meant to be durable context, not one-off plans.

When a new repeated pattern or architectural lesson becomes durable, update these docs instead of burying it in a single task thread.

When starting a new build thread, default to the web product unless the user explicitly asks for another surface.

Use `docs/plans/` for execution sequencing and milestones.
Use repo-local Codex/operator skills only when the repo actually checks them in.
