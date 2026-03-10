import type {
  GrowthAccountPlatform,
  GrowthAccountStatus,
  GrowthIdeaSourceType,
  GrowthIdeaStatus,
  GrowthInboundSourceType,
  GrowthInboundStatus,
  GrowthJobStatus,
  GrowthLeadStatus,
  GrowthOperatingMode,
  GrowthPlaybookPod,
  GrowthPlaybookStatus,
  GrowthPublishAttemptStatus,
  GrowthTargetStatus,
  GrowthAgentKey,
  GrowthOwnerKind,
  GrowthTaskAction,
} from "../growth/contracts.js";

export type JsonObject = Record<string, unknown>;

export interface GrowthAccountRow {
  id: string;
  platform: GrowthAccountPlatform;
  label: string;
  handle: string | null;
  status: GrowthAccountStatus;
  operating_mode: GrowthOperatingMode;
}

export interface GrowthLaneRow {
  id: string;
  slug: string;
  name: string;
}

export interface GrowthIdeaRow {
  id: string;
  title: string;
  lane_id: string | null;
  status: GrowthIdeaStatus;
  source_type: GrowthIdeaSourceType;
}

export interface GrowthJobRow {
  id: string;
  title: string;
  lane_id: string | null;
  primary_account_id: string | null;
  status: GrowthJobStatus;
  operating_mode: GrowthOperatingMode;
}

export interface GrowthTargetRow {
  id: string;
  content_job_id: string;
  platform: GrowthAccountPlatform;
  status: GrowthTargetStatus;
}

export interface GrowthPlaybookRow {
  id: string;
  pod: GrowthPlaybookPod;
  title: string;
  status: GrowthPlaybookStatus;
}

export interface GrowthInboundRow {
  id: string;
  platform: GrowthAccountPlatform;
  source_type: GrowthInboundSourceType;
  status: GrowthInboundStatus;
}

export interface GrowthLeadRow {
  id: string;
  lane_id: string | null;
  source_account_id: string | null;
  status: GrowthLeadStatus;
  score: number | null;
  summary: string | null;
}

export interface GrowthPublishAttemptRow {
  id: string;
  post_target_id: string;
  platform: GrowthAccountPlatform;
  status: GrowthPublishAttemptStatus;
}

export interface GrowthEventInput {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: "agent" | "system" | "user";
  detail?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  eventName: string;
  idempotencyKey?: string | null;
  metadata?: JsonObject;
  source?: string | null;
  summary: string;
  correlationId?: string | null;
  causationId?: string | null;
}

export interface UpsertGrowthAccountInput {
  handle?: string | null;
  label: string;
  metadata?: JsonObject;
  operatingMode?: GrowthOperatingMode;
  ownerKind?: GrowthOwnerKind;
  platform: GrowthAccountPlatform;
  primaryChannelName?: string | null;
  profileUrl?: string | null;
  source?: string | null;
  status?: GrowthAccountStatus;
  actorName?: string | null;
}

export interface UpsertGrowthLaneInput {
  actorName?: string | null;
  audienceSummary?: string | null;
  description?: string | null;
  metadata?: JsonObject;
  name: string;
  primaryOffer?: string | null;
  slug: string;
  source?: string | null;
  status?: "active" | "paused" | "archived";
}

export interface CreateGrowthIdeaInput {
  accountRef?: string | null;
  actorName?: string | null;
  laneRef?: string | null;
  metadata?: JsonObject;
  notes?: string | null;
  source?: string | null;
  sourceType?: GrowthIdeaSourceType;
  status?: GrowthIdeaStatus;
  tags?: string[];
  title: string;
}

export interface CreateGrowthContentJobInput {
  accountRef?: string | null;
  actorName?: string | null;
  approvedBy?: string | null;
  brief?: string | null;
  callToAction?: string | null;
  ideaRef?: string | null;
  laneRef?: string | null;
  metadata?: JsonObject;
  operatingMode?: GrowthOperatingMode;
  scheduledFor?: string | null;
  script?: string | null;
  source?: string | null;
  status?: GrowthJobStatus;
  title: string;
}

export interface CreateGrowthPostTargetInput {
  accountRef?: string | null;
  actorName?: string | null;
  contentJobRef: string;
  metadata?: JsonObject;
  platform: GrowthAccountPlatform;
  source?: string | null;
  status?: GrowthTargetStatus;
  variantLabel?: string | null;
}

export interface CreateGrowthPlaybookInput {
  actorName?: string | null;
  bodyMarkdown: string;
  metadata?: JsonObject;
  platform?: GrowthAccountPlatform | null;
  pod: GrowthPlaybookPod;
  source?: string | null;
  status?: GrowthPlaybookStatus;
  summary: string;
  title: string;
}

export interface CreateGrowthAgentTaskInput {
  action: GrowthTaskAction;
  actorName?: string | null;
  causationId?: string | null;
  correlationId?: string | null;
  from: GrowthAgentKey;
  params?: JsonObject;
  tier?: "green" | "yellow" | "red";
  to: GrowthAgentKey;
}

export interface CreateGrowthInboundEventInput {
  accountRef?: string | null;
  actorName?: string | null;
  bodyText: string;
  contentJobRef?: string | null;
  eventAt?: string | null;
  metadata?: JsonObject;
  platform: GrowthAccountPlatform;
  postTargetRef?: string | null;
  senderDisplayName?: string | null;
  senderHandle?: string | null;
  source?: string | null;
  sourceType: GrowthInboundSourceType;
  status?: GrowthInboundStatus;
}

export interface CreateGrowthLeadInput {
  actorName?: string | null;
  accountRef?: string | null;
  companyName?: string | null;
  contactName?: string | null;
  email?: string | null;
  inboundEventRef?: string | null;
  laneRef?: string | null;
  metadata?: JsonObject;
  nextAction?: string | null;
  ownerName?: string | null;
  phone?: string | null;
  platform?: GrowthAccountPlatform | null;
  score?: number | null;
  source?: string | null;
  status?: GrowthLeadStatus;
  summary?: string | null;
}

export interface UpdateGrowthLeadInput {
  actorName?: string | null;
  leadRef: string;
  metadata?: JsonObject;
  nextAction?: string | null;
  ownerName?: string | null;
  score?: number | null;
  source?: string | null;
  status?: GrowthLeadStatus;
  summary?: string | null;
}

export interface CreateGrowthPublishAttemptInput {
  actorName?: string | null;
  approvedBy?: string | null;
  manualInstructions?: string | null;
  metadata?: JsonObject;
  note?: string | null;
  platform?: GrowthAccountPlatform | null;
  postTargetRef: string;
  requestedByAgent?: GrowthAgentKey | null;
  source?: string | null;
  status?: GrowthPublishAttemptStatus;
}

export interface UpdateGrowthPublishAttemptInput {
  actorName?: string | null;
  approvedBy?: string | null;
  attemptRef: string;
  errorMessage?: string | null;
  manualInstructions?: string | null;
  metadata?: JsonObject;
  note?: string | null;
  platformPostId?: string | null;
  publishUrl?: string | null;
  source?: string | null;
  status: GrowthPublishAttemptStatus;
}
