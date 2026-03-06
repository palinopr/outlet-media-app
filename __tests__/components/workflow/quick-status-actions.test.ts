import { describe, expect, it } from "vitest";
import { getQuickStatusTransitions } from "@/components/workflow/quick-status-actions";

describe("getQuickStatusTransitions", () => {
  it("returns the expected forward workflow for todo items", () => {
    expect(getQuickStatusTransitions("todo")).toEqual([
      { label: "Start", status: "in_progress" },
      { label: "Send to review", status: "review" },
    ]);
  });

  it("returns a reopen action for done items", () => {
    expect(getQuickStatusTransitions("done")).toEqual([{ label: "Reopen", status: "todo" }]);
  });
});
