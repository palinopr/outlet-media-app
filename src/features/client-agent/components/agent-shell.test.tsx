import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AgentShell } from "./agent-shell";

const fetchMock = vi.fn();

function makeJsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function makeThreadSummary({
  createdAt,
  lastMessageAt,
  previewText,
  referencedEntities = [],
  threadId,
  title,
  updatedAt,
  lastResponseStatus = null,
}: {
  createdAt: string;
  lastMessageAt: string;
  previewText: string | null;
  referencedEntities?: never[];
  threadId: string;
  title: string;
  updatedAt: string;
  lastResponseStatus?: "answer" | "clarify" | "refuse" | "error" | "pending" | null;
}) {
  return {
    threadId,
    title,
    previewText,
    referencedEntities,
    lastResponseStatus,
    lastMessageAt,
    updatedAt,
    createdAt,
  };
}

describe("AgentShell", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders updated customer prompt chips and omits event prompt chips when events are disabled", () => {
    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={false}
        initialThreads={[]}
        slug="acme"
        viewer="member"
      />,
    );

    expect(screen.getByText("Ask anything about your campaigns and events")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How are my campaigns doing this month?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "What changed this week?" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "What was my last show?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "How did my last show do?" })).not.toBeInTheDocument();
  });

  it("shows natural event prompt chips when events are enabled", () => {
    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[]}
        slug="acme"
        viewer="member"
      />,
    );

    expect(screen.getByRole("button", { name: "What was my last show?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How did my last show do?" })).toBeInTheDocument();
  });

  it("queues a turn, keeps the optimistic user message, polls the thread, and merges the durable result", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("client_request_1");

    let threadFetchCount = 0;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/thread_older") && init?.method !== "POST") {
        threadFetchCount += 1;

        if (threadFetchCount === 1) {
          return Promise.resolve(
            makeJsonResponse({
              thread: {
                threadId: "thread_older",
                title: "Older thread",
                previewText: "Older preview",
                referencedEntities: [],
                lastResponseStatus: "answer",
                lastMessageAt: "2020-04-01T12:00:00.000Z",
                updatedAt: "2020-04-01T12:00:00.000Z",
                createdAt: "2020-04-01T12:00:00.000Z",
                messages: [],
              },
            }),
          );
        }

        if (threadFetchCount === 2) {
          return Promise.resolve(
            makeJsonResponse({
              thread: {
                threadId: "thread_older",
                title: "Older thread",
                previewText: "Thinking…",
                referencedEntities: [],
                lastResponseStatus: "pending",
                lastMessageAt: "2020-04-01T12:01:00.000Z",
                updatedAt: "2020-04-01T12:01:00.000Z",
                createdAt: "2020-04-01T12:00:00.000Z",
                messages: [
                  {
                    messageId: "message_user_1",
                    role: "user",
                    status: null,
                    text: "How are my campaigns doing this month?",
                    blocks: [],
                    referencedEntities: [],
                    contextPayload: null,
                    resolvedRange: null,
                    providerResponseId: null,
                    clientGeneratedId: "client_request_1",
                    agentTaskId: "task_1",
                    clientRequestId: "client_request_1",
                    createdAt: "2020-04-01T12:00:01.000Z",
                  },
                  {
                    messageId: "assistant_pending_1",
                    role: "assistant",
                    status: "pending",
                    text: "Thinking…",
                    blocks: [],
                    referencedEntities: [],
                    contextPayload: null,
                    resolvedRange: null,
                    providerResponseId: null,
                    clientGeneratedId: null,
                    agentTaskId: "task_1",
                    clientRequestId: "client_request_1",
                    createdAt: "2020-04-01T12:00:02.000Z",
                  },
                ],
              },
            }),
          );
        }

        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_older",
              title: "Older thread",
              previewText: "Campaigns are pacing above goal.",
              referencedEntities: [
                {
                  entityId: "cmp_1",
                  entityType: "campaign",
                  name: "Campaign 1",
                },
              ],
              lastResponseStatus: "answer",
              lastMessageAt: "2030-04-01T12:01:02.000Z",
              updatedAt: "2030-04-01T12:01:02.000Z",
              createdAt: "2020-04-01T12:00:00.000Z",
              messages: [
                {
                  messageId: "message_user_1",
                  role: "user",
                  status: null,
                  text: "How are my campaigns doing this month?",
                  blocks: [],
                  referencedEntities: [],
                  contextPayload: null,
                  resolvedRange: null,
                  providerResponseId: null,
                  clientGeneratedId: "client_request_1",
                  agentTaskId: "task_1",
                  clientRequestId: "client_request_1",
                  createdAt: "2020-04-01T12:00:01.000Z",
                },
                {
                  messageId: "assistant_pending_1",
                  role: "assistant",
                  status: "answer",
                  text: "Campaigns are pacing above goal.",
                  blocks: [],
                  referencedEntities: [
                    {
                      entityId: "cmp_1",
                      entityType: "campaign",
                      name: "Campaign 1",
                    },
                  ],
                  contextPayload: null,
                  resolvedRange: null,
                  providerResponseId: "resp_1",
                  clientGeneratedId: null,
                  agentTaskId: "task_1",
                  clientRequestId: "client_request_1",
                  createdAt: "2020-04-01T12:00:02.000Z",
                },
              ],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_older/messages") && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}"));
        expect(body).toEqual(
          expect.objectContaining({
            message: "How are my campaigns doing this month?",
            client_request_id: "client_request_1",
          }),
        );
        expect(body.history).toBeUndefined();

        return Promise.resolve(
          makeJsonResponse({
            status: "queued",
            thread_id: "thread_older",
            client_request_id: "client_request_1",
            task_id: "task_1",
            assistant_message_id: "assistant_pending_1",
          }, 202),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_new") && init?.method !== "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_new",
              title: "New thread",
              previewText: "New preview",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2020-04-01T12:10:00.000Z",
              updatedAt: "2020-04-01T12:10:00.000Z",
              createdAt: "2020-04-01T12:10:00.000Z",
              messages: [],
            },
          }),
        );
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "thread_new",
            title: "Newer thread",
            previewText: "Newer preview",
            lastResponseStatus: "answer",
            lastMessageAt: "2020-04-01T12:10:00.000Z",
            updatedAt: "2020-04-01T12:10:00.000Z",
            createdAt: "2020-04-01T12:10:00.000Z",
          }),
          makeThreadSummary({
            threadId: "thread_older",
            title: "Older thread",
            previewText: "Older preview",
            lastResponseStatus: "answer",
            lastMessageAt: "2020-04-01T12:00:00.000Z",
            updatedAt: "2020-04-01T12:00:00.000Z",
            createdAt: "2020-04-01T12:00:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Older thread/ }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads/thread_older",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "How are my campaigns doing this month?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("How are my campaigns doing this month?")).toBeInTheDocument();
    expect(await screen.findAllByText("Thinking…")).toHaveLength(2);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/client/acme/agent/threads/thread_older/messages",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"client_request_id\":\"client_request_1\""),
      }),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(screen.getAllByText("Campaigns are pacing above goal.")).toHaveLength(2);
    expect(screen.queryByText("Thinking…")).not.toBeInTheDocument();
    const reorderedThreadButtons = screen.getAllByRole("button", { name: /thread/i });
    expect(reorderedThreadButtons[0]).toHaveTextContent("Older thread");
    expect(reorderedThreadButtons[1]).toHaveTextContent("Newer thread");
  });

  it("deduplicates optimistic rows when the same client request id is retried", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("client_request_1");

    let firstPoll = true;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/thread_older") && init?.method !== "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_older",
              title: "Older thread",
              previewText: "Older preview",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-04-01T12:00:00.000Z",
              updatedAt: "2026-04-01T12:00:00.000Z",
              createdAt: "2026-04-01T12:00:00.000Z",
              messages: [],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_older/messages") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            status: "queued",
            thread_id: "thread_older",
            client_request_id: "client_request_1",
            task_id: "task_1",
            assistant_message_id: "assistant_pending_1",
          }, 202),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_older")) {
        return new Promise<Response>((resolve) => {
          if (firstPoll) {
            firstPoll = false;
          }
          void resolve;
        });
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "thread_older",
            title: "Older thread",
            previewText: "Older preview",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:00:00.000Z",
            updatedAt: "2026-04-01T12:00:00.000Z",
            createdAt: "2026-04-01T12:00:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Older thread/ }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads/thread_older",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "Retry me" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Retry me")).toBeInTheDocument();
    expect(await screen.findByText("Thinking…")).toBeInTheDocument();

    fireEvent.change(composer, { target: { value: "Retry me" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getAllByText("Retry me")).toHaveLength(1);
    expect(screen.getAllByText("Thinking…")).toHaveLength(1);
  });

  it("aborts polling when the user switches threads", async () => {
    let capturedSignal: AbortSignal | null = null;
    let resolvePoll: ((value: Response) => void) | null = null;
    let threadAFetchCount = 0;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/thread_a") && init?.method !== "POST") {
        threadAFetchCount += 1;
        if (threadAFetchCount === 1) {
          return Promise.resolve(
            makeJsonResponse({
              thread: {
                threadId: "thread_a",
                title: "Thread A",
                previewText: "Preview A",
                referencedEntities: [],
                lastResponseStatus: "answer",
                lastMessageAt: "2026-04-01T12:00:00.000Z",
                updatedAt: "2026-04-01T12:00:00.000Z",
                createdAt: "2026-04-01T12:00:00.000Z",
                messages: [],
              },
            }),
          );
        }

        return new Promise<Response>((resolve) => {
          capturedSignal = init?.signal as AbortSignal | null;
          resolvePoll = resolve;
        });
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_b") && init?.method !== "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_b",
              title: "Thread B",
              previewText: "Preview B",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-04-01T12:10:00.000Z",
              updatedAt: "2026-04-01T12:10:00.000Z",
              createdAt: "2026-04-01T12:10:00.000Z",
              messages: [],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_a/messages") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            status: "queued",
            thread_id: "thread_a",
            client_request_id: "client_request_1",
            task_id: "task_1",
            assistant_message_id: "assistant_pending_1",
          }, 202),
        );
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "thread_a",
            title: "Thread A",
            previewText: "Preview A",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:00:00.000Z",
            updatedAt: "2026-04-01T12:00:00.000Z",
            createdAt: "2026-04-01T12:00:00.000Z",
          }),
          makeThreadSummary({
            threadId: "thread_b",
            title: "Thread B",
            previewText: "Preview B",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:10:00.000Z",
            updatedAt: "2026-04-01T12:10:00.000Z",
            createdAt: "2026-04-01T12:10:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Thread A/ }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads/thread_a",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "Switch me" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(capturedSignal).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: /Thread B/ }));
    await waitFor(() => {
      expect(capturedSignal).not.toBeNull();
      if (!capturedSignal) {
        throw new Error("Expected polling signal to be captured");
      }
      expect(capturedSignal.aborted).toBe(true);
    });

    expect(resolvePoll).not.toBeNull();
    if (!resolvePoll) {
      throw new Error("Expected polling response resolver to be captured");
    }
    const pollResolver = resolvePoll as (value: Response) => void;

    pollResolver(
      makeJsonResponse({
        thread: {
          threadId: "thread_a",
          title: "Thread A",
          previewText: "Final answer",
          referencedEntities: [],
          lastResponseStatus: "answer",
          lastMessageAt: "2026-04-01T12:01:00.000Z",
          updatedAt: "2026-04-01T12:01:00.000Z",
          createdAt: "2026-04-01T12:00:00.000Z",
          messages: [],
        },
      }),
    );

    expect(screen.queryByText("Final answer")).not.toBeInTheDocument();
  });

  it("keeps another thread composer active while a different thread send is still posting", async () => {
    let resolveSend: ((value: Response) => void) | null = null;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/thread_a") && init?.method !== "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_a",
              title: "Thread A",
              previewText: "Preview A",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-04-01T12:00:00.000Z",
              updatedAt: "2026-04-01T12:00:00.000Z",
              createdAt: "2026-04-01T12:00:00.000Z",
              messages: [],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_b") && init?.method !== "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_b",
              title: "Thread B",
              previewText: "Preview B",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-04-01T12:10:00.000Z",
              updatedAt: "2026-04-01T12:10:00.000Z",
              createdAt: "2026-04-01T12:10:00.000Z",
              messages: [],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_a/messages") && init?.method === "POST") {
        return new Promise<Response>((resolve) => {
          resolveSend = resolve;
        });
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "thread_a",
            title: "Thread A",
            previewText: "Preview A",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:00:00.000Z",
            updatedAt: "2026-04-01T12:00:00.000Z",
            createdAt: "2026-04-01T12:00:00.000Z",
          }),
          makeThreadSummary({
            threadId: "thread_b",
            title: "Thread B",
            previewText: "Preview B",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:10:00.000Z",
            updatedAt: "2026-04-01T12:10:00.000Z",
            createdAt: "2026-04-01T12:10:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Thread A/ }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads/thread_a",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "Send on A" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(resolveSend).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: /Thread B/ }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads/thread_b",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    const switchedComposer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    expect(switchedComposer).not.toBeDisabled();
    expect(screen.queryByText("Thinking…")).not.toBeInTheDocument();

    fireEvent.change(switchedComposer, { target: { value: "Thread B stays editable" } });
    expect(switchedComposer).toHaveValue("Thread B stays editable");

    expect(resolveSend).not.toBeNull();
    if (!resolveSend) {
      throw new Error("Expected send resolver to be captured");
    }
    const sendResolver = resolveSend as (value: Response) => void;
    sendResolver(
      makeJsonResponse({
        status: "queued",
        thread_id: "thread_a",
        client_request_id: "client_request_1",
        task_id: "task_1",
        assistant_message_id: "assistant_pending_1",
      }, 202),
    );
  });

  it("retries polling after a transient refresh failure while the assistant is still pending", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("client_request_1");

    let pollAttempt = 0;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/thread_older") && init?.method !== "POST") {
        pollAttempt += 1;

        if (pollAttempt === 1) {
          return Promise.resolve(
            makeJsonResponse({
              thread: {
                threadId: "thread_older",
                title: "Older thread",
                previewText: "Older preview",
                referencedEntities: [],
                lastResponseStatus: "answer",
                lastMessageAt: "2026-04-01T12:00:00.000Z",
                updatedAt: "2026-04-01T12:00:00.000Z",
                createdAt: "2026-04-01T12:00:00.000Z",
                messages: [],
              },
            }),
          );
        }

        if (pollAttempt === 2) {
          return Promise.resolve(
            makeJsonResponse({ error: "temporary outage" }, 500),
          );
        }

        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_older",
              title: "Older thread",
              previewText: "Recovered answer",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-04-01T12:02:00.000Z",
              updatedAt: "2026-04-01T12:02:00.000Z",
              createdAt: "2026-04-01T12:00:00.000Z",
              messages: [
                {
                  messageId: "message_user_1",
                  role: "user",
                  status: null,
                  text: "Recover please",
                  blocks: [],
                  referencedEntities: [],
                  contextPayload: null,
                  resolvedRange: null,
                  providerResponseId: null,
                  clientGeneratedId: "client_request_1",
                  agentTaskId: "task_1",
                  clientRequestId: "client_request_1",
                  createdAt: "2026-04-01T12:00:01.000Z",
                },
                {
                  messageId: "assistant_pending_1",
                  role: "assistant",
                  status: "answer",
                  text: "Recovered answer",
                  blocks: [],
                  referencedEntities: [],
                  contextPayload: null,
                  resolvedRange: null,
                  providerResponseId: "resp_1",
                  clientGeneratedId: null,
                  agentTaskId: "task_1",
                  clientRequestId: "client_request_1",
                  createdAt: "2026-04-01T12:02:00.000Z",
                },
              ],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_older/messages") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            status: "queued",
            thread_id: "thread_older",
            client_request_id: "client_request_1",
            task_id: "task_1",
            assistant_message_id: "assistant_pending_1",
          }, 202),
        );
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "thread_older",
            title: "Older thread",
            previewText: "Older preview",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:00:00.000Z",
            updatedAt: "2026-04-01T12:00:00.000Z",
            createdAt: "2026-04-01T12:00:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Older thread/ }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads/thread_older",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "Recover please" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText("Thinking…")).toBeInTheDocument();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(await screen.findAllByText("Recovered answer")).toHaveLength(2);
    expect(screen.queryByText("Thinking…")).not.toBeInTheDocument();
  }, 15000);

  it("does not let a stale initial thread load overwrite a newer pending thread summary", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("client_request_1");

    let resolveInitialLoad: ((value: Response) => void) | null = null;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/thread_a") && init?.method !== "POST") {
        return new Promise<Response>((resolve) => {
          resolveInitialLoad = resolve;
        });
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_b") && init?.method !== "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_b",
              title: "Thread B",
              previewText: "Preview B",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-04-01T12:10:00.000Z",
              updatedAt: "2026-04-01T12:10:00.000Z",
              createdAt: "2026-04-01T12:10:00.000Z",
              messages: [],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_a/messages") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            status: "queued",
            thread_id: "thread_a",
            client_request_id: "client_request_1",
            task_id: "task_1",
            assistant_message_id: "assistant_pending_1",
          }, 202),
        );
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "thread_a",
            title: "Thread A",
            previewText: "Preview A",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:00:00.000Z",
            updatedAt: "2026-04-01T12:00:00.000Z",
            createdAt: "2026-04-01T12:00:00.000Z",
          }),
          makeThreadSummary({
            threadId: "thread_b",
            title: "Thread B",
            previewText: "Preview B",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:10:00.000Z",
            updatedAt: "2026-04-01T12:10:00.000Z",
            createdAt: "2026-04-01T12:10:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Thread A/ }));
    await waitFor(() => {
      expect(resolveInitialLoad).not.toBeNull();
    });

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "Keep A pending" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getAllByText("Thinking…")).toHaveLength(2);
    });

    expect(resolveInitialLoad).not.toBeNull();
    if (!resolveInitialLoad) {
      throw new Error("Expected initial thread load resolver to be captured");
    }
    const initialThreadLoadResolver = resolveInitialLoad as (value: Response) => void;
    initialThreadLoadResolver(
      makeJsonResponse({
        thread: {
          threadId: "thread_a",
          title: "Thread A",
          previewText: "Preview A",
          referencedEntities: [],
          lastResponseStatus: "answer",
          lastMessageAt: "2026-04-01T12:00:00.000Z",
          updatedAt: "2026-04-01T12:00:00.000Z",
          createdAt: "2026-04-01T12:00:00.000Z",
          messages: [],
        },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: /Thread B/ }));
    await waitFor(() => {
      const threadAButton = screen.getByRole("button", { name: /Thread A/ });
      expect(threadAButton).toHaveTextContent("Thinking…");
      expect(threadAButton).not.toHaveTextContent("Preview A");
    });
  });

  it("aborts polling when the shell unmounts", async () => {
    let capturedSignal: AbortSignal | null = null;
    let threadAFetchCount = 0;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/thread_a") && init?.method !== "POST") {
        threadAFetchCount += 1;
        if (threadAFetchCount === 1) {
          return Promise.resolve(
            makeJsonResponse({
              thread: {
                threadId: "thread_a",
                title: "Thread A",
                previewText: "Preview A",
                referencedEntities: [],
                lastResponseStatus: "answer",
                lastMessageAt: "2026-04-01T12:00:00.000Z",
                updatedAt: "2026-04-01T12:00:00.000Z",
                createdAt: "2026-04-01T12:00:00.000Z",
                messages: [],
              },
            }),
          );
        }

        return new Promise<Response>((resolve) => {
          capturedSignal = init?.signal as AbortSignal | null;
          void resolve;
        });
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_a/messages") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            status: "queued",
            thread_id: "thread_a",
            client_request_id: "client_request_1",
            task_id: "task_1",
            assistant_message_id: "assistant_pending_1",
          }, 202),
        );
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    const { unmount } = render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "thread_a",
            title: "Thread A",
            previewText: "Preview A",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:00:00.000Z",
            updatedAt: "2026-04-01T12:00:00.000Z",
            createdAt: "2026-04-01T12:00:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Thread A/ }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads/thread_a",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "Unmount me" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(capturedSignal).not.toBeNull();
    });

    unmount();

    expect(capturedSignal).not.toBeNull();
    if (!capturedSignal) {
      throw new Error("Expected polling signal to be captured");
    }
    const abortedSignal = capturedSignal as AbortSignal;
    expect(abortedSignal.aborted).toBe(true);
  });

  it("loads persisted preview threads for the owning admin preview user", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads/preview_thread") && init?.method !== "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "preview_thread",
              title: "Preview thread",
              previewText: "Preview answer",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-04-01T12:00:00.000Z",
              updatedAt: "2026-04-01T12:00:00.000Z",
              createdAt: "2026-04-01T12:00:00.000Z",
              messages: [
                {
                  messageId: "assistant_preview_1",
                  role: "assistant",
                  status: "answer",
                  text: "Preview answer",
                  blocks: [],
                  referencedEntities: [],
                  contextPayload: null,
                  resolvedRange: null,
                  providerResponseId: "resp_preview_1",
                  clientGeneratedId: null,
                  agentTaskId: "task_preview_1",
                  clientRequestId: "client_request_preview_1",
                  createdAt: "2026-04-01T12:00:00.000Z",
                },
              ],
            },
          }),
        );
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          makeThreadSummary({
            threadId: "preview_thread",
            title: "Preview thread",
            previewText: "Preview answer",
            lastResponseStatus: "answer",
            lastMessageAt: "2026-04-01T12:00:00.000Z",
            updatedAt: "2026-04-01T12:00:00.000Z",
            createdAt: "2026-04-01T12:00:00.000Z",
          }),
        ]}
        slug="acme"
        viewer="admin_preview"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Preview thread/ }));

    expect(await screen.findByText("Preview answer")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/client/acme/agent/threads/preview_thread",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
