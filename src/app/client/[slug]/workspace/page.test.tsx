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

vi.mock("@/features/agent-outcomes/server", () => ({
  listAgentOutcomes: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  filterSystemEventsByClientScope: vi.fn(),
  listSystemEvents: vi.fn(),
}));

vi.mock("@/features/work-queue/server", () => ({
  getWorkQueue: vi.fn(),
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

vi.mock("@/components/workflow/work-queue-section", () => ({
  WorkQueueSection: ({
    summary,
    title,
  }: {
    summary: { items: unknown[] };
    title?: string;
  }) => (
    <div data-testid={`work-queue-${(title ?? "section").toLowerCase().replace(/\s+/g, "-")}`}>
      {summary.items.length}
    </div>
  ),
}));

vi.mock("@/components/agents/agent-outcomes-panel", () => ({
  AgentOutcomesPanel: ({ outcomes }: { outcomes: unknown[] }) => (
    <div data-testid="agent-outcomes-count">{outcomes.length}</div>
  ),
}));

import ClientWorkspacePage from "./page";
import { requireClientAccess } from "@/features/client-portal/access";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getWorkspacePages } from "@/features/workspace/server";
import { listApprovalRequests } from "@/features/approvals/server";
import {
  filterSystemEventsByClientScope,
  listSystemEvents,
} from "@/features/system-events/server";
import { getWorkQueue } from "@/features/work-queue/server";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ClientWorkspacePage", () => {
  it("passes assigned scope into shared and assigned work queues plus approvals and activity filtering", async () => {
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
    vi.mocked(getWorkQueue).mockResolvedValue({
      items: [],
      metrics: [],
    });
    vi.mocked(listAgentOutcomes).mockResolvedValue([]);
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
    expect(getWorkQueue).toHaveBeenNthCalledWith(1, {
      clientSlug: "zamora",
      limit: 6,
      mode: "client",
      scope,
    });
    expect(getWorkQueue).toHaveBeenNthCalledWith(2, {
      assigneeId: "user_1",
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scope,
    });
    expect(listAgentOutcomes).toHaveBeenCalledWith({
      audience: "shared",
      clientSlug: "zamora",
      limit: 6,
      scopeCampaignIds: ["cmp_1"],
      scopeEventIds: ["evt_1"],
    });
    expect(filterSystemEventsByClientScope).toHaveBeenCalledWith("zamora", [], {
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    });
    expect(screen.getByTestId("page-list")).toHaveTextContent("/client/zamora/workspace");
    expect(screen.getByTestId("work-queue-assigned-to-you")).toHaveTextContent("0");
    expect(screen.getByTestId("work-queue-shared-work-queue")).toHaveTextContent("0");
    expect(screen.getByTestId("agent-outcomes-count")).toHaveTextContent("0");
    expect(screen.getByTestId("approvals-count")).toHaveTextContent("0");
    expect(screen.getByTestId("events-count")).toHaveTextContent("0");
  });
});
