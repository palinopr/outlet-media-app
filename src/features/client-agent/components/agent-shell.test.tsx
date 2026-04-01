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

  it("renders empty-state prompt chips and omits event prompt chips when events are disabled", () => {
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
    expect(screen.queryByRole("button", { name: "How is this event trending?" })).not.toBeInTheDocument();
  });

  it("creates a new chat, loads a thread, submits a message optimistically, and renders typed blocks", async () => {
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
        return Promise.resolve(
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
    expect(await screen.findAllByText("Which campaign do you mean?")).toHaveLength(2);
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByTestId("answer-chart")).toBeInTheDocument();
    expect(screen.getByText("Clarification")).toBeInTheDocument();
  });

  it("renders compact refusal and error treatments and disables the composer in preview mode", async () => {
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

    const textarea = screen.getByPlaceholderText("Preview mode disables message sending.");
    expect(textarea).toBeDisabled();
    expect(screen.getByText("Preview mode is read-only for Acme.")).toBeInTheDocument();
  });
});
