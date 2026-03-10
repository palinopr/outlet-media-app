import { randomUUID } from "node:crypto";
import { logSystemEvent } from "@/features/system-events/server";
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

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "user",
    entityType: "agent_task",
    entityId: taskId,
    visibility: "admin_only",
    source: "app",
    summary: `Queued agent task: ${input.action} -> ${input.toAgent}`,
    detail: "Admin product flow requested an external agent task.",
    metadata: {
      action: input.action,
      fromAgent: "web-admin",
      params: { prompt: input.prompt },
      taskId,
      tier: "green",
      toAgent: input.toAgent,
    },
  });

  return taskId;
}
