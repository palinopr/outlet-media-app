import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const HEARTBEAT_INTERVAL_MS = 60_000;

let heartbeatClient: SupabaseClient | null | undefined;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

function getHeartbeatClient(): SupabaseClient | null {
  if (heartbeatClient !== undefined) {
    return heartbeatClient;
  }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  heartbeatClient = url && key ? createClient(url, key) : null;
  return heartbeatClient;
}

export async function writeRuntimeHeartbeat(status: "online" | "offline"): Promise<void> {
  const client = getHeartbeatClient();
  if (!client) return;

  const { error } = await client.from("agent_runtime_state").upsert({
    key: "heartbeat",
    value: {
      last_seen: new Date().toISOString(),
      pid: process.pid,
      source: "discord-agent",
      status,
    },
  });

  if (error) {
    console.error("[heartbeat] upsert failed:", error.message);
  }
}

export function startRuntimeHeartbeat(): void {
  if (heartbeatInterval) return;

  void writeRuntimeHeartbeat("online");
  heartbeatInterval = setInterval(() => {
    void writeRuntimeHeartbeat("online");
  }, HEARTBEAT_INTERVAL_MS);
  heartbeatInterval.unref?.();
}

export async function stopRuntimeHeartbeat(): Promise<void> {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }

  await writeRuntimeHeartbeat("offline");
}
