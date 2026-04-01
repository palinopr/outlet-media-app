import type { TicketConciergePreparedOption } from "./types";
import type { TicketConciergeLanguage } from "./language";

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

function translateNote(note: string, locale: TicketConciergeLanguage): string {
  if (locale === "en") {
    return note;
  }

  switch (note) {
    case "Best value":
      return "Mejor valor";
    case "Closer to stage":
    case "Closest to stage":
      return "Mas cerca del escenario";
    case "Clean center view":
    case "Center view":
      return "Vista centrada";
    case "Ready to buy":
      return "Lista para comprar";
    case "Closest available":
      return "Lo mas cercano disponible";
    case "Best remaining value":
      return "Mejor valor disponible";
    case "Closest over budget":
      return "Lo mas cercano sobre presupuesto";
    default:
      return note;
  }
}

function buildOptionLabel(option: TicketConciergePreparedOption, locale: TicketConciergeLanguage): string {
  if (locale === "es") {
    return `Opcion ${option.ordinal}`;
  }
  return option.label;
}

function buildOptionBody(option: TicketConciergePreparedOption, locale: TicketConciergeLanguage): string {
  const rowLabel = option.row
    ? locale === "es"
      ? `, Fila ${option.row}`
      : `, Row ${option.row}`
    : "";
  const seatsLabel =
    locale === "es"
      ? option.quantity === 1
        ? "1 asiento"
        : `${option.quantity} asientos juntos`
      : option.quantity === 1
        ? "1 seat together"
        : `${option.quantity} seats together`;
  const sectionLabel = locale === "es" ? "Seccion" : "Section";

  return [
    buildOptionLabel(option, locale),
    `${formatUsd(option.totalCents)} total`,
    `${sectionLabel} ${option.section}${rowLabel}`,
    seatsLabel,
    translateNote(option.note, locale),
  ].join("\n");
}

function buildReplyHint(
  optionOrdinals: Array<1 | 2 | 3>,
  locale: TicketConciergeLanguage,
): string {
  if (optionOrdinals.length === 1) {
    return locale === "es"
      ? `Responde ${optionOrdinals[0]} para elegir esta opcion.`
      : `Reply ${optionOrdinals[0]} to pick this option.`;
  }

  if (optionOrdinals.length === 2) {
    return locale === "es"
      ? `Responde ${optionOrdinals[0]} o ${optionOrdinals[1]} para elegir una de estas opciones.`
      : `Reply ${optionOrdinals[0]} or ${optionOrdinals[1]} to pick one of these options.`;
  }

  return locale === "es"
    ? `Responde ${optionOrdinals[0]}, ${optionOrdinals[1]} o ${optionOrdinals[2]} para elegir una de estas opciones.`
    : `Reply ${optionOrdinals[0]}, ${optionOrdinals[1]}, or ${optionOrdinals[2]} to pick one of these options.`;
}

export function formatPreparedOptionsMessage(input: {
  baseUrl: string;
  locale: TicketConciergeLanguage;
  options: TicketConciergePreparedOption[];
}): TicketConciergeOutboundPayload[] {
  const baseUrl = input.baseUrl.endsWith("/") ? input.baseUrl.slice(0, -1) : input.baseUrl;
  const orderedOptions = [...input.options].sort((left, right) => left.ordinal - right.ordinal);
  const optionOrdinals = orderedOptions.map((option) => option.ordinal);
  const footerLines = [];

  if (orderedOptions.length > 0 && orderedOptions.length < 3) {
    footerLines.push(
      input.locale === "es"
        ? "El inventario en vivo esta limitado ahora mismo."
        : "Live inventory is limited right now.",
    );
  }

  footerLines.push(buildReplyHint(optionOrdinals, input.locale));

  return [
    ...orderedOptions.map((option) => ({
      body: buildOptionBody(option, input.locale),
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
