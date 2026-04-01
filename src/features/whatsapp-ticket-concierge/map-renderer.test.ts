import { describe, expect, it } from "vitest";

import { renderMapPng } from "./map-renderer";

describe("renderMapPng", () => {
  it("renders svg markup into png bytes", async () => {
    const png = await renderMapPng(
      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#ffffff"/><circle cx="60" cy="60" r="30" fill="#111111"/></svg>',
    );

    expect(png.byteLength).toBeGreaterThan(0);
    expect(Array.from(png.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });
});
