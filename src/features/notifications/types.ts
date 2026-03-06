export interface AppNotification {
  clientSlug: string | null;
  createdAt: string;
  entityId: string | null;
  entityType: string | null;
  fromUserId: string | null;
  fromUserName: string | null;
  id: string;
  message: string | null;
  pageId: string | null;
  read: boolean;
  routeEntityId?: string | null;
  routeEntityType?: string | null;
  taskId: string | null;
  title: string;
  type: string;
  userId: string;
}

export interface CreateNotificationInput {
  clientSlug?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  fromUserId?: string | null;
  fromUserName?: string | null;
  message?: string | null;
  pageId?: string | null;
  read?: boolean;
  taskId?: string | null;
  title: string;
  type: string;
  userId: string;
}
