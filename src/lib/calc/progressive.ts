import type { Bracket } from "@/data/tax/2026/rules";

/** Tax on `income` using marginal brackets. Negative income yields 0. */
export function progressiveTax(income: number, brackets: Bracket[]): number {
  if (income <= 0) return 0;
  let tax = 0;
  let lower = 0;
  for (const { upTo, rate } of brackets) {
    if (income <= lower) break;
    tax += (Math.min(income, upTo) - lower) * rate;
    lower = upTo;
  }
  return tax;
}

/** Round to cents. */
export const cents = (n: number): number => Math.round(n * 100) / 100;
