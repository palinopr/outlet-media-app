export const GROWTH_OPERATING_MODES = [
  "shadow",
  "draft_only",
  "assisted",
  "live",
] as const;

export type GrowthOperatingMode = (typeof GROWTH_OPERATING_MODES)[number];

export const GROWTH_ACCOUNT_PLATFORMS = [
  "tiktok",
  "youtube",
  "instagram",
  "x",
  "linkedin",
] as const;

export type GrowthAccountPlatform = (typeof GROWTH_ACCOUNT_PLATFORMS)[number];

export const GROWTH_ACCOUNT_STATUSES = [
  "active",
  "paused",
  "restricted",
  "archived",
] as const;

export type GrowthAccountStatus = (typeof GROWTH_ACCOUNT_STATUSES)[number];

export const GROWTH_OWNER_KINDS = [
  "outlet",
  "partner",
  "creator",
] as const;

export type GrowthOwnerKind = (typeof GROWTH_OWNER_KINDS)[number];

export const GROWTH_LANE_STATUSES = [
  "active",
  "paused",
  "archived",
] as const;

export type GrowthLaneStatus = (typeof GROWTH_LANE_STATUSES)[number];

export const GROWTH_IDEA_SOURCE_TYPES = [
  "manual",
  "trend",
  "competitor",
  "comment",
  "dm",
  "analytics",
  "ai",
] as const;

export type GrowthIdeaSourceType = (typeof GROWTH_IDEA_SOURCE_TYPES)[number];

export const GROWTH_IDEA_STATUSES = [
  "proposed",
  "accepted",
  "rejected",
  "archived",
] as const;

export type GrowthIdeaStatus = (typeof GROWTH_IDEA_STATUSES)[number];

export const GROWTH_JOB_STATUSES = [
  "brief",
  "scripting",
  "producing",
  "review",
  "approved",
  "scheduled",
  "published",
  "failed",
  "archived",
] as const;

export type GrowthJobStatus = (typeof GROWTH_JOB_STATUSES)[number];

export const GROWTH_TARGET_STATUSES = [
  "draft",
  "ready_for_review",
  "approved",
  "publish_requested",
  "scheduled",
  "published",
  "failed",
  "manual_post",
] as const;

export type GrowthTargetStatus = (typeof GROWTH_TARGET_STATUSES)[number];

export const GROWTH_PUBLISH_ATTEMPT_STATUSES = [
  "awaiting_approval",
  "approved",
  "rejected",
  "manual_post",
  "published",
  "failed",
  "cancelled",
] as const;

export type GrowthPublishAttemptStatus = (typeof GROWTH_PUBLISH_ATTEMPT_STATUSES)[number];

export const GROWTH_INBOUND_SOURCE_TYPES = [
  "comment",
  "dm",
  "form",
  "email",
  "call",
  "other",
] as const;

export type GrowthInboundSourceType = (typeof GROWTH_INBOUND_SOURCE_TYPES)[number];

export const GROWTH_INBOUND_STATUSES = [
  "new",
  "triaged",
  "ignored",
  "converted",
] as const;

export type GrowthInboundStatus = (typeof GROWTH_INBOUND_STATUSES)[number];

export const GROWTH_LEAD_STATUSES = [
  "new",
  "qualified",
  "nurture",
  "won",
  "lost",
  "archived",
] as const;

export type GrowthLeadStatus = (typeof GROWTH_LEAD_STATUSES)[number];

export const GROWTH_PLAYBOOK_PODS = [
  "growth",
  "creative",
  "paid-media",
  "lead-ops",
  "analytics",
  "ops",
] as const;

export type GrowthPlaybookPod = (typeof GROWTH_PLAYBOOK_PODS)[number];

export const GROWTH_PLAYBOOK_STATUSES = [
  "active",
  "superseded",
  "archived",
] as const;

export type GrowthPlaybookStatus = (typeof GROWTH_PLAYBOOK_STATUSES)[number];

export const GROWTH_AGENT_KEYS = [
  "growth-supervisor",
  "tiktok-supervisor",
  "content-finder",
  "lead-qualifier",
  "publisher-tiktok",
  "creative",
  "reporting",
  "boss",
] as const;

export type GrowthAgentKey = (typeof GROWTH_AGENT_KEYS)[number];

export const GROWTH_TASK_ACTIONS = [
  "scan-trends",
  "capture-idea",
  "draft-brief",
  "draft-script",
  "plan-post-target",
  "review-draft",
  "publish-checklist",
  "publish-target",
  "triage-inbound",
  "capture-lead",
  "qualify-lead",
  "summarize-performance",
] as const;

export type GrowthTaskAction = (typeof GROWTH_TASK_ACTIONS)[number];

function isOneOf<T extends readonly string[]>(value: string, list: T): value is T[number] {
  return list.includes(value as T[number]);
}

export function isGrowthOperatingMode(value: string): value is GrowthOperatingMode {
  return isOneOf(value, GROWTH_OPERATING_MODES);
}

export function isGrowthAccountPlatform(value: string): value is GrowthAccountPlatform {
  return isOneOf(value, GROWTH_ACCOUNT_PLATFORMS);
}

export function isGrowthAccountStatus(value: string): value is GrowthAccountStatus {
  return isOneOf(value, GROWTH_ACCOUNT_STATUSES);
}

export function isGrowthOwnerKind(value: string): value is GrowthOwnerKind {
  return isOneOf(value, GROWTH_OWNER_KINDS);
}

export function isGrowthIdeaSourceType(value: string): value is GrowthIdeaSourceType {
  return isOneOf(value, GROWTH_IDEA_SOURCE_TYPES);
}

export function isGrowthIdeaStatus(value: string): value is GrowthIdeaStatus {
  return isOneOf(value, GROWTH_IDEA_STATUSES);
}

export function isGrowthJobStatus(value: string): value is GrowthJobStatus {
  return isOneOf(value, GROWTH_JOB_STATUSES);
}

export function isGrowthTargetStatus(value: string): value is GrowthTargetStatus {
  return isOneOf(value, GROWTH_TARGET_STATUSES);
}

export function isGrowthPublishAttemptStatus(value: string): value is GrowthPublishAttemptStatus {
  return isOneOf(value, GROWTH_PUBLISH_ATTEMPT_STATUSES);
}

export function isGrowthInboundSourceType(value: string): value is GrowthInboundSourceType {
  return isOneOf(value, GROWTH_INBOUND_SOURCE_TYPES);
}

export function isGrowthInboundStatus(value: string): value is GrowthInboundStatus {
  return isOneOf(value, GROWTH_INBOUND_STATUSES);
}

export function isGrowthLeadStatus(value: string): value is GrowthLeadStatus {
  return isOneOf(value, GROWTH_LEAD_STATUSES);
}

export function isGrowthPlaybookPod(value: string): value is GrowthPlaybookPod {
  return isOneOf(value, GROWTH_PLAYBOOK_PODS);
}

export function isGrowthPlaybookStatus(value: string): value is GrowthPlaybookStatus {
  return isOneOf(value, GROWTH_PLAYBOOK_STATUSES);
}

export function isGrowthAgentKey(value: string): value is GrowthAgentKey {
  return isOneOf(value, GROWTH_AGENT_KEYS);
}

export function isGrowthTaskAction(value: string): value is GrowthTaskAction {
  return isOneOf(value, GROWTH_TASK_ACTIONS);
}
