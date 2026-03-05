"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  updateMemberCampaigns,
  updateMemberEvents,
} from "@/app/admin/actions/clients";
import type { ClientDetail, ClientMember as ClientMemberType } from "@/app/admin/clients/data";

export function AssignmentManager({
  member,
  campaigns,
  events,
}: {
  member: ClientMemberType;
  campaigns: ClientDetail["campaigns"];
  events: ClientDetail["events"];
}) {
  const [open, setOpen] = useState(false);
  const [selCampaigns, setSelCampaigns] = useState<Set<string>>(
    new Set(member.assignedCampaignIds),
  );
  const [selEvents, setSelEvents] = useState<Set<string>>(
    new Set(member.assignedEventIds),
  );
  const [saving, setSaving] = useState(false);

  if (member.scope !== "assigned") return null;

  function toggleCampaign(id: string) {
    setSelCampaigns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleEvent(id: string) {
    setSelEvents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        updateMemberCampaigns({
          memberId: member.id,
          campaignIds: [...selCampaigns],
        }),
        updateMemberEvents({
          memberId: member.id,
          eventIds: [...selEvents],
        }),
      ]);
      toast.success("Assignments saved");
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save assignments",
      );
    } finally {
      setSaving(false);
    }
  }

  const totalAssigned = selCampaigns.size + selEvents.size;

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs gap-1.5"
        onClick={() => setOpen(!open)}
      >
        {totalAssigned > 0
          ? `${selCampaigns.size} campaigns, ${selEvents.size} events`
          : "Assign items"}
      </Button>

      {open && (
        <div className="mt-3 rounded-lg border border-border/60 bg-card p-4 space-y-4">
          {campaigns.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Campaigns
              </p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {campaigns.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/[0.04] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selCampaigns.has(c.id)}
                      onChange={() => toggleCampaign(c.id)}
                      className="rounded border-border"
                    />
                    <span className="text-sm truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">
                      {c.status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {events.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Events
              </p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {events.map((e) => (
                  <label
                    key={e.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/[0.04] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selEvents.has(e.id)}
                      onChange={() => toggleEvent(e.id)}
                      className="rounded border-border"
                    />
                    <span className="text-sm truncate">{e.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">
                      {e.venue}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {campaigns.length === 0 && events.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No campaigns or events for this client yet.
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Save Assignments"
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
