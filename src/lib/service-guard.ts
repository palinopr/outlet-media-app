import { redirect } from "next/navigation";
import { getEnabledServices } from "./client-services";
import type { ServiceKey } from "./service-registry";

export async function requireService(
  slug: string,
  ...serviceKeys: ServiceKey[]
): Promise<void> {
  const enabled = await getEnabledServices(slug);

  // Not configured = show everything (backwards compat)
  if (enabled === null) return;

  // Allow if ANY of the required services is enabled (OR logic)
  const hasAccess = serviceKeys.some((key) => enabled.includes(key));
  if (!hasAccess) {
    redirect(`/client/${slug}`);
  }
}
