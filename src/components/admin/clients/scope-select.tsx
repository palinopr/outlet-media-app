"use client";

import { changeClientMemberScope } from "@/app/admin/actions/clients";
import { SavingSelect } from "./saving-select";

const SCOPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned only" },
];

export function ScopeSelect({
  memberId,
  currentScope,
}: {
  memberId: string;
  currentScope: string;
}) {
  return (
    <SavingSelect
      currentValue={currentScope}
      options={SCOPE_OPTIONS}
      onSave={(scope) => changeClientMemberScope({ memberId, scope })}
      successMessage={(v) => `Scope updated to ${v}`}
      errorMessage="Failed to change scope"
    />
  );
}
