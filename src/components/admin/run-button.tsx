"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type State = "idle" | "queuing" | "queued" | "error";

interface RunButtonProps {
  agentId: string;
}

export function RunButton({ agentId }: RunButtonProps) {
  const [state, setState] = useState<State>("idle");

  async function handleRun() {
    setState("queuing");
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: agentId }),
      });

      if (res.ok) {
        setState("queued");
        // Reset to idle after 4 seconds so button is usable again
        setTimeout(() => setState("idle"), 4000);
      } else {
        const body = await res.json().catch(() => ({}));
        console.error("[RunButton] failed:", body);
        setState("error");
        setTimeout(() => setState("idle"), 4000);
      }
    } catch (err) {
      console.error("[RunButton] network error:", err);
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }

  if (state === "queuing") {
    return (
      <Button size="sm" className="h-7 text-xs gap-1.5" disabled>
        <Loader2 className="h-3 w-3 animate-spin" />
        Queuing...
      </Button>
    );
  }

  if (state === "queued") {
    return (
      <Button size="sm" className="h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-600" disabled>
        <CheckCircle2 className="h-3 w-3" />
        Queued
      </Button>
    );
  }

  if (state === "error") {
    return (
      <Button size="sm" variant="destructive" className="h-7 text-xs gap-1.5" disabled>
        <AlertCircle className="h-3 w-3" />
        Failed
      </Button>
    );
  }

  return (
    <Button size="sm" className="h-7 text-xs gap-1.5" onClick={handleRun}>
      <Play className="h-3 w-3" />
      Run
    </Button>
  );
}
