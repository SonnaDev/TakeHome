export interface TakeHomeInput {
  /** Jurisdiction code, e.g. "US-TX" or "CA-ON". */
  location: string;
  /** Annual gross salary in the location's local currency. */
  grossSalary: number;
  /** Annual employee pre-tax retirement contribution (401k / RRSP), local currency. */
  preTaxRetirement?: number;
}

export interface TaxLine {
  label: string;
  amount: number;
}

export interface TakeHomeResult {
  ok: true;
  location: string;
  currency: "USD" | "CAD";
  gross: number;
  lines: TaxLine[];
  totalTax: number;
  takeHome: number;
  /** Plain-language notes on what is and isn't included. */
  assumptions: string[];
}

export interface TakeHomeUnavailable {
  ok: false;
  reason: "unknown-location" | "pending-rules" | "invalid-input";
  message: string;
}

export type TakeHomeOutcome = TakeHomeResult | TakeHomeUnavailable;
