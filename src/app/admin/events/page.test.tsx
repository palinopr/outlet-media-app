import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

describe("AdminEventsPage", () => {
  it("redirects to the dashboard", async () => {
    const { default: AdminEventsPage } = await import("./page");

    AdminEventsPage();

    expect(redirect).toHaveBeenCalledWith("/admin/dashboard");
  });
});
