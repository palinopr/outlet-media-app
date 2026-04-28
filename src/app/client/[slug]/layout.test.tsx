import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup, within } from "@testing-library/react";

const { mockedUsePathname } = vi.hoisted(() => ({
  mockedUsePathname: vi.fn().mockReturnValue("/client/acme"),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "user_123" }),
  currentUser: vi.fn().mockResolvedValue({
    publicMetadata: { role: "admin", client_slug: "acme" },
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  usePathname: mockedUsePathname,
}));

vi.mock("@/features/client-portal/config", () => ({
  getClientPortalConfig: vi.fn().mockResolvedValue({
    clientId: "client_1",
    slug: "acme",
    brandName: null,
    logoUrl: null,
    logoAlt: null,
  }),
}));

import ClientLayout from "./layout";
import { getClientPortalConfig } from "@/features/client-portal/config";

const mockedGetClientPortalConfig = vi.mocked(getClientPortalConfig);

function config(overrides = {}) {
  return {
    brandName: null,
    clientId: "client_1",
    logoAlt: null,
    logoUrl: null,
    slug: "acme",
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  mockedUsePathname.mockReturnValue("/client/acme");
  mockedGetClientPortalConfig.mockResolvedValue(config());
  cleanup();
});

async function renderLayout(slug: string, children?: React.ReactNode) {
  const element = await ClientLayout({
    children: children ?? <div data-testid="child">content</div>,
    params: Promise.resolve({ slug }),
  });
  return render(<>{element}</>);
}

function openMobileNav() {
  fireEvent.click(screen.getByRole("button", { name: "Toggle navigation menu" }));
}

function getDesktopNav() {
  return screen.getByRole("navigation", { name: "Client navigation" });
}

function getMobileNav() {
  return screen.getByRole("navigation", { name: "Mobile navigation" });
}

describe("ClientLayout navigation links", () => {
  it("renders Campaigns link pointing to /client/{slug}/campaigns in the desktop sidebar", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    const desktopLink = within(getDesktopNav()).getByRole("link", { name: "Campaigns" });
    expect(desktopLink).toHaveAttribute("href", "/client/acme/campaigns");
  });

  it("does not render Overview links in the desktop sidebar or mobile nav", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    openMobileNav();

    expect(screen.queryByRole("link", { name: "Overview" })).not.toBeInTheDocument();
  });

  it("renders Campaigns link in the mobile header", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    openMobileNav();
    const mobileLink = within(getMobileNav()).getByRole("link", { name: "Campaigns" });
    expect(mobileLink).toHaveAttribute("href", "/client/acme/campaigns");
  });

  it("renders Campaigns links in both desktop and mobile nav for any slug", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("test_client");
    openMobileNav();

    expect(within(getDesktopNav()).getByRole("link", { name: "Campaigns" })).toHaveAttribute(
      "href",
      "/client/test_client/campaigns",
    );
    expect(within(getMobileNav()).getByRole("link", { name: "Campaigns" })).toHaveAttribute(
      "href",
      "/client/test_client/campaigns",
    );
  });

  it("never renders Events or Reports links", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    openMobileNav();

    expect(screen.queryByRole("link", { name: "Events" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Reports" })).not.toBeInTheDocument();
  });

  it("renders children inside main content area", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
