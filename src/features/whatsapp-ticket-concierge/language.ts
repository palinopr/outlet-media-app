export type TicketConciergeLanguage = "en" | "es";

function parseMetadataRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function looksSpanishText(value: string | null | undefined): boolean {
  const text = value?.trim().toLowerCase() ?? "";
  if (!text) return false;

  return (
    /[áéíóúñ¿¡]/i.test(text) ||
    /\b(necesito|quiero|boletos|entradas|por|para|mañana|opcion|opciones|hola|gracias|asegurar|seccion|fila|escenario|menos)\b/i.test(
      text,
    )
  );
}

function looksEnglishText(value: string | null | undefined): boolean {
  const text = value?.trim().toLowerCase() ?? "";
  if (!text) return false;

  return /\b(i|need|tickets|for|under|total|option|options|hello|thanks|section|row|stage|closer)\b/i.test(
    text,
  );
}

export function detectTicketConciergeLanguage(
  value: string | null | undefined,
): TicketConciergeLanguage | null {
  if (looksSpanishText(value)) return "es";
  if (looksEnglishText(value)) return "en";
  return null;
}

export function getStoredTicketConciergeLanguage(
  metadata: Record<string, unknown> | null | undefined,
): TicketConciergeLanguage | null {
  const seller = parseMetadataRecord(metadata?.ticketConciergeSeller);
  const language = seller.language;
  return language === "es" || language === "en" ? language : null;
}

export function resolveTicketConciergeLanguage(input: {
  defaultLanguage?: TicketConciergeLanguage;
  messageText: string | null | undefined;
  metadata: Record<string, unknown> | null | undefined;
}): TicketConciergeLanguage {
  return (
    detectTicketConciergeLanguage(input.messageText) ??
    getStoredTicketConciergeLanguage(input.metadata) ??
    input.defaultLanguage ??
    "es"
  );
}

