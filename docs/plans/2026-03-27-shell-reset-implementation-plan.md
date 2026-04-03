# Outlet Shell Reset Implementation Plan

> **Historical note (2026-04-02):** This plan captured an earlier shell-reset target. Several details have since narrowed further in the live repo: `/admin/activity` is no longer a shipped top-level surface, retired route shells were collapsed into smaller catch-all redirects, and the client package now includes Reports plus optional Agent according to `docs/context/`.

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the existing Outlet web shell to the approved admin and client surfaces, remove the wrong top-level product areas from shipped routes and navigation, and leave the app clean and test-stable before any new `Updates` or Codex feature work begins.

**Architecture:** This is a same-repo shell reset, not a greenfield rebuild. Phase 1 contracts the admin and client route trees, redirects removed surfaces, and trims dashboard/UI dependencies so the kept shell is the only shipped product promise. Feature pruning happens only after imports from kept surfaces are gone, and verification is used to prove the reduced shell is stable enough to build on.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Clerk, Vitest, Testing Library

---

## File Structure

### Shell wiring

- Modify: `src/components/admin/nav-config.ts`
  - Source of truth for admin top-level navigation and command-palette/admin-sidebar consumers.
- Modify: `src/components/admin/activity-tracker.tsx`
  - Keeps page-view labels aligned with the surviving admin shell.
- Modify: `src/app/admin/layout.tsx`
  - Keep shell stable while route set changes; verify no removed-surface assumptions remain.
- Modify: `src/app/client/[slug]/components/nav-config.ts`
  - Source of truth for client navigation links.
- Modify: `src/app/client/[slug]/components/client-nav.tsx`
  - Desktop client nav should stop accepting removed-surface options.
- Modify: `src/app/client/[slug]/components/mobile-nav.tsx`
  - Mobile client nav should match desktop shell.
- Modify: `src/app/client/[slug]/layout.tsx`
  - Remove reports-nav plumbing and keep only phase-1 client shell wiring.
- Modify: `src/app/client/[slug]/page.tsx`
  - Collapse the old overview surface by redirecting to `campaigns`.

### Removed/redirected routes

- Modify: `src/app/admin/assets/page.tsx`
- Modify: `src/app/admin/assets/[assetId]/page.tsx`
- Modify: `src/app/admin/reports/page.tsx`
- Modify: `src/app/admin/crm/page.tsx`
- Modify: `src/app/admin/crm/[contactId]/page.tsx`
- Modify: `src/app/admin/workspace/page.tsx`
- Modify: `src/app/admin/workspace/[pageId]/page.tsx`
- Modify: `src/app/admin/workspace/tasks/page.tsx`
- Modify: `src/app/admin/approvals/page.tsx`
- Modify: `src/app/admin/conversations/page.tsx`
- Modify: `src/app/admin/notifications/page.tsx`
  - All of these become explicit phase-1 redirects matching the approved matrix.
- Modify: `src/app/client/[slug]/reports/page.tsx`
  - Redirect to `campaigns` instead of rendering reports.

### Dashboard cleanup

- Modify: `src/app/admin/dashboard/page.tsx`
  - Remove `Creative snapshot` and any imports tied only to removed dashboard clutter.
- Delete: `src/components/dashboard/dashboard-assets-section.tsx`
  - Safe to delete once `AdminDashboard` no longer imports it and no kept route references remain.

### Tests

- Create: `src/components/admin/nav-config.test.ts`
  - Verifies admin shell labels/hrefs match the approved shell and excludes removed surfaces.
- Create: `src/components/admin/activity-tracker.test.ts`
  - Verifies surviving admin routes still produce the correct activity labels.
- Create: `src/app/admin/shell-redirects.test.tsx`
  - Verifies removed admin routes all redirect to the approved destinations.
- Create: `src/app/admin/dashboard/page.test.tsx`
  - Verifies the dashboard no longer renders the creative snapshot block.
- Create: `src/app/admin/campaigns/page.test.tsx`
  - Verifies the campaigns empty state uses the thin agent-entry copy.
- Create: `src/app/admin/events/page.test.tsx`
  - Verifies the events header keeps only the thin agent-entry link copy.
- Create: `src/app/shell-import-smoke.test.ts`
  - Verifies kept top-level pages and their shared data modules still import after shell contraction.
- Modify: `src/app/client/[slug]/layout.test.tsx`
  - Update client shell expectations to `Campaigns` + optional `Events` only.
- Create: `src/app/client/[slug]/page.test.tsx`
  - Verifies `/client/[slug]` redirects to `/client/[slug]/campaigns`.
- Modify: `src/app/client/[slug]/reports/page.test.tsx`
  - Convert reports rendering coverage into redirect coverage.
- Modify: `src/app/admin/reports/page.test.tsx`
  - Convert reports rendering coverage into redirect coverage.

### Safe-pruning follow-through

- Modify: `docs/superpowers/specs/2026-03-27-shell-reset-design.md`
  - Extend the redirect matrix if implementation discovers additional legacy routes.

## Chunk 1: Contract Admin And Client Shells

### Task 1: Lock the admin nav to the approved shell

**Files:**
- Create: `src/components/admin/nav-config.test.ts`
- Modify: `src/components/admin/nav-config.ts`

- [ ] **Step 1: Write the failing nav-config test**

```ts
import { describe, expect, it } from "vitest";
import { adminNavItems } from "./nav-config";

describe("adminNavItems", () => {
  it("matches the approved admin shell", () => {
    expect(adminNavItems.map((item) => [item.label, item.href])).toEqual([
      ["Dashboard", "/admin/dashboard"],
      ["Campaigns", "/admin/campaigns"],
      ["Events", "/admin/events"],
      ["Clients", "/admin/clients"],
      ["Users", "/admin/users"],
      ["Settings", "/admin/settings"],
      ["Activity", "/admin/activity"],
      ["Agents", "/admin/agents"],
    ]);
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run: `npm run test -- src/components/admin/nav-config.test.ts`
Expected: FAIL because `Reports` is still present and `Settings`/`Agents` are missing.

- [ ] **Step 3: Update the admin nav config**

```ts
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  Users,
  UserCog,
  Settings,
  Activity,
  Bot,
} from "lucide-react";

export const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/agents", label: "Agents", icon: Bot },
];
```

- [ ] **Step 4: Re-run the nav-config test**

Run: `npm run test -- src/components/admin/nav-config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the nav change**

```bash
git add src/components/admin/nav-config.ts src/components/admin/nav-config.test.ts
git commit -m "refactor: lock admin shell navigation"
```

### Task 2: Keep admin activity labels aligned with the new shell

**Files:**
- Modify: `src/components/admin/activity-tracker.tsx`
- Create: `src/components/admin/activity-tracker.test.ts`

- [ ] **Step 1: Write the failing activity-tracker test**

```ts
import { describe, expect, it } from "vitest";
import { getPageLabel } from "./activity-tracker";

describe("getPageLabel", () => {
  it("maps surviving admin routes to stable labels", () => {
    expect(getPageLabel("/admin/dashboard")).toBe("Viewed Dashboard");
    expect(getPageLabel("/admin/clients")).toBe("Viewed Clients");
    expect(getPageLabel("/admin/settings")).toBe("Viewed Settings");
    expect(getPageLabel("/admin/agents")).toBe("Viewed Agents");
    expect(getPageLabel("/admin/activity")).toBe("Viewed Activity");
  });
});
```

- [ ] **Step 2: Run the test file to keep the task scoped**

Run: `npm run test -- src/components/admin/activity-tracker.test.ts`
Expected: FAIL because `getPageLabel` is not exported yet.

- [ ] **Step 3: Export the helper and remove obsolete tracked route labels**

```ts
export function getPageLabel(pathname: string): string {
  return PAGE_LABELS[pathname] ?? `Viewed ${pathname}`;
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
```

- [ ] **Step 4: Re-run the same test file**

Run: `npm run test -- src/components/admin/activity-tracker.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the activity-tracker cleanup**

```bash
git add src/components/admin/activity-tracker.tsx src/components/admin/activity-tracker.test.ts
git commit -m "refactor: align admin activity labels with shell"
```

### Task 3: Turn removed admin surfaces into explicit redirects

**Files:**
- Create: `src/app/admin/shell-redirects.test.tsx`
- Modify: `src/app/admin/assets/page.tsx`
- Modify: `src/app/admin/assets/[assetId]/page.tsx`
- Modify: `src/app/admin/reports/page.tsx`
- Modify: `src/app/admin/crm/page.tsx`
- Modify: `src/app/admin/crm/[contactId]/page.tsx`
- Modify: `src/app/admin/workspace/page.tsx`
- Modify: `src/app/admin/workspace/[pageId]/page.tsx`
- Modify: `src/app/admin/workspace/tasks/page.tsx`
- Modify: `src/app/admin/approvals/page.tsx`
- Modify: `src/app/admin/conversations/page.tsx`
- Modify: `src/app/admin/notifications/page.tsx`
- Modify: `src/app/admin/reports/page.test.tsx`

- [ ] **Step 1: Write the failing redirect coverage**

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { redirect } from "next/navigation";

describe("admin shell redirects", () => {
  it("redirects removed surfaces to approved destinations", async () => {
      const pages = [
        ["./assets/page", "/admin/campaigns"],
        ["./assets/[assetId]/page", "/admin/campaigns"],
        ["./reports/page", "/admin/dashboard"],
        ["./crm/page", "/admin/clients"],
        ["./crm/[contactId]/page", "/admin/clients"],
        ["./workspace/page", "/admin/dashboard"],
        ["./workspace/[pageId]/page", "/admin/dashboard"],
        ["./workspace/tasks/page", "/admin/dashboard"],
        ["./approvals/page", "/admin/dashboard"],
        ["./conversations/page", "/admin/dashboard"],
        ["./notifications/page", "/admin/dashboard"],
    ] as const;

    for (const [path, target] of pages) {
      vi.mocked(redirect).mockClear();
      const mod = await import(path);
      await mod.default();
      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith(target);
    }
  });
});
```

- [ ] **Step 2: Run the redirect test and the existing reports page test**

Run: `npm run test -- src/app/admin/shell-redirects.test.tsx src/app/admin/reports/page.test.tsx`
Expected: FAIL because `assets` and `reports` still render real UI.

- [ ] **Step 3: Replace removed admin pages with redirects that match the matrix**

```ts
import { redirect } from "next/navigation";

export default function AdminAssetsPage() {
  redirect("/admin/campaigns");
}
```

```ts
import { redirect } from "next/navigation";

export default function AdminReportsPage() {
  redirect("/admin/dashboard");
}
```

- [ ] **Step 4: Rewrite the reports page test to assert redirect behavior**

```ts
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

it("redirects reports to the dashboard in phase 1", async () => {
  const { default: AdminReportsPage } = await import("./page");
  await AdminReportsPage();
  expect(redirect).toHaveBeenCalledWith("/admin/dashboard");
});
```

- [ ] **Step 5: Re-run the redirect tests**

Run: `npm run test -- src/app/admin/shell-redirects.test.tsx src/app/admin/reports/page.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit the admin route redirects**

```bash
git add src/app/admin/assets/page.tsx src/app/admin/assets/[assetId]/page.tsx src/app/admin/reports/page.tsx src/app/admin/crm/page.tsx src/app/admin/crm/[contactId]/page.tsx src/app/admin/workspace/page.tsx src/app/admin/workspace/[pageId]/page.tsx src/app/admin/workspace/tasks/page.tsx src/app/admin/approvals/page.tsx src/app/admin/conversations/page.tsx src/app/admin/notifications/page.tsx src/app/admin/reports/page.test.tsx src/app/admin/shell-redirects.test.tsx
git commit -m "refactor: redirect removed admin shell routes"
```

### Task 4: Collapse the client shell to campaigns plus optional events

**Files:**
- Modify: `src/app/client/[slug]/components/nav-config.ts`
- Modify: `src/app/client/[slug]/components/client-nav.tsx`
- Modify: `src/app/client/[slug]/components/mobile-nav.tsx`
- Modify: `src/app/client/[slug]/layout.tsx`
- Modify: `src/app/client/[slug]/layout.test.tsx`

- [ ] **Step 1: Replace the old `Overview`/`Reports` expectations in the client layout test**

```ts
it("does not render Overview links in desktop or mobile nav in phase 1", async () => {
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
  await renderLayout("acme");
  openMobileNav();
  expect(screen.queryByRole("link", { name: "Overview" })).not.toBeInTheDocument();
});

it("does not render Reports links even when reports are enabled", async () => {
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
  mockedGetClientPortalConfig.mockResolvedValue({
    clientId: "client_1",
    eventsEnabled: false,
    slug: "acme",
    reportsEnabled: true,
    brandName: null,
    logoUrl: null,
    logoAlt: null,
  });
  await renderLayout("acme");
  openMobileNav();
  expect(screen.queryByRole("link", { name: "Reports" })).not.toBeInTheDocument();
});
```

Replace the existing `Overview` desktop/mobile tests and the `shows Reports links when reports are enabled for the client` test instead of leaving contradictory assertions in place.

- [ ] **Step 2: Run the client layout tests**

Run: `npm run test -- 'src/app/client/[slug]/layout.test.tsx'`
Expected: FAIL because `Overview` and `Reports` still render.

- [ ] **Step 3: Remove Overview/Reports plumbing from the client shell**

```ts
import { Megaphone, Ticket } from "lucide-react";

const BASE_NAV_LINKS: Omit<NavLink, "href">[] = [
  { label: "Campaigns", icon: Megaphone },
];

const EVENTS_NAV_LINK: Omit<NavLink, "href"> = {
  label: "Events",
  icon: Ticket,
};

export function getClientNavLinks(
  slug: string,
  options: { eventsEnabled?: boolean } = {},
): NavLink[] {
  const links = [...BASE_NAV_LINKS];
  if (options.eventsEnabled) links.push(EVENTS_NAV_LINK);

  return links.map((link) => ({
    ...link,
    href: `/client/${slug}/${link.label.toLowerCase()}`,
  }));
}
```

```tsx
export function ClientNav({
  slug,
  eventsEnabled,
}: {
  slug: string;
  eventsEnabled: boolean;
}) {
  const links = getClientNavLinks(slug, { eventsEnabled });
  // existing render loop stays the same
}
```

```tsx
interface Props {
  slug: string;
  clientName: string;
  eventsEnabled: boolean;
}

export function MobileNav({ slug, clientName, eventsEnabled }: Props) {
  const links = getClientNavLinks(slug, { eventsEnabled });
  // existing drawer render stays the same
}
```

- [ ] **Step 4: Remove `reportsEnabled` props from the client layout/nav callers and component signatures**

```tsx
<ClientNav slug={slug} eventsEnabled={eventsEnabled} />
<MobileNav slug={slug} clientName={clientName} eventsEnabled={eventsEnabled} />
```

- [ ] **Step 5: Re-run the client layout tests**

Run: `npm run test -- 'src/app/client/[slug]/layout.test.tsx'`
Expected: PASS

- [ ] **Step 6: Commit the client nav contraction**

```bash
git add 'src/app/client/[slug]/components/nav-config.ts' 'src/app/client/[slug]/components/client-nav.tsx' 'src/app/client/[slug]/components/mobile-nav.tsx' 'src/app/client/[slug]/layout.tsx' 'src/app/client/[slug]/layout.test.tsx'
git commit -m "refactor: contract client shell navigation"
```

### Task 5: Remove the client overview surface and redirect reports

**Files:**
- Create: `src/app/client/[slug]/page.test.tsx`
- Modify: `src/app/client/[slug]/page.tsx`
- Modify: `src/app/client/[slug]/reports/page.tsx`
- Modify: `src/app/client/[slug]/reports/page.test.tsx`

- [ ] **Step 1: Write the failing client shell redirect tests**

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { redirect } from "next/navigation";

describe("client shell redirects", () => {
  it("redirects the portal root to campaigns", async () => {
    const { default: ClientRootPage } = await import("./page");
    await ClientRootPage({
      params: Promise.resolve({ slug: "acme" }),
    });
    expect(redirect).toHaveBeenCalledWith("/client/acme/campaigns");
  });
});
```

- [ ] **Step 2: Run the new root redirect test and the reports page test**

Run: `npm run test -- 'src/app/client/[slug]/page.test.tsx' 'src/app/client/[slug]/reports/page.test.tsx'`
Expected: FAIL because the root page still renders overview content and reports still render UI.

- [ ] **Step 3: Replace the client root page with a redirect**

```ts
import { redirect } from "next/navigation";

export default async function ClientRootPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/client/${slug}/campaigns`);
}
```

- [ ] **Step 4: Convert the client reports page into a redirect**

```ts
import { redirect } from "next/navigation";

export default async function ClientReportsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/client/${slug}/campaigns`);
}
```

- [ ] **Step 5: Rewrite the reports page test to assert redirect behavior**

```ts
it("redirects reports to campaigns in phase 1", async () => {
  const { default: ClientReportsPage } = await import("./page");
  await ClientReportsPage({
    params: Promise.resolve({ slug: "acme" }),
  });
  expect(redirect).toHaveBeenCalledWith("/client/acme/campaigns");
});
```

- [ ] **Step 6: Re-run the client redirect tests**

Run: `npm run test -- 'src/app/client/[slug]/page.test.tsx' 'src/app/client/[slug]/reports/page.test.tsx'`
Expected: PASS

- [ ] **Step 7: Run type-check after the shell contraction**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 8: Commit the client route redirects**

```bash
git add 'src/app/client/[slug]/page.tsx' 'src/app/client/[slug]/page.test.tsx' 'src/app/client/[slug]/reports/page.tsx' 'src/app/client/[slug]/reports/page.test.tsx'
git commit -m "refactor: remove client overview and reports routes"
```

## Chunk 2: Clean The Dashboard And Stop Shipping Removed UI

### Task 6: Remove the creative snapshot from the dashboard

**Files:**
- Create: `src/app/admin/dashboard/page.test.tsx`
- Modify: `src/app/admin/dashboard/page.tsx`
- Delete: `src/components/dashboard/dashboard-assets-section.tsx`

- [ ] **Step 1: Write the failing dashboard test**

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
  getData: vi.fn().mockResolvedValue({
    events: [],
    campaigns: [],
    allCampaigns: [],
    agentRuns: [],
    trendData: [],
    velocityData: [],
    marginalRoasByCampaign: new Map(),
    fromDb: false,
  }),
}));

describe("AdminDashboard", () => {
  it("does not render the creative snapshot block", async () => {
    const { default: AdminDashboard } = await import("./page");
    render(await AdminDashboard());
    expect(screen.queryByText("Creative snapshot")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the dashboard test**

Run: `npm run test -- src/app/admin/dashboard/page.test.tsx`
Expected: FAIL because the dashboard still renders `Creative snapshot`.

- [ ] **Step 3: Remove asset-summary imports and the dashboard asset section**

```tsx
const [{ events, campaigns, allCampaigns, agentRuns, trendData, velocityData, marginalRoasByCampaign, fromDb }] =
  await Promise.all([getData()]);

return (
  <div className="space-y-4 sm:space-y-8">
    {/* no DashboardAssetsSection */}
  </div>
);
```

- [ ] **Step 4: Delete the dashboard assets section component if `rg` shows no remaining kept imports**

Run: `rg -n "DashboardAssetsSection" src`
Expected: only removed-route or dead-module references remain; no kept route should import it.

- [ ] **Step 5: Verify the dashboard page no longer ships old workflow-summary labels**

Run:

```bash
rg -n "Operational Readout|Pending approvals|Open next steps|Open threads|Latest agent outcome|Creative snapshot" src/app/admin/dashboard/page.tsx
```

Expected: no matches after the dashboard cleanup.

- [ ] **Step 6: Re-run the dashboard test**

Run: `npm run test -- src/app/admin/dashboard/page.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit the dashboard cleanup**

```bash
git add src/app/admin/dashboard/page.tsx src/app/admin/dashboard/page.test.tsx src/components/dashboard/dashboard-assets-section.tsx
git commit -m "refactor: remove creative snapshot from dashboard"
```

### Task 7: Keep `Agents` as a thin preserved surface only

**Files:**
- Create: `src/app/admin/campaigns/page.test.tsx`
- Create: `src/app/admin/events/page.test.tsx`
- Modify: `src/app/admin/dashboard/page.tsx`
- Modify: `src/app/admin/campaigns/page.tsx`
- Modify: `src/app/admin/events/page.tsx`

- [ ] **Step 1: Write failing page tests for the thin-agent entry copy**

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
  getCampaigns: vi.fn().mockResolvedValue({
    campaigns: [],
    clients: [],
    dailyInsights: [],
    error: null,
  }),
}));

vi.mock("@/components/admin/campaigns/campaign-table", () => ({
  CampaignTable: () => <div data-testid="campaign-table" />,
}));

vi.mock("@/components/admin/campaigns/client-filter", () => ({
  ClientFilter: () => <div data-testid="client-filter" />,
}));

vi.mock("@/components/admin/campaigns/date-range-filter", () => ({
  DateRangeFilter: () => <div data-testid="date-range-filter" />,
}));

describe("CampaignsPage", () => {
  it("uses thin agent-entry copy in the empty state", async () => {
    const { default: CampaignsPage } = await import("./page");
    render(await CampaignsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText("Use the main agent chat to kick off a Meta sync")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open chat" })).toHaveAttribute("href", "/admin/agents");
  });
});
```

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
  getEvents: vi.fn().mockResolvedValue({
    events: [],
    clients: [],
    demoMap: {},
    campaigns: [],
    fromDb: false,
  }),
}));

vi.mock("@/components/admin/events/event-table", () => ({
  EventTable: () => <div data-testid="event-table" />,
}));

vi.mock("@/components/admin/campaigns/client-filter", () => ({
  ClientFilter: () => <div data-testid="client-filter" />,
}));

describe("EventsPage", () => {
  it("uses thin agent-entry copy in the header", async () => {
    const { default: EventsPage } = await import("./page");
    render(await EventsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("link", { name: "Open chat" })).toHaveAttribute("href", "/admin/agents");
  });
});
```

- [ ] **Step 2: Run the new campaign and event page tests**

Run: `npm run test -- src/app/admin/campaigns/page.test.tsx src/app/admin/events/page.test.tsx`
Expected: FAIL because the pages still use `Run Agent` or broader agent-entry wording.

- [ ] **Step 3: Search for broadening language around agent controls**

Run: `rg -n "/admin/agents|Agent Command Center|Run Agent|Manage" src/app/admin`
Expected: find the dashboard, campaigns, and events references that still describe a broader control surface.

- [ ] **Step 4: Replace broadening copy with thin-entry wording only where needed**

- Update `src/app/admin/dashboard/page.tsx` so the agents card action reads `Open chat` instead of `Manage`.
- Update `src/app/admin/campaigns/page.tsx` so the empty-state helper copy reads `Use the main agent chat to kick off a Meta sync` and the action button reads `Open chat`.
- Update `src/app/admin/events/page.tsx` so the header button reads `Open chat` instead of `Run Agent`.

- [ ] **Step 5: Re-run the targeted page tests and the dashboard smoke test**

Run: `npm run test -- src/app/admin/campaigns/page.test.tsx src/app/admin/events/page.test.tsx src/app/admin/dashboard/page.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit the thin-entry copy cleanup**

```bash
git add src/app/admin/campaigns/page.test.tsx src/app/admin/events/page.test.tsx src/app/admin/dashboard/page.tsx src/app/admin/campaigns/page.tsx src/app/admin/events/page.tsx
git commit -m "refactor: keep agents as a thin admin entry"
```

## Chunk 3: Safe Pruning And Verification

### Task 8: Prune dead tests and route-only dependencies that no longer serve the kept shell

**Files:**
- Create: `src/app/shell-import-smoke.test.ts`
- Modify: `src/app/admin/reports/page.test.tsx`
- Modify: `src/app/client/[slug]/reports/page.test.tsx`
- Modify: `docs/superpowers/specs/2026-03-27-shell-reset-design.md`

- [ ] **Step 1: Add import-smoke coverage for the kept shell and shared modules**

```ts
import { describe, expect, it } from "vitest";

describe("shell import smoke", () => {
  it("imports the kept admin and client pages plus shared data modules", async () => {
    await expect(import("./admin/dashboard/page")).resolves.toBeDefined();
    await expect(import("./admin/campaigns/page")).resolves.toBeDefined();
    await expect(import("./admin/events/page")).resolves.toBeDefined();
    await expect(import("./admin/clients/page")).resolves.toBeDefined();
    await expect(import("./admin/users/page")).resolves.toBeDefined();
    await expect(import("./admin/settings/page")).resolves.toBeDefined();
    await expect(import("./admin/activity/page")).resolves.toBeDefined();
    await expect(import("./admin/agents/page")).resolves.toBeDefined();
    await expect(import("./admin/dashboard/data")).resolves.toBeDefined();
    await expect(import("./admin/campaigns/data")).resolves.toBeDefined();
    await expect(import("./admin/events/data")).resolves.toBeDefined();
    await expect(import("./admin/clients/data")).resolves.toBeDefined();
    await expect(import("./admin/users/data")).resolves.toBeDefined();
    await expect(import("./client/[slug]/layout")).resolves.toBeDefined();
    await expect(import("./client/[slug]/campaigns/page")).resolves.toBeDefined();
    await expect(import("./client/[slug]/events/page")).resolves.toBeDefined();
    await expect(import("./client/[slug]/campaign/[campaignId]/page")).resolves.toBeDefined();
    await expect(import("./client/[slug]/event/[eventId]/page")).resolves.toBeDefined();
  });
});
```

- [ ] **Step 2: Run the import-smoke test and surviving shared client-portal tests**

Run:

```bash
npm run test -- src/app/shell-import-smoke.test.ts src/features/client-portal/access.test.ts src/features/client-portal/config.test.ts
```

Expected: PASS

- [ ] **Step 3: Search for removed-surface test files and dead imports**

Run: `rg -n "reports-surface|getDashboardAssetSummary|DashboardAssetsSection|Creative snapshot|Operational Readout|workspace|assets UI" src`
Expected: identify remaining test expectations or source imports that still assume removed UI or removed dashboard clutter.

- [ ] **Step 4: Update any spec matrix deltas discovered during implementation**

For each newly discovered legacy route still present after shell cleanup, append a concrete row to `docs/superpowers/specs/2026-03-27-shell-reset-design.md` using the exact route path, the actual phase-1 redirect target, and the final disposition. Do not leave placeholders in the matrix.

- [ ] **Step 5: Re-run the focused test set after cleanup**

Run: `npm run test -- src/components/admin/nav-config.test.ts src/components/admin/activity-tracker.test.ts src/app/admin/shell-redirects.test.tsx src/app/admin/dashboard/page.test.tsx src/app/admin/campaigns/page.test.tsx src/app/admin/events/page.test.tsx src/app/shell-import-smoke.test.ts 'src/app/client/[slug]/layout.test.tsx' 'src/app/client/[slug]/page.test.tsx' 'src/app/client/[slug]/reports/page.test.tsx' src/features/client-portal/access.test.ts src/features/client-portal/config.test.ts`
Expected: PASS

- [ ] **Step 6: Commit the cleanup follow-through**

```bash
git add src/app/shell-import-smoke.test.ts src/app/admin/reports/page.test.tsx src/app/client/[slug]/reports/page.test.tsx docs/superpowers/specs/2026-03-27-shell-reset-design.md
git commit -m "test: align shell reset coverage with removed surfaces"
```

### Task 9: Run final shell-reset verification

**Files:**
- Test: `src/components/admin/nav-config.test.ts`
- Test: `src/components/admin/activity-tracker.test.ts`
- Test: `src/app/admin/shell-redirects.test.tsx`
- Test: `src/app/admin/dashboard/page.test.tsx`
- Test: `src/app/admin/campaigns/page.test.tsx`
- Test: `src/app/admin/events/page.test.tsx`
- Test: `src/app/shell-import-smoke.test.ts`
- Test: `src/app/client/[slug]/layout.test.tsx`
- Test: `src/app/client/[slug]/page.test.tsx`
- Test: `src/app/client/[slug]/reports/page.test.tsx`
- Test: `src/features/client-portal/access.test.ts`
- Test: `src/features/client-portal/config.test.ts`

- [ ] **Step 1: Run the focused phase-1 suite**

Run:

```bash
npm run test -- src/components/admin/nav-config.test.ts src/components/admin/activity-tracker.test.ts src/app/admin/shell-redirects.test.tsx src/app/admin/dashboard/page.test.tsx src/app/admin/campaigns/page.test.tsx src/app/admin/events/page.test.tsx src/app/shell-import-smoke.test.ts 'src/app/client/[slug]/layout.test.tsx' 'src/app/client/[slug]/page.test.tsx' 'src/app/client/[slug]/reports/page.test.tsx' src/features/client-portal/access.test.ts src/features/client-portal/config.test.ts
```

Expected: PASS

- [ ] **Step 2: Run type-check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 3: Record any newly discovered legacy route deltas before deleting more code**

Run: `find src/app/admin src/app/client -type f | sort | rg 'reports|assets|crm|workspace|approvals|conversations|notifications'`
Expected: only approved redirect stubs or known follow-up deletions remain. If any unexpected route appears here, add its exact redirect/disposition row to `docs/superpowers/specs/2026-03-27-shell-reset-design.md` before the final commit.

- [ ] **Step 4: Commit the verified shell reset slice**

```bash
git add src/components/admin/nav-config.ts src/components/admin/nav-config.test.ts src/components/admin/activity-tracker.tsx src/components/admin/activity-tracker.test.ts src/app/admin/assets/page.tsx src/app/admin/assets/[assetId]/page.tsx src/app/admin/reports/page.tsx src/app/admin/reports/page.test.tsx src/app/admin/crm/page.tsx src/app/admin/crm/[contactId]/page.tsx src/app/admin/workspace/page.tsx src/app/admin/workspace/[pageId]/page.tsx src/app/admin/workspace/tasks/page.tsx src/app/admin/approvals/page.tsx src/app/admin/conversations/page.tsx src/app/admin/notifications/page.tsx src/app/admin/shell-redirects.test.tsx src/app/admin/dashboard/page.tsx src/app/admin/dashboard/page.test.tsx src/app/admin/campaigns/page.tsx src/app/admin/campaigns/page.test.tsx src/app/admin/events/page.tsx src/app/admin/events/page.test.tsx 'src/app/client/[slug]/components/nav-config.ts' 'src/app/client/[slug]/components/client-nav.tsx' 'src/app/client/[slug]/components/mobile-nav.tsx' 'src/app/client/[slug]/layout.tsx' 'src/app/client/[slug]/layout.test.tsx' 'src/app/client/[slug]/page.tsx' 'src/app/client/[slug]/page.test.tsx' 'src/app/client/[slug]/reports/page.tsx' 'src/app/client/[slug]/reports/page.test.tsx' src/app/shell-import-smoke.test.ts src/components/dashboard/dashboard-assets-section.tsx docs/superpowers/specs/2026-03-27-shell-reset-design.md
git commit -m "refactor: complete shell reset phase 1"
```

## Notes For The Next Spec

After this plan is complete, the next spec should cover the new `Updates` system only:

- admin-managed creation and publishing
- client-facing `Updates` page
- agent-drafted content
- mandatory admin approval before publish

Do not add that work during this shell-reset execution.

## Plan Review Status

Plan chunks must be reviewed against:

- Spec: `docs/superpowers/specs/2026-03-27-shell-reset-design.md`
- Chunk 1: shell contraction
- Chunk 2: dashboard cleanup
- Chunk 3: safe pruning and verification

Plan complete and saved to `docs/plans/2026-03-27-shell-reset-implementation-plan.md`. Ready to execute?
