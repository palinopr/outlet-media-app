import { describe, expect, it } from "vitest";
import { getAccessManagementPaths } from "@/features/access/revalidation";

describe("access management revalidation paths", () => {
  it("covers the shared admin access surfaces", () => {
    expect(getAccessManagementPaths()).toEqual([
      "/admin/clients",
      "/admin/settings",
      "/admin/users",
    ]);
  });

  it("includes client detail and portal settings when client context is present", () => {
    expect(
      getAccessManagementPaths({
        clientId: "client_1",
        clientSlug: "zamora",
      }),
    ).toEqual([
      "/admin/clients",
      "/admin/settings",
      "/admin/users",
      "/admin/clients/client_1",
      "/client/zamora",
      "/client/zamora/events",
    ]);
  });
});
