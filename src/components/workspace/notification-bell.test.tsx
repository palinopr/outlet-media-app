import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationBell } from "./notification-bell";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("NotificationBell", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ notifications: [] }),
        ok: true,
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("scopes client portal fetches to the active client slug", async () => {
    render(<NotificationBell fallbackClientSlug="acme" viewer="client" />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/workspace/notifications?clientSlug=acme");
    });

    fireEvent.click(screen.getByRole("button"));

    const inboxLink = await screen.findByRole("link", { name: "Open inbox" });
    expect(inboxLink).toHaveAttribute("href", "/client/acme/notifications");
  });

  it("keeps admin fetches on the unscoped admin inbox", async () => {
    render(<NotificationBell viewer="admin" />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/workspace/notifications");
    });

    fireEvent.click(screen.getByRole("button"));

    const inboxLink = await screen.findByRole("link", { name: "Open inbox" });
    expect(inboxLink).toHaveAttribute("href", "/admin/notifications");
  });
});
