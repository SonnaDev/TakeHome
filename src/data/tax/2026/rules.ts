/**
 * Tax year 2026 rules. Every block cites its official government source.
 * Anything not verified against an official source is NOT in this file;
 * jurisdictions without verified rules are marked "pending" in jurisdictions.ts
 * and the calculation engine refuses to calculate them.
 */

export const TAX_YEAR = 2026;

export interface Bracket {
  /** Upper bound of the bracket; Infinity for the top bracket. */
  upTo: number;
  rate: number;
}

export {
  CA_FEDERAL_RULES,
  CA_PAYROLL_RULES,
  CA_ON_RULES,
  CA_BC_RULES,
  CA_AB_RULES,
} from "./ca-rules";

export {
  US_FEDERAL_RULES,
  US_PAYROLL_RULES,
  US_CA_RULES,
  US_NY_RULES,
  US_IL_RULES,
  US_MA_RULES,
  US_CO_RULES,
  US_PA_RULES,
  US_WA_RULES,
} from "./us-rules";

// Aliases for backward compatibility
import { CA_FEDERAL_RULES, CA_PAYROLL_RULES } from "./ca-rules";
import { US_FEDERAL_RULES, US_PAYROLL_RULES } from "./us-rules";

export const US_FEDERAL = US_FEDERAL_RULES;
export const US_PAYROLL = US_PAYROLL_RULES;
export const CA_FEDERAL = CA_FEDERAL_RULES;
export const CA_PAYROLL = CA_PAYROLL_RULES;
