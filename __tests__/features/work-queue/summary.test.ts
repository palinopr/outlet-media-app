import { describe, expect, it } from "vitest";
import { buildWorkQueueSummary, type WorkQueueItem } from "@/features/work-queue/summary";

function makeItem(overrides: Partial<WorkQueueItem> = {}): WorkQueueItem {
  return {
    id: "item_1",
    kind: "campaign_action",
    title: "Review creative",
    description: null,
    clientSlug: "zamora",
    contextId: "cmp_1",
    contextLabel: "Campaign 1",
    href: "/admin/campaigns/cmp_1",
    status: "todo",
    priority: "medium",
    assigneeName: null,
    dueDate: null,
    updatedAt: "2026-03-06T12:00:00.000Z",
    ...overrides,
  };
}

describe("buildWorkQueueSummary", () => {
  it("ranks urgent and review items first and builds queue metrics", () => {
    const summary = buildWorkQueueSummary(
      [
        makeItem({ id: "a", priority: "medium", status: "todo" }),
        makeItem({
          id: "b",
          priority: "urgent",
          status: "in_progress",
          dueDate: "2026-03-07",
        }),
        makeItem({
          id: "c",
          priority: "high",
          status: "review",
          dueDate: "2026-03-05",
        }),
      ],
      {
        now: new Date("2026-03-06T12:00:00.000Z"),
      },
    );

    expect(summary.items.map((item) => item.id)).toEqual(["b", "c", "a"]);
    expect(summary.metrics).toEqual([
      expect.objectContaining({ key: "open_items", value: 3 }),
      expect.objectContaining({ key: "urgent_items", value: 1 }),
      expect.objectContaining({ key: "in_review", value: 1 }),
      expect.objectContaining({ key: "due_soon", value: 2 }),
    ]);
  });
});
