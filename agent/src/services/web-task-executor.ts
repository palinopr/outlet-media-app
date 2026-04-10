import { runClaude } from "../runner.js";
import { completeTask, failTask, type AgentTask } from "./queue-service.js";

const DEFAULT_PROMPTS = {
  assistant: {
    maxTurns: 12,
    prompt:
      "Give a concise Outlet operations update with the most important live blockers, opportunities, and next actions you can verify right now.",
  },
  "campaign-monitor": {
    maxTurns: 18,
    prompt:
      "Review current campaign health across Outlet's operating system and report the most important changes, blockers, risks, and next actions.",
  },
  "meta-ads": {
    maxTurns: 18,
    prompt:
      "Review the current Meta ads posture and report meaningful performance shifts, blockers, risks, and the next actions that matter most.",
  },
  "tm-monitor": {
    maxTurns: 18,
    prompt:
      "Review the current Ticketmaster event posture and report meaningful changes, blockers, risks, and the next actions that matter most.",
  },
} as const;

type SupportedWebAgent = keyof typeof DEFAULT_PROMPTS;

function isSupportedWebAgent(agentId: string): agentId is SupportedWebAgent {
  return agentId in DEFAULT_PROMPTS;
}

function resolveTaskPrompt(task: AgentTask): { maxTurns: number; prompt: string } | null {
  const prompt =
    typeof task.params.prompt === "string"
      ? task.params.prompt.trim()
      : "";

  if (prompt) {
    return {
      maxTurns: DEFAULT_PROMPTS.assistant.maxTurns,
      prompt,
    };
  }

  if (!isSupportedWebAgent(task.to)) {
    return null;
  }

  return DEFAULT_PROMPTS[task.to];
}

export async function executeWebTask(task: AgentTask): Promise<void> {
  if (task.from === "gmail-push") {
    failTask(task.id, "gmail-push tasks are no longer supported by the single-agent runtime");
    return;
  }

  if (task.from !== "web-admin") {
    failTask(task.id, `Unsupported task source '${task.from}' for the live runtime`);
    return;
  }

  const spec = resolveTaskPrompt(task);
  if (!spec) {
    failTask(task.id, `Unsupported web task target '${task.to}'`);
    return;
  }

  const result = await runClaude({
    prompt: spec.prompt,
    systemPromptName: "agent",
    maxTurns: spec.maxTurns,
  });

  if (!result.success) {
    failTask(task.id, result.error ?? result.text ?? `Task failed for ${task.to}`);
    return;
  }

  completeTask(task.id, {
    agent: task.to,
    source: task.from,
    text: result.text,
  });
}

export function createWebTaskExecutor() {
  return executeWebTask;
}
