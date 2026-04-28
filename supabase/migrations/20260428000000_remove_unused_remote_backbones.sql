-- Remove remote-only backbones that no longer have any active product or code path.
-- Keep the narrow production baseline: campaigns, campaign snapshots, client accounts,
-- memberships, invites, contact submissions, Meta campaign data, Ticketmaster ingest,
-- system events, and admin activity.

-- Old agency operating-system prototype tables.
drop table if exists public.agency_os_task_receipts cascade;
drop table if exists public.agency_os_system_events cascade;
drop table if exists public.agency_os_runtime_status cascade;
drop table if exists public.agency_os_runtime_locks cascade;
drop table if exists public.agency_os_entity_comments cascade;
drop table if exists public.agency_os_agent_handoffs cascade;
drop table if exists public.agency_os_agent_recommendations cascade;
drop table if exists public.agency_os_agent_tasks cascade;
drop table if exists public.agency_os_approval_requests cascade;
drop table if exists public.agency_os_assets cascade;
drop table if exists public.agency_os_conversations cascade;
drop table if exists public.agency_os_contacts cascade;
drop table if exists public.agency_os_context_bindings cascade;
drop table if exists public.agency_os_events cascade;
drop table if exists public.agency_os_campaigns cascade;
drop table if exists public.agency_os_clients cascade;
drop table if exists public.agency_os_schema_migrations cascade;

-- Old call-center / quiz / lead-capture prototypes.
drop table if exists public.call_transcript_turns cascade;
drop table if exists public.recordings cascade;
drop table if exists public.scheduled_callbacks cascade;
drop table if exists public.calls cascade;
drop table if exists public.quiz_progress cascade;
drop table if exists public.quiz_results cascade;
drop table if exists public.pf_leads cascade;
drop table if exists public.leads cascade;
drop table if exists public.internal_dnc cascade;
drop table if exists public.compliance_logs cascade;
drop table if exists public.conversation_checkpoints cascade;
drop table if exists public.client_services cascade;
drop table if exists public.admin_audit_log cascade;
drop table if exists public.sms_capture cascade;

-- Old autonomous growth / social backbones.
drop table if exists public.growth_publish_attempts cascade;
drop table if exists public.growth_playbooks cascade;
drop table if exists public.growth_leads cascade;
drop table if exists public.growth_inbound_events cascade;
drop table if exists public.growth_post_targets cascade;
drop table if exists public.growth_content_jobs cascade;
drop table if exists public.growth_ideas cascade;
drop table if exists public.growth_lanes cascade;
drop table if exists public.growth_accounts cascade;

-- Old SBR music-discovery backbones.
drop table if exists public.sbr_refreshes_in_progress cascade;
drop table if exists public.sbr_track_snapshot_history cascade;
drop table if exists public.sbr_track_snapshots cascade;
drop table if exists public.sbr_track_cache cascade;
drop table if exists public.sbr_follows cascade;
drop table if exists public.sbr_watchlist cascade;
drop table if exists public.sbr_reports cascade;
drop table if exists public.sbr_account_pool_state cascade;
drop table if exists public.sbr_config cascade;

-- Old WhatsApp/ticket concierge backbones.
drop table if exists public.whatsapp_ticket_concierge_checkout_attempts cascade;
drop table if exists public.whatsapp_ticket_concierge_options cascade;
drop table if exists public.whatsapp_ticket_concierge_option_sets cascade;
drop table if exists public.whatsapp_ticket_concierge_runs cascade;
drop table if exists public.whatsapp_ticket_concierge_bans cascade;
drop table if exists public.whatsapp_messages cascade;
drop table if exists public.whatsapp_conversations cascade;
drop table if exists public.whatsapp_contacts cascade;
drop table if exists public.whatsapp_accounts cascade;

-- Unused aggregate not read by the active app; event_snapshots/tm_event_demographics remain.
drop table if exists public.tm_event_daily cascade;
