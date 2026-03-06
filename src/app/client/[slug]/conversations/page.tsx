import type { Metadata } from "next";
import { MessageSquareMore } from "lucide-react";
import { ConversationsCenter } from "@/components/conversations/conversations-center";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { getConversationsCenter } from "@/features/conversations/server";
import { requireClientAccess } from "@/features/client-portal/access";
import { slugToLabel } from "@/lib/formatters";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Conversations`,
    description: `Shared discussions and follow-up threads for ${clientName}`,
  };
}

export default async function ClientConversationsPage({ params }: Props) {
  const { slug } = await params;
  const { scope } = await requireClientAccess(slug);
  const center = await getConversationsCenter({
    clientSlug: slug,
    limit: 24,
    mode: "client",
    scope,
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-sky-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-amber-400/[0.08] to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <MessageSquareMore className="h-4 w-4 text-cyan-400/70" />
            Conversations
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shared conversations
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/60">
              Follow open threads across campaigns, CRM, assets, and events without losing the context of the work.
            </p>
          </div>
        </div>
      </div>

      <ConversationsCenter
        assetHrefPrefix={`/client/${slug}/assets`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        crmHrefPrefix={`/client/${slug}/crm`}
        description="Only shared threads for this client account are shown here, so customers can stay involved without seeing internal-only discussion."
        eventHrefPrefix={`/client/${slug}/event`}
        summary={center.summary}
        threads={center.threads}
        title="Open shared threads"
        variant="client"
      />

      <ClientPortalFooter dataSource="database" />
    </div>
  );
}
