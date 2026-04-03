# Outlet Web Reset Implementation Plan

> **Historical note (2026-04-02):** This plan predates the later cleanup passes. Current shipped client packaging is Campaigns + Reports + optional Events + optional Agent, and several retired CRM/workspace shells referenced in older reset work have since been collapsed or deleted.

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reset the web product around one Outlet-owned client account model, fix invite/signup/landing/access, remove dead surfaces, and ship a clean client package of Home, Campaigns, optional Events, and Reports.

**Architecture:** Preserve the existing `clients`, `client_members`, `system_events`, and reporting foundations, but stop using Clerk `publicMetadata.client_slug` as business truth. Introduce a DB-backed invite ledger plus a canonical portal-entry resolver, extend the client account model with explicit packaging/branding fields, and make both admin and client routes consume that shared model. Delete or quarantine dead CRM/workspace-style surfaces instead of carrying them forward.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, Clerk, Supabase, Tailwind, Vitest

---

## Scope Guard

- Do **not** attempt a full `client_slug` eradication across every historical table in Phase 1.
- Do stop using slug or Clerk metadata as the **authority** for invites, memberships, and landing logic.
- Keep Discord/agent runtime code out of scope except where web routes currently read shared ledgers.
- Preserve data; delete wrong surfaces.

## File Structure Map

### Database / types

- Create: `supabase/migrations/20260322100000_client_portal_reset.sql`
- Modify: `src/lib/database.types.ts`

### Shared account / access backbone

- Create: `src/features/client-portal/entry.ts`
- Create: `src/features/client-portal/entry.test.ts`
- Create: `src/features/client-portal/config.test.ts`
- Modify: `src/features/client-portal/config.ts`
- Modify: `src/features/client-portal/theme.ts`
- Modify: `src/lib/member-access.ts`
- Modify: `src/features/client-portal/access.ts`
- Modify: `src/features/client-portal/access.test.ts`

### Invite / onboarding flow

- Create: `src/app/api/admin/invite/route.test.ts`
- Create: `src/app/sign-up/invite-flow.test.tsx`
- Modify: `src/app/api/admin/invite/route.ts`
- Modify: `src/features/invitations/server.ts`
- Modify: `src/features/invitations/server.test.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/client/page.tsx`
- Modify: `src/app/client/pending/page.tsx`
- Modify: `src/app/client/[slug]/layout.tsx`
- Modify: `src/app/client/[slug]/layout.test.tsx`
- Modify: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Modify: `src/app/sign-up/[[...sign-up]]/page.tsx`

### Admin account settings / membership UX

- Modify: `src/lib/api-schemas.ts`
- Modify: `src/app/admin/actions/clients.ts`
- Modify: `src/app/admin/clients/data.ts`
- Modify: `src/app/admin/clients/types.ts`
- Modify: `src/components/admin/client-onboard-form.tsx`
- Modify: `src/components/admin/clients/client-table.tsx`
- Modify: `src/components/admin/clients/client-detail.tsx`
- Modify: `src/components/admin/clients/client-overview-tab.tsx`
- Modify: `src/components/admin/clients/invite-member-form.tsx`
- Modify: `src/components/admin/clients/members-section.tsx`
- Modify: `src/components/admin/clients/client-detail.test.tsx`
- Modify: `src/app/admin/users/data.ts`
- Modify: `src/app/admin/users/page.tsx`
- Modify: `src/components/admin/users/user-table.tsx`

### Client package / reports

- Create: `src/app/admin/reports/page.test.tsx`
- Create: `src/app/client/[slug]/reports/page.tsx`
- Create: `src/app/client/[slug]/reports/page.test.tsx`
- Create: `src/app/client/[slug]/reports/loading.tsx`
- Create: `src/app/client/[slug]/reports/error.tsx`
- Create: `src/features/reports/components/reports-surface.tsx`
- Modify: `src/app/client/[slug]/components/nav-config.ts`
- Modify: `src/app/client/[slug]/components/client-nav.tsx`
- Modify: `src/app/client/[slug]/components/mobile-nav.tsx`
- Modify: `src/app/client/[slug]/page.tsx`
- Modify: `src/app/admin/reports/page.tsx`
- Modify: `src/features/reports/server.ts`
- Modify: `src/features/reports/summary.ts`

### Dead surface cleanup / revalidation

- Delete: `src/app/admin/approvals/page.tsx`
- Delete: `src/app/admin/conversations/page.tsx`
- Delete: `src/app/admin/crm/page.tsx`
- Delete: `src/app/admin/crm/[contactId]/page.tsx`
- Delete: `src/app/admin/notifications/page.tsx`
- Delete: `src/app/admin/workspace/layout.tsx`
- Delete: `src/app/admin/workspace/page.tsx`
- Delete: `src/app/admin/workspace/[pageId]/page.tsx`
- Delete: `src/app/admin/workspace/tasks/page.tsx`
- Modify: `src/features/access/revalidation.ts`
- Modify: `src/features/workflow/revalidation.ts`

### Durable docs

- Modify: `AGENTS.md`
- Modify: `docs/context/current-priorities.md`

---

## Chunk 1: Account Backbone

### Task 1: Add canonical portal config fields and a DB-backed invite ledger

**Files:**
- Create: `supabase/migrations/20260322100000_client_portal_reset.sql`
- Create: `src/features/client-portal/config.test.ts`
- Modify: `src/features/client-portal/config.ts`
- Modify: `src/features/client-portal/theme.ts`
- Modify: `src/lib/database.types.ts`

- [ ] **Step 1: Write the failing portal config test**

Create `src/features/client-portal/config.test.ts` covering the target config shape:

```ts
expect(config).toEqual({
  clientId: "client_1",
  slug: "acme",
  eventsEnabled: true,
  reportsEnabled: true,
  brandName: "Acme Live",
  logoUrl: "https://cdn.example.com/acme.png",
  logoAlt: "Acme Live",
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/features/client-portal/config.test.ts`

Expected: FAIL because `getClientPortalConfig()` only returns `clientId` and `eventsEnabled`.

- [ ] **Step 3: Add the migration and update the config loader**

In `supabase/migrations/20260322100000_client_portal_reset.sql`:

- add `reports_enabled boolean not null default true` to `clients`
- add `portal_brand_name text null` to `clients`
- add `portal_logo_url text null` to `clients`
- add `portal_logo_alt text null` to `clients`
- create `client_access_invites` with these minimum columns:

```sql
id uuid primary key default gen_random_uuid(),
client_id uuid not null references clients(id) on delete cascade,
email text not null,
client_role text not null default 'member',
status text not null default 'pending',
clerk_invitation_id text null,
accepted_by_clerk_user_id text null,
accepted_at timestamptz null,
revoked_at timestamptz null,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

- add a unique index on active invite intent such as `(client_id, lower(email), status)` scoped to pending rows
- keep `slug` on `clients`; do not redesign routes in SQL

Then:

- update `src/features/client-portal/config.ts` to read the new config fields
- update `src/features/client-portal/theme.ts` so hardcoded defaults remain the fallback, but DB branding overrides the label/logo when present
- regenerate `src/lib/database.types.ts` using the repo’s usual Supabase types flow or the configured Supabase MCP

- [ ] **Step 4: Run the targeted tests again**

Run: `npx vitest run src/features/client-portal/config.test.ts src/features/client-portal/theme.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260322100000_client_portal_reset.sql src/features/client-portal/config.ts src/features/client-portal/config.test.ts src/features/client-portal/theme.ts src/lib/database.types.ts
git commit -m "feat: add client portal reset account schema"
```

### Task 2: Replace Clerk metadata as invite truth with `client_access_invites`

**Files:**
- Create: `src/app/api/admin/invite/route.test.ts`
- Modify: `src/app/api/admin/invite/route.ts`
- Modify: `src/features/invitations/server.ts`
- Modify: `src/features/invitations/server.test.ts`

- [ ] **Step 1: Write failing tests for the new invite contract**

Add route tests that assert:

- the API accepts `clientId`, not only `client_slug`
- the handler inserts a `client_access_invites` row before/with Clerk invitation creation
- the Clerk invitation receives `redirectUrl`
- the Clerk invitation metadata contains only transition fields the app needs (`client_id`, `client_role`, `invite_id`), not the full source of truth

Example expectation:

```ts
expect(mockCreateInvitation).toHaveBeenCalledWith(
  expect.objectContaining({
    emailAddress: "member@example.com",
    redirectUrl: expect.stringContaining("/sign-up"),
    publicMetadata: expect.objectContaining({
      client_id: "client_1",
      client_role: "member",
      invite_id: expect.any(String),
    }),
  }),
);
```

- [ ] **Step 2: Run the invite tests to verify they fail**

Run: `npx vitest run src/app/api/admin/invite/route.test.ts src/features/invitations/server.test.ts`

Expected: FAIL because the current route only validates by slug and stores no DB invite row.

- [ ] **Step 3: Implement the DB-backed invite ledger**

In `src/app/api/admin/invite/route.ts`:

- resolve the client by `clientId`
- create a pending `client_access_invites` row
- call `clerkClient.invitations.createInvitation()` with:
  - `redirectUrl` to the custom sign-up flow
  - `publicMetadata` containing `client_id`, `client_role`, and the DB invite id
- store the returned Clerk invitation id back on `client_access_invites`

In `src/features/invitations/server.ts`:

- list invites from `client_access_invites` first
- enrich status from Clerk when a `clerk_invitation_id` exists
- stop treating Clerk invitation metadata as the only invite record

Keep the data model simple:

```ts
type ClientAccessInvite = {
  id: string;
  clientId: string;
  email: string;
  clientRole: "owner" | "member";
  status: "pending" | "accepted" | "expired" | "revoked";
  clerkInvitationId: string | null;
};
```

- [ ] **Step 4: Run the invite tests again**

Run: `npx vitest run src/app/api/admin/invite/route.test.ts src/features/invitations/server.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/invite/route.ts src/app/api/admin/invite/route.test.ts src/features/invitations/server.ts src/features/invitations/server.test.ts
git commit -m "feat: persist client access invites in outlet"
```

---

## Chunk 2: Onboarding And Access

### Task 3: Introduce one canonical portal-entry resolver and first-login invite sync

**Files:**
- Create: `src/features/client-portal/entry.ts`
- Create: `src/features/client-portal/entry.test.ts`
- Modify: `src/lib/member-access.ts`
- Modify: `src/features/client-portal/access.ts`
- Modify: `src/features/client-portal/access.test.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/client/page.tsx`
- Modify: `src/app/client/[slug]/layout.tsx`
- Modify: `src/app/client/[slug]/layout.test.tsx`
- Modify: `src/app/client/pending/page.tsx`

- [ ] **Step 1: Write failing tests for portal entry decisions**

Create `src/features/client-portal/entry.test.ts` with cases for:

- admin -> `/admin/dashboard`
- 1 membership -> `/client/{slug}`
- multiple memberships -> `/client`
- signed-in user with matching pending `client_access_invites` but no membership yet -> membership gets created, then route to portal
- no memberships and no pending invite -> pending / no-access page

Target interface:

```ts
type PortalEntryResult =
  | { kind: "admin"; href: "/admin/dashboard" }
  | { kind: "picker"; href: "/client" }
  | { kind: "portal"; href: `/client/${string}` }
  | { kind: "pending"; href: "/client/pending" };
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/features/client-portal/entry.test.ts src/features/client-portal/access.test.ts 'src/app/client/[slug]/layout.test.tsx'`

Expected: FAIL because there is no shared resolver and the layout still depends on legacy metadata fallbacks.

- [ ] **Step 3: Implement the resolver and remove legacy auto-enroll**

In `src/features/client-portal/entry.ts`:

- resolve current user role
- normalize user emails
- match pending `client_access_invites`
- upsert `client_members` by `client_id + clerk_user_id`
- mark invite rows accepted
- compute the canonical destination

In `src/lib/member-access.ts`:

- keep returning memberships by `client_id`
- centralize slug lookup through the `clients` table
- do not read Clerk `client_slug` for authority

In `src/app/page.tsx`, `src/app/client/page.tsx`, and `src/app/client/[slug]/layout.tsx`:

- replace ad hoc redirect logic with the shared resolver
- remove legacy `meta.client_slug` fallback redirects
- remove the layout auto-upsert that currently creates `client_members` from `publicMetadata.client_role`

In `src/app/client/pending/page.tsx`:

- replace “pending approval” copy with neutral copy such as “No portal access is configured yet”
- explain that the user must use the invited email and contact Outlet if the account is wrong

- [ ] **Step 4: Run the tests again**

Run: `npx vitest run src/features/client-portal/entry.test.ts src/features/client-portal/access.test.ts 'src/app/client/[slug]/layout.test.tsx'`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/client-portal/entry.ts src/features/client-portal/entry.test.ts src/lib/member-access.ts src/features/client-portal/access.ts src/features/client-portal/access.test.ts src/app/page.tsx src/app/client/page.tsx src/app/client/[slug]/layout.tsx src/app/client/[slug]/layout.test.tsx src/app/client/pending/page.tsx
git commit -m "feat: centralize portal entry and invite acceptance"
```

### Task 4: Fix sign-in/sign-up copy and invite landing behavior

**Files:**
- Modify: `src/app/sign-up/[[...sign-up]]/page.tsx`
- Modify: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Modify: `src/features/invitations/server.ts`

- [ ] **Step 1: Write the failing UX test or snapshot assertions**

If there are no existing tests for these pages, add a focused component test or server-render snapshot for the sign-up wrapper that expects:

- invited-client context copy
- “use the invited email” guidance
- client account name shown when `invite_id` resolves

Use an assertion like:

```ts
expect(screen.getByText(/you were invited to join/i)).toBeInTheDocument();
expect(screen.getByText(/use the same email address/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npx vitest run src/app/sign-up/invite-flow.test.tsx`

Expected: FAIL because the current sign-up page is a plain `<SignUp />` wrapper.

- [ ] **Step 3: Implement the custom invite-aware auth wrapper**

- resolve `invite_id` or invitation context from the URL
- load the matching `client_access_invites` row
- render explanatory copy for sign-up/sign-in
- keep Clerk’s prebuilt component on the page, but stop showing a context-free auth page

Important:

- keep business truth in Outlet DB
- use Clerk only for auth and invitation transport
- use Clerk `redirectUrl` because the official Clerk docs support it for programmatic invitations

- [ ] **Step 4: Run the targeted auth-flow tests again**

Run: `npx vitest run src/app/sign-up/invite-flow.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/sign-up/[[...sign-up]]/page.tsx src/app/sign-in/[[...sign-in]]/page.tsx src/features/invitations/server.ts src/app/sign-up/invite-flow.test.tsx
git commit -m "feat: add invite-aware auth copy and landing"
```

---

## Chunk 3: Admin Source Of Truth

### Task 5: Make admin client detail the account settings source of truth

**Files:**
- Modify: `src/lib/api-schemas.ts`
- Modify: `src/app/admin/actions/clients.ts`
- Modify: `src/app/admin/clients/data.ts`
- Modify: `src/app/admin/clients/types.ts`
- Modify: `src/components/admin/clients/client-detail.tsx`
- Modify: `src/components/admin/clients/client-overview-tab.tsx`
- Modify: `src/components/admin/clients/invite-member-form.tsx`
- Modify: `src/components/admin/clients/members-section.tsx`
- Modify: `src/components/admin/clients/client-detail.test.tsx`

- [ ] **Step 1: Extend the existing client-detail test first**

Add expectations that the overview tab exposes:

- editable slug / portal URL metadata
- `eventsEnabled`
- `reportsEnabled`
- branding fields (`portalBrandName`, `portalLogoUrl`, `portalLogoAlt`)

Add expectations that member invites are attached to the client account and pass `clientId`, not just slug.

- [ ] **Step 2: Run the targeted client-detail test**

Run: `npx vitest run src/components/admin/clients/client-detail.test.tsx`

Expected: FAIL because the current overview tab only toggles events and the invite form posts `client_slug`.

- [ ] **Step 3: Implement the expanded account settings surface**

Update `UpdateClientSchema` and `updateClient()` to support:

```ts
{
  clientId: string;
  name?: string;
  slug?: string;
  status?: "active" | "inactive";
  eventsEnabled?: boolean;
  reportsEnabled?: boolean;
  portalBrandName?: string | null;
  portalLogoUrl?: string | null;
  portalLogoAlt?: string | null;
}
```

Update `ClientOverviewTab` so it becomes the client account settings surface, not just an events toggle.

Update `InviteMemberForm` and `MembersSection` so invites are created for a specific `clientId`.

In `src/app/admin/actions/clients.ts`:

- stop writing `publicMetadata.client_slug`
- stop clearing `publicMetadata.client_slug` on member removal
- keep only truly auth-level user metadata such as global admin role

- [ ] **Step 4: Run the client settings tests again**

Run: `npx vitest run src/components/admin/clients/client-detail.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/api-schemas.ts src/app/admin/actions/clients.ts src/app/admin/clients/data.ts src/app/admin/clients/types.ts src/components/admin/clients/client-detail.tsx src/components/admin/clients/client-overview-tab.tsx src/components/admin/clients/invite-member-form.tsx src/components/admin/clients/members-section.tsx src/components/admin/clients/client-detail.test.tsx
git commit -m "feat: make client detail the portal settings source of truth"
```

### Task 6: Split account creation from inviting people

**Files:**
- Modify: `src/components/admin/client-onboard-form.tsx`
- Modify: `src/components/admin/clients/client-table.tsx`
- Modify: `src/app/admin/clients/page.tsx`
- Modify: `src/app/admin/users/data.ts`
- Modify: `src/app/admin/users/page.tsx`
- Modify: `src/components/admin/users/user-table.tsx`

- [ ] **Step 1: Write the failing UX assertions**

Cover these cases:

- the “client onboard” form creates an account instead of emailing an invite
- the Clients page copy no longer tells admins to send people to `/sign-up` and “approve from Users”
- the Users page stops acting like the primary client-access setup surface

- [ ] **Step 2: Run the targeted tests or page snapshots**

Run: `npx vitest run src/components/admin/clients/client-detail.test.tsx src/components/admin/users/revoke-invitation-button.test.tsx`

Expected: at least one FAIL or missing coverage gap that forces the text/flow changes.

- [ ] **Step 3: Implement the separation**

- `ClientOnboardForm` should call `createClient()` or be removed if redundant with `ClientTable`
- keep member invites on the client detail page
- update Clients and Users page copy so the flow is:
  - create client account
  - configure portal/apps
  - invite member from that account

Keep the Users page for:

- Outlet team/admin users
- access audit
- invite cleanup

Do not keep it as the main client membership flow.

- [ ] **Step 4: Run targeted checks again**

Run: `npx vitest run src/components/admin/clients/client-detail.test.tsx src/components/admin/users/revoke-invitation-button.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/client-onboard-form.tsx src/components/admin/clients/client-table.tsx src/app/admin/clients/page.tsx src/app/admin/users/data.ts src/app/admin/users/page.tsx src/components/admin/users/user-table.tsx
git commit -m "refactor: separate client account creation from member invites"
```

---

## Chunk 4: Client Package And Reports

### Task 7: Repackage client navigation around Home, Campaigns, optional Events, and Reports

**Files:**
- Modify: `src/app/client/[slug]/components/nav-config.ts`
- Modify: `src/app/client/[slug]/components/client-nav.tsx`
- Modify: `src/app/client/[slug]/components/mobile-nav.tsx`
- Modify: `src/app/client/[slug]/layout.test.tsx`
- Modify: `src/app/client/[slug]/page.tsx`

- [ ] **Step 1: Update the nav/layout test first**

Extend `src/app/client/[slug]/layout.test.tsx` to expect:

- `Home` instead of `Overview`
- `Campaigns`
- `Reports`
- `Events` only when enabled

Example:

```ts
expect(screen.getByRole("link", { name: "Reports" })).toHaveAttribute(
  "href",
  "/client/acme/reports",
);
```

- [ ] **Step 2: Run the nav tests**

Run: `npx vitest run 'src/app/client/[slug]/layout.test.tsx'`

Expected: FAIL because the nav still only exposes Overview/Campaigns/optional Events.

- [ ] **Step 3: Implement the new package**

- update nav labels and hrefs
- keep `/client/[slug]/page.tsx` as the Home overview
- make `Reports` a first-class app link
- hide `Events` strictly behind `eventsEnabled`
- gate `Reports` behind `reportsEnabled`

Do not create extra client top-level apps in this task.

- [ ] **Step 4: Run the nav tests again**

Run: `npx vitest run 'src/app/client/[slug]/layout.test.tsx'`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/client/[slug]/components/nav-config.ts src/app/client/[slug]/components/client-nav.tsx src/app/client/[slug]/components/mobile-nav.tsx src/app/client/[slug]/layout.test.tsx src/app/client/[slug]/page.tsx
git commit -m "feat: repackage client nav around home campaigns events reports"
```

### Task 8: Build real admin/client reports surfaces on the shared reports feature

**Files:**
- Create: `src/app/client/[slug]/reports/page.tsx`
- Create: `src/app/client/[slug]/reports/loading.tsx`
- Create: `src/app/client/[slug]/reports/error.tsx`
- Create: `src/features/reports/components/reports-surface.tsx`
- Modify: `src/app/admin/reports/page.tsx`
- Modify: `src/features/reports/server.ts`
- Modify: `src/features/reports/summary.ts`

- [ ] **Step 1: Write the failing reports surface tests**

Add focused coverage for:

- client report page rendering summary/trend/action data
- admin report page no longer redirecting to dashboard

At minimum create a component test around the new shared `ReportsSurface` component and a route test for `src/app/admin/reports/page.tsx`.

- [ ] **Step 2: Run the reports tests**

Run: `npx vitest run src/features/reports/summary.test.ts src/app/admin/reports/page.test.tsx 'src/app/client/[slug]/reports/page.test.tsx'`

Expected: FAIL because there is no client reports route and admin reports currently redirects.

- [ ] **Step 3: Implement the shared reports surface**

Create a shared reports component that can render in two modes:

```ts
<ReportsSurface audience="client" />
<ReportsSurface audience="admin" />
```

Back it with:

- `getReportsData()`
- `getReportsWorkflowData()`

Client mode:

- summary cards
- campaign/event report tables or highlights
- embedded workflow/action center

Admin mode:

- same underlying metrics
- broader operating context and links

- [ ] **Step 4: Run the reports tests again**

Run: `npx vitest run src/features/reports/summary.test.ts src/app/admin/reports/page.test.tsx 'src/app/client/[slug]/reports/page.test.tsx'`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/client/[slug]/reports/page.tsx src/app/client/[slug]/reports/loading.tsx src/app/client/[slug]/reports/error.tsx src/features/reports/components/reports-surface.tsx src/app/admin/reports/page.tsx src/features/reports/server.ts src/features/reports/summary.ts
git commit -m "feat: add shared admin and client reports surfaces"
```

### Task 9: Delete dead web surfaces and clean revalidation paths

**Files:**
- Delete: `src/app/admin/approvals/page.tsx`
- Delete: `src/app/admin/conversations/page.tsx`
- Delete: `src/app/admin/crm/page.tsx`
- Delete: `src/app/admin/crm/[contactId]/page.tsx`
- Delete: `src/app/admin/notifications/page.tsx`
- Delete: `src/app/admin/workspace/layout.tsx`
- Delete: `src/app/admin/workspace/page.tsx`
- Delete: `src/app/admin/workspace/[pageId]/page.tsx`
- Delete: `src/app/admin/workspace/tasks/page.tsx`
- Modify: `src/features/access/revalidation.ts`
- Modify: `src/features/workflow/revalidation.ts`

- [ ] **Step 1: Capture the route inventory before deleting**

Run: `find src/app/admin -maxdepth 3 -type f | sort | rg 'approvals|conversations|crm|notifications|workspace'`

Expected: list of dead routes to delete or quarantine.

- [ ] **Step 2: Delete shipped dead routes and update revalidation helpers**

- remove the dead route files listed above
- remove revalidation references to deleted routes
- if one explicit redirect path is still needed, keep exactly one and document it

Do **not** delete backend tables or feature modules in this task unless `rg` proves they are unreferenced after route removal.

- [ ] **Step 3: Run targeted route and type checks**

Run: `npm run type-check`

Expected: PASS, with no imports left pointing at deleted route files.

- [ ] **Step 4: Commit**

```bash
git add src/features/access/revalidation.ts src/features/workflow/revalidation.ts src/app/admin
git commit -m "refactor: remove dead admin surfaces from shipped web app"
```

---

## Chunk 5: Durable Context And Verification

### Task 10: Update repo context and run the full verification gate

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/context/current-priorities.md`

- [ ] **Step 1: Update durable project context**

Update `AGENTS.md` and `docs/context/current-priorities.md` to reflect:

- client package = Home, Campaigns, optional Events, Reports
- CRM and workspace are not active web product surfaces
- Outlet admin is the source of truth for client account setup and memberships
- invites and landing are account-driven, not Clerk-metadata-driven

- [ ] **Step 2: Run targeted lint on changed paths**

Run:

```bash
npx eslint src/app/page.tsx src/app/client src/app/admin src/features/client-portal src/features/invitations src/features/reports src/lib/member-access.ts src/lib/api-schemas.ts
```

Expected: PASS

- [ ] **Step 3: Run the full test suite**

Run: `npm test`

Expected: PASS

If unrelated failures remain, fix them before finishing rather than hand-waving around them.

- [ ] **Step 4: Run the final type check**

Run: `npm run type-check`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add AGENTS.md docs/context/current-priorities.md
git commit -m "docs: update web packaging and account ownership rules"
```

---

## Execution Notes

- Implement Chunk 1 and Chunk 2 before touching the broader client/admin surface cleanup.
- Do not mix invite-flow surgery with dead-route deletion in the same early commit.
- Keep the data migration additive first; only remove surface code after the new path is running.
- If the full removal of workspace/CRM imports causes unexpected dependency fallout, stop deleting deeper feature code and quarantine it instead. The shipped routes still need to be removed on this reset.
