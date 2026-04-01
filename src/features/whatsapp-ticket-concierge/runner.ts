import layoutFixture from "./fixtures/arjona-miami-layout.json";
import { executeConciergeCheckout } from "./checkout-executor";
import { getTicketConciergeConfig } from "./config";
import { resolveTicketConciergeContext } from "./context-resolver";
import { parseCustomerTicketIntent } from "./message-parser";
import { prepareTicketConciergeOptions } from "./option-preparer";
import { collectTicketmasterBrowserCandidates } from "./ticketmaster-browser";
import type { TicketConciergePreparedOption } from "./types";

export async function prepareConciergeSelection(input: {
  body: string;
  chromeDebugUrl?: string;
  conversationMetadata: Record<string, unknown>;
}) {
  const config = getTicketConciergeConfig();
  const resolved = resolveTicketConciergeContext({
    body: input.body,
    conversationMetadata: input.conversationMetadata,
  });
  const intent = parseCustomerTicketIntent(resolved.strippedMessage);

  if (!intent.quantity) {
    return {
      eventContext: resolved.eventContext,
      intent,
      missing: ["quantity"],
      scenarioKey: resolved.scenarioKey,
      status: "needs_clarification" as const,
    };
  }

  const candidates = await collectTicketmasterBrowserCandidates({
    chromeDebugUrl: input.chromeDebugUrl ?? config.chromeDebugUrl,
    eventUrl: resolved.eventContext.eventUrl,
    quantity: intent.quantity,
  });

  if (candidates.length === 0) {
    return {
      eventContext: resolved.eventContext,
      intent,
      reason: "no_viable_options",
      scenarioKey: resolved.scenarioKey,
      status: "no_inventory" as const,
    };
  }

  const options = prepareTicketConciergeOptions({
    candidates,
    intent,
    layout: layoutFixture,
  });

  if (options.length === 0) {
    return {
      eventContext: resolved.eventContext,
      intent,
      reason: "no_viable_options",
      scenarioKey: resolved.scenarioKey,
      status: "no_inventory" as const,
    };
  }

  return {
    eventContext: resolved.eventContext,
    intent,
    options,
    scenarioKey: resolved.scenarioKey,
    status: "options_ready" as const,
  };
}

export async function runPreparedConciergeCheckout(input: {
  chromeDebugUrl?: string;
  option: TicketConciergePreparedOption;
}) {
  const config = getTicketConciergeConfig();
  return executeConciergeCheckout({
    chromeDebugUrl: input.chromeDebugUrl ?? config.chromeDebugUrl,
    option: input.option,
  });
}
