import { describe, expect, it } from "vitest";
import { safeAdminSourceUrl } from "./page";

describe("Settings admin source URL display", () => {
  it("removes raw attribution identifiers from Ticketmaster CAPI source URLs", () => {
    const sourceUrl = "https://checkout.ticketmaster.com/confirmation"
      + "?om_click_id=omc_secret"
      + "&om_session_id=oms_secret"
      + "&fbclid=fbclid_secret"
      + "&fbc=fb.1.1710000000000.secret"
      + "&fbp=fb.1.1710000000000.secret"
      + "&ad_id=120247446000000525";

    expect(safeAdminSourceUrl(sourceUrl)).toBe("https://checkout.ticketmaster.com/confirmation");
  });
});
