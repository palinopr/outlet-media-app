import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

describe("EventDetailPage", () => {
  it("redirects to client campaigns", async () => {
    const { default: EventDetailPage } = await import("./page");

    await EventDetailPage({
      params: Promise.resolve({ slug: "acme", eventId: "evt_1" }),
    });

    expect(redirect).toHaveBeenCalledWith("/client/acme/campaigns");
  });
});
