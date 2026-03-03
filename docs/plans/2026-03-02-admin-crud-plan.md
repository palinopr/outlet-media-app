# Admin CRUD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add full CRUD controls to all admin pages -- campaigns, events, clients, users -- with audit logging and optional Meta API sync for campaigns.

**Architecture:** Server actions under `src/app/admin/actions/` with Zod validation + adminGuard(). Inline editing on existing table rows via new client components. Shared audit log helper writes to `admin_audit_log` table. Meta sync via confirmation dialog.

**Tech Stack:** Next.js 16 server actions, Supabase (service role), Clerk SDK, Zod, shadcn/ui, sonner toast, Meta Graph API v21.0

---

## Task 1: Create admin_audit_log table

**Files:**
- Create: `src/app/admin/actions/audit.ts`

**Step 1: Create the Supabase table**

Run this SQL in Supabase dashboard (or via MCP):
```sql
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  user_email text not null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

create index idx_audit_entity on admin_audit_log (entity_type, entity_id);
create index idx_audit_created on admin_audit_log (created_at desc);
```

**Step 2: Create the audit helper**

```typescript
// src/app/admin/actions/audit.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function logAudit(
  entityType: string,
  entityId: string,
  action: string,
  oldValue: unknown,
  newValue: unknown,
) {
  const user = await currentUser();
  if (!user || !supabaseAdmin) return;

  await supabaseAdmin.from("admin_audit_log").insert({
    user_id: user.id,
    user_email: user.emailAddresses[0]?.emailAddress ?? "unknown",
    entity_type: entityType,
    entity_id: entityId,
    action,
    old_value: oldValue,
    new_value: newValue,
  });
}
```

**Step 3: Commit**
```
feat: add admin_audit_log table and audit helper
```

---

## Task 2: Reusable UI components

**Files:**
- Create: `src/components/admin/confirm-dialog.tsx`
- Create: `src/components/admin/inline-edit.tsx`
- Create: `src/components/admin/status-select.tsx`

**Step 1: Confirm dialog**

```typescript
// src/components/admin/confirm-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "destructive" | "default";
  onConfirm: () => Promise<void>;
}

export function ConfirmDialog({ trigger, title, description, confirmLabel = "Confirm", variant = "destructive", onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  if (!open) {
    return <div onClick={() => setOpen(true)}>{trigger}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={() => !loading && setOpen(false)} />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant={variant} size="sm" onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Inline edit**

```typescript
// src/components/admin/inline-edit.tsx
"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";

interface Props {
  value: string | number | null;
  type?: "text" | "number";
  prefix?: string;
  suffix?: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
}

export function InlineEdit({ value, type = "text", prefix, suffix, onSave, className = "" }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(String(value ?? "")); setEditing(true); }}
        className={`text-left hover:bg-muted/50 px-1 -mx-1 rounded transition-colors cursor-pointer ${className}`}
        title="Click to edit"
      >
        {prefix}{value ?? "—"}{suffix}
      </button>
    );
  }

  async function save() {
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
        className="h-7 w-24 rounded border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
      {saving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      ) : (
        <>
          <button onClick={save} className="text-emerald-400 hover:text-emerald-300"><Check className="h-3.5 w-3.5" /></button>
          <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
        </>
      )}
    </div>
  );
}
```

**Step 3: Status select**

```typescript
// src/components/admin/status-select.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  value: string;
  options: { value: string; label: string }[];
  onSave: (value: string) => Promise<void>;
}

export function StatusSelect({ value, options, onSave }: Props) {
  const [saving, setSaving] = useState(false);

  async function handleChange(newValue: string) {
    if (newValue === value) return;
    setSaving(true);
    try {
      await onSave(newValue);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
```

**Step 4: Commit**
```
feat: add reusable confirm-dialog, inline-edit, status-select components
```

---

## Task 3: Campaign server actions

**Files:**
- Create: `src/app/admin/actions/campaigns.ts`
- Create: `src/app/admin/actions/meta-sync.ts`

**Step 1: Campaign actions**

```typescript
// src/app/admin/actions/campaigns.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";
import { syncCampaignStatus, syncCampaignBudget } from "./meta-sync";

const UpdateStatusSchema = z.object({
  campaignId: z.string().min(1),
  status: z.enum(["ACTIVE", "PAUSED"]),
});

export async function updateCampaignStatus(formData: { campaignId: string; status: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateStatusSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("status")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ status: parsed.status, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_status", { status: old?.status }, { status: parsed.status });
  revalidatePath("/admin/campaigns");
}

const UpdateBudgetSchema = z.object({
  campaignId: z.string().min(1),
  dailyBudgetCents: z.number().int().positive(),
});

export async function updateCampaignBudget(formData: { campaignId: string; dailyBudgetCents: number }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateBudgetSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("daily_budget")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ daily_budget: parsed.dailyBudgetCents, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_budget", { daily_budget: old?.daily_budget }, { daily_budget: parsed.dailyBudgetCents });
  revalidatePath("/admin/campaigns");
}

const AssignClientSchema = z.object({
  campaignId: z.string().min(1),
  clientSlug: z.string(),
});

export async function assignCampaignClient(formData: { campaignId: string; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = AssignClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("client_slug")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ client_slug: parsed.clientSlug || null, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "assign_client", { client_slug: old?.client_slug }, { client_slug: parsed.clientSlug });
  revalidatePath("/admin/campaigns");
}

export async function syncCampaignToMeta(campaignId: string, changes: { status?: string; dailyBudgetCents?: number }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const results: string[] = [];

  if (changes.status) {
    await syncCampaignStatus(campaignId, changes.status);
    results.push(`Status -> ${changes.status}`);
  }
  if (changes.dailyBudgetCents) {
    await syncCampaignBudget(campaignId, changes.dailyBudgetCents);
    results.push(`Budget -> $${(changes.dailyBudgetCents / 100).toFixed(0)}/day`);
  }

  if (supabaseAdmin) {
    await supabaseAdmin
      .from("meta_campaigns")
      .update({ synced_at: new Date().toISOString() })
      .eq("campaign_id", campaignId);
  }

  await logAudit("campaign", campaignId, "sync_to_meta", null, { changes, results });
  revalidatePath("/admin/campaigns");

  return results;
}
```

**Step 2: Meta sync helper**

```typescript
// src/app/admin/actions/meta-sync.ts
import { META_API_VERSION } from "@/lib/constants";

function getMetaCredentials() {
  const token = process.env.META_ACCESS_TOKEN;
  const rawAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawAccountId) throw new Error("Meta API credentials not configured");
  return { token, accountId: rawAccountId.replace(/^act_/, "") };
}

export async function syncCampaignStatus(campaignId: string, status: string) {
  const { token } = getMetaCredentials();
  const url = `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ access_token: token, status }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message ?? `Meta API error: ${res.status}`);
  }
}

export async function syncCampaignBudget(campaignId: string, dailyBudgetCents: number) {
  const { token } = getMetaCredentials();
  const url = `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: token,
      daily_budget: String(dailyBudgetCents),
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message ?? `Meta API error: ${res.status}`);
  }
}
```

**Step 3: Commit**
```
feat: add campaign server actions with Meta sync
```

---

## Task 4: Event server actions

**Files:**
- Create: `src/app/admin/actions/events.ts`

```typescript
// src/app/admin/actions/events.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";

const UpdateEventStatusSchema = z.object({
  eventId: z.string().min(1),
  status: z.string().min(1),
});

export async function updateEventStatus(formData: { eventId: string; status: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateEventStatusSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin.from("tm_events").select("status").eq("id", parsed.eventId).single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ status: parsed.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "update_status", { status: old?.status }, { status: parsed.status });
  revalidatePath("/admin/events");
}

const AssignEventClientSchema = z.object({
  eventId: z.string().min(1),
  clientSlug: z.string(),
});

export async function assignEventClient(formData: { eventId: string; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = AssignEventClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin.from("tm_events").select("client_slug").eq("id", parsed.eventId).single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ client_slug: parsed.clientSlug || null, updated_at: new Date().toISOString() })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "assign_client", { client_slug: old?.client_slug }, { client_slug: parsed.clientSlug });
  revalidatePath("/admin/events");
}

const UpdateTicketsSchema = z.object({
  eventId: z.string().min(1),
  ticketsSold: z.number().int().min(0).nullable(),
  ticketsAvailable: z.number().int().min(0).nullable(),
});

export async function updateEventTickets(formData: { eventId: string; ticketsSold: number | null; ticketsAvailable: number | null }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateTicketsSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin.from("tm_events").select("tickets_sold, tickets_available").eq("id", parsed.eventId).single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({
      tickets_sold: parsed.ticketsSold,
      tickets_available: parsed.ticketsAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "update_tickets", old, { tickets_sold: parsed.ticketsSold, tickets_available: parsed.ticketsAvailable });
  revalidatePath("/admin/events");
}
```

**Step: Commit**
```
feat: add event server actions
```

---

## Task 5: Client server actions

**Files:**
- Create: `src/app/admin/actions/clients.ts`

```typescript
// src/app/admin/actions/clients.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";

const RenameClientSchema = z.object({
  oldSlug: z.string().min(1),
  newSlug: z.string().min(1).regex(/^[a-z0-9_]+$/),
});

export async function renameClient(formData: { oldSlug: string; newSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = RenameClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  if (parsed.oldSlug === parsed.newSlug) return;

  const { error: e1 } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ client_slug: parsed.newSlug, updated_at: new Date().toISOString() })
    .eq("client_slug", parsed.oldSlug);
  if (e1) throw new Error(e1.message);

  const { error: e2 } = await supabaseAdmin
    .from("tm_events")
    .update({ client_slug: parsed.newSlug, updated_at: new Date().toISOString() })
    .eq("client_slug", parsed.oldSlug);
  if (e2) throw new Error(e2.message);

  await logAudit("client", parsed.oldSlug, "rename", { slug: parsed.oldSlug }, { slug: parsed.newSlug });
  revalidatePath("/admin/clients");
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/events");
}

const DeactivateClientSchema = z.object({
  slug: z.string().min(1),
});

export async function deactivateClient(formData: { slug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = DeactivateClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ status: "PAUSED", updated_at: new Date().toISOString() })
    .eq("client_slug", parsed.slug)
    .eq("status", "ACTIVE");

  if (error) throw new Error(error.message);

  await logAudit("client", parsed.slug, "deactivate", null, { paused_all_campaigns: true });
  revalidatePath("/admin/clients");
  revalidatePath("/admin/campaigns");
}
```

**Step: Commit**
```
feat: add client server actions (rename, deactivate)
```

---

## Task 6: User server actions

**Files:**
- Create: `src/app/admin/actions/users.ts`

```typescript
// src/app/admin/actions/users.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { clerkClient } from "@clerk/nextjs/server";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";

const ChangeRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "client"]),
});

export async function changeUserRole(formData: { userId: string; role: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = ChangeRoleSchema.parse(formData);
  const client = await clerkClient();
  const user = await client.users.getUser(parsed.userId);
  const oldRole = (user.publicMetadata as Record<string, unknown>)?.role ?? "client";

  await client.users.updateUserMetadata(parsed.userId, {
    publicMetadata: { ...user.publicMetadata, role: parsed.role === "client" ? undefined : parsed.role },
  });

  await logAudit("user", parsed.userId, "change_role", { role: oldRole }, { role: parsed.role });
  revalidatePath("/admin/users");
}

const DeleteUserSchema = z.object({
  userId: z.string().min(1),
});

export async function deleteUser(formData: { userId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = DeleteUserSchema.parse(formData);
  const client = await clerkClient();
  const user = await client.users.getUser(parsed.userId);

  await client.users.deleteUser(parsed.userId);

  await logAudit("user", parsed.userId, "delete", { email: user.emailAddresses[0]?.emailAddress }, null);
  revalidatePath("/admin/users");
}
```

**Step: Commit**
```
feat: add user server actions (change role, delete)
```

---

## Task 7: Campaign table with inline editing

**Files:**
- Create: `src/components/admin/campaigns/campaign-table.tsx`
- Modify: `src/app/admin/campaigns/page.tsx` -- replace static table with CampaignTable component

The campaign table component wraps the existing table markup but adds:
- StatusSelect on the Status column (ACTIVE/PAUSED toggle)
- InlineEdit on the budget column (daily budget in dollars, saved as cents)
- Client slug dropdown on the client name
- "Sync to Meta" button per row with ConfirmDialog
- Toast feedback on success/error

The server component page.tsx passes campaigns + snapshots as props to the client component CampaignTable.

**Step: Commit**
```
feat: add interactive campaign table with inline editing
```

---

## Task 8: Event table with inline editing

**Files:**
- Create: `src/components/admin/events/event-table.tsx`
- Modify: `src/app/admin/events/page.tsx` -- replace static table with EventTable component

Event table adds:
- StatusSelect on Status column (onsale, offsale, cancelled, etc.)
- Client slug dropdown on the Client column
- InlineEdit on tickets_sold and tickets_available
- Toast feedback

**Step: Commit**
```
feat: add interactive event table with inline editing
```

---

## Task 9: Client table with inline editing

**Files:**
- Create: `src/components/admin/clients/client-table.tsx`
- Modify: `src/app/admin/clients/page.tsx` -- replace static table with ClientTable component

Client table adds:
- InlineEdit on the slug (rename)
- "Deactivate" button with ConfirmDialog (pauses all campaigns for that client)
- Toast feedback

**Step: Commit**
```
feat: add interactive client table with inline editing
```

---

## Task 10: User table enhancements

**Files:**
- Modify: `src/components/admin/users/user-table.tsx` -- add role change dropdown + delete button

User table changes:
- Replace static role badge with StatusSelect (admin/client)
- Add delete button with ConfirmDialog per row
- Wire to new server actions
- Toast feedback

**Step: Commit**
```
feat: add role change and delete to user table
```

---

## Task 11: Verification

**Step 1:** `npx tsc --noEmit` -- must pass with 0 errors
**Step 2:** `npx next build` -- must succeed
**Step 3:** Manual checks:
- Campaign row: change status, edit budget, assign client, sync to Meta
- Event row: change status, assign client, edit ticket counts
- Client row: rename slug, deactivate client
- User row: change role, delete user
- Check `admin_audit_log` table has entries for each action

---

## Agent Assignment (parallel, no file overlap)

### Agent A: Foundation (Tasks 1-2)
Owns: `src/app/admin/actions/audit.ts`, `src/components/admin/confirm-dialog.tsx`, `src/components/admin/inline-edit.tsx`, `src/components/admin/status-select.tsx`

### Agent B: Server Actions (Tasks 3-6)
Owns: `src/app/admin/actions/campaigns.ts`, `src/app/admin/actions/meta-sync.ts`, `src/app/admin/actions/events.ts`, `src/app/admin/actions/clients.ts`, `src/app/admin/actions/users.ts`
Depends on: Task 1 (audit.ts)

### Agent C: Campaign + Event Tables (Tasks 7-8)
Owns: `src/components/admin/campaigns/campaign-table.tsx`, `src/app/admin/campaigns/page.tsx`, `src/components/admin/events/event-table.tsx`, `src/app/admin/events/page.tsx`
Depends on: Tasks 2-4

### Agent D: Client + User Tables (Tasks 9-10)
Owns: `src/components/admin/clients/client-table.tsx`, `src/app/admin/clients/page.tsx`, `src/components/admin/users/user-table.tsx`
Depends on: Tasks 2, 5-6

Execution order: A -> B -> (C + D in parallel) -> verify
