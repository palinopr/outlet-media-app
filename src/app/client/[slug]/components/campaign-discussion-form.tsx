"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampaignDiscussionFormProps {
  campaignId: string;
  slug: string;
}

export function CampaignDiscussionForm({
  campaignId,
  slug,
}: CampaignDiscussionFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextContent = content.trim();
    if (!nextContent || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/campaign-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          client_slug: slug,
          content: nextContent,
          visibility: "shared",
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to send the campaign request right now.");
      }

      setContent("");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send the campaign request right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
      <label htmlFor={`campaign-comment-${campaignId}`} className="text-sm font-medium text-white">
        Send a campaign request
      </label>
      <p className="mt-1 text-sm text-white/45">
        Ask for a change, flag a blocker, or add context the team should see.
      </p>

      <textarea
        id={`campaign-comment-${campaignId}`}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="What needs to change, be reviewed, or be clarified?"
        rows={4}
        disabled={isSubmitting}
        className="mt-3 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-white/35">Your request stays attached to this campaign.</div>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || content.trim().length === 0}
          className="gap-2 self-start bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          {isSubmitting ? "Sending..." : "Send request"}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}
