# Salvage Map

Date: 2026-04-02
Status: Active reset decision document

## Active product core

The active product is:

- **Campaigns**
- **Reports**
- **Events**

Everything else should be justified as support infrastructure or removed from the active product surface.

Retired workspace UI and old `/api/workspace/*` shell endpoints should stay deleted unless a later product decision explicitly revives a bounded workspace surface. When a retired surface is preserved only as a compatibility redirect, keep that route shell minimal: redirect page files only, with no extra layouts or route-local scaffolding.

## Decision labels

- **Keep** — stays as active infrastructure or active product
- **Rebuild** — belongs in the product, but should be reshaped around the current core
- **Archive** — keep as history/reference only
- **Delete** — remove from active repo/app paths

## Root and repo areas

| Area | Decision | Notes |
|---|---|---|
| `src/` | Keep / Rebuild | Active web app, but should be narrowed around Campaigns, Reports, Events |
| `agent/` | Keep (defer reshape) | Do not lead the reset with agent cleanup; only trim blockers/dead references |
| `docs/context/` | Keep | Durable product and architecture guidance |
| `docs/references/` | Keep | Small durable reference materials only |
| `docs/screenshots/` | Archive | Historical/support visuals, not active architecture |
| `docs/plans/` | Archive | Historical planning reference, not current truth |
| `docs/superpowers/` | Archive | Process/history docs, not product architecture |
| `archive/` | Archive | Historical materials kept out of the active repo surface |
| `config/` | Delete if empty | Do not keep an empty root config bucket; only recreate it if real shared repo/runtime config returns |
| `public/` | Keep | Static assets for active app |
| `supabase/` | Keep | Database migrations/history and Supabase assets |
| `__tests__/` | Keep / Rebuild | Keep tests that support the surviving product; remove dead-system tests |
| `__mocks__/` | Keep | Minimal Vitest stubs that still support surviving tests |
| `output/` | Delete from active repo surface | Local/generated output only |
| `session/` | Delete from active repo surface | Local scratch only |
| `tmp/` | Delete from active repo surface | Local scratch only |
| `.playwright-mcp/` | Delete from active repo surface | Local-only output |
| `.superpowers/` | Delete from active repo surface | Local-only workflow output |
| `.next/` | Delete from active repo surface | Generated build output |
| `node_modules/` | Delete from active repo surface | Generated dependency output |
| `root-next-artifact-*` | Delete from active repo surface | Local/generated artifact directories |

## Admin app surfaces

### Active core surfaces

| Route tree | Decision | Notes |
|---|---|---|
| `src/app/admin/campaigns` | Keep / Rebuild | First-class active product surface |
| `src/app/admin/reports` | Keep / Rebuild | First-class active product surface |
| `src/app/admin/events` | Keep / Rebuild | First-class active product surface |

### Required support/infrastructure surfaces

| Route tree | Decision | Notes |
|---|---|---|
| `src/app/admin/clients` | Keep | Required account/client management backbone |
| `src/app/admin/users` | Keep | Required access/user governance |
| `src/app/admin/settings` | Rebuild-minimal | Keep only if needed for platform/account configuration, not broad product breadth |
| `src/app/admin/actions` | Rebuild-minimal | Keep only if still required as infrastructure around the surviving core |
| `src/app/admin/dashboard` | Rebuild | Should summarize the surviving core, not every historical system |

### Non-core active product surfaces

| Route tree | Decision | Notes |
|---|---|---|
| `src/app/admin/crm` | Delete as active surface | Preserve account/member backbone, not CRM as a product app |
| `src/app/admin/assets` | Delete or Archive | Not part of the surviving top-level product core |
| `src/app/admin/approvals` | Delete or fold into core surfaces | Approval context should not stay as a broad separate app by default |
| `src/app/admin/agents` | Delete or Archive as active surface | Not part of the surviving core product |
| `src/app/admin/conversations` | Delete or Archive | Not part of the surviving core product |
| `src/app/admin/workspace` | Delete or Archive | Workspace shell is not the active product core; keep only an explicit redirect shell, not route-local editor/task code |
| `src/app/admin/notifications` | Rebuild-minimal or Archive | Keep only if truly needed as support, not as broad surface |
| `src/app/admin/activity` | Archive as shipped surface | Collapse direct web access to `/admin/dashboard`; keep audit logging backend only if still useful operationally |

## Feature modules

### Core product/support modules to keep

| Module | Decision | Notes |
|---|---|---|
| `src/features/campaigns` | Keep / Rebuild | Core domain |
| `src/features/reports` | Keep / Rebuild | Core domain |
| `src/features/events` | Keep / Rebuild | Core domain |
| `src/features/clients` | Keep | Required account/client backbone |
| `src/features/access` | Keep | Required permissions/auth support |
| `src/features/users` | Keep | Required user/access support |
| `src/features/invitations` | Keep | Required onboarding/access support |
| `src/features/shared` | Keep / Rebuild | Shared primitives only; avoid turning into junk drawer |
| `src/features/client-portal` | Rebuild | Should narrow around Campaigns/Reports/Events |

### Support modules to minimize carefully

| Module | Decision | Notes |
|---|---|---|
| `src/features/settings` | Rebuild-minimal | Keep only platform/account support |
| `src/features/system-events` | Rebuild-minimal | Keep only if it clearly supports the surviving core and stays bounded |
| `src/features/dashboard` | Rebuild | Should summarize Campaigns/Reports/Events only |

### Non-core modules to remove or archive

| Module | Decision | Notes |
|---|---|---|
| `src/features/crm` | Delete as active product module | Preserve account/client backbone separately |
| `src/features/crm-comments` | Delete or Archive | CRM-specific product breadth |
| `src/features/crm-follow-up-items` | Delete or Archive | CRM-specific product breadth |
| `src/features/assets` | Delete or Archive | Not in current product core; keep only the asset support primitives still reused by surviving campaign/event/admin flows |
| `src/features/asset-comments` | Delete or Archive | Asset-specific breadth |
| `src/features/asset-follow-up-items` | Delete or Archive | Asset-specific breadth |
| `src/features/approvals` | Delete or fold into core domains | Avoid broad standalone approval app/module |
| `src/features/conversations` | Delete or Archive | Not part of the active core |
| `src/features/workspace` | Delete or Archive | Workspace shell is not the active product; do not restore page/task/comment product flows by default |
| `src/features/workflow` | Delete or Archive | Too generic for current narrowed product |
| `src/features/work-queue` | Deleted | Retired cross-app queue layer; do not restore a standalone work-queue surface by default |
| `src/features/agents` | Delete or Archive as active web product | Not part of the surviving core |
| `src/features/agent-outcomes` | Delete or Archive | Depends on agent surface/product breadth |
| `src/features/client-updates` | Delete or Archive | Not part of the narrowed product |
| `src/features/notifications` | Rebuild-minimal or Archive | Keep only the embedded/support notification primitives that still serve shipped surfaces; do not rebuild a standalone notification-center layer by default |
| `src/features/operations-center` | Delete or Archive | Too broad for the current core |
| `src/features/client-agent` | Delete or Archive | Not part of Campaigns/Reports/Events core |

## Infrastructure rules to preserve

Do **not** delete:

- Clerk auth
- user records and user governance
- client accounts
- memberships/access control
- invitation/access backbone
- database migration history

## Immediate dead systems to remove

These should not continue shaping the repo:

- WhatsApp
- WhatsApp concierge
- dead messaging routes/config/tests/docs

## Visible product target after first reset pass

The app should clearly read as:

- Campaigns
- Reports
- Events

with support/admin infrastructure only where required for:
- auth
- client/account management
- user access
- configuration needed by the core

Shared cross-app aggregators should follow that same rule. Dashboard summaries, action centers, conversations centers, and notifications should not reintroduce CRM as an active domain once the CRM product surface is removed. Do not regrow a standalone cross-app work-queue layer by default. Also do not keep extra feature-level workflow wrapper loaders once the shipped pages no longer call them; delete dead indirection instead of preserving test-only campaign/event/conversation/report wrappers. Agent outcome follow-through should also stay bounded to the surviving core domains instead of recreating CRM follow-up work through side paths.

Historical CRM table references may remain in low-level maintenance paths such as client-slug rename support when they are only preserving legacy row integrity. Treat those as data-maintenance exceptions, not proof that CRM is still an active product surface.

## Next implementation bias

1. Keep dead systems such as WhatsApp retired; do not let them re-enter active docs, routes, or runtime paths
2. Remove CRM as an active surface while preserving account backbone
3. Remove or archive other non-core top-level surfaces
4. Re-center navigation and docs around Campaigns, Reports, and Events
5. Only then start splitting/refactoring large surviving files
