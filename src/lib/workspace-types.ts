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

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  high: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  urgent: "bg-red-500/20 text-red-300 border-red-500/30",
};

// Mention user for combobox
export interface MentionUser {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}
