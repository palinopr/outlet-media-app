import Link from "next/link";
import { ArrowRight, CalendarClock, Flame, Share2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { tone } from "@/lib/tone-styles";
import type { CrmContact } from "@/features/crm/server";
import type { CrmFollowUpItem } from "@/features/crm-follow-up-items/server";
import type { CrmSummary } from "@/features/crm/summary";
import { crmStageLabel } from "@/features/crm/summary";

interface DashboardCrmSectionProps {
  contacts: CrmContact[];
  detailHrefPrefix?: string;
  description?: string;
  emptyState?: string;
  followUpEmptyState?: string;
  followUpHrefPrefix?: string;
  followUpItems?: CrmFollowUpItem[];
  href: string;
  showClientSlug?: boolean;
  summary: CrmSummary;
  title?: string;
  variant: "admin" | "client";
}

function sectionTone(variant: "admin" | "client") {
  const isClient = variant === "client";
  return {
    ...tone(variant),
    card: isClient
      ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3"
      : "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-3",
    metric: isClient ? "bg-white/[0.04] text-white/75" : "bg-[#f7f5f1] text-[#6f6a63]",
  };
}

const METRICS = [
  { key: "totalContacts", label: "Contacts", icon: Users },
  { key: "hotContacts", label: "Hot", icon: Flame },
  { key: "dueFollowUps", label: "Due", icon: CalendarClock },
  { key: "sharedContacts", label: "Shared", icon: Share2 },
] as const;

export function DashboardCrmSection({
  contacts,
  detailHrefPrefix,
  description = "The current relationship load, including hot contacts and due follow-ups.",
  emptyState = "No CRM contacts are active yet.",
  followUpEmptyState = "No CRM follow-up items are active right now.",
  followUpHrefPrefix,
  followUpItems = [],
  href,
  showClientSlug = false,
  summary,
  title = "CRM snapshot",
  variant,
}: DashboardCrmSectionProps) {
  const styles = sectionTone(variant);

  return (
    <section className={styles.body}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-sm font-medium", styles.muted)}>CRM</p>
          <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", styles.text)}>{title}</h2>
          <p className={cn("mt-1 text-sm", styles.muted)}>{description}</p>
        </div>
        <Link href={href} className={cn("inline-flex items-center gap-1 text-sm font-medium", styles.link)}>
          Open CRM
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {METRICS.map(({ key, label, icon: Icon }) => (
          <div key={key} className={cn("rounded-2xl px-3 py-3", styles.metric)}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{summary[key]}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {contacts.length === 0 ? (
          <div className={styles.empty}>{emptyState}</div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className={styles.card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn("text-sm font-medium", styles.text)}>{contact.fullName}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", styles.metric)}>
                        {crmStageLabel(contact.lifecycleStage)}
                      </span>
                      {showClientSlug ? (
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", styles.metric)}>
                          {contact.clientSlug}
                        </span>
                      ) : null}
                    </div>
                    <p className={cn("mt-1 text-sm", styles.muted)}>
                      {contact.ownerName ?? contact.company ?? contact.email ?? contact.phone ?? "No owner or company yet"}
                    </p>
                  </div>

                  <div className={cn("text-right text-xs", styles.muted)}>
                    {contact.nextFollowUpAt ? (
                      <p>Follow up {new Date(contact.nextFollowUpAt).toLocaleString("en-US")}</p>
                    ) : (
                      <p>No follow-up scheduled</p>
                    )}
                    {typeof contact.leadScore === "number" ? <p className="mt-1">Score {contact.leadScore}</p> : null}
                  </div>
                </div>

                {detailHrefPrefix ? (
                  <div className="mt-3">
                    <Link
                      href={`${detailHrefPrefix}/${contact.id}`}
                      className={cn("inline-flex items-center gap-1 text-sm font-medium", styles.link)}
                    >
                      Open contact
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className={cn("text-sm font-medium", styles.text)}>Open CRM next steps</p>
            <p className={cn("mt-1 text-sm", styles.muted)}>
              Active follow-up work tied directly to CRM relationships.
            </p>
          </div>
        </div>

        {followUpItems.length === 0 ? (
          <div className={styles.empty}>{followUpEmptyState}</div>
        ) : (
          <div className="space-y-3">
            {followUpItems.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className={cn("text-sm font-medium", styles.text)}>{item.title}</p>
                    {item.contactName && followUpHrefPrefix ? (
                      <div className="mt-1">
                        <Link
                          href={`${followUpHrefPrefix}/${item.contactId}`}
                          className={cn("text-sm font-medium", styles.link)}
                        >
                          {item.contactName}
                        </Link>
                      </div>
                    ) : item.contactName ? (
                      <p className={cn("mt-1 text-sm", styles.muted)}>{item.contactName}</p>
                    ) : null}
                    {item.description ? (
                      <p className={cn("mt-1 text-sm", styles.muted)}>{item.description}</p>
                    ) : null}
                  </div>

                  <div className={cn("text-right text-xs", styles.muted)}>
                    {item.dueDate ? <p>Due {item.dueDate}</p> : <p>No due date</p>}
                    <p className="mt-1 capitalize">{item.priority}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
