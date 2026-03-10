import {
  isGrowthAccountPlatform,
  isGrowthAccountStatus,
  isGrowthAgentKey,
  isGrowthIdeaSourceType,
  isGrowthIdeaStatus,
  isGrowthJobStatus,
  isGrowthOperatingMode,
  isGrowthOwnerKind,
  isGrowthPublishAttemptStatus,
  isGrowthTargetStatus,
  type GrowthAccountPlatform,
} from "../growth/contracts.js";
import type {
  CreateGrowthContentJobInput,
  CreateGrowthIdeaInput,
  CreateGrowthPostTargetInput,
  CreateGrowthPublishAttemptInput,
  GrowthAccountRow,
  GrowthIdeaRow,
  GrowthJobRow,
  GrowthPublishAttemptRow,
  GrowthTargetRow,
  UpdateGrowthPublishAttemptInput,
  UpsertGrowthAccountInput,
  UpsertGrowthLaneInput,
  GrowthLaneRow,
} from "./growth-ledger-types.js";
import {
  compactRecord,
  fetchGrowthAccounts,
  fetchGrowthLanes,
  matchesRef,
  requireSupabase,
  resolveGrowthAccountId,
  resolveGrowthIdeaId,
  resolveGrowthJobId,
  resolveGrowthLaneId,
  resolveGrowthPostTargetId,
  resolveGrowthPublishAttemptId,
  safeLogGrowthEvent,
} from "./growth-ledger-resolve.js";

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
