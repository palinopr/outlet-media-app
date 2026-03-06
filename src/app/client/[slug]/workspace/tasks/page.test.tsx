import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/features/client-portal/access", () => ({
  requireClientAccess: vi.fn(),
}));

vi.mock("@/features/workspace/server", () => ({
  getWorkspaceTasks: vi.fn(),
}));

vi.mock("@/features/work-queue/server", () => ({
  getWorkQueue: vi.fn(),
}));

vi.mock("@/components/workspace/task-board", () => ({
  TaskBoard: ({ clientSlug }: { clientSlug: string }) => (
    <div data-testid="task-board">{clientSlug}</div>
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

import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspaceTasks } from "@/features/workspace/server";
import { getWorkQueue } from "@/features/work-queue/server";
import ClientTasksPage from "./page";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ClientTasksPage", () => {
  it("loads shared and assigned work queues for the current client member", async () => {
    const scope = {
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    };

    vi.mocked(requireClientAccess).mockResolvedValue({
      scope,
      userId: "user_1",
    } as Awaited<ReturnType<typeof requireClientAccess>>);
    vi.mocked(getWorkspaceTasks).mockResolvedValue([]);
    vi.mocked(getWorkQueue).mockResolvedValue({
      items: [],
      metrics: [],
    });

    const element = await ClientTasksPage({
      params: Promise.resolve({ slug: "zamora" }),
    });

    render(<>{element}</>);

    expect(getWorkQueue).toHaveBeenNthCalledWith(1, {
      clientSlug: "zamora",
      limit: 10,
      mode: "client",
      scope,
    });
    expect(getWorkQueue).toHaveBeenNthCalledWith(2, {
      assigneeId: "user_1",
      clientSlug: "zamora",
      limit: 6,
      mode: "client",
      scope,
    });
    expect(screen.getByTestId("work-queue-assigned-to-you")).toHaveTextContent("0");
    expect(screen.getByTestId("work-queue-shared-work-queue")).toHaveTextContent("0");
    expect(screen.getByTestId("task-board")).toHaveTextContent("zamora");
  });
});
