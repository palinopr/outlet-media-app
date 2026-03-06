"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
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
import { UserPlus, Loader2, Check, MailPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fmtDate, getInvitationStatusCfg } from "@/lib/formatters";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { inviteTeamMember, removeTeamMember, revokeTeamInvite } from "./actions";
import { ConnectedAccountsList } from "./connected-accounts-list";
import type { SettingsData } from "./data";

function RoleBadge({ role }: { role: string }) {
  const isOwner = role === "owner";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        isOwner
          ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
      }`}
    >
      {role}
    </span>
  );
}

export function SettingsView({ data }: { data: SettingsData }) {
  const router = useRouter();
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await inviteTeamMember({ email: email.trim(), slug: data.slug });
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
      setInvited(true);
      setTimeout(() => setInvited(false), 2000);
      setShowInvite(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(memberId: string) {
    await removeTeamMember({ memberId, slug: data.slug });
    toast.success("Team member removed");
    router.refresh();
  }

  async function handleRevoke(invitationId: string, email: string) {
    await revokeTeamInvite({ invitationId, slug: data.slug });
    toast.success(`Invite revoked for ${email}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <ConnectedAccountsList
        accounts={data.connectedAccounts}
        canManage={data.isOwner}
        connectUrl={`/api/meta/connect?slug=${data.slug}`}
        slug={data.slug}
      />

      <Card className="border-white/[0.06] bg-white/[0.02] p-0">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white/90">Access invites</h2>
            <p className="mt-0.5 text-xs text-white/50">
              {data.pendingInvites.length} invite{data.pendingInvites.length === 1 ? "" : "s"} waiting for teammates to join or be cleaned up
            </p>
          </div>
          <MailPlus className="h-4 w-4 text-white/40" />
        </div>

        {data.pendingInvites.length === 0 ? (
          <div className="px-5 py-5 text-sm text-white/50">
            No team access invites need attention right now.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {data.pendingInvites.map((invite) => {
              const inviteStatus = getInvitationStatusCfg(invite.status);

              return (
                <div key={invite.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/90">{invite.email}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {inviteStatus.detail} • sent {fmtDate(invite.createdAt)}
                    </p>
                  </div>
                  {data.isOwner ? (
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${inviteStatus.border} ${inviteStatus.bg} ${inviteStatus.text}`}>
                        {inviteStatus.label}
                      </span>
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 shrink-0 px-2 text-white/40 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Revoke
                          </Button>
                        }
                        title="Revoke invitation"
                        description={`Revoke the invitation for ${invite.email}? They will need a new invite to join ${data.clientName}.`}
                        confirmLabel="Revoke invite"
                        variant="destructive"
                        onConfirm={() => handleRevoke(invite.id, invite.email)}
                      />
                    </div>
                  ) : (
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${inviteStatus.border} ${inviteStatus.bg} ${inviteStatus.text}`}>
                      {inviteStatus.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Team Members */}
      <Card className="border-white/[0.06] bg-white/[0.02] p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-sm font-semibold text-white/90">Team</h2>
            <p className="text-xs text-white/50 mt-0.5">
              {data.members.length} member{data.members.length !== 1 ? "s" : ""}
            </p>
          </div>
          {data.isOwner && (
            <Button
              size="sm"
              variant="outline"
              className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white/80 text-xs"
              onClick={() => setShowInvite(!showInvite)}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite Member
            </Button>
          )}
        </div>

        {/* Inline invite form */}
        {showInvite && data.isOwner && (
          <form
            onSubmit={handleInvite}
            className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.01]"
          >
            <Input
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/[0.03] border-white/[0.08] text-white/90 placeholder:text-white/30 text-sm h-8"
              autoFocus
              required
            />
            <Button
              type="submit"
              size="sm"
              disabled={inviting || !email.trim()}
              className="text-xs h-8"
            >
              {inviting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : invited ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                "Send"
              )}
            </Button>
          </form>
        )}

        {/* Members table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-xs font-medium text-white/40">Name</TableHead>
                <TableHead className="text-xs font-medium text-white/40">Email</TableHead>
                <TableHead className="text-xs font-medium text-white/40">Role</TableHead>
                <TableHead className="text-xs font-medium text-white/40">Joined</TableHead>
                {data.isOwner && (
                  <TableHead className="text-xs font-medium text-white/40 w-10" />
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.members.map((m) => (
                <TableRow key={m.id} className="border-white/[0.06]">
                  <TableCell className="text-sm text-white/90">{m.name}</TableCell>
                  <TableCell className="text-sm text-white/50">{m.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={m.role} />
                  </TableCell>
                  <TableCell className="text-sm text-white/40 tabular-nums">
                    {fmtDate(m.createdAt)}
                  </TableCell>
                  {data.isOwner && (
                    <TableCell>
                      {m.role !== "owner" && (
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-white/30 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                          title="Remove team member"
                          description={`Remove ${m.name} (${m.email}) from ${data.clientName}? They will lose access to the client portal.`}
                          confirmLabel="Remove"
                          variant="destructive"
                          onConfirm={() => handleRemove(m.id)}
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {!data.isOwner && (
          <div className="px-5 py-3 border-t border-white/[0.06]">
            <p className="text-xs text-white/30">
              Only team owners can manage members.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
