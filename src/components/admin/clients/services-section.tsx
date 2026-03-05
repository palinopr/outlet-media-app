"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { toggleService } from "@/app/admin/actions/clients";
import {
  SERVICE_REGISTRY,
  SERVICE_KEYS,
  type ServiceKey,
} from "@/lib/service-registry";
import type { ClientService } from "@/lib/client-services";

interface Props {
  clientId: string;
  initialServices: ClientService[];
}

const CATEGORIES = [
  { key: "advertising" as const, label: "Advertising" },
  { key: "data" as const, label: "Data Sources" },
  { key: "tools" as const, label: "Tools" },
];

export function ServicesSection({ clientId, initialServices }: Props) {
  const [services, setServices] = useState(initialServices);
  const [pending, setPending] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function isEnabled(key: ServiceKey): boolean {
    const svc = services.find((s) => s.serviceKey === key);
    return svc?.enabled ?? false;
  }

  function handleToggle(key: ServiceKey, checked: boolean) {
    setPending(key);

    // Optimistic update
    setServices((prev) => {
      const existing = prev.find((s) => s.serviceKey === key);
      if (existing) {
        return prev.map((s) =>
          s.serviceKey === key ? { ...s, enabled: checked } : s,
        );
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          clientId,
          serviceKey: key,
          enabled: checked,
          config: {},
        },
      ];
    });

    startTransition(async () => {
      try {
        await toggleService({ clientId, serviceKey: key, enabled: checked });
        toast.success(
          `${SERVICE_REGISTRY[key].name} ${checked ? "enabled" : "disabled"}`,
        );
      } catch (err) {
        // Revert on failure
        setServices((prev) =>
          prev.map((s) =>
            s.serviceKey === key ? { ...s, enabled: !checked } : s,
          ),
        );
        toast.error(
          err instanceof Error ? err.message : "Failed to update service",
        );
      } finally {
        setPending(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      {CATEGORIES.map((cat) => {
        const defs = SERVICE_KEYS.filter(
          (k) => SERVICE_REGISTRY[k].category === cat.key,
        );
        if (defs.length === 0) return null;

        return (
          <div key={cat.key}>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {cat.label}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {defs.map((key) => {
                const def = SERVICE_REGISTRY[key];
                const enabled = isEnabled(key);
                const Icon = def.icon;
                const loading = pending === key && isPending;

                return (
                  <div
                    key={key}
                    className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                      enabled
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/60 bg-muted/30"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${
                        enabled
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{def.name}</p>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            handleToggle(key, checked)
                          }
                          disabled={loading}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {def.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
