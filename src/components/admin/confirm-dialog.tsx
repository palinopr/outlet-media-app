"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [open, loading]);

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
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
      >
        <h3 id={titleId} className="text-sm font-semibold mb-1">{title}</h3>
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
