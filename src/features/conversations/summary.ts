export type ConversationThreadKind = "asset" | "campaign" | "event";

export interface ConversationThread {
  authorName: string | null;
  clientSlug: string | null;
  content: string;
  createdAt: string;
  id: string;
  kind: ConversationThreadKind;
  linkedFollowUpItemId: string | null;
  targetId: string;
  targetName: string | null;
}

