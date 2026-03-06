import { MessageSquareMore } from "lucide-react";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ConversationsCenter } from "@/components/conversations/conversations-center";
import { getConversationsCenter } from "@/features/conversations/server";
import { slugToLabel } from "@/lib/formatters";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Conversations" };

interface Props {
  searchParams: Promise<{ client?: string }>;
}

export default async function AdminConversationsPage({ searchParams }: Props) {
  const { client } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;

  const [center, clientsRes] = await Promise.all([
    getConversationsCenter({
      clientSlug,
      limit: 24,
      mode: "admin",
    }),
    supabaseAdmin?.from("clients").select("slug").order("name", { ascending: true }),
  ]);

  const clients = ((clientsRes?.data ?? []) as { slug: string | null }[])
    .map((row) => row.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Conversations"
        description="Cross-app discussion threads across campaigns, CRM, assets, and events."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
          <MessageSquareMore className="h-3.5 w-3.5" />
          {clientSlug ? slugToLabel(clientSlug) : "All clients"}
        </span>
      </AdminPageHeader>

      {clients.length > 0 ? (
        <div className="flex justify-end">
          <ClientFilter clients={clients} />
        </div>
      ) : null}

      <ConversationsCenter
        assetHrefPrefix="/admin/assets"
        canCreateFollowUps
        campaignHrefPrefix="/admin/campaigns"
        crmHrefPrefix="/admin/crm"
        description="Open shared and internal threads that still need a reply, follow-up, or resolution."
        eventHrefPrefix="/admin/events"
        showClientSlug
        summary={center.summary}
        threads={center.threads}
        title="Open discussions"
        variant="admin"
      />
    </div>
  );
}
