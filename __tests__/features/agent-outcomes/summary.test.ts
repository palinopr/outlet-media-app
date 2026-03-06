import { describe, expect, it } from "vitest";
import {
  buildAgentOutcomeView,
  jsonToText,
  taskStatusToOutcomeStatus,
} from "@/features/agent-outcomes/summary";

describe("agent outcome summary helpers", () => {
  it("converts task status into UI status", () => {
    expect(taskStatusToOutcomeStatus("completed")).toBe("done");
    expect(taskStatusToOutcomeStatus("failed")).toBe("error");
    expect(taskStatusToOutcomeStatus("running")).toBe("running");
    expect(taskStatusToOutcomeStatus("pending")).toBe("pending");
  });

  it("extracts text from JSON task results", () => {
    expect(jsonToText("done")).toBe("done");
    expect(jsonToText({ text: "short brief" })).toBe("short brief");
    expect(jsonToText({ foo: "bar" })).toContain("\"foo\": \"bar\"");
  });

  it("merges request and task records into a campaign-linked outcome", () => {
    const outcome = buildAgentOutcomeView(
      {
        clientSlug: "zamora",
        createdAt: "2026-03-06T12:00:00.000Z",
        detail: "Assistant will prepare a concise response and next-step brief.",
        metadata: {
          campaignId: "cmp_123",
          campaignName: "Miami Launch",
        },
        summary: "Queued agent triage for campaign comment in Miami Launch",
        taskId: "web_task_1",
        visibility: "shared",
      },
      {
        action: "triage-campaign-comment",
        completedAt: "2026-03-06T12:05:00.000Z",
        createdAt: "2026-03-06T12:00:05.000Z",
        error: null,
        fromAgent: "web-admin",
        id: "web_task_1",
        params: { prompt: "hello" },
        result: { text: "Client is asking whether the creative is ready for Meta." },
        startedAt: "2026-03-06T12:01:00.000Z",
        status: "completed",
        toAgent: "assistant",
      },
    );

    expect(outcome).toMatchObject({
      agentId: "assistant",
      campaignId: "cmp_123",
      campaignName: "Miami Launch",
      linkedActionItemId: null,
      resultText: "Client is asking whether the creative is ready for Meta.",
      status: "done",
      taskId: "web_task_1",
    });
  });

  it("keeps a linked action item when the outcome already created follow-up work", () => {
    const outcome = buildAgentOutcomeView(
      {
        clientSlug: "zamora",
        createdAt: "2026-03-06T12:00:00.000Z",
        detail: null,
        metadata: {
          campaignId: "cmp_123",
        },
        summary: "Queued Meta Ads follow-through",
        taskId: "web_task_2",
        visibility: "admin_only",
      },
      {
        action: "review-approved-creative",
        completedAt: "2026-03-06T12:05:00.000Z",
        createdAt: "2026-03-06T12:00:05.000Z",
        error: null,
        fromAgent: "web-admin",
        id: "web_task_2",
        params: null,
        result: { text: "Recommended launching the approved creative in the active ad set." },
        startedAt: "2026-03-06T12:01:00.000Z",
        status: "completed",
        toAgent: "meta-ads",
      },
      "action_123",
    );

    expect(outcome.linkedActionItemId).toBe("action_123");
  });

  it("preserves CRM contact context on non-campaign agent outcomes", () => {
    const outcome = buildAgentOutcomeView(
      {
        clientSlug: "happy_paws",
        createdAt: "2026-03-06T12:00:00.000Z",
        detail: "Prepare an internal follow-up brief only.",
        metadata: {
          crmContactId: "contact_123",
          crmContactName: "Mia Rivera",
        },
        summary: 'Queued CRM follow-up triage for "Mia Rivera"',
        taskId: "web_task_3",
        visibility: "shared",
      },
      null,
      null,
      "crm_follow_up_123",
    );

    expect(outcome).toMatchObject({
      assetId: null,
      campaignId: null,
      crmContactId: "contact_123",
      crmContactName: "Mia Rivera",
      linkedCrmFollowUpItemId: "crm_follow_up_123",
      status: "pending",
      taskId: "web_task_3",
    });
  });

  it("preserves asset context on creative-focused agent outcomes", () => {
    const outcome = buildAgentOutcomeView(
      {
        clientSlug: "zamora",
        createdAt: "2026-03-06T12:00:00.000Z",
        detail: "Assistant will prepare a concise creative review brief.",
        metadata: {
          assetId: "asset_123",
          assetName: "miami-story-v3.mp4",
        },
        summary: 'Queued agent triage for asset discussion on "miami-story-v3.mp4"',
        taskId: "web_task_4",
        visibility: "admin_only",
      },
      null,
    );

    expect(outcome).toMatchObject({
      assetId: "asset_123",
      assetName: "miami-story-v3.mp4",
      campaignId: null,
      crmContactId: null,
      status: "pending",
      taskId: "web_task_4",
    });
  });
});
