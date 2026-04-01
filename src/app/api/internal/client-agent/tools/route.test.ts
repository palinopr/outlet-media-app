import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const { runTool } = vi.hoisted(() => ({
  runTool: vi.fn(),
}));

vi.mock("@/features/client-agent/worker-api", () => ({
  runTool,
  WorkerToolNameSchema: z.enum([
    "search_scope",
    "get_ads_overview",
    "get_events_overview",
    "get_campaign_details",
    "get_event_details",
    "get_creative_details",
    "get_demographic_breakdown",
    "get_geography_breakdown",
    "get_placement_breakdown",
    "compare_entities",
    "get_timeseries",
  ]),
}));

describe("client-agent worker tools route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLIENT_AGENT_WORKER_SECRET = "worker-secret";
  });

  it("returns 401 when the worker secret is missing or invalid", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          task_id: "task_1",
          tool_name: "get_ads_overview",
          args: {},
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(401);
    expect(runTool).not.toHaveBeenCalled();
  });

  it("returns ok data for a valid safe tool call", async () => {
    runTool.mockResolvedValueOnce({
      ok: true,
      body: {
        status: "ok",
        data: {
          totals: {
            spendUsd: 1000,
          },
        },
        referenced_entities: [],
      },
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          task_id: "task_1",
          tool_name: "get_ads_overview",
          args: {
            range: {
              preset: "lifetime",
              startDate: "1900-01-01",
              endDate: "2026-04-01",
              timezone: "America/Chicago",
            },
            campaignIds: null,
            creativeIds: null,
          },
        }),
        headers: {
          Authorization: "Bearer worker-secret",
          "Content-Type": "application/json",
        },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "ok",
      data: expect.any(Object),
    });
    expect(runTool).toHaveBeenCalledWith({
      args: expect.any(Object),
      taskId: "task_1",
      toolName: "get_ads_overview",
    });
  });

  it("rejects tool names outside the safe worker surface", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          task_id: "task_1",
          tool_name: "describe_internal_strategy",
          args: {},
        }),
        headers: {
          Authorization: "Bearer worker-secret",
          "Content-Type": "application/json",
        },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual(
      expect.objectContaining({
        error: "Invalid payload",
      }),
    );
    expect(runTool).not.toHaveBeenCalled();
  });
});
