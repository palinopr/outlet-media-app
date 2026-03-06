"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckSquare, Pencil, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCrmFollowUpItem } from "@/app/admin/actions/crm-follow-up-items";
import type { CrmFollowUpItem } from "@/features/crm-follow-up-items/server";
import { fmtDate } from "@/lib/formatters";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  type TaskStatus,
} from "@/lib/workspace-types";
import { cn } from "@/lib/utils";
import { CrmFollowUpItemForm } from "./crm-follow-up-item-form";

interface CrmFollowUpItemsPanelProps {
  canManage: boolean;
  clientSlug: string;
  contactHrefPrefix?: string;
  contactId?: string;
  description?: string;
  emptyState?: string;
  items: CrmFollowUpItem[];
  showContactName?: boolean;
  title?: string;
  variant: "admin" | "client";
}

const STATUS_TONES: Record<TaskStatus, string> = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  review: "border-amber-200 bg-amber-50 text-amber-700",
  todo: "border-[#e5ded2] bg-[#f7f5f1] text-[#6f6a63]",
};

const PRIORITY_TONES: Record<CrmFollowUpItem["priority"], string> = {
  high: "bg-rose-50 text-rose-700",
  low: "bg-[#f1ece4] text-[#6f6a63]",
  medium: "bg-sky-50 text-sky-700",
  urgent: "bg-amber-100 text-amber-800",
};

function itemSort(a: CrmFollowUpItem, b: CrmFollowUpItem) {
  if (a.position !== b.position) return a.position - b.position;
  return a.createdAt.localeCompare(b.createdAt);
}

function tone(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      muted: "text-white/50",
      text: "text-white",
      link: "text-cyan-300 hover:text-cyan-200",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    item: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    muted: "text-[#9b9a97]",
    text: "text-[#2f2f2f]",
    link: "text-[#0f7b6c] hover:text-[#0b5e52]",
  };
}

export function CrmFollowUpItemsPanel({
  canManage,
  clientSlug,
  contactHrefPrefix,
  contactId,
  description = "Follow-up work attached directly to CRM relationships so the next step stays visible.",
  emptyState = "No CRM follow-up items are active yet.",
  items,
  showContactName = false,
  title = "CRM follow-up items",
  variant,
}: CrmFollowUpItemsPanelProps) {
  const router = useRouter();
  const styles = tone(variant);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CrmFollowUpItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const groupedItems = useMemo(() => {
    const groups = new Map<TaskStatus, CrmFollowUpItem[]>();
    for (const status of TASK_STATUSES) {
      groups.set(status, []);
    }

    for (const item of items) {
      const group = groups.get(item.status);
      if (group) group.push(item);
    }

    return TASK_STATUSES.map((status) => ({
      items: (groups.get(status) ?? []).sort(itemSort),
      status,
    })).filter((group) => group.items.length > 0);
  }, [items]);

  function openCreateDialog(nextStatus: TaskStatus = "todo") {
    setDefaultStatus(nextStatus);
    setEditingItem(null);
    setError(null);
    setFormOpen(true);
  }

  function openEditDialog(item: CrmFollowUpItem) {
    setEditingItem(item);
    setError(null);
    setFormOpen(true);
  }

  function removeItem(item: CrmFollowUpItem) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    startTransition(async () => {
      try {
        setError(null);
        await deleteCrmFollowUpItem(item.id);
        router.refresh();
      } catch (removeError) {
        setError(
          removeError instanceof Error ? removeError.message : "Failed to delete follow-up item.",
        );
      }
    });
  }

  return (
    <>
      <section className={styles.body}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className={cn("text-sm font-medium", styles.muted)}>Workflow</p>
            <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", styles.text)}>{title}</h2>
            <p className={cn("mt-1 text-sm", styles.muted)}>{description}</p>
          </div>
          {canManage && contactId ? (
            <Button
              type="button"
              onClick={() => openCreateDialog()}
              className="rounded-full bg-[#0f7b6c] text-white hover:bg-[#0b5e52]"
            >
              New follow-up
            </Button>
          ) : null}
        </div>

        {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

        {items.length === 0 ? (
          <div className={styles.empty}>{emptyState}</div>
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
                    <span className={cn("text-xs", styles.muted)}>
                      {group.items.length} item{group.items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  {canManage && contactId ? (
                    <button
                      type="button"
                      className={cn("text-xs font-medium", styles.link)}
                      onClick={() => openCreateDialog(group.status)}
                    >
                      Add to {TASK_STATUS_LABELS[group.status]}
                    </button>
                  ) : null}
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f6a63] shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]">
                          <CheckSquare className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("text-sm font-medium", styles.text)}>{item.title}</span>
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

                          {showContactName && item.contactName && contactHrefPrefix ? (
                            <div className="mt-1">
                              <Link
                                href={`${contactHrefPrefix}/${item.contactId}`}
                                className={cn("text-sm font-medium", styles.link)}
                              >
                                {item.contactName}
                              </Link>
                            </div>
                          ) : null}

                          {item.description ? (
                            <p className={cn("mt-1 text-sm", styles.muted)}>{item.description}</p>
                          ) : null}

                          <div className={cn("mt-3 flex flex-wrap items-center gap-3 text-xs", styles.muted)}>
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

      {canManage && formOpen && (contactId || editingItem) ? (
        <CrmFollowUpItemForm
          clientSlug={clientSlug}
          contactId={editingItem?.contactId ?? contactId ?? ""}
          defaultStatus={defaultStatus}
          item={editingItem}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingItem(null);
          }}
          open={formOpen}
        />
      ) : null}
    </>
  );
}
