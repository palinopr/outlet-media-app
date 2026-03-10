"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { updateTask, deleteTask } from "@/app/admin/workspace/actions/tasks";
import type { WorkspaceTask, TaskStatus, TaskPriority } from "@/lib/workspace-types";
import {
  TASK_PRIORITY_COLORS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from "@/lib/workspace-types";

interface TaskDetailModalProps {
  task: WorkspaceTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: WorkspaceTask) => void;
}

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
  onEdit,
}: TaskDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const priority = task.priority as TaskPriority;
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date();
  const description =
    typeof task.description === "string" ? task.description : null;

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateTask({ taskId: task.id, status: newStatus });
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteTask({ taskId: task.id });
      onOpenChange(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setConfirmDelete(false);
        onOpenChange(v);
      }}
    >
      <DialogContent className="dark bg-[oklch(0.14_0_0)] border-white/[0.06] text-white sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-lg">{task.title}</DialogTitle>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/40 hover:text-white/70"
                onClick={() => onEdit(task)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${
                  confirmDelete
                    ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    : "text-white/40 hover:text-white/70"
                }`}
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Status selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-16">Status</span>
            <Select
              value={task.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-40 h-8 text-xs bg-white/[0.04] border-white/[0.06]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark bg-[oklch(0.14_0_0)] border-white/[0.06]">
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {TASK_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-16">Priority</span>
            <Badge
              variant="outline"
              className={`text-[10px] ${TASK_PRIORITY_COLORS[priority] ?? TASK_PRIORITY_COLORS.medium}`}
            >
              {TASK_PRIORITY_LABELS[priority] ?? priority}
            </Badge>
          </div>

          {/* Assignee */}
          {task.assignee_name && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 w-16">Assignee</span>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-violet-300">
                    {task.assignee_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-white/70">{task.assignee_name}</span>
              </div>
            </div>
          )}

          {/* Due date */}
          {dueDate && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 w-16">Due</span>
              <span
                className={`flex items-center gap-1.5 text-sm ${
                  isOverdue ? "text-red-400" : "text-white/70"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                {dueDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-white/40 block mb-2">Description</span>
              <p className="text-sm text-white/70 whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-2 border-t border-white/[0.06] text-[10px] text-white/25">
            Created {new Date(task.created_at).toLocaleString()}
            {task.updated_at !== task.created_at && (
              <> &middot; Updated {new Date(task.updated_at).toLocaleString()}</>
            )}
          </div>

          {confirmDelete && (
            <div className="text-xs text-red-400 text-center">
              Click delete again to confirm
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
