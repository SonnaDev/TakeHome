"use client";

import { ExternalLink } from "lucide-react";
import type { Currency } from "@/lib/fx";
import type { TaxLine } from "@/lib/calc/types";

export interface OfferDetailedBreakdown {
  label: string;
  locationName: string;
  currency: Currency;
  gross: number;
  bonus: number;
  taxLines: TaxLine[];
  preTaxRetirement: number;
  healthPremiumAnnual: number;
  commuteAnnual: number;
  totalTax: number;
  netInPocket: number;
}

interface BreakdownTableProps {
  offerA: OfferDetailedBreakdown;
  offerB: OfferDetailedBreakdown;
  displayCurrency: Currency;
  usdToCadRate: number;
}

export function BreakdownTable({
  offerA,
  offerB,
  displayCurrency,
  usdToCadRate,
}: BreakdownTableProps) {
  const sym = displayCurrency === "USD" ? "$" : "C$";

  const normalize = (amount: number, fromCurrency: Currency): number => {
    if (fromCurrency === displayCurrency) return amount;
    if (fromCurrency === "USD" && displayCurrency === "CAD") return amount * usdToCadRate;
    return amount / usdToCadRate;
  };

  return (
    <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text)]">Tax & Deductions Breakdown</h3>
          <p className="text-xs text-[var(--muted)]">
            Statutory taxes and employee deductions (as of tax year 2026)
          </p>
        </div>
        <div className="text-xs px-2.5 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] self-start sm:self-auto font-medium">
          Amounts shown in {displayCurrency} ({sym})
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase tracking-wider">
              <th scope="col" className="py-3 px-2 font-semibold">Category / Line</th>
              <th scope="col" className="py-3 px-2 font-semibold text-right">
                {offerA.label} ({offerA.locationName})
              </th>
              <th scope="col" className="py-3 px-2 font-semibold text-right">
                {offerB.label} ({offerB.locationName})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/60 text-[var(--text)]">
            {/* Gross Base Salary */}
            <tr>
              <td className="py-3 px-2 font-medium">Base Salary</td>
              <td className="py-3 px-2 text-right tabular-nums">
                {sym}{Math.round(normalize(offerA.gross, offerA.currency)).toLocaleString()}
              </td>
              <td className="py-3 px-2 text-right tabular-nums">
                {sym}{Math.round(normalize(offerB.gross, offerB.currency)).toLocaleString()}
              </td>
            </tr>

            {/* Bonus */}
            {(offerA.bonus > 0 || offerB.bonus > 0) && (
              <tr>
                <td className="py-3 px-2 font-medium">Annual Bonus</td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {offerA.bonus > 0
                    ? `${sym}${Math.round(normalize(offerA.bonus, offerA.currency)).toLocaleString()}`
                    : "—"}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {offerB.bonus > 0
                    ? `${sym}${Math.round(normalize(offerB.bonus, offerB.currency)).toLocaleString()}`
                    : "—"}
                </td>
              </tr>
            )}

            {/* Total Gross */}
            <tr className="bg-[var(--bg)]/50 font-semibold">
              <td className="py-2.5 px-2">Total Gross Earnings</td>
              <td className="py-2.5 px-2 text-right tabular-nums">
                {sym}{Math.round(normalize(offerA.gross + offerA.bonus, offerA.currency)).toLocaleString()}
              </td>
              <td className="py-2.5 px-2 text-right tabular-nums">
                {sym}{Math.round(normalize(offerB.gross + offerB.bonus, offerB.currency)).toLocaleString()}
              </td>
            </tr>

            {/* Taxes Header */}
            <tr className="bg-[var(--bg)] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              <td colSpan={3} className="py-2 px-2">Mandatory Taxes & Payroll Items</td>
            </tr>

            {/* Offer A Taxes */}
            {offerA.taxLines.map((line, idx) => (
              <tr key={`a-tax-${idx}`}>
                <td className="py-2 px-2 text-xs sm:text-sm pl-4 flex items-center gap-1.5 text-[var(--muted)]">
                  <span>{line.label} (Offer A)</span>
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm font-medium">
                  {sym}{Math.round(normalize(line.amount, offerA.currency)).toLocaleString()}
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-xs text-[var(--muted)]">
                  —
                </td>
              </tr>
            ))}

            {/* Offer B Taxes */}
            {offerB.taxLines.map((line, idx) => (
              <tr key={`b-tax-${idx}`}>
                <td className="py-2 px-2 text-xs sm:text-sm pl-4 flex items-center gap-1.5 text-[var(--muted)]">
                  <span>{line.label} (Offer B)</span>
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-xs text-[var(--muted)]">
                  —
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm font-medium">
                  {sym}{Math.round(normalize(line.amount, offerB.currency)).toLocaleString()}
                </td>
              </tr>
            ))}

            {/* Total Tax Row */}
            <tr className="bg-[var(--bg)]/50 font-semibold">
              <td className="py-2.5 px-2">Total Statutory Taxes</td>
              <td className="py-2.5 px-2 text-right tabular-nums text-[var(--warn)]">
                {sym}{Math.round(normalize(offerA.totalTax, offerA.currency)).toLocaleString()}
              </td>
              <td className="py-2.5 px-2 text-right tabular-nums text-[var(--warn)]">
                {sym}{Math.round(normalize(offerB.totalTax, offerB.currency)).toLocaleString()}
              </td>
            </tr>

            {/* Voluntary Deductions */}
            {(offerA.preTaxRetirement > 0 ||
              offerB.preTaxRetirement > 0 ||
              offerA.healthPremiumAnnual > 0 ||
              offerB.healthPremiumAnnual > 0 ||
              offerA.commuteAnnual > 0 ||
              offerB.commuteAnnual > 0) && (
              <>
                <tr className="bg-[var(--bg)] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  <td colSpan={3} className="py-2 px-2">Benefits & Out-of-Pocket Expenses</td>
                </tr>
                {/* 401k / RRSP */}
                <tr>
                  <td className="py-2 px-2 pl-4 text-xs sm:text-sm">Pre-Tax Retirement</td>
                  <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm">
                    {sym}{Math.round(normalize(offerA.preTaxRetirement, offerA.currency)).toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm">
                    {sym}{Math.round(normalize(offerB.preTaxRetirement, offerB.currency)).toLocaleString()}
                  </td>
                </tr>
                {/* Healthcare Premium */}
                <tr>
                  <td className="py-2 px-2 pl-4 text-xs sm:text-sm">Employee Health Premiums (Annual)</td>
                  <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm">
                    {sym}{Math.round(normalize(offerA.healthPremiumAnnual, offerA.currency)).toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm">
                    {sym}{Math.round(normalize(offerB.healthPremiumAnnual, offerB.currency)).toLocaleString()}
                  </td>
                </tr>
                {/* Commute */}
                <tr>
                  <td className="py-2 px-2 pl-4 text-xs sm:text-sm">Commute / Transit (Annual)</td>
                  <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm">
                    {sym}{Math.round(normalize(offerA.commuteAnnual, offerA.currency)).toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums text-xs sm:text-sm">
                    {sym}{Math.round(normalize(offerB.commuteAnnual, offerB.currency)).toLocaleString()}
                  </td>
                </tr>
              </>
            )}

            {/* Final In-Pocket Take-Home */}
            <tr className="border-t-2 border-[var(--border)] bg-[var(--surface)] text-base font-bold">
              <td className="py-3 px-2">Estimated Net Take-Home (Annual)</td>
              <td className="py-3 px-2 text-right tabular-nums text-[var(--win)] text-lg">
                {sym}{Math.round(normalize(offerA.netInPocket, offerA.currency)).toLocaleString()}
              </td>
              <td className="py-3 px-2 text-right tabular-nums text-[var(--win)] text-lg">
                {sym}{Math.round(normalize(offerB.netInPocket, offerB.currency)).toLocaleString()}
              </td>
            </tr>
            <tr className="bg-[var(--surface)] text-xs text-[var(--muted)] font-medium">
              <td className="py-1 px-2">Monthly Net</td>
              <td className="py-1 px-2 text-right tabular-nums">
                {sym}{Math.round(normalize(offerA.netInPocket / 12, offerA.currency)).toLocaleString()}/mo
              </td>
              <td className="py-1 px-2 text-right tabular-nums">
                {sym}{Math.round(normalize(offerB.netInPocket / 12, offerB.currency)).toLocaleString()}/mo
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-[var(--muted)] pt-3 border-t border-[var(--border)] gap-2">
        <span>
          Sources: IRS Rev. Proc. 2025-32, CRA T4127, SSA 2026 COLA, state & provincial revenue statutes.
        </span>
        <a
          href="/data"
          className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-medium"
        >
          View data methodology & citations <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
