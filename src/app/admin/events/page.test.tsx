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
  it("uses thin agent-entry copy in the header", async () => {
    const { default: EventsPage } = await import("./page");
    render(await EventsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("link", { name: "Open chat" })).toHaveAttribute("href", "/admin/agents");
  });
});
