import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createOrLoadPreviewThread,
  createStoreThread,
  getStoreThread,
  listStoreThreads,
  queueClientAgentTurn,
  getMemberAccessForSlug,
  getClientPortalConfig,
  logSystemEvent,
  resolveClientAgentAccessForApi,
  revalidateClientAgentPath,
} = vi.hoisted(() => ({
  createOrLoadPreviewThread: vi.fn(),
  createStoreThread: vi.fn(),
  queueClientAgentTurn: vi.fn(),
  getClientPortalConfig: vi.fn(),
  getMemberAccessForSlug: vi.fn(),
  getStoreThread: vi.fn(),
  listStoreThreads: vi.fn(),
  logSystemEvent: vi.fn(),
  resolveClientAgentAccessForApi: vi.fn(),
  revalidateClientAgentPath: vi.fn(),
}));

vi.mock("@/features/client-portal/access", () => ({
  resolveClientAgentAccessForApi,
}));

vi.mock("@/features/client-portal/config", () => ({
  getClientPortalConfig,
}));

vi.mock("@/lib/member-access", () => ({
  getMemberAccessForSlug,
}));

vi.mock("./store", () => ({
  createOrLoadPreviewThread,
  createThread: createStoreThread,
  getThread: getStoreThread,
  listThreads: listStoreThreads,
}));

vi.mock("./queue", () => ({
  queueClientAgentTurn,
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent,
}));

vi.mock("@/features/workflow/revalidation", () => ({
  revalidateClientAgentPath,
}));

import {
  createThread,
  getThread,
  listThreads,
  sendMessage,
} from "./server";

describe("client-agent server orchestration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    resolveClientAgentAccessForApi.mockResolvedValue({
      kind: "allowed",
      clientId: "client_1",
      clientSlug: "acme",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
      userId: "user_1",
      viewer: "member",
    });

    getClientPortalConfig.mockResolvedValue({
      agentEnabled: true,
      brandName: null,
      clientId: "client_1",
      eventsEnabled: true,
      logoAlt: null,
      logoUrl: null,
      reportsEnabled: true,
      slug: "acme",
    });

    getMemberAccessForSlug.mockResolvedValue({
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
      clientId: "client_1",
      clientName: "Acme",
      clientSlug: "acme",
      memberId: "member_1",
      role: "member",
      scope: "assigned",
    });
  });

  it("returns 401 for unauthenticated access", async () => {
    resolveClientAgentAccessForApi.mockResolvedValue({
      destination: "/sign-in",
      kind: "redirect",
      viewer: "member",
    });

    const result = await listThreads({ slug: "acme" });

    expect(result).toMatchObject({
      ok: false,
      status: 401,
    });
  });

  it("returns 500 when durable thread reads fail during list", async () => {
    listStoreThreads.mockRejectedValueOnce(new Error("read failed"));

    const result = await listThreads({ slug: "acme" });

    expect(result).toMatchObject({
      ok: false,
      status: 500,
      body: {
        error: "Unable to load agent state",
      },
    });
  });

  it("creates durable threads for members and logs + revalidates", async () => {
    createStoreThread.mockResolvedValue({
      ok: true,
      thread: {
        createdAt: "2026-03-31T12:00:00.000Z",
        lastMessageAt: "2026-03-31T12:00:00.000Z",
        lastResponseStatus: null,
        previewText: null,
        referencedEntities: [],
        threadId: "thread_1",
        title: null,
        updatedAt: "2026-03-31T12:00:00.000Z",
      },
    });

    const result = await createThread({ slug: "acme" });

    expect(result).toMatchObject({
      ok: true,
      status: 201,
      body: {
        thread: {
          threadId: "thread_1",
        },
      },
    });
    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "client_agent_thread_created",
      }),
    );
    expect(revalidateClientAgentPath).toHaveBeenCalledWith("acme");
  });

  it("skips persistence for admin preview createThread", async () => {
    createStoreThread.mockResolvedValue({
      ok: true,
      thread: {
        createdAt: "2026-03-31T12:00:00.000Z",
        lastMessageAt: "2026-03-31T12:00:00.000Z",
        lastResponseStatus: null,
        previewText: null,
        referencedEntities: [],
        threadId: "preview_thread_1",
        title: null,
        updatedAt: "2026-03-31T12:00:00.000Z",
      },
    });
    resolveClientAgentAccessForApi.mockResolvedValue({
      kind: "allowed",
      clientId: "client_1",
      clientSlug: "acme",
      scope: undefined,
      userId: "user_admin",
      viewer: "admin_preview",
    });

    const result = await createThread({ slug: "acme" });

    expect(result).toMatchObject({
      ok: true,
      status: 201,
      body: {
        thread: {
          threadId: "preview_thread_1",
        },
      },
    });
    expect(createStoreThread).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: expect.objectContaining({
          viewer: "admin_preview",
        }),
      }),
    );
    expect(logSystemEvent).not.toHaveBeenCalled();
    expect(revalidateClientAgentPath).not.toHaveBeenCalled();
  });

  it("queues admin preview sends through the durable store path without inline model execution", async () => {
    resolveClientAgentAccessForApi.mockResolvedValue({
      kind: "allowed",
      clientId: "client_1",
      clientSlug: "acme",
      scope: undefined,
      userId: "user_admin",
      viewer: "admin_preview",
    });
    createOrLoadPreviewThread.mockResolvedValue({
      ok: true,
      thread: {
        createdAt: "2026-03-31T12:00:00.000Z",
        lastMessageAt: "2026-03-31T12:00:00.000Z",
        lastResponseStatus: null,
        previewText: null,
        referencedEntities: [],
        threadId: "preview_thread_1",
        title: null,
        updatedAt: "2026-03-31T12:00:00.000Z",
      },
    });
    queueClientAgentTurn.mockResolvedValue({
      ok: true,
      queued: {
        assistantMessageId: "message_assistant_preview_1",
        clientRequestId: "client_request_preview_1",
        taskId: "task_preview_1",
        threadId: "preview_thread_1",
        userMessageId: "message_user_preview_1",
        wasExisting: false,
      },
    });

    const result = await sendMessage({
      slug: "acme",
      threadId: "preview_thread_1",
      message: "How are campaigns doing?",
      history: [{ role: "user", text: "Previous preview turn" }],
    });

    expect(result).toMatchObject({
      ok: true,
      status: 202,
      body: {
        status: "queued",
        task_id: "task_preview_1",
        assistant_message_id: "message_assistant_preview_1",
      },
    });
    expect(createOrLoadPreviewThread).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: expect.objectContaining({
          viewer: "admin_preview",
        }),
        threadId: "preview_thread_1",
      }),
    );
    expect(queueClientAgentTurn).toHaveBeenCalledWith(
      expect.objectContaining({
        clientGeneratedId: undefined,
        message: "How are campaigns doing?",
        threadId: "preview_thread_1",
      }),
    );
    expect(logSystemEvent).not.toHaveBeenCalled();
    expect(revalidateClientAgentPath).not.toHaveBeenCalled();
  });

  it("returns 404 for thread get when out of scope", async () => {
    getStoreThread.mockResolvedValue(null);

    const result = await getThread({
      slug: "acme",
      threadId: "thread_missing",
    });

    expect(result).toMatchObject({
      ok: false,
      status: 404,
    });
  });

  it("queues member sends and returns the queued response contract without inline model execution", async () => {
    getStoreThread.mockResolvedValue({
      threadId: "thread_1",
      title: "Thread",
      previewText: null,
      referencedEntities: [],
      lastResponseStatus: null,
      lastMessageAt: "2026-03-31T12:00:00.000Z",
      updatedAt: "2026-03-31T12:00:00.000Z",
      createdAt: "2026-03-31T12:00:00.000Z",
      messages: [
        {
          messageId: "message_assistant_prev",
          role: "assistant",
          status: "answer",
          text: "Your most recent show was Camila Phoenix.",
          blocks: [],
          referencedEntities: [
            { entityId: "evt_latest", entityType: "event", name: "Camila Phoenix" },
          ],
          contextPayload: {
            primaryDomain: "events",
            referencedEntities: [
              { entityId: "evt_latest", entityType: "event", name: "Camila Phoenix" },
            ],
            resolvedRange: {
              preset: "lifetime",
              startDate: "1900-01-01",
              endDate: "2026-04-01",
              timezone: "America/Chicago",
            },
            comparisonSet: [],
            pronounTargets: ["evt_latest"],
          },
          resolvedRange: null,
          providerResponseId: "resp_previous",
          clientGeneratedId: null,
          createdAt: "2026-03-31T11:59:00.000Z",
        },
      ],
    });
    queueClientAgentTurn.mockResolvedValue({
      ok: true,
      queued: {
        assistantMessageId: "message_assistant_1",
        clientRequestId: "client_1",
        taskId: "task_1",
        threadId: "thread_1",
        userMessageId: "message_user_1",
        wasExisting: false,
      },
    });

    const result = await sendMessage({
      slug: "acme",
      threadId: "thread_1",
      message: "How are we pacing?",
      clientGeneratedId: "client_1",
    });

    expect(result).toMatchObject({
      ok: true,
      status: 202,
      body: {
        status: "queued",
        task_id: "task_1",
        assistant_message_id: "message_assistant_1",
      },
    });
    expect(queueClientAgentTurn).toHaveBeenCalledWith(
      expect.objectContaining({
        clientGeneratedId: "client_1",
        message: "How are we pacing?",
        scope: expect.objectContaining({
          viewer: "member",
        }),
        threadId: "thread_1",
      }),
    );
    expect(logSystemEvent).not.toHaveBeenCalled();
    expect(revalidateClientAgentPath).not.toHaveBeenCalled();
  });

  it("returns 500 when durable thread reads fail before queueing a member send", async () => {
    getStoreThread.mockRejectedValueOnce(new Error("read failed"));

    const result = await sendMessage({
      slug: "acme",
      threadId: "thread_1",
      message: "How are we pacing?",
    });

    expect(result).toMatchObject({
      ok: false,
      status: 500,
      body: {
        error: "Unable to load agent state",
      },
    });
  });

  it("keeps the server path free of the hosted model import", () => {
    const source = readFileSync(join(import.meta.dirname, "server.ts"), "utf8");

    expect(source).not.toContain("generateClientAgentModelResponse");
    expect(source).not.toContain("./model");
  });
});
