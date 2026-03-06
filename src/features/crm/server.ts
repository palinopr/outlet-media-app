import { supabaseAdmin } from "@/lib/supabase";
import {
  getCurrentActor,
  listSystemEvents,
  logSystemEvent,
  type SystemEvent,
} from "@/features/system-events/server";
import {
  buildCrmSummary,
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

  return contact;
}
