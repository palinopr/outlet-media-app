import { describe, expect, it } from "vitest";

import { parseCustomerTicketIntent } from "./message-parser";

describe("parseCustomerTicketIntent", () => {
  it("extracts explicit quantity, budget, and supported preference phrases", () => {
    expect(parseCustomerTicketIntent("I need 2 tickets under $300 near the stage")).toEqual({
      maxTotalCents: 30000,
      preferences: ["near_stage"],
      quantity: 2,
    });
  });
});
