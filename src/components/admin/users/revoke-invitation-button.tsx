"use client";

import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { revokeInvitation } from "@/app/admin/actions/users";

interface RevokeInvitationButtonProps {
  email: string;
  invitationId: string;
  trigger: React.ReactNode;
}

export function RevokeInvitationButton({
  email,
  invitationId,
  trigger,
}: RevokeInvitationButtonProps) {
  return (
    <ConfirmDialog
      trigger={trigger}
      title="Revoke Invitation"
      description={`This will revoke the pending invitation for ${email}.`}
      confirmLabel="Revoke"
      variant="destructive"
      onConfirm={async () => {
        try {
          await revokeInvitation({ invitationId });
          toast.success(`Invitation revoked for ${email}`);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to revoke invitation",
          );
        }
      }}
    />
  );
}
