import { createLedgerTask, type LedgerTask } from "./ledger-service.js";
import { getServiceSupabase } from "./supabase-service.js";
import {
  isGrowthAccountPlatform,
  isGrowthAccountStatus,
  isGrowthAgentKey,
  isGrowthIdeaSourceType,
  isGrowthIdeaStatus,
  isGrowthJobStatus,
  isGrowthInboundSourceType,
  isGrowthInboundStatus,
  isGrowthLeadStatus,
  isGrowthOperatingMode,
  isGrowthOwnerKind,
  isGrowthPlaybookPod,
  isGrowthPublishAttemptStatus,
  isGrowthPlaybookStatus,
  isGrowthTargetStatus,
  isGrowthTaskAction,
  type GrowthAccountPlatform,
  type GrowthAccountStatus,
  type GrowthAgentKey,
  type GrowthIdeaSourceType,
  type GrowthIdeaStatus,
  type GrowthJobStatus,
  type GrowthInboundSourceType,
  type GrowthInboundStatus,
  type GrowthLeadStatus,
  type GrowthOperatingMode,
  type GrowthOwnerKind,
  type GrowthPlaybookPod,
  type GrowthPlaybookStatus,
  type GrowthPublishAttemptStatus,
  type GrowthTargetStatus,
  type GrowthTaskAction,
} from "../growth/contracts.js";

type JsonObject = Record<string, unknown>;

interface GrowthAccountRow {
  id: string;
  platform: GrowthAccountPlatform;
  label: string;
  handle: string | null;
  status: GrowthAccountStatus;
  operating_mode: GrowthOperatingMode;
}

interface GrowthLaneRow {
  id: string;
  slug: string;
  name: string;
}

interface GrowthIdeaRow {
  id: string;
  title: string;
  lane_id: string | null;
  status: GrowthIdeaStatus;
  source_type: GrowthIdeaSourceType;
}

interface GrowthJobRow {
  id: string;
  title: string;
  lane_id: string | null;
  primary_account_id: string | null;
  status: GrowthJobStatus;
  operating_mode: GrowthOperatingMode;
}

interface GrowthTargetRow {
  id: string;
  content_job_id: string;
  platform: GrowthAccountPlatform;
  status: GrowthTargetStatus;
}

interface GrowthPlaybookRow {
  id: string;
  pod: GrowthPlaybookPod;
  title: string;
  status: GrowthPlaybookStatus;
}

interface GrowthInboundRow {
  id: string;
  platform: GrowthAccountPlatform;
  source_type: GrowthInboundSourceType;
  status: GrowthInboundStatus;
}

interface GrowthLeadRow {
  id: string;
  lane_id: string | null;
  source_account_id: string | null;
  status: GrowthLeadStatus;
  score: number | null;
  summary: string | null;
}

interface GrowthPublishAttemptRow {
  id: string;
  post_target_id: string;
  platform: GrowthAccountPlatform;
  status: GrowthPublishAttemptStatus;
}

interface GrowthEventInput {
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

interface UpsertGrowthAccountInput {
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

interface UpsertGrowthLaneInput {
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

interface CreateGrowthIdeaInput {
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

interface CreateGrowthContentJobInput {
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

interface CreateGrowthPostTargetInput {
  accountRef?: string | null;
  actorName?: string | null;
  contentJobRef: string;
  metadata?: JsonObject;
  platform: GrowthAccountPlatform;
  source?: string | null;
  status?: GrowthTargetStatus;
  variantLabel?: string | null;
}

interface CreateGrowthPlaybookInput {
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

interface CreateGrowthAgentTaskInput {
  action: GrowthTaskAction;
  actorName?: string | null;
  causationId?: string | null;
  correlationId?: string | null;
  from: GrowthAgentKey;
  params?: JsonObject;
  tier?: "green" | "yellow" | "red";
  to: GrowthAgentKey;
}

interface CreateGrowthInboundEventInput {
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

interface CreateGrowthLeadInput {
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

interface UpdateGrowthLeadInput {
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

interface CreateGrowthPublishAttemptInput {
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

interface UpdateGrowthPublishAttemptInput {
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

function requireSupabase() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    throw new Error("Supabase service client is not configured for the agent runtime.");
  }

  return supabase;
}

function normalizeRef(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesRef(ref: string | null | undefined, ...values: Array<string | null | undefined>) {
  const normalizedRef = normalizeRef(ref);
  if (!normalizedRef) return false;

  return values.some((value) => normalizeRef(value) === normalizedRef);
}

function compactRecord<T extends JsonObject>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

async function safeLogGrowthEvent(input: GrowthEventInput): Promise<void> {
  try {
    await logGrowthEvent(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[growth-ledger] failed to log ${input.eventName}: ${message}`);
  }
}

async function fetchGrowthAccounts(): Promise<GrowthAccountRow[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_accounts")
    .select("id, platform, label, handle, status, operating_mode")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthAccountRow[];
}

async function fetchGrowthLanes(): Promise<GrowthLaneRow[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_lanes")
    .select("id, slug, name")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthLaneRow[];
}

export async function listGrowthAccounts(input?: {
  limit?: number;
  platform?: GrowthAccountPlatform;
  status?: GrowthAccountStatus;
}): Promise<GrowthAccountRow[]> {
  const rows = await fetchGrowthAccounts();

  return rows
    .filter((row) => {
      if (input?.platform && row.platform !== input.platform) return false;
      if (input?.status && row.status !== input.status) return false;
      return true;
    })
    .slice(0, input?.limit ?? 20);
}

export async function listGrowthLanes(input?: {
  limit?: number;
  status?: "active" | "paused" | "archived";
}): Promise<GrowthLaneRow[]> {
  const supabase = requireSupabase();

  let query = supabase
    .from("growth_lanes")
    .select("id, slug, name")
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthLaneRow[];
}

async function resolveGrowthAccountId(accountRef?: string | null): Promise<string | null> {
  if (!accountRef) return null;
  const rows = await fetchGrowthAccounts();
  const match = rows.find((row) =>
    matchesRef(accountRef, row.id, row.label, row.handle),
  );

  if (!match) {
    throw new Error(`Unknown growth account reference: ${accountRef}`);
  }

  return match.id;
}

async function resolveGrowthLaneId(laneRef?: string | null): Promise<string | null> {
  if (!laneRef) return null;
  const rows = await fetchGrowthLanes();
  const match = rows.find((row) =>
    matchesRef(laneRef, row.id, row.slug, row.name),
  );

  if (!match) {
    throw new Error(`Unknown growth lane reference: ${laneRef}`);
  }

  return match.id;
}

async function resolveGrowthIdeaId(ideaRef?: string | null): Promise<string | null> {
  if (!ideaRef) return null;

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_ideas")
    .select("id, title")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const match = ((data ?? []) as Array<{ id: string; title: string | null }>).find((row) =>
    matchesRef(ideaRef, row.id, row.title),
  );

  if (!match) {
    throw new Error(`Unknown growth idea reference: ${ideaRef}`);
  }

  return match.id;
}

async function resolveGrowthJobId(jobRef: string): Promise<string> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_content_jobs")
    .select("id, title")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const match = ((data ?? []) as Array<{ id: string; title: string | null }>).find((row) =>
    matchesRef(jobRef, row.id, row.title),
  );

  if (!match) {
    throw new Error(`Unknown growth content job reference: ${jobRef}`);
  }

  return match.id;
}

async function resolveGrowthPostTargetId(targetRef?: string | null): Promise<string | null> {
  if (!targetRef) return null;

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_post_targets")
    .select("id, variant_label")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const match = ((data ?? []) as Array<{ id: string; variant_label: string | null }>).find((row) =>
    matchesRef(targetRef, row.id, row.variant_label),
  );

  if (!match) {
    throw new Error(`Unknown growth post target reference: ${targetRef}`);
  }

  return match.id;
}

async function resolveGrowthInboundEventId(inboundRef?: string | null): Promise<string | null> {
  if (!inboundRef) return null;

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_inbound_events")
    .select("id, sender_handle, sender_display_name")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const match = ((data ?? []) as Array<{
    id: string;
    sender_display_name: string | null;
    sender_handle: string | null;
  }>).find((row) =>
    matchesRef(inboundRef, row.id, row.sender_handle, row.sender_display_name),
  );

  if (!match) {
    throw new Error(`Unknown growth inbound reference: ${inboundRef}`);
  }

  return match.id;
}

async function resolveGrowthLeadId(leadRef: string): Promise<string> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_leads")
    .select("id, contact_name, company_name")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const match = ((data ?? []) as Array<{
    company_name: string | null;
    contact_name: string | null;
    id: string;
  }>).find((row) =>
    matchesRef(leadRef, row.id, row.contact_name, row.company_name),
  );

  if (!match) {
    throw new Error(`Unknown growth lead reference: ${leadRef}`);
  }

  return match.id;
}

async function resolveGrowthPublishAttemptId(attemptRef: string): Promise<string> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_publish_attempts")
    .select("id, note, publish_url")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const match = ((data ?? []) as Array<{
    id: string;
    note: string | null;
    publish_url: string | null;
  }>).find((row) =>
    matchesRef(attemptRef, row.id, row.note, row.publish_url),
  );

  if (!match) {
    throw new Error(`Unknown growth publish attempt reference: ${attemptRef}`);
  }

  return match.id;
}

export async function logGrowthEvent(input: GrowthEventInput): Promise<void> {
  const supabase = requireSupabase();
  const metadata = input.metadata ?? {};
  const occurredAt = new Date().toISOString();
  const idempotencyKey =
    input.idempotencyKey ??
    `${input.eventName}:${input.entityType ?? "growth"}:${input.entityId ?? input.summary}`;

  const row = compactRecord({
    event_name: input.eventName,
    visibility: "admin_only",
    actor_type: input.actorType ?? "agent",
    actor_id: input.actorId ?? null,
    actor_name: input.actorName ?? "growth-ledger",
    client_slug: null,
    summary: input.summary,
    detail: input.detail ?? null,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    metadata,
    event_version: 1,
    occurred_at: occurredAt,
    source: input.source ?? "worker",
    correlation_id: input.correlationId ?? input.entityId ?? null,
    causation_id: input.causationId ?? null,
    idempotency_key: idempotencyKey,
  });

  const { error } = await supabase.from("system_events").insert(row);
  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}

export async function listGrowthIdeas(input?: {
  laneRef?: string | null;
  limit?: number;
  status?: GrowthIdeaStatus;
}): Promise<GrowthIdeaRow[]> {
  const supabase = requireSupabase();
  const laneId = await resolveGrowthLaneId(input?.laneRef);

  let query = supabase
    .from("growth_ideas")
    .select("id, title, lane_id, status, source_type")
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (laneId) query = query.eq("lane_id", laneId);
  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthIdeaRow[];
}

export async function listGrowthJobs(input?: {
  accountRef?: string | null;
  laneRef?: string | null;
  limit?: number;
  status?: GrowthJobStatus;
}): Promise<GrowthJobRow[]> {
  const supabase = requireSupabase();
  const laneId = await resolveGrowthLaneId(input?.laneRef);
  const accountId = await resolveGrowthAccountId(input?.accountRef);

  let query = supabase
    .from("growth_content_jobs")
    .select("id, title, lane_id, primary_account_id, status, operating_mode")
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (laneId) query = query.eq("lane_id", laneId);
  if (accountId) query = query.eq("primary_account_id", accountId);
  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthJobRow[];
}

export async function listGrowthTargets(input?: {
  accountRef?: string | null;
  contentJobRef?: string | null;
  limit?: number;
  status?: GrowthTargetStatus;
}): Promise<GrowthTargetRow[]> {
  const supabase = requireSupabase();
  const accountId = await resolveGrowthAccountId(input?.accountRef);
  const jobId = input?.contentJobRef ? await resolveGrowthJobId(input.contentJobRef) : null;

  let query = supabase
    .from("growth_post_targets")
    .select("id, content_job_id, platform, status")
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (accountId) query = query.eq("account_id", accountId);
  if (jobId) query = query.eq("content_job_id", jobId);
  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthTargetRow[];
}

export async function listGrowthPlaybooks(input?: {
  limit?: number;
  pod?: GrowthPlaybookPod;
  status?: GrowthPlaybookStatus;
}): Promise<GrowthPlaybookRow[]> {
  const supabase = requireSupabase();

  let query = supabase
    .from("growth_playbooks")
    .select("id, pod, title, status")
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (input?.pod) query = query.eq("pod", input.pod);
  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthPlaybookRow[];
}

export async function listGrowthInboundEvents(input?: {
  accountRef?: string | null;
  limit?: number;
  platform?: GrowthAccountPlatform;
  status?: GrowthInboundStatus;
}): Promise<GrowthInboundRow[]> {
  const supabase = requireSupabase();
  const accountId = await resolveGrowthAccountId(input?.accountRef);

  let query = supabase
    .from("growth_inbound_events")
    .select("id, platform, source_type, status")
    .order("event_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (accountId) query = query.eq("account_id", accountId);
  if (input?.platform) query = query.eq("platform", input.platform);
  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthInboundRow[];
}

export async function listGrowthLeads(input?: {
  accountRef?: string | null;
  laneRef?: string | null;
  limit?: number;
  status?: GrowthLeadStatus;
}): Promise<GrowthLeadRow[]> {
  const supabase = requireSupabase();
  const accountId = await resolveGrowthAccountId(input?.accountRef);
  const laneId = await resolveGrowthLaneId(input?.laneRef);

  let query = supabase
    .from("growth_leads")
    .select("id, lane_id, source_account_id, status, score, summary")
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (accountId) query = query.eq("source_account_id", accountId);
  if (laneId) query = query.eq("lane_id", laneId);
  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthLeadRow[];
}

export async function listGrowthPublishAttempts(input?: {
  limit?: number;
  postTargetRef?: string | null;
  status?: GrowthPublishAttemptStatus;
}): Promise<GrowthPublishAttemptRow[]> {
  const supabase = requireSupabase();
  const postTargetId = input?.postTargetRef
    ? await resolveGrowthPostTargetId(input.postTargetRef)
    : null;

  let query = supabase
    .from("growth_publish_attempts")
    .select("id, post_target_id, platform, status")
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 20);

  if (postTargetId) query = query.eq("post_target_id", postTargetId);
  if (input?.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthPublishAttemptRow[];
}

export async function upsertGrowthAccount(input: UpsertGrowthAccountInput): Promise<GrowthAccountRow> {
  if (!isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth account platform: ${input.platform}`);
  }

  if (input.status && !isGrowthAccountStatus(input.status)) {
    throw new Error(`Invalid growth account status: ${input.status}`);
  }

  if (input.operatingMode && !isGrowthOperatingMode(input.operatingMode)) {
    throw new Error(`Invalid growth operating mode: ${input.operatingMode}`);
  }

  if (input.ownerKind && !isGrowthOwnerKind(input.ownerKind)) {
    throw new Error(`Invalid growth owner kind: ${input.ownerKind}`);
  }

  const supabase = requireSupabase();
  const existing = (await fetchGrowthAccounts()).find((row) => {
    if (input.handle) {
      return row.platform === input.platform && matchesRef(input.handle, row.handle);
    }

    return row.platform === input.platform && matchesRef(input.label, row.label);
  });

  const payload = compactRecord({
    platform: input.platform,
    label: input.label,
    handle: input.handle ?? null,
    profile_url: input.profileUrl ?? null,
    owner_kind: input.ownerKind ?? "outlet",
    status: input.status ?? "active",
    operating_mode: input.operatingMode ?? "draft_only",
    primary_channel_name: input.primaryChannelName ?? null,
    metadata: input.metadata ?? {},
  });

  if (existing) {
    const { data, error } = await supabase
      .from("growth_accounts")
      .update(payload)
      .eq("id", existing.id)
      .select("id, platform, label, handle, status, operating_mode")
      .single();

    if (error) throw new Error(error.message);

    await safeLogGrowthEvent({
      actorName: input.actorName ?? "growth-ledger",
      entityId: existing.id,
      entityType: "growth_account",
      eventName: "growth_account_updated",
      metadata: { platform: input.platform, handle: input.handle ?? null },
      source: input.source ?? "worker",
      summary: `Growth account updated: ${input.label}`,
    });

    return data as GrowthAccountRow;
  }

  const { data, error } = await supabase
    .from("growth_accounts")
    .insert(payload)
    .select("id, platform, label, handle, status, operating_mode")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    entityId: data.id,
    entityType: "growth_account",
    eventName: "growth_account_created",
    metadata: { platform: input.platform, handle: input.handle ?? null },
    source: input.source ?? "worker",
    summary: `Growth account created: ${input.label}`,
  });

  return data as GrowthAccountRow;
}

export async function upsertGrowthLane(input: UpsertGrowthLaneInput): Promise<GrowthLaneRow> {
  const supabase = requireSupabase();
  const slug = input.slug.trim().toLowerCase();
  const existing = (await fetchGrowthLanes()).find((row) => matchesRef(slug, row.slug));

  const payload = compactRecord({
    slug,
    name: input.name,
    description: input.description ?? null,
    status: input.status ?? "active",
    primary_offer: input.primaryOffer ?? null,
    audience_summary: input.audienceSummary ?? null,
    metadata: input.metadata ?? {},
  });

  if (existing) {
    const { data, error } = await supabase
      .from("growth_lanes")
      .update(payload)
      .eq("id", existing.id)
      .select("id, slug, name")
      .single();

    if (error) throw new Error(error.message);

    await safeLogGrowthEvent({
      actorName: input.actorName ?? "growth-ledger",
      entityId: existing.id,
      entityType: "growth_lane",
      eventName: "growth_lane_updated",
      metadata: { slug },
      source: input.source ?? "worker",
      summary: `Growth lane updated: ${input.name}`,
    });

    return data as GrowthLaneRow;
  }

  const { data, error } = await supabase
    .from("growth_lanes")
    .insert(payload)
    .select("id, slug, name")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    entityId: data.id,
    entityType: "growth_lane",
    eventName: "growth_lane_created",
    metadata: { slug },
    source: input.source ?? "worker",
    summary: `Growth lane created: ${input.name}`,
  });

  return data as GrowthLaneRow;
}

export async function createGrowthIdea(input: CreateGrowthIdeaInput): Promise<GrowthIdeaRow> {
  const sourceType = input.sourceType ?? "manual";
  const status = input.status ?? "proposed";

  if (!isGrowthIdeaSourceType(sourceType)) {
    throw new Error(`Invalid growth idea source type: ${sourceType}`);
  }

  if (!isGrowthIdeaStatus(status)) {
    throw new Error(`Invalid growth idea status: ${status}`);
  }

  const supabase = requireSupabase();
  const laneId = await resolveGrowthLaneId(input.laneRef);
  const accountId = await resolveGrowthAccountId(input.accountRef);

  const { data, error } = await supabase
    .from("growth_ideas")
    .insert({
      lane_id: laneId,
      source_account_id: accountId,
      title: input.title,
      source_type: sourceType,
      status,
      raw_notes: input.notes ?? null,
      tags: input.tags ?? [],
      metadata: input.metadata ?? {},
    })
    .select("id, title, lane_id, status, source_type")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_idea",
    eventName: "growth_idea_created",
    metadata: {
      accountId,
      laneId,
      sourceType,
      tags: input.tags ?? [],
    },
    source: input.source ?? "worker",
    summary: `Growth idea created: ${input.title}`,
  });

  return data as GrowthIdeaRow;
}

export async function createGrowthContentJob(
  input: CreateGrowthContentJobInput,
): Promise<GrowthJobRow> {
  const status = input.status ?? "brief";
  const operatingMode = input.operatingMode ?? "draft_only";

  if (!isGrowthJobStatus(status)) {
    throw new Error(`Invalid growth content job status: ${status}`);
  }

  if (!isGrowthOperatingMode(operatingMode)) {
    throw new Error(`Invalid growth operating mode: ${operatingMode}`);
  }

  const supabase = requireSupabase();
  const laneId = await resolveGrowthLaneId(input.laneRef);
  const accountId = await resolveGrowthAccountId(input.accountRef);
  const ideaId = await resolveGrowthIdeaId(input.ideaRef);

  const { data, error } = await supabase
    .from("growth_content_jobs")
    .insert({
      idea_id: ideaId,
      lane_id: laneId,
      primary_account_id: accountId,
      title: input.title,
      status,
      operating_mode: operatingMode,
      brief: input.brief ?? null,
      script: input.script ?? null,
      call_to_action: input.callToAction ?? null,
      approved_by: input.approvedBy ?? null,
      scheduled_for: input.scheduledFor ?? null,
      metadata: input.metadata ?? {},
    })
    .select("id, title, lane_id, primary_account_id, status, operating_mode")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_content_job",
    eventName: "growth_content_job_created",
    metadata: {
      accountId,
      ideaId,
      laneId,
      operatingMode,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth content job created: ${input.title}`,
  });

  return data as GrowthJobRow;
}

export async function createGrowthPostTarget(
  input: CreateGrowthPostTargetInput,
): Promise<GrowthTargetRow> {
  if (!isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth post target platform: ${input.platform}`);
  }

  const status = input.status ?? "draft";
  if (!isGrowthTargetStatus(status)) {
    throw new Error(`Invalid growth post target status: ${status}`);
  }

  const supabase = requireSupabase();
  const contentJobId = await resolveGrowthJobId(input.contentJobRef);
  const accountId = await resolveGrowthAccountId(input.accountRef);

  const { data, error } = await supabase
    .from("growth_post_targets")
    .insert({
      content_job_id: contentJobId,
      account_id: accountId,
      platform: input.platform,
      variant_label: input.variantLabel ?? null,
      status,
      metadata: input.metadata ?? {},
    })
    .select("id, content_job_id, platform, status")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: contentJobId,
    entityId: data.id,
    entityType: "growth_post_target",
    eventName: "growth_post_target_created",
    metadata: {
      accountId,
      contentJobId,
      platform: input.platform,
      status,
      variantLabel: input.variantLabel ?? null,
    },
    source: input.source ?? "worker",
    summary: `Growth post target created: ${input.platform} for ${input.contentJobRef}`,
  });

  return data as GrowthTargetRow;
}

export async function createGrowthInboundEvent(
  input: CreateGrowthInboundEventInput,
): Promise<GrowthInboundRow> {
  if (!isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth inbound platform: ${input.platform}`);
  }

  if (!isGrowthInboundSourceType(input.sourceType)) {
    throw new Error(`Invalid growth inbound source type: ${input.sourceType}`);
  }

  const status = input.status ?? "new";
  if (!isGrowthInboundStatus(status)) {
    throw new Error(`Invalid growth inbound status: ${status}`);
  }

  const supabase = requireSupabase();
  const accountId = await resolveGrowthAccountId(input.accountRef);
  const contentJobId = input.contentJobRef
    ? await resolveGrowthJobId(input.contentJobRef)
    : null;
  const postTargetId = await resolveGrowthPostTargetId(input.postTargetRef);

  const { data, error } = await supabase
    .from("growth_inbound_events")
    .insert({
      account_id: accountId,
      content_job_id: contentJobId,
      post_target_id: postTargetId,
      platform: input.platform,
      source_type: input.sourceType,
      sender_handle: input.senderHandle ?? null,
      sender_display_name: input.senderDisplayName ?? null,
      body_text: input.bodyText,
      event_at: input.eventAt ?? new Date().toISOString(),
      status,
      metadata: input.metadata ?? {},
    })
    .select("id, platform, source_type, status")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_inbound_event",
    eventName: "growth_inbound_event_created",
    metadata: {
      accountId,
      contentJobId,
      platform: input.platform,
      postTargetId,
      sourceType: input.sourceType,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth inbound captured from ${input.platform}`,
  });

  return data as GrowthInboundRow;
}

export async function createGrowthLead(
  input: CreateGrowthLeadInput,
): Promise<GrowthLeadRow> {
  const status = input.status ?? "new";
  if (!isGrowthLeadStatus(status)) {
    throw new Error(`Invalid growth lead status: ${status}`);
  }

  if (input.platform && !isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth lead platform: ${input.platform}`);
  }

  if (
    input.score != null &&
    (!Number.isFinite(input.score) || input.score < 0 || input.score > 100)
  ) {
    throw new Error("Growth lead score must be between 0 and 100.");
  }

  const supabase = requireSupabase();
  const inboundEventId = await resolveGrowthInboundEventId(input.inboundEventRef);
  const laneId = await resolveGrowthLaneId(input.laneRef);
  const accountId = await resolveGrowthAccountId(input.accountRef);

  const { data, error } = await supabase
    .from("growth_leads")
    .insert({
      inbound_event_id: inboundEventId,
      lane_id: laneId,
      source_account_id: accountId,
      platform: input.platform ?? null,
      contact_name: input.contactName ?? null,
      company_name: input.companyName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      status,
      score: input.score ?? null,
      summary: input.summary ?? null,
      next_action: input.nextAction ?? null,
      owner_name: input.ownerName ?? null,
      metadata: input.metadata ?? {},
    })
    .select("id, lane_id, source_account_id, status, score, summary")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_lead",
    eventName: "growth_lead_created",
    metadata: {
      accountId,
      inboundEventId,
      laneId,
      platform: input.platform ?? null,
      score: input.score ?? null,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth lead created${input.contactName ? `: ${input.contactName}` : ""}`,
  });

  return data as GrowthLeadRow;
}

export async function updateGrowthLead(
  input: UpdateGrowthLeadInput,
): Promise<GrowthLeadRow> {
  const leadId = await resolveGrowthLeadId(input.leadRef);
  const supabase = requireSupabase();

  if (input.status && !isGrowthLeadStatus(input.status)) {
    throw new Error(`Invalid growth lead status: ${input.status}`);
  }

  if (
    input.score != null &&
    (!Number.isFinite(input.score) || input.score < 0 || input.score > 100)
  ) {
    throw new Error("Growth lead score must be between 0 and 100.");
  }

  const payload = compactRecord({
    status: input.status,
    score: input.score,
    summary: input.summary,
    next_action: input.nextAction,
    owner_name: input.ownerName,
    metadata: input.metadata,
  });

  const { data, error } = await supabase
    .from("growth_leads")
    .update(payload)
    .eq("id", leadId)
    .select("id, lane_id, source_account_id, status, score, summary")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_lead",
    eventName: "growth_lead_updated",
    metadata: {
      nextAction: input.nextAction ?? null,
      score: input.score ?? null,
      status: input.status ?? null,
    },
    source: input.source ?? "worker",
    summary: `Growth lead updated: ${input.leadRef}`,
  });

  return data as GrowthLeadRow;
}

export async function createGrowthPublishAttempt(
  input: CreateGrowthPublishAttemptInput,
): Promise<GrowthPublishAttemptRow> {
  const status = input.status ?? "awaiting_approval";
  if (!isGrowthPublishAttemptStatus(status)) {
    throw new Error(`Invalid growth publish attempt status: ${status}`);
  }

  const postTargetId = await resolveGrowthPostTargetId(input.postTargetRef);
  if (!postTargetId) {
    throw new Error(`Unknown growth post target reference: ${input.postTargetRef}`);
  }

  const supabase = requireSupabase();
  const { data: target, error: targetError } = await supabase
    .from("growth_post_targets")
    .select("id, account_id, platform")
    .eq("id", postTargetId)
    .single();

  if (targetError || !target) {
    throw new Error(targetError?.message ?? "Growth post target not found.");
  }

  const platform = (input.platform ?? target.platform) as GrowthAccountPlatform;
  if (!isGrowthAccountPlatform(platform)) {
    throw new Error(`Invalid growth publish platform: ${platform}`);
  }

  if (input.requestedByAgent && !isGrowthAgentKey(input.requestedByAgent)) {
    throw new Error(`Invalid requesting agent: ${input.requestedByAgent}`);
  }

  const { data, error } = await supabase
    .from("growth_publish_attempts")
    .insert({
      post_target_id: postTargetId,
      account_id: target.account_id ?? null,
      platform,
      status,
      requested_by_agent: input.requestedByAgent ?? null,
      approved_by: input.approvedBy ?? null,
      note: input.note ?? null,
      manual_instructions: input.manualInstructions ?? null,
      metadata: input.metadata ?? {},
    })
    .select("id, post_target_id, platform, status")
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("growth_post_targets")
    .update({
      status:
        status === "published"
          ? "published"
          : status === "manual_post"
            ? "manual_post"
            : "publish_requested",
      last_attempt_at: new Date().toISOString(),
    })
    .eq("id", postTargetId);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? input.requestedByAgent ?? "growth-ledger",
    correlationId: postTargetId,
    entityId: data.id,
    entityType: "growth_publish_attempt",
    eventName: "growth_publish_requested",
    metadata: {
      platform,
      postTargetId,
      requestedByAgent: input.requestedByAgent ?? null,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth publish requested for ${platform}`,
  });

  return data as GrowthPublishAttemptRow;
}

export async function updateGrowthPublishAttempt(
  input: UpdateGrowthPublishAttemptInput,
): Promise<GrowthPublishAttemptRow> {
  if (!isGrowthPublishAttemptStatus(input.status)) {
    throw new Error(`Invalid growth publish attempt status: ${input.status}`);
  }

  const attemptId = await resolveGrowthPublishAttemptId(input.attemptRef);
  const supabase = requireSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("growth_publish_attempts")
    .select("id, post_target_id, platform, status")
    .eq("id", attemptId)
    .single();

  if (existingError || !existing) {
    throw new Error(existingError?.message ?? "Growth publish attempt not found.");
  }

  const payload = compactRecord({
    status: input.status,
    approved_by: input.approvedBy,
    note: input.note,
    manual_instructions: input.manualInstructions,
    publish_url: input.publishUrl,
    platform_post_id: input.platformPostId,
    error_message: input.errorMessage,
    published_at: input.status === "published" ? new Date().toISOString() : undefined,
    metadata: input.metadata,
  });

  const { data, error } = await supabase
    .from("growth_publish_attempts")
    .update(payload)
    .eq("id", attemptId)
    .select("id, post_target_id, platform, status")
    .single();

  if (error) throw new Error(error.message);

  const targetPatch = compactRecord({
    status:
      input.status === "published"
        ? "published"
        : input.status === "manual_post"
          ? "manual_post"
          : input.status === "failed"
            ? "failed"
            : input.status === "rejected" || input.status === "cancelled"
              ? "approved"
              : "publish_requested",
    publish_url: input.publishUrl,
    platform_post_id: input.platformPostId,
    published_at: input.status === "published" ? new Date().toISOString() : undefined,
    last_attempt_at: new Date().toISOString(),
  });

  await supabase
    .from("growth_post_targets")
    .update(targetPatch)
    .eq("id", existing.post_target_id);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: existing.post_target_id,
    entityId: data.id,
    entityType: "growth_publish_attempt",
    eventName:
      input.status === "published"
        ? "growth_publish_completed"
        : input.status === "failed"
          ? "growth_publish_failed"
          : "growth_publish_updated",
    metadata: {
      platform: existing.platform,
      postTargetId: existing.post_target_id,
      publishUrl: input.publishUrl ?? null,
      status: input.status,
    },
    source: input.source ?? "worker",
    summary: `Growth publish attempt ${input.status}: ${existing.platform}`,
  });

  return data as GrowthPublishAttemptRow;
}

export async function createGrowthPlaybook(
  input: CreateGrowthPlaybookInput,
): Promise<GrowthPlaybookRow> {
  if (!isGrowthPlaybookPod(input.pod)) {
    throw new Error(`Invalid growth playbook pod: ${input.pod}`);
  }

  if (input.platform && !isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth playbook platform: ${input.platform}`);
  }

  const status = input.status ?? "active";
  if (!isGrowthPlaybookStatus(status)) {
    throw new Error(`Invalid growth playbook status: ${status}`);
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_playbooks")
    .insert({
      pod: input.pod,
      platform: input.platform ?? null,
      title: input.title,
      status,
      summary: input.summary,
      body_markdown: input.bodyMarkdown,
      metadata: input.metadata ?? {},
    })
    .select("id, pod, title, status")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_playbook",
    eventName: "growth_playbook_created",
    metadata: {
      platform: input.platform ?? null,
      pod: input.pod,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth playbook created: ${input.title}`,
  });

  return data as GrowthPlaybookRow;
}

export async function createGrowthAgentTask(
  input: CreateGrowthAgentTaskInput,
): Promise<LedgerTask> {
  if (!isGrowthAgentKey(input.from)) {
    throw new Error(`Invalid growth task source agent: ${input.from}`);
  }

  if (!isGrowthAgentKey(input.to)) {
    throw new Error(`Invalid growth task target agent: ${input.to}`);
  }

  if (!isGrowthTaskAction(input.action)) {
    throw new Error(`Invalid growth task action: ${input.action}`);
  }

  const task = await createLedgerTask({
    from: input.from,
    to: input.to,
    action: input.action,
    params: input.params ?? {},
    tier: input.tier ?? "green",
  });

  await safeLogGrowthEvent({
    actorName: input.actorName ?? input.from,
    correlationId: input.correlationId ?? task.id,
    causationId: input.causationId ?? null,
    entityId: task.id,
    entityType: "agent_task",
    eventName: "agent_action_requested",
    metadata: {
      action: input.action,
      fromAgent: input.from,
      params: input.params ?? {},
      taskId: task.id,
      tier: input.tier ?? "green",
      toAgent: input.to,
    },
    source: "worker",
    summary: `Growth task requested: ${input.action} -> ${input.to}`,
  });

  return task;
}
