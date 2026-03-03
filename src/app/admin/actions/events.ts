"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";

const UpdateEventStatusSchema = z.object({
  eventId: z.string().min(1),
  status: z.string().min(1),
});

export async function updateEventStatus(formData: { eventId: string; status: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateEventStatusSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin.from("tm_events").select("status").eq("id", parsed.eventId).single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ status: parsed.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "update_status", { status: old?.status }, { status: parsed.status });
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

  const { data: old } = await supabaseAdmin.from("tm_events").select("client_slug").eq("id", parsed.eventId).single();

  const { error } = await supabaseAdmin
    .from("tm_events")
    .update({ client_slug: parsed.clientSlug || null, updated_at: new Date().toISOString() })
    .eq("id", parsed.eventId);

  if (error) throw new Error(error.message);

  await logAudit("event", parsed.eventId, "assign_client", { client_slug: old?.client_slug }, { client_slug: parsed.clientSlug });
  revalidatePath("/admin/events");
}

const UpdateTicketsSchema = z.object({
  eventId: z.string().min(1),
  ticketsSold: z.number().int().min(0).nullable(),
  ticketsAvailable: z.number().int().min(0).nullable(),
});

export async function updateEventTickets(formData: { eventId: string; ticketsSold: number | null; ticketsAvailable: number | null }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateTicketsSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin.from("tm_events").select("tickets_sold, tickets_available").eq("id", parsed.eventId).single();

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
  revalidatePath("/admin/events");
}
