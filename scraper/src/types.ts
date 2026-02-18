export interface TmEvent {
  tm_id: string;          // TM1 event ID (e.g. "vvG17ZpMk8SHGS")
  tm1_number: string;     // Human-readable TM1 number shown in promoter portal
  name: string;
  artist: string;
  venue: string;
  city: string;
  date: string;           // ISO string
  status: string;         // "onsale" | "presale" | "offsale" | "cancelled"
  tickets_sold?: number;
  tickets_available?: number;
  gross?: number;         // Revenue in cents
  url: string;
  scraped_at: string;     // ISO string
}

export interface ScrapeResult {
  events: TmEvent[];
  scraped_at: string;
  source: "ticketmaster_one" | "ticketmaster_public";
  error?: string;
}

export interface IngestPayload {
  secret: string;
  source: string;
  data: ScrapeResult;
}
