"use client";

import { useEffect, useState, useTransition } from "react";
import { DollarSign, Scale } from "lucide-react";
import { ShareBar } from "@/components/ShareBar";
import { OfferForm } from "./OfferForm";
import { ResultCard, type OfferComputedSummary } from "./ResultCard";
import { BreakdownTable, type OfferDetailedBreakdown } from "./BreakdownTable";
import { AssumptionsPanel } from "./AssumptionsPanel";
import { calculateTakeHome } from "@/lib/calc/takeHome";
import { getJurisdiction } from "@/data/tax/2026/jurisdictions";
import { getCostOfLivingIndex } from "@/data/col";
import {
  adjustForCostOfLiving,
  convertCurrency,
  FALLBACK_FX,
  type Currency,
  type FxRateResult,
} from "@/lib/fx";
import {
  encodeComparisonParams,
  parseComparisonParams,
  type ComparisonQuery,
  type OfferFormData,
} from "@/lib/schema";

interface ComparisonToolProps {
  initialQuery?: Partial<ComparisonQuery>;
}

export function ComparisonTool({ initialQuery }: ComparisonToolProps) {
  // Initialize query from props or search params
  const [query, setQuery] = useState<ComparisonQuery>(() => {
    return parseComparisonParams(initialQuery ?? {});
  });

  const [fx, setFx] = useState<FxRateResult>(FALLBACK_FX);
  const [, startTransition] = useTransition();

  // Fetch live daily Bank of Canada FX rate from /api/fx
  useEffect(() => {
    let isMounted = true;
    fetch("/api/fx")
      .then((res) => (res.ok ? res.json() : FALLBACK_FX))
      .then((data: FxRateResult) => {
        if (isMounted && data?.usdToCad) {
          setFx(data);
        }
      })
      .catch(() => {
        // Fallback is already initialized
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync URL query without page reloads
  const updateQuery = (updater: (prev: ComparisonQuery) => ComparisonQuery) => {
    setQuery((prev) => {
      const next = updater(prev);
      startTransition(() => {
        if (typeof window !== "undefined") {
          const qs = encodeComparisonParams(next);
          const newUrl = `${window.location.pathname}?${qs}`;
          window.history.replaceState(null, "", newUrl);
        }
      });
      return next;
    });
  };

  // Offer A form data
  const offerAData: OfferFormData = {
    location: query.locA,
    grossSalary: query.salaryA,
    bonus: query.bonusA,
    payFrequency: query.freqA,
    preTaxRetirement: query.retireA,
    healthPremiumMonthly: query.healthA,
    commuteMonthly: query.commuteA,
  };

  // Offer B form data
  const offerBData: OfferFormData = {
    location: query.locB,
    grossSalary: query.salaryB,
    bonus: query.bonusB,
    payFrequency: query.freqB,
    preTaxRetirement: query.retireB,
    healthPremiumMonthly: query.healthB,
    commuteMonthly: query.commuteB,
  };

  const placeA = getJurisdiction(query.locA);
  const placeB = getJurisdiction(query.locB);

  const totalGrossA = query.salaryA + query.bonusA;
  const totalGrossB = query.salaryB + query.bonusB;

  // Run pure browser calculations
  const calcResA = calculateTakeHome({
    location: query.locA,
    grossSalary: totalGrossA,
    preTaxRetirement: query.retireA,
  });

  const calcResB = calculateTakeHome({
    location: query.locB,
    grossSalary: totalGrossB,
    preTaxRetirement: query.retireB,
  });

  // Out of pocket costs
  const healthAnnualA = query.healthA * 12;
  const commuteAnnualA = query.commuteA * 12;
  const healthAnnualB = query.healthB * 12;
  const commuteAnnualB = query.commuteB * 12;

  const currencyA: Currency = placeA?.country === "CA" ? "CAD" : "USD";
  const currencyB: Currency = placeB?.country === "CA" ? "CAD" : "USD";

  // Compute nominal take-home after voluntary health and commute
  const taxA = calcResA.ok ? calcResA.totalTax : 0;
  const taxB = calcResB.ok ? calcResB.totalTax : 0;

  const inPocketLocalA = Math.max(0, totalGrossA - query.retireA - taxA - healthAnnualA - commuteAnnualA);
  const inPocketLocalB = Math.max(0, totalGrossB - query.retireB - taxB - healthAnnualB - commuteAnnualB);

  // Normalize in selected comparison currency
  const inPocketNormA = convertCurrency(inPocketLocalA, currencyA, query.currency, fx.usdToCad);
  const inPocketNormB = convertCurrency(inPocketLocalB, currencyB, query.currency, fx.usdToCad);

  const grossNormA = convertCurrency(totalGrossA, currencyA, query.currency, fx.usdToCad);
  const grossNormB = convertCurrency(totalGrossB, currencyB, query.currency, fx.usdToCad);

  // Cost of living adjustments
  const colA = getCostOfLivingIndex(query.locA);
  const colB = getCostOfLivingIndex(query.locB);

  const colAdjustedNormA = colA ? adjustForCostOfLiving(inPocketNormA, colA.index) : undefined;
  const colAdjustedNormB = colB ? adjustForCostOfLiving(inPocketNormB, colB.index) : undefined;

  const summaryA: OfferComputedSummary = {
    label: "Offer A",
    locationName: placeA?.name ?? query.locA,
    originalCurrency: currencyA,
    nominalTakeHomeLocal: inPocketLocalA,
    nominalTakeHomeNormalized: inPocketNormA,
    colAdjustedTakeHomeNormalized: colAdjustedNormA,
    colIndex: colA?.index,
    monthlyTakeHomeNormalized: inPocketNormA / 12,
    grossNormalized: grossNormA,
    effectiveTaxRate: totalGrossA > 0 ? (taxA / totalGrossA) * 100 : 0,
  };

  const summaryB: OfferComputedSummary = {
    label: "Offer B",
    locationName: placeB?.name ?? query.locB,
    originalCurrency: currencyB,
    nominalTakeHomeLocal: inPocketLocalB,
    nominalTakeHomeNormalized: inPocketNormB,
    colAdjustedTakeHomeNormalized: colAdjustedNormB,
    colIndex: colB?.index,
    monthlyTakeHomeNormalized: inPocketNormB / 12,
    grossNormalized: grossNormB,
    effectiveTaxRate: totalGrossB > 0 ? (taxB / totalGrossB) * 100 : 0,
  };

  const detailedA: OfferDetailedBreakdown = {
    label: "Offer A",
    locationName: placeA?.name ?? query.locA,
    currency: currencyA,
    gross: query.salaryA,
    bonus: query.bonusA,
    taxLines: calcResA.ok ? calcResA.lines : [],
    preTaxRetirement: query.retireA,
    healthPremiumAnnual: healthAnnualA,
    commuteAnnual: commuteAnnualA,
    totalTax: taxA,
    netInPocket: inPocketLocalA,
  };

  const detailedB: OfferDetailedBreakdown = {
    label: "Offer B",
    locationName: placeB?.name ?? query.locB,
    currency: currencyB,
    gross: query.salaryB,
    bonus: query.bonusB,
    taxLines: calcResB.ok ? calcResB.lines : [],
    preTaxRetirement: query.retireB,
    healthPremiumAnnual: healthAnnualB,
    commuteAnnual: commuteAnnualB,
    totalTax: taxB,
    netInPocket: inPocketLocalB,
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Controls: Currency & Cost-of-Living Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 shadow-2xs">
        {/* Currency Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Compare In:
          </span>
          <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--bg)]">
            <button
              type="button"
              onClick={() => updateQuery((q) => ({ ...q, currency: "USD" }))}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                query.currency === "USD"
                  ? "bg-[var(--accent)] text-white shadow-2xs"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => updateQuery((q) => ({ ...q, currency: "CAD" }))}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                query.currency === "CAD"
                  ? "bg-[var(--accent)] text-white shadow-2xs"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              CAD (C$)
            </button>
          </div>
        </div>

        {/* Cost of Living Toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={query.adjustCol}
              onChange={(e) =>
                updateQuery((q) => ({ ...q, adjustCol: e.target.checked }))
              }
              className="w-4 h-4 rounded text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            <span className="text-xs sm:text-sm font-semibold text-[var(--text)] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[var(--accent)]" /> Adjust for Cost of Living
            </span>
          </label>
        </div>
      </div>

      {/* Two-Column Inputs: Offer A & Offer B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <OfferForm
          title="Offer A"
          data={offerAData}
          currencySymbol={currencyA === "USD" ? "$" : "C$"}
          onChange={(newData) =>
            updateQuery((q) => ({
              ...q,
              locA: newData.location,
              salaryA: newData.grossSalary,
              bonusA: newData.bonus,
              freqA: newData.payFrequency,
              retireA: newData.preTaxRetirement,
              healthA: newData.healthPremiumMonthly,
              commuteA: newData.commuteMonthly,
            }))
          }
        />
        <OfferForm
          title="Offer B"
          data={offerBData}
          currencySymbol={currencyB === "USD" ? "$" : "C$"}
          onChange={(newData) =>
            updateQuery((q) => ({
              ...q,
              locB: newData.location,
              salaryB: newData.grossSalary,
              bonusB: newData.bonus,
              freqB: newData.payFrequency,
              retireB: newData.preTaxRetirement,
              healthB: newData.healthPremiumMonthly,
              commuteB: newData.commuteMonthly,
            }))
          }
        />
      </div>

      {/* Primary Result Card & Share Bar */}
      {calcResA.ok && calcResB.ok ? (
        <>
          <ResultCard
            offerA={summaryA}
            offerB={summaryB}
            displayCurrency={query.currency}
            isColAdjusted={query.adjustCol}
            fxRateDate={fx.date}
            fxRate={fx.usdToCad}
          />
          <ShareBar />
        </>
      ) : (
        <div className="p-6 bg-[var(--surface)] border border-[var(--warn)] rounded-xl text-center text-sm text-[var(--warn)] font-medium">
          {!calcResA.ok && <div>Offer A: {calcResA.message}</div>}
          {!calcResB.ok && <div>Offer B: {calcResB.message}</div>}
        </div>
      )}

      {/* Detailed Breakdown Table */}
      {calcResA.ok && calcResB.ok && (
        <BreakdownTable
          offerA={detailedA}
          offerB={detailedB}
          displayCurrency={query.currency}
          usdToCadRate={fx.usdToCad}
        />
      )}

      {/* Assumptions & Disclaimers */}
      <AssumptionsPanel
        assumptionsA={calcResA.ok ? calcResA.assumptions : []}
        assumptionsB={calcResB.ok ? calcResB.assumptions : []}
        locationAName={placeA?.name ?? query.locA}
        locationBName={placeB?.name ?? query.locB}
      />
    </div>
  );
}
