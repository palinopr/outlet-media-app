import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

describe("ClientReportsPage", () => {
  it("redirects to client campaigns", async () => {
    const { default: ClientReportsPage } = await import("./page");

    await ClientReportsPage({ params: Promise.resolve({ slug: "acme" }) });

    expect(redirect).toHaveBeenCalledWith("/client/acme/campaigns");
  });
});
