"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "destructive" | "default";
  onConfirm: () => Promise<void>;
}

export function ConfirmDialog({ trigger, title, description, confirmLabel = "Confirm", variant = "destructive", onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  if (!open) {
    return <div onClick={() => setOpen(true)}>{trigger}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={() => !loading && setOpen(false)} />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant={variant} size="sm" onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
