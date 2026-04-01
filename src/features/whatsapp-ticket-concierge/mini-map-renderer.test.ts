import { describe, expect, it } from "vitest";

import layoutFixture from "./fixtures/arjona-miami-layout.json";
import { renderSectionMiniMap } from "./mini-map-renderer";

describe("renderSectionMiniMap", () => {
  it("renders the highlighted section from real geometry", () => {
    const result = renderSectionMiniMap({
      layout: layoutFixture,
      highlightedSection: "114",
    });

    expect(result.svg).toContain('data-render-mode="detailed"');
    expect(result.svg).toContain('data-highlighted-section="114"');
    expect(result.svg).toContain(">STAGE<");
    expect(result.svg).toContain('data-section-id="114"');
    expect(result.svg).toContain('fill="#f59e0b"');
  });

  it("falls back to an abstract bowl when the section is missing", () => {
    const result = renderSectionMiniMap({
      layout: layoutFixture,
      highlightedSection: "999",
    });

    expect(result.svg).toContain('data-render-mode="abstract"');
    expect(result.svg).toContain('data-highlighted-section="999"');
    expect(result.svg).toContain(">STAGE<");
    expect(result.svg).toContain("Approximate section area");
  });
});
