# App Routes Bootstrap

Canonical engineering and product rules live in Obsidian v2:

```text
/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2
```

Start with `AGENTS.md`, `10 Doctrine/Agent Memory Protocol.md`, and `90 System/Outlet App Wiki Pointer.md`, then verify current route behavior in this repo.

Local route rules:

- Keep `src/app/**` thin.
- Pages, layouts, route handlers, and server actions should compose feature modules instead of owning business rules directly.
- Do not duplicate campaign or account/access logic in route-local code.
- Meaningful mutations should write the right durable state, usually through shared feature logic and `system_events` or `admin_activity`.
