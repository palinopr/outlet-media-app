export const CRM_STAGE_ORDER = [
  "lead",
  "qualified",
  "proposal",
  "customer",
  "inactive",
] as const;

export type CrmLifecycleStage = (typeof CRM_STAGE_ORDER)[number];
export type CrmContactVisibility = "admin_only" | "shared";

export interface CrmContactSummaryRecord {
  createdAt: string;
  leadScore: number | null;
  lifecycleStage: CrmLifecycleStage;
  nextFollowUpAt: string | null;
  visibility: CrmContactVisibility;
}

export interface CrmStageBreakdown {
  count: number;
  label: string;
  stage: CrmLifecycleStage;
}

export interface CrmSummary {
  dueFollowUps: number;
  hotContacts: number;
  sharedContacts: number;
  stageBreakdown: CrmStageBreakdown[];
  totalContacts: number;
}

export function crmStageLabel(stage: CrmLifecycleStage) {
  switch (stage) {
    case "lead":
      return "Lead";
    case "qualified":
      return "Qualified";
    case "proposal":
      return "Proposal";
    case "customer":
      return "Customer";
    case "inactive":
      return "Inactive";
    default:
      return stage;
  }
}

export function buildCrmSummary(
  contacts: CrmContactSummaryRecord[],
  now = new Date(),
): CrmSummary {
  const nowMs = now.getTime();
  const stageCounts = new Map<CrmLifecycleStage, number>(
    CRM_STAGE_ORDER.map((stage) => [stage, 0]),
  );

  let dueFollowUps = 0;
  let hotContacts = 0;
  let sharedContacts = 0;

  for (const contact of contacts) {
    stageCounts.set(contact.lifecycleStage, (stageCounts.get(contact.lifecycleStage) ?? 0) + 1);

    if (contact.visibility === "shared") {
      sharedContacts += 1;
    }

    if (typeof contact.leadScore === "number" && contact.leadScore >= 80) {
      hotContacts += 1;
    }

    if (contact.nextFollowUpAt) {
      const followUpAt = new Date(contact.nextFollowUpAt).getTime();
      if (!Number.isNaN(followUpAt) && followUpAt <= nowMs) {
        dueFollowUps += 1;
      }
    }
  }

  return {
    dueFollowUps,
    hotContacts,
    sharedContacts,
    stageBreakdown: CRM_STAGE_ORDER.map((stage) => ({
      count: stageCounts.get(stage) ?? 0,
      label: crmStageLabel(stage),
      stage,
    })),
    totalContacts: contacts.length,
  };
}
