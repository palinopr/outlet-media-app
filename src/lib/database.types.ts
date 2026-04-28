export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_activity: {
        Row: {
          created_at: string
          detail: string | null
          event_type: string
          id: number
          metadata: Json | null
          page: string | null
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          event_type: string
          id?: never
          metadata?: Json | null
          page?: string | null
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          event_type?: string
          id?: never
          metadata?: Json | null
          page?: string | null
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_client_overrides: {
        Row: {
          campaign_id: string
          client_slug: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          client_slug: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          client_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_snapshots: {
        Row: {
          campaign_id: string
          clicks: number | null
          cpc: number | null
          cpm: number | null
          created_at: string
          ctr: number | null
          id: string
          impressions: number | null
          roas: number | null
          snapshot_date: string
          spend: number | null
        }
        Insert: {
          campaign_id: string
          clicks?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number | null
          roas?: number | null
          snapshot_date?: string
          spend?: number | null
        }
        Update: {
          campaign_id?: string
          clicks?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number | null
          roas?: number | null
          snapshot_date?: string
          spend?: number | null
        }
        Relationships: []
      }
      client_access_invites: {
        Row: {
          accepted_at: string | null
          accepted_by_clerk_user_id: string | null
          clerk_invitation_id: string | null
          client_id: string
          client_role: string
          created_at: string
          email: string
          id: string
          revoked_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_clerk_user_id?: string | null
          clerk_invitation_id?: string | null
          client_id: string
          client_role?: string
          created_at?: string
          email: string
          id?: string
          revoked_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by_clerk_user_id?: string | null
          clerk_invitation_id?: string | null
          client_id?: string
          client_role?: string
          created_at?: string
          email?: string
          id?: string
          revoked_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_access_invites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_accounts: {
        Row: {
          access_token_encrypted: string
          ad_account_id: string
          ad_account_name: string | null
          clerk_user_id: string
          client_slug: string
          connected_at: string
          created_at: string
          id: string
          last_used_at: string | null
          meta_user_id: string
          scopes: string[]
          status: string
          token_expires_at: string
          updated_at: string
        }
        Insert: {
          access_token_encrypted: string
          ad_account_id: string
          ad_account_name?: string | null
          clerk_user_id: string
          client_slug: string
          connected_at?: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          meta_user_id: string
          scopes?: string[]
          status?: string
          token_expires_at: string
          updated_at?: string
        }
        Update: {
          access_token_encrypted?: string
          ad_account_id?: string
          ad_account_name?: string | null
          clerk_user_id?: string
          client_slug?: string
          connected_at?: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          meta_user_id?: string
          scopes?: string[]
          status?: string
          token_expires_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_member_campaigns: {
        Row: {
          campaign_id: string
          created_at: string | null
          id: string
          member_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          id?: string
          member_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_member_campaigns_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "client_members"
            referencedColumns: ["id"]
          },
        ]
      }
      client_members: {
        Row: {
          clerk_user_id: string
          client_id: string
          created_at: string
          id: string
          role: string
          scope: string
        }
        Insert: {
          clerk_user_id: string
          client_id: string
          created_at?: string
          id?: string
          role?: string
          scope?: string
        }
        Update: {
          clerk_user_id?: string
          client_id?: string
          created_at?: string
          id?: string
          role?: string
          scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          name: string
          portal_brand_name: string | null
          portal_logo_alt: string | null
          portal_logo_url: string | null
          slug: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          portal_brand_name?: string | null
          portal_logo_alt?: string | null
          portal_logo_url?: string | null
          slug: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          portal_brand_name?: string | null
          portal_logo_alt?: string | null
          portal_logo_url?: string | null
          slug?: string
          status?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      event_snapshots: {
        Row: {
          created_at: string
          gross: number | null
          id: string
          snapshot_date: string
          tickets_available: number | null
          tickets_sold: number | null
          tm_id: string
        }
        Insert: {
          created_at?: string
          gross?: number | null
          id?: string
          snapshot_date?: string
          tickets_available?: number | null
          tickets_sold?: number | null
          tm_id: string
        }
        Update: {
          created_at?: string
          gross?: number | null
          id?: string
          snapshot_date?: string
          tickets_available?: number | null
          tickets_sold?: number | null
          tm_id?: string
        }
        Relationships: []
      }
      meta_campaigns: {
        Row: {
          campaign_id: string
          campaign_type: string | null
          clicks: number | null
          client_slug: string | null
          cpc: number | null
          cpm: number | null
          created_at: string
          ctr: number | null
          daily_budget: number | null
          id: string
          impressions: number | null
          lifetime_budget: number | null
          name: string
          objective: string
          reach: number | null
          roas: number | null
          spend: number | null
          start_time: string | null
          status: string
          synced_at: string
          tm_event_id: string | null
          updated_at: string
        }
        Insert: {
          campaign_id: string
          campaign_type?: string | null
          clicks?: number | null
          client_slug?: string | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          ctr?: number | null
          daily_budget?: number | null
          id?: string
          impressions?: number | null
          lifetime_budget?: number | null
          name?: string
          objective?: string
          reach?: number | null
          roas?: number | null
          spend?: number | null
          start_time?: string | null
          status?: string
          synced_at?: string
          tm_event_id?: string | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          campaign_type?: string | null
          clicks?: number | null
          client_slug?: string | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          ctr?: number | null
          daily_budget?: number | null
          id?: string
          impressions?: number | null
          lifetime_budget?: number | null
          name?: string
          objective?: string
          reach?: number | null
          roas?: number | null
          spend?: number | null
          start_time?: string | null
          status?: string
          synced_at?: string
          tm_event_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meta_campaigns_tm_event_id_fkey"
            columns: ["tm_event_id"]
            isOneToOne: false
            referencedRelation: "tm_events"
            referencedColumns: ["id"]
          },
        ]
      }
      system_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          actor_type: string
          causation_id: string | null
          client_slug: string | null
          correlation_id: string | null
          created_at: string
          detail: string | null
          entity_id: string | null
          entity_type: string | null
          event_name: string
          event_version: number
          id: string
          idempotency_key: string | null
          metadata: Json
          occurred_at: string
          page_id: string | null
          source: string
          summary: string
          task_id: string | null
          visibility: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          actor_type?: string
          causation_id?: string | null
          client_slug?: string | null
          correlation_id?: string | null
          created_at?: string
          detail?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_name: string
          event_version?: number
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          occurred_at?: string
          page_id?: string | null
          source?: string
          summary: string
          task_id?: string | null
          visibility?: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          actor_type?: string
          causation_id?: string | null
          client_slug?: string | null
          correlation_id?: string | null
          created_at?: string
          detail?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_name?: string
          event_version?: number
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          occurred_at?: string
          page_id?: string | null
          source?: string
          summary?: string
          task_id?: string | null
          visibility?: string
        }
        Relationships: []
      }
      tm_event_demographics: {
        Row: {
          age_18_24_pct: number | null
          age_25_34_pct: number | null
          age_35_44_pct: number | null
          age_45_54_pct: number | null
          age_over_54_pct: number | null
          created_at: string
          education_college_pct: number | null
          education_grad_school_pct: number | null
          education_high_school_pct: number | null
          fans_female_pct: number | null
          fans_male_pct: number | null
          fans_married_pct: number | null
          fans_total: number | null
          fans_with_children_pct: number | null
          fetched_at: string
          id: string
          income_0_30k_pct: number | null
          income_30_60k_pct: number | null
          income_60_90k_pct: number | null
          income_90_125k_pct: number | null
          income_over_125k_pct: number | null
          payment_amex_pct: number | null
          payment_discover_pct: number | null
          payment_mc_pct: number | null
          payment_visa_pct: number | null
          tm_id: string
          updated_at: string
        }
        Insert: {
          age_18_24_pct?: number | null
          age_25_34_pct?: number | null
          age_35_44_pct?: number | null
          age_45_54_pct?: number | null
          age_over_54_pct?: number | null
          created_at?: string
          education_college_pct?: number | null
          education_grad_school_pct?: number | null
          education_high_school_pct?: number | null
          fans_female_pct?: number | null
          fans_male_pct?: number | null
          fans_married_pct?: number | null
          fans_total?: number | null
          fans_with_children_pct?: number | null
          fetched_at?: string
          id?: string
          income_0_30k_pct?: number | null
          income_30_60k_pct?: number | null
          income_60_90k_pct?: number | null
          income_90_125k_pct?: number | null
          income_over_125k_pct?: number | null
          payment_amex_pct?: number | null
          payment_discover_pct?: number | null
          payment_mc_pct?: number | null
          payment_visa_pct?: number | null
          tm_id: string
          updated_at?: string
        }
        Update: {
          age_18_24_pct?: number | null
          age_25_34_pct?: number | null
          age_35_44_pct?: number | null
          age_45_54_pct?: number | null
          age_over_54_pct?: number | null
          created_at?: string
          education_college_pct?: number | null
          education_grad_school_pct?: number | null
          education_high_school_pct?: number | null
          fans_female_pct?: number | null
          fans_male_pct?: number | null
          fans_married_pct?: number | null
          fans_total?: number | null
          fans_with_children_pct?: number | null
          fetched_at?: string
          id?: string
          income_0_30k_pct?: number | null
          income_30_60k_pct?: number | null
          income_60_90k_pct?: number | null
          income_90_125k_pct?: number | null
          income_over_125k_pct?: number | null
          payment_amex_pct?: number | null
          payment_discover_pct?: number | null
          payment_mc_pct?: number | null
          payment_visa_pct?: number | null
          tm_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tm_event_demographics_tm_id_fkey"
            columns: ["tm_id"]
            isOneToOne: true
            referencedRelation: "tm_events"
            referencedColumns: ["tm_id"]
          },
        ]
      }
      tm_events: {
        Row: {
          artist: string
          avg_ticket_price: number | null
          channel_box_pct: number | null
          channel_internet_pct: number | null
          channel_mobile_pct: number | null
          channel_phone_pct: number | null
          city: string
          client_slug: string | null
          conversion_rate: number | null
          created_at: string
          date: string | null
          edp_avg_daily_views: number | null
          edp_total_views: number | null
          fans_female_pct: number | null
          fans_male_pct: number | null
          fans_total: number | null
          gross: number | null
          id: string
          name: string
          potential_revenue: number | null
          revenue_today: number | null
          scraped_at: string
          status: string
          surrogate_id: string | null
          ticket_revenue: number | null
          tickets_available: number | null
          tickets_sold: number | null
          tickets_sold_today: number | null
          tm_id: string
          tm1_number: string
          updated_at: string
          url: string
          venue: string
        }
        Insert: {
          artist?: string
          avg_ticket_price?: number | null
          channel_box_pct?: number | null
          channel_internet_pct?: number | null
          channel_mobile_pct?: number | null
          channel_phone_pct?: number | null
          city?: string
          client_slug?: string | null
          conversion_rate?: number | null
          created_at?: string
          date?: string | null
          edp_avg_daily_views?: number | null
          edp_total_views?: number | null
          fans_female_pct?: number | null
          fans_male_pct?: number | null
          fans_total?: number | null
          gross?: number | null
          id?: string
          name?: string
          potential_revenue?: number | null
          revenue_today?: number | null
          scraped_at: string
          status?: string
          surrogate_id?: string | null
          ticket_revenue?: number | null
          tickets_available?: number | null
          tickets_sold?: number | null
          tickets_sold_today?: number | null
          tm_id: string
          tm1_number?: string
          updated_at?: string
          url?: string
          venue?: string
        }
        Update: {
          artist?: string
          avg_ticket_price?: number | null
          channel_box_pct?: number | null
          channel_internet_pct?: number | null
          channel_mobile_pct?: number | null
          channel_phone_pct?: number | null
          city?: string
          client_slug?: string | null
          conversion_rate?: number | null
          created_at?: string
          date?: string | null
          edp_avg_daily_views?: number | null
          edp_total_views?: number | null
          fans_female_pct?: number | null
          fans_male_pct?: number | null
          fans_total?: number | null
          gross?: number | null
          id?: string
          name?: string
          potential_revenue?: number | null
          revenue_today?: number | null
          scraped_at?: string
          status?: string
          surrogate_id?: string | null
          ticket_revenue?: number | null
          tickets_available?: number | null
          tickets_sold?: number | null
          tickets_sold_today?: number | null
          tm_id?: string
          tm1_number?: string
          updated_at?: string
          url?: string
          venue?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_clerk_user_id: { Args: never; Returns: string }
      effective_campaign_client_slug: {
        Args: { input_campaign_id: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_current_client_member: {
        Args: { target_client_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
