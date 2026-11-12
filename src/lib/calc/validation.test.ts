import { describe, expect, it } from "vitest";
import { calculateTakeHome } from "./takeHome";

export interface ProfileValidation {
  id: number;
  profileName: string;
  location: string;
  gross: number;
  retirement: number;
  officialSource: "IRS" | "CRA";
  benchmarkAnnualTax: number;
}

// 30 benchmark profiles computed with official government parameters (2026)
export const VALIDATION_PROFILES: ProfileValidation[] = [
  // US Profiles (IRS Rev. Proc. 2025-32, SSA, State Revenue Departments)
  { id: 1, profileName: "Entry US (Texas, $35k)", location: "US-TX", gross: 35_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 4_697.5 },
  { id: 2, profileName: "Mid US (Texas, $75k)", location: "US-TX", gross: 75_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 13_407.5 },
  { id: 3, profileName: "Senior US (Texas, $150k)", location: "US-TX", gross: 150_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 36_209.0 },
  { id: 4, profileName: "Exec US (Texas, $300k)", location: "US-TX", gross: 300_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 84_823.25 },
  { id: 5, profileName: "Entry CA (California, $45k)", location: "US-CA", gross: 45_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 7_950.8 },
  { id: 6, profileName: "Mid CA (California, $85k)", location: "US-CA", gross: 85_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 20_908.36 },
  { id: 7, profileName: "Senior CA (California, $160k)", location: "US-CA", gross: 160_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 51_784.86 },
  { id: 8, profileName: "High CA (California, $250k)", location: "US-CA", gross: 250_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 88_678.86 },
  { id: 9, profileName: "CA with 401k (California, $120k + $15k 401k)", location: "US-CA", gross: 120_000, retirement: 15_000, officialSource: "IRS", benchmarkAnnualTax: 30_265.86 },
  { id: 10, profileName: "Entry NY (New York, $50k)", location: "US-NY", gross: 50_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 10_015.2 },
  { id: 11, profileName: "Mid NY (New York, $100k)", location: "US-NY", gross: 100_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 26_157.48 },
  { id: 12, profileName: "Senior NY (New York, $200k)", location: "US-NY", gross: 200_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 62_410.48 },
  { id: 13, profileName: "Mid WA (Washington, $110k)", location: "US-WA", gross: 110_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 24_423.0 },
  { id: 14, profileName: "Senior WA (Washington, $220k)", location: "US-WA", gross: 220_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 57_789.0 },
  { id: 15, profileName: "Mid IL (Illinois, $90k)", location: "US-IL", gross: 90_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 22_165.21 },
  { id: 16, profileName: "Mid MA (Massachusetts, $105k)", location: "US-MA", gross: 105_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 27_815.5 },
  { id: 17, profileName: "Mid CO (Colorado, $95k)", location: "US-CO", gross: 95_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 23_227.1 },
  { id: 18, profileName: "Mid PA (Pennsylvania, $80k)", location: "US-PA", gross: 80_000, retirement: 0, officialSource: "IRS", benchmarkAnnualTax: 17_402.0 },

  // Canada Profiles (CRA Payroll Deductions Online Calculator & T1 Schedules)
  { id: 19, profileName: "Entry ON (Ontario, $35k)", location: "CA-ON", gross: 35_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 5_777.17 },
  { id: 20, profileName: "Mid ON (Ontario, $65k)", location: "CA-ON", gross: 65_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 14_444.25 },
  { id: 21, profileName: "Senior ON (Ontario, $100k)", location: "CA-ON", gross: 100_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 25_793.87 },
  { id: 22, profileName: "High ON (Ontario, $180k)", location: "CA-ON", gross: 180_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 59_153.41 },
  { id: 23, profileName: "Exec ON (Ontario, $300k)", location: "CA-ON", gross: 300_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 119_863.2 },
  { id: 24, profileName: "ON with RRSP (Ontario, $120k + $10k RRSP)", location: "CA-ON", gross: 120_000, retirement: 10_000, officialSource: "CRA", benchmarkAnnualTax: 28_968.11 },
  { id: 25, profileName: "Entry BC (British Columbia, $40k)", location: "CA-BC", gross: 40_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 6_667.5 },
  { id: 26, profileName: "Mid BC (British Columbia, $80k)", location: "CA-BC", gross: 80_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 18_843.04 },
  { id: 27, profileName: "Senior BC (British Columbia, $150k)", location: "CA-BC", gross: 150_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 42_623.44 },
  { id: 28, profileName: "Entry AB (Alberta, $45k)", location: "CA-AB", gross: 45_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 8_063.21 },
  { id: 29, profileName: "Mid AB (Alberta, $90k)", location: "CA-AB", gross: 90_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 22_491.5 },
  { id: 30, profileName: "Senior AB (Alberta, $170k)", location: "CA-AB", gross: 170_000, retirement: 0, officialSource: "CRA", benchmarkAnnualTax: 50_034.32 },
];

describe("30 validation profiles against official benchmarks", () => {
  it.each(VALIDATION_PROFILES)(
    "Profile $id: $profileName matches within 1% or $50",
    (p) => {
      const res = calculateTakeHome({
        location: p.location,
        grossSalary: p.gross,
        preTaxRetirement: p.retirement,
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        const diff = Math.abs(res.totalTax - p.benchmarkAnnualTax);
        const relativeDiff = diff / p.benchmarkAnnualTax;
        const withinTolerance = diff <= 50 || relativeDiff <= 0.01;
        expect(withinTolerance).toBe(true);
      }
    },
  );
});
