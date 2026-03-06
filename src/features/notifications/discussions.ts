import {
  createNotification,
  listAdminNotificationRecipients,
  listClientNotificationRecipients,
} from "./server";

type DiscussionNotificationVisibility = "admin_only" | "shared";

interface DiscussionRecipientOptions {
  actorId?: string | null;
  clientSlug?: string | null;
  visibility: DiscussionNotificationVisibility;
}

export interface DiscussionNotificationInput extends DiscussionRecipientOptions {
  actorName?: string | null;
  entityId: string;
  entityType: string;
  message?: string | null;
  title: string;
}

export async function listDiscussionNotificationRecipientIds(
  options: DiscussionRecipientOptions,
) {
  const [adminIds, clientIds] = await Promise.all([
    listAdminNotificationRecipients({
      excludeUserId: options.actorId ?? undefined,
    }),
    options.visibility === "shared" && options.clientSlug
      ? listClientNotificationRecipients(options.clientSlug, {
          excludeUserId: options.actorId ?? undefined,
        })
      : Promise.resolve([]),
  ]);

  return [...new Set([...adminIds, ...clientIds])];
}

export async function notifyDiscussionAudience(input: DiscussionNotificationInput) {
  const recipientIds = await listDiscussionNotificationRecipientIds(input);
  if (recipientIds.length === 0) return;

  await Promise.all(
    recipientIds.map((userId) =>
      createNotification({
        clientSlug: input.clientSlug ?? null,
        entityId: input.entityId,
        entityType: input.entityType,
        fromUserId: input.actorId ?? null,
        fromUserName: input.actorName ?? null,
        message: input.message ?? null,
        title: input.title,
        type: "comment",
        userId,
      }),
    ),
  );
}
