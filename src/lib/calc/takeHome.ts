import { TAX_YEAR } from "@/data/tax/2026/rules";
import { getJurisdiction } from "@/data/tax/2026/jurisdictions";
import { cents } from "./progressive";
import { usFederalAndPayroll } from "./us";
import { caFederalTax, caPayroll } from "./ca";
import type { TakeHomeInput, TakeHomeOutcome, TaxLine } from "./types";

export function calculateTakeHome(input: TakeHomeInput): TakeHomeOutcome {
  const { location, grossSalary } = input;
  const retirement = input.preTaxRetirement ?? 0;

  if (!Number.isFinite(grossSalary) || grossSalary <= 0 || grossSalary > 10_000_000) {
    return { ok: false, reason: "invalid-input", message: "Enter a salary between $1 and $10,000,000." };
  }
  if (!Number.isFinite(retirement) || retirement < 0 || retirement > grossSalary) {
    return { ok: false, reason: "invalid-input", message: "Retirement contribution must be between 0 and your salary." };
  }

  const place = getJurisdiction(location);
  if (!place) {
    return { ok: false, reason: "unknown-location", message: `Unknown location: ${location}` };
  }
  if (place.status !== "verified") {
    return {
      ok: false,
      reason: "pending-rules",
      message: `${place.name} tax rules are not verified yet, so we can't give a reliable number.`,
    };
  }

  const assumptions = [
    `Tax year ${TAX_YEAR}. Single filer, employee income only.`,
    "Estimate only. This is not tax or legal advice.",
  ];

  if (place.country === "US") {
    const t = usFederalAndPayroll(grossSalary, retirement);
    const lines: TaxLine[] = [
      { label: "Federal income tax", amount: t.federalIncomeTax },
      { label: "Social Security", amount: t.socialSecurity },
      { label: "Medicare", amount: t.medicare },
    ];
    assumptions.push(
      "Standard deduction; no itemized deductions or credits.",
      `${place.name} has no state tax on wage income.`,
    );
    const totalTax = cents(lines.reduce((s, l) => s + l.amount, 0));
    return {
      ok: true, location, currency: "USD", gross: grossSalary,
      lines, totalTax, takeHome: cents(grossSalary - retirement - totalTax), assumptions,
    };
  }

  // Canada: provincial rules are all "pending" for now, so this branch is
  // reachable only once a province is marked verified and given a calculator.
  const p = caPayroll(grossSalary);
  const lines: TaxLine[] = [
    { label: "Federal income tax", amount: caFederalTax(grossSalary, retirement, p) },
    { label: "CPP", amount: cents(p.cppBase + p.cppEnhanced + p.cpp2) },
    { label: "EI", amount: p.ei },
  ];
  assumptions.push("Excludes provincial tax until verified.");
  const totalTax = cents(lines.reduce((s, l) => s + l.amount, 0));
  return {
    ok: true, location, currency: "CAD", gross: grossSalary,
    lines, totalTax, takeHome: cents(grossSalary - retirement - totalTax), assumptions,
  };
}
