# supabase / migrations

Generated from the current working tree on 2026-04-10 17:55:29.

- Files: 67
- File kinds: SQL migration/query (67)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `supabase/migrations/20260129182639_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260129182646_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260129182705_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260129182720_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260205002737_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260205235458_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260210220310_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260210220834_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260212011915_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260216064933_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260216070410_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260216070431_remote.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 0
- Bytes: 0
- Contents summary: SQL migration or query file

## `supabase/migrations/20260218000000_initial_schema.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 135
- Bytes: 5929
- SQL objects: create table: public.tm_events, create table: public.meta_campaigns, create table: public.agent_jobs, alter table: public.agent_jobs, alter table: public.tm_events, alter table: public.meta_campaigns, function: public.handle_updated_at, policy: "jobs_read" on public.agent_jobs, policy: "jobs_insert" on public.agent_jobs, policy: "jobs_update" on public.agent_jobs, policy: "events_read" on public.tm_events, policy: "events_insert" on public.tm_events, … (+8 more)
- Contents summary: create table: public.tm_events; create table: public.meta_campaigns; create table: public.agent_jobs; alter table: public.agent_jobs; alter table: public.tm_events; alter table: public.meta_campaigns; function: public.handle_updated_at; policy: "jobs_read" on public.agent_jobs

## `supabase/migrations/20260218120000_snapshot_tables.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 50
- Bytes: 1949
- SQL objects: create table: public.campaign_snapshots, create table: public.event_snapshots, alter table: public.campaign_snapshots, alter table: public.event_snapshots, policy: "campaign_snapshots_read" on public.campaign_snapshots, policy: "campaign_snapshots_insert" on public.campaign_snapshots, policy: "event_snapshots_read" on public.event_snapshots, policy: "event_snapshots_insert" on public.event_snapshots, index: campaign_snapshots_campaign_date_idx, index: event_snapshots_tm_date_idx
- Contents summary: create table: public.campaign_snapshots; create table: public.event_snapshots; alter table: public.campaign_snapshots; alter table: public.event_snapshots; policy: "campaign_snapshots_read" on public.campaign_snapshots; policy: "campaign_snapshots_insert" on public.campaign_snapshots; policy: "event_snapshots_read" on…

## `supabase/migrations/20260218130000_start_time.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 2
- Bytes: 83
- SQL objects: alter table: public.meta_campaigns
- Contents summary: alter table: public.meta_campaigns

## `supabase/migrations/20260218140000_agent_alerts.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 16
- Bytes: 681
- SQL objects: create table: public.agent_alerts, alter table: public.agent_alerts, policy: "alerts_read" on public.agent_alerts, policy: "alerts_insert" on public.agent_alerts, policy: "alerts_update" on public.agent_alerts, index: agent_alerts_created_idx
- Contents summary: create table: public.agent_alerts; alter table: public.agent_alerts; policy: "alerts_read" on public.agent_alerts; policy: "alerts_insert" on public.agent_alerts; policy: "alerts_update" on public.agent_alerts; index: agent_alerts_created_idx

## `supabase/migrations/20260218150000_tm_events_client_slug.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 7
- Bytes: 259
- SQL objects: alter table: tm_events, index: idx_tm_events_client_slug
- Contents summary: alter table: tm_events; index: idx_tm_events_client_slug

## `supabase/migrations/20260302000000_agent_tasks.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 27
- Bytes: 1399
- SQL objects: create table: public.agent_tasks, alter table: public.agent_tasks, policy: "agent_tasks_read" on public.agent_tasks, policy: "agent_tasks_insert" on public.agent_tasks, policy: "agent_tasks_update" on public.agent_tasks, index: idx_agent_tasks_to_agent_status, index: idx_agent_tasks_status, index: idx_agent_tasks_created
- Contents summary: create table: public.agent_tasks; alter table: public.agent_tasks; policy: "agent_tasks_read" on public.agent_tasks; policy: "agent_tasks_insert" on public.agent_tasks; policy: "agent_tasks_update" on public.agent_tasks; index: idx_agent_tasks_to_agent_status; index: idx_agent_tasks_status; index: idx_agent_tasks_crea…

## `supabase/migrations/20260302_create_client_accounts.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 27
- Bytes: 897
- SQL objects: create table: client_accounts, index: idx_client_accounts_clerk_user, index: idx_client_accounts_slug_status
- Contents summary: create table: client_accounts; index: idx_client_accounts_clerk_user; index: idx_client_accounts_slug_status

## `supabase/migrations/20260304000000_campaign_type.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 4
- Bytes: 164
- SQL objects: alter table: meta_campaigns
- Contents summary: alter table: meta_campaigns

## `supabase/migrations/20260305000000_system_events.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 60
- Bytes: 1770
- SQL objects: create table: public.system_events, alter table: public.system_events, policy: "system_events_read" on public.system_events, policy: "system_events_insert" on public.system_events, policy: "system_events_update" on public.system_events, policy: "system_events_delete" on public.system_events, index: idx_system_events_created_at, index: idx_system_events_client_slug_created_at, index: idx_system_events_event_name, index: idx_system_events_visibility_created_at, index: idx_system_events_page_id, index: idx_system_events_task_id
- Contents summary: create table: public.system_events; alter table: public.system_events; policy: "system_events_read" on public.system_events; policy: "system_events_insert" on public.system_events; policy: "system_events_update" on public.system_events; policy: "system_events_delete" on public.system_events; index: idx_system_events_c…

## `supabase/migrations/20260305001000_system_events_private_read.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 7
- Bytes: 160
- SQL objects: policy: "system_events_read" on public.system_events
- Contents summary: policy: "system_events_read" on public.system_events

## `supabase/migrations/20260305002000_approval_requests.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 59
- Bytes: 1851
- SQL objects: create table: public.approval_requests, alter table: public.approval_requests, policy: "approval_requests_read" on public.approval_requests, policy: "approval_requests_insert" on public.approval_requests, policy: "approval_requests_update" on public.approval_requests, policy: "approval_requests_delete" on public.approval_requests, index: idx_approval_requests_client_slug_created_at, index: idx_approval_requests_status_created_at, index: idx_approval_requests_audience_status, index: idx_approval_requests_entity
- Contents summary: create table: public.approval_requests; alter table: public.approval_requests; policy: "approval_requests_read" on public.approval_requests; policy: "approval_requests_insert" on public.approval_requests; policy: "approval_requests_update" on public.approval_requests; policy: "approval_requests_delete" on public.appro…

## `supabase/migrations/20260305003000_system_events_entity_index.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 3
- Bytes: 132
- SQL objects: index: idx_system_events_entity_created_at
- Contents summary: index: idx_system_events_entity_created_at

## `supabase/migrations/20260305004000_campaign_action_items.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 49
- Bytes: 1535
- SQL objects: create table: public.campaign_action_items, alter table: public.campaign_action_items, policy: "campaign_action_items_read" on public.campaign_action_items, policy: "campaign_action_items_insert" on public.campaign_action_items, policy: "campaign_action_items_update" on public.campaign_action_items, policy: "campaign_action_items_delete" on public.campaign_action_items, index: idx_campaign_action_items_campaign_status_position, index: idx_campaign_action_items_client_visibility
- Contents summary: create table: public.campaign_action_items; alter table: public.campaign_action_items; policy: "campaign_action_items_read" on public.campaign_action_items; policy: "campaign_action_items_insert" on public.campaign_action_items; policy: "campaign_action_items_update" on public.campaign_action_items; policy: "campaign_…

## `supabase/migrations/20260305010000_agent_runtime_state.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 30
- Bytes: 933
- SQL objects: create table: public.agent_runtime_state, alter table: public.agent_runtime_state, policy: "agent_runtime_state_read" on public.agent_runtime_state, policy: "agent_runtime_state_insert" on public.agent_runtime_state, policy: "agent_runtime_state_update" on public.agent_runtime_state, index: idx_agent_runtime_state_updated_at
- Contents summary: create table: public.agent_runtime_state; alter table: public.agent_runtime_state; policy: "agent_runtime_state_read" on public.agent_runtime_state; policy: "agent_runtime_state_insert" on public.agent_runtime_state; policy: "agent_runtime_state_update" on public.agent_runtime_state; index: idx_agent_runtime_state_upd…

## `supabase/migrations/20260306034500_runtime_leases.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 67
- Bytes: 1663
- SQL objects: function: public.acquire_runtime_lease, function: public.release_runtime_lease
- Contents summary: function: public.acquire_runtime_lease; function: public.release_runtime_lease

## `supabase/migrations/20260306043000_drop_runtime_leases.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 3
- Bytes: 148
- Contents summary: SQL migration or query file

## `supabase/migrations/20260306050000_campaign_action_item_sources.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 7
- Bytes: 278
- SQL objects: alter table: public.campaign_action_items, index: idx_campaign_action_items_source
- Contents summary: alter table: public.campaign_action_items; index: idx_campaign_action_items_source

## `supabase/migrations/20260306070000_campaign_comments.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 43
- Bytes: 1278
- SQL objects: create table: public.campaign_comments, alter table: public.campaign_comments, policy: "campaign_comments_read" on public.campaign_comments, policy: "campaign_comments_insert" on public.campaign_comments, policy: "campaign_comments_update" on public.campaign_comments, policy: "campaign_comments_delete" on public.campaign_comments, index: idx_campaign_comments_campaign_visibility_created, index: idx_campaign_comments_parent
- Contents summary: create table: public.campaign_comments; alter table: public.campaign_comments; policy: "campaign_comments_read" on public.campaign_comments; policy: "campaign_comments_insert" on public.campaign_comments; policy: "campaign_comments_update" on public.campaign_comments; policy: "campaign_comments_delete" on public.campa…

## `supabase/migrations/20260306070000_email_agent_intelligence.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 149
- Bytes: 5420
- SQL objects: create table: public.email_events, create table: public.email_drafts, create table: public.email_reply_examples, alter table: public.email_events, alter table: public.email_drafts, alter table: public.email_reply_examples, policy: "email_events_read" on public.email_events, policy: "email_events_insert" on public.email_events, policy: "email_events_update" on public.email_events, policy: "email_drafts_read" on public.email_drafts, policy: "email_drafts_insert" on public.email_drafts, policy: "email_drafts_update" on public.email_drafts, … (+8 more)
- Contents summary: create table: public.email_events; create table: public.email_drafts; create table: public.email_reply_examples; alter table: public.email_events; alter table: public.email_drafts; alter table: public.email_reply_examples; policy: "email_events_read" on public.email_events; policy: "email_events_insert" on public.emai…

## `supabase/migrations/20260306073000_lock_email_agent_tables.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 19
- Bytes: 500
- SQL objects: policy: "email_events_read" on public.email_events, policy: "email_drafts_read" on public.email_drafts, policy: "email_reply_examples_read" on public.email_reply_examples
- Contents summary: policy: "email_events_read" on public.email_events; policy: "email_drafts_read" on public.email_drafts; policy: "email_reply_examples_read" on public.email_reply_examples

## `supabase/migrations/20260306090000_crm_contacts.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 54
- Bytes: 1608
- SQL objects: create table: public.crm_contacts, alter table: public.crm_contacts, policy: "crm_contacts_read" on public.crm_contacts, policy: "crm_contacts_insert" on public.crm_contacts, policy: "crm_contacts_update" on public.crm_contacts, policy: "crm_contacts_delete" on public.crm_contacts, index: idx_crm_contacts_client_stage_created_at, index: idx_crm_contacts_client_follow_up, index: idx_crm_contacts_visibility_created_at
- Contents summary: create table: public.crm_contacts; alter table: public.crm_contacts; policy: "crm_contacts_read" on public.crm_contacts; policy: "crm_contacts_insert" on public.crm_contacts; policy: "crm_contacts_update" on public.crm_contacts; policy: "crm_contacts_delete" on public.crm_contacts; index: idx_crm_contacts_client_stage…

## `supabase/migrations/20260306093000_crm_follow_up_items.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 55
- Bytes: 1830
- SQL objects: create table: public.crm_follow_up_items, alter table: public.crm_follow_up_items, policy: "crm_follow_up_items_read" on public.crm_follow_up_items, policy: "crm_follow_up_items_insert" on public.crm_follow_up_items, policy: "crm_follow_up_items_update" on public.crm_follow_up_items, policy: "crm_follow_up_items_delete" on public.crm_follow_up_items, index: idx_crm_follow_up_items_contact_status_position, index: idx_crm_follow_up_items_client_visibility_created_at
- Contents summary: create table: public.crm_follow_up_items; alter table: public.crm_follow_up_items; policy: "crm_follow_up_items_read" on public.crm_follow_up_items; policy: "crm_follow_up_items_insert" on public.crm_follow_up_items; policy: "crm_follow_up_items_update" on public.crm_follow_up_items; policy: "crm_follow_up_items_delet…

## `supabase/migrations/20260306100000_asset_comments.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 46
- Bytes: 1395
- SQL objects: create table: public.asset_comments, alter table: public.asset_comments, policy: "asset_comments_read" on public.asset_comments, policy: "asset_comments_insert" on public.asset_comments, policy: "asset_comments_update" on public.asset_comments, policy: "asset_comments_delete" on public.asset_comments, index: idx_asset_comments_asset_visibility_created, index: idx_asset_comments_client_created, index: idx_asset_comments_parent
- Contents summary: create table: public.asset_comments; alter table: public.asset_comments; policy: "asset_comments_read" on public.asset_comments; policy: "asset_comments_insert" on public.asset_comments; policy: "asset_comments_update" on public.asset_comments; policy: "asset_comments_delete" on public.asset_comments; index: idx_asset…

## `supabase/migrations/20260306100000_crm_comments.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 43
- Bytes: 1253
- SQL objects: create table: public.crm_comments, alter table: public.crm_comments, policy: "crm_comments_read" on public.crm_comments, policy: "crm_comments_insert" on public.crm_comments, policy: "crm_comments_update" on public.crm_comments, policy: "crm_comments_delete" on public.crm_comments, index: idx_crm_comments_contact_visibility_created, index: idx_crm_comments_parent
- Contents summary: create table: public.crm_comments; alter table: public.crm_comments; policy: "crm_comments_read" on public.crm_comments; policy: "crm_comments_insert" on public.crm_comments; policy: "crm_comments_update" on public.crm_comments; policy: "crm_comments_delete" on public.crm_comments; index: idx_crm_comments_contact_visi…

## `supabase/migrations/20260306103000_asset_follow_up_items.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 54
- Bytes: 1755
- SQL objects: create table: public.asset_follow_up_items, alter table: public.asset_follow_up_items, policy: "asset_follow_up_items_read" on public.asset_follow_up_items, policy: "asset_follow_up_items_insert" on public.asset_follow_up_items, policy: "asset_follow_up_items_update" on public.asset_follow_up_items, policy: "asset_follow_up_items_delete" on public.asset_follow_up_items, index: idx_asset_follow_up_items_asset_status_position, index: idx_asset_follow_up_items_client_status, index: idx_asset_follow_up_items_source
- Contents summary: create table: public.asset_follow_up_items; alter table: public.asset_follow_up_items; policy: "asset_follow_up_items_read" on public.asset_follow_up_items; policy: "asset_follow_up_items_insert" on public.asset_follow_up_items; policy: "asset_follow_up_items_update" on public.asset_follow_up_items; policy: "asset_fol…

## `supabase/migrations/20260306110000_event_comments.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 43
- Bytes: 1307
- SQL objects: create table: public.event_comments, alter table: public.event_comments, policy: "event_comments_read" on public.event_comments, policy: "event_comments_insert" on public.event_comments, policy: "event_comments_update" on public.event_comments, policy: "event_comments_delete" on public.event_comments, index: idx_event_comments_event_created, index: idx_event_comments_client_created
- Contents summary: create table: public.event_comments; alter table: public.event_comments; policy: "event_comments_read" on public.event_comments; policy: "event_comments_insert" on public.event_comments; policy: "event_comments_update" on public.event_comments; policy: "event_comments_delete" on public.event_comments; index: idx_event…

## `supabase/migrations/20260306111000_event_follow_up_items.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 52
- Bytes: 1784
- SQL objects: create table: public.event_follow_up_items, alter table: public.event_follow_up_items, policy: "event_follow_up_items_read" on public.event_follow_up_items, policy: "event_follow_up_items_insert" on public.event_follow_up_items, policy: "event_follow_up_items_update" on public.event_follow_up_items, policy: "event_follow_up_items_delete" on public.event_follow_up_items, index: idx_event_follow_up_items_event_status_position, index: idx_event_follow_up_items_client_status, index: idx_event_follow_up_items_source
- Contents summary: create table: public.event_follow_up_items; alter table: public.event_follow_up_items; policy: "event_follow_up_items_read" on public.event_follow_up_items; policy: "event_follow_up_items_insert" on public.event_follow_up_items; policy: "event_follow_up_items_update" on public.event_follow_up_items; policy: "event_fol…

## `supabase/migrations/20260306111500_notification_entities.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 11
- Bytes: 395
- SQL objects: alter table: public.notifications, index: notifications_user_read_created_idx, index: notifications_entity_idx
- Contents summary: alter table: public.notifications; index: notifications_user_read_created_idx; index: notifications_entity_idx

## `supabase/migrations/20260306130000_whatsapp_cloud.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 223
- Bytes: 8306
- SQL objects: create table: public.whatsapp_accounts, create table: public.whatsapp_contacts, create table: public.whatsapp_conversations, create table: public.whatsapp_messages, alter table: public.whatsapp_accounts, alter table: public.whatsapp_contacts, alter table: public.whatsapp_conversations, alter table: public.whatsapp_messages, policy: "whatsapp_accounts_read" on public.whatsapp_accounts, policy: "whatsapp_accounts_insert" on public.whatsapp_accounts, policy: "whatsapp_accounts_update" on public.whatsapp_accounts, policy: "whatsapp_accounts_delete" on public.whatsapp_accounts, … (+8 more)
- Contents summary: create table: public.whatsapp_accounts; create table: public.whatsapp_contacts; create table: public.whatsapp_conversations; create table: public.whatsapp_messages; alter table: public.whatsapp_accounts; alter table: public.whatsapp_contacts; alter table: public.whatsapp_conversations; alter table: public.whatsapp_mes…

## `supabase/migrations/20260306143000_system_events_envelope.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 71
- Bytes: 2399
- SQL objects: alter table: public.system_events, index: idx_system_events_occurred_at, index: idx_system_events_correlation_id, index: idx_system_events_causation_id
- Contents summary: alter table: public.system_events; index: idx_system_events_occurred_at; index: idx_system_events_correlation_id; index: idx_system_events_causation_id

## `supabase/migrations/20260306152000_client_membership_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 126
- Bytes: 4208
- SQL objects: alter table: public.clients, alter table: public.client_members, alter table: public.client_member_campaigns, alter table: public.client_member_events, function: public.current_clerk_user_id, policy: "clients_read_member" on public.clients, policy: "client_members_read_self" on public.client_members, policy: "client_member_campaigns_read_self" on public.client_member_campaigns, policy: "client_member_events_read_self" on public.client_member_events, policy: "system_events_read_shared_member" on public.system_events, policy: "approval_requests_read_client_member" on public.approval_requests, policy: "campaign_action_items_read_shared_member" on public.campaign_action_items
- Contents summary: alter table: public.clients; alter table: public.client_members; alter table: public.client_member_campaigns; alter table: public.client_member_events; function: public.current_clerk_user_id; policy: "clients_read_member" on public.clients; policy: "client_members_read_self" on public.client_members; policy: "client_m…

## `supabase/migrations/20260306154500_current_clerk_user_id_search_path.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 9
- Bytes: 173
- SQL objects: function: public.current_clerk_user_id
- Contents summary: function: public.current_clerk_user_id

## `supabase/migrations/20260306155500_updated_at_function_search_paths.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 33
- Bytes: 543
- SQL objects: function: public.handle_updated_at, function: public.pf_update_updated_at, function: public.update_updated_at_column
- Contents summary: function: public.handle_updated_at; function: public.pf_update_updated_at; function: public.update_updated_at_column

## `supabase/migrations/20260306163500_client_surface_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 107
- Bytes: 3501
- SQL objects: alter table: public.notifications, alter table: public.workspace_pages, alter table: public.workspace_comments, alter table: public.workspace_tasks, alter table: public.ad_assets, alter table: public.client_accounts, policy: "notifications_read_self_member" on public.notifications, policy: "workspace_pages_read_client_member" on public.workspace_pages, policy: "workspace_comments_read_client_member" on public.workspace_comments, policy: "workspace_tasks_read_client_member" on public.workspace_tasks, policy: "ad_assets_read_client_member" on public.ad_assets, policy: "client_accounts_block_user_access" on public.client_accounts
- Contents summary: alter table: public.notifications; alter table: public.workspace_pages; alter table: public.workspace_comments; alter table: public.workspace_tasks; alter table: public.ad_assets; alter table: public.client_accounts; policy: "notifications_read_self_member" on public.notifications; policy: "workspace_pages_read_client…

## `supabase/migrations/20260306170500_event_workflow_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 64
- Bytes: 2334
- SQL objects: policy: "event_comments_read_shared_member" on public.event_comments, policy: "event_comments_block_user_writes" on public.event_comments, policy: "event_follow_up_items_read_shared_member" on public.event_follow_up_items, policy: "event_follow_up_items_block_user_writes" on public.event_follow_up_items
- Contents summary: policy: "event_comments_read_shared_member" on public.event_comments; policy: "event_comments_block_user_writes" on public.event_comments; policy: "event_follow_up_items_read_shared_member" on public.event_follow_up_items; policy: "event_follow_up_items_block_user_writes" on public.event_follow_up_items

## `supabase/migrations/20260306173000_client_services_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 25
- Bytes: 788
- SQL objects: policy: "client_services_read_member" on public.client_services, policy: "client_services_block_user_writes" on public.client_services
- Contents summary: policy: "client_services_read_member" on public.client_services; policy: "client_services_block_user_writes" on public.client_services

## `supabase/migrations/20260306175500_event_analytics_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 86
- Bytes: 2695
- SQL objects: alter table: public.tm_event_daily, policy: "event_snapshots_read_member" on public.event_snapshots, policy: "event_snapshots_block_user_writes" on public.event_snapshots, policy: "tm_event_demographics_read_member" on public.tm_event_demographics, policy: "tm_event_demographics_block_user_writes" on public.tm_event_demographics, policy: "tm_event_daily_read_member" on public.tm_event_daily, policy: "tm_event_daily_block_user_writes" on public.tm_event_daily
- Contents summary: alter table: public.tm_event_daily; policy: "event_snapshots_read_member" on public.event_snapshots; policy: "event_snapshots_block_user_writes" on public.event_snapshots; policy: "tm_event_demographics_read_member" on public.tm_event_demographics; policy: "tm_event_demographics_block_user_writes" on public.tm_event_d…

## `supabase/migrations/20260306181500_internal_tables_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 37
- Bytes: 1231
- SQL objects: alter table: public.admin_activity, alter table: public.admin_audit_log, alter table: public.campaign_client_overrides, alter table: public.asset_sources, policy: "admin_activity_block_user_access" on public.admin_activity, policy: "admin_audit_log_block_user_access" on public.admin_audit_log, policy: "campaign_client_overrides_block_user_access" on public.campaign_client_overrides, policy: "asset_sources_block_user_access" on public.asset_sources
- Contents summary: alter table: public.admin_activity; alter table: public.admin_audit_log; alter table: public.campaign_client_overrides; alter table: public.asset_sources; policy: "admin_activity_block_user_access" on public.admin_activity; policy: "admin_audit_log_block_user_access" on public.admin_audit_log; policy: "campaign_client…

## `supabase/migrations/20260306184000_backend_tables_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 64
- Bytes: 2018
- SQL objects: alter table: public.calls, alter table: public.compliance_logs, alter table: public.conversation_checkpoints, alter table: public.internal_dnc, alter table: public.leads, alter table: public.recordings, alter table: public.scheduled_callbacks, policy: "calls_block_user_access" on public.calls, policy: "compliance_logs_block_user_access" on public.compliance_logs, policy: "conversation_checkpoints_block_user_access" on public.conversation_checkpoints, policy: "internal_dnc_block_user_access" on public.internal_dnc, policy: "leads_block_user_access" on public.leads, … (+2 more)
- Contents summary: alter table: public.calls; alter table: public.compliance_logs; alter table: public.conversation_checkpoints; alter table: public.internal_dnc; alter table: public.leads; alter table: public.recordings; alter table: public.scheduled_callbacks; policy: "calls_block_user_access" on public.calls

## `supabase/migrations/20260306190000_contact_submissions_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 8
- Bytes: 252
- SQL objects: policy: "contact_submissions_block_user_access" on public.contact_submissions
- Contents summary: policy: "contact_submissions_block_user_access" on public.contact_submissions

## `supabase/migrations/20260306213000_client_shared_workflow_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 100
- Bytes: 3380
- SQL objects: policy: "crm_contacts_read_shared_member" on public.crm_contacts, policy: "crm_comments_read_shared_member" on public.crm_comments, policy: "crm_follow_up_items_read_shared_member" on public.crm_follow_up_items, policy: "asset_comments_read_shared_member" on public.asset_comments, policy: "asset_follow_up_items_read_shared_member" on public.asset_follow_up_items
- Contents summary: policy: "crm_contacts_read_shared_member" on public.crm_contacts; policy: "crm_comments_read_shared_member" on public.crm_comments; policy: "crm_follow_up_items_read_shared_member" on public.crm_follow_up_items; policy: "asset_comments_read_shared_member" on public.asset_comments; policy: "asset_follow_up_items_read_s…

## `supabase/migrations/20260306214500_client_campaign_event_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 36
- Bytes: 1134
- SQL objects: policy: "tm_events_read_client_member" on public.tm_events, policy: "meta_campaigns_read_client_member" on public.meta_campaigns
- Contents summary: policy: "tm_events_read_client_member" on public.tm_events; policy: "meta_campaigns_read_client_member" on public.meta_campaigns

## `supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 28
- Bytes: 997
- SQL objects: policy: "agent_tasks_read_shared_member" on public.agent_tasks, index: idx_system_events_agent_task_visibility
- Contents summary: policy: "agent_tasks_read_shared_member" on public.agent_tasks; index: idx_system_events_agent_task_visibility

## `supabase/migrations/20260306230000_campaign_comments_membership_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 73
- Bytes: 2320
- SQL objects: function: public.effective_campaign_client_slug, policy: "campaign_comments_read_shared_member" on public.campaign_comments, index: idx_campaign_client_overrides_campaign_id
- Contents summary: function: public.effective_campaign_client_slug; policy: "campaign_comments_read_shared_member" on public.campaign_comments; index: idx_campaign_client_overrides_campaign_id

## `supabase/migrations/20260306233000_campaign_effective_owner_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 35
- Bytes: 1295
- SQL objects: policy: "meta_campaigns_read_client_member" on public.meta_campaigns, policy: "campaign_action_items_read_shared_member" on public.campaign_action_items
- Contents summary: policy: "meta_campaigns_read_client_member" on public.meta_campaigns; policy: "campaign_action_items_read_shared_member" on public.campaign_action_items

## `supabase/migrations/20260307120000_growth_ledgers.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 317
- Bytes: 11638
- SQL objects: create table: public.growth_accounts, create table: public.growth_lanes, create table: public.growth_ideas, create table: public.growth_content_jobs, create table: public.growth_post_targets, create table: public.growth_playbooks, alter table: public.growth_accounts, alter table: public.growth_lanes, alter table: public.growth_ideas, alter table: public.growth_content_jobs, alter table: public.growth_post_targets, alter table: public.growth_playbooks, … (+8 more)
- Contents summary: create table: public.growth_accounts; create table: public.growth_lanes; create table: public.growth_ideas; create table: public.growth_content_jobs; create table: public.growth_post_targets; create table: public.growth_playbooks; alter table: public.growth_accounts; alter table: public.growth_lanes

## `supabase/migrations/20260307124500_growth_lead_ops.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 120
- Bytes: 4511
- SQL objects: create table: public.growth_inbound_events, create table: public.growth_leads, alter table: public.growth_inbound_events, alter table: public.growth_leads, policy: "growth_inbound_events_read" on public.growth_inbound_events, policy: "growth_inbound_events_insert" on public.growth_inbound_events, policy: "growth_inbound_events_update" on public.growth_inbound_events, policy: "growth_inbound_events_delete" on public.growth_inbound_events, policy: "growth_leads_read" on public.growth_leads, policy: "growth_leads_insert" on public.growth_leads, policy: "growth_leads_update" on public.growth_leads, policy: "growth_leads_delete" on public.growth_leads, … (+5 more)
- Contents summary: create table: public.growth_inbound_events; create table: public.growth_leads; alter table: public.growth_inbound_events; alter table: public.growth_leads; policy: "growth_inbound_events_read" on public.growth_inbound_events; policy: "growth_inbound_events_insert" on public.growth_inbound_events; policy: "growth_inbou…

## `supabase/migrations/20260307133000_growth_publish_attempts.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 59
- Bytes: 2319
- SQL objects: create table: public.growth_publish_attempts, alter table: public.growth_publish_attempts, policy: "growth_publish_attempts_read" on public.growth_publish_attempts, policy: "growth_publish_attempts_insert" on public.growth_publish_attempts, policy: "growth_publish_attempts_update" on public.growth_publish_attempts, policy: "growth_publish_attempts_delete" on public.growth_publish_attempts, index: idx_growth_publish_attempts_target_status, index: idx_growth_publish_attempts_account_status
- Contents summary: create table: public.growth_publish_attempts; alter table: public.growth_publish_attempts; policy: "growth_publish_attempts_read" on public.growth_publish_attempts; policy: "growth_publish_attempts_insert" on public.growth_publish_attempts; policy: "growth_publish_attempts_update" on public.growth_publish_attempts; po…

## `supabase/migrations/20260307143000_client_member_roster_rls.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 26
- Bytes: 867
- SQL objects: function: public.is_current_client_member, policy: "client_members_read_client_roster" on public.client_members
- Contents summary: function: public.is_current_client_member; policy: "client_members_read_client_roster" on public.client_members

## `supabase/migrations/20260311120000_client_events_enabled.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 18
- Bytes: 451
- SQL objects: alter table: public.clients
- Contents summary: alter table: public.clients

## `supabase/migrations/20260322100000_client_portal_reset.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 44
- Bytes: 1848
- SQL objects: create table: public.client_access_invites, alter table: public.clients, alter table: public.client_access_invites, index: client_access_invites_client_id_idx, index: client_access_invites_clerk_invitation_id_idx, index: client_access_invites_email_idx
- Contents summary: create table: public.client_access_invites; alter table: public.clients; alter table: public.client_access_invites; index: client_access_invites_client_id_idx; index: client_access_invites_clerk_invitation_id_idx; index: client_access_invites_email_idx

## `supabase/migrations/20260331160000_client_agent_tab.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 71
- Bytes: 2813
- SQL objects: create table: public.client_agent_threads, create table: public.client_agent_messages, alter table: public.clients, alter table: public.client_agent_threads, alter table: public.client_agent_messages, policy: "client_agent_threads_block_user_access" on public.client_agent_threads, policy: "client_agent_messages_block_user_access" on public.client_agent_messages, index: client_agent_threads_client_member_id_updated_at_idx, index: client_agent_messages_thread_id_created_at_idx
- Contents summary: create table: public.client_agent_threads; create table: public.client_agent_messages; alter table: public.clients; alter table: public.client_agent_threads; alter table: public.client_agent_messages; policy: "client_agent_threads_block_user_access" on public.client_agent_threads; policy: "client_agent_messages_block_…

## `supabase/migrations/20260401173000_client_agent_context_payload.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 3
- Bytes: 94
- SQL objects: alter table: public.client_agent_messages
- Contents summary: alter table: public.client_agent_messages

## `supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 247
- Bytes: 11290
- SQL objects: create table: public.whatsapp_ticket_concierge_runs, create table: public.whatsapp_ticket_concierge_option_sets, create table: public.whatsapp_ticket_concierge_options, create table: public.whatsapp_ticket_concierge_checkout_attempts, create table: public.whatsapp_ticket_concierge_bans, alter table: public.whatsapp_ticket_concierge_runs, alter table: public.whatsapp_ticket_concierge_option_sets, alter table: public.whatsapp_ticket_concierge_options, alter table: public.whatsapp_ticket_concierge_checkout_attempts, alter table: public.whatsapp_ticket_concierge_bans, policy: "whatsapp_ticket_concierge_runs_deny_select" on public.whatsapp_ticket_concierge_runs, policy: "whatsapp_ticket_concierge_runs_deny_insert" on public.whatsapp_ticket_concierge_runs, … (+8 more)
- Contents summary: create table: public.whatsapp_ticket_concierge_runs; create table: public.whatsapp_ticket_concierge_option_sets; create table: public.whatsapp_ticket_concierge_options; create table: public.whatsapp_ticket_concierge_checkout_attempts; create table: public.whatsapp_ticket_concierge_bans; alter table: public.whatsapp_ti…

## `supabase/migrations/20260403120000_clients_read_member_policy.sql`
- Status: tracked-clean
- System: database
- Group: supabase / migrations
- Ownership: database migration history
- Type: SQL migration/query
- Construction: SQL migration/query file, ordered migration history file
- Lines: 14
- Bytes: 329
- SQL objects: policy: "clients_read_member" on public.clients
- Contents summary: policy: "clients_read_member" on public.clients
