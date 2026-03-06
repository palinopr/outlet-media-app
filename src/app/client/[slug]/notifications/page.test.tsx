import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/features/client-portal/access", () => ({
  requireClientAccess: vi.fn(),
}));

vi.mock("@/features/notifications/center", () => ({
  getClientNotificationsCenter: vi.fn(),
}));

vi.mock("@/components/workspace/notifications-center", () => ({
  NotificationsCenter: ({
    initialNotifications,
    viewer,
  }: {
    initialNotifications: unknown[];
    viewer: "admin" | "client";
  }) => (
    <div data-testid="notifications-center">
      {viewer}:{initialNotifications.length}
    </div>
  ),
}));

vi.mock("@/components/workspace/workspace-approvals-panel", () => ({
  WorkspaceApprovalsPanel: ({ approvals }: { approvals: unknown[] }) => (
    <div data-testid="approvals-panel">{approvals.length}</div>
  ),
}));

vi.mock("@/components/workflow/work-queue-section", () => ({
  WorkQueueSection: ({ summary }: { summary: { items: unknown[] } }) => (
    <div data-testid="work-queue-section">{summary.items.length}</div>
  ),
}));

import ClientNotificationsPage from "./page";
import { requireClientAccess } from "@/features/client-portal/access";
import { getClientNotificationsCenter } from "@/features/notifications/center";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ClientNotificationsPage", () => {
  it("passes assigned client scope into the initial inbox load", async () => {
    vi.mocked(requireClientAccess).mockResolvedValue({
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
      userId: "user_1",
    } as Awaited<ReturnType<typeof requireClientAccess>>);
    vi.mocked(getClientNotificationsCenter).mockResolvedValue({
      approvals: [],
      assignedWorkQueue: {
        items: [],
        metrics: [],
      },
      notifications: [],
    });

    const element = await ClientNotificationsPage({
      params: Promise.resolve({ slug: "zamora" }),
    });

    render(<>{element}</>);

    expect(getClientNotificationsCenter).toHaveBeenCalledWith({
      clientSlug: "zamora",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
      userId: "user_1",
    });
    expect(screen.getByTestId("approvals-panel")).toHaveTextContent("0");
    expect(screen.getByTestId("work-queue-section")).toHaveTextContent("0");
    expect(screen.getByTestId("notifications-center")).toHaveTextContent("client:0");
  });
});
