import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../data", () => ({
  getEventsPageData: vi.fn().mockResolvedValue({
    events: [],
    totalEvents: 0,
    onSaleCount: 0,
    totalTicketsSold: 0,
  }),
}));

vi.mock("./events-filter", () => ({
  EventsFilter: () => <div data-testid="events-filter" />,
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientEventsAccess: vi.fn().mockResolvedValue({
    userId: "user_123",
    scope: undefined,
  }),
}));

describe("ClientEventsPage", () => {
  it("links back to campaigns from the events header", async () => {
    const { default: ClientEventsPage } = await import("./page");

    const element = await ClientEventsPage({
      params: Promise.resolve({ slug: "acme" }),
      searchParams: Promise.resolve({}),
    });

    render(<>{element}</>);

    expect(screen.getByRole("link", { name: "Back to campaigns" })).toHaveAttribute(
      "href",
      "/client/acme/campaigns",
    );
  });
});
