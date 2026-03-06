import { describe, expect, it } from "vitest";
import { buildCrmSummary } from "@/features/crm/summary";

describe("crm summary helpers", () => {
  it("counts hot contacts, due follow-ups, and shared visibility", () => {
    const summary = buildCrmSummary(
      [
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          leadScore: 92,
          lifecycleStage: "lead",
          nextFollowUpAt: "2026-03-05T08:00:00.000Z",
          visibility: "shared",
        },
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          leadScore: 40,
          lifecycleStage: "qualified",
          nextFollowUpAt: "2026-03-07T08:00:00.000Z",
          visibility: "admin_only",
        },
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          leadScore: 88,
          lifecycleStage: "customer",
          nextFollowUpAt: null,
          visibility: "shared",
        },
      ],
      new Date("2026-03-06T12:00:00.000Z"),
    );

    expect(summary).toMatchObject({
      dueFollowUps: 1,
      hotContacts: 2,
      sharedContacts: 2,
      totalContacts: 3,
    });
    expect(summary.stageBreakdown.find((stage) => stage.stage === "lead")?.count).toBe(1);
    expect(summary.stageBreakdown.find((stage) => stage.stage === "customer")?.count).toBe(1);
  });
});
