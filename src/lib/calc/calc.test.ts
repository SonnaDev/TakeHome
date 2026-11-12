import { describe, expect, it } from "vitest";
import { progressiveTax } from "./progressive";
import { usFederalAndPayroll } from "./us";
import { basicPersonalAmount, caFederalTax, caPayroll } from "./ca";
import { calculateTakeHome } from "./takeHome";
import { US_FEDERAL } from "@/data/tax/2026/rules";

describe("progressiveTax", () => {
  it("returns 0 for zero or negative income", () => {
    expect(progressiveTax(0, [...US_FEDERAL.singleBrackets])).toBe(0);
    expect(progressiveTax(-5, [...US_FEDERAL.singleBrackets])).toBe(0);
  });
  it("taxes each bracket at its own rate", () => {
    // 10% of 12,400 + 12% of 38,000 + 22% of 33,500 (hand calculated)
    expect(progressiveTax(83_900, [...US_FEDERAL.singleBrackets])).toBeCloseTo(13_170, 2);
  });
});

describe("US federal + payroll (single, 2026)", () => {
  it("matches the hand calculation for $100,000", () => {
    const t = usFederalAndPayroll(100_000, 0);
    expect(t.federalIncomeTax).toBeCloseTo(13_170, 2);
    expect(t.socialSecurity).toBeCloseTo(6_200, 2);
    expect(t.medicare).toBeCloseTo(1_450, 2);
  });
  it("caps Social Security at the wage base", () => {
    expect(usFederalAndPayroll(300_000, 0).socialSecurity).toBeCloseTo(184_500 * 0.062, 2);
  });
  it("adds the additional Medicare tax above $200,000", () => {
    expect(usFederalAndPayroll(250_000, 0).medicare).toBeCloseTo(250_000 * 0.0145 + 50_000 * 0.009, 2);
  });
  it("401k reduces income tax but not FICA", () => {
    const base = usFederalAndPayroll(100_000, 0);
    const k = usFederalAndPayroll(100_000, 10_000);
    expect(k.federalIncomeTax).toBeLessThan(base.federalIncomeTax);
    expect(k.socialSecurity).toBe(base.socialSecurity);
    expect(k.medicare).toBe(base.medicare);
  });
});

describe("Canada payroll and federal (2026)", () => {
  it("reaches the published CPP and EI maximums at $100,000", () => {
    const p = caPayroll(100_000);
    expect(p.cppBase + p.cppEnhanced).toBeCloseTo(4_230.45, 2);
    expect(p.cpp2).toBeCloseTo(416, 2);
    expect(p.ei).toBeCloseTo(1_123.07, 2);
  });
  it("phases the basic personal amount down between thresholds", () => {
    expect(basicPersonalAmount(100_000)).toBe(16_452);
    expect(basicPersonalAmount(300_000)).toBe(14_829);
    const mid = basicPersonalAmount((181_440 + 258_482) / 2);
    expect(mid).toBeGreaterThan(14_829);
    expect(mid).toBeLessThan(16_452);
  });
  it("matches the hand calculation for $100,000 federal tax", () => {
    const p = caPayroll(100_000);
    expect(caFederalTax(100_000, 0, p)).toBeCloseTo(13_511.74, 0);
  });
  it("never returns negative federal tax", () => {
    expect(caFederalTax(10_000, 0, caPayroll(10_000))).toBe(0);
  });
});

describe("calculateTakeHome", () => {
  it("computes Texas take-home for $100,000", () => {
    const r = calculateTakeHome({ location: "US-TX", grossSalary: 100_000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.takeHome).toBeCloseTo(79_180, 2);
      expect(r.currency).toBe("USD");
    }
  });
  it("refuses jurisdictions whose rules are not verified", () => {
    for (const code of ["US-CA", "CA-ON"]) {
      const r = calculateTakeHome({ location: code, grossSalary: 100_000 });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.reason).toBe("pending-rules");
    }
  });
  it("rejects unknown locations and bad input", () => {
    const a = calculateTakeHome({ location: "XX", grossSalary: 50_000 });
    expect(!a.ok && a.reason).toBe("unknown-location");
    const b = calculateTakeHome({ location: "US-TX", grossSalary: -1 });
    expect(!b.ok && b.reason).toBe("invalid-input");
    const c = calculateTakeHome({ location: "US-TX", grossSalary: 50_000, preTaxRetirement: 60_000 });
    expect(!c.ok && c.reason).toBe("invalid-input");
  });
});
