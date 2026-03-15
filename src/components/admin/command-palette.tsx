"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  CalendarDays,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { adminNavItems } from "./nav-config";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  fetchSearchableRecords,
  type SearchableRecord,
} from "@/app/admin/actions/search";

const typeIcon: Record<SearchableRecord["type"], typeof Megaphone> = {
  asset: ImageIcon,
  campaign: Megaphone,
  event: CalendarDays,
  client: Users,
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<SearchableRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open && !loaded) {
      fetchSearchableRecords()
        .then((data) => {
          setRecords(data);
          setLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to fetch searchable records:", err);
          setLoaded(true);
        });
    }
  }, [open, loaded]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const campaigns = records.filter((r) => r.type === "campaign");
  const events = records.filter((r) => r.type === "event");
  const assets = records.filter((r) => r.type === "asset");
  const clients = records.filter((r) => r.type === "client");

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search pages, campaigns, events, assets, and clients"
      showCloseButton={false}
    >
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {adminNavItems.map(({ href, label, icon: Icon }) => (
            <CommandItem
              key={href}
              value={label}
              onSelect={() => navigate(href)}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {loaded && campaigns.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Campaigns">
              {campaigns.map((r) => {
                const Icon = typeIcon[r.type];
                return (
                  <CommandItem
                    key={r.id}
                    value={`${r.name} ${r.subtitle}`}
                    onSelect={() => navigate(r.href)}
                  >
                    <Icon className="size-4" />
                    <span>{r.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {r.subtitle}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {loaded && events.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Events">
              {events.map((r) => {
                const Icon = typeIcon[r.type];
                return (
                  <CommandItem
                    key={r.id}
                    value={`${r.name} ${r.subtitle}`}
                    onSelect={() => navigate(r.href)}
                  >
                    <Icon className="size-4" />
                    <span>{r.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {r.subtitle}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {loaded && assets.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Assets">
              {assets.map((r) => {
                const Icon = typeIcon[r.type];
                return (
                  <CommandItem
                    key={r.id}
                    value={`${r.name} ${r.subtitle}`}
                    onSelect={() => navigate(r.href)}
                  >
                    <Icon className="size-4" />
                    <span>{r.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {r.subtitle}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {loaded && clients.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Clients">
              {clients.map((r) => {
                const Icon = typeIcon[r.type];
                return (
                  <CommandItem
                    key={r.id}
                    value={`${r.name} ${r.subtitle}`}
                    onSelect={() => navigate(r.href)}
                  >
                    <Icon className="size-4" />
                    <span>{r.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {r.subtitle}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
