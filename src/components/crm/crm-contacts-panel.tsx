"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CalendarClock, Mail, Phone, Star, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/formatters";
import type { CrmContact } from "@/features/crm/server";
import { crmStageLabel } from "@/features/crm/summary";

interface CrmContactsPanelProps {
  canManage?: boolean;
  contacts: CrmContact[];
  description?: string;
  detailHrefPrefix?: string;
  emptyState?: string;
  showClientSlug?: boolean;
  title?: string;
  variant: "admin" | "client";
}

function stageTone(stage: CrmContact["lifecycleStage"], variant: "admin" | "client") {
  const tones =
    variant === "client"
      ? {
          customer: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
          inactive: "border-white/15 bg-white/5 text-white/60",
          lead: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
          proposal: "border-amber-500/30 bg-amber-500/10 text-amber-200",
          qualified: "border-violet-500/30 bg-violet-500/10 text-violet-200",
        }
      : {
          customer: "border-emerald-200 bg-emerald-50 text-emerald-700",
          inactive: "border-[#e5ded2] bg-[#f7f5f1] text-[#6f6a63]",
          lead: "border-sky-200 bg-sky-50 text-sky-700",
          proposal: "border-amber-200 bg-amber-50 text-amber-700",
          qualified: "border-violet-200 bg-violet-50 text-violet-700",
        };

  return tones[stage];
}

function panelTone(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      muted: "text-white/50",
      text: "text-white",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    item: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    muted: "text-[#9b9a97]",
    text: "text-[#2f2f2f]",
  };
}

export function CrmContactsPanel({
  canManage = false,
  contacts,
  description = "Contacts, owners, and next follow-ups attached to this client relationship.",
  detailHrefPrefix,
  emptyState = "No CRM contacts yet.",
  showClientSlug = false,
  title = "CRM contacts",
  variant,
}: CrmContactsPanelProps) {
  const router = useRouter();
  const tone = panelTone(variant);
  const isClient = variant === "client";
  const [pendingContactId, setPendingContactId] = useState<string | null>(null);
  const [errorByContactId, setErrorByContactId] = useState<Record<string, string>>({});

  async function updateContact(contactId: string, payload: Record<string, unknown>) {
    setPendingContactId(contactId);
    setErrorByContactId((current) => {
      const next = { ...current };
      delete next[contactId];
      return next;
    });

    try {
      const response = await fetch(`/api/admin/crm/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setErrorByContactId((current) => ({
          ...current,
          [contactId]: data.error ?? "Failed to update contact.",
        }));
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setPendingContactId(null);
    }
  }

  return (
    <section className={tone.body}>
      <div className="mb-4">
        <p className={cn("text-sm font-medium", tone.muted)}>CRM</p>
        <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", tone.text)}>{title}</h2>
        <p className={cn("mt-1 text-sm", tone.muted)}>{description}</p>
      </div>

      {contacts.length === 0 ? (
        <div className={tone.empty}>{emptyState}</div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <article key={contact.id} className={tone.item}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={cn("text-sm font-semibold", tone.text)}>{contact.fullName}</p>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                        stageTone(contact.lifecycleStage, variant),
                      )}
                    >
                      {crmStageLabel(contact.lifecycleStage)}
                    </span>
                    {showClientSlug ? (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          isClient ? "bg-white/[0.06] text-white/60" : "bg-[#f1ece4] text-[#6f6a63]",
                        )}
                      >
                        {contact.clientSlug}
                      </span>
                    ) : null}
                  </div>
                  <p className={cn("mt-1 text-xs", tone.muted)}>
                    Updated {timeAgo(contact.updatedAt)}
                  </p>
                </div>

                {typeof contact.leadScore === "number" ? (
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                      isClient ? "bg-white/[0.06] text-white/75" : "bg-white text-[#6f6a63]",
                    )}
                  >
                    <Star className="h-3.5 w-3.5" />
                    Score {contact.leadScore}
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "mt-3 grid gap-2 text-sm sm:grid-cols-2",
                  isClient ? "text-white/75" : "text-[#57534e]",
                )}
              >
                {contact.ownerName ? (
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 opacity-60" />
                    <span>{contact.ownerName}</span>
                  </div>
                ) : null}
                {contact.company ? (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 opacity-60" />
                    <span>{contact.company}</span>
                  </div>
                ) : null}
                {contact.email ? (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 opacity-60" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                ) : null}
                {contact.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 opacity-60" />
                    <span>{contact.phone}</span>
                  </div>
                ) : null}
                {contact.nextFollowUpAt ? (
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 opacity-60" />
                    <span>
                      Follow up {new Date(contact.nextFollowUpAt).toLocaleString("en-US")}
                    </span>
                  </div>
                ) : null}
                {contact.source ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] opacity-60">
                      S
                    </span>
                    <span>{contact.source}</span>
                  </div>
                ) : null}
              </div>

              {contact.notes ? (
                <p className={cn("mt-3 text-sm leading-relaxed", tone.muted)}>{contact.notes}</p>
              ) : null}

              {canManage ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={contact.lifecycleStage}
                    disabled={pendingContactId === contact.id}
                    onChange={(event) =>
                      void updateContact(contact.id, {
                        lifecycleStage: event.target.value,
                      })
                    }
                    className="rounded-lg border border-[#e5e1d8] bg-white px-2.5 py-1 text-xs text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
                  >
                    <option value="lead">Lead</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="customer">Customer</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    type="button"
                    disabled={pendingContactId === contact.id}
                    onClick={() =>
                      void updateContact(contact.id, {
                        lastContactedAt: new Date().toISOString(),
                        nextFollowUpAt: null,
                      })
                    }
                    className="rounded-lg border border-[#dcd4c7] px-2.5 py-1 text-xs font-medium text-[#6f6a63] transition-colors hover:bg-[#f1efea] hover:text-[#37352f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingContactId === contact.id ? "Saving..." : "Mark contacted"}
                  </button>
                  {errorByContactId[contact.id] ? (
                    <span className="text-xs text-rose-600">{errorByContactId[contact.id]}</span>
                  ) : null}
                </div>
              ) : null}

              {detailHrefPrefix ? (
                <div className="mt-3">
                  <Link
                    href={`${detailHrefPrefix}/${contact.id}`}
                    className={cn(
                      "text-sm font-medium",
                      isClient ? "text-cyan-300 hover:text-cyan-200" : "text-[#0f7b6c] hover:text-[#0b5e52]",
                    )}
                  >
                    Open contact
                  </Link>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
