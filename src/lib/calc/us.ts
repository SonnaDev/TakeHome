import {
  US_CA_RULES,
  US_CO_RULES,
  US_FEDERAL_RULES,
  US_IL_RULES,
  US_MA_RULES,
  US_NY_RULES,
  US_PA_RULES,
  US_PAYROLL_RULES,
  US_WA_RULES,
} from "@/data/tax/2026/rules";
import { cents, progressiveTax } from "./progressive";
import type { TaxLine } from "./types";

export interface UsTaxes {
  federalIncomeTax: number;
  socialSecurity: number;
  medicare: number;
}

/** Single filer, standard deduction, employee only (2026). */
export function usFederalAndPayroll(gross: number, preTaxRetirement: number): UsTaxes {
  const taxable = Math.max(
    0,
    gross - preTaxRetirement - US_FEDERAL_RULES.standardDeductionSingle,
  );
  const federalIncomeTax = progressiveTax(taxable, [...US_FEDERAL_RULES.singleBrackets]);

  // Employee 401k deferrals reduce income tax but NOT FICA wages.
  const socialSecurity =
    Math.min(gross, US_PAYROLL_RULES.socialSecurityWageBase) *
    US_PAYROLL_RULES.socialSecurityRate;
  const medicare =
    gross * US_PAYROLL_RULES.medicareRate +
    Math.max(0, gross - US_PAYROLL_RULES.additionalMedicareThresholdSingle) *
      US_PAYROLL_RULES.additionalMedicareRate;

  return {
    federalIncomeTax: cents(federalIncomeTax),
    socialSecurity: cents(socialSecurity),
    medicare: cents(medicare),
  };
}

export interface UsStateResult {
  taxLines: TaxLine[];
  stateTaxTotal: number;
}

/**
 * Calculate state income tax and employee payroll contributions for verified US states.
 */
export function usStateAndPayroll(
  jurisdictionCode: string,
  gross: number,
  preTaxRetirement: number,
): UsStateResult {
  if (jurisdictionCode === "US-CA") {
    // 401(k) contributions are deductible from CA taxable income
    const taxableIncome = Math.max(
      0,
      gross - preTaxRetirement - US_CA_RULES.standardDeductionSingle,
    );
    const baseTax = progressiveTax(taxableIncome, [...US_CA_RULES.singleBrackets]);
    const taxAfterCredit = Math.max(0, baseTax - US_CA_RULES.exemptionCreditSingle);

    // Mental Health Services Tax: 1% on taxable income over $1,000,000
    const mentalHealth =
      Math.max(0, taxableIncome - US_CA_RULES.mentalHealthThreshold) *
      US_CA_RULES.mentalHealthRate;

    const caStateTax = cents(taxAfterCredit + mentalHealth);
    const caSdi = cents(gross * US_CA_RULES.sdiRate);

    return {
      taxLines: [
        { label: "California state income tax", amount: caStateTax },
        { label: "California SDI", amount: caSdi },
      ],
      stateTaxTotal: cents(caStateTax + caSdi),
    };
  }

  if (jurisdictionCode === "US-NY") {
    const taxableIncome = Math.max(
      0,
      gross - preTaxRetirement - US_NY_RULES.standardDeductionSingle,
    );
    const nyTax = cents(progressiveTax(taxableIncome, [...US_NY_RULES.singleBrackets]));
    const nyPfl = cents(
      Math.min(gross * US_NY_RULES.pflRate, US_NY_RULES.pflAnnualCap),
    );
    const nySdi = US_NY_RULES.sdiAnnualFlat;

    return {
      taxLines: [
        { label: "New York state income tax", amount: nyTax },
        { label: "NY Paid Family Leave (PFL)", amount: nyPfl },
        { label: "NY Disability Insurance (SDI)", amount: nySdi },
      ],
      stateTaxTotal: cents(nyTax + nyPfl + nySdi),
    };
  }

  if (jurisdictionCode === "US-IL") {
    const taxableIncome = Math.max(
      0,
      gross - preTaxRetirement - US_IL_RULES.standardExemption,
    );
    const ilTax = cents(taxableIncome * US_IL_RULES.flatRate);

    return {
      taxLines: [{ label: "Illinois state income tax", amount: ilTax }],
      stateTaxTotal: ilTax,
    };
  }

  if (jurisdictionCode === "US-MA") {
    const taxableIncome = Math.max(
      0,
      gross - preTaxRetirement - US_MA_RULES.personalExemptionSingle,
    );
    const baseTax = taxableIncome * US_MA_RULES.flatRate;
    const surtax =
      Math.max(0, taxableIncome - US_MA_RULES.millionaireSurtaxThreshold) *
      US_MA_RULES.millionaireSurtaxRate;
    const maTax = cents(baseTax + surtax);

    const pfmlCoveredWages = Math.min(gross, US_MA_RULES.pfmlWageBase);
    const maPfml = cents(pfmlCoveredWages * US_MA_RULES.pfmlRate);

    return {
      taxLines: [
        { label: "Massachusetts state income tax", amount: maTax },
        { label: "MA PFML", amount: maPfml },
      ],
      stateTaxTotal: cents(maTax + maPfml),
    };
  }

  if (jurisdictionCode === "US-CO") {
    // Colorado conforms to federal standard deduction
    const taxableIncome = Math.max(
      0,
      gross - preTaxRetirement - US_FEDERAL_RULES.standardDeductionSingle,
    );
    const coTax = cents(taxableIncome * US_CO_RULES.flatRate);
    const famliCoveredWages = Math.min(gross, US_CO_RULES.famliWageBase);
    const coFamli = cents(famliCoveredWages * US_CO_RULES.famliRate);

    return {
      taxLines: [
        { label: "Colorado state income tax", amount: coTax },
        { label: "CO FAMLI", amount: coFamli },
      ],
      stateTaxTotal: cents(coTax + coFamli),
    };
  }

  if (jurisdictionCode === "US-PA") {
    // Pennsylvania does not allow standard deductions on gross compensation
    const taxableIncome = Math.max(0, gross - preTaxRetirement);
    const paTax = cents(taxableIncome * US_PA_RULES.flatRate);
    const paUc = cents(gross * US_PA_RULES.ucRate);

    return {
      taxLines: [
        { label: "Pennsylvania state income tax", amount: paTax },
        { label: "PA Unemployment Compensation", amount: paUc },
      ],
      stateTaxTotal: cents(paTax + paUc),
    };
  }

  if (jurisdictionCode === "US-WA") {
    const waCares = cents(gross * US_WA_RULES.waCaresRate);
    return {
      taxLines: [{ label: "WA Cares Fund", amount: waCares }],
      stateTaxTotal: waCares,
    };
  }

  // Pure no-tax states (TX, FL, NV, AK, SD, TN, WY, NH)
  return {
    taxLines: [],
    stateTaxTotal: 0,
  };
}
