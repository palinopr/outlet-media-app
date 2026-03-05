"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  UserPlus,
  Loader2,
  Check,
  Trash2,
  Users,
  Megaphone,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { fmtUsd, fmtDate, statusBadge, roasColor } from "@/lib/formatters";
import {
  removeClientMember,
  changeClientMemberRole,
  changeClientMemberScope,
  updateMemberCampaigns,
  updateMemberEvents,
} from "@/app/admin/actions/clients";
import type { ClientDetail, ClientMember as ClientMemberType } from "@/app/admin/clients/data";

interface Props {
  client: ClientDetail;
}

// ─── Stat card ──────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${accent}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold tabular-nums">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Role select ────────────────────────────────────────────────────────────

function RoleSelect({
  memberId,
  currentRole,
}: {
  memberId: string;
  currentRole: string;
}) {
  const [value, setValue] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(newRole: string) {
    if (newRole === value) return;
    setValue(newRole);
    setSaving(true);
    setSaved(false);
    try {
      await changeClientMemberRole({ memberId, role: newRole });
      setSaved(true);
      toast.success(`Role updated to ${newRole}`);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change role",
      );
      setValue(currentRole);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="owner">Owner</option>
        <option value="member">Member</option>
      </select>
      {saving && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {saved && <Check className="h-3 w-3 text-emerald-400" />}
    </div>
  );
}

// ─── Scope select ──────────────────────────────────────────────────────────

function ScopeSelect({
  memberId,
  currentScope,
}: {
  memberId: string;
  currentScope: string;
}) {
  const [value, setValue] = useState(currentScope);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(newScope: string) {
    if (newScope === value) return;
    setValue(newScope);
    setSaving(true);
    setSaved(false);
    try {
      await changeClientMemberScope({ memberId, scope: newScope });
      setSaved(true);
      toast.success(`Scope updated to ${newScope}`);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change scope",
      );
      setValue(currentScope);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="all">All</option>
        <option value="assigned">Assigned only</option>
      </select>
      {saving && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {saved && <Check className="h-3 w-3 text-emerald-400" />}
    </div>
  );
}

// ─── Assignment manager ────────────────────────────────────────────────────

function AssignmentManager({
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
          {/* Campaigns */}
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

          {/* Events */}
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

// ─── Invite member form ─────────────────────────────────────────────────────

function InviteMemberForm({
  clientSlug,
  onDone,
}: {
  clientSlug: string;
  onDone: () => void;
}) {
  const [email, setEmail] = useState("");
  const [clientRole, setClientRole] = useState<"owner" | "member">("member");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, client_slug: clientSlug, client_role: clientRole }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error ?? "Failed to send invite");
      }
      setSent(true);
      toast.success("Invite sent to " + email);
      setTimeout(() => {
        onDone();
      }, 1500);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send invite",
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 py-2">
        <Check className="h-4 w-4" /> Invite sent to {email}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 pt-1">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Email</label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="member@example.com"
          className="h-8 w-52 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Role</label>
        <select
          value={clientRole}
          onChange={(e) => setClientRole(e.target.value as "owner" | "member")}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="owner">Owner</option>
          <option value="member">Member</option>
        </select>
      </div>
      <Button type="submit" size="sm" disabled={loading} className="h-8">
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          "Send Invite"
        )}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8"
        onClick={onDone}
      >
        Cancel
      </Button>
    </form>
  );
}

// ─── Members section ────────────────────────────────────────────────────────

function MembersSection({ client }: { client: ClientDetail }) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Team Members</h2>
        {!showInvite && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 h-8 text-xs"
            onClick={() => setShowInvite(true)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Member
          </Button>
        )}
      </div>

      {showInvite && (
        <div className="mb-4">
          <InviteMemberForm
            clientSlug={client.slug}
            onDone={() => setShowInvite(false)}
          />
        </div>
      )}

      <Card className="border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Role
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Visibility
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Joined
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {client.members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-sm text-muted-foreground"
                >
                  No team members yet. Invite someone to get started.
                </TableCell>
              </TableRow>
            ) : (
              client.members.map((m) => (
                <TableRow key={m.id} className="border-border/60 align-top">
                  <TableCell className="text-sm font-medium">
                    {m.name || (
                      <span className="text-muted-foreground italic">
                        No name
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.email}
                  </TableCell>
                  <TableCell>
                    <RoleSelect memberId={m.id} currentRole={m.role} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <ScopeSelect
                        memberId={m.id}
                        currentScope={m.scope}
                      />
                      <AssignmentManager
                        member={m}
                        campaigns={client.campaigns}
                        events={client.events}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {fmtDate(m.createdAt)}
                  </TableCell>
                  <TableCell>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      }
                      title="Remove Member"
                      description={`Remove ${m.name || m.email} from this client? They will lose access to the client portal.`}
                      confirmLabel="Remove"
                      variant="destructive"
                      onConfirm={async () => {
                        try {
                          await removeClientMember({
                            clientId: client.id,
                            memberId: m.id,
                          });
                          toast.success(`Removed ${m.name || m.email}`);
                        } catch (err) {
                          toast.error(
                            err instanceof Error
                              ? err.message
                              : "Failed to remove member",
                          );
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ─── Campaigns section ──────────────────────────────────────────────────────

function CampaignsSection({ campaigns }: { campaigns: ClientDetail["campaigns"] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Assigned Campaigns</h2>
      </div>

      <Card className="border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">
                Campaign Name
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">
                Spend
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">
                ROAS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-sm text-muted-foreground"
                >
                  No campaigns assigned to this client.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id} className="border-border/60">
                  <TableCell className="text-sm font-medium">
                    {c.name}
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums">
                    {fmtUsd(c.spend)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}
                    >
                      {c.roas > 0 ? c.roas.toFixed(1) + "x" : "\u2014"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function ClientDetailView({ client }: Props) {
  const roasDisplay = client.roas > 0 ? client.roas.toFixed(1) + "x" : "\u2014";

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <div className="flex items-center gap-3">
            <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {client.slug}
            </code>
            {statusBadge(client.status)}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Members"
          value={String(client.memberCount)}
          accent="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Megaphone}
          label="Active Campaigns"
          value={`${client.activeCampaigns} / ${client.totalCampaigns}`}
          accent="bg-purple-500/10 text-purple-400"
        />
        <StatCard
          icon={CalendarDays}
          label="Shows"
          value={String(client.activeShows)}
          accent="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          icon={TrendingUp}
          label="ROAS"
          value={roasDisplay}
          accent="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      {/* Members */}
      <MembersSection client={client} />

      {/* Campaigns */}
      <CampaignsSection campaigns={client.campaigns} />
    </div>
  );
}
