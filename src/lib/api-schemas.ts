import { z } from "zod";

// ─── Ingest schemas ─────────────────────────────────────────────────────────

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

export const IngestPayloadSchema = z.object({
  secret: z.string().min(1),
  source: z.enum(["meta"]),
  data: z.object({
    campaigns: z.array(MetaCampaignSchema).optional(),
    scraped_at: z.string(),
  }),
});

export type IngestPayload = z.infer<typeof IngestPayloadSchema>;

// ─── Admin schemas ──────────────────────────────────────────────────────────

export const InviteSchema = z.object({
  email: z.string().email(),
  clientId: z.string().min(1).optional(),
  client_role: z.enum(["owner", "member"]).optional(),
  role: z.enum(["admin"]).optional(),
}).superRefine((value, ctx) => {
  if (value.role === "admin") return;
  if (!value.clientId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "clientId is required for client invites",
      path: ["clientId"],
    });
  }
});

// ─── Client management schemas ──────────────────────────────────────────────

export const CreateClientSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/, "Slug must be lowercase alphanumeric with underscores"),
});

export const UpdateClientSchema = z.object({
  clientId: z.string().min(1),
  brandName: z.string().min(1).max(200).nullable().optional(),
  logoAlt: z.string().min(1).max(200).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
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

// ─── Contact form ────────────────────────────────────────────────────────────

export const ContactFormSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional(),
  company: z.string().max(200).optional(),
  website: z.string().max(240).optional(),
  stage: z.string().max(120).optional(),
  desiredOutcome: z.string().max(120).optional(),
  hasAdAccount: z.string().max(120).optional(),
  businessLink: z.string().max(240).optional(),
  deadline: z.string().max(120).optional(),
  recommendedOffer: z.string().max(160).optional(),
  utmSource: z.string().max(160).optional(),
  utmMedium: z.string().max(160).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  fbclid: z.string().max(500).optional(),
  gclid: z.string().max(500).optional(),
  goal: z.string().max(1000).optional(),
  monthlyBudget: z.string().max(120).optional(),
  preferredContact: z.string().max(120).optional(),
  pageContext: z.string().max(120).optional(),
  message: z.string().min(1).max(5000),
});
