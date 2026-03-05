"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkspaceTask } from "@/lib/workspace-types";
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS } from "@/lib/workspace-types";

export interface TaskFilterValues {
  priority?: string;
  assignee_id?: string;
}

interface TaskFiltersProps {
  values: TaskFilterValues;
  onChange: (values: TaskFilterValues) => void;
  tasks: WorkspaceTask[];
}

export function TaskFilters({ values, onChange, tasks }: TaskFiltersProps) {
  const assignees = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tasks) {
      if (t.assignee_id && t.assignee_name) {
        map.set(t.assignee_id, t.assignee_name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [tasks]);

  const hasFilters = values.priority || values.assignee_id;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select
        value={values.priority ?? "_all"}
        onValueChange={(v) =>
          onChange({ ...values, priority: v === "_all" ? undefined : v })
        }
      >
        <SelectTrigger className="w-32 h-8 text-xs bg-white/[0.04] border-white/[0.06] text-white/70">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="dark bg-[oklch(0.14_0_0)] border-white/[0.06]">
          <SelectItem value="_all" className="text-xs">All Priorities</SelectItem>
          {TASK_PRIORITIES.map((p) => (
            <SelectItem key={p} value={p} className="text-xs">
              {TASK_PRIORITY_LABELS[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {assignees.length > 0 && (
        <Select
          value={values.assignee_id ?? "_all"}
          onValueChange={(v) =>
            onChange({ ...values, assignee_id: v === "_all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-36 h-8 text-xs bg-white/[0.04] border-white/[0.06] text-white/70">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent className="dark bg-[oklch(0.14_0_0)] border-white/[0.06]">
            <SelectItem value="_all" className="text-xs">All Assignees</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a.id} value={a.id} className="text-xs">
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-white/40 hover:text-white/70"
          onClick={() => onChange({})}
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
