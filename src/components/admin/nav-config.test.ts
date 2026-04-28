import { describe, expect, it } from "vitest";
import { adminNavItems } from "./nav-config";

describe("adminNavItems", () => {
  it("matches the approved admin shell", () => {
    expect(adminNavItems.map((item) => [item.label, item.href])).toEqual([
      ["Dashboard", "/admin/dashboard"],
      ["Campaigns", "/admin/campaigns"],
      ["Reports", "/admin/reports"],
      ["Events", "/admin/events"],
      ["Clients", "/admin/clients"],
      ["Users", "/admin/users"],
      ["Settings", "/admin/settings"],
    ]);
  });
});
