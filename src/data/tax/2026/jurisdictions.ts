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

const US_PENDING: [string, string][] = [
  ["AL", "Alabama"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"],
  ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"],
  ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"],
  ["MT", "Montana"], ["NE", "Nebraska"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"],
];

const CA_PENDING: [string, string][] = [
  ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"], ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"], ["NS", "Nova Scotia"], ["ON", "Ontario"],
  ["PE", "Prince Edward Island"], ["QC", "Quebec"], ["SK", "Saskatchewan"],
  ["NT", "Northwest Territories"], ["NU", "Nunavut"], ["YT", "Yukon"],
];

export const JURISDICTIONS: Jurisdiction[] = [
  ...US_NO_TAX.map(([code, name]): Jurisdiction => ({
    code: `US-${code}`, name, country: "US", status: "verified", noIncomeTax: true,
  })),
  ...US_PENDING.map(([code, name]): Jurisdiction => ({
    code: `US-${code}`, name, country: "US", status: "pending",
  })),
  ...CA_PENDING.map(([code, name]): Jurisdiction => ({
    code: `CA-${code}`, name, country: "CA", status: "pending",
  })),
];

export function getJurisdiction(code: string): Jurisdiction | undefined {
  return JURISDICTIONS.find((j) => j.code === code);
}
