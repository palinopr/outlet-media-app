"use client";

import { useState, useCallback, useOptimistic, useTransition } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskColumn } from "./task-column";
import { TaskForm } from "./task-form";
import { TaskDetailModal } from "./task-detail-modal";
import { TaskFilters, type TaskFilterValues } from "./task-filters";
import { reorderTask } from "@/app/admin/workspace/actions/tasks";
import type { WorkspaceTask, TaskStatus } from "@/lib/workspace-types";
import { TASK_STATUSES } from "@/lib/workspace-types";

interface TaskBoardProps {
  tasks: WorkspaceTask[];
  clientSlug: string;
}

export function TaskBoard({ tasks: initialTasks, clientSlug }: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = useState<WorkspaceTask | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formDefaultStatus, setFormDefaultStatus] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<WorkspaceTask | null>(null);
  const [filters, setFilters] = useState<TaskFilterValues>({});
  const [, startTransition] = useTransition();

  const [optimisticTasks, addOptimistic] = useOptimistic(
    initialTasks,
    (state: WorkspaceTask[], update: { taskId: string; status: string; position: number }) => {
      return state.map((t) =>
        t.id === update.taskId
          ? { ...t, status: update.status, position: update.position }
          : t,
      );
    },
  );

  // Apply filters
  const filteredTasks = optimisticTasks.filter((t) => {
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.assignee_id && t.assignee_id !== filters.assignee_id) return false;
    return true;
  });

  const tasksByStatus = TASK_STATUSES.reduce(
    (acc, status) => {
      acc[status] = filteredTasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.position - b.position);
      return acc;
    },
    {} as Record<TaskStatus, WorkspaceTask[]>,
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { draggableId, destination } = result;
      const newStatus = destination.droppableId as TaskStatus;
      const newPosition = destination.index;

      startTransition(async () => {
        addOptimistic({ taskId: draggableId, status: newStatus, position: newPosition });
        await reorderTask({
          taskId: draggableId,
          status: newStatus,
          position: newPosition,
        });
      });
    },
    [addOptimistic, startTransition],
  );

  const handleAddTask = useCallback((status: TaskStatus) => {
    setFormDefaultStatus(status);
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const handleEditTask = useCallback((task: WorkspaceTask) => {
    setEditingTask(task);
    setFormOpen(true);
    setSelectedTask(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TaskFilters values={filters} onChange={setFilters} tasks={initialTasks} />
        <Button
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
          onClick={() => handleAddTask("todo")}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {TASK_STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onTaskClick={setSelectedTask}
              onAddTask={handleAddTask}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        clientSlug={clientSlug}
        defaultStatus={formDefaultStatus}
        task={editingTask}
      />

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onEdit={handleEditTask}
        />
      )}
    </div>
  );
}
