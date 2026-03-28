import { describe, expect, it } from "vitest";
import { buildWorkQueueHref } from "./server";

describe("buildWorkQueueHref", () => {
  it("keeps campaign and event links on surviving routes", () => {
    expect(
      buildWorkQueueHref("campaign_action", "cmp_1", "acme", {
        clientSlug: "acme",
        mode: "client",
      }),
    ).toBe("/client/acme/campaign/cmp_1");

    expect(
      buildWorkQueueHref("event_follow_up", "evt_1", "acme", {
        clientSlug: "acme",
        mode: "client",
      }),
    ).toBe("/client/acme/event/evt_1");
  });

  it("collapses CRM and asset work-queue links onto surviving routes", () => {
    expect(
      buildWorkQueueHref("crm_follow_up", "contact_1", "acme", {
        clientSlug: "acme",
        mode: "admin",
      }),
    ).toBe("/admin/clients");

    expect(
      buildWorkQueueHref("asset_follow_up", "asset_1", "acme", {
        clientSlug: "acme",
        mode: "admin",
      }),
    ).toBe("/admin/campaigns");

    expect(
      buildWorkQueueHref("crm_follow_up", "contact_1", "acme", {
        clientSlug: "acme",
        mode: "client",
      }),
    ).toBe("/client/acme/campaigns");

    expect(
      buildWorkQueueHref("asset_follow_up", "asset_1", "acme", {
        clientSlug: "acme",
        mode: "client",
      }),
    ).toBe("/client/acme/campaigns");
  });
});
