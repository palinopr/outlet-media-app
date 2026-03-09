# Context Docs

Read these files before making major product, architecture, or agent decisions.

- [product-direction.md](./product-direction.md): what Outlet is becoming, who it serves, and what the product is optimizing for
- [engineering-principles.md](./engineering-principles.md): build rules for domain modeling, events, permissions, and app structure
- [agent-patterns.md](./agent-patterns.md): how agents should be triggered, bounded, approved, and logged
- [current-priorities.md](./current-priorities.md): what matters most right now so work stays aligned
- [codex-workflow.md](./codex-workflow.md): how this repo should be operated inside the Codex app, including threads, branches, review, and default settings

These docs are meant to be durable context, not one-off plans.

When a new repeated pattern or architectural lesson becomes durable, update these docs instead of burying it in a single task thread.

When starting a new build thread, decide the surface explicitly:
- `web`
- `Discord`
- `both`

Use `docs/plans/` for execution sequencing and milestones.
Use `.codex/skills/` for Codex/operator skills and `agent/skills/` for runtime agent skills.
