import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const runClaudeMock = vi.fn();
const runMetaSyncMock = vi.fn();
const runTmCheckMock = vi.fn();
const getAgentForChannelMock = vi.fn();
const withResourceLocksMock = vi.fn(async (_owner: string, _resources: string[], work: () => Promise<unknown>) => {
  return await work();
});
const processGmailHistoryPushMock = vi.fn();
const processWhatsAppTaskMock = vi.fn();
const processClientAgentTaskMock = vi.fn();

vi.mock("../runner.js", () => ({
  runClaude: runClaudeMock,
}));

vi.mock("../scheduler.js", () => ({
  runMetaSync: runMetaSyncMock,
  runTmCheck: runTmCheckMock,
}));

vi.mock("../discord/core/router.js", () => ({
  getAgentForChannel: getAgentForChannelMock,
}));

vi.mock("../state.js", () => ({
  ResourceBusyError: class ResourceBusyError extends Error {
    blockers: string[];

    constructor(blockers: string[]) {
      super("busy");
      this.blockers = blockers;
    }
  },
  withResourceLocks: withResourceLocksMock,
}));

vi.mock("./gmail-watch-service.js", () => ({
  processGmailHistoryPush: processGmailHistoryPushMock,
}));

vi.mock("./whatsapp-cloud-service.js", () => ({
  processWhatsAppTask: processWhatsAppTaskMock,
}));

vi.mock("./supabase-service.js", () => ({
  getServiceSupabase: vi.fn(() => null),
}));

vi.mock("./system-events-service.js", () => ({
  buildAgentActivityDigest: vi.fn(() => "activity digest"),
  listRecentAgentActivity: vi.fn(async () => []),
  safeLogAgentTaskDeferred: vi.fn(),
  safeLogAgentTaskRequested: vi.fn(),
  safeLogAgentTaskStarted: vi.fn(),
  safeLogAgentTaskStatus: vi.fn(),
}));

vi.mock("../client-agent/task-processor.js", () => ({
  processClientAgentTask: processClientAgentTaskMock,
}));

describe("external-task-dispatcher", () => {
  beforeEach(() => {
    vi.resetModules();
    runClaudeMock.mockReset();
    runMetaSyncMock.mockReset();
    runTmCheckMock.mockReset();
    getAgentForChannelMock.mockReset();
    processGmailHistoryPushMock.mockReset();
    processWhatsAppTaskMock.mockReset();
    processClientAgentTaskMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("treats client portal reply jobs as external work and routes them to the client agent processor", async () => {
    processClientAgentTaskMock.mockResolvedValue("Client reply sent.");

    const { executeTask, isExternalTask } = await import("./external-task-dispatcher.js");
    const task = {
      id: "task_1",
      from_agent: "client-portal",
      to_agent: "client-agent",
      action: "reply",
      params: {},
      tier: "green" as const,
      status: "pending",
    };

    expect(isExternalTask(task)).toBe(true);
    const result = await executeTask(task);

    expect(processClientAgentTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from_agent: "client-portal",
        to_agent: "client-agent",
      }),
    );
    expect(result).toBe("Client reply sent.");
  });

  it("keeps the existing web-admin, gmail-push, and whatsapp-cloud task families working", async () => {
    getAgentForChannelMock.mockReturnValue({
      promptFile: "boss",
      maxTurns: 8,
    });
    runClaudeMock.mockResolvedValue({
      success: true,
      text: "Executive summary",
    });
    processGmailHistoryPushMock.mockResolvedValue("Processed Gmail push.");
    processWhatsAppTaskMock.mockResolvedValue("Processed WhatsApp task.");

    const { executeTask, isExternalTask } = await import("./external-task-dispatcher.js");

    const webAdminResult = await executeTask({
      id: "task_web",
      from_agent: "web-admin",
      to_agent: "assistant",
      action: "brief",
      params: {},
      tier: "green",
      status: "pending",
    });
    const gmailResult = await executeTask({
      id: "task_gmail",
      from_agent: "gmail-push",
      to_agent: "assistant",
      action: "history",
      params: { historyId: "42" },
      tier: "green",
      status: "pending",
    });
    const whatsappResult = await executeTask({
      id: "task_wa",
      from_agent: "whatsapp-cloud",
      to_agent: "assistant",
      action: "triage",
      params: {},
      tier: "green",
      status: "pending",
    });

    expect(isExternalTask({
      id: "task_web",
      from_agent: "web-admin",
      to_agent: "assistant",
      action: "brief",
      params: {},
      tier: "green",
      status: "pending",
    })).toBe(true);
    expect(isExternalTask({
      id: "task_gmail",
      from_agent: "gmail-push",
      to_agent: "assistant",
      action: "history",
      params: { historyId: "42" },
      tier: "green",
      status: "pending",
    })).toBe(true);
    expect(isExternalTask({
      id: "task_wa",
      from_agent: "whatsapp-cloud",
      to_agent: "assistant",
      action: "triage",
      params: {},
      tier: "green",
      status: "pending",
    })).toBe(true);
    expect(webAdminResult).toBe("Executive summary");
    expect(gmailResult).toBe("Processed Gmail push.");
    expect(whatsappResult).toBe("Processed WhatsApp task.");
    expect(processClientAgentTaskMock).not.toHaveBeenCalled();
  });
});
