import { runTicketConciergeSellerTurn } from "./claude-seller-agent";
import { resolveTicketConciergeLanguage } from "./language";
import { formatPreparedOptionsMessage } from "./result-formatter";
import {
  getTicketConciergeSecurityDisposition,
  type TicketConciergeSecurityDisposition,
} from "./security";
import type { TicketConciergePreparedOption } from "./types";

interface TicketConciergeConversation {
  id: string;
  metadata?: Record<string, unknown> | null;
}

interface TicketConciergeContact {
  id: string;
  profile_name: string | null;
  wa_id: string;
}

interface TicketConciergeInboundMessage {
  messageId: string;
  textBody: string | null;
}

interface TicketConciergeSendTextInput {
  approved?: boolean;
  body: string;
  conversationId: string;
  mediaUrl?: string;
  replyToMessageId?: string;
}

export interface TicketConciergeResponderDeps {
  getSecurityDisposition: (input: {
    conversationId: string;
    waId: string;
  }) => Promise<TicketConciergeSecurityDisposition>;
  runSellerTurn: typeof runTicketConciergeSellerTurn;
  sendText: (input: TicketConciergeSendTextInput) => Promise<{
    conversationId: string | null;
    messageId: string;
  }>;
}

const defaultDeps: TicketConciergeResponderDeps = {
  getSecurityDisposition: getTicketConciergeSecurityDisposition,
  runSellerTurn: runTicketConciergeSellerTurn,
  sendText: async () => {
    throw new Error("Ticket concierge responder requires sendText to be injected.");
  },
};

function isTicketConciergeConversation(metadata: Record<string, unknown> | null | undefined): boolean {
  return (
    metadata?.automationRoute === "ticket_concierge" && metadata?.conciergeAllowed === true
  );
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

async function sendPreparedOptions(input: {
  appBaseUrl: string;
  conversationId: string;
  introText: string;
  locale: "en" | "es";
  options: TicketConciergePreparedOption[];
  replyToMessageId: string;
  sendText: TicketConciergeResponderDeps["sendText"];
}) {
  const payloads = formatPreparedOptionsMessage({
    baseUrl: normalizeBaseUrl(input.appBaseUrl),
    locale: input.locale,
    options: input.options,
  });

  if (input.introText.trim().length > 0) {
    await input.sendText({
      approved: true,
      body: input.introText.trim(),
      conversationId: input.conversationId,
      replyToMessageId: input.replyToMessageId,
    });
  }

  for (const payload of payloads) {
    await input.sendText({
      approved: true,
      body: payload.body,
      conversationId: input.conversationId,
      mediaUrl: payload.kind === "media" ? payload.mediaUrl : undefined,
      replyToMessageId: undefined,
    });
  }
}

export async function handleTicketConciergeInbound(input: {
  appBaseUrl: string;
  contact: TicketConciergeContact;
  conversation: TicketConciergeConversation;
  latestInboundMessageId: string;
  message: TicketConciergeInboundMessage;
}, deps: Partial<TicketConciergeResponderDeps> = {}): Promise<{ handled: boolean }> {
  const resolvedDeps: TicketConciergeResponderDeps = {
    ...defaultDeps,
    ...deps,
  };

  if (!isTicketConciergeConversation(input.conversation.metadata)) {
    return { handled: false };
  }

  const security = await resolvedDeps.getSecurityDisposition({
    conversationId: input.conversation.id,
    waId: input.contact.wa_id,
  });
  if (!security.allowed) {
    return { handled: true };
  }

  const sellerTurn = await resolvedDeps.runSellerTurn({
    contact: input.contact,
    conversation: input.conversation,
    latestInboundMessageId: input.latestInboundMessageId,
    message: input.message,
  });

  const locale = resolveTicketConciergeLanguage({
    defaultLanguage: "es",
    messageText: input.message.textBody,
    metadata: input.conversation.metadata,
  });

  if (sellerTurn.kind === "prepared_options") {
    await sendPreparedOptions({
      appBaseUrl: input.appBaseUrl,
      conversationId: input.conversation.id,
      introText: sellerTurn.introText,
      locale,
      options: sellerTurn.options,
      replyToMessageId: input.message.messageId,
      sendText: resolvedDeps.sendText,
    });
    return { handled: true };
  }

  await resolvedDeps.sendText({
    approved: true,
    body: sellerTurn.body,
    conversationId: input.conversation.id,
    replyToMessageId: input.message.messageId,
  });
  return { handled: true };
}
