# Feature Modules Bootstrap

Canonical engineering and product rules live in [`../../wiki/Home.md`](../../wiki/Home.md), especially [`../../wiki/Engineering-Principles.md`](../../wiki/Engineering-Principles.md).

Local feature rules:

- `src/features/**` is the primary home for app business logic.
- Prefer feature-owned server modules, mutations, access rules, and view models.
- Keep one shared backbone for admin and client surfaces instead of splitting business behavior by route tree.
- When a feature pattern becomes durable, update the relevant wiki page instead of creating another docs source.
