import type { Metadata } from "next";
import { slugToLabel } from "@/lib/formatters";
import { requireClientAgentAccess } from "@/features/client-portal/access";
import { getClientPortalConfig } from "@/features/client-portal/config";
import { listThreads } from "@/features/client-agent/server";
import { AgentShell } from "@/features/client-agent/components/agent-shell";

interface ClientAgentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ClientAgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);

  return {
    title: `${clientName} Agent`,
    description: `Client-safe campaign and event Q&A for ${clientName}`,
  };
}

export default async function ClientAgentPage({ params }: ClientAgentPageProps) {
  const { slug } = await params;
  const access = await requireClientAgentAccess(slug);
  const portalConfig = await getClientPortalConfig(slug);
  const clientName = portalConfig?.brandName ?? slugToLabel(slug);

  const threadResult = await listThreads({ slug });
  const initialThreads = threadResult.ok ? threadResult.body.threads : [];

  return (
    <div className="space-y-6">
      <AgentShell
        clientName={clientName}
        eventsEnabled={portalConfig?.eventsEnabled ?? false}
        initialThreads={initialThreads}
        slug={slug}
        viewer={access.viewer}
      />
    </div>
  );
}
