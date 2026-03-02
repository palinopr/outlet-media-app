"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { toSlug } from "@/lib/to-slug";

export function ClientOnboardForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  function handleNameChange(value: string) {
    setName(value);
    setSlug(toSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), client_slug: slug || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setStatus("done");
      setTimeout(() => {
        setStatus("idle");
        setName("");
        setSlug("");
        setEmail("");
      }, 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Client Name</label>
          <Input
            placeholder="Zamora Presents"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Slug</label>
          <Input
            placeholder="zamora_presents"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={status === "submitting"}
            className="font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">Auto-generated from name. Editable.</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Contact Email</label>
        <Input
          type="email"
          placeholder="contact@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="sm"
          disabled={!name.trim() || !email.trim() || status === "submitting"}
        >
          {status === "submitting" && <Loader2 className="h-3 w-3 animate-spin" />}
          {status === "done" && <Check className="h-3 w-3 text-emerald-400" />}
          {status === "done" ? "Invited" : "Send Invite"}
        </Button>
        {status === "error" && (
          <span className="text-xs text-red-400">Failed to send invite. Try again.</span>
        )}
      </div>
    </form>
  );
}
