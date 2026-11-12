import { US_FEDERAL, US_PAYROLL } from "@/data/tax/2026/rules";
import { cents, progressiveTax } from "./progressive";

export interface UsTaxes {
  federalIncomeTax: number;
  socialSecurity: number;
  medicare: number;
}

/** Single filer, standard deduction, employee only. */
export function usFederalAndPayroll(gross: number, preTaxRetirement: number): UsTaxes {
  const taxable = Math.max(
    0,
    gross - preTaxRetirement - US_FEDERAL.standardDeductionSingle,
  );
  const federalIncomeTax = progressiveTax(taxable, [...US_FEDERAL.singleBrackets]);

  // Employee 401k deferrals reduce income tax but NOT FICA wages.
  const socialSecurity =
    Math.min(gross, US_PAYROLL.socialSecurityWageBase) * US_PAYROLL.socialSecurityRate;
  const medicare =
    gross * US_PAYROLL.medicareRate +
    Math.max(0, gross - US_PAYROLL.additionalMedicareThresholdSingle) *
      US_PAYROLL.additionalMedicareRate;

  return {
    federalIncomeTax: cents(federalIncomeTax),
    socialSecurity: cents(socialSecurity),
    medicare: cents(medicare),
  };
}
