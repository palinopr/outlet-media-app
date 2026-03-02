import { vi } from "vitest";

// ─── Mock @/lib/supabase ────────────────────────────────────────────────────
// Every route imports supabaseAdmin. We provide a chainable mock that tests
// can override per-case via `mockSupabaseAdmin`.

export function createChainableQuery(resolvedValue: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {};
  const proxy = (): typeof proxy => proxy as unknown as typeof proxy;

  // Terminal methods
  Object.assign(proxy, {
    select: () => proxy,
    insert: () => proxy,
    upsert: () => proxy,
    update: () => proxy,
    delete: () => proxy,
    eq: () => proxy,
    neq: () => proxy,
    is: () => proxy,
    not: () => proxy,
    in: () => proxy,
    order: () => proxy,
    limit: () => proxy,
    single: () => Promise.resolve(resolvedValue),
    then: (resolve: (v: unknown) => void) => Promise.resolve(resolvedValue).then(resolve),
  });

  return proxy;
}

// Default mock Supabase admin client
export const mockFrom = vi.fn();

export const mockSupabaseAdmin: Record<string, unknown> = {
  from: mockFrom,
};

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: mockSupabaseAdmin,
}));
