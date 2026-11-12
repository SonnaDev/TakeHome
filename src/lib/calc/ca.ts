import { CA_FEDERAL, CA_PAYROLL } from "@/data/tax/2026/rules";
import { cents, progressiveTax } from "./progressive";

export interface CaPayroll {
  cppBase: number; // creditable portion
  cppEnhanced: number; // deductible portion
  cpp2: number; // deductible
  ei: number;
}

/** CPP/EI for an employee outside Quebec. */
export function caPayroll(gross: number): CaPayroll {
  const contributory = Math.max(
    0,
    Math.min(gross, CA_PAYROLL.cppYmpe) - CA_PAYROLL.cppBasicExemption,
  );
  const cpp2Earnings = Math.max(
    0,
    Math.min(gross, CA_PAYROLL.cppYampe) - CA_PAYROLL.cppYmpe,
  );
  return {
    cppBase: cents(contributory * CA_PAYROLL.cppBaseRate),
    cppEnhanced: cents(contributory * CA_PAYROLL.cppEnhancedRate),
    cpp2: cents(cpp2Earnings * CA_PAYROLL.cpp2Rate),
    ei: cents(Math.min(gross, CA_PAYROLL.eiMaxInsurableEarnings) * CA_PAYROLL.eiRate),
  };
}

/** Basic personal amount, phased down for high net income. */
export function basicPersonalAmount(netIncome: number): number {
  const { basicPersonalAmountMax: max, basicPersonalAmountMin: min } = CA_FEDERAL;
  const { bpaPhaseOutStart: start, bpaPhaseOutEnd: end } = CA_FEDERAL;
  if (netIncome <= start) return max;
  if (netIncome >= end) return min;
  return max - ((netIncome - start) / (end - start)) * (max - min);
}

/**
 * Federal income tax after the basic personal amount and CPP/EI credits.
 * NOT yet included: Canada employment amount and other credits (pending
 * verification), so this slightly overstates federal tax.
 */
export function caFederalTax(gross: number, preTaxRetirement: number, p: CaPayroll): number {
  const netIncome = Math.max(0, gross - preTaxRetirement - p.cppEnhanced - p.cpp2);
  const grossTax = progressiveTax(netIncome, [...CA_FEDERAL.brackets]);
  const credits =
    (basicPersonalAmount(netIncome) + p.cppBase + p.ei) * CA_FEDERAL.creditRate;
  return cents(Math.max(0, grossTax - credits));
}
