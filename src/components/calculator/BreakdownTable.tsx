"use client";

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
  const fmt = new Intl.NumberFormat("en-US");

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
                {sym}{fmt.format(Math.round(normalize(offerA.gross, offerA.currency)))}
              </td>
              <td className="py-3 px-2 text-right tabular-nums">
                {sym}{fmt.format(Math.round(normalize(offerB.gross, offerB.currency)))}
              </td>
            </tr>

            {/* Bonus */}
            {(offerA.bonus > 0 || offerB.bonus > 0) && (
              <tr>
                <td className="py-3 px-2 font-medium">Annual Bonus</td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {offerA.bonus > 0
                    ? `${sym}${fmt.format(Math.round(normalize(offerA.bonus, offerA.currency)))}`
                    : "—"}
                </td>
                <td className="py-3 px-2 text-right tabular-nums">
                  {offerB.bonus > 0
                    ? `${sym}${fmt.format(Math.round(normalize(offerB.bonus, offerB.currency)))}`
                    : "—"}
                </td>
              </tr>
            )}

            {/* Total Gross */}
            <tr className="bg-[var(--bg)]/50 font-semibold">
              <td className="py-2.5 px-2">Total Gross Earnings</td>
              <td className="py-2.5 px-2 text-right tabular-nums">
                {sym}{fmt.format(Math.round(normalize(offerA.gross + offerA.bonus, offerA.currency)))}
              </td>
              <td className="py-2.5 px-2 text-right tabular-nums">
                {sym}{fmt.format(Math.round(normalize(offerB.gross + offerB.bonus, offerB.currency)))}
              </td>
            </tr>

            {/* Statutory Tax Breakdown Headers */}
            <tr className="border-t-2 border-[var(--border)]">
              <td colSpan={3} className="pt-4 pb-1 px-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Taxes & Statutory Contributions
              </td>
            </tr>

            {/* Render unique tax lines side by side */}
            {offerA.taxLines.map((line, idx) => (
              <tr key={`a-tax-${idx}`}>
                <td className="py-2 px-2 text-xs text-[var(--muted)]">
                  {line.label}
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-xs">
                  {sym}{fmt.format(Math.round(normalize(line.amount, offerA.currency)))}
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-xs text-[var(--muted)]">
                  {/* Matching line in B if any, else dash */}
                  {offerB.taxLines[idx] ? (
                    <span>
                      {sym}{fmt.format(Math.round(normalize(offerB.taxLines[idx].amount, offerB.currency)))}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}

            {/* If offerB has more tax lines than offerA, render remaining */}
            {offerB.taxLines.slice(offerA.taxLines.length).map((line, idx) => (
              <tr key={`b-tax-extra-${idx}`}>
                <td className="py-2 px-2 text-xs text-[var(--muted)]">
                  {line.label}
                </td>
                <td className="py-2 px-2 text-right tabular-nums text-xs text-[var(--muted)]">—</td>
                <td className="py-2 px-2 text-right tabular-nums text-xs">
                  {sym}{fmt.format(Math.round(normalize(line.amount, offerB.currency)))}
                </td>
              </tr>
            ))}

            {/* Total Tax Subtotal */}
            <tr className="font-semibold border-t border-[var(--border)] text-[var(--warn)]">
              <td className="py-2.5 px-2">Total Tax & Statutory Deductions</td>
              <td className="py-2.5 px-2 text-right tabular-nums">
                {sym}{fmt.format(Math.round(normalize(offerA.totalTax, offerA.currency)))}
              </td>
              <td className="py-2.5 px-2 text-right tabular-nums">
                {sym}{fmt.format(Math.round(normalize(offerB.totalTax, offerB.currency)))}
              </td>
            </tr>

            {/* Voluntary & Out-of-Pocket Deductions */}
            {(offerA.preTaxRetirement > 0 ||
              offerB.preTaxRetirement > 0 ||
              offerA.healthPremiumAnnual > 0 ||
              offerB.healthPremiumAnnual > 0 ||
              offerA.commuteAnnual > 0 ||
              offerB.commuteAnnual > 0) && (
              <>
                <tr className="border-t-2 border-[var(--border)]">
                  <td colSpan={3} className="pt-4 pb-1 px-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Voluntary & Out-of-Pocket Deductions
                  </td>
                </tr>

                {/* Retirement 401k / RRSP */}
                {(offerA.preTaxRetirement > 0 || offerB.preTaxRetirement > 0) && (
                  <tr>
                    <td className="py-2 px-2 text-xs text-[var(--muted)]">Pre-Tax Retirement Contribution</td>
                    <td className="py-2 px-2 text-right tabular-nums text-xs">
                      {sym}{fmt.format(Math.round(normalize(offerA.preTaxRetirement, offerA.currency)))}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-xs">
                      {sym}{fmt.format(Math.round(normalize(offerB.preTaxRetirement, offerB.currency)))}
                    </td>
                  </tr>
                )}

                {/* Healthcare Premium */}
                {(offerA.healthPremiumAnnual > 0 || offerB.healthPremiumAnnual > 0) && (
                  <tr>
                    <td className="py-2 px-2 text-xs text-[var(--muted)]">Employee Health Premium (Annual)</td>
                    <td className="py-2 px-2 text-right tabular-nums text-xs">
                      {sym}{fmt.format(Math.round(normalize(offerA.healthPremiumAnnual, offerA.currency)))}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-xs">
                      {sym}{fmt.format(Math.round(normalize(offerB.healthPremiumAnnual, offerB.currency)))}
                    </td>
                  </tr>
                )}

                {/* Commute */}
                {(offerA.commuteAnnual > 0 || offerB.commuteAnnual > 0) && (
                  <tr>
                    <td className="py-2 px-2 text-xs text-[var(--muted)]">Estimated Commute Expenses (Annual)</td>
                    <td className="py-2 px-2 text-right tabular-nums text-xs">
                      {sym}{fmt.format(Math.round(normalize(offerA.commuteAnnual, offerA.currency)))}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-xs">
                      {sym}{fmt.format(Math.round(normalize(offerB.commuteAnnual, offerB.currency)))}
                    </td>
                  </tr>
                )}
              </>
            )}

            {/* Net In Pocket Final Row */}
            <tr className="border-t-2 border-[var(--border)] bg-[var(--win)]/10 font-bold text-base text-[var(--text)]">
              <td className="py-3 px-2">Net Cash In Pocket (Annual)</td>
              <td className="py-3 px-2 text-right tabular-nums text-[var(--win)]">
                {sym}{fmt.format(Math.round(normalize(offerA.netInPocket, offerA.currency)))}
              </td>
              <td className="py-3 px-2 text-right tabular-nums text-[var(--win)]">
                {sym}{fmt.format(Math.round(normalize(offerB.netInPocket, offerB.currency)))}
              </td>
            </tr>

            <tr className="text-xs text-[var(--muted)] font-medium">
              <td className="py-2 px-2">Net Cash In Pocket (Monthly)</td>
              <td className="py-2 px-2 text-right tabular-nums">
                {sym}{fmt.format(Math.round(normalize(offerA.netInPocket / 12, offerA.currency)))}/mo
              </td>
              <td className="py-2 px-2 text-right tabular-nums">
                {sym}{fmt.format(Math.round(normalize(offerB.netInPocket / 12, offerB.currency)))}/mo
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-3 flex flex-col gap-1">
        <span>
          • Tax figures represent single filer statutory employees with standard deductions for tax year 2026.
        </span>
        <span>
          • Surtaxes and state/provincial healthcare levies (e.g. Ontario Health Premium, WA Cares, CA SDI) are included under statutory deductions.
        </span>
      </div>
    </section>
  );
}
