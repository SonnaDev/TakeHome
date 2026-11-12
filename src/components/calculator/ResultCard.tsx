"use client";

import { Award } from "lucide-react";
import type { Currency } from "@/lib/fx";

export interface OfferComputedSummary {
  label: string;
  locationName: string;
  originalCurrency: Currency;
  nominalTakeHomeLocal: number;
  /** In the user-selected comparison currency (USD or CAD) */
  nominalTakeHomeNormalized: number;
  /** Adjusted for local price parity index (if available) */
  colAdjustedTakeHomeNormalized?: number;
  colIndex?: number;
  monthlyTakeHomeNormalized: number;
  grossNormalized: number;
  effectiveTaxRate: number;
}

interface ResultCardProps {
  offerA: OfferComputedSummary;
  offerB: OfferComputedSummary;
  displayCurrency: Currency;
  isColAdjusted: boolean;
  fxRateDate?: string;
  fxRate?: number;
}

export function ResultCard({
  offerA,
  offerB,
  displayCurrency,
  isColAdjusted,
  fxRateDate,
  fxRate,
}: ResultCardProps) {
  const sym = displayCurrency === "USD" ? "$" : "C$";

  const valA = isColAdjusted && offerA.colAdjustedTakeHomeNormalized
    ? offerA.colAdjustedTakeHomeNormalized
    : offerA.nominalTakeHomeNormalized;

  const valB = isColAdjusted && offerB.colAdjustedTakeHomeNormalized
    ? offerB.colAdjustedTakeHomeNormalized
    : offerB.nominalTakeHomeNormalized;

  const diff = Math.round(Math.abs(valA - valB));
  const monthlyDiff = Math.round(diff / 12);
  const winner = valA > valB ? "A" : valB > valA ? "B" : "TIE";

  const winningOffer = winner === "A" ? offerA : offerB;
  const losingOffer = winner === "A" ? offerB : offerA;

  let verdictText = "";
  if (winner === "TIE") {
    verdictText = "Both offers result in equivalent purchasing power after deductions.";
  } else {
    verdictText = `${winningOffer.label} (${winningOffer.locationName}) leaves you ${sym}${diff.toLocaleString()}/year (${sym}${monthlyDiff.toLocaleString()}/month) more ${
      isColAdjusted ? "in cost-of-living purchasing power" : "after taxes and deductions"
    } than ${losingOffer.label} (${losingOffer.locationName}).`;
  }

  return (
    <section
      aria-live="polite"
      aria-atomic="true"
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col gap-6"
    >
      {/* Verdict Sentence */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
          {isColAdjusted ? "Cost-of-Living Adjusted Verdict" : "Take-Home Verdict"}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text)] tracking-tight leading-tight">
          {verdictText}
        </h2>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Offer A Card */}
        <div
          className={`relative rounded-xl p-5 border flex flex-col gap-3 transition-colors ${
            winner === "A"
              ? "border-[var(--win)] bg-[var(--win)]/5 shadow-xs"
              : "border-[var(--border)] bg-[var(--surface)]"
          }`}
        >
          {winner === "A" && (
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--win)] text-white">
              <Award className="w-3.5 h-3.5" />
              Better by {sym}{diff.toLocaleString()}/yr
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
              {offerA.label}
            </span>
            <div className="text-lg font-bold text-[var(--text)]">
              {offerA.locationName}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-black text-[var(--text)] tabular-nums">
              {sym}{Math.round(valA).toLocaleString()}
              <span className="text-sm font-normal text-[var(--muted)]">/yr</span>
            </span>
            <span className="text-sm font-medium text-[var(--muted)] tabular-nums">
              {sym}{Math.round(valA / 12).toLocaleString()}/month net
            </span>
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-1 text-xs text-[var(--muted)]">
            <div className="flex justify-between">
              <span>Gross compensation:</span>
              <span className="font-semibold tabular-nums text-[var(--text)]">
                {sym}{Math.round(offerA.grossNormalized).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Effective total tax rate:</span>
              <span className="font-semibold tabular-nums text-[var(--text)]">
                {offerA.effectiveTaxRate.toFixed(1)}%
              </span>
            </div>
            {offerA.originalCurrency !== displayCurrency && (
              <div className="flex justify-between text-[11px] italic">
                <span>Local take-home:</span>
                <span className="tabular-nums">
                  {offerA.originalCurrency} ${Math.round(offerA.nominalTakeHomeLocal).toLocaleString()}
                </span>
              </div>
            )}
            {isColAdjusted && offerA.colIndex && (
              <div className="flex justify-between text-[11px] text-[var(--accent)] font-medium">
                <span>Price Parity Index:</span>
                <span>{offerA.colIndex} (100 = base)</span>
              </div>
            )}
          </div>
        </div>

        {/* Offer B Card */}
        <div
          className={`relative rounded-xl p-5 border flex flex-col gap-3 transition-colors ${
            winner === "B"
              ? "border-[var(--win)] bg-[var(--win)]/5 shadow-xs"
              : "border-[var(--border)] bg-[var(--surface)]"
          }`}
        >
          {winner === "B" && (
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--win)] text-white">
              <Award className="w-3.5 h-3.5" />
              Better by {sym}{diff.toLocaleString()}/yr
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
              {offerB.label}
            </span>
            <div className="text-lg font-bold text-[var(--text)]">
              {offerB.locationName}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-black text-[var(--text)] tabular-nums">
              {sym}{Math.round(valB).toLocaleString()}
              <span className="text-sm font-normal text-[var(--muted)]">/yr</span>
            </span>
            <span className="text-sm font-medium text-[var(--muted)] tabular-nums">
              {sym}{Math.round(valB / 12).toLocaleString()}/month net
            </span>
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-1 text-xs text-[var(--muted)]">
            <div className="flex justify-between">
              <span>Gross compensation:</span>
              <span className="font-semibold tabular-nums text-[var(--text)]">
                {sym}{Math.round(offerB.grossNormalized).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Effective total tax rate:</span>
              <span className="font-semibold tabular-nums text-[var(--text)]">
                {offerB.effectiveTaxRate.toFixed(1)}%
              </span>
            </div>
            {offerB.originalCurrency !== displayCurrency && (
              <div className="flex justify-between text-[11px] italic">
                <span>Local take-home:</span>
                <span className="tabular-nums">
                  {offerB.originalCurrency} ${Math.round(offerB.nominalTakeHomeLocal).toLocaleString()}
                </span>
              </div>
            )}
            {isColAdjusted && offerB.colIndex && (
              <div className="flex justify-between text-[11px] text-[var(--accent)] font-medium">
                <span>Price Parity Index:</span>
                <span>{offerB.colIndex} (100 = base)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FX rate information bar */}
      {(offerA.originalCurrency !== offerB.originalCurrency ||
        offerA.originalCurrency !== displayCurrency ||
        offerB.originalCurrency !== displayCurrency) && (
        <div className="flex flex-wrap items-center justify-between text-xs text-[var(--muted)] pt-2 border-t border-[var(--border)] gap-2">
          <span>
            Exchange rate: <strong>1 USD = {fxRate ? fxRate.toFixed(4) : "1.4181"} CAD</strong>
          </span>
          <span>
            Bank of Canada Valet API (as of {fxRateDate ?? "2026-11-10"})
          </span>
        </div>
      )}
    </section>
  );
}
