"use client";

import { startTransition, useState } from "react";
import {
  Building2,
  CalendarClock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { tone } from "@/lib/tone-styles";
import type { CrmContact } from "@/features/crm/server";
import type { CrmContactVisibility, CrmLifecycleStage } from "@/features/crm/summary";
import { crmStageLabel } from "@/features/crm/summary";
import { stageTone } from "@/features/crm/tone";

interface CrmContactDetailCardProps {
  canManage?: boolean;
  contact: CrmContact;
  description?: string;
  title?: string;
  variant: "admin" | "client";
}

function detailTone(variant: "admin" | "client") {
  return {
    ...tone(variant),
    card:
      variant === "client"
        ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
        : "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    input:
      variant === "client"
        ? "w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        : "w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]",
  };
}

function toInputDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function CrmContactDetailCard({
  canManage = false,
  contact,
  description = "The current CRM context, ownership, and follow-up state for this relationship.",
  title = "Contact details",
  variant,
}: CrmContactDetailCardProps) {
  const router = useRouter();
  const styles = detailTone(variant);
  const isClient = variant === "client";
  const [fullName, setFullName] = useState(contact.fullName);
  const [company, setCompany] = useState(contact.company ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [ownerName, setOwnerName] = useState(contact.ownerName ?? "");
  const [source, setSource] = useState(contact.source ?? "");
  const [leadScore, setLeadScore] = useState(
    typeof contact.leadScore === "number" ? String(contact.leadScore) : "",
  );
  const [nextFollowUpAt, setNextFollowUpAt] = useState(toInputDateTime(contact.nextFollowUpAt));
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [lifecycleStage, setLifecycleStage] = useState<CrmLifecycleStage>(contact.lifecycleStage);
  const [visibility, setVisibility] = useState<CrmContactVisibility>(contact.visibility);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateContact(payload: Record<string, unknown>) {
    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/crm/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Failed to update contact.");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setPending(false);
    }
  }

  async function saveChanges() {
    await updateContact({
      company: company.trim() || null,
      email: email.trim() || null,
      fullName: fullName.trim(),
      leadScore: leadScore ? Number(leadScore) : null,
      lifecycleStage,
      nextFollowUpAt: toIsoDateTime(nextFollowUpAt),
      notes: notes.trim() || null,
      ownerName: ownerName.trim() || null,
      phone: phone.trim() || null,
      source: source.trim() || null,
      visibility,
    });
  }

  return (
    <section className={styles.body}>
      <div className="mb-4">
        <p className={cn("text-sm font-medium", styles.muted)}>CRM</p>
        <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", styles.text)}>{title}</h2>
        <p className={cn("mt-1 text-sm", styles.muted)}>{description}</p>
      </div>

      <div className={styles.card}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={cn("text-sm font-semibold", styles.text)}>{contact.fullName}</p>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  stageTone(contact.lifecycleStage, variant),
                )}
              >
                {crmStageLabel(contact.lifecycleStage)}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  isClient
                    ? "border-white/[0.1] bg-white/[0.05] text-white/70"
                    : "border-[#e5ded2] bg-[#f7f5f1] text-[#6f6a63]",
                )}
              >
                {contact.visibility === "shared" ? "Shared" : "Admin only"}
              </span>
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
                  <span>Follow up {new Date(contact.nextFollowUpAt).toLocaleString("en-US")}</span>
                </div>
              ) : null}
              {typeof contact.leadScore === "number" ? (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 opacity-60" />
                  <span>Score {contact.leadScore}</span>
                </div>
              ) : null}
            </div>
          </div>

          {contact.tags.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-2">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    isClient ? "bg-white/[0.06] text-white/70" : "bg-[#f1ece4] text-[#6f6a63]",
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {canManage ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={styles.input}
                placeholder="Jane Smith"
              />
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Owner</span>
              <input
                value={ownerName}
                onChange={(event) => setOwnerName(event.target.value)}
                className={styles.input}
                placeholder="Outlet Team"
              />
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.input}
                placeholder="jane@example.com"
              />
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Phone</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={styles.input}
                placeholder="+1 555 123 4567"
              />
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Company</span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className={styles.input}
                placeholder="Acme LLC"
              />
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Source</span>
              <input
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className={styles.input}
                placeholder="Referral, inbound, Meta lead form"
              />
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Stage</span>
              <select
                value={lifecycleStage}
                onChange={(event) => setLifecycleStage(event.target.value as CrmLifecycleStage)}
                className={styles.input}
              >
                <option value="lead">Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="customer">Customer</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Visibility</span>
              <select
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as CrmContactVisibility)}
                className={styles.input}
              >
                <option value="shared">Shared with client</option>
                <option value="admin_only">Admin only</option>
              </select>
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Lead score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={leadScore}
                onChange={(event) => setLeadScore(event.target.value)}
                className={styles.input}
                placeholder="80"
              />
            </label>

            <label className={cn("space-y-1 text-sm", styles.muted)}>
              <span>Next follow-up</span>
              <input
                type="datetime-local"
                value={nextFollowUpAt}
                onChange={(event) => setNextFollowUpAt(event.target.value)}
                className={styles.input}
              />
            </label>

            <label className={cn("space-y-1 text-sm sm:col-span-2", styles.muted)}>
              <span>Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className={cn("min-h-32", styles.input)}
                placeholder="Key context, blockers, and what should happen next."
              />
            </label>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={pending || !fullName.trim()}
                onClick={() => void saveChanges()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2f2f2f] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {pending ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  void updateContact({
                    lastContactedAt: new Date().toISOString(),
                    nextFollowUpAt: null,
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-[#dcd4c7] px-3 py-2 text-sm font-medium text-[#6f6a63] transition-colors hover:bg-[#f1efea] hover:text-[#37352f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Shield className="h-4 w-4" />
                Mark contacted
              </button>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            </div>
          </div>
        ) : contact.notes ? (
          <p className={cn("mt-4 text-sm leading-relaxed", styles.muted)}>{contact.notes}</p>
        ) : null}
      </div>
    </section>
  );
}
