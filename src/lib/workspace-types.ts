import type { Database } from "./database.types";

// Row types from database
export type WorkspacePage = Database["public"]["Tables"]["workspace_pages"]["Row"];
export type WorkspacePageInsert = Database["public"]["Tables"]["workspace_pages"]["Insert"];
export type WorkspaceComment = Database["public"]["Tables"]["workspace_comments"]["Row"];
export type WorkspaceCommentInsert = Database["public"]["Tables"]["workspace_comments"]["Insert"];
export type WorkspaceTask = Database["public"]["Tables"]["workspace_tasks"]["Row"];
export type WorkspaceTaskInsert = Database["public"]["Tables"]["workspace_tasks"]["Insert"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];

// Tree structure for page sidebar
export interface PageTreeNode {
  page: WorkspacePage;
  children: PageTreeNode[];
}

// Task board column IDs
export const TASK_STATUSES = ["todo", "in_progress", "review", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const NOTIFICATION_TYPES = ["mention", "comment", "assignment", "page_update"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

// Status display labels
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

// Mention user for combobox
export interface MentionUser {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}
