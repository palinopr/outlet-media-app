import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { getEventDetail, requireClientEventsAccess } = vi.hoisted(() => ({
  getEventDetail: vi.fn(),
  requireClientEventsAccess: vi.fn(),
}));

vi.mock("./data", () => ({
  getEventDetail,
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientEventsAccess,
}));

vi.mock("@/components/client/charts", () => ({
  DailySalesChart: () => <div data-testid="daily-sales-chart" />,
  TicketSalesChart: () => <div data-testid="ticket-sales-chart" />,
}));

describe("EventDetailPage", () => {
  beforeEach(() => {
    getEventDetail.mockResolvedValue(null);
    requireClientEventsAccess.mockResolvedValue({
      scope: undefined,
      userId: "user_123",
      viewer: "member",
    });
  });

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

  it("shows supporting data warnings only for admin preview viewers", async () => {
    getEventDetail.mockResolvedValue({
      audience: null,
      channelBreakdown: null,
      dailyDeltas: [],
      event: {
        artist: "Artist",
        avgTicketPrice: null,
        city: "Miami",
        conversionRate: null,
        date: "2026-05-01T00:00:00.000Z",
        edpAvgDailyViews: null,
        edpTotalViews: null,
        gross: 1000,
        id: "evt_1",
        name: "Artist Live",
        potentialRevenue: null,
        revenueToday: null,
        sellThrough: null,
        status: "onsale",
        ticketPlatform: "ticketmaster",
        ticketsAvailable: null,
        ticketsSold: 10,
        ticketsSoldToday: null,
        updatedAt: null,
        venue: "Arena",
      },
      linkedCampaigns: [],
      snapshots: [],
      supportingDataWarnings: ["Ticket sales snapshots are unavailable."],
      velocity: null,
    });
    requireClientEventsAccess.mockResolvedValue({
      scope: undefined,
      userId: "user_123",
      viewer: "admin_preview",
    });
    const { default: EventDetailPage } = await import("./page");

    const element = await EventDetailPage({
      params: Promise.resolve({ slug: "acme", eventId: "evt_1" }),
    });

    render(<>{element}</>);

    expect(screen.getByText("Admin data warning")).toBeInTheDocument();
    expect(screen.getByText("Ticket sales snapshots are unavailable.")).toBeInTheDocument();
  });
});
