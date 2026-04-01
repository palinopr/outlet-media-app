import { createClientAgentAppClient } from "./app-client.js";
import { runClientAgentRuntime } from "./runtime.js";
import { toErrorMessage } from "../utils/error-helpers.js";

type ClientPortalTask = {
  id: string;
  from_agent: string;
  to_agent: string;
  action: string;
  params: Record<string, unknown> | null;
  tier: "green" | "yellow" | "red" | null;
  status: string;
  started_at?: string | null;
};

export async function processClientAgentTask(task: ClientPortalTask): Promise<string> {
  const appClient = createClientAgentAppClient();

  let context;
  try {
    context = await appClient.getTaskContext(task.id);
  } catch (error) {
    const message = toErrorMessage(error);
    if (message.includes("no longer pending")) {
      return "Client agent task already resolved.";
    }

    throw error;
  }

  if (context.assistantMessage.status !== "pending") {
    return "Client agent task already resolved.";
  }

  try {
    const runtimeResult = await runClientAgentRuntime({
      appClient,
      context,
    });

    await appClient.resolveTask(task.id, {
      ...runtimeResult,
      blocks: [],
    });

    return runtimeResult.text;
  } catch (error) {
    const text = `I’m unable to answer that right now. ${toErrorMessage(error)}`;

    await appClient.resolveTask(task.id, {
      status: "error",
      text,
      blocks: [],
      referencedEntities: [],
      contextPayload: null,
      resolvedRange: null,
      providerResponseId: null,
    });

    return text;
  }
}
