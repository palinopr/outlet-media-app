export interface TmEvent {
  tm_id: string;
  tm1_number: string;
  name: string;
  artist: string;
  venue: string;
  city: string;
  date: string | null;
  status: string;
  tickets_sold: number | null;
  tickets_available: number | null;
  gross: number | null;
  url: string;
  scraped_at: string;
}

export interface AgentRunOptions {
  prompt: string;
  /** Agent ID — used to customise tools/turns per agent type */
  agentId?: string;
  /** If true, runs silently and only returns the final text */
  silent?: boolean;
  /** Callback to stream text chunks (for Telegram live updates and DB streaming) */
  onChunk?: (text: string) => void;
}

export interface AgentRunResult {
  text: string;
  success: boolean;
  error?: string;
}
