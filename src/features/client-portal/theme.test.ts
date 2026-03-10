import { describe, expect, it } from "vitest";
import { getClientPortalTheme } from "./theme";

describe("getClientPortalTheme", () => {
  it("returns the homebuyer readiness branding for known aliases", () => {
    const theme = getClientPortalTheme("homebuyer_readiness");

    expect(theme.brandBadge).toBe("Homebuyer Readiness");
    expect(theme.brandLogoSrc).toBe("/images/client-brands/homebuyer-readiness-logo.jpg");
  });

  it("falls back to the default outlet portal theme", () => {
    const theme = getClientPortalTheme("acme");

    expect(theme.brandBadge).toBe("Outlet Media");
    expect(theme.brandLogoSrc).toBeNull();
  });
});
