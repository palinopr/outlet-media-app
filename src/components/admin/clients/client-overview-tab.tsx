"use client";

import { useState, useTransition } from "react";
import { Bot, CalendarDays, Eye, Megaphone, Palette } from "lucide-react";
import { toast } from "sonner";
import { updateClient } from "@/app/admin/actions/clients";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientOverviewTabProps {
  agentEnabled: boolean;
  brandName: string | null;
  clientId: string;
  eventsEnabled: boolean;
  logoAlt: string | null;
  logoUrl: string | null;
}

type ClientUpdatePatch = Omit<Parameters<typeof updateClient>[0], "clientId">;

export function ClientOverviewTab({
  agentEnabled: initialAgentEnabled,
  brandName: initialBrandName,
  clientId,
  eventsEnabled: initialEventsEnabled,
  logoAlt: initialLogoAlt,
  logoUrl: initialLogoUrl,
}: ClientOverviewTabProps) {
  const [agentEnabled, setAgentEnabled] = useState(initialAgentEnabled);
  const [eventsEnabled, setEventsEnabled] = useState(initialEventsEnabled);
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

  function handleEventsToggle(checked: boolean) {
    setEventsEnabled(checked);
    savePortalSettings(
      { eventsEnabled: checked },
      () => setEventsEnabled(!checked),
      `Client Events ${checked ? "enabled" : "disabled"}`,
    );
  }

  function handleAgentToggle(checked: boolean) {
    setAgentEnabled(checked);
    savePortalSettings(
      { agentEnabled: checked },
      () => setAgentEnabled(!checked),
      `Client Agent ${checked ? "enabled" : "disabled"}`,
    );
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
          The client portal is intentionally narrow: Campaigns, optional Agent, optional Events,
          and legacy Reports. Clients do not create, edit, approve, or manage work from the portal.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bot className="h-4 w-4 text-primary" />
              Optional Agent
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Enable the read-only Agent tab only for clients that should have conversational
              reporting in the portal.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4 text-primary" />
              Optional Events
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              One toggle controls whether the client sees the Events nav item and event routes.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4 text-primary" />
              Legacy Reports
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Reports remain a legacy portal package. Keep it available only where that older
              contract is still in use.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Portal Agent Access</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn this on only for clients that should see the Agent page.
              </p>
            </div>

            <Switch
              aria-label="Toggle client agent access"
              checked={agentEnabled}
              disabled={isPending}
              onCheckedChange={handleAgentToggle}
            />
          </div>

          <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-sm font-medium">
              {agentEnabled
                ? "Agent is visible in the client portal."
                : "Agent is hidden from the client portal."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              When disabled, the Agent nav item is removed and direct agent URLs redirect back to
              campaigns.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Portal Events Access</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn this on only for clients that should see the Events page.
              </p>
            </div>

            <Switch
              aria-label="Toggle client events access"
              checked={eventsEnabled}
              disabled={isPending}
              onCheckedChange={handleEventsToggle}
            />
          </div>

          <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-sm font-medium">
              {eventsEnabled
                ? "Events are visible in the client portal."
                : "Events are hidden from the client portal."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              When disabled, the Events nav item is removed and direct event URLs redirect back to
              campaigns.
            </p>
          </div>
        </div>

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
