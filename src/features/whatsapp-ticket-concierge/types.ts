export type TicketConciergePreference =
  | "near_stage"
  | "center_view"
  | "lower_level"
  | "aisle";

export interface TicketConciergeIntent {
  quantity?: number;
  maxTotalCents?: number;
  preferences: TicketConciergePreference[];
}

export interface TicketConciergeScenario {
  key: string;
  clientSlug: string;
  entryTokens: string[];
  allowlist: {
    conversationIds: string[];
    waIds: string[];
  };
  eventContext: {
    artist: string;
    city: string;
    date: string;
    eventId: string;
    eventUrl: string;
  };
}

export interface TicketConciergePreparedOption {
  id: string;
  ordinal: 1 | 2 | 3;
  label: string;
  totalCents: number;
  section: string;
  row: string | null;
  seatLabels: string[];
  quantity: number;
  note: string;
  quoteSource: "exact";
  isUnderBudget: boolean;
  mapToken: string;
  mapSvg: string;
  execution: Record<string, unknown>;
}

export interface TicketConciergePreparedOptionSet {
  id: string;
  status: "active" | "selected" | "expired" | "replaced" | "no_inventory" | "lookup_failed";
  options: TicketConciergePreparedOption[];
}

export interface TicketConciergeSelectionResult {
  optionSetId: string;
  selectedOption: TicketConciergePreparedOption;
  checkoutUrl: string | null;
}
