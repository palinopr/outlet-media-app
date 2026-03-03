# Client Accounts & Team Management — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add formal client entities with Clerk-based auth, self-serve signup with admin approval, and multi-user team management per client.

**Architecture:** Two new Supabase tables (`clients`, `client_members`) backing a formal client entity. Clerk `publicMetadata.client_slug` continues to drive fast portal auth checks. Admin assigns users to clients (creates DB row + sets Clerk metadata). Client owners can invite team members via Clerk invitations.

**Tech Stack:** Next.js 15, Supabase, Clerk, Zod, shadcn/ui, Tailwind v4

**Design doc:** `docs/plans/2026-03-03-client-accounts-design.md`

---

## Task 1: Create Supabase tables

**Files:**
- Execute SQL in Supabase dashboard or via migration

**Step 1: Create `clients` table**

Run this SQL in Supabase:

```sql
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_slug ON clients(slug);
```

**Step 2: Create `client_members` table**

```sql
CREATE TABLE client_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  clerk_user_id text NOT NULL,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, clerk_user_id)
);

CREATE INDEX idx_client_members_clerk_user ON client_members(clerk_user_id);
CREATE INDEX idx_client_members_client ON client_members(client_id);
```

**Step 3: Seed existing clients**

```sql
INSERT INTO clients (name, slug)
SELECT DISTINCT
  initcap(replace(client_slug, '_', ' ')),
  client_slug
FROM meta_campaigns
WHERE client_slug IS NOT NULL
ON CONFLICT (slug) DO NOTHING;
```

**Step 4: Verify**

Run `SELECT * FROM clients;` and confirm rows for zamora, kybba, beamina, happy_paws, etc.

---

## Task 2: Update database types

**Files:**
- Modify: `src/lib/database.types.ts`

**Step 1: Add client types**

Add these interfaces to `src/lib/database.types.ts` alongside the existing table types. Find the `Tables` interface and add entries for `clients` and `client_members`. The exact location depends on how the file is structured — add near the other table definitions.

```typescript
// In the Tables interface, add:
clients: {
  Row: {
    id: string;
    name: string;
    slug: string;
    status: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    slug: string;
    status?: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    slug?: string;
    status?: string;
    created_at?: string;
  };
};
client_members: {
  Row: {
    id: string;
    client_id: string;
    clerk_user_id: string;
    role: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    client_id: string;
    clerk_user_id: string;
    role?: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    client_id?: string;
    clerk_user_id?: string;
    role?: string;
    created_at?: string;
  };
};
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No new type errors.

**Step 3: Commit**

```bash
git add src/lib/database.types.ts
git commit -m "feat: add clients and client_members types to database types"
```

---

## Task 3: Add client server actions (CRUD)

**Files:**
- Modify: `src/app/admin/actions/clients.ts`
- Modify: `src/lib/api-schemas.ts`

**Step 1: Add Zod schemas to `src/lib/api-schemas.ts`**

Add after the existing `InviteSchema`:

```typescript
// ─── Client management schemas ──────────────────────────────────────────────

export const CreateClientSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/, "Slug must be lowercase alphanumeric with underscores"),
});

export const UpdateClientSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const AddClientMemberSchema = z.object({
  clientId: z.string().uuid(),
  clerkUserId: z.string().min(1),
  role: z.enum(["owner", "member"]).default("member"),
});

export const RemoveClientMemberSchema = z.object({
  clientId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export const ChangeClientMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["owner", "member"]),
});
```

**Step 2: Add server actions to `src/app/admin/actions/clients.ts`**

Add these new actions below the existing `renameClient` and `deactivateClient` functions. Keep the existing functions — they still work and are used by the client table.

```typescript
import { clerkClient } from "@clerk/nextjs/server";
import {
  CreateClientSchema,
  UpdateClientSchema,
  AddClientMemberSchema,
  RemoveClientMemberSchema,
  ChangeClientMemberRoleSchema,
} from "@/lib/api-schemas";

// ─── Create client ──────────────────────────────────────────────────────────

export async function createClient(formData: { name: string; slug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = CreateClientSchema.parse(formData);

  const { data, error } = await supabaseAdmin
    .from("clients")
    .insert({ name: parsed.name, slug: parsed.slug })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("A client with this slug already exists");
    throw new Error(error.message);
  }

  await logAudit("client", data.id, "create", null, { name: parsed.name, slug: parsed.slug });
  revalidatePath("/admin/clients");
  return data;
}

// ─── Update client ──────────────────────────────────────────────────────────

export async function updateClient(formData: { clientId: string; name?: string; slug?: string; status?: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = UpdateClientSchema.parse(formData);
  const { clientId, ...updates } = parsed;

  const { error } = await supabaseAdmin
    .from("clients")
    .update(updates)
    .eq("id", clientId);

  if (error) throw new Error(error.message);

  await logAudit("client", clientId, "update", null, updates);
  revalidatePath("/admin/clients");
}

// ─── Add member to client ───────────────────────────────────────────────────

export async function addClientMember(formData: { clientId: string; clerkUserId: string; role?: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = AddClientMemberSchema.parse(formData);

  // Get the client slug for Clerk metadata
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("slug")
    .eq("id", parsed.clientId)
    .single();

  if (!client) throw new Error("Client not found");

  // Insert member row
  const { error } = await supabaseAdmin
    .from("client_members")
    .insert({
      client_id: parsed.clientId,
      clerk_user_id: parsed.clerkUserId,
      role: parsed.role,
    });

  if (error) {
    if (error.code === "23505") throw new Error("User is already a member of this client");
    throw new Error(error.message);
  }

  // Set client_slug in Clerk metadata
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(parsed.clerkUserId);
  const existingMeta = (user.publicMetadata ?? {}) as Record<string, unknown>;
  await clerk.users.updateUserMetadata(parsed.clerkUserId, {
    publicMetadata: { ...existingMeta, client_slug: client.slug },
  });

  await logAudit("client_member", parsed.clerkUserId, "add", null, {
    clientId: parsed.clientId,
    role: parsed.role,
  });
  revalidatePath("/admin/clients");
  revalidatePath("/admin/users");
}

// ─── Remove member from client ──────────────────────────────────────────────

export async function removeClientMember(formData: { clientId: string; memberId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = RemoveClientMemberSchema.parse(formData);

  // Get member info before deletion (for Clerk cleanup)
  const { data: member } = await supabaseAdmin
    .from("client_members")
    .select("clerk_user_id")
    .eq("id", parsed.memberId)
    .eq("client_id", parsed.clientId)
    .single();

  if (!member) throw new Error("Member not found");

  const { error } = await supabaseAdmin
    .from("client_members")
    .delete()
    .eq("id", parsed.memberId);

  if (error) throw new Error(error.message);

  // Check if user has other client memberships
  const { data: otherMemberships } = await supabaseAdmin
    .from("client_members")
    .select("id")
    .eq("clerk_user_id", member.clerk_user_id)
    .limit(1);

  // If no other memberships, clear client_slug from Clerk
  if (!otherMemberships?.length) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(member.clerk_user_id);
    const existingMeta = (user.publicMetadata ?? {}) as Record<string, unknown>;
    delete existingMeta.client_slug;
    await clerk.users.updateUserMetadata(member.clerk_user_id, {
      publicMetadata: existingMeta,
    });
  }

  await logAudit("client_member", parsed.memberId, "remove", { clerkUserId: member.clerk_user_id }, null);
  revalidatePath("/admin/clients");
  revalidatePath("/admin/users");
}

// ─── Change member role ─────────────────────────────────────────────────────

export async function changeClientMemberRole(formData: { memberId: string; role: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = ChangeClientMemberRoleSchema.parse(formData);

  const { error } = await supabaseAdmin
    .from("client_members")
    .update({ role: parsed.role })
    .eq("id", parsed.memberId);

  if (error) throw new Error(error.message);

  await logAudit("client_member", parsed.memberId, "change_role", null, { role: parsed.role });
  revalidatePath("/admin/clients");
}
```

**Step 3: Verify build**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/lib/api-schemas.ts src/app/admin/actions/clients.ts
git commit -m "feat: add client CRUD and member management server actions"
```

---

## Task 4: Update client data fetching to use `clients` table

**Files:**
- Modify: `src/app/admin/clients/data.ts`

**Step 1: Rewrite `getClientSummaries` to query `clients` table**

Replace the current implementation. The function should now query the `clients` table as the source of truth, then join with campaigns/events/members for counts.

```typescript
import { supabaseAdmin } from "@/lib/supabase";

export interface ClientSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  memberCount: number;
  activeCampaigns: number;
  totalCampaigns: number;
  activeShows: number;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  createdAt: string;
}

export interface ClientDetail extends ClientSummary {
  members: ClientMember[];
  campaigns: ClientCampaign[];
}

export interface ClientMember {
  id: string;
  clerkUserId: string;
  role: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ClientCampaign {
  id: string;
  name: string;
  status: string;
  spend: number;
  roas: number;
}

export async function getClientSummaries(): Promise<ClientSummary[]> {
  if (!supabaseAdmin) return [];

  const [clientsRes, campaignsRes, eventsRes, membersRes] = await Promise.all([
    supabaseAdmin.from("clients").select("id, name, slug, status, created_at").order("name"),
    supabaseAdmin.from("meta_campaigns").select("client_slug, status, spend, roas"),
    supabaseAdmin.from("tm_events").select("client_slug").not("client_slug", "is", null),
    supabaseAdmin.from("client_members").select("client_id"),
  ]);

  if (!clientsRes.data) return [];

  // Build lookup maps
  const campaignsBySlug: Record<string, typeof campaignsRes.data> = {};
  for (const c of (campaignsRes.data ?? [])) {
    const slug = c.client_slug ?? "unknown";
    (campaignsBySlug[slug] ??= []).push(c);
  }

  const showsBySlug: Record<string, number> = {};
  for (const e of (eventsRes.data ?? [])) {
    const slug = e.client_slug as string;
    showsBySlug[slug] = (showsBySlug[slug] ?? 0) + 1;
  }

  const membersByClientId: Record<string, number> = {};
  for (const m of (membersRes.data ?? [])) {
    membersByClientId[m.client_id] = (membersByClientId[m.client_id] ?? 0) + 1;
  }

  return clientsRes.data.map((client) => {
    const campaigns = campaignsBySlug[client.slug] ?? [];
    const totalSpend = campaigns.reduce((s, c) => s + ((c.spend ?? 0) / 100), 0);
    const totalRevenue = campaigns.reduce((s, c) => s + ((c.spend ?? 0) / 100) * (c.roas ?? 0), 0);
    const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;

    return {
      id: client.id,
      name: client.name,
      slug: client.slug,
      status: client.status,
      memberCount: membersByClientId[client.id] ?? 0,
      activeCampaigns,
      totalCampaigns: campaigns.length,
      activeShows: showsBySlug[client.slug] ?? 0,
      totalSpend,
      totalRevenue,
      roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      createdAt: client.created_at,
    };
  });
}

export async function getClientDetail(clientId: string): Promise<ClientDetail | null> {
  if (!supabaseAdmin) return null;

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, name, slug, status, created_at")
    .eq("id", clientId)
    .single();

  if (!client) return null;

  const [membersRes, campaignsRes, eventsRes] = await Promise.all([
    supabaseAdmin
      .from("client_members")
      .select("id, clerk_user_id, role, created_at")
      .eq("client_id", clientId)
      .order("created_at"),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name, status, spend, roas")
      .eq("client_slug", client.slug),
    supabaseAdmin
      .from("tm_events")
      .select("client_slug")
      .eq("client_slug", client.slug),
  ]);

  // Resolve Clerk user info for members
  let members: ClientMember[] = [];
  if (membersRes.data?.length) {
    const { clerkClient: getClerk } = await import("@clerk/nextjs/server");
    const clerk = await getClerk();

    members = await Promise.all(
      membersRes.data.map(async (m) => {
        try {
          const user = await clerk.users.getUser(m.clerk_user_id);
          return {
            id: m.id,
            clerkUserId: m.clerk_user_id,
            role: m.role,
            name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "No name",
            email: user.emailAddresses[0]?.emailAddress ?? "",
            createdAt: m.created_at,
          };
        } catch {
          return {
            id: m.id,
            clerkUserId: m.clerk_user_id,
            role: m.role,
            name: "Unknown user",
            email: "",
            createdAt: m.created_at,
          };
        }
      })
    );
  }

  const campaigns: ClientCampaign[] = (campaignsRes.data ?? []).map((c) => ({
    id: c.campaign_id,
    name: c.name,
    status: c.status,
    spend: (c.spend ?? 0) / 100,
    roas: c.roas ?? 0,
  }));

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.spend * c.roas, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;

  return {
    id: client.id,
    name: client.name,
    slug: client.slug,
    status: client.status,
    memberCount: members.length,
    activeCampaigns,
    totalCampaigns: campaigns.length,
    activeShows: eventsRes.data?.length ?? 0,
    totalSpend,
    totalRevenue,
    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    createdAt: client.created_at,
    members,
    campaigns,
  };
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/admin/clients/data.ts
git commit -m "feat: rewrite client data fetching to use clients table"
```

---

## Task 5: Update admin clients page and table

**Files:**
- Modify: `src/app/admin/clients/page.tsx`
- Modify: `src/components/admin/clients/client-table.tsx`

**Step 1: Update `client-table.tsx`**

Update the `ClientSummary` interface to match the new data shape (add `memberCount`, `totalCampaigns`, `createdAt`; remove `type`, `joinedAt`). Add a "Create Client" button at the top. Add a "Members" column. Make client names clickable to go to the detail page (`/admin/clients/[id]`).

Key changes:
- Import `createClient` from actions
- Add `CreateClientForm` component (name input + auto-slug + submit)
- Replace the `type` column with `memberCount`
- Make client name a link to `/admin/clients/${c.id}`
- Update `ClientSummary` interface to match new `data.ts` exports

**Step 2: Update `page.tsx`**

The page structure stays the same. Update stat card values to use new field names. Add a "Pending Users" stat (count of users without `client_slug` from the users data).

**Step 3: Verify build + test in browser**

Run: `npx tsc --noEmit`
Open `/admin/clients` and verify the table renders with the new columns.

**Step 4: Commit**

```bash
git add src/app/admin/clients/page.tsx src/components/admin/clients/client-table.tsx
git commit -m "feat: update admin clients page with create button and member counts"
```

---

## Task 6: Create client detail page

**Files:**
- Create: `src/app/admin/clients/[id]/page.tsx`
- Create: `src/components/admin/clients/client-detail.tsx`

**Step 1: Create the detail page**

`src/app/admin/clients/[id]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { getClientDetail } from "../data";
import { ClientDetailView } from "@/components/admin/clients/client-detail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClientDetail(id);
  if (!client) notFound();

  return <ClientDetailView client={client} />;
}
```

**Step 2: Create the detail component**

`src/components/admin/clients/client-detail.tsx`:

This is a "use client" component that displays:
- Back link to `/admin/clients`
- Client header: name, slug (editable), status badge
- Stats row: members, campaigns, shows, ROAS
- Members section: table with name, email, role (editable dropdown), remove button
- "Add Member" button that opens inline form (search by email or select from pending users)
- "Invite Member" button that sends Clerk invitation
- Campaigns section: table of assigned campaigns (name, status, spend, ROAS) — read-only

Use existing UI patterns:
- `Card` wrapping each section
- `Table` for members and campaigns
- `StatusSelect` for role changes
- `ConfirmDialog` for remove
- `InlineEdit` for slug editing
- `toast` for feedback

Server actions to wire:
- `updateClient` for name/slug/status changes
- `addClientMember` for adding existing users
- `removeClientMember` for removing members
- `changeClientMemberRole` for role changes
- Existing `renameClient` can be replaced by `updateClient`

**Step 3: Verify build + test in browser**

Navigate to `/admin/clients`, click a client row, verify the detail page renders.

**Step 4: Commit**

```bash
git add src/app/admin/clients/[id]/page.tsx src/components/admin/clients/client-detail.tsx
git commit -m "feat: add client detail page with member management"
```

---

## Task 7: Update admin users page for pending status + assignment

**Files:**
- Modify: `src/components/admin/users/user-table.tsx`
- Modify: `src/app/admin/users/page.tsx`

**Step 1: Update `user-table.tsx` AssignCell**

Replace the hardcoded `CLIENT_SLUGS` dropdown with a dynamic list from the `clients` table. The user table component needs to receive the list of clients as a prop.

Changes:
- Add `clients: { id: string; name: string; slug: string }[]` to `Props`
- Update `AssignCell` to use `clients` prop instead of `CLIENT_SLUGS`
- When a client is selected, call the `/api/admin/users/[id]` PATCH endpoint (existing) AND call `addClientMember` server action to create the DB row
- Add a "Pending" badge next to users who have no `client_slug` and no `role`
- Update `InviteForm` to use `clients` prop instead of `CLIENT_SLUGS`

**Step 2: Update `page.tsx`**

Fetch the client list alongside users:

```typescript
import { getClientSummaries } from "../clients/data";

// In the component:
const [users, clients] = await Promise.all([getUsers(), getClientSummaries()]);

// Pass to table:
<UserTable users={users} clients={clients.map(c => ({ id: c.id, name: c.name, slug: c.slug }))} />
```

Add a "Pending" stat card counting users without client_slug or admin role.

**Step 3: Verify build + test**

**Step 4: Commit**

```bash
git add src/components/admin/users/user-table.tsx src/app/admin/users/page.tsx
git commit -m "feat: show pending users and dynamic client list in users page"
```

---

## Task 8: Update `/api/admin/users/[id]` to sync client_members

**Files:**
- Modify: `src/app/api/admin/users/[id]/route.ts`

**Step 1: Update the PATCH handler**

When `client_slug` is set on a user, also upsert a `client_members` row. When cleared, remove the row.

After updating Clerk metadata, add:

```typescript
import { supabaseAdmin } from "@/lib/supabase";

// After Clerk metadata update:
if (supabaseAdmin) {
  if (slug) {
    // Find client by slug
    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("slug", slug)
      .single();

    if (client) {
      await supabaseAdmin
        .from("client_members")
        .upsert(
          { client_id: client.id, clerk_user_id: id, role: "member" },
          { onConflict: "client_id,clerk_user_id" }
        );
    }
  } else {
    // Remove all memberships for this user
    await supabaseAdmin
      .from("client_members")
      .delete()
      .eq("clerk_user_id", id);
  }
}
```

**Step 2: Verify build**

**Step 3: Commit**

```bash
git add src/app/api/admin/users/[id]/route.ts
git commit -m "feat: sync client_members when assigning user to client"
```

---

## Task 9: Update root page routing + create pending page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/client/pending/page.tsx`
- Create: `src/app/client/pending/layout.tsx`

**Step 1: Update root page**

The root page (`src/app/page.tsx`) already has the right routing logic. The "account not configured" message at the bottom just needs to redirect to `/client/pending` instead of showing inline:

Replace the fallback return with:

```typescript
// Logged in but no role or client assigned yet
redirect("/client/pending");
```

**Step 2: Create pending layout**

`src/app/client/pending/layout.tsx`:

```typescript
import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PendingLayout({ children }: { children: ReactNode }) {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (clerkEnabled) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
  }
  return <>{children}</>;
}
```

**Step 3: Create pending page**

`src/app/client/pending/page.tsx`:

```typescript
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function PendingPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4 max-w-sm">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto">
          <span className="text-white text-lg font-bold">O</span>
        </div>
        <h1 className="text-lg font-semibold">Account Pending Approval</h1>
        <p className="text-sm text-muted-foreground">
          Your account has been created. An admin at Outlet Media will review
          and assign you to a client portal. You will get access once approved.
        </p>
        <SignOutButton>
          <Button variant="outline" size="sm">
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
```

**Step 4: Add `/client/pending` to public routes in proxy.ts**

Add to the `isPublicRoute` matcher in `src/proxy.ts`:

```typescript
"/client/pending(.*)",
```

Wait -- actually the pending page SHOULD require auth (user must be logged in to see it). The current proxy already protects non-public routes with `auth.protect()`. So the pending page is already protected. No change needed to proxy.ts.

**Step 5: Verify build + test**

Log in as a user with no `client_slug` metadata. Should redirect to `/client/pending`.

**Step 6: Commit**

```bash
git add src/app/page.tsx src/app/client/pending/page.tsx src/app/client/pending/layout.tsx
git commit -m "feat: add pending approval page for unapproved users"
```

---

## Task 10: Auto-enroll invited users on first portal visit

**Files:**
- Modify: `src/app/client/[slug]/layout.tsx`

**Step 1: Add auto-enrollment logic**

In the client portal layout, after the auth check confirms the user has access (either admin or matching `client_slug`), add an upsert to ensure a `client_members` row exists:

```typescript
import { supabaseAdmin } from "@/lib/supabase";

// After auth check, if user is a client (not admin) and has matching slug:
if (!isAdmin && isOwnPortal && supabaseAdmin) {
  // Auto-enroll: ensure client_members row exists
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", slug)
    .single();

  if (client) {
    await supabaseAdmin
      .from("client_members")
      .upsert(
        { client_id: client.id, clerk_user_id: userId!, role: "member" },
        { onConflict: "client_id,clerk_user_id" }
      );
  }
}
```

This runs on every portal visit but the upsert is a no-op if the row exists (ON CONFLICT DO NOTHING equivalent with upsert).

**Step 2: Verify build**

**Step 3: Commit**

```bash
git add src/app/client/[slug]/layout.tsx
git commit -m "feat: auto-enroll invited users as client members on first visit"
```

---

## Task 11: Create client portal settings/team page

**Files:**
- Create: `src/app/client/[slug]/settings/page.tsx`
- Create: `src/app/client/[slug]/settings/data.ts`
- Create: `src/app/client/[slug]/settings/actions.ts`

**Step 1: Create data fetcher**

`src/app/client/[slug]/settings/data.ts`:

Fetch the client record and its members (with Clerk user info). Only return data if the requesting user is an owner.

```typescript
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface SettingsData {
  clientId: string;
  clientName: string;
  slug: string;
  isOwner: boolean;
  members: TeamMember[];
}

export async function getSettingsData(slug: string): Promise<SettingsData | null> {
  if (!supabaseAdmin) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!client) return null;

  const { data: members } = await supabaseAdmin
    .from("client_members")
    .select("id, clerk_user_id, role, created_at")
    .eq("client_id", client.id)
    .order("created_at");

  if (!members) return null;

  // Check if current user is owner
  const currentMember = members.find((m) => m.clerk_user_id === userId);
  const isOwner = currentMember?.role === "owner";

  const clerk = await clerkClient();
  const teamMembers: TeamMember[] = await Promise.all(
    members.map(async (m) => {
      try {
        const user = await clerk.users.getUser(m.clerk_user_id);
        return {
          id: m.id,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "No name",
          email: user.emailAddresses[0]?.emailAddress ?? "",
          role: m.role,
          createdAt: m.created_at,
        };
      } catch {
        return {
          id: m.id,
          name: "Unknown",
          email: "",
          role: m.role,
          createdAt: m.created_at,
        };
      }
    })
  );

  return {
    clientId: client.id,
    clientName: client.name,
    slug: client.slug,
    isOwner,
    members: teamMembers,
  };
}
```

**Step 2: Create server actions for client-side invites**

`src/app/client/[slug]/settings/actions.ts`:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";

const InviteTeamMemberSchema = z.object({
  email: z.string().email(),
  slug: z.string().min(1),
});

export async function inviteTeamMember(formData: { email: string; slug: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = InviteTeamMemberSchema.parse(formData);

  // Verify caller is an owner of this client
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", parsed.slug)
    .single();

  if (!client) throw new Error("Client not found");

  const { data: membership } = await supabaseAdmin
    .from("client_members")
    .select("role")
    .eq("client_id", client.id)
    .eq("clerk_user_id", userId)
    .single();

  if (membership?.role !== "owner") throw new Error("Only owners can invite team members");

  // Send Clerk invitation with client_slug pre-set
  const clerk = await clerkClient();
  await clerk.invitations.createInvitation({
    emailAddress: parsed.email,
    publicMetadata: { client_slug: parsed.slug },
  });

  revalidatePath(`/client/${parsed.slug}/settings`);
}

const RemoveTeamMemberSchema = z.object({
  memberId: z.string().uuid(),
  slug: z.string().min(1),
});

export async function removeTeamMember(formData: { memberId: string; slug: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = RemoveTeamMemberSchema.parse(formData);

  // Verify caller is an owner
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", parsed.slug)
    .single();

  if (!client) throw new Error("Client not found");

  const { data: callerMembership } = await supabaseAdmin
    .from("client_members")
    .select("role")
    .eq("client_id", client.id)
    .eq("clerk_user_id", userId)
    .single();

  if (callerMembership?.role !== "owner") throw new Error("Only owners can remove members");

  // Get the member being removed
  const { data: member } = await supabaseAdmin
    .from("client_members")
    .select("clerk_user_id, role")
    .eq("id", parsed.memberId)
    .single();

  if (!member) throw new Error("Member not found");
  if (member.role === "owner") throw new Error("Cannot remove an owner");

  // Delete the membership
  await supabaseAdmin.from("client_members").delete().eq("id", parsed.memberId);

  // Clear Clerk metadata if no other memberships
  const { data: otherMemberships } = await supabaseAdmin
    .from("client_members")
    .select("id")
    .eq("clerk_user_id", member.clerk_user_id)
    .limit(1);

  if (!otherMemberships?.length) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(member.clerk_user_id);
    const meta = (user.publicMetadata ?? {}) as Record<string, unknown>;
    delete meta.client_slug;
    await clerk.users.updateUserMetadata(member.clerk_user_id, {
      publicMetadata: meta,
    });
  }

  revalidatePath(`/client/${parsed.slug}/settings`);
}
```

**Step 3: Create the settings page**

`src/app/client/[slug]/settings/page.tsx`:

```typescript
import { getSettingsData } from "./data";
import { SettingsView } from "./settings-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SettingsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getSettingsData(slug);

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Settings not available.</p>
      </div>
    );
  }

  return <SettingsView data={data} />;
}
```

**Step 4: Create the settings view component**

Create `src/app/client/[slug]/settings/settings-view.tsx`:

A "use client" component that shows:
- "Team" section header
- Table of members: name, email, role badge, remove button (owner only, can't remove self)
- "Invite Team Member" form: email input + send button (owner only)
- Uses `inviteTeamMember` and `removeTeamMember` actions
- Uses `toast` for feedback

Style it to match the client portal aesthetic (dark theme with cyan/violet accents).

**Step 5: Verify build + test**

Navigate to `/client/zamora/settings` as an owner. Verify team list renders and invite form works.

**Step 6: Commit**

```bash
git add src/app/client/[slug]/settings/
git commit -m "feat: add client portal settings page with team management"
```

---

## Task 12: Update `/api/admin/invite` to create client_members row

**Files:**
- Modify: `src/app/api/admin/invite/route.ts`

**Step 1: After sending Clerk invitation, also note the intended membership**

The Clerk invitation doesn't create a user yet (user hasn't signed up). So we can't create a `client_members` row here. The auto-enrollment in Task 10 handles this -- when the invited user signs up and visits the portal, the layout upserts the row.

However, the `/api/admin/invite` route should validate that the `client_slug` corresponds to an actual `clients` record:

```typescript
import { supabaseAdmin } from "@/lib/supabase";

// After parsing, before sending invite:
if (body.client_slug && supabaseAdmin) {
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", body.client_slug)
    .single();

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 400 });
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/admin/invite/route.ts
git commit -m "feat: validate client_slug exists in clients table when inviting"
```

---

## Task 13: Remove hardcoded CLIENT_SLUGS usage

**Files:**
- Modify: `src/lib/constants.ts` (remove `CLIENT_SLUGS` or mark deprecated)
- Modify: Any components still importing `CLIENT_SLUGS`

**Step 1: Find all usages**

Search for `CLIENT_SLUGS` across the codebase. Update each usage to fetch from the `clients` table instead. The main usages are:
- `src/components/admin/users/user-table.tsx` (already updated in Task 7)
- `src/components/admin/campaigns/campaign-table.tsx` — needs to fetch client list as prop

**Step 2: Update campaign table to accept clients prop**

In `src/components/admin/campaigns/campaign-table.tsx`, the `ClientSelect` component uses `CLIENT_SLUGS`. Change it to accept a `clients` array prop instead. Update the parent page to pass clients.

**Step 3: Remove or deprecate `CLIENT_SLUGS` from constants.ts**

If no other files use it, remove the export. If the agent code depends on it, keep it but add a comment.

**Step 4: Commit**

```bash
git add src/lib/constants.ts src/components/admin/campaigns/campaign-table.tsx src/app/admin/campaigns/page.tsx
git commit -m "refactor: replace hardcoded CLIENT_SLUGS with dynamic client list"
```

---

## Task 14: Final verification and cleanup

**Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: Clean.

**Step 2: Build**

Run: `npm run build`
Expected: No errors.

**Step 3: Manual testing checklist**

- [ ] Admin can create a new client at `/admin/clients`
- [ ] Admin can view client detail at `/admin/clients/[id]`
- [ ] Admin can add/remove members on the client detail page
- [ ] Admin can assign a pending user to a client from `/admin/users`
- [ ] New user signup -> lands on `/client/pending`
- [ ] After admin assigns user -> user redirects to their client portal
- [ ] Client owner can see team members at `/client/[slug]/settings`
- [ ] Client owner can invite a team member via email
- [ ] Invited user signs up -> auto-enrolled on first portal visit
- [ ] Client member (non-owner) cannot invite or remove members
- [ ] Admin can still access any client portal

**Step 4: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore: final cleanup for client accounts feature"
```
