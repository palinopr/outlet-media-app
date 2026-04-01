import type { TicketConciergePreparedOption } from "./types";

export interface TicketConciergeOutboundMediaMessage {
  body: string;
  kind: "media";
  mediaUrl: string;
  optionOrdinal: 1 | 2 | 3;
}

export interface TicketConciergeOutboundTextMessage {
  body: string;
  kind: "text";
}

export type TicketConciergeOutboundPayload =
  | TicketConciergeOutboundMediaMessage
  | TicketConciergeOutboundTextMessage;

function formatUsd(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

function buildOptionBody(option: TicketConciergePreparedOption): string {
  const rowLabel = option.row ? `, Row ${option.row}` : "";
  const seatsLabel =
    option.quantity === 1 ? "1 seat together" : `${option.quantity} seats together`;

  return [
    option.label,
    `${formatUsd(option.totalCents)} total`,
    `Section ${option.section}${rowLabel}`,
    seatsLabel,
    option.note,
  ].join("\n");
}

function buildReplyHint(optionOrdinals: Array<1 | 2 | 3>): string {
  if (optionOrdinals.length === 1) {
    return `Reply ${optionOrdinals[0]} to pick this option.`;
  }

  if (optionOrdinals.length === 2) {
    return `Reply ${optionOrdinals[0]} or ${optionOrdinals[1]} to pick one of these options.`;
  }

  return `Reply ${optionOrdinals[0]}, ${optionOrdinals[1]}, or ${optionOrdinals[2]} to pick one of these options.`;
}

export function formatPreparedOptionsMessage(input: {
  baseUrl: string;
  options: TicketConciergePreparedOption[];
}): TicketConciergeOutboundPayload[] {
  const baseUrl = input.baseUrl.endsWith("/") ? input.baseUrl.slice(0, -1) : input.baseUrl;
  const orderedOptions = [...input.options].sort((left, right) => left.ordinal - right.ordinal);
  const optionOrdinals = orderedOptions.map((option) => option.ordinal);
  const footerLines = [];

  if (orderedOptions.length > 0 && orderedOptions.length < 3) {
    footerLines.push("Live inventory is limited right now.");
  }

  footerLines.push(buildReplyHint(optionOrdinals));

  return [
    ...orderedOptions.map((option) => ({
      body: buildOptionBody(option),
      kind: "media" as const,
      mediaUrl: `${baseUrl}/api/whatsapp/concierge/maps/${option.mapToken}`,
      optionOrdinal: option.ordinal,
    })),
    {
      body: footerLines.join("\n"),
      kind: "text" as const,
    },
  ];
}
