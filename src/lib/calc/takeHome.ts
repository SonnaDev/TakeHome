import { TAX_YEAR } from "@/data/tax/2026/rules";
import { getJurisdiction } from "@/data/tax/2026/jurisdictions";
import { cents } from "./progressive";
import { usFederalAndPayroll, usStateAndPayroll } from "./us";
import { caFederalTax, caPayroll, caProvincialTax } from "./ca";
import type { TakeHomeInput, TakeHomeOutcome, TaxLine } from "./types";

export function calculateTakeHome(input: TakeHomeInput): TakeHomeOutcome {
  const { location, grossSalary } = input;
  const retirement = input.preTaxRetirement ?? 0;

  if (!Number.isFinite(grossSalary) || grossSalary <= 0 || grossSalary > 10_000_000) {
    return {
      ok: false,
      reason: "invalid-input",
      message: "Enter a salary between $1 and $10,000,000.",
    };
  }
  if (!Number.isFinite(retirement) || retirement < 0 || retirement > grossSalary) {
    return {
      ok: false,
      reason: "invalid-input",
      message: "Retirement contribution must be between 0 and your salary.",
    };
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
    const fed = usFederalAndPayroll(grossSalary, retirement);
    const state = usStateAndPayroll(location, grossSalary, retirement);

    const lines: TaxLine[] = [
      { label: "Federal income tax", amount: fed.federalIncomeTax },
      { label: "Social Security", amount: fed.socialSecurity },
      { label: "Medicare", amount: fed.medicare },
      ...state.taxLines,
    ];

    if (place.noIncomeTax) {
      assumptions.push(
        "Federal standard deduction; no itemized deductions or credits.",
        `${place.name} has no state tax on wage income.`,
      );
    } else {
      assumptions.push(
        "Standard deductions / exemptions applied; no itemized deductions or dependents.",
        `${place.name} state taxes and statutory employee payroll items included.`,
      );
    }

    const totalTax = cents(lines.reduce((s, l) => s + l.amount, 0));
    return {
      ok: true,
      location,
      currency: "USD",
      gross: grossSalary,
      lines,
      totalTax,
      takeHome: cents(grossSalary - retirement - totalTax),
      assumptions,
    };
  }

  // Canada
  const p = caPayroll(grossSalary);
  const prov = caProvincialTax(location, grossSalary, retirement, p);

  const lines: TaxLine[] = [
    { label: "Federal income tax", amount: caFederalTax(grossSalary, retirement, p) },
    { label: "CPP", amount: cents(p.cppBase + p.cppEnhanced + p.cpp2) },
    { label: "EI", amount: p.ei },
    ...prov.taxLines,
  ];

  assumptions.push(
    "Includes federal basic personal amount and Canada employment amount credit.",
    `${place.name} provincial tax brackets, non-refundable credits, and health levies included.`,
  );

  const totalTax = cents(lines.reduce((s, l) => s + l.amount, 0));
  return {
    ok: true,
    location,
    currency: "CAD",
    gross: grossSalary,
    lines,
    totalTax,
    takeHome: cents(grossSalary - retirement - totalTax),
    assumptions,
  };
}
