import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const redirectMock = vi.mocked(redirect);

type PageCase = {
  name: string;
  expected: string;
  load: () => Promise<{ default: (props?: unknown) => unknown | Promise<unknown> }>;
  props?: unknown;
};

const pageCases: PageCase[] = [
  {
    name: "assets index",
    expected: "/admin/campaigns",
    load: () => import("./assets/page"),
    props: { searchParams: Promise.resolve({}) },
  },
  {
    name: "asset detail",
    expected: "/admin/campaigns",
    load: () => import("./assets/[assetId]/page"),
    props: { params: Promise.resolve({ assetId: "asset_123" }) },
  },
  {
    name: "reports index",
    expected: "/admin/dashboard",
    load: () => import("./reports/page"),
  },
  {
    name: "crm index",
    expected: "/admin/clients",
    load: () => import("./crm/page"),
  },
  {
    name: "crm contact detail",
    expected: "/admin/clients",
    load: () => import("./crm/[contactId]/page"),
  },
  {
    name: "workspace index",
    expected: "/admin/dashboard",
    load: () => import("./workspace/page"),
  },
  {
    name: "workspace detail",
    expected: "/admin/dashboard",
    load: () => import("./workspace/[pageId]/page"),
  },
  {
    name: "workspace tasks",
    expected: "/admin/dashboard",
    load: () => import("./workspace/tasks/page"),
  },
  {
    name: "approvals index",
    expected: "/admin/dashboard",
    load: () => import("./approvals/page"),
  },
  {
    name: "conversations index",
    expected: "/admin/dashboard",
    load: () => import("./conversations/page"),
  },
  {
    name: "notifications index",
    expected: "/admin/dashboard",
    load: () => import("./notifications/page"),
  },
];

describe("admin shell redirects", () => {
  it.each(pageCases)("redirects $name to $expected", async ({ expected, load, props }) => {
    const page = await load();

    redirectMock.mockClear();

    await page.default(props);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith(expected);
  });
});
