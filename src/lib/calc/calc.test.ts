import { describe, expect, it } from "vitest";
import { progressiveTax } from "./progressive";
import { usFederalAndPayroll, usStateAndPayroll } from "./us";
import {
  basicPersonalAmount,
  caFederalTax,
  caPayroll,
  caProvincialTax,
  ontarioHealthPremium,
} from "./ca";
import { calculateTakeHome } from "./takeHome";
import { US_FEDERAL_RULES } from "@/data/tax/2026/rules";

describe("progressiveTax", () => {
  it("returns 0 for zero or negative income", () => {
    expect(progressiveTax(0, [...US_FEDERAL_RULES.singleBrackets])).toBe(0);
    expect(progressiveTax(-5, [...US_FEDERAL_RULES.singleBrackets])).toBe(0);
  });
  it("taxes each bracket at its own rate", () => {
    // 10% of 12,400 + 12% of 38,000 + 22% of 33,500 (hand calculated)
    expect(progressiveTax(83_900, [...US_FEDERAL_RULES.singleBrackets])).toBeCloseTo(13_170, 2);
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
    expect(usFederalAndPayroll(250_000, 0).medicare).toBeCloseTo(
      250_000 * 0.0145 + 50_000 * 0.009,
      2,
    );
  });
  it("401k reduces income tax but not FICA", () => {
    const base = usFederalAndPayroll(100_000, 0);
    const k = usFederalAndPayroll(100_000, 10_000);
    expect(k.federalIncomeTax).toBeLessThan(base.federalIncomeTax);
    expect(k.socialSecurity).toBe(base.socialSecurity);
    expect(k.medicare).toBe(base.medicare);
  });
});

describe("US verified state taxes & payroll items (2026)", () => {
  it("California: $100k standard deduction, brackets, exemption credit, and SDI", () => {
    const r = usStateAndPayroll("US-CA", 100_000, 0);
    expect(r.taxLines[0].label).toBe("California state income tax");
    expect(r.taxLines[0].amount).toBeCloseTo(4_910.86, 1);
    expect(r.taxLines[1].label).toBe("California SDI");
    expect(r.taxLines[1].amount).toBeCloseTo(1_200.0, 2);
    expect(r.stateTaxTotal).toBeCloseTo(6_110.86, 1);
  });

  it("California: applies 1% mental health surcharge above $1,000,000", () => {
    const r = usStateAndPayroll("US-CA", 1_500_000, 0);
    // Taxable = 1,500,000 - 5,900 = 1,494,100
    // Mental health on 494,100 = 4,941.00
    expect(r.taxLines[0].amount).toBeGreaterThan(150_000);
  });

  it("New York: $100k standard deduction, progressive tax, NY PFL and SDI", () => {
    const r = usStateAndPayroll("US-NY", 100_000, 0);
    expect(r.taxLines[0].label).toBe("New York state income tax");
    expect(r.taxLines[0].amount).toBeCloseTo(4_951.75, 1);
    expect(r.taxLines[1].label).toBe("NY Paid Family Leave (PFL)");
    expect(r.taxLines[1].amount).toBeCloseTo(354.53, 2);
    expect(r.taxLines[2].label).toBe("NY Disability Insurance (SDI)");
    expect(r.taxLines[2].amount).toBeCloseTo(31.2, 2);
  });

  it("Illinois: flat 4.95% after $2,925 standard exemption", () => {
    const r = usStateAndPayroll("US-IL", 100_000, 0);
    expect(r.taxLines[0].amount).toBeCloseTo(4_805.21, 2);
  });

  it("Massachusetts: 5% flat + MA PFML", () => {
    const r = usStateAndPayroll("US-MA", 100_000, 0);
    expect(r.taxLines[0].amount).toBeCloseTo(4_780.0, 2);
    expect(r.taxLines[1].amount).toBeCloseTo(460.0, 2);
  });

  it("Colorado: 4.4% flat after federal standard deduction + FAMLI", () => {
    const r = usStateAndPayroll("US-CO", 100_000, 0);
    expect(r.taxLines[0].amount).toBeCloseTo(3_691.6, 2);
    expect(r.taxLines[1].amount).toBeCloseTo(440.0, 2);
  });

  it("Pennsylvania: 3.07% flat on gross + 0.07% PA UC", () => {
    const r = usStateAndPayroll("US-PA", 100_000, 0);
    expect(r.taxLines[0].amount).toBeCloseTo(3_070.0, 2);
    expect(r.taxLines[1].amount).toBeCloseTo(70.0, 2);
  });

  it("Washington: 0% income tax + 0.58% WA Cares Fund", () => {
    const r = usStateAndPayroll("US-WA", 100_000, 0);
    expect(r.taxLines[0].label).toBe("WA Cares Fund");
    expect(r.taxLines[0].amount).toBeCloseTo(580.0, 2);
  });

  it("Texas: 0% state income tax and $0 state deductions", () => {
    const r = usStateAndPayroll("US-TX", 100_000, 0);
    expect(r.taxLines.length).toBe(0);
    expect(r.stateTaxTotal).toBe(0);
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
  it("matches the hand calculation for $100,000 federal tax including CEA credit", () => {
    const p = caPayroll(100_000);
    expect(caFederalTax(100_000, 0, p)).toBeCloseTo(13_301.6, 1);
  });
  it("never returns negative federal tax", () => {
    expect(caFederalTax(10_000, 0, caPayroll(10_000))).toBe(0);
  });
});

describe("Canada verified provincial taxes (2026)", () => {
  it("Ontario Health Premium tiers", () => {
    expect(ontarioHealthPremium(15_000)).toBe(0);
    expect(ontarioHealthPremium(25_000)).toBe(300);
    expect(ontarioHealthPremium(35_000)).toBe(300);
    expect(ontarioHealthPremium(45_000)).toBe(450);
    expect(ontarioHealthPremium(60_000)).toBe(600);
    expect(ontarioHealthPremium(100_000)).toBe(750);
    expect(ontarioHealthPremium(250_000)).toBe(900);
  });

  it("Ontario: $100k provincial tax with basic amount, surtax and OHP", () => {
    const p = caPayroll(100_000);
    const r = caProvincialTax("CA-ON", 100_000, 0, p);
    expect(r.taxLines[0].label).toBe("Ontario provincial income tax");
    expect(r.taxLines[0].amount).toBeCloseTo(5_972.75, 1);
    expect(r.taxLines[1].label).toBe("Ontario Health Premium");
    expect(r.taxLines[1].amount).toBe(750);
    expect(r.provincialTaxTotal).toBeCloseTo(6_722.75, 1);
  });

  it("British Columbia: $100k provincial tax with brackets and credits", () => {
    const p = caPayroll(100_000);
    const r = caProvincialTax("CA-BC", 100_000, 0, p);
    expect(r.taxLines[0].label).toBe("British Columbia provincial tax");
    expect(r.taxLines[0].amount).toBeCloseTo(5_555.52, 1);
  });

  it("Alberta: $100k provincial tax with 8% lowest bracket and high BPA", () => {
    const p = caPayroll(100_000);
    const r = caProvincialTax("CA-AB", 100_000, 0, p);
    expect(r.taxLines[0].label).toBe("Alberta provincial tax");
    expect(r.taxLines[0].amount).toBeCloseTo(6_470.38, 1);
  });
});

describe("calculateTakeHome", () => {
  it("computes Texas take-home for $100,000", () => {
    const r = calculateTakeHome({ location: "US-TX", grossSalary: 100_000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.takeHome).toBeCloseTo(79_180, 2);
      expect(r.currency).toBe("USD");
      expect(r.lines.length).toBe(3);
    }
  });

  it("computes California take-home for $100,000", () => {
    const r = calculateTakeHome({ location: "US-CA", grossSalary: 100_000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.currency).toBe("USD");
      expect(r.lines.some((l) => l.label === "California state income tax")).toBe(true);
      expect(r.lines.some((l) => l.label === "California SDI")).toBe(true);
      expect(r.takeHome).toBeCloseTo(100_000 - 20_820 - 6_110.86, 1);
    }
  });

  it("computes Ontario take-home for $100,000", () => {
    const r = calculateTakeHome({ location: "CA-ON", grossSalary: 100_000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.currency).toBe("CAD");
      expect(r.lines.some((l) => l.label === "Ontario Health Premium")).toBe(true);
      // Total tax = Fed (13,301.60) + CPP (4,646.45) + EI (1,123.07) + ON (6,722.75) = 25,793.87
      expect(r.takeHome).toBeCloseTo(100_000 - 25_793.87, 1);
    }
  });

  it("computes British Columbia take-home for $100,000", () => {
    const r = calculateTakeHome({ location: "CA-BC", grossSalary: 100_000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.currency).toBe("CAD");
      expect(r.takeHome).toBeCloseTo(100_000 - (13_301.6 + 4_646.45 + 1_123.07 + 5_555.52), 1);
    }
  });

  it("computes Alberta take-home for $100,000", () => {
    const r = calculateTakeHome({ location: "CA-AB", grossSalary: 100_000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.currency).toBe("CAD");
      expect(r.takeHome).toBeCloseTo(100_000 - (13_301.6 + 4_646.45 + 1_123.07 + 6_470.38), 1);
    }
  });

  it("refuses jurisdictions whose rules are still pending", () => {
    for (const code of ["US-CT", "CA-QC"]) {
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
    const c = calculateTakeHome({
      location: "US-TX",
      grossSalary: 50_000,
      preTaxRetirement: 60_000,
    });
    expect(!c.ok && c.reason).toBe("invalid-input");
  });
});
