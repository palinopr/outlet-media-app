"use client";

import { changeClientMemberRole } from "@/app/admin/actions/clients";
import { SavingSelect } from "./saving-select";

const ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "member", label: "Member" },
];

export function RoleSelect({
  memberId,
  currentRole,
}: {
  memberId: string;
  currentRole: string;
}) {
  return (
    <SavingSelect
      currentValue={currentRole}
      options={ROLE_OPTIONS}
      onSave={(role) => changeClientMemberRole({ memberId, role })}
      successMessage={(v) => `Role updated to ${v}`}
      errorMessage="Failed to change role"
    />
  );
}
