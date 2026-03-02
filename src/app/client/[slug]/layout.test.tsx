import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Mock Clerk so the async server component can be rendered synchronously
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "user_123" }),
  currentUser: vi.fn().mockResolvedValue({
    publicMetadata: { role: "admin", client_slug: "acme" },
  }),
}));

// Mock Next.js redirect
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import ClientLayout from "./layout";

afterEach(() => {
  cleanup();
});

// Helper: call the async server component and render its return value
async function renderLayout(slug: string, children?: React.ReactNode) {
  const element = await ClientLayout({
    children: children ?? <div data-testid="child">content</div>,
    params: Promise.resolve({ slug }),
  });
  return render(<>{element}</>);
}

describe("ClientLayout navigation links", () => {
  it("renders Overview link pointing to /client/{slug} in the desktop sidebar", async () => {
    // Clerk disabled so auth gating is skipped
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    await renderLayout("acme");
    const links = screen.getAllByRole("link", { name: "Overview" });
    expect(links.length).toBeGreaterThanOrEqual(1);
    // Desktop sidebar link uses rounded-lg class
    const desktopLink = links.find((l) =>
      l.className.includes("rounded-lg")
    );
    expect(desktopLink).toBeDefined();
    expect(desktopLink).toHaveAttribute("href", "/client/acme");
  });

  it("renders Campaigns link pointing to /client/{slug}/campaigns in the desktop sidebar", async () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    await renderLayout("acme");
    const links = screen.getAllByRole("link", { name: "Campaigns" });
    expect(links.length).toBeGreaterThanOrEqual(1);
    const desktopLink = links.find((l) =>
      l.className.includes("rounded-lg")
    );
    expect(desktopLink).toBeDefined();
    expect(desktopLink).toHaveAttribute("href", "/client/acme/campaigns");
  });

  it("renders Overview link in the mobile header", async () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    await renderLayout("acme");
    const links = screen.getAllByRole("link", { name: "Overview" });
    const mobileLink = links.find((l) =>
      l.className.includes("text-xs")
    );
    expect(mobileLink).toBeDefined();
    expect(mobileLink).toHaveAttribute("href", "/client/acme");
  });

  it("renders Campaigns link in the mobile header", async () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    await renderLayout("acme");
    const links = screen.getAllByRole("link", { name: "Campaigns" });
    const mobileLink = links.find((l) =>
      l.className.includes("text-xs")
    );
    expect(mobileLink).toBeDefined();
    expect(mobileLink).toHaveAttribute("href", "/client/acme/campaigns");
  });

  it("renders both desktop and mobile Campaigns links for any slug", async () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    await renderLayout("test_client");
    const links = screen.getAllByRole("link", { name: "Campaigns" });
    // Should appear twice: once in desktop sidebar, once in mobile header
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/client/test_client/campaigns");
    expect(links[1]).toHaveAttribute("href", "/client/test_client/campaigns");
  });

  it("renders children inside main content area", async () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    await renderLayout("acme");
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
