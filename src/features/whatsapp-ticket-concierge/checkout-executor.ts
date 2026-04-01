import type { TicketConciergePreparedOption } from "./types";
import { getReusableCheckoutAttempt, recordCheckoutAttempt } from "./option-ledger";
import { captureTicketmasterCheckout } from "./ticketmaster-browser";

export async function executeConciergeCheckout(input: {
  chromeDebugUrl: string;
  option: TicketConciergePreparedOption;
}) {
  const reusable = await getReusableCheckoutAttempt(input.option.id);
  if (reusable?.checkout_url) {
    return {
      checkoutUrl: reusable.checkout_url,
      status: "checkout_ready" as const,
    };
  }

  const execution = input.option.execution as Partial<{
    eventUrl: string;
    quantity: number;
    source: string;
    ticketListLabel: string;
  }>;

  if (
    execution.source !== "ticketmaster_browser" ||
    !execution.eventUrl ||
    !execution.quantity ||
    !execution.ticketListLabel
  ) {
    const reason = "unsupported_checkout_execution";
    await recordCheckoutAttempt({
      checkoutUrl: null,
      failureReason: reason,
      optionId: input.option.id,
      status: "failed",
    });

    return {
      reason,
      status: "lookup_failed" as const,
    };
  }

  const result = await captureTicketmasterCheckout({
    chromeDebugUrl: input.chromeDebugUrl,
    eventUrl: execution.eventUrl,
    quantity: execution.quantity,
    ticketListLabel: execution.ticketListLabel,
  });

  if (result.status === "checkout_ready") {
    await recordCheckoutAttempt({
      checkoutUrl: result.checkoutUrl,
      failureReason: null,
      optionId: input.option.id,
      status: "checkout_ready",
    });

    return result;
  }

  if (result.status === "inventory_changed") {
    await recordCheckoutAttempt({
      checkoutUrl: null,
      failureReason: result.reason,
      optionId: input.option.id,
      status: "inventory_changed",
    });

    return result;
  }

  await recordCheckoutAttempt({
    checkoutUrl: null,
    failureReason: result.reason,
    optionId: input.option.id,
    status: "failed",
  });

  return result;
}
