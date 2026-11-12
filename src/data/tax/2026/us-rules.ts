import type { Bracket } from "./rules";

export const US_FEDERAL_RULES = {
  // IRS Rev. Proc. 2025-32 inflation adjustments for tax year 2026
  source: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026",
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

export const US_PAYROLL_RULES = {
  // SSA contribution and benefit base: https://www.ssa.gov/oact/cola/cbb.html
  source: "https://www.ssa.gov/oact/cola/cbb.html",
  socialSecurityWageBase: 184_500,
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThresholdSingle: 200_000,
} as const;

export const US_CA_RULES = {
  // California FTB 2026 tax rate schedules and exemption credits
  source: "https://www.ftb.ca.gov/forms/search/index.html",
  sdiSource: "https://edd.ca.gov/en/disability/",
  singleBrackets: [
    { upTo: 11_456, rate: 0.01 },
    { upTo: 27_157, rate: 0.02 },
    { upTo: 42_861, rate: 0.04 },
    { upTo: 59_498, rate: 0.06 },
    { upTo: 75_197, rate: 0.08 },
    { upTo: 384_109, rate: 0.093 },
    { upTo: 460_927, rate: 0.103 },
    { upTo: 768_213, rate: 0.113 },
    { upTo: Infinity, rate: 0.123 },
  ] as Bracket[],
  standardDeductionSingle: 5_900,
  exemptionCreditSingle: 158,
  // 1% Mental Health Services Tax on taxable income in excess of $1,000,000
  mentalHealthThreshold: 1_000_000,
  mentalHealthRate: 0.01,
  // California SDI employee withholding rate (SB 951 eliminated taxable wage limit)
  sdiRate: 0.012,
} as const;

export const US_NY_RULES = {
  // New York State Dept of Taxation & Finance Form IT-201
  source: "https://www.tax.ny.gov/pit/file/tax_tables.htm",
  pflSource: "https://paidfamilyleave.ny.gov/cost",
  singleBrackets: [
    { upTo: 8_500, rate: 0.04 },
    { upTo: 11_700, rate: 0.045 },
    { upTo: 13_900, rate: 0.0525 },
    { upTo: 80_650, rate: 0.055 },
    { upTo: 215_400, rate: 0.06 },
    { upTo: 1_077_550, rate: 0.0685 },
    { upTo: 5_000_000, rate: 0.0965 },
    { upTo: 25_000_000, rate: 0.103 },
    { upTo: Infinity, rate: 0.109 },
  ] as Bracket[],
  standardDeductionSingle: 8_000,
  // NY PFL employee contribution rate: 0.388% with annual cap $354.53
  pflRate: 0.00388,
  pflAnnualCap: 354.53,
  // Statutory NY SDI employee contribution: $0.60 per week ($31.20 per year)
  sdiAnnualFlat: 31.2,
} as const;

export const US_IL_RULES = {
  // Illinois Dept of Revenue Form IL-1040
  source: "https://tax.illinois.gov/research/taxrates/individual.html",
  flatRate: 0.0495,
  standardExemption: 2_925,
} as const;

export const US_MA_RULES = {
  // Massachusetts Dept of Revenue Form 1
  source: "https://www.mass.gov/info-details/massachusetts-tax-rates",
  pfmlSource: "https://www.mass.gov/info-details/paid-family-and-medical-leave-pfml-overview-and-benefits",
  flatRate: 0.05,
  personalExemptionSingle: 4_400,
  // 4% surtax on taxable income exceeding indexed threshold
  millionaireSurtaxThreshold: 1_107_750,
  millionaireSurtaxRate: 0.04,
  // MA PFML employee rate up to SSA wage base
  pfmlRate: 0.0046,
  pfmlWageBase: 184_500,
} as const;

export const US_CO_RULES = {
  // Colorado Dept of Revenue
  source: "https://tax.colorado.gov/individual-income-tax-guide",
  famliSource: "https://famli.colorado.gov/",
  flatRate: 0.044,
  // Colorado standard deduction conforms to federal standard deduction
  conformsToFederalStandardDeduction: true,
  famliRate: 0.0044,
  famliWageBase: 184_500,
} as const;

export const US_PA_RULES = {
  // Pennsylvania Dept of Revenue PA-40
  source: "https://www.revenue.pa.gov/FormsandPublications/FormsforIndividuals/PIT/Pages/default.aspx",
  ucSource: "https://www.dli.pa.gov/Individuals/Unemployment-Compensation/Pages/default.aspx",
  flatRate: 0.0307, // No standard deduction in Pennsylvania
  // PA Unemployment Compensation employee withholding rate uncapped
  ucRate: 0.0007,
} as const;

export const US_WA_RULES = {
  // Washington State (0% income tax)
  source: "https://dor.wa.gov/taxes-rates/income-tax",
  waCaresSource: "https://wacaresfund.org/how-it-works/payroll-deduction/",
  flatRate: 0,
  // WA Cares Fund employee premium rate (0.58% uncapped)
  waCaresRate: 0.0058,
} as const;
