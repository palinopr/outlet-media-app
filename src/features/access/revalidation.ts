import { revalidatePath } from "next/cache";

interface AccessManagementPathsInput {
  clientId?: string | null;
  clientSlug?: string | null;
}

export function getAccessManagementPaths(input: AccessManagementPathsInput = {}) {
  const paths = ["/admin/clients", "/admin/settings", "/admin/users"];

  if (input.clientId) {
    paths.push(`/admin/clients/${input.clientId}`);
  }

  if (input.clientSlug) {
    paths.push(`/client/${input.clientSlug}/settings`);
  }

  return [...new Set(paths)];
}

export function revalidateAccessManagementPaths(input: AccessManagementPathsInput = {}) {
  for (const path of getAccessManagementPaths(input)) {
    revalidatePath(path);
  }
}
