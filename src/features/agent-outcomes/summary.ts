import type { Json } from "@/lib/database.types";

export type AgentOutcomeStatus = "done" | "error" | "pending" | "running";
export type AgentOutcomeVisibility = "admin_only" | "shared";

export interface AgentOutcomeRequestRecord {
  clientSlug: string | null;
  createdAt: string;
  detail: string | null;
  metadata: Record<string, unknown>;
  summary: string;
  taskId: string;
  visibility: AgentOutcomeVisibility;
}

export interface AgentOutcomeTaskRecord {
  action: string;
  completedAt: string | null;
  createdAt: string | null;
  error: string | null;
  fromAgent: string;
  id: string;
  params: Json | null;
  result: Json | null;
  startedAt: string | null;
  status: string;
  toAgent: string;
}

export interface AgentOutcomeView {
  action: string;
  agentId: string;
  campaignId: string | null;
  campaignName: string | null;
  clientSlug: string | null;
  completedAt: string | null;
  createdAt: string;
  crmContactId: string | null;
  crmFollowUpItemId: string | null;
  crmContactName: string | null;
  errorText: string | null;
  linkedActionItemId: string | null;
  linkedCrmFollowUpItemId: string | null;
  requestDetail: string | null;
  requestSummary: string;
  resultText: string | null;
  startedAt: string | null;
  status: AgentOutcomeStatus;
  taskId: string;
  visibility: AgentOutcomeVisibility;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function jsonToText(value: Json | null): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (isRecord(value) && typeof value.text === "string") return value.text;
  return JSON.stringify(value, null, 2);
}

export function taskStatusToOutcomeStatus(status: string): AgentOutcomeStatus {
  if (status === "running") return "running";
  if (status === "completed") return "done";
  if (status === "failed" || status === "expired" || status === "rejected") return "error";
  return "pending";
}

function metadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function buildAgentOutcomeView(
  request: AgentOutcomeRequestRecord,
  task?: AgentOutcomeTaskRecord | null,
  linkedActionItemId?: string | null,
  linkedCrmFollowUpItemId?: string | null,
): AgentOutcomeView {
  return {
    action: task?.action ?? "agent-task",
    agentId: task?.toAgent ?? "assistant",
    campaignId: metadataString(request.metadata, "campaignId"),
    campaignName: metadataString(request.metadata, "campaignName"),
    clientSlug: request.clientSlug,
    completedAt: task?.completedAt ?? null,
    createdAt: task?.createdAt ?? request.createdAt,
    crmContactId: metadataString(request.metadata, "crmContactId"),
    crmFollowUpItemId: metadataString(request.metadata, "crmFollowUpItemId"),
    crmContactName: metadataString(request.metadata, "crmContactName"),
    errorText: task?.error ?? null,
    linkedActionItemId: linkedActionItemId ?? null,
    linkedCrmFollowUpItemId: linkedCrmFollowUpItemId ?? null,
    requestDetail: request.detail,
    requestSummary: request.summary,
    resultText: task ? jsonToText(task.result) : null,
    startedAt: task?.startedAt ?? null,
    status: task ? taskStatusToOutcomeStatus(task.status) : "pending",
    taskId: request.taskId,
    visibility: request.visibility,
  };
}
