import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { listThreads } = vi.hoisted(() => ({
  listThreads: vi.fn(),
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientAgentAccess: vi.fn(),
}));

vi.mock("@/features/client-portal/config", () => ({
  getClientPortalConfig: vi.fn(),
}));

vi.mock("@/features/client-agent/server", () => ({
  listThreads,
}));

import { requireClientAgentAccess } from "@/features/client-portal/access";
import { getClientPortalConfig } from "@/features/client-portal/config";

const mockedRequireClientAgentAccess = vi.mocked(requireClientAgentAccess);
const mockedGetClientPortalConfig = vi.mocked(getClientPortalConfig);

describe("ClientAgentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the shared AgentShell for client members", async () => {
    mockedRequireClientAgentAccess.mockResolvedValueOnce({
      clientId: "client_1",
      clientSlug: "acme",
      scope: undefined,
      userId: "user_1",
      viewer: "member",
    });
    mockedGetClientPortalConfig.mockResolvedValueOnce({
      agentEnabled: true,
      brandName: "Acme",
      clientId: "client_1",
      eventsEnabled: true,
      logoAlt: null,
      logoUrl: null,
      reportsEnabled: true,
      slug: "acme",
    });
    listThreads.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        threads: [
          {
            threadId: "thread_1",
            title: "How are my campaigns doing?",
            previewText: null,
            referencedEntities: [],
            lastResponseStatus: null,
            lastMessageAt: "2026-03-31T12:00:00.000Z",
            updatedAt: "2026-03-31T12:00:00.000Z",
            createdAt: "2026-03-31T12:00:00.000Z",
          },
        ],
      },
    });

    const { default: ClientAgentPage } = await import("./page");
    const element = await ClientAgentPage({
      params: Promise.resolve({ slug: "acme" }),
    });

    render(<>{element}</>);

    const shell = screen.getByTestId("agent-shell");
    expect(shell).toBeInTheDocument();
    expect(shell).toHaveAttribute("data-viewer", "member");
    expect(shell).toHaveAttribute("data-thread-count", "1");
  });

  it("passes preview mode into the shell and skips durable thread loading for admin preview", async () => {
    mockedRequireClientAgentAccess.mockResolvedValueOnce({
      clientId: "client_1",
      clientSlug: "acme",
      scope: undefined,
      userId: "user_admin",
      viewer: "admin_preview",
    });
    mockedGetClientPortalConfig.mockResolvedValueOnce({
      agentEnabled: true,
      brandName: null,
      clientId: "client_1",
      eventsEnabled: false,
      logoAlt: null,
      logoUrl: null,
      reportsEnabled: true,
      slug: "acme",
    });

    const { default: ClientAgentPage } = await import("./page");
    const element = await ClientAgentPage({
      params: Promise.resolve({ slug: "acme" }),
    });

    render(<>{element}</>);

    const shell = screen.getByTestId("agent-shell");
    expect(shell).toHaveAttribute("data-viewer", "admin_preview");
    expect(shell).toHaveAttribute("data-thread-count", "0");
    expect(listThreads).not.toHaveBeenCalled();
  });
});
