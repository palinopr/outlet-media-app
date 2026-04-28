import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
  getEvents: vi.fn().mockResolvedValue({
    events: [],
    clients: [],
    demoMap: {},
    campaigns: [],
    fromDb: false,
  }),
}));

vi.mock("@/components/admin/events/event-table", () => ({
  EventTable: () => <div data-testid="event-table" />,
}));

vi.mock("@/components/admin/campaigns/client-filter", () => ({
  ClientFilter: () => <div data-testid="client-filter" />,
}));

describe("EventsPage", () => {
  it("renders the events table", async () => {
    const { default: EventsPage } = await import("./page");
    render(await EventsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId("event-table")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Open chat" })).not.toBeInTheDocument();
  });
});
