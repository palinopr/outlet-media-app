import { describe, expect, it } from "vitest";
import { adminNavItems } from "./nav-config";
import { getPageLabel } from "./activity-tracker";

describe("getPageLabel", () => {
  it("maps every approved admin shell route to its viewed label", () => {
    for (const { href, label } of adminNavItems) {
      expect(getPageLabel(href)).toBe(`Viewed ${label}`);
    }
  });
});
