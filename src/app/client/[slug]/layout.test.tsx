import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";

const supabaseMocks = vi.hoisted(() => ({
  from: vi.fn(),
  upsertClientMember: vi.fn(),
}));

const memberAccessMocks = vi.hoisted(() => ({
  getMemberAccessForSlug: vi.fn(),
  getMemberships: vi.fn(),
}));

// Mock Clerk so the async server component can be rendered synchronously
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "user_123" }),
  currentUser: vi.fn().mockResolvedValue({
    publicMetadata: { role: "admin", client_slug: "acme" },
  }),
}));

// Mock Next.js navigation (redirect for server component, usePathname for ClientNav)
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  usePathname: vi.fn().mockReturnValue("/client/acme"),
}));

vi.mock("@/features/client-portal/config", () => ({
  getClientPortalConfig: vi.fn().mockResolvedValue({
    clientId: "client_1",
    eventsEnabled: false,
  }),
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: supabaseMocks.from,
  },
}));

vi.mock("@/lib/member-access", () => ({
  getMemberAccessForSlug: memberAccessMocks.getMemberAccessForSlug,
  getMemberships: memberAccessMocks.getMemberships,
}));

import ClientLayout from "./layout";
import { getClientPortalConfig } from "@/features/client-portal/config";
import { currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug, getMemberships } from "@/lib/member-access";

const mockedGetClientPortalConfig = vi.mocked(getClientPortalConfig);
const mockedCurrentUser = vi.mocked(currentUser);
const mockedGetMemberAccessForSlug = vi.mocked(getMemberAccessForSlug);
const mockedGetMemberships = vi.mocked(getMemberships);

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  mockedCurrentUser.mockResolvedValue({
    publicMetadata: { role: "admin", client_slug: "acme" },
  } as unknown as Awaited<ReturnType<typeof currentUser>>);
  mockedGetClientPortalConfig.mockResolvedValue({
    clientId: "client_1",
    eventsEnabled: false,
  });
  mockedGetMemberAccessForSlug.mockResolvedValue({
    allowedCampaignIds: null,
    allowedEventIds: null,
    clientId: "client_1",
    clientName: "Acme",
    clientSlug: "acme",
    memberId: "member_1",
    role: "member",
    scope: "all",
  });
  mockedGetMemberships.mockResolvedValue([]);
  supabaseMocks.from.mockReturnValue({
    upsert: supabaseMocks.upsertClientMember,
  });
});

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

function openMobileNav() {
  fireEvent.click(screen.getByRole("button", { name: "Toggle navigation menu" }));
}

describe("ClientLayout navigation links", () => {
  it("renders Overview link pointing to /client/{slug} in the desktop sidebar", async () => {
    // Clerk disabled so auth gating is skipped
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
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
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
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
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    openMobileNav();
    const links = screen.getAllByRole("link", { name: "Overview" });
    const mobileLink = links.find((l) =>
      l.getAttribute("href") === "/client/acme"
    );
    expect(mobileLink).toBeDefined();
    expect(mobileLink).toHaveAttribute("href", "/client/acme");
  });

  it("renders Campaigns link in the mobile header", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    openMobileNav();
    const links = screen.getAllByRole("link", { name: "Campaigns" });
    const mobileLink = links.find((l) =>
      l.getAttribute("href") === "/client/acme/campaigns"
    );
    expect(mobileLink).toBeDefined();
    expect(mobileLink).toHaveAttribute("href", "/client/acme/campaigns");
  });

  it("renders both desktop and mobile Campaigns links for any slug", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("test_client");
    openMobileNav();
    const links = screen.getAllByRole("link", { name: "Campaigns" });
    // Should appear twice: once in desktop sidebar, once in mobile header
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/client/test_client/campaigns");
    expect(links[1]).toHaveAttribute("href", "/client/test_client/campaigns");
  });

  it("hides Events links when events are disabled for the client", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    mockedGetClientPortalConfig.mockResolvedValue({
      clientId: "client_1",
      eventsEnabled: false,
    });

    await renderLayout("acme");

    expect(screen.queryByRole("link", { name: "Events" })).not.toBeInTheDocument();
  });

  it("shows Events links when events are enabled for the client", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    mockedGetClientPortalConfig.mockResolvedValue({
      clientId: "client_1",
      eventsEnabled: true,
    });

    await renderLayout("acme");

    const links = screen.getAllByRole("link", { name: "Events" });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/client/acme/events");
  });

  it("renders children inside main content area", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("does not render the customer AI helper", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await renderLayout("acme");
    expect(screen.queryByRole("link", { name: "Open AI helper" })).not.toBeInTheDocument();
  });

  it("auto-enrolls invited client users before checking client access", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_123");
    mockedCurrentUser.mockResolvedValue({
      firstName: "Casey",
      lastName: "Client",
      publicMetadata: {
        client_role: "owner",
        client_slug: "acme",
      },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);
    mockedGetMemberAccessForSlug.mockImplementation(async () => {
      expect(supabaseMocks.upsertClientMember).toHaveBeenCalledWith(
        { client_id: "client_1", clerk_user_id: "user_123", role: "owner" },
        { onConflict: "client_id,clerk_user_id" },
      );
      return {
        allowedCampaignIds: null,
        allowedEventIds: null,
        clientId: "client_1",
        clientName: "Acme",
        clientSlug: "acme",
        memberId: "member_1",
        role: "owner",
        scope: "all",
      };
    });

    await renderLayout("acme");

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
