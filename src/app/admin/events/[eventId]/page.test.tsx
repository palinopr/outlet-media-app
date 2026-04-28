import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

describe("AdminEventDetailPage", () => {
  it("redirects to the dashboard", async () => {
    const { default: AdminEventDetailPage } = await import("./page");

    AdminEventDetailPage();

    expect(redirect).toHaveBeenCalledWith("/admin/dashboard");
  });
});
