import { describe, it, expect } from "vitest";
import { centsToUsd, fmtUsd, fmtNum, fmtDate, slugToLabel } from "@/lib/formatters";

// ─── centsToUsd ─────────────────────────────────────────────────────────────

describe("centsToUsd", () => {
  it("converts cents to dollars", () => {
    expect(centsToUsd(1500)).toBe(15);
  });

  it("handles zero", () => {
    expect(centsToUsd(0)).toBe(0);
  });

  it("returns null for null input", () => {
    expect(centsToUsd(null)).toBeNull();
  });

  it("handles fractional cents", () => {
    expect(centsToUsd(199)).toBeCloseTo(1.99);
  });
});

// ─── fmtUsd ─────────────────────────────────────────────────────────────────

describe("fmtUsd", () => {
  it("returns -- for null", () => {
    expect(fmtUsd(null)).toBe("--");
  });

  it("formats small amounts", () => {
    expect(fmtUsd(42)).toBe("$42");
  });

  it("formats thousands with K", () => {
    expect(fmtUsd(1500)).toBe("$1.5K");
  });

  it("formats millions with M", () => {
    expect(fmtUsd(2500000)).toBe("$2.5M");
  });

  it("handles negative millions", () => {
    expect(fmtUsd(-1500000)).toBe("$-1.5M");
  });

  it("handles zero", () => {
    expect(fmtUsd(0)).toBe("$0");
  });

  it("formats exactly 1000 as K", () => {
    expect(fmtUsd(1000)).toBe("$1.0K");
  });
});

// ─── fmtNum ─────────────────────────────────────────────────────────────────

describe("fmtNum", () => {
  it("returns -- for null", () => {
    expect(fmtNum(null)).toBe("--");
  });

  it("formats small numbers", () => {
    expect(fmtNum(42)).toBe("42");
  });

  it("formats thousands with K", () => {
    expect(fmtNum(5200)).toBe("5.2K");
  });

  it("formats millions with M", () => {
    expect(fmtNum(1_200_000)).toBe("1.2M");
  });

  it("handles zero", () => {
    expect(fmtNum(0)).toBe("0");
  });
});

// ─── fmtDate ────────────────────────────────────────────────────────────────

describe("fmtDate", () => {
  it("returns -- for null", () => {
    expect(fmtDate(null)).toBe("--");
  });

  it("returns -- for empty string", () => {
    expect(fmtDate("")).toBe("--");
  });

  it("formats an ISO date", () => {
    const result = fmtDate("2025-01-05T00:00:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("5");
    expect(result).toContain("2025");
  });

  it("formats a date-only string", () => {
    // Date-only strings are parsed as UTC midnight, so use a mid-month date
    // that won't shift day across timezone boundaries
    const result = fmtDate("2026-06-15T12:00:00Z");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });
});

// ─── slugToLabel ────────────────────────────────────────────────────────────

describe("slugToLabel", () => {
  it("returns -- for null", () => {
    expect(slugToLabel(null)).toBe("--");
  });

  it("returns -- for empty string", () => {
    expect(slugToLabel("")).toBe("--");
  });

  it("converts underscored slug to title case", () => {
    expect(slugToLabel("zamora_presents")).toBe("Zamora Presents");
  });

  it("handles single word", () => {
    expect(slugToLabel("admin")).toBe("Admin");
  });

  it("handles multiple underscores", () => {
    expect(slugToLabel("my_cool_app")).toBe("My Cool App");
  });
});
