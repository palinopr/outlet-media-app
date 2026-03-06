import { supabaseAdmin } from "@/lib/supabase";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import {
  getCurrentActor,
  listSystemEvents,
  logSystemEvent,
  summarizeChangedFields,
  type SystemEvent,
} from "@/features/system-events/server";
import {
  buildCrmSummary,
  crmNeedsFollowUpTriage,
  type CrmContactSummaryRecord,
  type CrmContactVisibility,
  type CrmLifecycleStage,
  type CrmSummary,
} from "@/features/crm/summary";

const CRM_CONTACTS_TABLE = "crm_contacts" as never;
const CRM_CONTACT_SELECT =
  "id, client_slug, full_name, email, phone, company, lifecycle_stage, visibility, source, owner_name, lead_score, notes, tags, last_contacted_at, next_follow_up_at, created_at, updated_at";

export interface CrmContact {
  clientSlug: string;
  company: string | null;
  createdAt: string;
  email: string | null;
  fullName: string;
  id: string;
  lastContactedAt: string | null;
  leadScore: number | null;
  lifecycleStage: CrmLifecycleStage;
  nextFollowUpAt: string | null;
  notes: string | null;
  ownerName: string | null;
  phone: string | null;
  source: string | null;
  tags: string[];
  updatedAt: string;
  visibility: CrmContactVisibility;
}

export interface CrmClientOption {
  name: string;
  slug: string;
}

export interface CrmOverview {
  clients: CrmClientOption[];
  contacts: CrmContact[];
  recentContacts: CrmContact[];
  recentEvents: SystemEvent[];
  summary: CrmSummary;
  upcomingFollowUps: CrmContact[];
}

interface ListCrmContactsOptions {
  audience?: "all" | CrmContactVisibility;
  clientSlug?: string | null;
  limit?: number;
}

interface GetCrmContactOptions {
  audience?: "all" | CrmContactVisibility;
  clientSlug?: string | null;
}

interface GetCrmOverviewOptions {
  audience?: "all" | CrmContactVisibility;
  clientSlug?: string | null;
}

interface CreateCrmContactInput {
  clientSlug: string;
  company?: string | null;
  email?: string | null;
  fullName: string;
  lastContactedAt?: string | null;
  leadScore?: number | null;
  lifecycleStage?: CrmLifecycleStage;
  nextFollowUpAt?: string | null;
  notes?: string | null;
  ownerName?: string | null;
  phone?: string | null;
  source?: string | null;
  tags?: string[];
  visibility?: CrmContactVisibility;
}

interface UpdateCrmContactInput {
  company?: string | null;
  contactId: string;
  email?: string | null;
  fullName?: string;
  lastContactedAt?: string | null;
  leadScore?: number | null;
  lifecycleStage?: CrmLifecycleStage;
  nextFollowUpAt?: string | null;
  notes?: string | null;
  ownerName?: string | null;
  phone?: string | null;
  source?: string | null;
  visibility?: CrmContactVisibility;
}

function mapCrmContact(row: Record<string, unknown>): CrmContact {
  return {
    clientSlug: row.client_slug as string,
    company: (row.company as string | null) ?? null,
    createdAt: row.created_at as string,
    email: (row.email as string | null) ?? null,
    fullName: row.full_name as string,
    id: row.id as string,
    lastContactedAt: (row.last_contacted_at as string | null) ?? null,
    leadScore: (row.lead_score as number | null) ?? null,
    lifecycleStage: row.lifecycle_stage as CrmLifecycleStage,
    nextFollowUpAt: (row.next_follow_up_at as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    ownerName: (row.owner_name as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    source: (row.source as string | null) ?? null,
    tags: ((row.tags as string[] | null) ?? []) as string[],
    updatedAt: row.updated_at as string,
    visibility: row.visibility as CrmContactVisibility,
  };
}

function toSummaryRecord(contact: CrmContact): CrmContactSummaryRecord {
  return {
    createdAt: contact.createdAt,
    lastContactedAt: contact.lastContactedAt,
    leadScore: contact.leadScore,
    lifecycleStage: contact.lifecycleStage,
    nextFollowUpAt: contact.nextFollowUpAt,
    visibility: contact.visibility,
  };
}

function compareFollowUps(a: CrmContact, b: CrmContact) {
  if (!a.nextFollowUpAt && !b.nextFollowUpAt) {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }
  if (!a.nextFollowUpAt) return 1;
  if (!b.nextFollowUpAt) return -1;
  return new Date(a.nextFollowUpAt).getTime() - new Date(b.nextFollowUpAt).getTime();
}

function formatDateTime(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US");
}

function buildCrmFollowUpPrompt(contact: CrmContact, reason: string) {
  const details = [
    `Client slug: ${contact.clientSlug}`,
    `Contact: ${contact.fullName}`,
    contact.company ? `Company: ${contact.company}` : null,
    contact.ownerName ? `Owner: ${contact.ownerName}` : null,
    `Stage: ${contact.lifecycleStage}`,
    typeof contact.leadScore === "number" ? `Lead score: ${contact.leadScore}` : null,
    contact.source ? `Source: ${contact.source}` : null,
    contact.email ? `Email: ${contact.email}` : null,
    contact.phone ? `Phone: ${contact.phone}` : null,
    contact.lastContactedAt ? `Last contacted: ${formatDateTime(contact.lastContactedAt)}` : null,
    contact.nextFollowUpAt ? `Next follow-up: ${formatDateTime(contact.nextFollowUpAt)}` : null,
    contact.notes ? `Notes: ${contact.notes}` : null,
  ].filter(Boolean);

  return [
    `Review the CRM follow-up state for ${contact.fullName}.`,
    "Prepare an internal follow-up brief only. Do not contact the client or mutate CRM state.",
    `Reason: ${reason}`,
    "",
    details.join("\n"),
    "",
    "Return a concise internal recommendation covering:",
    "1. urgency",
    "2. why this contact needs attention now",
    "3. the next best manual follow-up step",
    "4. any missing context or blockers",
  ].join("\n");
}

async function queueCrmFollowUpTriage(contact: CrmContact, reason: string) {
  const taskId = await enqueueExternalAgentTask({
    action: "crm-follow-up-triage",
    prompt: buildCrmFollowUpPrompt(contact, reason),
    toAgent: "assistant",
  });

  if (!taskId) return null;

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "system",
    actorName: "Outlet CRM",
    clientSlug: contact.clientSlug,
    visibility: contact.visibility,
    entityType: "agent_task",
    entityId: taskId,
    summary: `Queued CRM follow-up triage for "${contact.fullName}"`,
    detail: reason,
    metadata: {
      clientSlug: contact.clientSlug,
      crmContactId: contact.id,
      crmContactName: contact.fullName,
      lifecycleStage: contact.lifecycleStage,
      leadScore: contact.leadScore,
    },
  });

  return taskId;
}

export async function listCrmContacts(
  options: ListCrmContactsOptions = {},
): Promise<CrmContact[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from(CRM_CONTACTS_TABLE)
    .select(CRM_CONTACT_SELECT)
    .order("updated_at", { ascending: false });

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[crm] list contacts failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapCrmContact(row as Record<string, unknown>));
}

export async function getCrmContactById(
  contactId: string,
  options: GetCrmContactOptions = {},
): Promise<CrmContact | null> {
  if (!supabaseAdmin) return null;

  let query = supabaseAdmin
    .from(CRM_CONTACTS_TABLE)
    .select(CRM_CONTACT_SELECT)
    .eq("id", contactId);

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  const { data, error } = await query.limit(1).maybeSingle();
  if (error) {
    console.error("[crm] get contact failed:", error.message);
    return null;
  }

  return data ? mapCrmContact(data as Record<string, unknown>) : null;
}

export async function listCrmClientOptions(): Promise<CrmClientOption[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("clients")
    .select("slug, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("[crm] list clients failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    name: (row.name as string | null) ?? (row.slug as string),
    slug: row.slug as string,
  }));
}

export async function getCrmOverview(
  options: GetCrmOverviewOptions = {},
): Promise<CrmOverview> {
  const [contacts, clients, recentEvents] = await Promise.all([
    listCrmContacts({
      audience: options.audience,
      clientSlug: options.clientSlug,
    }),
    options.clientSlug ? Promise.resolve([]) : listCrmClientOptions(),
    listSystemEvents({
      audience: options.audience === "all" ? "all" : options.audience ?? "shared",
      clientSlug: options.clientSlug,
      entityType: "crm_contact",
      limit: 6,
    }),
  ]);

  const summary = buildCrmSummary(contacts.map((contact) => toSummaryRecord(contact)));
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);
  const upcomingFollowUps = contacts
    .filter((contact) => !!contact.nextFollowUpAt)
    .sort(compareFollowUps)
    .slice(0, 8);

  return {
    clients,
    contacts,
    recentContacts,
    recentEvents,
    summary,
    upcomingFollowUps,
  };
}

export async function createCrmContact(input: CreateCrmContactInput): Promise<CrmContact | null> {
  if (!supabaseAdmin) return null;

  const actor = await getCurrentActor();
  const { data, error } = await supabaseAdmin
    .from(CRM_CONTACTS_TABLE)
    .insert({
      client_slug: input.clientSlug,
      company: input.company ?? null,
      email: input.email ?? null,
      full_name: input.fullName,
      last_contacted_at: input.lastContactedAt ?? null,
      lead_score: input.leadScore ?? null,
      lifecycle_stage: input.lifecycleStage ?? "lead",
      next_follow_up_at: input.nextFollowUpAt ?? null,
      notes: input.notes ?? null,
      owner_name: input.ownerName ?? null,
      phone: input.phone ?? null,
      source: input.source ?? null,
      tags: input.tags ?? [],
      visibility: input.visibility ?? "shared",
    })
    .select(CRM_CONTACT_SELECT)
    .single();

  if (error) {
    console.error("[crm] create contact failed:", error.message);
    return null;
  }

  const contact = mapCrmContact(data as Record<string, unknown>);

  await logSystemEvent({
    eventName: "crm_contact_created",
    actorId: actor.actorId,
    actorName: actor.actorName,
    actorType: actor.actorType,
    clientSlug: contact.clientSlug,
    visibility: contact.visibility,
    entityType: "crm_contact",
    entityId: contact.id,
    summary: `Added CRM contact "${contact.fullName}"`,
    detail: contact.nextFollowUpAt
      ? `Next follow-up scheduled for ${new Date(contact.nextFollowUpAt).toLocaleString("en-US")}.`
      : contact.lifecycleStage === "customer"
        ? "Contact entered the CRM as an active customer."
        : "Contact added to the CRM pipeline.",
    metadata: {
      clientSlug: contact.clientSlug,
      lifecycleStage: contact.lifecycleStage,
      leadScore: contact.leadScore,
      visibility: contact.visibility,
    },
  });

  if (crmNeedsFollowUpTriage(toSummaryRecord(contact))) {
    await queueCrmFollowUpTriage(
      contact,
      contact.nextFollowUpAt
        ? `A CRM follow-up is due soon for ${contact.fullName}.`
        : `${contact.fullName} is a high-priority CRM contact and needs follow-up guidance.`,
    );
  }

  return contact;
}

export async function updateCrmContact(input: UpdateCrmContactInput): Promise<CrmContact | null> {
  if (!supabaseAdmin) return null;

  const { data: existingRow, error: existingError } = await supabaseAdmin
    .from(CRM_CONTACTS_TABLE)
    .select(CRM_CONTACT_SELECT)
    .eq("id", input.contactId)
    .maybeSingle();

  if (existingError) {
    console.error("[crm] fetch contact failed:", existingError.message);
    return null;
  }

  if (!existingRow) return null;

  const existing = mapCrmContact(existingRow as Record<string, unknown>);
  const nextValues = {
    company: "company" in input ? input.company ?? null : existing.company,
    email: "email" in input ? input.email ?? null : existing.email,
    fullName: "fullName" in input ? input.fullName?.trim() || existing.fullName : existing.fullName,
    lastContactedAt:
      "lastContactedAt" in input ? input.lastContactedAt ?? null : existing.lastContactedAt,
    leadScore: "leadScore" in input ? input.leadScore ?? null : existing.leadScore,
    lifecycleStage: "lifecycleStage" in input ? input.lifecycleStage : existing.lifecycleStage,
    nextFollowUpAt:
      "nextFollowUpAt" in input ? input.nextFollowUpAt ?? null : existing.nextFollowUpAt,
    notes: "notes" in input ? input.notes ?? null : existing.notes,
    ownerName: "ownerName" in input ? input.ownerName ?? null : existing.ownerName,
    phone: "phone" in input ? input.phone ?? null : existing.phone,
    source: "source" in input ? input.source ?? null : existing.source,
    visibility: "visibility" in input ? input.visibility ?? existing.visibility : existing.visibility,
  };

  const changedFields: string[] = [];
  if (nextValues.company !== existing.company) changedFields.push("company");
  if (nextValues.email !== existing.email) changedFields.push("email");
  if (nextValues.fullName !== existing.fullName) changedFields.push("name");
  const followUpChanged = nextValues.nextFollowUpAt !== existing.nextFollowUpAt;
  const leadScoreChanged = nextValues.leadScore !== existing.leadScore;
  const lifecycleChanged = nextValues.lifecycleStage !== existing.lifecycleStage;
  if (nextValues.lastContactedAt !== existing.lastContactedAt) changedFields.push("last contacted");
  if (leadScoreChanged) changedFields.push("lead score");
  if (lifecycleChanged) changedFields.push("stage");
  if (followUpChanged) changedFields.push("next follow-up");
  if (nextValues.notes !== existing.notes) changedFields.push("notes");
  if (nextValues.ownerName !== existing.ownerName) changedFields.push("owner");
  if (nextValues.phone !== existing.phone) changedFields.push("phone");
  if (nextValues.source !== existing.source) changedFields.push("source");
  if (nextValues.visibility !== existing.visibility) changedFields.push("visibility");

  if (changedFields.length === 0) return existing;

  const actor = await getCurrentActor();
  const { data, error } = await supabaseAdmin
    .from(CRM_CONTACTS_TABLE)
    .update({
      company: nextValues.company,
      email: nextValues.email,
      full_name: nextValues.fullName,
      last_contacted_at: nextValues.lastContactedAt,
      lead_score: nextValues.leadScore,
      lifecycle_stage: nextValues.lifecycleStage,
      next_follow_up_at: nextValues.nextFollowUpAt,
      notes: nextValues.notes,
      owner_name: nextValues.ownerName,
      phone: nextValues.phone,
      source: nextValues.source,
      visibility: nextValues.visibility,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.contactId)
    .select(CRM_CONTACT_SELECT)
    .single();

  if (error) {
    console.error("[crm] update contact failed:", error.message);
    return null;
  }

  const contact = mapCrmContact(data as Record<string, unknown>);

  await logSystemEvent({
    eventName: "crm_contact_updated",
    actorId: actor.actorId,
    actorName: actor.actorName,
    actorType: actor.actorType,
    clientSlug: contact.clientSlug,
    visibility: contact.visibility,
    entityType: "crm_contact",
    entityId: contact.id,
    summary: `Updated CRM contact "${contact.fullName}"`,
    detail: summarizeChangedFields(changedFields),
    metadata: {
      clientSlug: contact.clientSlug,
      lifecycleStage: contact.lifecycleStage,
      leadScore: contact.leadScore,
      visibility: contact.visibility,
    },
  });

  const nextNeedsTriage = crmNeedsFollowUpTriage(toSummaryRecord(contact));
  const previousNeededTriage = crmNeedsFollowUpTriage(toSummaryRecord(existing));
  if (nextNeedsTriage && (!previousNeededTriage || followUpChanged || leadScoreChanged || lifecycleChanged)) {
    const reason = followUpChanged
      ? contact.nextFollowUpAt
        ? `The next CRM follow-up for ${contact.fullName} was updated to ${formatDateTime(contact.nextFollowUpAt)}.`
        : `${contact.fullName} remains a high-priority CRM contact and needs a fresh follow-up recommendation.`
      : lifecycleChanged
        ? `${contact.fullName} moved to the ${contact.lifecycleStage} stage and needs follow-up guidance.`
        : `${contact.fullName} became a higher-priority CRM contact and needs follow-up guidance.`;

    await queueCrmFollowUpTriage(contact, reason);
  }

  return contact;
}
