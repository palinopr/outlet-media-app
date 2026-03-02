import { describe, it, expect } from "vitest";
import { toSlug } from "./to-slug";

describe("toSlug", () => {
  it("converts a simple name to lowercase underscore slug", () => {
    expect(toSlug("Zamora Presents")).toBe("zamora_presents");
  });

  it("handles multiple spaces and special characters", () => {
    expect(toSlug("Happy   Paws!!")).toBe("happy_paws");
  });

  it("strips leading and trailing underscores", () => {
    expect(toSlug("  --Hello World--  ")).toBe("hello_world");
  });

  it("returns empty string for empty input", () => {
    expect(toSlug("")).toBe("");
  });

  it("preserves numbers", () => {
    expect(toSlug("Studio 54 Live")).toBe("studio_54_live");
  });

  it("handles single word", () => {
    expect(toSlug("Kybba")).toBe("kybba");
  });

  it("collapses consecutive separators into one underscore", () => {
    expect(toSlug("one---two___three")).toBe("one_two_three");
  });
});
