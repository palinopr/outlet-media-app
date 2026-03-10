import { getServiceSupabase } from "./supabase-service.js";
import type {
  GrowthAccountPlatform,
  GrowthAccountStatus,
  GrowthIdeaStatus,
  GrowthInboundStatus,
  GrowthJobStatus,
  GrowthLeadStatus,
  GrowthOperatingMode,
  GrowthPlaybookPod,
  GrowthPlaybookStatus,
  GrowthPublishAttemptStatus,
  GrowthTargetStatus,
} from "../growth/contracts.js";
import type {
  GrowthAccountRow,
  GrowthEventInput,
  GrowthIdeaRow,
  GrowthInboundRow,
  GrowthJobRow,
  GrowthLaneRow,
  GrowthLeadRow,
  GrowthPlaybookRow,
  GrowthPublishAttemptRow,
  GrowthTargetRow,
  JsonObject,
} from "./growth-ledger-types.js";

export function requireSupabase() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    throw new Error("Supabase service client is not configured for the agent runtime.");
  }

  return supabase;
}

export function normalizeRef(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function matchesRef(ref: string | null | undefined, ...values: Array<string | null | undefined>) {
  const normalizedRef = normalizeRef(ref);
  if (!normalizedRef) return false;

  return values.some((value) => normalizeRef(value) === normalizedRef);
}

export function compactRecord<T extends JsonObject>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export async function safeLogGrowthEvent(input: GrowthEventInput): Promise<void> {
  try {
    await logGrowthEvent(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[growth-ledger] failed to log ${input.eventName}: ${message}`);
  }
}

export async function fetchGrowthAccounts(): Promise<GrowthAccountRow[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_accounts")
    .select("id, platform, label, handle, status, operating_mode")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthAccountRow[];
}

export async function fetchGrowthLanes(): Promise<GrowthLaneRow[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_lanes")
    .select("id, slug, name")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return (data ?? []) as GrowthLaneRow[];
}

export async function resolveGrowthAccountId(accountRef?: string | null): Promise<string | null> {
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

export async function resolveGrowthLaneId(laneRef?: string | null): Promise<string | null> {
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

export async function resolveGrowthIdeaId(ideaRef?: string | null): Promise<string | null> {
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

export async function resolveGrowthJobId(jobRef: string): Promise<string> {
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

export async function resolveGrowthPostTargetId(targetRef?: string | null): Promise<string | null> {
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

export async function resolveGrowthInboundEventId(inboundRef?: string | null): Promise<string | null> {
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

export async function resolveGrowthLeadId(leadRef: string): Promise<string> {
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

export async function resolveGrowthPublishAttemptId(attemptRef: string): Promise<string> {
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
