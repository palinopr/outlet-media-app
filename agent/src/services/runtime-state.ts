import { getServiceSupabase } from "./supabase-service.js";

export async function getRuntimeState<T>(key: string): Promise<T | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("agent_runtime_state")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return (data.value ?? null) as T | null;
}

export async function setRuntimeState(key: string, value: unknown): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("agent_runtime_state")
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error(`[runtime-state] Failed to upsert ${key}:`, error.message);
  }
}
