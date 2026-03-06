import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
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

import { auth } from "@clerk/nextjs/server";
import { getWorkspaceTasks } from "@/features/workspace/server";
import { getWorkQueue } from "@/features/work-queue/server";
import AdminTasksPage from "./page";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AdminTasksPage", () => {
  it("loads shared and assigned work queues for the current admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin_1" } as Awaited<ReturnType<typeof auth>>);
    vi.mocked(getWorkspaceTasks).mockResolvedValue([]);
    vi.mocked(getWorkQueue).mockResolvedValue({
      items: [],
      metrics: [],
    });

    const element = await AdminTasksPage({
      searchParams: Promise.resolve({ client_slug: "zamora" }),
    });

    render(<>{element}</>);

    expect(getWorkQueue).toHaveBeenNthCalledWith(1, {
      clientSlug: "zamora",
      limit: 12,
      mode: "admin",
    });
    expect(getWorkQueue).toHaveBeenNthCalledWith(2, {
      assigneeId: "admin_1",
      clientSlug: "zamora",
      limit: 6,
      mode: "admin",
    });
    expect(screen.getByTestId("work-queue-assigned-to-you")).toHaveTextContent("0");
    expect(screen.getByTestId("work-queue-operating-queue")).toHaveTextContent("0");
    expect(screen.getByTestId("task-board")).toHaveTextContent("zamora");
  });
});
