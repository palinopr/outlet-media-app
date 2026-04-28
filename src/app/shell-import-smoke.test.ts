import { describe, expect, it } from "vitest";

describe("shell import smoke", () => {
  it("imports the active admin and client surfaces plus shared data modules", async () => {
    await expect(import("./admin/dashboard/page")).resolves.toBeDefined();
    await expect(import("./admin/campaigns/page")).resolves.toBeDefined();
    await expect(import("./admin/reports/page")).resolves.toBeDefined();
    await expect(import("./admin/events/page")).resolves.toBeDefined();
    await expect(import("./admin/clients/page")).resolves.toBeDefined();
    await expect(import("./admin/users/page")).resolves.toBeDefined();
    await expect(import("./admin/settings/page")).resolves.toBeDefined();
    await expect(import("./admin/dashboard/data")).resolves.toBeDefined();
    await expect(import("./admin/campaigns/data")).resolves.toBeDefined();
    await expect(import("./admin/events/data")).resolves.toBeDefined();
    await expect(import("./admin/clients/data")).resolves.toBeDefined();
    await expect(import("./admin/users/data")).resolves.toBeDefined();
    await expect(import("./client/[slug]/layout")).resolves.toBeDefined();
    await expect(import("./client/[slug]/campaigns/page")).resolves.toBeDefined();
    await expect(import("./client/[slug]/reports/page")).resolves.toBeDefined();
    await expect(import("./client/[slug]/events/page")).resolves.toBeDefined();
    await expect(import("./client/[slug]/campaign/[campaignId]/page")).resolves.toBeDefined();
    await expect(import("./client/[slug]/event/[eventId]/page")).resolves.toBeDefined();
  });
});
