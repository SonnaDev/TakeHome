import type { Bracket } from "./rules";

export const CA_FEDERAL_RULES = {
  // CRA 2026 indexation factor 1.020 (2.0%) and tax brackets
  source:
    "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts.html",
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
  // Line 31260 Canada employment amount (max credit base for employees)
  canadaEmploymentAmountMax: 1_501,
} as const;

export const CA_PAYROLL_RULES = {
  // canada.ca CPP contributions and EI rates for 2026
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

export const CA_ON_RULES = {
  source: "https://www.ontario.ca/page/ontario-health-premium",
  bracketsSource:
    "https://www.canada.ca/en/revenue-agency/services/forms-publications/tax-packages-years/general-income-tax-benefit-package/ontario.html",
  brackets: [
    { upTo: 53_891, rate: 0.0505 },
    { upTo: 107_785, rate: 0.0915 },
    { upTo: 150_000, rate: 0.1116 },
    { upTo: 220_000, rate: 0.1216 },
    { upTo: Infinity, rate: 0.1316 },
  ] as Bracket[],
  basicPersonalAmount: 12_989,
  creditRate: 0.0505,
  // Ontario surtaxes apply to basic provincial tax
  surtaxThreshold1: 5_818,
  surtaxRate1: 0.2,
  surtaxThreshold2: 7_446,
  surtaxRate2: 0.36,
  // Ontario Health Premium (graded brackets on taxable income)
  healthPremiumSource: "https://www.ontario.ca/page/ontario-health-premium",
} as const;

export const CA_BC_RULES = {
  source: "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal/tax-rates",
  brackets: [
    { upTo: 50_363, rate: 0.056 },
    { upTo: 100_728, rate: 0.077 },
    { upTo: 115_648, rate: 0.105 },
    { upTo: 140_430, rate: 0.1229 },
    { upTo: 190_405, rate: 0.147 },
    { upTo: 265_545, rate: 0.168 },
    { upTo: Infinity, rate: 0.205 },
  ] as Bracket[],
  basicPersonalAmount: 13_216,
  creditRate: 0.056,
  // BC Tax Reduction credit for low-to-middle income
  taxReductionMax: 690,
  taxReductionThreshold: 25_570,
  taxReductionClawbackRate: 0.0356,
} as const;

export const CA_AB_RULES = {
  source: "https://www.alberta.ca/personal-income-tax",
  brackets: [
    { upTo: 61_200, rate: 0.08 },
    { upTo: 154_259, rate: 0.1 },
    { upTo: 185_111, rate: 0.12 },
    { upTo: 246_813, rate: 0.13 },
    { upTo: 370_220, rate: 0.14 },
    { upTo: Infinity, rate: 0.15 },
  ] as Bracket[],
  basicPersonalAmount: 22_769,
  creditRate: 0.08,
} as const;
