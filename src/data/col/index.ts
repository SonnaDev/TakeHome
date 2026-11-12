export interface CostOfLivingIndex {
  code: string;
  name: string;
  country: "US" | "CA";
  /** Base = 100 (national average for US, 11-city composite average for Canada) */
  index: number;
  source: string;
  sourceName: string;
}

/**
 * Official Cost of Living Data:
 * - US: Bureau of Economic Analysis (BEA) Table SARPP (Regional Price Parities by State: All Items)
 *   Source: https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area
 * - Canada: Statistics Canada Table 18-10-0003-01 (Inter-city indexes of price differentials)
 *   Source: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000301
 */
export const COST_OF_LIVING_DATA: Record<string, CostOfLivingIndex> = {
  // US States (BEA Table SARPP, 100 = US national baseline)
  "US-CA": {
    code: "US-CA",
    name: "California",
    country: "US",
    index: 110.7,
    source: "https://fred.stlouisfed.org/series/CARPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-NY": {
    code: "US-NY",
    name: "New York",
    country: "US",
    index: 107.9,
    source: "https://fred.stlouisfed.org/series/NYRPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-WA": {
    code: "US-WA",
    name: "Washington",
    country: "US",
    index: 108.9,
    source: "https://fred.stlouisfed.org/series/WARPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-MA": {
    code: "US-MA",
    name: "Massachusetts",
    country: "US",
    index: 109.4,
    source: "https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-FL": {
    code: "US-FL",
    name: "Florida",
    country: "US",
    index: 103.4,
    source: "https://fred.stlouisfed.org/series/FLRPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-CO": {
    code: "US-CO",
    name: "Colorado",
    country: "US",
    index: 103.2,
    source: "https://fred.stlouisfed.org/series/CORPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-IL": {
    code: "US-IL",
    name: "Illinois",
    country: "US",
    index: 98.4,
    source: "https://fred.stlouisfed.org/series/ILRPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-TX": {
    code: "US-TX",
    name: "Texas",
    country: "US",
    index: 97.1,
    source: "https://fred.stlouisfed.org/series/TXRPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },
  "US-PA": {
    code: "US-PA",
    name: "Pennsylvania",
    country: "US",
    index: 96.5,
    source: "https://fred.stlouisfed.org/series/PARPPALL",
    sourceName: "U.S. Bureau of Economic Analysis (BEA Table SARPP)",
  },

  // Canada Provinces (Statistics Canada Table 18-10-0003-01, 100 = 11-city composite baseline)
  "CA-ON": {
    code: "CA-ON",
    name: "Ontario",
    country: "CA",
    index: 104.5,
    source: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000301",
    sourceName: "Statistics Canada (Table 18-10-0003-01)",
  },
  "CA-BC": {
    code: "CA-BC",
    name: "British Columbia",
    country: "CA",
    index: 108.2,
    source: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000301",
    sourceName: "Statistics Canada (Table 18-10-0003-01)",
  },
  "CA-AB": {
    code: "CA-AB",
    name: "Alberta",
    country: "CA",
    index: 98.7,
    source: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000301",
    sourceName: "Statistics Canada (Table 18-10-0003-01)",
  },
};

/**
 * Retrieve cost of living index. If no reliable official source exists,
 * returns undefined so UI hides the cost-of-living line.
 */
export function getCostOfLivingIndex(locationCode: string): CostOfLivingIndex | undefined {
  return COST_OF_LIVING_DATA[locationCode];
}
