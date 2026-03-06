"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createEventFollowUpItem,
  updateEventFollowUpItem,
} from "@/app/admin/actions/event-follow-up-items";
import type {
  EventFollowUpItem,
  EventFollowUpItemVisibility,
} from "@/features/event-follow-up-items/server";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/workspace-types";

const VISIBILITY_OPTIONS: EventFollowUpItemVisibility[] = ["shared", "admin_only"];

interface EventFollowUpItemFormProps {
  defaultStatus?: TaskStatus;
  eventId: string;
  item?: EventFollowUpItem | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function toNullableString(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function EventFollowUpItemForm({
  defaultStatus = "todo",
  eventId,
  item,
  onOpenChange,
  open,
}: EventFollowUpItemFormProps) {
  const router = useRouter();
  const isEditing = !!item;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>((item?.status ?? defaultStatus) as TaskStatus);
  const [priority, setPriority] = useState<TaskPriority>(
    (item?.priority ?? "medium") as TaskPriority,
  );
  const [visibility, setVisibility] = useState<EventFollowUpItemVisibility>(
    (item?.visibility ?? "shared") as EventFollowUpItemVisibility,
  );
  const [assigneeName, setAssigneeName] = useState(item?.assigneeName ?? "");
  const [dueDate, setDueDate] = useState(item?.dueDate ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        setError(null);

        if (isEditing && item) {
          const assigneeId =
            item.assigneeName === assigneeName.trim() ? item.assigneeId ?? null : null;

          await updateEventFollowUpItem({
            itemId: item.id,
            assigneeId,
            assigneeName: toNullableString(assigneeName),
            description: toNullableString(description),
            dueDate: dueDate || null,
            priority,
            status,
            title: title.trim(),
            visibility,
          });
        } else {
          await createEventFollowUpItem({
            assigneeId: null,
            assigneeName: toNullableString(assigneeName),
            description: toNullableString(description),
            dueDate: dueDate || null,
            eventId,
            priority,
            status,
            title: title.trim(),
            visibility,
          });
        }

        router.refresh();
        onOpenChange(false);
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : "Failed to save follow-up item.",
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#ece8df] bg-[#fcfbf8] text-[#2f2f2f] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit event follow-up" : "New event follow-up"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="event-follow-up-title">Title</Label>
            <Input
              id="event-follow-up-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What should happen next for this event?"
              required
              className="border-[#e5ded2] bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-follow-up-description">Description</Label>
            <Textarea
              id="event-follow-up-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional ticketing, promotion, or approval notes."
              rows={4}
              className="resize-none border-[#e5ded2] bg-white"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger className="border-[#e5ded2] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#ece8df] bg-white text-[#2f2f2f]">
                  {TASK_STATUSES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {TASK_STATUS_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger className="border-[#e5ded2] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#ece8df] bg-white text-[#2f2f2f]">
                  {TASK_PRIORITIES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {TASK_PRIORITY_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={visibility}
                onValueChange={(value) => setVisibility(value as EventFollowUpItemVisibility)}
              >
                <SelectTrigger className="border-[#e5ded2] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#ece8df] bg-white text-[#2f2f2f]">
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "shared" ? "Shared" : "Admin only"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-follow-up-assignee">Assignee</Label>
              <Input
                id="event-follow-up-assignee"
                value={assigneeName}
                onChange={(event) => setAssigneeName(event.target.value)}
                placeholder="Name or owner"
                className="border-[#e5ded2] bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-follow-up-due-date">Due date</Label>
              <Input
                id="event-follow-up-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="border-[#e5ded2] bg-white"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-[#787774] hover:bg-[#f1ece4] hover:text-[#2f2f2f]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="bg-[#0f7b6c] text-white hover:bg-[#0b5e52]"
            >
              {isPending ? "Saving..." : isEditing ? "Save changes" : "Create follow-up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
