"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LocationSelect } from "./LocationSelect";
import type { OfferFormData, PayFrequency } from "@/lib/schema";

interface OfferFormProps {
  title: string;
  data: OfferFormData;
  onChange: (data: OfferFormData) => void;
  currencySymbol: "$" | "C$";
}

export function OfferForm({
  title,
  data,
  onChange,
  currencySymbol,
}: OfferFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const baseId = useId();

  const salaryId = `${baseId}-salary`;
  const bonusId = `${baseId}-bonus`;
  const freqId = `${baseId}-freq`;
  const retireId = `${baseId}-retire`;
  const healthId = `${baseId}-health`;
  const commuteId = `${baseId}-commute`;

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <h3 className="font-semibold text-lg text-[var(--text)]">{title}</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]">
          {data.location.startsWith("US") ? "USD ($)" : "CAD (C$)"}
        </span>
      </div>

      {/* Location */}
      <LocationSelect
        value={data.location}
        onChange={(loc) => onChange({ ...data, location: loc })}
      />

      {/* Gross Salary */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={salaryId} className="text-sm font-medium text-[var(--text)]">
          Base Salary (Annual)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] font-medium">
            {currencySymbol}
          </span>
          <input
            id={salaryId}
            type="number"
            min={0}
            max={10000000}
            step={1000}
            value={data.grossSalary || ""}
            onChange={(e) =>
              onChange({
                ...data,
                grossSalary: Math.max(0, Number(e.target.value) || 0),
              })
            }
            className="w-full h-11 pl-9 pr-3 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg text-base tabular-nums focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="100,000"
          />
        </div>
      </div>

      {/* Pay Frequency */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={freqId} className="text-sm font-medium text-[var(--text)]">
          Pay Frequency
        </label>
        <select
          id={freqId}
          value={data.payFrequency}
          onChange={(e) =>
            onChange({ ...data, payFrequency: e.target.value as PayFrequency })
          }
          className="w-full h-11 px-3 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg text-base focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
        >
          <option value="annually">Annually (1x / year)</option>
          <option value="monthly">Monthly (12x / year)</option>
          <option value="semi-monthly">Semi-monthly (24x / year)</option>
          <option value="bi-weekly">Bi-weekly (26x / year)</option>
          <option value="weekly">Weekly (52x / year)</option>
        </select>
      </div>

      {/* Advanced Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded p-1"
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="w-4 h-4" /> Hide deductions & benefits
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Add bonus, 401(k)/RRSP & benefits
            </>
          )}
        </button>
      </div>

      {/* Collapsible Advanced Fields */}
      {showAdvanced && (
        <div className="flex flex-col gap-3.5 pt-2 border-t border-[var(--border)]">
          {/* Annual Bonus */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={bonusId} className="text-sm font-medium text-[var(--text)]">
              Annual Bonus
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] font-medium">
                {currencySymbol}
              </span>
              <input
                id={bonusId}
                type="number"
                min={0}
                step={500}
                value={data.bonus || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    bonus: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full h-11 pl-9 pr-3 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg text-base tabular-nums focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="0"
              />
            </div>
          </div>

          {/* Pre-tax 401k / RRSP */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={retireId} className="text-sm font-medium text-[var(--text)]">
              Pre-tax Retirement ({data.location.startsWith("US") ? "401k" : "RRSP"}) / Year
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] font-medium">
                {currencySymbol}
              </span>
              <input
                id={retireId}
                type="number"
                min={0}
                step={500}
                value={data.preTaxRetirement || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    preTaxRetirement: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full h-11 pl-9 pr-3 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg text-base tabular-nums focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="0"
              />
            </div>
          </div>

          {/* Health insurance premium monthly */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={healthId} className="text-sm font-medium text-[var(--text)]">
              Monthly Health Insurance Premium
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] font-medium">
                {currencySymbol}
              </span>
              <input
                id={healthId}
                type="number"
                min={0}
                step={25}
                value={data.healthPremiumMonthly || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    healthPremiumMonthly: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full h-11 pl-9 pr-3 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg text-base tabular-nums focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="0"
              />
            </div>
          </div>

          {/* Monthly commute */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={commuteId} className="text-sm font-medium text-[var(--text)]">
              Monthly Commute / Transit Cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] font-medium">
                {currencySymbol}
              </span>
              <input
                id={commuteId}
                type="number"
                min={0}
                step={25}
                value={data.commuteMonthly || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    commuteMonthly: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full h-11 pl-9 pr-3 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg text-base tabular-nums focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
