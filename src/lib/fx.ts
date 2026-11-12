import { cents } from "./calc/progressive";

export type Currency = "USD" | "CAD";

export interface FxRateResult {
  /** 1 USD in CAD, e.g. 1.4181 */
  usdToCad: number;
  /** 1 CAD in USD, e.g. 0.7052 */
  cadToUsd: number;
  /** ISO date string of the rate (YYYY-MM-DD) */
  date: string;
  source: string;
  isFallback: boolean;
}

export const FALLBACK_FX: FxRateResult = {
  usdToCad: 1.4181,
  cadToUsd: 0.7052,
  date: "2026-11-10",
  source: "Bank of Canada Valet API (cached baseline)",
  isFallback: true,
};

/** Convert USD to CAD using the specified 1 USD -> X CAD rate. */
export function convertUsdToCad(usd: number, usdToCadRate: number): number {
  if (!Number.isFinite(usd) || usd <= 0 || !Number.isFinite(usdToCadRate) || usdToCadRate <= 0) {
    return 0;
  }
  return cents(usd * usdToCadRate);
}

/** Convert CAD to USD using the specified 1 USD -> X CAD rate. */
export function convertCadToUsd(cad: number, usdToCadRate: number): number {
  if (!Number.isFinite(cad) || cad <= 0 || !Number.isFinite(usdToCadRate) || usdToCadRate <= 0) {
    return 0;
  }
  return cents(cad / usdToCadRate);
}

/**
 * Convert an amount between currencies.
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  usdToCadRate: number,
): number {
  if (from === to) return cents(amount);
  if (from === "USD" && to === "CAD") return convertUsdToCad(amount, usdToCadRate);
  if (from === "CAD" && to === "USD") return convertCadToUsd(amount, usdToCadRate);
  return cents(amount);
}

/**
 * Adjust an amount for relative cost of living where base index = 100.
 * Adjusted value = nominalValue / (index / 100)
 */
export function adjustForCostOfLiving(amount: number, colIndex: number): number {
  if (!Number.isFinite(amount) || !Number.isFinite(colIndex) || colIndex <= 0) {
    return amount;
  }
  return cents(amount / (colIndex / 100));
}
