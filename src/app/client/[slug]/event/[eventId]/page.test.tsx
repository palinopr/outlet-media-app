import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./data", () => ({
  getEventDetail: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientEventsAccess: vi.fn().mockResolvedValue({
    userId: "user_123",
    scope: undefined,
  }),
}));

describe("EventDetailPage", () => {
  it("links missing events back to the events index", async () => {
    const { default: EventDetailPage } = await import("./page");

    const element = await EventDetailPage({
      params: Promise.resolve({ slug: "acme", eventId: "evt_1" }),
    });

    render(<>{element}</>);

    expect(screen.getByRole("link", { name: "Back to events" })).toHaveAttribute(
      "href",
      "/client/acme/events",
    );
  });
});
