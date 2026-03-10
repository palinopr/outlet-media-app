import { describe, expect, it, vi } from "vitest";

vi.mock("discord.js", () => ({
  EmbedBuilder: class {
    private json: Record<string, unknown> = { fields: [] };

    setTitle(value: string) {
      this.json.title = value;
      return this;
    }

    setColor(value: number) {
      this.json.color = value;
      return this;
    }

    setDescription(value: string) {
      this.json.description = value;
      return this;
    }

    addFields(...fields: Array<Record<string, unknown>>) {
      this.json.fields = fields;
      return this;
    }

    setTimestamp() {
      this.json.timestamp = true;
      return this;
    }

    setFooter(value: Record<string, unknown>) {
      this.json.footer = value;
      return this;
    }

    toJSON() {
      return this.json;
    }
  },
}));

import { buildOpsEmbed } from "./ops.js";

describe("buildOpsEmbed", () => {
  it("summarizes live task state and recent outcomes in one embed", () => {
    const embed = buildOpsEmbed({
      deferredEvents: [
        {
          actorId: "email-agent",
          actorName: "Email Agent",
          actorType: "agent",
          causationId: null,
          clientSlug: null,
          correlationId: "task_2",
          createdAt: "2026-03-10T17:10:00.000Z",
          detail: "waiting for gmail-inbox",
          entityId: "task_2",
          entityType: "agent_task",
          eventName: "agent_action_deferred",
          eventVersion: 1,
          id: "event_1",
          idempotencyKey: "agent_action_deferred:task_2:1",
          metadata: {
            action: "check-inbox",
            reason: "waiting for gmail-inbox",
            retryCount: 1,
            taskId: "task_2",
            toAgent: "email-agent",
          },
          occurredAt: "2026-03-10T17:10:00.000Z",
          pageId: null,
          source: "worker",
          summary: "Task deferred: check-inbox -> email-agent",
          taskId: null,
          visibility: "admin_only",
        },
      ],
      failedEvents: [
        {
          actorId: "media-buyer",
          actorName: "Media Buyer",
          actorType: "agent",
          causationId: null,
          clientSlug: null,
          correlationId: "task_3",
          createdAt: "2026-03-10T17:05:00.000Z",
          detail: "Missing ad IDs",
          entityId: "task_3",
          entityType: "agent_task",
          eventName: "agent_action_failed",
          eventVersion: 1,
          id: "event_2",
          idempotencyKey: "agent_action_failed:task_3:2026-03-10T17:05:00.000Z",
          metadata: {
            action: "scheduled-copy-swap",
            error: "Missing ad IDs",
            taskId: "task_3",
            toAgent: "media-buyer",
          },
          occurredAt: "2026-03-10T17:05:00.000Z",
          pageId: null,
          source: "worker",
          summary: "Task failed: scheduled-copy-swap -> media-buyer",
          taskId: null,
          visibility: "admin_only",
        },
      ],
      heartbeatLastSeen: new Date().toISOString(),
      heartbeatOnline: true,
      recentCompleted: [
        {
          action: "run",
          completed_at: "2026-03-10T17:00:00.000Z",
          created_at: "2026-03-10T16:58:00.000Z",
          error: null,
          from_agent: "web-admin",
          id: "task_1",
          params: { prompt: "brief me" },
          started_at: "2026-03-10T16:59:00.000Z",
          status: "completed",
          to_agent: "assistant",
        },
      ],
      tasks: [
        {
          action: "run",
          completed_at: null,
          created_at: "2026-03-10T16:58:00.000Z",
          error: null,
          from_agent: "web-admin",
          id: "task_1",
          params: { prompt: "brief me" },
          started_at: "2026-03-10T16:59:00.000Z",
          status: "running",
          to_agent: "assistant",
        },
        {
          action: "check-inbox",
          completed_at: null,
          created_at: "2026-03-10T16:57:00.000Z",
          error: null,
          from_agent: "gmail-push",
          id: "task_2",
          params: { historyId: "123" },
          started_at: null,
          status: "pending",
          to_agent: "email-agent",
        },
        {
          action: "copy-swap",
          completed_at: null,
          created_at: "2026-03-10T16:56:00.000Z",
          error: null,
          from_agent: "boss",
          id: "task_3",
          params: { originalRequest: "swap copy for Camila at midnight" },
          started_at: null,
          status: "escalated",
          to_agent: "media-buyer",
        },
      ],
    } as never);

    const json = embed.toJSON();
    expect(json.title).toBe("Boss Ops Snapshot");
    expect(json.description).toContain("Live tasks:");
    expect(json.fields?.map((field) => field.name)).toEqual([
      "Running Now",
      "Queued / Pending",
      "Waiting Approval",
      "Recent Retries / Deferrals",
      "Recent Failures",
      "Recent Completed",
    ]);
  });
});
