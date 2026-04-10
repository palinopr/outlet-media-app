"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventDiscussionFormProps {
  eventId: string;
  slug: string;
}

export function EventDiscussionForm({ eventId, slug }: EventDiscussionFormProps) {
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
      const response = await fetch("/api/event-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          client_slug: slug,
          content: nextContent,
          visibility: "shared",
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to post the event comment right now.");
      }

      setContent("");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to post the event comment right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
      <label htmlFor={`event-comment-${eventId}`} className="text-sm font-medium text-white">
        Add an event note
      </label>
      <p className="mt-1 text-sm text-white/45">
        Keep ticketing questions, blockers, and promotion feedback attached to the event so the whole show context stays visible.
      </p>

      <textarea
        id={`event-comment-${eventId}`}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="What changed, what is blocked, or what needs review for this show?"
        rows={4}
        disabled={isSubmitting}
        className="mt-3 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-white/35">
          Shared comments appear back on the event timeline and can trigger agent triage when needed.
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || content.trim().length === 0}
          className="gap-2 self-start bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          {isSubmitting ? "Posting..." : "Post comment"}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}
