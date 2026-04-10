import { describe, expect, it } from "vitest";
import { AGENT_CONFIG, agentName } from "./constants";

describe("agent constants", () => {
  it("labels the main runtime as a single Outlet Agent", () => {
    expect(agentName("boss")).toBe("Outlet Agent");
    expect(AGENT_CONFIG["think"].name).toBe("Analysis Run");
  });

  it("describes manual controls instead of a background scheduler", () => {
    expect(AGENT_CONFIG["schedule-control"].description).toContain("no background scheduler");
  });
});
