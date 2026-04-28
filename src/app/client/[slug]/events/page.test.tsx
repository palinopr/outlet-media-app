import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

describe("ClientEventsPage", () => {
  it("redirects to client campaigns", async () => {
    const { default: ClientEventsPage } = await import("./page");

    await ClientEventsPage({ params: Promise.resolve({ slug: "acme" }) });

    expect(redirect).toHaveBeenCalledWith("/client/acme/campaigns");
  });
});
