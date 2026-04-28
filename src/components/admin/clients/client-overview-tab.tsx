"use client";

import { useState, useTransition } from "react";
import { Eye, Megaphone, Palette } from "lucide-react";
import { toast } from "sonner";
import { updateClient } from "@/app/admin/actions/clients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientOverviewTabProps {
  brandName: string | null;
  clientId: string;
  logoAlt: string | null;
  logoUrl: string | null;
}

type ClientUpdatePatch = Omit<Parameters<typeof updateClient>[0], "clientId">;

export function ClientOverviewTab({
  brandName: initialBrandName,
  clientId,
  logoAlt: initialLogoAlt,
  logoUrl: initialLogoUrl,
}: ClientOverviewTabProps) {
  const [brandName, setBrandName] = useState(initialBrandName ?? "");
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl ?? "");
  const [logoAlt, setLogoAlt] = useState(initialLogoAlt ?? "");
  const [isPending, startTransition] = useTransition();

  function savePortalSettings(
    changes: ClientUpdatePatch,
    rollback?: () => void,
    successMessage = "Client portal settings updated",
  ) {
    startTransition(async () => {
      try {
        await updateClient({ clientId, ...changes });
        toast.success(successMessage);
      } catch (error) {
        rollback?.();
        toast.error(
          error instanceof Error ? error.message : "Failed to update client portal settings",
        );
      }
    });
  }

  function handleBrandingSave() {
    savePortalSettings(
      {
        brandName: brandName.trim() || null,
        logoAlt: logoAlt.trim() || null,
        logoUrl: logoUrl.trim() || null,
      },
      undefined,
      "Portal branding updated",
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Client Portal Shape</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          The client portal is intentionally narrow: campaign performance only. Clients do not create,
          edit, approve, or manage work from the portal.
        </p>

        <div className="mt-4 grid gap-3">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Megaphone className="h-4 w-4 text-primary" />
              Campaigns
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Campaigns stay visible for every client. Scope and assignments still come from admin
              ownership and member access rules.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Portal Branding</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Override the client-facing portal name and logo without changing the underlying account slug.
          </p>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-1">
              <label className="text-xs font-medium text-muted-foreground">Portal name</label>
              <Input
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="Acme Live"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-medium text-muted-foreground">Logo URL</label>
              <Input
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                placeholder="https://cdn.example.com/acme-logo.png"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-medium text-muted-foreground">Logo alt text</label>
              <Input
                value={logoAlt}
                onChange={(event) => setLogoAlt(event.target.value)}
                placeholder="Acme Live"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={handleBrandingSave}
            >
              Save Branding
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
