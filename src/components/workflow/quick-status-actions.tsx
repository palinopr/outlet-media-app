"use client";

import { Button } from "@/components/ui/button";
import { TASK_STATUS_LABELS, type TaskStatus } from "@/lib/workspace-types";

interface QuickStatusActionsProps {
  currentStatus: TaskStatus;
  disabled?: boolean;
  onChangeStatus: (status: TaskStatus) => void;
}

interface QuickStatusTransition {
  label: string;
  status: TaskStatus;
}

const QUICK_STATUS_TRANSITIONS: Record<TaskStatus, QuickStatusTransition[]> = {
  todo: [
    { label: "Start", status: "in_progress" },
    { label: "Send to review", status: "review" },
  ],
  in_progress: [
    { label: "Send to review", status: "review" },
    { label: "Done", status: "done" },
  ],
  review: [
    { label: "Back to work", status: "in_progress" },
    { label: "Done", status: "done" },
  ],
  done: [{ label: "Reopen", status: "todo" }],
};

export function getQuickStatusTransitions(status: TaskStatus): QuickStatusTransition[] {
  return QUICK_STATUS_TRANSITIONS[status] ?? [];
}

export function QuickStatusActions({
  currentStatus,
  disabled = false,
  onChangeStatus,
}: QuickStatusActionsProps) {
  const transitions = getQuickStatusTransitions(currentStatus);
  if (transitions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {transitions.map((transition) => (
        <Button
          key={`${currentStatus}-${transition.status}`}
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-7 rounded-full border border-[#e5ded2] bg-white px-3 text-xs text-[#6f6a63] hover:bg-[#f7f5f1] hover:text-[#2f2f2f]"
          onClick={() => onChangeStatus(transition.status)}
        >
          {transition.label}
        </Button>
      ))}
      <span className="text-xs text-[#9b9a97]">
        Current: {TASK_STATUS_LABELS[currentStatus]}
      </span>
    </div>
  );
}
