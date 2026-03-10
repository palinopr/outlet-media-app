import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  getFeatureReadClient,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    crm_comments: [] as Record<string, unknown>[],
    crm_contacts: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    crm_comments: [] as Record<string, unknown>[],
    crm_contacts: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq" | "in"; value: unknown }> = [];
        let limitValue: number | null = null;

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          in(field: string, value: unknown[]) {
            filters.push({ field, type: "in", value });
            return this;
          },
          order() {
            return this;
          },
          limit(value: number) {
            limitValue = value;
            return this;
          },
          async maybeSingle() {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return { data: rows[0] ?? null, error: null };
          },
          then(
            resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
          ) {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            const data = limitValue == null ? rows : rows.slice(0, limitValue);
            return Promise.resolve({ data, error: null }).then(resolve);
          },
        };

        return query;
      },
    };
  }

  const supabaseAdminClient = buildClient(serviceState);
  const userScopedSupabaseClient = buildClient(userScopedState);

  const createClerkSupabaseClientFn = vi.fn();
  const currentUserFn = vi.fn();

  const getFeatureReadClientFn = vi.fn(async (useClientScope: boolean) => {
    if (!useClientScope) return supabaseAdminClient;
    try {
      const user = await currentUserFn();
      const role = (user?.publicMetadata as { role?: string } | null)?.role;
      if (role === "admin") return supabaseAdminClient;
    } catch {
      return supabaseAdminClient;
    }
    return (await createClerkSupabaseClientFn()) ?? supabaseAdminClient;
  });

  return {
    createClerkSupabaseClient: createClerkSupabaseClientFn,
    currentUser: currentUserFn,
    getFeatureReadClient: getFeatureReadClientFn,
    serviceState,
    supabaseAdmin: supabaseAdminClient,
    userScopedState,
    userScopedSupabase: userScopedSupabaseClient,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  getFeatureReadClient,
  supabaseAdmin,
}));

vi.mock("@/lib/agent-dispatch", () => ({
  enqueueExternalAgentTask: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  getCurrentActor: vi.fn(),
  listCrmSystemEvents: vi.fn().mockResolvedValue([]),
  logSystemEvent: vi.fn(),
  summarizeChangedFields: vi.fn(),
}));

vi.mock("@/features/notifications/workflow", () => ({
  notifyWorkflowAssignee: vi.fn(),
}));

import { listCrmComments } from "@/features/crm-comments/server";
import { listCrmContacts, getCrmContactById } from "@/features/crm/server";
import { listCrmFollowUpItems } from "@/features/crm-follow-up-items/server";

describe("CRM read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.crm_comments = [];
    serviceState.crm_contacts = [];
    serviceState.crm_follow_up_items = [];
    userScopedState.crm_comments = [];
    userScopedState.crm_contacts = [];
    userScopedState.crm_follow_up_items = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for client CRM contact reads", async () => {
    serviceState.crm_contacts = [
      {
        id: "contact_service",
        client_slug: "zamora",
        full_name: "Service Contact",
        lifecycle_stage: "lead",
        visibility: "shared",
        tags: [],
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    userScopedState.crm_contacts = [
      {
        id: "contact_rls",
        client_slug: "zamora",
        full_name: "RLS Contact",
        lifecycle_stage: "lead",
        visibility: "shared",
        tags: [],
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const contacts = await listCrmContacts({
      audience: "shared",
      clientSlug: "zamora",
    });

    expect(contacts.map((contact) => contact.id)).toEqual(["contact_rls"]);
  });

  it("keeps admin CRM contact detail reads on the service role", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.crm_contacts = [
      {
        id: "contact_admin",
        client_slug: "zamora",
        full_name: "Admin Contact",
        lifecycle_stage: "lead",
        visibility: "shared",
        tags: [],
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    userScopedState.crm_contacts = [
      {
        id: "contact_rls",
        client_slug: "zamora",
        full_name: "RLS Contact",
        lifecycle_stage: "lead",
        visibility: "shared",
        tags: [],
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];

    const contact = await getCrmContactById("contact_admin", {
      audience: "shared",
      clientSlug: "zamora",
    });

    expect(contact?.id).toBe("contact_admin");
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });

  it("prefers the Clerk-scoped client for CRM discussion reads", async () => {
    serviceState.crm_comments = [
      {
        id: "comment_service",
        contact_id: "contact_1",
        client_slug: "zamora",
        content: "Service comment",
        visibility: "shared",
        resolved: false,
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    userScopedState.crm_comments = [
      {
        id: "comment_rls",
        contact_id: "contact_1",
        client_slug: "zamora",
        content: "RLS comment",
        visibility: "shared",
        resolved: false,
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const comments = await listCrmComments({
      audience: "shared",
      clientSlug: "zamora",
      contactId: "contact_1",
    });

    expect(comments.map((comment) => comment.id)).toEqual(["comment_rls"]);
  });

  it("prefers the Clerk-scoped client for CRM follow-up reads and contact names", async () => {
    serviceState.crm_follow_up_items = [
      {
        id: "item_service",
        contact_id: "contact_1",
        client_slug: "zamora",
        title: "Service item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        position: 0,
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    serviceState.crm_contacts = [
      {
        id: "contact_1",
        client_slug: "zamora",
        full_name: "Service Contact",
        lifecycle_stage: "lead",
        visibility: "shared",
        tags: [],
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    userScopedState.crm_follow_up_items = [
      {
        id: "item_rls",
        contact_id: "contact_2",
        client_slug: "zamora",
        title: "RLS item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        position: 0,
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    userScopedState.crm_contacts = [
      {
        id: "contact_2",
        client_slug: "zamora",
        full_name: "RLS Contact",
        lifecycle_stage: "lead",
        visibility: "shared",
        tags: [],
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const items = await listCrmFollowUpItems({
      audience: "shared",
      clientSlug: "zamora",
    });

    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contactId: "contact_2",
          contactName: "RLS Contact",
          id: "item_rls",
        }),
      ]),
    );
  });
});
