import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/workspace-types";

export type WorkQueueItemKind =
  | "asset_follow_up"
  | "campaign_action"
  | "crm_follow_up"
  | "event_follow_up";

export interface WorkQueueItem {
  id: string;
  kind: WorkQueueItemKind;
  title: string;
  description: string | null;
  clientSlug: string | null;
  contextId: string;
  contextLabel: string;
  href: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string | null;
  dueDate: string | null;
  updatedAt: string;
}

export interface WorkQueueMetric {
  key: "due_soon" | "in_review" | "open_items" | "urgent_items";
  label: string;
  value: number;
  detail: string;
}

export interface WorkQueueSummary {
  metrics: WorkQueueMetric[];
  items: WorkQueueItem[];
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const STATUS_WEIGHT: Record<TaskStatus, number> = {
  review: 0,
  in_progress: 1,
  todo: 2,
  done: 3,
};

export function workQueueKindLabel(kind: WorkQueueItemKind) {
  switch (kind) {
    case "asset_follow_up":
      return "Asset";
    case "campaign_action":
      return "Campaign";
    case "crm_follow_up":
      return "CRM";
    case "event_follow_up":
      return "Event";
  }
}

function isDueSoon(dueDate: string | null, now: Date) {
  if (!dueDate) return false;
  const dueTime = new Date(`${dueDate}T23:59:59`).getTime();
  const diff = dueTime - now.getTime();
  return diff <= 3 * 24 * 60 * 60 * 1000;
}

function compareWorkQueueItems(left: WorkQueueItem, right: WorkQueueItem) {
  const priorityDiff = PRIORITY_WEIGHT[left.priority] - PRIORITY_WEIGHT[right.priority];
  if (priorityDiff !== 0) return priorityDiff;

  const statusDiff = STATUS_WEIGHT[left.status] - STATUS_WEIGHT[right.status];
  if (statusDiff !== 0) return statusDiff;

  if (left.dueDate && right.dueDate && left.dueDate !== right.dueDate) {
    return left.dueDate.localeCompare(right.dueDate);
  }

  if (left.dueDate && !right.dueDate) return -1;
  if (!left.dueDate && right.dueDate) return 1;

  return right.updatedAt.localeCompare(left.updatedAt);
}

export function buildWorkQueueSummary(
  items: WorkQueueItem[],
  options: { limit?: number; now?: Date } = {},
): WorkQueueSummary {
  const now = options.now ?? new Date();
  const sorted = [...items].sort(compareWorkQueueItems).slice(0, options.limit ?? 12);

  return {
    metrics: [
      {
        key: "open_items",
        label: "Open items",
        value: items.length,
        detail: "Cross-app next steps still in motion.",
      },
      {
        key: "urgent_items",
        label: "Urgent",
        value: items.filter((item) => item.priority === "urgent").length,
        detail: "High-pressure work that should move first.",
      },
      {
        key: "in_review",
        label: "In review",
        value: items.filter((item) => item.status === "review").length,
        detail: "Items waiting for decisions or sign-off.",
      },
      {
        key: "due_soon",
        label: "Due soon",
        value: items.filter((item) => isDueSoon(item.dueDate, now)).length,
        detail: "Due within the next three days or overdue.",
      },
    ],
    items: sorted,
  };
}

export function workQueueStatusLabel(status: TaskStatus) {
  return TASK_STATUS_LABELS[status] ?? status;
}

export function workQueuePriorityLabel(priority: TaskPriority) {
  return TASK_PRIORITY_LABELS[priority] ?? priority;
}
