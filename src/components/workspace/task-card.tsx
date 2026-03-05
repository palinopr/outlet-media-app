"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Calendar, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WorkspaceTask, TaskPriority } from "@/lib/workspace-types";
import { TASK_PRIORITY_LABELS } from "@/lib/workspace-types";

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  high: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  urgent: "bg-red-500/20 text-red-300 border-red-500/30",
};

interface TaskCardProps {
  task: WorkspaceTask;
  index: number;
  onClick: (task: WorkspaceTask) => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const priority = task.priority as TaskPriority;
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group rounded-lg border bg-[oklch(0.16_0_0)] p-3 cursor-pointer transition-colors hover:border-white/10 ${
            snapshot.isDragging
              ? "border-cyan-500/40 shadow-lg shadow-cyan-500/10"
              : "border-white/[0.06]"
          }`}
          onClick={() => onClick(task)}
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${priorityColors[priority] ?? priorityColors.medium}`}
                >
                  {TASK_PRIORITY_LABELS[priority] ?? priority}
                </Badge>
                {dueDate && (
                  <span
                    className={`flex items-center gap-1 text-[10px] ${
                      isOverdue ? "text-red-400" : "text-white/40"
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {dueDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              {task.assignee_name && (
                <div className="mt-2 flex items-center gap-1.5">
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
                  <span className="text-[11px] text-white/40 truncate">
                    {task.assignee_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
