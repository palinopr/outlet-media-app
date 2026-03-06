"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CrmClientOption } from "@/features/crm/server";
import type { CrmContactVisibility, CrmLifecycleStage } from "@/features/crm/summary";

interface CrmCreateContactFormProps {
  clientOptions: CrmClientOption[];
  defaultClientSlug?: string;
}

export function CrmCreateContactForm({
  clientOptions,
  defaultClientSlug,
}: CrmCreateContactFormProps) {
  const router = useRouter();
  const [clientSlug, setClientSlug] = useState(defaultClientSlug ?? clientOptions[0]?.slug ?? "");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [source, setSource] = useState("");
  const [leadScore, setLeadScore] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [notes, setNotes] = useState("");
  const [lifecycleStage, setLifecycleStage] = useState<CrmLifecycleStage>("lead");
  const [visibility, setVisibility] = useState<CrmContactVisibility>("shared");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!fullName.trim() || !clientSlug) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/crm/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSlug,
          company: company.trim() || null,
          email: email.trim() || null,
          fullName: fullName.trim(),
          leadScore: leadScore ? Number(leadScore) : null,
          lifecycleStage,
          nextFollowUpAt: nextFollowUpAt || null,
          notes: notes.trim() || null,
          ownerName: ownerName.trim() || null,
          phone: phone.trim() || null,
          source: source.trim() || null,
          visibility,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Failed to create CRM contact.");
        return;
      }

      setFullName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setOwnerName("");
      setSource("");
      setLeadScore("");
      setNextFollowUpAt("");
      setNotes("");
      setLifecycleStage("lead");
      setVisibility("shared");

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-[#787774]">CRM</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
          Add contact
        </h2>
        <p className="mt-1 text-sm text-[#9b9a97]">
          Create a CRM record on the shared backbone so follow-ups, notes, and activity stay visible.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Client</span>
          <select
            value={clientSlug}
            onChange={(event) => setClientSlug(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
          >
            {clientOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Full name</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="Jane Smith"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="jane@example.com"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="+1 555 123 4567"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Company</span>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="Acme LLC"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Owner</span>
          <input
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="Outlet Team"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Stage</span>
          <select
            value={lifecycleStage}
            onChange={(event) => setLifecycleStage(event.target.value as CrmLifecycleStage)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
          >
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Visibility</span>
          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as CrmContactVisibility)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
          >
            <option value="shared">Shared with client</option>
            <option value="admin_only">Admin only</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Source</span>
          <input
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="Referral, Meta lead form, inbound"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e]">
          <span>Lead score</span>
          <input
            type="number"
            min="0"
            max="100"
            value={leadScore}
            onChange={(event) => setLeadScore(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="80"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e] sm:col-span-2">
          <span>Next follow-up</span>
          <input
            type="datetime-local"
            value={nextFollowUpAt}
            onChange={(event) => setNextFollowUpAt(event.target.value)}
            className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
          />
        </label>

        <label className="space-y-1 text-sm text-[#57534e] sm:col-span-2">
          <span>Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-28 w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="Key context, blockers, and what should happen next."
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          className="bg-[#2f2f2f] text-white hover:bg-[#1f1f1f]"
          disabled={submitting || !fullName.trim() || !clientSlug}
          onClick={() => void handleSubmit()}
        >
          {submitting ? "Creating..." : "Create contact"}
        </Button>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
