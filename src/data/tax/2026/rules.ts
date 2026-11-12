/**
 * Tax year 2026 rules. Every block cites its source. Anything not verified
 * against an official source is NOT in this file; jurisdictions without
 * verified rules are marked "pending" in jurisdictions.ts and the engine
 * refuses to calculate them.
 */

export const TAX_YEAR = 2026;

export interface Bracket {
  /** Upper bound of the bracket; Infinity for the top bracket. */
  upTo: number;
  rate: number;
}

export const US_FEDERAL = {
  // IRS Rev. Proc. 2025-32, as summarized by Journal of Accountancy (Oct 2025)
  source:
    "https://www.journalofaccountancy.com/news/2025/oct/annual-inflation-adjustments-announced-for-tax-year-2026/",
  singleBrackets: [
    { upTo: 12_400, rate: 0.1 },
    { upTo: 50_400, rate: 0.12 },
    { upTo: 105_700, rate: 0.22 },
    { upTo: 201_775, rate: 0.24 },
    { upTo: 256_225, rate: 0.32 },
    { upTo: 640_600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ] as Bracket[],
  standardDeductionSingle: 16_100,
} as const;

export const US_PAYROLL = {
  // SSA contribution and benefit base: https://www.ssa.gov/oact/cola/cbb.html
  socialSecurityWageBase: 184_500,
  // Statutory rates (employee share)
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
  // Statutory, not indexed (single filer threshold)
  additionalMedicareRate: 0.009,
  additionalMedicareThresholdSingle: 200_000,
} as const;

export const CA_FEDERAL = {
  // CRA 2026 figures as reported by BNN Bloomberg (Dec 2025); confirm on canada.ca before launch
  source:
    "https://www.bnnbloomberg.ca/business/economics/2025/12/01/heres-how-much-you-will-be-taxed-in-2026-canada-revenue-agency/",
  brackets: [
    { upTo: 58_523, rate: 0.14 },
    { upTo: 117_045, rate: 0.205 },
    { upTo: 181_440, rate: 0.26 },
    { upTo: 258_482, rate: 0.29 },
    { upTo: Infinity, rate: 0.33 },
  ] as Bracket[],
  creditRate: 0.14,
  basicPersonalAmountMax: 16_452,
  basicPersonalAmountMin: 14_829,
  bpaPhaseOutStart: 181_440,
  bpaPhaseOutEnd: 258_482,
} as const;

export const CA_PAYROLL = {
  // canada.ca CPP contributions page and fedratecalc.com summary
  source: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/contributions.html",
  cppBasicExemption: 3_500,
  cppYmpe: 74_600,
  cppYampe: 85_000,
  cppBaseRate: 0.0495, // creditable portion
  cppEnhancedRate: 0.01, // deductible portion
  cpp2Rate: 0.04, // deductible
  eiMaxInsurableEarnings: 68_900,
  eiRate: 0.0163, // outside Quebec
} as const;
