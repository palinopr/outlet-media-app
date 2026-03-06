"use client";

import { useState } from "react";
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
import { UserPlus, Loader2, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "@/lib/formatters";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { inviteTeamMember, removeTeamMember } from "./actions";
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(memberId: string) {
    await removeTeamMember({ memberId, slug: data.slug });
    toast.success("Team member removed");
  }

  return (
    <div className="space-y-6">
      <ConnectedAccountsList
        accounts={data.connectedAccounts}
        connectUrl={`/api/meta/connect?slug=${data.slug}`}
        slug={data.slug}
      />

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
