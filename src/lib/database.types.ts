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
      application_errors: {
        Row: {
          created_at: string
          digest: string | null
          id: string
          level: string
          message: string
          metadata: Json
          route: string | null
          source: string
          stack: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          digest?: string | null
          id?: string
          level?: string
          message: string
          metadata?: Json
          route?: string | null
          source?: string
          stack?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          digest?: string | null
          id?: string
          level?: string
          message?: string
          metadata?: Json
          route?: string | null
          source?: string
          stack?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      marketing_attribution_events: {
        Row: {
          click_id: string | null
          client_event_id: string | null
          created_at: string
          cta: string | null
          device_type: string | null
          event_name: string
          fbclid: string | null
          fbc: string | null
          fbp: string | null
          funnel: string
          id: string
          landing_url: string | null
          market: string | null
          meta_ad_id: string | null
          meta_ad_name: string | null
          meta_adset_id: string | null
          meta_adset_name: string | null
          meta_campaign_id: string | null
          meta_campaign_name: string | null
          metadata: Json
          page_path: string | null
          placement: string | null
          referrer: string | null
          request_ip_hash: string | null
          sample_rate: number
          scroll_depth_pct: number | null
          section_id: string | null
          session_id: string | null
          site_source: string | null
          source_url: string | null
          user_agent_hash: string | null
          viewport_height: number | null
          viewport_orientation: string | null
          viewport_width: number | null
          visible_ratio: number | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          click_id?: string | null
          client_event_id?: string | null
          created_at?: string
          cta?: string | null
          device_type?: string | null
          event_name: string
          fbclid?: string | null
          fbc?: string | null
          fbp?: string | null
          funnel: string
          id?: string
          landing_url?: string | null
          market?: string | null
          meta_ad_id?: string | null
          meta_ad_name?: string | null
          meta_adset_id?: string | null
          meta_adset_name?: string | null
          meta_campaign_id?: string | null
          meta_campaign_name?: string | null
          metadata?: Json
          page_path?: string | null
          placement?: string | null
          referrer?: string | null
          request_ip_hash?: string | null
          sample_rate?: number
          scroll_depth_pct?: number | null
          section_id?: string | null
          session_id?: string | null
          site_source?: string | null
          source_url?: string | null
          user_agent_hash?: string | null
          viewport_height?: number | null
          viewport_orientation?: string | null
          viewport_width?: number | null
          visible_ratio?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          click_id?: string | null
          client_event_id?: string | null
          created_at?: string
          cta?: string | null
          device_type?: string | null
          event_name?: string
          fbclid?: string | null
          fbc?: string | null
          fbp?: string | null
          funnel?: string
          id?: string
          landing_url?: string | null
          market?: string | null
          meta_ad_id?: string | null
          meta_ad_name?: string | null
          meta_adset_id?: string | null
          meta_adset_name?: string | null
          meta_campaign_id?: string | null
          meta_campaign_name?: string | null
          metadata?: Json
          page_path?: string | null
          placement?: string | null
          referrer?: string | null
          request_ip_hash?: string | null
          sample_rate?: number
          scroll_depth_pct?: number | null
          section_id?: string | null
          session_id?: string | null
          site_source?: string | null
          source_url?: string | null
          user_agent_hash?: string | null
          viewport_height?: number | null
          viewport_orientation?: string | null
          viewport_width?: number | null
          visible_ratio?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      ticketmaster_capi_events: {
        Row: {
          attempt_count: number
          billing_state: string | null
          billing_zip: string | null
          country: string | null
          created_at: string
          currency: string | null
          error_message: string | null
          event_id: string
          event_name: string
          id: string
          is_test: boolean
          last_seen_at: string
          meta_ok: boolean
          meta_pixel_id: string | null
          meta_response: Json | null
          meta_status: number | null
          om_click_id: string | null
          om_session_id: string | null
          fbclid: string | null
          fbc: string | null
          fbp: string | null
          meta_ad_id: string | null
          meta_ad_name: string | null
          meta_adset_id: string | null
          meta_adset_name: string | null
          meta_campaign_id: string | null
          meta_campaign_name: string | null
          placement: string | null
          site_source: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          order_hash: string | null
          order_id: string | null
          quantity: number | null
          request_ip_hash: string | null
          skip_reason: string | null
          source_url: string | null
          ticketmaster_event_date: string | null
          ticketmaster_event_id: string | null
          ticketmaster_event_name: string | null
          user_agent_hash: string | null
          value: number | null
        }
        Insert: {
          attempt_count?: number
          billing_state?: string | null
          billing_zip?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          error_message?: string | null
          event_id: string
          event_name: string
          id?: string
          is_test?: boolean
          last_seen_at?: string
          meta_ok?: boolean
          meta_pixel_id?: string | null
          meta_response?: Json | null
          meta_status?: number | null
          om_click_id?: string | null
          om_session_id?: string | null
          fbclid?: string | null
          fbc?: string | null
          fbp?: string | null
          meta_ad_id?: string | null
          meta_ad_name?: string | null
          meta_adset_id?: string | null
          meta_adset_name?: string | null
          meta_campaign_id?: string | null
          meta_campaign_name?: string | null
          placement?: string | null
          site_source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          order_hash?: string | null
          order_id?: string | null
          quantity?: number | null
          request_ip_hash?: string | null
          skip_reason?: string | null
          source_url?: string | null
          ticketmaster_event_date?: string | null
          ticketmaster_event_id?: string | null
          ticketmaster_event_name?: string | null
          user_agent_hash?: string | null
          value?: number | null
        }
        Update: {
          attempt_count?: number
          billing_state?: string | null
          billing_zip?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          error_message?: string | null
          event_id?: string
          event_name?: string
          id?: string
          is_test?: boolean
          last_seen_at?: string
          meta_ok?: boolean
          meta_pixel_id?: string | null
          meta_response?: Json | null
          meta_status?: number | null
          om_click_id?: string | null
          om_session_id?: string | null
          fbclid?: string | null
          fbc?: string | null
          fbp?: string | null
          meta_ad_id?: string | null
          meta_ad_name?: string | null
          meta_adset_id?: string | null
          meta_adset_name?: string | null
          meta_campaign_id?: string | null
          meta_campaign_name?: string | null
          placement?: string | null
          site_source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          order_hash?: string | null
          order_id?: string | null
          quantity?: number | null
          request_ip_hash?: string | null
          skip_reason?: string | null
          source_url?: string | null
          ticketmaster_event_date?: string | null
          ticketmaster_event_id?: string | null
          ticketmaster_event_name?: string | null
          user_agent_hash?: string | null
          value?: number | null
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
          updated_at?: string
        }
        Relationships: []
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
