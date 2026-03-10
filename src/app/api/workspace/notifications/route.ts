import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError, dbError } from "@/lib/api-helpers";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import { listNotificationsForUser } from "@/features/notifications/server";

async function getViewerRole() {
  const user = await currentUser();
  const metadata = (user?.publicMetadata ?? {}) as { role?: string };
  return metadata.role ?? null;
}

async function getClientNotificationScope(
  userId: string,
  clientSlug: string,
  role?: string | null,
): Promise<{ error: NextResponse | null; scope: ScopeFilter | undefined }> {
  const resolvedRole = role ?? (await getViewerRole());

  if (resolvedRole === "admin") {
    return { error: null, scope: undefined };
  }

  const access = await getMemberAccessForSlug(userId, clientSlug);
  if (!access) {
    return { error: apiError("Forbidden", 403), scope: undefined };
  }

  if (access.scope !== "assigned") {
    return { error: null, scope: undefined };
  }

  return {
    error: null,
    scope: {
      allowedCampaignIds: access.allowedCampaignIds,
      allowedEventIds: access.allowedEventIds,
    },
  };
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const clientSlug = request.nextUrl.searchParams.get("clientSlug");
  const role = await getViewerRole();

  if (!clientSlug && role !== "admin") {
    return apiError("Client inbox requests require a client scope", 403);
  }

  let scope: ScopeFilter | undefined;
  if (clientSlug) {
    const access = await getClientNotificationScope(userId, clientSlug, role);
    if (access.error) return access.error;
    scope = access.scope;
  }

  const notifications = await listNotificationsForUser(userId, {
    clientSlug,
    scope,
  });
  return NextResponse.json({ notifications });
}

export async function PATCH(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const notificationsDb = (await createClerkSupabaseClient()) ?? supabaseAdmin;
  if (!notificationsDb) return apiError("DB not configured");

  const role = await getViewerRole();

  let body: { clientSlug?: string; id?: string; markAll?: boolean };
  try {
    body = await request.json();
  } catch {
    return apiError("Malformed JSON", 400);
  }

  if (body.markAll) {
    let scope: ScopeFilter | undefined;
    if (body.clientSlug) {
      const access = await getClientNotificationScope(userId, body.clientSlug, role);
      if (access.error) return access.error;
      scope = access.scope;
    } else {
      if (role !== "admin") {
        return apiError("Client inbox requests require a client scope", 403);
      }
    }

    if (body.clientSlug && scope) {
      const notifications = await listNotificationsForUser(userId, {
        clientSlug: body.clientSlug,
        limit: 250,
        scope,
      });
      const visibleIds = notifications.filter((notification) => !notification.read).map((notification) => notification.id);
      if (visibleIds.length === 0) {
        return NextResponse.json({ success: true });
      }

      const { error: dbErr } = await notificationsDb
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .in("id", visibleIds);

      if (dbErr) return dbError(dbErr);
      return NextResponse.json({ success: true });
    }

    let query = notificationsDb
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (body.clientSlug) {
      query = query.eq("client_slug", body.clientSlug);
    }

    const { error: dbErr } = await query;
    if (dbErr) return dbError(dbErr);
    return NextResponse.json({ success: true });
  }

  if (body.id) {
    if (body.clientSlug) {
      const access = await getClientNotificationScope(userId, body.clientSlug, role);
      if (access.error) return access.error;

      const visibleNotifications = await listNotificationsForUser(userId, {
        clientSlug: body.clientSlug,
        limit: 250,
        scope: access.scope,
      });
      if (!visibleNotifications.some((notification) => notification.id === body.id)) {
        return apiError("Notification not found", 404);
      }
    } else {
      if (role !== "admin") {
        return apiError("Client inbox requests require a client scope", 403);
      }
    }

    const { error: dbErr } = await notificationsDb
      .from("notifications")
      .update({ read: true })
      .eq("id", body.id)
      .eq("user_id", userId);

    if (dbErr) return dbError(dbErr);
    return NextResponse.json({ success: true });
  }

  return apiError("Provide id or markAll", 400);
}
