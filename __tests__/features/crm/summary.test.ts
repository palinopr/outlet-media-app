import { describe, expect, it } from "vitest";
import { buildCrmSummary, crmNeedsFollowUpTriage } from "@/features/crm/summary";

describe("crm summary helpers", () => {
  it("counts hot contacts, due follow-ups, and shared visibility", () => {
    const summary = buildCrmSummary(
      [
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          lastContactedAt: null,
          leadScore: 92,
          lifecycleStage: "lead",
          nextFollowUpAt: "2026-03-05T08:00:00.000Z",
          visibility: "shared",
        },
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          lastContactedAt: null,
          leadScore: 40,
          lifecycleStage: "qualified",
          nextFollowUpAt: "2026-03-07T08:00:00.000Z",
          visibility: "admin_only",
        },
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          lastContactedAt: null,
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

  it("flags contacts that need bounded follow-up triage", () => {
    const now = new Date("2026-03-06T12:00:00.000Z");

    expect(
      crmNeedsFollowUpTriage(
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          lastContactedAt: null,
          leadScore: 50,
          lifecycleStage: "qualified",
          nextFollowUpAt: "2026-03-07T06:00:00.000Z",
          visibility: "shared",
        },
        now,
      ),
    ).toBe(true);

    expect(
      crmNeedsFollowUpTriage(
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          lastContactedAt: null,
          leadScore: 86,
          lifecycleStage: "proposal",
          nextFollowUpAt: null,
          visibility: "admin_only",
        },
        now,
      ),
    ).toBe(true);

    expect(
      crmNeedsFollowUpTriage(
        {
          createdAt: "2026-03-06T12:00:00.000Z",
          lastContactedAt: null,
          leadScore: 45,
          lifecycleStage: "customer",
          nextFollowUpAt: "2026-03-10T12:00:00.000Z",
          visibility: "shared",
        },
        now,
      ),
    ).toBe(false);
  });
});
