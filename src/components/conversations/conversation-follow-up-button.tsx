"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationThreadKind } from "@/features/conversations/summary";

export interface ConversationFollowUpConfig {
  createdLabel: string;
  createLabel: string;
  route: string;
}

export function getConversationFollowUpConfig(
  kind: ConversationThreadKind,
): ConversationFollowUpConfig {
  switch (kind) {
    case "campaign":
      return {
        createdLabel: "Action created",
        createLabel: "Create action",
        route: "/api/campaign-comments/action-item",
      };
    case "crm":
      return {
        createdLabel: "Follow-up created",
        createLabel: "Create follow-up",
        route: "/api/crm-comments/follow-up-item",
      };
    case "asset":
      return {
        createdLabel: "Follow-up created",
        createLabel: "Create follow-up",
        route: "/api/asset-comments/follow-up-item",
      };
    case "event":
      return {
        createdLabel: "Follow-up created",
        createLabel: "Create follow-up",
        route: "/api/event-comments/follow-up-item",
      };
  }
}

interface ConversationFollowUpButtonProps {
  commentId: string;
  kind: ConversationThreadKind;
}

export function ConversationFollowUpButton({
  commentId,
  kind,
}: ConversationFollowUpButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const config = getConversationFollowUpConfig(kind);

  async function createFollowUp() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(config.route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setError(payload.error ?? "Failed to create follow-up.");
        return;
      }

      setCreated(true);
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (created) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#f1ece4] px-2 py-1 text-[11px] font-medium text-[#6f6a63]">
        {config.createdLabel}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 rounded-full px-3 text-xs"
        disabled={isSubmitting}
        onClick={createFollowUp}
      >
        {isSubmitting ? <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
        {config.createLabel}
      </Button>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
