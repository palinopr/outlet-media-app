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
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { fmtDate } from "@/lib/formatters";
import { removeClientMember } from "@/app/admin/actions/clients";
import type { ClientDetail } from "@/app/admin/clients/data";
import { RoleSelect } from "./role-select";
import { ScopeSelect } from "./scope-select";
import { AssignmentManager } from "./assignment-manager";
import { InviteMemberForm } from "./invite-member-form";

export function MembersSection({ client }: { client: ClientDetail }) {
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
