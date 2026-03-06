"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";
import { logSystemEvent } from "@/features/system-events/server";

function eventVisibility(clientSlug: string | null | undefined) {
  return clientSlug ? "shared" : "admin_only";
}

const UpdateEventStatusSchema = z.object({
  eventId: z.string().min(1),
  status: z.string().min(1),
});

export async function updateEventStatus(formData: { eventId: string; status: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateEventStatusSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: old } = await supabaseAdmin
    .from("tm_events")
    .select("client_slug, name, status")
    .eq("id", parsed.eventId)
    .single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ status: parsed.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "update_status", { status: old?.status }, { status: parsed.status });
  await logSystemEvent({
    eventName: "event_updated",
    actorId: user.id,
    clientSlug: old?.client_slug ?? null,
    visibility: eventVisibility(old?.client_slug),
    entityType: "event",
    entityId: parsed.eventId,
    summary: `Set event "${old?.name ?? parsed.eventId}" to ${parsed.status}`,
    detail: old?.status ? `Previously ${old.status}.` : null,
    metadata: {
      field: "status",
      from: old?.status ?? null,
      to: parsed.status,
    },
  });
  revalidatePath("/admin/events");
}

const AssignEventClientSchema = z.object({
  eventId: z.string().min(1),
  clientSlug: z.string(),
});

export async function assignEventClient(formData: { eventId: string; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = AssignEventClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: old } = await supabaseAdmin
    .from("tm_events")
    .select("client_slug, name")
    .eq("id", parsed.eventId)
    .single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ client_slug: parsed.clientSlug || null, updated_at: new Date().toISOString() })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "assign_client", { client_slug: old?.client_slug }, { client_slug: parsed.clientSlug });
  await logSystemEvent({
    eventName: "event_updated",
    actorId: user.id,
    clientSlug: parsed.clientSlug,
    visibility: "shared",
    entityType: "event",
    entityId: parsed.eventId,
    summary: `Assigned event "${old?.name ?? parsed.eventId}" to ${parsed.clientSlug}`,
    detail: old?.client_slug ? `Previously assigned to ${old.client_slug}.` : null,
    metadata: {
      field: "client_slug",
      from: old?.client_slug ?? null,
      to: parsed.clientSlug,
    },
  });
  revalidatePath("/admin/events");
}

const UpdateTicketsSchema = z.object({
  eventId: z.string().min(1),
  ticketsSold: z.number().int().min(0).nullable(),
  ticketsAvailable: z.number().int().min(0).nullable(),
});

const BulkAssignEventClientSchema = z.object({
  eventIds: z.array(z.string().min(1)).min(1),
  clientSlug: z.string().min(1),
});

export async function bulkAssignEventClient(formData: { eventIds: string[]; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = BulkAssignEventClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ client_slug: parsed.clientSlug, updated_at: now })
    .in("id", parsed.eventIds);

  if (error) throw new Error(error.message);

  await logAudit("event", "bulk", "bulk_assign_client", null, {
    count: parsed.eventIds.length,
    client_slug: parsed.clientSlug,
  });
  await logSystemEvent({
    eventName: "event_updated",
    actorId: user.id,
    clientSlug: parsed.clientSlug,
    visibility: "shared",
    entityType: "event_batch",
    entityId: "bulk",
    summary: `Assigned ${parsed.eventIds.length} event${parsed.eventIds.length === 1 ? "" : "s"} to ${parsed.clientSlug}`,
    metadata: {
      count: parsed.eventIds.length,
      eventIds: parsed.eventIds,
    },
  });
  revalidatePath("/admin/events");
  return { success: true };
}

const BulkUpdateEventStatusSchema = z.object({
  eventIds: z.array(z.string().min(1)).min(1),
  status: z.string().min(1),
});

export async function bulkUpdateEventStatus(formData: { eventIds: string[]; status: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = BulkUpdateEventStatusSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ status: parsed.status, updated_at: now })
    .in("id", parsed.eventIds);

  if (error) throw new Error(error.message);

  await logAudit("event", "bulk", "bulk_update_status", null, {
    count: parsed.eventIds.length,
    status: parsed.status,
  });
  await logSystemEvent({
    eventName: "event_updated",
    actorId: user.id,
    visibility: "admin_only",
    entityType: "event_batch",
    entityId: "bulk",
    summary: `Updated ${parsed.eventIds.length} event${parsed.eventIds.length === 1 ? "" : "s"} to ${parsed.status}`,
    metadata: {
      count: parsed.eventIds.length,
      eventIds: parsed.eventIds,
      status: parsed.status,
    },
  });
  revalidatePath("/admin/events");
  return { success: true };
}

export async function updateEventTickets(formData: { eventId: string; ticketsSold: number | null; ticketsAvailable: number | null }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateTicketsSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: old } = await supabaseAdmin
    .from("tm_events")
    .select("client_slug, name, tickets_sold, tickets_available")
    .eq("id", parsed.eventId)
    .single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({
      tickets_sold: parsed.ticketsSold,
      tickets_available: parsed.ticketsAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "update_tickets", old, { tickets_sold: parsed.ticketsSold, tickets_available: parsed.ticketsAvailable });
  await logSystemEvent({
    eventName: "event_updated",
    actorId: user.id,
    clientSlug: old?.client_slug ?? null,
    visibility: eventVisibility(old?.client_slug),
    entityType: "event",
    entityId: parsed.eventId,
    summary: `Updated ticket counts for "${old?.name ?? parsed.eventId}"`,
    detail: `Sold ${parsed.ticketsSold ?? 0}, available ${parsed.ticketsAvailable ?? 0}.`,
    metadata: {
      field: "tickets",
      from: {
        ticketsAvailable: old?.tickets_available ?? null,
        ticketsSold: old?.tickets_sold ?? null,
      },
      to: {
        ticketsAvailable: parsed.ticketsAvailable,
        ticketsSold: parsed.ticketsSold,
      },
    },
  });
  revalidatePath("/admin/events");
}
