import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

describe("AdminReportsPage", () => {
  it("redirects to the dashboard", async () => {
    const { default: AdminReportsPage } = await import("./page");

    AdminReportsPage();

    expect(redirect).toHaveBeenCalledWith("/admin/dashboard");
  });
});
