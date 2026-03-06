import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/features/client-portal/access", () => ({
  requireClientAccess: vi.fn(),
}));

vi.mock("@/features/workspace/server", () => ({
  getWorkspacePages: vi.fn(),
}));

vi.mock("@/features/approvals/server", () => ({
  listApprovalRequests: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  filterSystemEventsByClientScope: vi.fn(),
  listSystemEvents: vi.fn(),
}));

vi.mock("@/components/workspace/page-list", () => ({
  PageList: ({ basePath }: { basePath: string }) => <div data-testid="page-list">{basePath}</div>,
}));

vi.mock("@/components/workspace/workspace-approvals-panel", () => ({
  WorkspaceApprovalsPanel: ({ approvals }: { approvals: unknown[] }) => (
    <div data-testid="approvals-count">{approvals.length}</div>
  ),
}));

vi.mock("@/components/workspace/workspace-activity-feed", () => ({
  WorkspaceActivityFeed: ({ events }: { events: unknown[] }) => (
    <div data-testid="events-count">{events.length}</div>
  ),
}));

import ClientWorkspacePage from "./page";
import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspacePages } from "@/features/workspace/server";
import { listApprovalRequests } from "@/features/approvals/server";
import {
  filterSystemEventsByClientScope,
  listSystemEvents,
} from "@/features/system-events/server";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ClientWorkspacePage", () => {
  it("passes assigned scope into shared approvals and activity filtering", async () => {
    const scope = {
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    };

    vi.mocked(requireClientAccess).mockResolvedValue({
      scope,
      userId: "user_1",
    } as Awaited<ReturnType<typeof requireClientAccess>>);
    vi.mocked(getWorkspacePages).mockResolvedValue({
      fromDb: true,
      pages: [],
    });
    vi.mocked(listSystemEvents).mockResolvedValue([]);
    vi.mocked(filterSystemEventsByClientScope).mockResolvedValue([]);
    vi.mocked(listApprovalRequests).mockResolvedValue([]);

    const element = await ClientWorkspacePage({
      params: Promise.resolve({ slug: "zamora" }),
    });

    render(<>{element}</>);

    expect(listApprovalRequests).toHaveBeenCalledWith({
      audience: "shared",
      clientSlug: "zamora",
      limit: 8,
      scope,
      status: "pending",
    });
    expect(filterSystemEventsByClientScope).toHaveBeenCalledWith("zamora", [], {
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    });
    expect(screen.getByTestId("page-list")).toHaveTextContent("/client/zamora/workspace");
    expect(screen.getByTestId("approvals-count")).toHaveTextContent("0");
    expect(screen.getByTestId("events-count")).toHaveTextContent("0");
  });
});
