import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Since the agent has its own node_modules, mocking node-cron from the root
// test context doesn't intercept the module as resolved from agent/src/.
// Instead, we verify the scheduler source code directly to confirm:
// 1. cron.schedule() calls are uncommented and active
// 2. The disabled comments are removed
// 3. The correct log message is present

const schedulerPath = resolve(__dirname, "../agent/src/scheduler.ts");
const schedulerSrc = readFileSync(schedulerPath, "utf8");

describe("scheduler – startScheduler() cron jobs are enabled", () => {
  it("has 5 uncommented cron.schedule() calls", () => {
    const activeScheduleCalls = schedulerSrc
      .split("\n")
      .filter((line) => /^\s+cron\.schedule\(/.test(line));

    expect(activeScheduleCalls).toHaveLength(5);
  });

  it("registers HEARTBEAT_CRON", () => {
    expect(schedulerSrc).toContain("cron.schedule(HEARTBEAT_CRON");
  });

  it("registers CHECK_CRON", () => {
    expect(schedulerSrc).toContain("cron.schedule(CHECK_CRON");
  });

  it("registers META_CRON", () => {
    expect(schedulerSrc).toContain("cron.schedule(META_CRON");
  });

  it("registers THINK_CRON", () => {
    expect(schedulerSrc).toContain("cron.schedule(THINK_CRON");
  });

  it("registers DISCORD_HEALTH_CRON", () => {
    expect(schedulerSrc).toContain("cron.schedule(DISCORD_HEALTH_CRON");
  });

  it("has no commented-out cron.schedule() calls", () => {
    const commentedScheduleCalls = schedulerSrc
      .split("\n")
      .filter((line) => /^\s*\/\/\s*cron\.schedule\(/.test(line));

    expect(commentedScheduleCalls).toHaveLength(0);
  });

  it("does not contain the DISABLED comment", () => {
    expect(schedulerSrc).not.toContain("ALL CRON JOBS ARE DISABLED");
    expect(schedulerSrc).not.toContain("DISABLED: Do not auto-run anything");
  });

  it("logs the correct startup message", () => {
    expect(schedulerSrc).toContain(
      '[scheduler] All scheduled jobs started'
    );
  });

  it("does not log the old disabled message", () => {
    expect(schedulerSrc).not.toContain("All scheduled jobs DISABLED");
  });

  it("imports cron from node-cron (not unused)", () => {
    const importLine = schedulerSrc
      .split("\n")
      .find((line) => line.includes('from "node-cron"'));

    expect(importLine).toBeDefined();
    // Should not be commented out
    expect(importLine).not.toMatch(/^\s*\/\//);
  });
});
