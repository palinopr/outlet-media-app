/**
 * Shared labels for action-item / follow-up-item fields and task statuses.
 *
 * Used by campaign-action-items, asset-follow-up-items, event-follow-up-items,
 * and crm-follow-up-items server actions to produce human-readable audit and
 * system-event text.
 */

import { TASK_STATUS_LABELS } from "@/lib/workspace-types";

/** Maps camelCase field keys to human-readable labels for audit logs. */
export const FIELD_LABELS: Readonly<Record<string, string>> = {
  assigneeId: "assignee",
  assigneeName: "assignee name",
  description: "description",
  dueDate: "due date",
  priority: "priority",
  status: "status",
  title: "title",
  visibility: "visibility",
};

/** Returns the display label for a task status, falling back to the raw value. */
export function taskStatusLabel(status: string): string {
  return TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS] ?? status;
}
