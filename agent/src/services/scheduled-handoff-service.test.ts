import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createLedgerTask,
  updateLedgerTask,
  getServiceSupabase,
  enqueueTask,
  waitForTaskTerminal,
  evaluateTier,
  sendAsAgent,
} = vi.hoisted(() => ({
  createLedgerTask: vi.fn(),
  updateLedgerTask: vi.fn(),
  getServiceSupabase: vi.fn(),
  enqueueTask: vi.fn(),
  waitForTaskTerminal: vi.fn(),
  evaluateTier: vi.fn(),
  sendAsAgent: vi.fn(),
}));

vi.mock("./ledger-service.js", () => ({
  createLedgerTask,
  updateLedgerTask,
}));

vi.mock("./supabase-service.js", () => ({
  getServiceSupabase,
}));

vi.mock("./queue-service.js", () => ({
  enqueueTask,
  waitForTaskTerminal,
}));

vi.mock("./approval-service.js", () => ({
  evaluateTier,
}));

vi.mock("./webhook-service.js", () => ({
  sendAsAgent,
}));

import {
  dispatchDueScheduledHandoffs,
  extractScheduledCopySwapParams,
  looksLikeScheduledBudgetRequest,
  looksLikeScheduledCopySwapRequest,
  parseScheduledDispatchTime,
  scheduleCopySwapHandoff,
} from "./scheduled-handoff-service.js";

function buildSupabaseMock(options: {
  pendingRows?: unknown[];
  claimedRow?: unknown;
}) {
  const selectQuery: Record<string, unknown> = {};
  const updateQuery: Record<string, unknown> = {};

  selectQuery.eq = vi.fn(() => selectQuery);
  selectQuery.order = vi.fn(() => selectQuery);
  selectQuery.limit = vi.fn().mockResolvedValue({
    data: options.pendingRows ?? [],
    error: null,
  });

  updateQuery.eq = vi.fn(() => updateQuery);
  updateQuery.select = vi.fn(() => ({
    maybeSingle: vi.fn().mockResolvedValue({
      data: options.claimedRow ?? null,
      error: null,
    }),
  }));

  return {
    from: vi.fn(() => ({
      select: vi.fn(() => selectQuery),
      update: vi.fn(() => updateQuery),
    })),
  };
}

describe("scheduled-handoff-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createLedgerTask.mockResolvedValue({ id: "task_sched_1" });
    enqueueTask.mockImplementation(
      (
        from: string,
        to: string,
        action: string,
        params: Record<string, unknown>,
        tier: string,
      ) => ({
        id: "task_media_1",
        from,
        to,
        action,
        params,
        tier,
      }),
    );
    waitForTaskTerminal.mockResolvedValue({
      id: "task_media_1",
      status: "completed",
      result: { text: "Media Buyer handled it." },
    });
    evaluateTier.mockReturnValue("execute");
    sendAsAgent.mockResolvedValue(undefined);
  });

  it("detects typo-heavy budget scheduling requests", () => {
    expect(looksLikeScheduledBudgetRequest("we need a campghn to updated buget at 12am")).toBe(true);
  });

  it("detects Isa's Spanish phrasing with daily spent", () => {
    expect(
      looksLikeScheduledBudgetRequest(
        "Le puedes subir a las 12am a $800 daily spent a salt lake city - ricardo arjona?",
      ),
    ).toBe(true);
  });

  it("detects looser phrasing with amount plus change verb", () => {
    expect(
      looksLikeScheduledBudgetRequest("tomorrow at 12am make it $800 for Salt Lake City"),
    ).toBe(true);
  });

  it("detects scheduled copy swap requests from dashboard-style phrasing", () => {
    expect(
      looksLikeScheduledCopySwapRequest(
        "The show from Camila tomorrow, change copy from tomorrow to today at 12am and have scheduler send it to media buyer",
      ),
    ).toBe(true);
  });

  it("extracts activate and pause ids from a structured copy swap request", () => {
    expect(
      extractScheduledCopySwapParams(
        "Copy swap SLC Arjona: Activate Hoy ad 120243055587590525, Pause Mañana ad 120242622824170525 at midnight MT",
      ),
    ).toEqual({
      activateAdId: "120243055587590525",
      activateLabel: "Hoy",
      pauseAdId: "120242622824170525",
      pauseLabel: "Mañana",
    });
  });

  it("parses 12am as the next midnight by default", () => {
    const now = new Date(2026, 2, 6, 10, 15, 0);
    const deliverAt = parseScheduledDispatchTime("update the budget at 12am", now);

    expect(deliverAt).not.toBeNull();
    expect(deliverAt?.getDate()).toBe(7);
    expect(deliverAt?.getHours()).toBe(0);
    expect(deliverAt?.getMinutes()).toBe(0);
  });

  it("parses 24-hour time when provided", () => {
    const now = new Date(2026, 2, 6, 10, 15, 0);
    const deliverAt = parseScheduledDispatchTime("ponla a $800 a las 00:00", now);

    expect(deliverAt).not.toBeNull();
    expect(deliverAt?.getDate()).toBe(7);
    expect(deliverAt?.getHours()).toBe(0);
    expect(deliverAt?.getMinutes()).toBe(0);
  });

  it("creates copy swap scheduler tasks with the expected handoff metadata", async () => {
    const deliverAt = new Date("2026-03-08T07:00:00.000Z");

    await scheduleCopySwapHandoff({
      activateAdId: "120243055587590525",
      activateLabel: "Hoy",
      campaignName: "Arjona Salt Lake City",
      city: "Salt Lake City",
      deliverAt,
      originalRequest: "Change the copy from tomorrow to today at 12am",
      pauseAdId: "120242622824170525",
      pauseLabel: "Mañana",
      requester: "Palino",
      sourceChannel: "dashboard",
    });

    expect(createLedgerTask).toHaveBeenCalledWith({
      from: "boss",
      to: "scheduler",
      action: "scheduled-agent-handoff",
      params: {
        activateAdId: "120243055587590525",
        activateLabel: "Hoy",
        campaignName: "Arjona Salt Lake City",
        city: "Salt Lake City",
        deliverAt: deliverAt.toISOString(),
        deliverToAgent: "media-buyer",
        deliverToChannel: "media-buyer",
        originalRequest: "Change the copy from tomorrow to today at 12am",
        pauseAdId: "120242622824170525",
        pauseLabel: "Mañana",
        replyChannel: "dashboard",
        requestType: "copy-swap",
        requester: "Palino",
        scheduledAction: "scheduled-copy-swap",
        sourceChannel: "dashboard",
      },
      status: "pending",
      tier: "green",
    });
  });

  it("claims and dispatches due scheduled handoffs to the media buyer", async () => {
    const dueAt = new Date(Date.now() - 60_000).toISOString();
    const pendingRow = {
      id: "task_sched_1",
      action: "scheduled-agent-handoff",
      from_agent: "boss",
      params: {
        deliverAt: dueAt,
        deliverToAgent: "media-buyer",
        deliverToChannel: "media-buyer",
        originalRequest: "Update Palm Desert budget at 12am",
        replyChannel: "general",
        requester: "Alex",
        scheduledAction: "scheduled-budget-handoff",
        sourceChannel: "general",
      },
      status: "pending",
      to_agent: "scheduler",
    };

    getServiceSupabase.mockReturnValue(buildSupabaseMock({
      pendingRows: [pendingRow],
      claimedRow: { ...pendingRow, status: "running" },
    }));

    const client = {
      guilds: {
        cache: {
          first: () => ({ id: "guild-1" }),
        },
      },
    } as never;

    await dispatchDueScheduledHandoffs(client);

    expect(sendAsAgent).toHaveBeenCalledWith(
      "scheduler",
      "schedule",
      expect.stringContaining("Dispatching task_sched_1"),
    );
    expect(sendAsAgent).toHaveBeenCalledWith(
      "scheduler",
      "media-buyer",
      expect.stringContaining("Scheduled handoff from Boss"),
    );
    expect(enqueueTask).toHaveBeenCalledWith(
      "scheduler",
      "media-buyer",
      "scheduled-budget-handoff",
      expect.objectContaining({
        originalRequest: "Update Palm Desert budget at 12am",
        replyChannel: "general",
        requester: "Alex",
        sourceChannel: "general",
      }),
      "green",
    );
    expect(waitForTaskTerminal).toHaveBeenCalledWith(
      "task_media_1",
      10 * 60 * 1000,
    );
    expect(updateLedgerTask).toHaveBeenCalledWith(
      "task_sched_1",
      expect.objectContaining({
        status: "completed",
        result: expect.objectContaining({
          delegated_task_id: "task_media_1",
          text: "Media Buyer handled it.",
        }),
      }),
    );
  });

  it("dispatches copy swap handoffs with the scheduled action preserved", async () => {
    const dueAt = new Date(Date.now() - 60_000).toISOString();
    const pendingRow = {
      id: "task_sched_copy_1",
      action: "scheduled-agent-handoff",
      from_agent: "boss",
      params: {
        deliverAt: dueAt,
        deliverToAgent: "media-buyer",
        deliverToChannel: "media-buyer",
        originalRequest: "Switch tomorrow copy to today at 12am",
        replyChannel: "boss",
        requester: "Palino",
        scheduledAction: "scheduled-copy-swap",
        sourceChannel: "boss",
      },
      status: "pending",
      to_agent: "scheduler",
    };

    getServiceSupabase.mockReturnValue(buildSupabaseMock({
      pendingRows: [pendingRow],
      claimedRow: { ...pendingRow, status: "running" },
    }));

    const client = {
      guilds: {
        cache: {
          first: () => ({ id: "guild-1" }),
        },
      },
    } as never;

    await dispatchDueScheduledHandoffs(client);

    expect(enqueueTask).toHaveBeenCalledWith(
      "scheduler",
      "media-buyer",
      "scheduled-copy-swap",
      expect.objectContaining({
        originalRequest: "Switch tomorrow copy to today at 12am",
        replyChannel: "boss",
        requester: "Palino",
        sourceChannel: "boss",
      }),
      "green",
    );
  });
});
