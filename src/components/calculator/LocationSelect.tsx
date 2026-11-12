"use client";

import { useId } from "react";
import { JURISDICTIONS, type Jurisdiction } from "@/data/tax/2026/jurisdictions";

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export function LocationSelect({
  value,
  onChange,
  label = "Location",
  error,
}: LocationSelectProps) {
  const id = useId();
  const errorId = `${id}-error`;

  const usJurisdictions = JURISDICTIONS.filter((j) => j.country === "US").sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const caJurisdictions = JURISDICTIONS.filter((j) => j.country === "CA").sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--text)] flex items-center justify-between"
      >
        <span>{label}</span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          className="w-full h-11 px-3 py-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg text-base focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors cursor-pointer"
        >
          <optgroup label="United States">
            {usJurisdictions.map((j: Jurisdiction) => (
              <option
                key={j.code}
                value={j.code}
                disabled={j.status === "pending"}
              >
                {j.name} {j.status === "pending" ? "(Coming soon)" : j.noIncomeTax ? "(0% state tax)" : ""}
              </option>
            ))}
          </optgroup>
          <optgroup label="Canada">
            {caJurisdictions.map((j: Jurisdiction) => (
              <option
                key={j.code}
                value={j.code}
                disabled={j.status === "pending"}
              >
                {j.name} {j.status === "pending" ? "(Coming soon)" : ""}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      {error && (
        <span id={errorId} className="text-xs text-[var(--warn)] font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
