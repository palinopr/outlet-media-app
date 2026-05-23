# Feature Modules Bootstrap

Canonical engineering and product rules live in Obsidian v2:

```text
/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2
```

Start with `AGENTS.md`, `10 Doctrine/Agent Memory Protocol.md`, and `90 System/Outlet App Wiki Pointer.md`, then verify current feature behavior in this repo.

Local feature rules:

- `src/features/**` is the primary home for app business logic.
- Prefer feature-owned server modules, mutations, access rules, and view models.
- Keep one shared backbone for admin and client surfaces instead of splitting business behavior by route tree.
- When a feature pattern becomes durable, update Obsidian v2 instead of creating another docs source in this repo.
