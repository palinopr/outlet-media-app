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
import { Clock3, UserPlus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { fmtDate, getInvitationStatusCfg } from "@/lib/formatters";
import { removeClientMember } from "@/app/admin/actions/clients";
import type { ClientDetail } from "@/app/admin/clients/data";
import { RevokeInvitationButton } from "@/components/admin/users/revoke-invitation-button";
import { countActionableInvitationStatuses } from "@/features/invitations/sort";
import { RoleSelect } from "./role-select";
import { ScopeSelect } from "./scope-select";
import { AssignmentManager } from "./assignment-manager";
import { InviteMemberForm } from "./invite-member-form";

export function MembersSection({ client }: { client: ClientDetail }) {
  const [showInvite, setShowInvite] = useState(false);
  const inviteCounts = countActionableInvitationStatuses(
    client.pendingInvites.map((invite) => invite.status),
  );

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

      <Card className="mb-4 border-border/60">
        <div className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3">
          <div>
            <h3 className="text-sm font-medium">Access invites</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {client.pendingInvites.length} invite{client.pendingInvites.length === 1 ? "" : "s"} still waiting to turn into active members or be cleaned up.
            </p>
            {client.pendingInvites.length > 0 ? (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {inviteCounts.pending} pending • {inviteCounts.expired} expired
              </p>
            ) : null}
          </div>
          <Clock3 className="mt-0.5 h-4 w-4 text-muted-foreground" />
        </div>
        {client.pendingInvites.length === 0 ? (
          <div className="px-4 py-4 text-sm text-muted-foreground">
            No access invites for this client right now.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {client.pendingInvites.map((invite) => {
              const inviteStatus = getInvitationStatusCfg(invite.status);

              return (
                <div
                  key={invite.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{invite.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {inviteStatus.detail} • sent {fmtDate(invite.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${inviteStatus.bg} ${inviteStatus.border} ${inviteStatus.text} border`}
                    >
                      {inviteStatus.label}
                    </span>
                    <RevokeInvitationButton
                      email={invite.email}
                      invitationId={invite.id}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 shrink-0 px-2 text-muted-foreground hover:text-red-400"
                        >
                          <X className="mr-1.5 h-3.5 w-3.5" />
                          Revoke
                        </Button>
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

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
