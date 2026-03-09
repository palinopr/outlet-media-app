import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

interface EnqueueExternalAgentTaskInput {
  action: string;
  prompt: string;
  toAgent:
    | "assistant"
    | "campaign-monitor"
    | "meta-ads"
    | "tm-monitor"
    | "growth-supervisor"
    | "tiktok-supervisor"
    | "content-finder"
    | "lead-qualifier"
    | "publisher-tiktok";
}

export async function enqueueExternalAgentTask(
  input: EnqueueExternalAgentTaskInput,
): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const taskId = `web_${randomUUID()}`;
  const { error } = await supabaseAdmin.from("agent_tasks").insert({
    id: taskId,
    from_agent: "web-admin",
    to_agent: input.toAgent,
    action: input.action,
    params: { prompt: input.prompt },
    tier: "green",
    status: "pending",
  });

  if (error) {
    console.error("[agent-dispatch] Failed to enqueue external task:", error.message);
    return null;
  }

  return taskId;
}
