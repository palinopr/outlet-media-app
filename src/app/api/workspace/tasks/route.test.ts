import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  getWorkspaceReadClient,
  requireWorkspaceClientAccess,
  taskReadState,
  taskReadClient,
} = vi.hoisted(() => {
  const taskReadState = {
    workspace_tasks: [] as Record<string, unknown>[],
  };

  const taskReadClient = {
    from(table: string) {
      const filters: Array<{ field: string; value: unknown }> = [];
      const query = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          filters.push({ field, value });
          return this;
        },
        order() {
          return this;
        },
        then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) {
          const rows = (taskReadState[table as keyof typeof taskReadState] ?? []).filter((row) =>
            filters.every((filter) => row[filter.field] === filter.value),
          );
          return Promise.resolve({ data: rows, error: null }).then(resolve);
        },
      };

      return query;
    },
  };

  return {
    authGuard: vi.fn(),
    getWorkspaceReadClient: vi.fn(),
    requireWorkspaceClientAccess: vi.fn(),
    taskReadClient,
    taskReadState,
  };
});

vi.mock("@/lib/api-helpers", () => ({
  apiError: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
  authGuard,
}));

vi.mock("@/features/workspace/access", () => ({
  requireWorkspaceClientAccess,
}));

vi.mock("@/features/workspace/server", () => ({
  getWorkspaceReadClient,
}));

function makeRequest(url: string) {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe("workspace tasks route", () => {
  beforeEach(() => {
    authGuard.mockReset();
    getWorkspaceReadClient.mockReset();
    requireWorkspaceClientAccess.mockReset();
    taskReadState.workspace_tasks = [];
    getWorkspaceReadClient.mockResolvedValue(taskReadClient);
  });

  it("uses the workspace read client for task lists", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    requireWorkspaceClientAccess.mockResolvedValue({ clientSlug: "zamora" });
    taskReadState.workspace_tasks = [
      {
        assignee_id: "user_1",
        client_slug: "zamora",
        id: "task_rls",
        priority: "high",
        status: "todo",
      },
      {
        assignee_id: "user_2",
        client_slug: "zamora",
        id: "task_filtered",
        priority: "low",
        status: "done",
      },
      {
        assignee_id: "user_1",
        client_slug: "kybba",
        id: "task_other_client",
        priority: "high",
        status: "todo",
      },
    ];

    const { GET } = await import("./route");
    const response = await GET(
      makeRequest(
        "https://example.com/api/workspace/tasks?client_slug=zamora&status=todo&priority=high&assignee_id=user_1",
      ),
    );
    const payload = (await response.json()) as Array<{ id: string }>;

    expect(response.status).toBe(200);
    expect(payload.map((task) => task.id)).toEqual(["task_rls"]);
    expect(getWorkspaceReadClient).toHaveBeenCalledWith("zamora");
  });
});
