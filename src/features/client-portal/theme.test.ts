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

  it("lets the database branding override the slug defaults", () => {
    const theme = getClientPortalTheme("homebuyer_readiness", {
      brandName: "Acme Live",
      logoUrl: "https://cdn.example.com/acme.png",
      logoAlt: "Acme Live Logo",
    });

    expect(theme.brandBadge).toBe("Acme Live");
    expect(theme.brandLogoSrc).toBe("https://cdn.example.com/acme.png");
    expect(theme.brandLogoAlt).toBe("Acme Live Logo");
  });
});
