import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { toSlug } from "./to-slug.js";

describe("toSlug", () => {
  it("converts a simple name to lowercase underscore slug", () => {
    assert.equal(toSlug("Zamora Presents"), "zamora_presents");
  });

  it("handles multiple spaces and special characters", () => {
    assert.equal(toSlug("Happy   Paws!!"), "happy_paws");
  });

  it("strips leading and trailing underscores", () => {
    assert.equal(toSlug("  --Hello World--  "), "hello_world");
  });

  it("returns empty string for empty input", () => {
    assert.equal(toSlug(""), "");
  });

  it("preserves numbers", () => {
    assert.equal(toSlug("Studio 54 Live"), "studio_54_live");
  });

  it("handles single word", () => {
    assert.equal(toSlug("Kybba"), "kybba");
  });

  it("collapses consecutive separators into one underscore", () => {
    assert.equal(toSlug("one---two___three"), "one_two_three");
  });
});
