import { describe, expect, it } from "vitest";
import { getClientSlugRevalidationPaths } from "@/app/admin/actions/clients.revalidation";

describe("getClientSlugRevalidationPaths", () => {
  it("keeps client rename revalidation on surviving admin surfaces", () => {
    expect(getClientSlugRevalidationPaths()).toEqual([
      "/admin/campaigns",
      "/admin/dashboard",
      "/admin/events",
    ]);
  });

  it("does not include the retired assets route", () => {
    expect(getClientSlugRevalidationPaths()).not.toContain("/admin/assets");
  });
});
