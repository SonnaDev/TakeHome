import {
  CA_AB_RULES,
  CA_BC_RULES,
  CA_FEDERAL_RULES,
  CA_ON_RULES,
  CA_PAYROLL_RULES,
} from "@/data/tax/2026/rules";
import { cents, progressiveTax } from "./progressive";
import type { TaxLine } from "./types";

export interface CaPayroll {
  cppBase: number; // creditable portion
  cppEnhanced: number; // deductible portion
  cpp2: number; // deductible
  ei: number;
}

/** CPP/EI for an employee outside Quebec (2026). */
export function caPayroll(gross: number): CaPayroll {
  const contributory = Math.max(
    0,
    Math.min(gross, CA_PAYROLL_RULES.cppYmpe) - CA_PAYROLL_RULES.cppBasicExemption,
  );
  const cpp2Earnings = Math.max(
    0,
    Math.min(gross, CA_PAYROLL_RULES.cppYampe) - CA_PAYROLL_RULES.cppYmpe,
  );
  return {
    cppBase: cents(contributory * CA_PAYROLL_RULES.cppBaseRate),
    cppEnhanced: cents(contributory * CA_PAYROLL_RULES.cppEnhancedRate),
    cpp2: cents(cpp2Earnings * CA_PAYROLL_RULES.cpp2Rate),
    ei: cents(Math.min(gross, CA_PAYROLL_RULES.eiMaxInsurableEarnings) * CA_PAYROLL_RULES.eiRate),
  };
}

/** Federal basic personal amount, phased down for high net income. */
export function basicPersonalAmount(netIncome: number): number {
  const { basicPersonalAmountMax: max, basicPersonalAmountMin: min } = CA_FEDERAL_RULES;
  const { bpaPhaseOutStart: start, bpaPhaseOutEnd: end } = CA_FEDERAL_RULES;
  if (netIncome <= start) return max;
  if (netIncome >= end) return min;
  return max - ((netIncome - start) / (end - start)) * (max - min);
}

/**
 * Net income for tax purposes (Line 23600): gross minus RRSP deductions and enhanced CPP/CPP2.
 */
export function caNetIncome(gross: number, preTaxRetirement: number, p: CaPayroll): number {
  return Math.max(0, gross - preTaxRetirement - p.cppEnhanced - p.cpp2);
}

/**
 * Federal income tax after basic personal amount, Canada employment amount, and CPP/EI credits.
 */
export function caFederalTax(gross: number, preTaxRetirement: number, p: CaPayroll): number {
  const netIncome = caNetIncome(gross, preTaxRetirement, p);
  const grossTax = progressiveTax(netIncome, [...CA_FEDERAL_RULES.brackets]);

  const cea = Math.min(gross, CA_FEDERAL_RULES.canadaEmploymentAmountMax);
  const credits =
    (basicPersonalAmount(netIncome) + p.cppBase + p.ei + cea) * CA_FEDERAL_RULES.creditRate;

  return cents(Math.max(0, grossTax - credits));
}

/**
 * Ontario Health Premium based on taxable income.
 * Official schedule: https://www.ontario.ca/page/ontario-health-premium
 */
export function ontarioHealthPremium(taxableIncome: number): number {
  if (taxableIncome <= 20_000) return 0;
  if (taxableIncome <= 25_000) {
    return cents(Math.min(300, (taxableIncome - 20_000) * 0.06));
  }
  if (taxableIncome <= 36_000) return 300;
  if (taxableIncome <= 38_500) {
    return cents(Math.min(450, 300 + (taxableIncome - 36_000) * 0.06));
  }
  if (taxableIncome <= 48_000) return 450;
  if (taxableIncome <= 48_600) {
    return cents(Math.min(600, 450 + (taxableIncome - 48_000) * 0.25));
  }
  if (taxableIncome <= 72_000) return 600;
  if (taxableIncome <= 72_600) {
    return cents(Math.min(750, 600 + (taxableIncome - 72_000) * 0.25));
  }
  if (taxableIncome <= 200_000) return 750;
  if (taxableIncome <= 200_600) {
    return cents(Math.min(900, 750 + (taxableIncome - 200_000) * 0.25));
  }
  return 900;
}

export interface CaProvincialResult {
  taxLines: TaxLine[];
  provincialTaxTotal: number;
}

/**
 * Calculate provincial tax for verified Canadian provinces.
 */
export function caProvincialTax(
  jurisdictionCode: string,
  gross: number,
  preTaxRetirement: number,
  p: CaPayroll,
): CaProvincialResult {
  const netIncome = caNetIncome(gross, preTaxRetirement, p);

  if (jurisdictionCode === "CA-ON") {
    // Ontario basic tax
    const basicTax = progressiveTax(netIncome, [...CA_ON_RULES.brackets]);
    const credits =
      (CA_ON_RULES.basicPersonalAmount + p.cppBase + p.ei) * CA_ON_RULES.creditRate;
    const taxAfterCredits = Math.max(0, basicTax - credits);

    // Ontario surtax on basic tax
    let surtax = 0;
    if (taxAfterCredits > CA_ON_RULES.surtaxThreshold1) {
      surtax += (taxAfterCredits - CA_ON_RULES.surtaxThreshold1) * CA_ON_RULES.surtaxRate1;
    }
    if (taxAfterCredits > CA_ON_RULES.surtaxThreshold2) {
      surtax += (taxAfterCredits - CA_ON_RULES.surtaxThreshold2) * CA_ON_RULES.surtaxRate2;
    }

    const ontarioIncomeTax = cents(taxAfterCredits + surtax);
    const ohp = ontarioHealthPremium(netIncome);

    return {
      taxLines: [
        { label: "Ontario provincial income tax", amount: ontarioIncomeTax },
        { label: "Ontario Health Premium", amount: ohp },
      ],
      provincialTaxTotal: cents(ontarioIncomeTax + ohp),
    };
  }

  if (jurisdictionCode === "CA-BC") {
    const basicTax = progressiveTax(netIncome, [...CA_BC_RULES.brackets]);
    const credits =
      (CA_BC_RULES.basicPersonalAmount + p.cppBase + p.ei) * CA_BC_RULES.creditRate;
    const taxAfterCredits = Math.max(0, basicTax - credits);

    // BC Tax Reduction credit
    let reduction = 0;
    if (netIncome <= CA_BC_RULES.taxReductionThreshold) {
      reduction = CA_BC_RULES.taxReductionMax;
    } else {
      reduction = Math.max(
        0,
        CA_BC_RULES.taxReductionMax -
          (netIncome - CA_BC_RULES.taxReductionThreshold) *
            CA_BC_RULES.taxReductionClawbackRate,
      );
    }

    const bcTax = cents(Math.max(0, taxAfterCredits - reduction));

    return {
      taxLines: [{ label: "British Columbia provincial tax", amount: bcTax }],
      provincialTaxTotal: bcTax,
    };
  }

  if (jurisdictionCode === "CA-AB") {
    const basicTax = progressiveTax(netIncome, [...CA_AB_RULES.brackets]);
    const credits =
      (CA_AB_RULES.basicPersonalAmount + p.cppBase + p.ei) * CA_AB_RULES.creditRate;
    const abTax = cents(Math.max(0, basicTax - credits));

    return {
      taxLines: [{ label: "Alberta provincial tax", amount: abTax }],
      provincialTaxTotal: abTax,
    };
  }

  throw new Error(`Provincial calculator not implemented for ${jurisdictionCode}`);
}
