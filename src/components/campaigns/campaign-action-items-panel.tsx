"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckSquare, Pencil, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCampaignActionItem } from "@/app/admin/actions/campaign-action-items";
import type { CampaignActionItem } from "@/features/campaign-action-items/server";
import { fmtDate } from "@/lib/formatters";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  type TaskStatus,
} from "@/lib/workspace-types";
import { CampaignActionItemForm } from "./campaign-action-item-form";

interface CampaignActionItemsPanelProps {
  campaignId: string;
  clientSlug: string;
  items: CampaignActionItem[];
  canManage: boolean;
  description?: string;
  emptyState?: string;
  title?: string;
}

const STATUS_TONES: Record<TaskStatus, string> = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  review: "border-amber-200 bg-amber-50 text-amber-700",
  todo: "border-[#e5ded2] bg-[#f7f5f1] text-[#6f6a63]",
};

const PRIORITY_TONES: Record<CampaignActionItem["priority"], string> = {
  high: "bg-rose-50 text-rose-700",
  low: "bg-[#f1ece4] text-[#6f6a63]",
  medium: "bg-sky-50 text-sky-700",
  urgent: "bg-amber-100 text-amber-800",
};

function itemSort(a: CampaignActionItem, b: CampaignActionItem) {
  if (a.position !== b.position) return a.position - b.position;
  return a.createdAt.localeCompare(b.createdAt);
}

export function CampaignActionItemsPanel({
  campaignId,
  clientSlug,
  items,
  canManage,
  description = "Shared next steps that keep the campaign moving across internal and client workflows.",
  emptyState = "No action items have been set for this campaign yet.",
  title = "Action items",
}: CampaignActionItemsPanelProps) {
  const router = useRouter();
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CampaignActionItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const groupedItems = useMemo(() => {
    const groups = new Map<TaskStatus, CampaignActionItem[]>();
    for (const status of TASK_STATUSES) {
      groups.set(status, []);
    }

    for (const item of items) {
      const group = groups.get(item.status);
      if (group) {
        group.push(item);
      }
    }

    return TASK_STATUSES.map((status) => ({
      items: (groups.get(status) ?? []).sort(itemSort),
      status,
    })).filter((group) => group.items.length > 0);
  }, [items]);

  function openCreateDialog(defaultStatus: TaskStatus = "todo") {
    setDefaultStatus(defaultStatus);
    setEditingItem(null);
    setError(null);
    setFormOpen(true);
  }

  function openEditDialog(item: CampaignActionItem) {
    setEditingItem(item);
    setError(null);
    setFormOpen(true);
  }

  function removeItem(item: CampaignActionItem) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    startTransition(async () => {
      try {
        setError(null);
        await deleteCampaignActionItem({ itemId: item.id });
        router.refresh();
      } catch (removeError) {
        setError(
          removeError instanceof Error
            ? removeError.message
            : "Failed to delete action item.",
        );
      }
    });
  }

  return (
    <>
      <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#787774]">Workflow</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[#9b9a97]">{description}</p>
          </div>
          {canManage ? (
            <Button
              type="button"
              onClick={() => openCreateDialog()}
              className="rounded-full bg-[#0f7b6c] text-white hover:bg-[#0b5e52]"
            >
              New action
            </Button>
          ) : null}
        </div>

        {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
            {emptyState}
          </div>
        ) : (
          <div className="space-y-5">
            {groupedItems.map((group) => (
              <div key={group.status} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_TONES[group.status]}`}
                    >
                      {TASK_STATUS_LABELS[group.status]}
                    </span>
                    <span className="text-xs text-[#9b9a97]">
                      {group.items.length} item{group.items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  {canManage ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-[#0f7b6c] transition-colors hover:text-[#0b5e52]"
                      onClick={() => openCreateDialog(group.status)}
                    >
                      Add to {TASK_STATUS_LABELS[group.status]}
                    </button>
                  ) : null}
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f6a63] shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]">
                          <CheckSquare className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-[#2f2f2f]">
                              {item.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_TONES[item.priority]}`}
                            >
                              {TASK_PRIORITY_LABELS[item.priority]}
                            </span>
                            {canManage && item.visibility === "admin_only" ? (
                              <span className="rounded-full bg-[#f1ece4] px-2 py-0.5 text-xs font-medium text-[#6f6a63]">
                                Admin only
                              </span>
                            ) : null}
                          </div>

                          {item.description ? (
                            <p className="mt-1 text-sm text-[#787774]">{item.description}</p>
                          ) : null}

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#9b9a97]">
                            {item.assigneeName ? (
                              <span className="inline-flex items-center gap-1">
                                <UserRound className="h-3.5 w-3.5" />
                                {item.assigneeName}
                              </span>
                            ) : null}
                            {item.dueDate ? (
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Due {fmtDate(item.dueDate)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {canManage ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded2] bg-white text-[#6f6a63] transition-colors hover:bg-[#f7f5f1] hover:text-[#2f2f2f]"
                              onClick={() => openEditDialog(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f3d7d7] bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={isPending}
                              onClick={() => removeItem(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {canManage && formOpen ? (
        <CampaignActionItemForm
          campaignId={campaignId}
          clientSlug={clientSlug}
          defaultStatus={defaultStatus}
          item={editingItem}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) {
              setEditingItem(null);
            }
          }}
          open={formOpen}
        />
      ) : null}
    </>
  );
}
