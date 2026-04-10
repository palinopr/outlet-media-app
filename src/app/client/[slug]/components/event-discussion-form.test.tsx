import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventDiscussionForm } from "./event-discussion-form";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe("EventDiscussionForm", () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("posts a shared event request and refreshes the page", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comment: { id: "comment_1" } }),
    } as Response);

    render(<EventDiscussionForm eventId="evt_1" slug="zamora" />);

    fireEvent.change(screen.getByLabelText("Send an event request"), {
      target: { value: "We need updated ticket counts before the weekend push." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send request" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/event-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: "evt_1",
          client_slug: "zamora",
          content: "We need updated ticket counts before the weekend push.",
          visibility: "shared",
        }),
      });
    });

    expect(refresh).toHaveBeenCalled();
  });

  it("shows an error when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Forbidden" }),
    } as Response);

    render(<EventDiscussionForm eventId="evt_1" slug="zamora" />);

    fireEvent.change(screen.getByLabelText("Send an event request"), {
      target: { value: "Client-only users should not hit this in the happy path." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send request" }));

    await waitFor(() => {
      expect(screen.getByText("Forbidden")).toBeInTheDocument();
    });
    expect(refresh).not.toHaveBeenCalled();
  });
});
