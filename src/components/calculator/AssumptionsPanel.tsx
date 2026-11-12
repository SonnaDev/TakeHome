"use client";

import { AlertTriangle, Info } from "lucide-react";

interface AssumptionsPanelProps {
  assumptionsA?: string[];
  assumptionsB?: string[];
  locationAName?: string;
  locationBName?: string;
}

export function AssumptionsPanel({
  assumptionsA = [],
  assumptionsB = [],
  locationAName = "Offer A",
  locationBName = "Offer B",
}: AssumptionsPanelProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 text-xs sm:text-sm text-[var(--muted)]">
      <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-[var(--text)]">
        <Info className="w-4 h-4 text-[var(--accent)]" />
        <span>Assumptions & Calculation Methodology</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-[var(--text)]">{locationAName}:</span>
          <ul className="list-disc list-inside space-y-1">
            {assumptionsA.map((a, i) => (
              <li key={`a-${i}`}>{a}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-[var(--text)]">{locationBName}:</span>
          <ul className="list-disc list-inside space-y-1">
            {assumptionsB.map((b, i) => (
              <li key={`b-${i}`}>{b}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border)] flex items-start gap-2 text-xs text-[var(--warn)] font-medium">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> TakeHome North provides estimates based on published 2026 statutory tax brackets, standard deductions, and payroll ceilings for single filers with employment income. It does not account for individual itemized deductions, personal tax credits, foreign tax credits, or specific visa arrangements. This tool does not constitute tax, financial, or legal advice.
        </p>
      </div>
    </div>
  );
}
