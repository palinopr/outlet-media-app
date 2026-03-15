import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mocks -- declared before vi.mock() calls
// ---------------------------------------------------------------------------

const {
  runClaude,
  notifyChannel,
  discordClient,
  isAgentBusy,
  setAgentBusy,
  clearAgentBusy,
  resetStaleLocks,
  withResourceLocks,
  ResourceBusyError,
  getSweepRunners,
  ensureManagedEmailLabels,
  sweepUnreadInboxDetailed,
  createLedgerTask,
  updateLedgerTask,
  notifyOwner,
  notifyOwnerEmailAlert,
  notifyOwnerImportant,
  checkMeetingReminders,
  ensureGmailWatch,
  pollGmailHistory,
  dispatchDueScheduledHandoffs,
  cronSchedule,
} = vi.hoisted(() => ({
  runClaude: vi.fn(),
  notifyChannel: vi.fn(),
  discordClient: {},
  isAgentBusy: vi.fn(),
  setAgentBusy: vi.fn(),
  clearAgentBusy: vi.fn(),
  resetStaleLocks: vi.fn(),
  withResourceLocks: vi.fn(),
  ResourceBusyError: class ResourceBusyError extends Error {
    blockers: string[];
    constructor(ownerId: string, resources: string[], blockers: string[]) {
      super(`Resources busy for ${ownerId}`);
      this.blockers = blockers;
    }
  },
  getSweepRunners: vi.fn(),
  ensureManagedEmailLabels: vi.fn(),
  sweepUnreadInboxDetailed: vi.fn(),
  createLedgerTask: vi.fn(),
  updateLedgerTask: vi.fn(),
  notifyOwner: vi.fn(),
  notifyOwnerEmailAlert: vi.fn(),
  notifyOwnerImportant: vi.fn(),
  checkMeetingReminders: vi.fn(),
  ensureGmailWatch: vi.fn(),
  pollGmailHistory: vi.fn(),
  dispatchDueScheduledHandoffs: vi.fn(),
  cronSchedule: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("./runner.js", () => ({ runClaude }));

vi.mock("./discord/core/entry.js", () => ({
  discordClient,
  notifyChannel,
}));

vi.mock("./state.js", () => ({
  ResourceBusyError,
  isAgentBusy,
  setAgentBusy,
  clearAgentBusy,
  resetStaleLocks,
  withResourceLocks,
}));

vi.mock("./jobs/cron-sweeps.js", () => ({ getSweepRunners }));

vi.mock("./services/email-intelligence-service.js", () => ({
  ensureManagedEmailLabels,
  sweepUnreadInboxDetailed,
}));

vi.mock("./services/ledger-service.js", () => ({
  createLedgerTask,
  updateLedgerTask,
}));

vi.mock("./services/owner-discord-service.js", () => ({
  notifyOwner,
  notifyOwnerEmailAlert,
  notifyOwnerImportant,
}));

vi.mock("./services/calendar-service.js", () => ({
  checkMeetingReminders,
}));

vi.mock("./services/gmail-watch-service.js", () => ({
  ensureGmailWatch,
  pollGmailHistory,
}));

vi.mock("./services/scheduled-handoff-service.js", () => ({
  dispatchDueScheduledHandoffs,
}));

vi.mock("node-cron", () => ({
  default: {
    schedule: cronSchedule,
  },
}));

// Prevent INGEST_URL from causing issues
process.env.INGEST_URL = "https://test.example.com/api/ingest";
process.env.INGEST_SECRET = "test_secret";

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------

import {
  startScheduler,
  stopScheduler,
  triggerManualJob,
  getJobRunners,
  runEmailCheck,
  runEmailHistoryPoll,
  runMetaSync,
  runThinkCycle,
  runTmCheck,
} from "./scheduler.js";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("scheduler", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: nothing is busy, resource locks pass through
    isAgentBusy.mockReturnValue(false);
    withResourceLocks.mockImplementation(
      async (_ownerId: string, _resources: string[], work: () => Promise<unknown>) => work(),
    );
    getSweepRunners.mockReturnValue({});

    // Default mock returns
    runClaude.mockResolvedValue({ text: "Done.", success: true, sessionId: "sess_1" });
    createLedgerTask.mockResolvedValue({ id: "audit_1" });
    updateLedgerTask.mockResolvedValue(undefined);
    notifyChannel.mockResolvedValue(undefined);
    notifyOwner.mockResolvedValue(undefined);
    notifyOwnerImportant.mockResolvedValue(undefined);
    notifyOwnerEmailAlert.mockResolvedValue(undefined);
    checkMeetingReminders.mockResolvedValue("No upcoming meetings.");
    ensureGmailWatch.mockResolvedValue("Gmail watch armed.");
    ensureManagedEmailLabels.mockResolvedValue([]);
    pollGmailHistory.mockResolvedValue("No new Gmail history.");
    cronSchedule.mockReturnValue({ stop: vi.fn() });
  });

  afterEach(() => {
    stopScheduler();
  });

  // -----------------------------------------------------------------------
  // startScheduler / stopScheduler
  // -----------------------------------------------------------------------

  it("registers core cron jobs on start", () => {
    startScheduler();

    // Core jobs: heartbeat, meta, think, discord-health, handoffs, meeting-reminder
    expect(cronSchedule.mock.calls.length).toBeGreaterThanOrEqual(6);

    const cronExpressions = cronSchedule.mock.calls.map((call: unknown[]) => call[0]);
    expect(cronExpressions).toContain("*/1 * * * *"); // heartbeat + handoffs + meeting
    expect(cronExpressions).toContain("0 */6 * * *"); // meta sync
    expect(cronExpressions).toContain("*/30 8-22 * * *"); // think
    expect(cronExpressions).toContain("0 */12 * * *"); // discord health
  });

  it("stops all cron tasks on stopScheduler", () => {
    const stopFn = vi.fn();
    cronSchedule.mockReturnValue({ stop: stopFn });

    startScheduler();
    const jobCount = cronSchedule.mock.calls.length;
    expect(jobCount).toBeGreaterThan(0);

    stopScheduler();
    expect(stopFn).toHaveBeenCalledTimes(jobCount);
  });

  // -----------------------------------------------------------------------
  // triggerManualJob
  // -----------------------------------------------------------------------

  it("dispatches known job names", () => {
    triggerManualJob("meta-sync");
    // runMetaSync is called (async, fire-and-forget)
    // We verify by checking that setAgentBusy is eventually called
    // Since it's fire-and-forget, we just ensure no error
  });

  it("delegates unknown job names to sweep runners", () => {
    const sweepFn = vi.fn();
    getSweepRunners.mockReturnValue({ "custom-sweep": sweepFn });

    triggerManualJob("custom-sweep");
    expect(sweepFn).toHaveBeenCalledOnce();
  });

  it("warns for completely unknown job names", () => {
    getSweepRunners.mockReturnValue({});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    triggerManualJob("totally-unknown");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Unknown manual trigger: totally-unknown"),
    );
  });

  // -----------------------------------------------------------------------
  // getJobRunners
  // -----------------------------------------------------------------------

  it("returns all core and sweep runners", () => {
    getSweepRunners.mockReturnValue({ "my-sweep": vi.fn() });

    const runners = getJobRunners();
    expect(runners).toHaveProperty("meta-sync");
    expect(runners).toHaveProperty("tm-sync");
    expect(runners).toHaveProperty("think");
    expect(runners).toHaveProperty("heartbeat");
    expect(runners).toHaveProperty("health-check");
    expect(runners).toHaveProperty("email-check");
    expect(runners).toHaveProperty("email-history-poll");
    expect(runners).toHaveProperty("meeting-reminder");
    expect(runners).toHaveProperty("my-sweep");
  });

  // -----------------------------------------------------------------------
  // runEmailCheck
  // -----------------------------------------------------------------------

  it("skips email check when already busy", async () => {
    isAgentBusy.mockReturnValue(true);
    const result = await runEmailCheck();
    expect(result).toBe("Email check is already running.");
    expect(sweepUnreadInboxDetailed).not.toHaveBeenCalled();
  });

  it("runs email sweep and returns summary", async () => {
    sweepUnreadInboxDetailed.mockResolvedValue({
      summary: "Swept 3 messages.",
      results: [],
      reviewedCount: 3,
      inboundCount: 2,
      outboundCount: 1,
      notifiedCount: 1,
      skippedCount: 0,
    });

    const result = await runEmailCheck({ notify: false });
    expect(result).toBe("Swept 3 messages.");
    expect(setAgentBusy).toHaveBeenCalledWith("email-check");
    expect(clearAgentBusy).toHaveBeenCalledWith("email-check");
  });

  it("defers email check when resources are busy", async () => {
    withResourceLocks.mockRejectedValue(
      new ResourceBusyError("email-check", ["gmail-inbox"], ["gmail-inbox"]),
    );

    const result = await runEmailCheck({ notify: false });
    expect(result).toContain("deferred");
    expect(result).toContain("gmail-inbox");
    expect(clearAgentBusy).toHaveBeenCalledWith("email-check");
  });

  // -----------------------------------------------------------------------
  // runEmailHistoryPoll
  // -----------------------------------------------------------------------

  it("skips email history poll when already busy", async () => {
    isAgentBusy.mockReturnValue(true);
    const result = await runEmailHistoryPoll();
    expect(result).toBe("Email history poll is already running.");
  });

  it("runs history poll and returns message", async () => {
    pollGmailHistory.mockResolvedValue("Processed 2 new messages.");

    const result = await runEmailHistoryPoll({ notify: false });
    expect(result).toBe("Processed 2 new messages.");
    expect(clearAgentBusy).toHaveBeenCalledWith("email-history-poll");
  });

  // -----------------------------------------------------------------------
  // runMetaSync
  // -----------------------------------------------------------------------

  it("skips meta sync when already busy", async () => {
    isAgentBusy.mockReturnValue(true);
    const result = await runMetaSync();
    expect(result).toBe("Meta sync is already running.");
    expect(runClaude).not.toHaveBeenCalled();
  });

  it("runs meta sync via runClaude and returns result", async () => {
    runClaude.mockResolvedValue({ text: "Synced 8 campaigns.", success: true });

    const result = await runMetaSync({ notify: false });
    expect(result).toBe("Synced 8 campaigns.");
    expect(runClaude).toHaveBeenCalledWith(
      expect.objectContaining({ maxTurns: 20 }),
    );
    expect(clearAgentBusy).toHaveBeenCalledWith("meta-sync");
  });

  it("throws and notifies on meta sync failure", async () => {
    runClaude.mockResolvedValue({ text: "", success: false, error: "API rate limited" });

    await expect(runMetaSync({ notify: false })).rejects.toThrow("API rate limited");
    expect(clearAgentBusy).toHaveBeenCalledWith("meta-sync");
  });

  // -----------------------------------------------------------------------
  // runThinkCycle
  // -----------------------------------------------------------------------

  it("skips think cycle when already busy", async () => {
    isAgentBusy.mockReturnValue(true);
    const result = await runThinkCycle();
    expect(result).toBe("Think loop is already running.");
  });

  it("runs think cycle via runClaude with think prompt", async () => {
    runClaude.mockResolvedValue({ text: "Improved LEARNINGS.md.", success: true });

    const result = await runThinkCycle({ notify: false });
    expect(result).toBe("Improved LEARNINGS.md.");
    expect(runClaude).toHaveBeenCalledWith(
      expect.objectContaining({
        systemPromptName: "think",
        maxTurns: 15,
      }),
    );
    expect(clearAgentBusy).toHaveBeenCalledWith("think");
  });

  it("defers think cycle when memory-write resource is busy", async () => {
    withResourceLocks.mockRejectedValue(
      new ResourceBusyError("think", ["memory-write"], ["memory-write"]),
    );

    const result = await runThinkCycle({ notify: false });
    expect(result).toContain("deferred");
    expect(result).toContain("memory-write");
  });

  // -----------------------------------------------------------------------
  // runTmCheck (external sync pattern)
  // -----------------------------------------------------------------------

  it("skips TM check when already busy", async () => {
    isAgentBusy.mockReturnValue(true);
    const result = await runTmCheck({ notify: false });
    expect(result).toBe("TM One sync is already running.");
  });
});
