export type Country = "US" | "CA";

export type JurisdictionStatus =
  /** Rules verified; engine will calculate. */
  | "verified"
  /** Rules not yet verified against official sources; engine refuses. */
  | "pending";

export interface Jurisdiction {
  code: string;
  name: string;
  country: Country;
  status: JurisdictionStatus;
  /** True for US states with no wage income tax. */
  noIncomeTax?: boolean;
}

// US states with no state tax on wage income (stable, long-standing law).
const US_NO_TAX: [string, string][] = [
  ["AK", "Alaska"],
  ["FL", "Florida"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["WA", "Washington"],
  ["WY", "Wyoming"],
];

// US states with verified 2026 tax formulas & payroll items from official revenue agencies
const US_VERIFIED_TAX: [string, string][] = [
  ["CA", "California"],
  ["CO", "Colorado"],
  ["IL", "Illinois"],
  ["MA", "Massachusetts"],
  ["NY", "New York"],
  ["PA", "Pennsylvania"],
];

const US_PENDING: [string, string][] = [
  ["AL", "Alabama"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"],
  ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"],
  ["MT", "Montana"], ["NE", "Nebraska"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"],
];

// Canadian provinces with verified 2026 brackets and provincial rules
const CA_VERIFIED: [string, string][] = [
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["ON", "Ontario"],
];

const CA_PENDING: [string, string][] = [
  ["MB", "Manitoba"], ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"], ["NS", "Nova Scotia"],
  ["PE", "Prince Edward Island"], ["QC", "Quebec"], ["SK", "Saskatchewan"],
  ["NT", "Northwest Territories"], ["NU", "Nunavut"], ["YT", "Yukon"],
];

export const JURISDICTIONS: Jurisdiction[] = [
  ...US_NO_TAX.map(([code, name]): Jurisdiction => ({
    code: `US-${code}`, name, country: "US", status: "verified", noIncomeTax: true,
  })),
  ...US_VERIFIED_TAX.map(([code, name]): Jurisdiction => ({
    code: `US-${code}`, name, country: "US", status: "verified",
  })),
  ...US_PENDING.map(([code, name]): Jurisdiction => ({
    code: `US-${code}`, name, country: "US", status: "pending",
  })),
  ...CA_VERIFIED.map(([code, name]): Jurisdiction => ({
    code: `CA-${code}`, name, country: "CA", status: "verified",
  })),
  ...CA_PENDING.map(([code, name]): Jurisdiction => ({
    code: `CA-${code}`, name, country: "CA", status: "pending",
  })),
];

export function getJurisdiction(code: string): Jurisdiction | undefined {
  return JURISDICTIONS.find((j) => j.code === code);
}
