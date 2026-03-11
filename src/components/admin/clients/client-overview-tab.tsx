"use client";

import { useState, useTransition } from "react";
import { CalendarDays, Eye, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { updateClient } from "@/app/admin/actions/clients";
import { Switch } from "@/components/ui/switch";

interface ClientOverviewTabProps {
  clientId: string;
  eventsEnabled: boolean;
}

export function ClientOverviewTab({
  clientId,
  eventsEnabled: initialEventsEnabled,
}: ClientOverviewTabProps) {
  const [eventsEnabled, setEventsEnabled] = useState(initialEventsEnabled);
  const [isPending, startTransition] = useTransition();

  function handleEventsToggle(checked: boolean) {
    setEventsEnabled(checked);

    startTransition(async () => {
      try {
        await updateClient({
          clientId,
          eventsEnabled: checked,
        });
        toast.success(`Client Events ${checked ? "enabled" : "disabled"}`);
      } catch (error) {
        setEventsEnabled(!checked);
        toast.error(
          error instanceof Error ? error.message : "Failed to update client portal settings",
        );
      }
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Client Portal Shape</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          The client portal is intentionally narrow: dashboard, campaigns, campaign detail, and
          optional events. Clients do not create, edit, approve, or manage work from the portal.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Megaphone className="h-4 w-4 text-primary" />
              Campaign visibility
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Assign campaigns to the client from admin campaign ownership and member scope.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4 text-primary" />
              Events visibility
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              One toggle controls whether the client sees the Events nav item and event routes.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
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
            {eventsEnabled ? "Events are visible in the client portal." : "Events are hidden from the client portal."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            When disabled, the Events nav item is removed and direct event URLs redirect back to
            the dashboard.
          </p>
        </div>
      </section>
    </div>
  );
}
