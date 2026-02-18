/**
 * Supabase database types.
 * Run `npx supabase gen types typescript` to regenerate after schema changes.
 */
export interface Database {
  public: {
    Tables: {
      tm_events: {
        Row: {
          id: string;
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tm_events"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["tm_events"]["Insert"]>;
      };
      meta_campaigns: {
        Row: {
          id: string;
          campaign_id: string;
          name: string;
          status: string;
          objective: string;
          daily_budget: number | null;
          lifetime_budget: number | null;
          spend: number | null;
          impressions: number | null;
          clicks: number | null;
          reach: number | null;
          cpm: number | null;
          cpc: number | null;
          ctr: number | null;
          roas: number | null;
          client_slug: string | null;
          tm_event_id: string | null;
          synced_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["meta_campaigns"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["meta_campaigns"]["Insert"]>;
      };
      agent_jobs: {
        Row: {
          id: string;
          agent_id: string;
          status: string;
          prompt: string | null;
          result: string | null;
          error: string | null;
          created_at: string;
          updated_at: string;
          started_at: string | null;
          finished_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["agent_jobs"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["agent_jobs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
