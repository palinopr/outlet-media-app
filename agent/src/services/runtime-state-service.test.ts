import { afterEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

describe("runtime-state-service", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("writes online and offline heartbeat state to agent_runtime_state", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";

    const upsert = vi.fn().mockResolvedValue({ error: null });
    createClientMock.mockReturnValue({
      from: vi.fn(() => ({
        upsert,
      })),
    });

    const runtimeState = await import("./runtime-state-service.js");

    await runtimeState.writeRuntimeHeartbeat("online");
    await runtimeState.writeRuntimeHeartbeat("offline");

    expect(upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        key: "heartbeat",
        value: expect.objectContaining({
          source: "discord-agent",
          status: "online",
        }),
      }),
    );
    expect(upsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        key: "heartbeat",
        value: expect.objectContaining({
          source: "discord-agent",
          status: "offline",
        }),
      }),
    );
  });
});
