import { describe, expect, it } from "vitest";
import { matchesConversationKinds } from "@/features/conversations/server";

describe("matchesConversationKinds", () => {
  it("keeps only requested conversation surfaces", () => {
    expect(matchesConversationKinds({ kind: "asset" }, ["asset"])).toBe(true);
    expect(matchesConversationKinds({ kind: "campaign" }, ["asset"])).toBe(false);
    expect(matchesConversationKinds({ kind: "event" }, ["asset", "event"])).toBe(true);
  });
});
