import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("AdminReportsPage", () => {
  it("redirects the removed reports route to the admin dashboard", async () => {
    const { default: AdminReportsPage } = await import("./page");
    const redirectMock = vi.mocked(redirect);

    redirectMock.mockClear();

    AdminReportsPage();

    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith("/admin/dashboard");
  });
});
