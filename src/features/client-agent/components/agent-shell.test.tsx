import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("AgentShell", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
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

  it("creates a new chat, loads a thread, submits a message optimistically, and keeps the chat text-only", async () => {
    let resolvePendingMessage: ((value: Response) => void) | undefined;

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_new",
              title: null,
              previewText: null,
              referencedEntities: [],
              lastResponseStatus: null,
              lastMessageAt: "2026-03-31T12:00:00.000Z",
              updatedAt: "2026-03-31T12:00:00.000Z",
              createdAt: "2026-03-31T12:00:00.000Z",
              messages: [],
            },
          }, 201),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_1")) {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_1",
              title: "Saved thread",
              previewText: "Latest preview",
              referencedEntities: [],
              lastResponseStatus: "answer",
              lastMessageAt: "2026-03-31T12:00:00.000Z",
              updatedAt: "2026-03-31T12:00:00.000Z",
              createdAt: "2026-03-31T12:00:00.000Z",
              messages: [
                {
                  messageId: "assistant_saved",
                  role: "assistant",
                  status: "answer",
                  text: "Saved answer",
                  blocks: [],
                  referencedEntities: [],
                  resolvedRange: null,
                  providerResponseId: "resp_saved",
                  clientGeneratedId: null,
                  createdAt: "2026-03-31T12:00:01.000Z",
                },
              ],
            },
          }),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_new/messages")) {
        return new Promise<Response>((resolve) => {
          resolvePendingMessage = resolve;
        });
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[
          {
            threadId: "thread_1",
            title: "Saved thread",
            previewText: "Latest preview",
            referencedEntities: [],
            lastResponseStatus: "answer",
            lastMessageAt: "2026-03-31T12:00:00.000Z",
            updatedAt: "2026-03-31T12:00:00.000Z",
            createdAt: "2026-03-31T12:00:00.000Z",
          },
        ]}
        slug="acme"
        viewer="member"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Saved thread/ }));
    expect(await screen.findByText("Saved answer")).toBeInTheDocument();

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "How are my campaigns doing this month?" } });

    fireEvent.click(screen.getByRole("button", { name: "New chat" }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads",
        expect.objectContaining({ method: "POST" }),
      );
    });
    await waitFor(() => {
      expect(composer).toHaveValue("");
    });

    fireEvent.change(composer, { target: { value: "Show spend by date for Camila." } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Show spend by date for Camila.")).toBeInTheDocument();
    expect(await screen.findByText("Thinking…")).toBeInTheDocument();

    expect(resolvePendingMessage).toBeDefined();
    resolvePendingMessage!(
      makeJsonResponse({
        status: "clarify",
        thread_id: "thread_new",
        message_id: "assistant_1",
        text: "Which campaign do you mean?",
        blocks: [
          {
            type: "metric_cards",
            cards: [{ label: "Spend", value: "$4,200" }],
          },
          {
            type: "table",
            columns: ["Entity", "Metric"],
            rows: [{ Entity: "Campaign 1", Metric: "$4,200" }],
          },
          {
            type: "chart",
            xKey: "date",
            series: [
              {
                name: "Spend",
                points: [
                  { x: "2026-03-30", y: 4200 },
                  { x: "2026-03-31", y: 3800 },
                ],
              },
            ],
          },
        ],
        referenced_entities: [],
        resolved_range: null,
      }),
    );

    expect(await screen.findAllByText("Which campaign do you mean?")).toHaveLength(2);
    await waitFor(() => {
      expect(screen.queryByText("Thinking…")).not.toBeInTheDocument();
    });
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByTestId("answer-chart")).not.toBeInTheDocument();
    expect(screen.queryByText("Spend")).not.toBeInTheDocument();
    expect(screen.getByText("Clarification")).toBeInTheDocument();
  });

  it("allows unsaved preview chats for admins", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "preview_thread",
              title: null,
              previewText: null,
              referencedEntities: [],
              lastResponseStatus: null,
              lastMessageAt: "2026-03-31T12:00:00.000Z",
              updatedAt: "2026-03-31T12:00:00.000Z",
              createdAt: "2026-03-31T12:00:00.000Z",
              messages: [],
            },
          }, 201),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/preview_thread/messages")) {
        return Promise.resolve(
          makeJsonResponse({
            status: "answer",
            thread_id: "preview_thread",
            message_id: "preview_answer_1",
            text: "Preview answer",
            blocks: [],
            referenced_entities: [],
            resolved_range: null,
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
          {
            threadId: "thread_preview",
            title: "Preview thread",
            previewText: null,
            referencedEntities: [],
            lastResponseStatus: null,
            lastMessageAt: "2026-03-31T12:00:00.000Z",
            updatedAt: "2026-03-31T12:00:00.000Z",
            createdAt: "2026-03-31T12:00:00.000Z",
          },
        ]}
        slug="acme"
        viewer="admin_preview"
      />,
    );

    const textarea = screen.getByPlaceholderText("Ask a preview question. These chats are not saved.");
    expect(textarea).not.toBeDisabled();
    expect(
      screen.getByText("Preview mode can test the agent for Acme, but preview chats are not saved."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New chat" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "New chat" }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads",
        expect.objectContaining({ method: "POST" }),
      );
    });

    fireEvent.change(textarea, { target: { value: "How are campaigns doing?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findAllByText("Preview answer")).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/client/acme/agent/threads/preview_thread/messages",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"history\":[]"),
      }),
    );
  });

  it("reuses assistant context payload for preview follow-up turns", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "preview_thread",
              title: null,
              previewText: null,
              referencedEntities: [],
              lastResponseStatus: null,
              lastMessageAt: "2026-03-31T12:00:00.000Z",
              updatedAt: "2026-03-31T12:00:00.000Z",
              createdAt: "2026-03-31T12:00:00.000Z",
              messages: [],
            },
          }, 201),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/preview_thread/messages")) {
        const body = JSON.parse(String(init?.body ?? "{}"));

        if (body.message === "What was my last show?") {
          return Promise.resolve(
            makeJsonResponse({
              status: "answer",
              thread_id: "preview_thread",
              message_id: "preview_answer_1",
              text: "Your most recent show was Camila Phoenix.",
              blocks: [],
              referenced_entities: [
                {
                  entityId: "evt_1",
                  entityType: "event",
                  name: "Camila Phoenix",
                },
              ],
              context_payload: {
                primaryDomain: "events",
                referencedEntities: [
                  {
                    entityId: "evt_1",
                    entityType: "event",
                    name: "Camila Phoenix",
                  },
                ],
                resolvedRange: {
                  preset: "lifetime",
                  startDate: "1900-01-01",
                  endDate: "2026-04-01",
                  timezone: "America/Chicago",
                },
                comparisonSet: [],
                pronounTargets: ["evt_1"],
              },
              resolved_range: {
                preset: "lifetime",
                startDate: "1900-01-01",
                endDate: "2026-04-01",
                timezone: "America/Chicago",
              },
            }),
          );
        }

        return Promise.resolve(
          makeJsonResponse({
            status: "answer",
            thread_id: "preview_thread",
            message_id: "preview_answer_2",
            text: "The show before that was Ricardo Arjona in San Diego.",
            blocks: [],
            referenced_entities: [
              {
                entityId: "evt_2",
                entityType: "event",
                name: "Ricardo Arjona San Diego",
              },
            ],
            context_payload: {
              primaryDomain: "events",
              referencedEntities: [
                {
                  entityId: "evt_2",
                  entityType: "event",
                  name: "Ricardo Arjona San Diego",
                },
              ],
              resolvedRange: {
                preset: "lifetime",
                startDate: "1900-01-01",
                endDate: "2026-04-01",
                timezone: "America/Chicago",
              },
              comparisonSet: [],
              pronounTargets: ["evt_2"],
            },
            resolved_range: {
              preset: "lifetime",
              startDate: "1900-01-01",
              endDate: "2026-04-01",
              timezone: "America/Chicago",
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
        initialThreads={[]}
        slug="acme"
        viewer="admin_preview"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "New chat" }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/client/acme/agent/threads",
        expect.objectContaining({ method: "POST" }),
      );
    });

    const textarea = screen.getByPlaceholderText("Ask a preview question. These chats are not saved.");
    fireEvent.change(textarea, { target: { value: "What was my last show?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findAllByText("Your most recent show was Camila Phoenix.")).toHaveLength(2);

    fireEvent.change(textarea, { target: { value: "and before that?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findAllByText("The show before that was Ricardo Arjona in San Diego.")).toHaveLength(2);

    const secondMessageCall = fetchMock.mock.calls.find(
      (call) =>
        String(call[0]).endsWith("/api/client/acme/agent/threads/preview_thread/messages") &&
        String((call[1] as RequestInit | undefined)?.body ?? "").includes("and before that?"),
    );

    expect(secondMessageCall).toBeDefined();
    expect(String((secondMessageCall?.[1] as RequestInit | undefined)?.body ?? "")).toContain(
      "\"context_payload\"",
    );
    expect(String((secondMessageCall?.[1] as RequestInit | undefined)?.body ?? "")).toContain(
      "\"pronounTargets\":[\"evt_1\"]",
    );
  }, 15000);

  it("clears the working state when the first message on a new thread fails", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_new",
              title: null,
              previewText: null,
              referencedEntities: [],
              lastResponseStatus: null,
              lastMessageAt: "2026-03-31T12:00:00.000Z",
              updatedAt: "2026-03-31T12:00:00.000Z",
              createdAt: "2026-03-31T12:00:00.000Z",
              messages: [],
            },
          }, 201),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_new/messages")) {
        return Promise.reject(new Error("send failed"));
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[]}
        slug="acme"
        viewer="member"
      />,
    );

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "How is Camila doing?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("How is Camila doing?")).toBeInTheDocument();
    expect(await screen.findByText("I’m unable to send that right now.")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Thinking…")).not.toBeInTheDocument();
    });
  });

  it("submits on Enter and keeps Shift+Enter as a newline", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith("/api/client/acme/agent/threads") && init?.method === "POST") {
        return Promise.resolve(
          makeJsonResponse({
            thread: {
              threadId: "thread_new",
              title: null,
              previewText: null,
              referencedEntities: [],
              lastResponseStatus: null,
              lastMessageAt: "2026-03-31T12:00:00.000Z",
              updatedAt: "2026-03-31T12:00:00.000Z",
              createdAt: "2026-03-31T12:00:00.000Z",
              messages: [],
            },
          }, 201),
        );
      }

      if (url.endsWith("/api/client/acme/agent/threads/thread_new/messages")) {
        return Promise.resolve(
          makeJsonResponse({
            status: "answer",
            thread_id: "thread_new",
            message_id: "assistant_1",
            text: "Audience answer",
            blocks: [],
            referenced_entities: [],
            resolved_range: null,
          }),
        );
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

    render(
      <AgentShell
        clientName="Acme"
        eventsEnabled={true}
        initialThreads={[]}
        slug="acme"
        viewer="member"
      />,
    );

    const composer = screen.getByPlaceholderText("Ask about campaign or event performance…");
    fireEvent.change(composer, { target: { value: "Which audience is performing best right now?" } });
    fireEvent.keyDown(composer, { key: "Enter", code: "Enter" });

    expect(await screen.findAllByText("Audience answer")).toHaveLength(2);

    fireEvent.change(composer, { target: { value: "Line one" } });
    fireEvent.keyDown(composer, { key: "Enter", code: "Enter", shiftKey: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(composer).toHaveValue("Line one");
  });
});
