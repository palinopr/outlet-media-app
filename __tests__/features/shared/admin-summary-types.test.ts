import { describe, expect, it } from "vitest";

describe("admin summary shared types module", () => {
  it("exports shared admin summary contracts for feature modules", async () => {
    await expect(import("@/features/shared/admin-summary-types")).resolves.toMatchObject({
      CLIENT_SUMMARY_FIELDS: expect.any(Array),
      USER_ROW_FIELDS: expect.any(Array),
    });
  });
});
