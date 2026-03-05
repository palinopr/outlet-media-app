"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask, updateTask } from "@/app/admin/workspace/actions/tasks";
import type { WorkspaceTask, TaskStatus, TaskPriority } from "@/lib/workspace-types";
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from "@/lib/workspace-types";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientSlug: string;
  defaultStatus?: TaskStatus;
  task?: WorkspaceTask | null;
}

export function TaskForm({
  open,
  onOpenChange,
  clientSlug,
  defaultStatus = "todo",
  task,
}: TaskFormProps) {
  const isEditing = !!task;
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(
    typeof task?.description === "string" ? task.description : "",
  );
  const [status, setStatus] = useState<TaskStatus>(
    (task?.status as TaskStatus) ?? defaultStatus,
  );
  const [priority, setPriority] = useState<TaskPriority>(
    (task?.priority as TaskPriority) ?? "medium",
  );
  const [assigneeName, setAssigneeName] = useState(task?.assignee_name ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");

  // Reset form when task changes
  const resetForm = () => {
    setTitle(task?.title ?? "");
    setDescription(typeof task?.description === "string" ? task.description : "");
    setStatus((task?.status as TaskStatus) ?? defaultStatus);
    setPriority((task?.priority as TaskPriority) ?? "medium");
    setAssigneeName(task?.assignee_name ?? "");
    setDueDate(task?.due_date ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      if (isEditing && task) {
        await updateTask({
          taskId: task.id,
          title: title.trim(),
          description: description || null,
          status,
          priority,
          assignee_name: assigneeName || null,
          due_date: dueDate || null,
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description || null,
          status,
          priority,
          assignee_name: assigneeName || null,
          client_slug: clientSlug,
          due_date: dueDate || null,
        });
      }
      onOpenChange(false);
      resetForm();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="dark bg-[oklch(0.14_0_0)] border-white/[0.06] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              required
              className="bg-white/[0.04] border-white/[0.06]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="bg-white/[0.04] border-white/[0.06] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.06]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark bg-[oklch(0.14_0_0)] border-white/[0.06]">
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {TASK_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.06]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark bg-[oklch(0.14_0_0)] border-white/[0.06]">
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {TASK_PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Input
                id="task-assignee"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="Name..."
                className="bg-white/[0.04] border-white/[0.06]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white/[0.04] border-white/[0.06]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/50 hover:text-white/80"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isPending ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
