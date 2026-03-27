import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("ClientPortalRootPage", () => {
  it("redirects the portal root to campaigns", async () => {
    const { default: ClientPortalRootPage } = await import("./page");
    const redirectMock = vi.mocked(redirect);

    redirectMock.mockClear();

    await ClientPortalRootPage({
      params: Promise.resolve({ slug: "acme" }),
    });

    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith("/client/acme/campaigns");
  });
});
