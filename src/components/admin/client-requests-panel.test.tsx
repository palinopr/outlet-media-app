import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ClientRequestsPanel, type AdminRequestComment } from "./client-requests-panel";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

const comments: AdminRequestComment[] = [
  {
    id: "comment_1",
    content: "Can we swap the creative before Friday?",
    authorName: "Client Team",
    parentCommentId: null,
    resolved: false,
    createdAt: "2026-04-10T10:00:00.000Z",
    visibility: "shared",
  },
  {
    id: "comment_2",
    content: "Yes — we can update that today.",
    authorName: "Outlet Team",
    parentCommentId: "comment_1",
    resolved: false,
    createdAt: "2026-04-10T10:30:00.000Z",
    visibility: "shared",
  },
  {
    id: "comment_3",
    content: "Internal-only note should not appear in client requests.",
    authorName: "Admin",
    parentCommentId: null,
    resolved: false,
    createdAt: "2026-04-10T11:00:00.000Z",
    visibility: "admin_only",
  },
];

describe("ClientRequestsPanel", () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders shared request threads and posts campaign replies back onto the thread", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comment: { id: "comment_4" } }),
    } as Response);

    render(
      <ClientRequestsPanel
        clientSlug="zamora"
        comments={comments}
        entityId="cmp_1"
        entityLabel="Barcelona Push"
        entityType="campaign"
      />,
    );

    expect(screen.getByRole("heading", { name: "Requests attached to Barcelona Push" })).toBeInTheDocument();
    expect(screen.getByText("Can we swap the creative before Friday?")).toBeInTheDocument();
    expect(screen.getByText("Yes — we can update that today.")).toBeInTheDocument();
    expect(screen.queryByText("Internal-only note should not appear in client requests.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reply" }));
    fireEvent.change(screen.getByLabelText("Reply to client request"), {
      target: { value: "We already started the revision." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send reply" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/campaign-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_id: "cmp_1",
          client_slug: "zamora",
          content: "We already started the revision.",
          parent_comment_id: "comment_1",
          visibility: "shared",
        }),
      });
    });

    expect(refresh).toHaveBeenCalled();
  });

  it("uses the event comment endpoint when resolving an event request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(
      <ClientRequestsPanel
        clientSlug="zamora"
        comments={comments}
        entityId="evt_1"
        entityLabel="Miami Show"
        entityType="event"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Resolve" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/event-comments?id=comment_1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resolved: true }),
      });
    });

    expect(refresh).toHaveBeenCalled();
  });
});
