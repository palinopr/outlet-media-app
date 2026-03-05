"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "./task-card";
import type { WorkspaceTask, TaskStatus } from "@/lib/workspace-types";
import { TASK_STATUS_LABELS } from "@/lib/workspace-types";

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-cyan-400",
  review: "bg-amber-400",
  done: "bg-emerald-400",
};

interface TaskColumnProps {
  status: TaskStatus;
  tasks: WorkspaceTask[];
  onTaskClick: (task: WorkspaceTask) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function TaskColumn({ status, tasks, onTaskClick, onAddTask }: TaskColumnProps) {
  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            {TASK_STATUS_LABELS[status]}
          </span>
          <span className="text-[10px] text-white/30 font-medium ml-1">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/30 hover:text-white/60"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[200px] rounded-lg border transition-colors p-2 ${
              snapshot.isDraggingOver
                ? "border-cyan-500/30 bg-cyan-500/[0.03]"
                : "border-transparent bg-white/[0.01]"
            }`}
          >
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onClick={onTaskClick}
                  />
                ))}
                {provided.placeholder}
                {tasks.length === 0 && (
                  <p className="text-center text-xs text-white/15 py-8">No tasks yet</p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </Droppable>
    </div>
  );
}
