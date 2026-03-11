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
          id: number
          created_at: string
          user_id: string
          user_email: string
          event_type: string
          page: string | null
          detail: string | null
          metadata: Json | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          user_email: string
          event_type: string
          page?: string | null
          detail?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          user_email?: string
          event_type?: string
          page?: string | null
          detail?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      agent_alerts: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          read_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          message: string
          read_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          read_at?: string | null
        }
        Relationships: []
      }
      agent_jobs: {
        Row: {
          agent_id: string
          created_at: string
          error: string | null
          finished_at: string | null
          id: string
          prompt: string | null
          result: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          prompt?: string | null
          result?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          prompt?: string | null
          result?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_tasks: {
        Row: {
          action: string
          approved_by: string | null
          completed_at: string | null
          created_at: string | null
          discord_message_id: string | null
          error: string | null
          from_agent: string
          id: string
          params: Json | null
          result: Json | null
          started_at: string | null
          status: string
          tier: string
          to_agent: string
        }
        Insert: {
          action: string
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          discord_message_id?: string | null
          error?: string | null
          from_agent: string
          id?: string
          params?: Json | null
          result?: Json | null
          started_at?: string | null
          status?: string
          tier?: string
          to_agent: string
        }
        Update: {
          action?: string
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          discord_message_id?: string | null
          error?: string | null
          from_agent?: string
          id?: string
          params?: Json | null
          result?: Json | null
          started_at?: string | null
          status?: string
          tier?: string
          to_agent?: string
        }
        Relationships: []
      }
      agent_runtime_state: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      email_drafts: {
        Row: {
          body_text: string
          cc_emails: Json
          confidence: string | null
          created_at: string
          id: string
          language: string | null
          message_id: string | null
          metadata: Json
          rationale: string | null
          sent_at: string | null
          sent_message_id: string | null
          status: string
          subject: string | null
          thread_id: string
          to_emails: Json
          updated_at: string
        }
        Insert: {
          body_text: string
          cc_emails?: Json
          confidence?: string | null
          created_at?: string
          id?: string
          language?: string | null
          message_id?: string | null
          metadata?: Json
          rationale?: string | null
          sent_at?: string | null
          sent_message_id?: string | null
          status?: string
          subject?: string | null
          thread_id: string
          to_emails?: Json
          updated_at?: string
        }
        Update: {
          body_text?: string
          cc_emails?: Json
          confidence?: string | null
          created_at?: string
          id?: string
          language?: string | null
          message_id?: string | null
          metadata?: Json
          rationale?: string | null
          sent_at?: string | null
          sent_message_id?: string | null
          status?: string
          subject?: string | null
          thread_id?: string
          to_emails?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_drafts_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "email_events"
            referencedColumns: ["message_id"]
          },
        ]
      }
      email_events: {
        Row: {
          activity_context: Json
          applied_labels: Json
          body_text: string | null
          business_context: Json
          cc_emails: Json
          classification: string | null
          client_slug: string | null
          contact_email: string | null
          created_at: string
          direction: string
          gmail_label_ids: Json
          id: string
          importance: string | null
          message_id: string
          metadata: Json
          needs_reply: boolean
          received_at: string | null
          recipient_emails: Json
          sender_email: string | null
          sender_name: string | null
          should_archive: boolean
          should_notify: boolean
          snippet: string | null
          status: string
          subject: string | null
          thread_id: string
          thread_summary: string | null
          updated_at: string
        }
        Insert: {
          activity_context?: Json
          applied_labels?: Json
          body_text?: string | null
          business_context?: Json
          cc_emails?: Json
          classification?: string | null
          client_slug?: string | null
          contact_email?: string | null
          created_at?: string
          direction: string
          gmail_label_ids?: Json
          id?: string
          importance?: string | null
          message_id: string
          metadata?: Json
          needs_reply?: boolean
          received_at?: string | null
          recipient_emails?: Json
          sender_email?: string | null
          sender_name?: string | null
          should_archive?: boolean
          should_notify?: boolean
          snippet?: string | null
          status?: string
          subject?: string | null
          thread_id: string
          thread_summary?: string | null
          updated_at?: string
        }
        Update: {
          activity_context?: Json
          applied_labels?: Json
          body_text?: string | null
          business_context?: Json
          cc_emails?: Json
          classification?: string | null
          client_slug?: string | null
          contact_email?: string | null
          created_at?: string
          direction?: string
          gmail_label_ids?: Json
          id?: string
          importance?: string | null
          message_id?: string
          metadata?: Json
          needs_reply?: boolean
          received_at?: string | null
          recipient_emails?: Json
          sender_email?: string | null
          sender_name?: string | null
          should_archive?: boolean
          should_notify?: boolean
          snippet?: string | null
          status?: string
          subject?: string | null
          thread_id?: string
          thread_summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_reply_examples: {
        Row: {
          body_text: string
          client_slug: string | null
          contact_email: string | null
          created_at: string
          id: string
          language: string | null
          message_id: string
          metadata: Json
          subject: string | null
          thread_id: string
          topic: string | null
        }
        Insert: {
          body_text: string
          client_slug?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          language?: string | null
          message_id: string
          metadata?: Json
          subject?: string | null
          thread_id: string
          topic?: string | null
        }
        Update: {
          body_text?: string
          client_slug?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          language?: string | null
          message_id?: string
          metadata?: Json
          subject?: string | null
          thread_id?: string
          topic?: string | null
        }
        Relationships: []
      }
      call_transcript_turns: {
        Row: {
          call_id: string
          created_at: string | null
          id: string
          is_final: boolean | null
          source: string
          speaker: string
          text: string
          turn_index: number
        }
        Insert: {
          call_id: string
          created_at?: string | null
          id?: string
          is_final?: boolean | null
          source: string
          speaker: string
          text: string
          turn_index: number
        }
        Update: {
          call_id?: string
          created_at?: string | null
          id?: string
          is_final?: boolean | null
          source?: string
          speaker?: string
          text?: string
          turn_index?: number
        }
        Relationships: []
      }
      calls: {
        Row: {
          ai_disclosure_given: boolean | null
          call_id: string
          created_at: string | null
          dnc_checked: boolean | null
          dnc_clear: boolean | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          lead_id: string | null
          lead_score: number | null
          outcome: string | null
          phone_number: string
          recording_consent_given: boolean | null
          recording_duration_seconds: number | null
          recording_url: string | null
          start_time: string
          summary: string | null
          transcript: string | null
          transcript_status: string | null
          transfer_completed: boolean | null
          transfer_context: string | null
          updated_at: string | null
        }
        Insert: {
          ai_disclosure_given?: boolean | null
          call_id: string
          created_at?: string | null
          dnc_checked?: boolean | null
          dnc_clear?: boolean | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          lead_id?: string | null
          lead_score?: number | null
          outcome?: string | null
          phone_number: string
          recording_consent_given?: boolean | null
          recording_duration_seconds?: number | null
          recording_url?: string | null
          start_time: string
          summary?: string | null
          transcript?: string | null
          transcript_status?: string | null
          transfer_completed?: boolean | null
          transfer_context?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_disclosure_given?: boolean | null
          call_id?: string
          created_at?: string | null
          dnc_checked?: boolean | null
          dnc_clear?: boolean | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          lead_id?: string | null
          lead_score?: number | null
          outcome?: string | null
          phone_number?: string
          recording_consent_given?: boolean | null
          recording_duration_seconds?: number | null
          recording_url?: string | null
          start_time?: string
          summary?: string | null
          transcript?: string | null
          transcript_status?: string | null
          transfer_completed?: boolean | null
          transfer_context?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      client_accounts: {
        Row: {
          id: string
          clerk_user_id: string
          client_slug: string
          meta_user_id: string
          ad_account_id: string
          ad_account_name: string | null
          access_token_encrypted: string
          token_expires_at: string
          scopes: string[]
          status: string
          connected_at: string
          last_used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          client_slug: string
          meta_user_id: string
          ad_account_id: string
          ad_account_name?: string | null
          access_token_encrypted: string
          token_expires_at: string
          scopes?: string[]
          status?: string
          connected_at?: string
          last_used_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          client_slug?: string
          meta_user_id?: string
          ad_account_id?: string
          ad_account_name?: string | null
          access_token_encrypted?: string
          token_expires_at?: string
          scopes?: string[]
          status?: string
          connected_at?: string
          last_used_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_member_campaigns: {
        Row: {
          id: string
          member_id: string
          campaign_id: string
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          campaign_id: string
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          campaign_id?: string
          created_at?: string
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
      client_member_events: {
        Row: {
          id: string
          member_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          event_id: string
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          event_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_member_events_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "client_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_member_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "tm_events"
            referencedColumns: ["id"]
          },
        ]
      }
      client_members: {
        Row: {
          id: string
          client_id: string
          clerk_user_id: string
          role: string
          scope: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          clerk_user_id: string
          role?: string
          scope?: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          clerk_user_id?: string
          role?: string
          scope?: string
          created_at?: string
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
      client_services: {
        Row: {
          client_id: string
          config: Json
          created_at: string
          enabled: boolean
          id: string
          service_key: string
          updated_at: string
        }
        Insert: {
          client_id: string
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          service_key: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          service_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          events_enabled: boolean
          id: string
          name: string
          slug: string
          status: string
          created_at: string
        }
        Insert: {
          events_enabled?: boolean
          id?: string
          name: string
          slug: string
          status?: string
          created_at?: string
        }
        Update: {
          events_enabled?: boolean
          id?: string
          name?: string
          slug?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      compliance_logs: {
        Row: {
          call_id: string
          event_data: Json | null
          event_type: string
          id: string
          timestamp: string | null
        }
        Insert: {
          call_id: string
          event_data?: Json | null
          event_type: string
          id?: string
          timestamp?: string | null
        }
        Update: {
          call_id?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      conversation_checkpoints: {
        Row: {
          checkpoint: Json
          created_at: string | null
          metadata: Json | null
          thread_id: string
          updated_at: string | null
        }
        Insert: {
          checkpoint: Json
          created_at?: string | null
          metadata?: Json | null
          thread_id: string
          updated_at?: string | null
        }
        Update: {
          checkpoint?: Json
          created_at?: string | null
          metadata?: Json | null
          thread_id?: string
          updated_at?: string | null
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
      internal_dnc: {
        Row: {
          added_at: string | null
          id: string
          phone_number: string
          reason: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          phone_number: string
          reason?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          phone_number?: string
          reason?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          ad_campaign: string | null
          age: number | null
          beneficiary_relationship: string | null
          budget_range: string | null
          city: string | null
          coverage_amount_interest: number | null
          created_at: string | null
          crm_lead_id: string | null
          crm_synced: boolean | null
          email: string | null
          first_name: string | null
          general_health: string | null
          has_existing_coverage: boolean | null
          has_recent_hospitalization: boolean | null
          id: string
          interest_level: string | null
          last_name: string | null
          lead_score: number | null
          lead_status: string | null
          phone_number: string
          reason_for_interest: string | null
          smoker: boolean | null
          source: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          ad_campaign?: string | null
          age?: number | null
          beneficiary_relationship?: string | null
          budget_range?: string | null
          city?: string | null
          coverage_amount_interest?: number | null
          created_at?: string | null
          crm_lead_id?: string | null
          crm_synced?: boolean | null
          email?: string | null
          first_name?: string | null
          general_health?: string | null
          has_existing_coverage?: boolean | null
          has_recent_hospitalization?: boolean | null
          id?: string
          interest_level?: string | null
          last_name?: string | null
          lead_score?: number | null
          lead_status?: string | null
          phone_number: string
          reason_for_interest?: string | null
          smoker?: boolean | null
          source?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          ad_campaign?: string | null
          age?: number | null
          beneficiary_relationship?: string | null
          budget_range?: string | null
          city?: string | null
          coverage_amount_interest?: number | null
          created_at?: string | null
          crm_lead_id?: string | null
          crm_synced?: boolean | null
          email?: string | null
          first_name?: string | null
          general_health?: string | null
          has_existing_coverage?: boolean | null
          has_recent_hospitalization?: boolean | null
          id?: string
          interest_level?: string | null
          last_name?: string | null
          lead_score?: number | null
          lead_status?: string | null
          phone_number?: string
          reason_for_interest?: string | null
          smoker?: boolean | null
          source?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      meta_campaigns: {
        Row: {
          campaign_id: string
          campaign_type: string
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
          campaign_type?: string
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
          campaign_type?: string
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
      pf_leads: {
        Row: {
          age: number | null
          best_call_time: string | null
          coverage_amount: number | null
          created_at: string | null
          email: string | null
          funeral_cost_estimate: number | null
          gender: string | null
          health_answers: Json | null
          id: string
          name: string
          notes: string | null
          phone: string
          preferred_carrier: string | null
          source: string | null
          state: string | null
          status: string | null
          tobacco_use: boolean | null
          trustedform_cert_url: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          best_call_time?: string | null
          coverage_amount?: number | null
          created_at?: string | null
          email?: string | null
          funeral_cost_estimate?: number | null
          gender?: string | null
          health_answers?: Json | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          preferred_carrier?: string | null
          source?: string | null
          state?: string | null
          status?: string | null
          tobacco_use?: boolean | null
          trustedform_cert_url?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          best_call_time?: string | null
          coverage_amount?: number | null
          created_at?: string | null
          email?: string | null
          funeral_cost_estimate?: number | null
          gender?: string | null
          health_answers?: Json | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          preferred_carrier?: string | null
          source?: string | null
          state?: string | null
          status?: string | null
          tobacco_use?: boolean | null
          trustedform_cert_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_progress: {
        Row: {
          answers: Json
          current_index: number
          exam_id: string
          id: string
          question_order: Json | null
          updated_at: string
          user_name: string
        }
        Insert: {
          answers?: Json
          current_index?: number
          exam_id: string
          id?: string
          question_order?: Json | null
          updated_at?: string
          user_name: string
        }
        Update: {
          answers?: Json
          current_index?: number
          exam_id?: string
          id?: string
          question_order?: Json | null
          updated_at?: string
          user_name?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          completed_at: string
          exam_id: string
          id: string
          percentage: number
          score: number
          total: number
          user_name: string
          wrong_answers: Json | null
        }
        Insert: {
          completed_at?: string
          exam_id: string
          id?: string
          percentage: number
          score: number
          total: number
          user_name: string
          wrong_answers?: Json | null
        }
        Update: {
          completed_at?: string
          exam_id?: string
          id?: string
          percentage?: number
          score?: number
          total?: number
          user_name?: string
          wrong_answers?: Json | null
        }
        Relationships: []
      }
      recordings: {
        Row: {
          call_id: string
          duration_seconds: number | null
          file_size_bytes: number | null
          filename: string
          id: string
          mime_type: string | null
          public_url: string | null
          storage_path: string
          uploaded_at: string | null
        }
        Insert: {
          call_id: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          filename: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          storage_path: string
          uploaded_at?: string | null
        }
        Update: {
          call_id?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          filename?: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          storage_path?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      scheduled_callbacks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          phone_number: string
          scheduled_time: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          phone_number: string
          scheduled_time: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          phone_number?: string
          scheduled_time?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_callbacks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      tm_event_daily: {
        Row: {
          created_at: string
          date: string
          id: string
          revenue: number
          tickets_sold: number
          tm_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          revenue?: number
          tickets_sold?: number
          tm_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          revenue?: number
          tickets_sold?: number
          tm_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tm_event_daily_tm_id_fkey"
            columns: ["tm_id"]
            isOneToOne: false
            referencedRelation: "tm_events"
            referencedColumns: ["tm_id"]
          },
        ]
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
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          page_id: string | null
          task_id: string | null
          from_user_id: string | null
          from_user_name: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          page_id?: string | null
          task_id?: string | null
          from_user_id?: string | null
          from_user_name?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          page_id?: string | null
          task_id?: string | null
          from_user_id?: string | null
          from_user_name?: string | null
          read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "workspace_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notif_task_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "workspace_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_comments: {
        Row: {
          id: string
          page_id: string
          content: string
          author_id: string
          author_name: string | null
          parent_comment_id: string | null
          resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          content: string
          author_id: string
          author_name?: string | null
          parent_comment_id?: string | null
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          content?: string
          author_id?: string
          author_name?: string | null
          parent_comment_id?: string | null
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_comments_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "workspace_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "workspace_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_pages: {
        Row: {
          id: string
          title: string
          content: Json
          icon: string | null
          cover_image: string | null
          parent_page_id: string | null
          client_slug: string
          created_by: string
          is_archived: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          content?: Json
          icon?: string | null
          cover_image?: string | null
          parent_page_id?: string | null
          client_slug: string
          created_by: string
          is_archived?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: Json
          icon?: string | null
          cover_image?: string | null
          parent_page_id?: string | null
          client_slug?: string
          created_by?: string
          is_archived?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_pages_parent_page_id_fkey"
            columns: ["parent_page_id"]
            isOneToOne: false
            referencedRelation: "workspace_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_tasks: {
        Row: {
          id: string
          title: string
          description: Json
          status: string
          priority: string
          assignee_id: string | null
          assignee_name: string | null
          page_id: string | null
          client_slug: string
          created_by: string
          due_date: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: Json
          status?: string
          priority?: string
          assignee_id?: string | null
          assignee_name?: string | null
          page_id?: string | null
          client_slug: string
          created_by: string
          due_date?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: Json
          status?: string
          priority?: string
          assignee_id?: string | null
          assignee_name?: string | null
          page_id?: string | null
          client_slug?: string
          created_by?: string
          due_date?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_tasks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "workspace_pages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
