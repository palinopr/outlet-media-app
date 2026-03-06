import { z } from "zod";

// ─── Ingest schemas ─────────────────────────────────────────────────────────

const TmEventSchema = z.object({
  tm_id: z.string().min(1),
  tm1_number: z.string(),
  name: z.string(),
  artist: z.string(),
  venue: z.string(),
  city: z.string(),
  date: z.string(),
  status: z.string(),
  tickets_sold: z.number().optional(),
  tickets_available: z.number().optional(),
  gross: z.number().optional(),
  avg_ticket_price: z.number().optional(),
  tickets_sold_today: z.number().optional(),
  revenue_today: z.number().optional(),
  surrogate_id: z.string().optional(),
  channel_mobile_pct: z.number().optional(),
  channel_internet_pct: z.number().optional(),
  channel_box_pct: z.number().optional(),
  channel_phone_pct: z.number().optional(),
  edp_total_views: z.number().optional(),
  edp_avg_daily_views: z.number().optional(),
  conversion_rate: z.number().optional(),
  url: z.string(),
  scraped_at: z.string(),
  client_slug: z.string().optional(),
});

const MetaCampaignSchema = z.object({
  campaign_id: z.string().min(1),
  name: z.string(),
  status: z.string(),
  objective: z.string().optional(),
  daily_budget: z.number().optional(),
  lifetime_budget: z.number().optional(),
  spend: z.number().optional(),
  impressions: z.number().optional(),
  clicks: z.number().optional(),
  reach: z.number().optional(),
  cpm: z.number().optional(),
  cpc: z.number().optional(),
  ctr: z.number().optional(),
  roas: z.number().optional(),
  client_slug: z.string().optional(),
  start_time: z.string().optional(),
});

const TmDemographicsSchema = z.object({
  tm_id: z.string().min(1),
  fans_total: z.number().optional(),
  fans_female_pct: z.number().optional(),
  fans_male_pct: z.number().optional(),
  fans_married_pct: z.number().optional(),
  fans_with_children_pct: z.number().optional(),
  age_18_24_pct: z.number().optional(),
  age_25_34_pct: z.number().optional(),
  age_35_44_pct: z.number().optional(),
  age_45_54_pct: z.number().optional(),
  age_over_54_pct: z.number().optional(),
  income_0_30k_pct: z.number().optional(),
  income_30_60k_pct: z.number().optional(),
  income_60_90k_pct: z.number().optional(),
  income_90_125k_pct: z.number().optional(),
  income_over_125k_pct: z.number().optional(),
  education_high_school_pct: z.number().optional(),
  education_college_pct: z.number().optional(),
  education_grad_school_pct: z.number().optional(),
  payment_visa_pct: z.number().optional(),
  payment_mc_pct: z.number().optional(),
  payment_amex_pct: z.number().optional(),
  payment_discover_pct: z.number().optional(),
  fetched_at: z.string(),
});

export const IngestPayloadSchema = z.object({
  secret: z.string().min(1),
  source: z.enum(["ticketmaster_one", "meta", "tm_demographics"]),
  data: z.object({
    events: z.array(TmEventSchema).optional(),
    campaigns: z.array(MetaCampaignSchema).optional(),
    demographics: z.array(TmDemographicsSchema).optional(),
    scraped_at: z.string(),
  }),
});

export type IngestPayload = z.infer<typeof IngestPayloadSchema>;

// ─── Alerts schemas ─────────────────────────────────────────────────────────

export const AlertPostSchema = z.object({
  secret: z.string().min(1),
  message: z.string().trim().min(1).max(5000),
  level: z.enum(["info", "warn", "error"]).optional(),
});

export const AlertPatchSchema = z.object({
  secret: z.string().min(1),
});

// ─── Agents schemas ─────────────────────────────────────────────────────────

export const VALID_AGENTS = ["tm-monitor", "meta-ads", "campaign-monitor", "assistant"] as const;

export const AgentPostSchema = z.object({
  agent: z.enum(VALID_AGENTS),
  prompt: z.string().max(10000).optional(),
});

// ─── Admin schemas ──────────────────────────────────────────────────────────

export const InviteSchema = z.object({
  email: z.string().email(),
  client_slug: z.string().optional(),
  client_role: z.enum(["owner", "member"]).optional(),
  role: z.string().optional(),
});

// ─── Client management schemas ──────────────────────────────────────────────

export const CreateClientSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/, "Slug must be lowercase alphanumeric with underscores"),
});

export const UpdateClientSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const AddClientMemberSchema = z.object({
  clientId: z.string().uuid(),
  clerkUserId: z.string().min(1),
  role: z.enum(["owner", "member"]).default("member"),
});

export const RemoveClientMemberSchema = z.object({
  clientId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export const ChangeClientMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["owner", "member"]),
});

// ─── Heartbeat schema ───────────────────────────────────────────────────────

export const HeartbeatPayloadSchema = z.object({
  secret: z.string().min(1),
});

// ─── Campaign creation schema ──────────────────────────────────────────────

export const CampaignCreateSchema = z.object({
  ad_account_id: z.string().min(1),
  client_slug: z.string().min(1),
  name: z.string().min(1).max(400),
  objective: z.enum([
    "OUTCOME_AWARENESS",
    "OUTCOME_TRAFFIC",
    "OUTCOME_ENGAGEMENT",
    "OUTCOME_SALES",
  ]),
  daily_budget: z.number().int().min(100),
  targeting: z.object({
    geo_locations: z.object({
      countries: z.array(z.string()).optional(),
      cities: z.array(z.object({ key: z.string() })).optional(),
    }),
    age_min: z.number().int().min(18).max(65).optional(),
    age_max: z.number().int().min(18).max(65).optional(),
    genders: z.array(z.number().int().min(0).max(2)).optional(),
    flexible_spec: z
      .array(z.object({ interests: z.array(z.object({ id: z.string(), name: z.string() })) }))
      .optional(),
  }),
  placements: z
    .object({
      publisher_platforms: z.array(z.string()).optional(),
      facebook_positions: z.array(z.string()).optional(),
      instagram_positions: z.array(z.string()).optional(),
    })
    .optional(),
  creative: z.object({
    primary_text: z.string().min(1),
    headline: z.string().optional(),
    description: z.string().optional(),
    call_to_action: z.string().optional(),
    image_hash: z.string().optional(),
    video_id: z.string().optional(),
    link_url: z.string().url().optional(),
  }),
});

export type CampaignCreatePayload = z.infer<typeof CampaignCreateSchema>;

// ─── Contact form ────────────────────────────────────────────────────────────

export const ContactFormSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
});

// ─── Workspace schemas ──────────────────────────────────────────────────────

import { TASK_STATUSES, TASK_PRIORITIES } from "./workspace-types";

export const CreatePageSchema = z.object({
  title: z.string().max(500).default("Untitled"),
  client_slug: z.string().min(1),
  parent_page_id: z.string().uuid().optional(),
  icon: z.string().max(10).optional(),
});

export const UpdatePageSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.unknown().optional(),
  icon: z.string().max(10).optional().nullable(),
  cover_image: z.string().max(2000).optional().nullable(),
  parent_page_id: z.string().uuid().optional().nullable(),
  is_archived: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

export const CreateCommentSchema = z.object({
  page_id: z.string().uuid(),
  content: z.string().min(1).max(10000),
  parent_comment_id: z.string().uuid().optional(),
});

export const CreateCampaignCommentSchema = z.object({
  campaign_id: z.string().min(1),
  client_slug: z.string().min(1),
  content: z.string().min(1).max(10000),
  parent_comment_id: z.string().uuid().optional(),
  visibility: z.enum(["shared", "admin_only"]).default("shared"),
});

export const CreateCrmCommentSchema = z.object({
  client_slug: z.string().min(1),
  contact_id: z.string().uuid(),
  content: z.string().min(1).max(10000),
  parent_comment_id: z.string().uuid().optional(),
  visibility: z.enum(["shared", "admin_only"]).default("shared"),
});

export const ResolveCommentSchema = z.object({
  resolved: z.boolean(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.unknown().optional(),
  status: z.enum(TASK_STATUSES).default("todo"),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  assignee_id: z.string().optional().nullable(),
  assignee_name: z.string().optional().nullable(),
  page_id: z.string().uuid().optional().nullable(),
  client_slug: z.string().min(1),
  due_date: z.string().optional().nullable(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.unknown().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  assignee_id: z.string().optional().nullable(),
  assignee_name: z.string().optional().nullable(),
  page_id: z.string().uuid().optional().nullable(),
  due_date: z.string().optional().nullable(),
  position: z.number().int().min(0).optional(),
});

export const CreateApprovalRequestSchema = z.object({
  audience: z.enum(["admin", "client", "shared"]).default("shared"),
  client_slug: z.string().min(1),
  entity_id: z.string().optional().nullable(),
  entity_type: z.string().min(1).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  page_id: z.string().uuid().optional().nullable(),
  request_type: z.string().min(1).max(100),
  summary: z.string().max(2000).optional().nullable(),
  task_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1).max(500),
});

export const ResolveApprovalRequestSchema = z.object({
  note: z.string().max(2000).optional().nullable(),
  status: z.enum(["approved", "rejected", "cancelled"]),
});
