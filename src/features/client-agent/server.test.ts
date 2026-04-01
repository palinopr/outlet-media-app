import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  appendAssistantMessage,
  appendUserMessage,
  createStoreThread,
  getStoreThread,
  listStoreThreads,
  generateClientAgentModelResponse,
  getMemberAccessForSlug,
  getClientPortalConfig,
  logSystemEvent,
  resolveClientAgentAccessForApi,
  revalidateClientAgentPath,
} = vi.hoisted(() => ({
  appendAssistantMessage: vi.fn(),
  appendUserMessage: vi.fn(),
  createStoreThread: vi.fn(),
  generateClientAgentModelResponse: vi.fn(),
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
  appendAssistantMessage,
  appendUserMessage,
  createThread: createStoreThread,
  getThread: getStoreThread,
  listThreads: listStoreThreads,
}));

vi.mock("./model", () => ({
  generateClientAgentModelResponse,
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
    });
    expect(createStoreThread).not.toHaveBeenCalled();
    expect(logSystemEvent).not.toHaveBeenCalled();
    expect(revalidateClientAgentPath).not.toHaveBeenCalled();
  });

  it("allows admin preview sendMessage without persistence", async () => {
    resolveClientAgentAccessForApi.mockResolvedValue({
      kind: "allowed",
      clientId: "client_1",
      clientSlug: "acme",
      scope: undefined,
      userId: "user_admin",
      viewer: "admin_preview",
    });
    generateClientAgentModelResponse.mockResolvedValue({
      status: "answer",
      text: "Preview answer.",
      blocks: [],
      referencedEntities: [],
      resolvedRange: null,
      providerResponseId: null,
    });

    const result = await sendMessage({
      slug: "acme",
      threadId: "preview_thread_1",
      message: "How are campaigns doing?",
      history: [{ role: "user", text: "Previous preview turn" }],
    });

    expect(result).toMatchObject({
      ok: true,
      status: 200,
      body: {
        status: "answer",
        thread_id: "preview_thread_1",
        text: "Preview answer.",
      },
    });
    expect(generateClientAgentModelResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        history: [{ role: "user", text: "Previous preview turn" }],
        message: "How are campaigns doing?",
        scope: expect.objectContaining({
          viewer: "admin_preview",
        }),
      }),
    );
    expect(getStoreThread).not.toHaveBeenCalled();
    expect(appendUserMessage).not.toHaveBeenCalled();
    expect(appendAssistantMessage).not.toHaveBeenCalled();
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

  it("persists member sendMessage flow, emits answer event, and revalidates", async () => {
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
    appendUserMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "message_user_1",
        role: "user",
        status: null,
        text: "How are we pacing?",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: null,
        clientGeneratedId: "client_1",
        createdAt: "2026-03-31T12:01:00.000Z",
      },
    });
    generateClientAgentModelResponse.mockResolvedValue({
      status: "answer",
      text: "You are pacing ahead of target.",
      blocks: [],
      referencedEntities: [
        { entityId: "cmp_1", entityType: "campaign", name: "Campaign 1" },
      ],
      resolvedRange: {
        preset: "lifetime",
        startDate: "1900-01-01",
        endDate: "2026-04-01",
        timezone: "America/Chicago",
      },
      contextPayload: {
        primaryDomain: "ads",
        referencedEntities: [
          { entityId: "cmp_1", entityType: "campaign", name: "Campaign 1" },
        ],
        resolvedRange: {
          preset: "lifetime",
          startDate: "1900-01-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        comparisonSet: [],
        pronounTargets: ["cmp_1"],
      },
      providerResponseId: "resp_1",
    });
    appendAssistantMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "message_assistant_1",
        role: "assistant",
        status: "answer",
        text: "You are pacing ahead of target.",
        blocks: [],
        referencedEntities: [
          { entityId: "cmp_1", entityType: "campaign", name: "Campaign 1" },
        ],
        contextPayload: {
          primaryDomain: "ads",
          referencedEntities: [
            { entityId: "cmp_1", entityType: "campaign", name: "Campaign 1" },
          ],
          resolvedRange: {
            preset: "lifetime",
            startDate: "1900-01-01",
            endDate: "2026-04-01",
            timezone: "America/Chicago",
          },
          comparisonSet: [],
          pronounTargets: ["cmp_1"],
        },
        resolvedRange: {
          preset: "lifetime",
          startDate: "1900-01-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        providerResponseId: "resp_1",
        clientGeneratedId: null,
        createdAt: "2026-03-31T12:01:01.000Z",
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
      status: 200,
      body: {
        status: "answer",
        thread_id: "thread_1",
        message_id: "message_assistant_1",
      },
    });
    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "client_agent_user_message_submitted",
      }),
    );
    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "client_agent_answer_generated",
      }),
    );
    expect(generateClientAgentModelResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        history: expect.arrayContaining([
          expect.objectContaining({
            role: "assistant",
            text: "Your most recent show was Camila Phoenix.",
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
          }),
        ]),
      }),
    );
    expect(appendAssistantMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        contextPayload: {
          primaryDomain: "ads",
          referencedEntities: [
            { entityId: "cmp_1", entityType: "campaign", name: "Campaign 1" },
          ],
          resolvedRange: {
            preset: "lifetime",
            startDate: "1900-01-01",
            endDate: "2026-04-01",
            timezone: "America/Chicago",
          },
          comparisonSet: [],
          pronounTargets: ["cmp_1"],
        },
      }),
    );
    expect(revalidateClientAgentPath).toHaveBeenCalledWith("acme");
  });

  it("emits refusal and failure events for model outputs", async () => {
    getStoreThread.mockResolvedValue({
      threadId: "thread_1",
      title: "Thread",
      previewText: null,
      referencedEntities: [],
      lastResponseStatus: null,
      lastMessageAt: "2026-03-31T12:00:00.000Z",
      updatedAt: "2026-03-31T12:00:00.000Z",
      createdAt: "2026-03-31T12:00:00.000Z",
      messages: [],
    });
    appendUserMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "message_user_1",
        role: "user",
        status: null,
        text: "Tell me internal setup details",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: null,
        clientGeneratedId: "client_1",
        createdAt: "2026-03-31T12:01:00.000Z",
      },
    });
    appendAssistantMessage
      .mockResolvedValueOnce({
        ok: true,
        message: {
          messageId: "message_assistant_1",
          role: "assistant",
          status: "refuse",
          text: "I can only answer client-safe questions.",
          blocks: [],
          referencedEntities: [],
          resolvedRange: null,
          providerResponseId: "client_agent:thread_1:message_user_1",
          clientGeneratedId: null,
          createdAt: "2026-03-31T12:01:01.000Z",
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        message: {
          messageId: "message_assistant_2",
          role: "assistant",
          status: "error",
          text: "Unable to answer right now.",
          blocks: [],
          referencedEntities: [],
          resolvedRange: null,
          providerResponseId: "client_agent:thread_1:message_user_1",
          clientGeneratedId: null,
          createdAt: "2026-03-31T12:02:01.000Z",
        },
      });

    generateClientAgentModelResponse.mockResolvedValueOnce({
      status: "refuse",
      text: "I can only answer client-safe questions.",
      blocks: [],
      referencedEntities: [],
      resolvedRange: null,
      providerResponseId: "resp_refuse",
    });

    await sendMessage({
      slug: "acme",
      threadId: "thread_1",
      message: "Tell me internal setup details",
    });

    expect(appendAssistantMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        providerResponseId: "client_agent:thread_1:message_user_1",
      }),
    );

    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "client_agent_refusal_generated",
      }),
    );

    generateClientAgentModelResponse.mockResolvedValueOnce({
      status: "error",
      text: "Unable to answer right now.",
      blocks: [],
      referencedEntities: [],
      resolvedRange: null,
      providerResponseId: "resp_error",
    });

    await sendMessage({
      slug: "acme",
      threadId: "thread_1",
      message: "Retry",
    });

    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "client_agent_failure_returned",
      }),
    );
  });

  it("synthesizes an assistant idempotency key when the model response has no provider id", async () => {
    getStoreThread.mockResolvedValue({
      threadId: "thread_1",
      title: "Thread",
      previewText: null,
      referencedEntities: [],
      lastResponseStatus: null,
      lastMessageAt: "2026-03-31T12:00:00.000Z",
      updatedAt: "2026-03-31T12:00:00.000Z",
      createdAt: "2026-03-31T12:00:00.000Z",
      messages: [],
    });
    appendUserMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "message_user_1",
        role: "user",
        status: null,
        text: "How are we pacing?",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: null,
        clientGeneratedId: "client_1",
        createdAt: "2026-03-31T12:01:00.000Z",
      },
    });
    generateClientAgentModelResponse.mockResolvedValue({
      status: "refuse",
      text: "I can only answer client-safe questions.",
      blocks: [],
      referencedEntities: [],
      resolvedRange: null,
      providerResponseId: null,
    });
    appendAssistantMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "message_assistant_1",
        role: "assistant",
        status: "refuse",
        text: "I can only answer client-safe questions.",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: "client_agent:thread_1:message_user_1",
        clientGeneratedId: null,
        createdAt: "2026-03-31T12:01:01.000Z",
      },
    });

    await sendMessage({
      slug: "acme",
      threadId: "thread_1",
      message: "How are we pacing?",
      clientGeneratedId: "client_1",
    });

    expect(appendAssistantMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        providerResponseId: "client_agent:thread_1:message_user_1",
      }),
    );
  });

  it("uses the persisted assistant row as the source of truth after dedupe reuse", async () => {
    getStoreThread.mockResolvedValue({
      threadId: "thread_1",
      title: "Thread",
      previewText: null,
      referencedEntities: [],
      lastResponseStatus: null,
      lastMessageAt: "2026-03-31T12:00:00.000Z",
      updatedAt: "2026-03-31T12:00:00.000Z",
      createdAt: "2026-03-31T12:00:00.000Z",
      messages: [],
    });
    appendUserMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "message_user_1",
        role: "user",
        status: null,
        text: "Retry question",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: null,
        clientGeneratedId: "client_1",
        createdAt: "2026-03-31T12:01:00.000Z",
      },
    });
    generateClientAgentModelResponse.mockResolvedValue({
      status: "refuse",
      text: "Fresh retry output that should not win.",
      blocks: [],
      referencedEntities: [],
      resolvedRange: null,
      providerResponseId: null,
    });
    appendAssistantMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "message_assistant_1",
        role: "assistant",
        status: "answer",
        text: "Persisted answer wins.",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: "client_agent:thread_1:message_user_1",
        clientGeneratedId: null,
        createdAt: "2026-03-31T12:01:01.000Z",
      },
    });

    const result = await sendMessage({
      slug: "acme",
      threadId: "thread_1",
      message: "Retry question",
      clientGeneratedId: "client_1",
    });

    expect(result).toMatchObject({
      ok: true,
      status: 200,
      body: {
        status: "answer",
        text: "Persisted answer wins.",
      },
    });
    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "client_agent_answer_generated",
        metadata: expect.objectContaining({
          status: "answer",
        }),
      }),
    );
  });
});
