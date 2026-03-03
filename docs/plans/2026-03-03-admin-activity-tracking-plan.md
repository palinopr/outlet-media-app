# Admin Activity Tracking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Track admin page views, actions, errors, and sessions in a single Supabase table with a filterable viewer page at `/admin/activity`.

**Architecture:** Client-side `<ActivityTracker>` component reports page views via API endpoint. Server actions log actions and errors. Admin error boundary captures React crashes. All events go to one `admin_activity` table. A new admin page shows the feed with filters.

**Tech Stack:** Next.js 15 App Router, Supabase (postgres), Clerk auth, TanStack Table, shadcn/ui, Tailwind v4, Zod

---

### Task 1: Create the `admin_activity` Supabase table

**Files:**
- Modify: Supabase dashboard (run SQL)

**Step 1: Run the migration SQL in Supabase**

Go to Supabase SQL Editor and run:

```sql
create table admin_activity (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  user_id     text not null,
  user_email  text not null,
  event_type  text not null,
  page        text,
  detail      text,
  metadata    jsonb default '{}'::jsonb
);

create index idx_admin_activity_user on admin_activity(user_id);
create index idx_admin_activity_type on admin_activity(event_type);
create index idx_admin_activity_created on admin_activity(created_at desc);
```

**Step 2: Verify table exists**

Run: `select count(*) from admin_activity;` -- should return 0.

---

### Task 2: Add `admin_activity` type to `database.types.ts`

**Files:**
- Modify: `src/lib/database.types.ts`

**Step 1: Add the table type definition**

Add inside `Tables` (alphabetical order, before `agent_alerts`):

```typescript
admin_activity: {
  Row: {
    id: number
    created_at: string
    user_id: string
    user_email: string
    event_type: string
    page: string | null
    detail: string | null
    metadata: Json | null
  }
  Insert: {
    id?: number
    created_at?: string
    user_id: string
    user_email: string
    event_type: string
    page?: string | null
    detail?: string | null
    metadata?: Json | null
  }
  Update: {
    id?: number
    created_at?: string
    user_id?: string
    user_email?: string
    event_type?: string
    page?: string | null
    detail?: string | null
    metadata?: Json | null
  }
  Relationships: []
}
```

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors related to admin_activity

**Step 3: Commit**

```bash
git add src/lib/database.types.ts
git commit -m "feat: add admin_activity table type definition"
```

---

### Task 3: Create the `logActivity()` server action

**Files:**
- Modify: `src/app/admin/actions/audit.ts`

**Step 1: Replace `logAudit` with `logActivity` and keep `logAudit` as a wrapper**

Replace the contents of `src/app/admin/actions/audit.ts` with:

```typescript
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export type ActivityEventType = "page_view" | "action" | "error" | "session_start";

export async function logActivity(
  eventType: ActivityEventType,
  detail: string,
  page?: string | null,
  metadata?: Record<string, unknown>,
) {
  const user = await currentUser();
  if (!user || !supabaseAdmin) return;

  await supabaseAdmin.from("admin_activity").insert({
    user_id: user.id,
    user_email: user.emailAddresses[0]?.emailAddress ?? "unknown",
    event_type: eventType,
    page: page ?? null,
    detail,
    metadata: metadata ?? {},
  });
}

/** Backward-compatible wrapper. Writes to admin_activity with event_type='action'. */
export async function logAudit(
  entityType: string,
  entityId: string,
  action: string,
  oldValue: unknown,
  newValue: unknown,
) {
  await logActivity("action", action, null, {
    entity_type: entityType,
    entity_id: entityId,
    old_value: oldValue,
    new_value: newValue,
  });
}
```

**Step 2: Verify existing imports still work**

Run: `npx tsc --noEmit`
Expected: no errors -- all existing `logAudit` call sites still work.

**Step 3: Commit**

```bash
git add src/app/admin/actions/audit.ts
git commit -m "feat: add logActivity server action, keep logAudit wrapper"
```

---

### Task 4: Create the API endpoint `POST /api/admin/activity`

**Files:**
- Create: `src/app/api/admin/activity/route.ts`

**Step 1: Create the route file**

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard, parseJsonBody } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

const ActivitySchema = z.object({
  event_type: z.enum(["page_view", "error", "session_start"]),
  page: z.string().nullable().optional(),
  detail: z.string(),
  metadata: z.record(z.unknown()).optional(),
  user_id: z.string(),
  user_email: z.string(),
});

export async function POST(request: Request) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = ActivitySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { error } = await supabaseAdmin.from("admin_activity").insert({
    user_id: parsed.data.user_id,
    user_email: parsed.data.user_email,
    event_type: parsed.data.event_type,
    page: parsed.data.page ?? null,
    detail: parsed.data.detail,
    metadata: parsed.data.metadata ?? {},
  });

  if (error) {
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

**Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/app/api/admin/activity/route.ts
git commit -m "feat: add POST /api/admin/activity endpoint"
```

---

### Task 5: Create the `<ActivityTracker>` client component

**Files:**
- Create: `src/components/admin/activity-tracker.tsx`

**Step 1: Create the tracker component**

This component mounts in the admin layout, watches pathname changes, and POSTs page views to the API. Also logs `session_start` on first mount and captures `window.onerror` / `unhandledrejection` for error tracking.

```typescript
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface Props {
  userId: string;
  userEmail: string;
}

const PAGE_LABELS: Record<string, string> = {
  "/admin/dashboard": "Viewed Dashboard",
  "/admin/campaigns": "Viewed Campaigns",
  "/admin/events": "Viewed Events",
  "/admin/agents": "Viewed Agents",
  "/admin/clients": "Viewed Clients",
  "/admin/users": "Viewed Users",
  "/admin/settings": "Viewed Settings",
  "/admin/activity": "Viewed Activity",
};

function getPageLabel(pathname: string): string {
  return PAGE_LABELS[pathname] ?? `Viewed ${pathname}`;
}

async function postActivity(
  userId: string,
  userEmail: string,
  eventType: "page_view" | "error" | "session_start",
  detail: string,
  page?: string | null,
  metadata?: Record<string, unknown>,
) {
  try {
    await fetch("/api/admin/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        user_email: userEmail,
        event_type: eventType,
        page: page ?? null,
        detail,
        metadata: metadata ?? {},
      }),
    });
  } catch {
    // Silent fail -- activity tracking should never break the app
  }
}

export function ActivityTracker({ userId, userEmail }: Props) {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");
  const sessionLoggedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Log session start on first mount
  useEffect(() => {
    if (sessionLoggedRef.current) return;
    sessionLoggedRef.current = true;
    postActivity(userId, userEmail, "session_start", "Logged in", null, {
      user_agent: navigator.userAgent,
    });
  }, [userId, userEmail]);

  // Log page views on pathname change (debounced)
  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      postActivity(userId, userEmail, "page_view", getPageLabel(pathname), pathname);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname, userId, userEmail]);

  // Capture uncaught JS errors
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      postActivity(userId, userEmail, "error", event.message, pathname, {
        error_message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const msg = event.reason instanceof Error ? event.reason.message : String(event.reason);
      postActivity(userId, userEmail, "error", msg, pathname, {
        error_message: msg,
        stack: event.reason instanceof Error ? event.reason.stack : undefined,
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [userId, userEmail, pathname]);

  return null;
}
```

**Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/admin/activity-tracker.tsx
git commit -m "feat: add ActivityTracker client component for page views, errors, sessions"
```

---

### Task 6: Wire `<ActivityTracker>` into admin layout

**Files:**
- Modify: `src/app/admin/layout.tsx`

**Step 1: Add ActivityTracker to the layout**

Import at top:
```typescript
import { ActivityTracker } from "@/components/admin/activity-tracker";
```

Pass the userId and email down. After the `if (user)` block that sets `displayName`, also capture:
```typescript
let userId = "";
let userEmail = "";
```

Inside the `if (clerkEnabled)` block, after getting the user:
```typescript
userId = user?.id ?? "";
userEmail = user?.emailAddresses[0]?.emailAddress ?? "";
```

Then in the JSX, add `<ActivityTracker>` as first child inside the root `<div>`:
```tsx
<div className="dark flex min-h-screen bg-background text-foreground">
  {userId && <ActivityTracker userId={userId} userEmail={userEmail} />}
  {/* Sidebar */}
  ...
```

**Step 2: Verify compilation and dev server**

Run: `npx tsc --noEmit`
Run: `npm run dev` -- navigate between admin pages, check browser Network tab for POSTs to `/api/admin/activity`.

**Step 3: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "feat: wire ActivityTracker into admin layout"
```

---

### Task 7: Add admin error boundary that logs errors

**Files:**
- Modify: `src/components/admin/error-boundary.tsx`

**Step 1: Update the error boundary to POST errors to the activity API**

The existing error boundary at `src/components/admin/error-boundary.tsx` only does `console.error`. Update the `useEffect` to also post the error to the activity endpoint. Since this is a client component with no access to Clerk directly, read user info from a data attribute or just log without user context (the API will get it from the auth guard).

Actually, the error boundary can't easily get user info. The `ActivityTracker` component already captures `window.onerror` and `unhandledrejection`, which covers most JS errors. The React error boundary handles render errors specifically.

Update `src/components/admin/error-boundary.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        An unexpected error occurred. The error has been logged. Please try again.
      </p>
      {error.message && (
        <p className="text-xs text-red-400/70 font-mono max-w-lg text-center truncate">
          {error.message}
        </p>
      )}
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
```

Note: React error boundaries for render errors will be caught by `ActivityTracker`'s `window.onerror` handler if they propagate. For errors that don't propagate to window (caught by React internally), the error boundary UI is the user's signal. The error.digest is logged server-side by Next.js already.

**Step 2: Commit**

```bash
git add src/components/admin/error-boundary.tsx
git commit -m "feat: improve error boundary UI with error message display"
```

---

### Task 8: Create the activity data fetcher

**Files:**
- Create: `src/app/admin/activity/data.ts`

**Step 1: Create the data file**

```typescript
import { supabaseAdmin } from "@/lib/supabase";

export interface ActivityRow {
  id: number;
  created_at: string;
  user_id: string;
  user_email: string;
  event_type: string;
  page: string | null;
  detail: string | null;
  metadata: Record<string, unknown> | null;
}

export interface ActivityStats {
  totalToday: number;
  activeUsersToday: number;
  errorsToday: number;
  mostActivePage: string | null;
}

export interface ActivityData {
  rows: ActivityRow[];
  stats: ActivityStats;
  users: string[];
  fromDb: boolean;
}

export async function getActivity(filters: {
  user?: string | null;
  eventType?: string | null;
  range?: string | null;
}): Promise<ActivityData> {
  const empty: ActivityData = {
    rows: [],
    stats: { totalToday: 0, activeUsersToday: 0, errorsToday: 0, mostActivePage: null },
    users: [],
    fromDb: false,
  };

  if (!supabaseAdmin) return empty;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  // Determine date filter
  let sinceIso: string | null = null;
  switch (filters.range) {
    case "today":
      sinceIso = todayIso;
      break;
    case "7d":
      sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString();
      break;
    case "30d":
      sinceIso = new Date(Date.now() - 30 * 86_400_000).toISOString();
      break;
    default:
      sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString();
  }

  // Build main query
  let query = supabaseAdmin
    .from("admin_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (sinceIso) query = query.gte("created_at", sinceIso);
  if (filters.user) query = query.eq("user_email", filters.user);
  if (filters.eventType) query = query.eq("event_type", filters.eventType);

  // Fetch today's data for stats (always unfiltered by user/type)
  const [{ data: rows, error }, { data: todayRows }] = await Promise.all([
    query,
    supabaseAdmin
      .from("admin_activity")
      .select("user_email, event_type, page")
      .gte("created_at", todayIso),
  ]);

  if (error) return empty;

  // Compute stats from today's rows
  const todayData = todayRows ?? [];
  const uniqueUsers = new Set(todayData.map((r) => r.user_email));
  const errorsToday = todayData.filter((r) => r.event_type === "error").length;

  // Most active page
  const pageCounts: Record<string, number> = {};
  for (const r of todayData) {
    if (r.page) pageCounts[r.page] = (pageCounts[r.page] ?? 0) + 1;
  }
  const mostActivePage =
    Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Distinct user emails for the filter dropdown
  const allUsersRes = await supabaseAdmin
    .from("admin_activity")
    .select("user_email")
    .limit(1000);
  const users = [...new Set((allUsersRes.data ?? []).map((r) => r.user_email))].sort();

  return {
    rows: (rows ?? []) as ActivityRow[],
    stats: {
      totalToday: todayData.length,
      activeUsersToday: uniqueUsers.size,
      errorsToday,
      mostActivePage,
    },
    users,
    fromDb: true,
  };
}
```

**Step 2: Verify compilation**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/admin/activity/data.ts
git commit -m "feat: add activity data fetcher with stats and filters"
```

---

### Task 9: Create the activity filter component

**Files:**
- Create: `src/components/admin/activity/activity-filters.tsx`

**Step 1: Create the filter component**

```typescript
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  users: string[];
  selectedUser: string;
  selectedType: string;
  selectedRange: string;
}

const EVENT_TYPES = [
  { value: "all", label: "All types" },
  { value: "page_view", label: "Page views" },
  { value: "action", label: "Actions" },
  { value: "error", label: "Errors" },
  { value: "session_start", label: "Sessions" },
];

const DATE_RANGES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function ActivityFilters({ users, selectedUser, selectedType, selectedRange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectClass =
    "text-xs bg-background border border-border/60 rounded px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={selectedUser}
        onChange={(e) => setParam("user", e.target.value)}
        className={selectClass}
      >
        <option value="all">All users</option>
        {users.map((email) => (
          <option key={email} value={email}>
            {email}
          </option>
        ))}
      </select>

      <select
        value={selectedType}
        onChange={(e) => setParam("type", e.target.value)}
        className={selectClass}
      >
        {EVENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        value={selectedRange}
        onChange={(e) => setParam("range", e.target.value)}
        className={selectClass}
      >
        {DATE_RANGES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/admin/activity/activity-filters.tsx
git commit -m "feat: add activity filters component"
```

---

### Task 10: Create the activity table component

**Files:**
- Create: `src/components/admin/activity/activity-table.tsx`

**Step 1: Create the table component**

```typescript
"use client";

import { useState } from "react";
import type { ActivityRow } from "@/app/admin/activity/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TYPE_STYLES: Record<string, { label: string; classes: string }> = {
  page_view: { label: "Page View", classes: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  action: { label: "Action", classes: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  error: { label: "Error", classes: "text-red-400 bg-red-500/10 border-red-500/20" },
  session_start: { label: "Session", classes: "text-white/60 bg-white/[0.06] border-white/10" },
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function ActivityTable({ rows }: { rows: ActivityRow[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No activity found for the selected filters.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Time</TableHead>
          <TableHead className="w-[200px]">User</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead className="w-[160px]">Page</TableHead>
          <TableHead>Detail</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const style = TYPE_STYLES[row.event_type] ?? TYPE_STYLES.page_view;
          const isExpanded = expandedId === row.id;
          const hasMetadata = row.metadata && Object.keys(row.metadata).length > 0;

          return (
            <>
              <TableRow
                key={row.id}
                className={hasMetadata ? "cursor-pointer hover:bg-white/[0.02]" : ""}
                onClick={() => hasMetadata && setExpandedId(isExpanded ? null : row.id)}
              >
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {formatTime(row.created_at)}
                </TableCell>
                <TableCell className="text-xs truncate max-w-[200px]">
                  {row.user_email}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${style.classes}`}
                  >
                    {style.label}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {row.page ?? "--"}
                </TableCell>
                <TableCell className="text-xs">
                  {row.detail ?? "--"}
                </TableCell>
              </TableRow>
              {isExpanded && hasMetadata && (
                <TableRow key={`${row.id}-meta`}>
                  <TableCell colSpan={5} className="bg-white/[0.02] px-6 py-3">
                    <pre className="text-[11px] text-muted-foreground font-mono whitespace-pre-wrap break-all">
                      {JSON.stringify(row.metadata, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/admin/activity/activity-table.tsx
git commit -m "feat: add activity table component with expandable metadata rows"
```

---

### Task 11: Create the `/admin/activity` page

**Files:**
- Create: `src/app/admin/activity/page.tsx`
- Create: `src/app/admin/activity/error.tsx`

**Step 1: Create the error boundary**

```typescript
"use client";
export { default } from "@/components/admin/error-boundary";
```

**Step 2: Create the page**

```typescript
import { Suspense } from "react";
import { Activity, Users, AlertTriangle, Eye } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card } from "@/components/ui/card";
import { getActivity } from "./data";
import { ActivityFilters } from "@/components/admin/activity/activity-filters";
import { ActivityTable } from "@/components/admin/activity/activity-table";

interface Props {
  searchParams: Promise<{ user?: string; type?: string; range?: string }>;
}

export default async function ActivityPage({ searchParams }: Props) {
  const { user, type, range } = await searchParams;

  const selectedUser = user ?? "all";
  const selectedType = type ?? "all";
  const selectedRange = range ?? "7d";

  const { rows, stats, users, fromDb } = await getActivity({
    user: selectedUser !== "all" ? selectedUser : null,
    eventType: selectedType !== "all" ? selectedType : null,
    range: selectedRange,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Admin user activity, actions, and errors
          </p>
        </div>
        {fromDb ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live from Supabase
          </span>
        ) : (
          <span className="text-xs text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded">
            No data
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Events Today"
          value={String(stats.totalToday)}
          icon={Activity}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Active Users"
          value={String(stats.activeUsersToday)}
          icon={Users}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-400"
        />
        <StatCard
          label="Errors Today"
          value={String(stats.errorsToday)}
          icon={AlertTriangle}
          accent={stats.errorsToday > 0 ? "from-red-500/20 to-red-600/20" : "from-white/[0.02] to-transparent"}
          iconColor={stats.errorsToday > 0 ? "text-red-400" : "text-muted-foreground"}
        />
        <StatCard
          label="Most Active Page"
          value={stats.mostActivePage?.replace("/admin/", "") ?? "--"}
          icon={Eye}
          accent="from-amber-500/20 to-orange-500/20"
          iconColor="text-amber-400"
        />
      </div>

      {/* Feed */}
      <Card className="border-border/60">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="text-sm font-semibold">
            Activity feed
            <span className="text-muted-foreground font-normal ml-1.5">({rows.length})</span>
          </p>
          <Suspense>
            <ActivityFilters
              users={users}
              selectedUser={selectedUser}
              selectedType={selectedType}
              selectedRange={selectedRange}
            />
          </Suspense>
        </div>
        <ActivityTable rows={rows} />
      </Card>
    </div>
  );
}
```

**Step 3: Verify compilation and dev server**

Run: `npx tsc --noEmit`
Run: `npm run dev` -- navigate to `/admin/activity`, verify page renders.

**Step 4: Commit**

```bash
git add src/app/admin/activity/
git commit -m "feat: add /admin/activity page with stats and filterable feed"
```

---

### Task 12: Add Activity to the admin sidebar nav

**Files:**
- Modify: `src/components/admin/nav-links.tsx`

**Step 1: Add the Activity nav entry**

Import `Activity` from lucide-react:
```typescript
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  Bot,
  Users,
  UserCog,
  Settings,
  Activity,
} from "lucide-react";
```

Add to the `nav` array, between Users and Settings:
```typescript
{ href: "/admin/activity", label: "Activity", icon: Activity },
```

**Step 2: Verify it renders**

Run: `npm run dev` -- check the sidebar shows Activity link between Users and Settings.

**Step 3: Commit**

```bash
git add src/components/admin/nav-links.tsx
git commit -m "feat: add Activity link to admin sidebar nav"
```

---

### Task 13: End-to-end verification

**Step 1: Start the dev server**

Run: `npm run dev`

**Step 2: Verify page view tracking**

1. Navigate to `/admin/dashboard`
2. Navigate to `/admin/campaigns`
3. Navigate to `/admin/activity`
4. Check the activity feed -- should show page_view entries for each navigation
5. Check the session_start entry from your initial page load

**Step 3: Verify action tracking**

1. Go to `/admin/campaigns`, change a campaign status
2. Go back to `/admin/activity` -- should show an action entry with old/new values in metadata

**Step 4: Verify filters**

1. Filter by event type "Page views" -- only page_view rows shown
2. Filter by "Today" -- only today's events
3. Filter by user email -- only that user's events
4. Click a row with metadata -- should expand to show JSON

**Step 5: Verify stats**

1. Stats cards should reflect today's data
2. "Errors Today" should be 0 (green/gray)
3. "Most Active Page" should show the page you visited most

**Step 6: Verify no regressions**

Run: `npx tsc --noEmit`
Run: `npm run build`

**Step 7: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: activity tracking cleanup"
```
