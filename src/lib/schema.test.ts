import { describe, expect, it } from "vitest";
import {
  encodeComparisonParams,
  parseComparisonParams,
  type ComparisonQuery,
} from "./schema";

describe("URL schema parsing & encoding", () => {
  it("encodes and parses comparison query params symmetrically", () => {
    const original: ComparisonQuery = {
      locA: "US-CA",
      salaryA: 150_000,
      bonusA: 20_000,
      freqA: "bi-weekly",
      retireA: 10_000,
      healthA: 250,
      commuteA: 100,

      locB: "CA-BC",
      salaryB: 180_000,
      bonusB: 15_000,
      freqB: "monthly",
      retireB: 12_000,
      healthB: 0,
      commuteB: 80,

      currency: "CAD",
      adjustCol: true,
    };

    const encoded = encodeComparisonParams(original);
    const searchParams = new URLSearchParams(encoded);
    const decoded = parseComparisonParams(searchParams);

    expect(decoded.locA).toBe(original.locA);
    expect(decoded.salaryA).toBe(original.salaryA);
    expect(decoded.bonusA).toBe(original.bonusA);
    expect(decoded.freqA).toBe(original.freqA);
    expect(decoded.retireA).toBe(original.retireA);
    expect(decoded.healthA).toBe(original.healthA);
    expect(decoded.commuteA).toBe(original.commuteA);

    expect(decoded.locB).toBe(original.locB);
    expect(decoded.salaryB).toBe(original.salaryB);
    expect(decoded.bonusB).toBe(original.bonusB);
    expect(decoded.freqB).toBe(original.freqB);
    expect(decoded.retireB).toBe(original.retireB);

    expect(decoded.currency).toBe("CAD");
    expect(decoded.adjustCol).toBe(true);
  });

  it("safely falls back on malformed or missing query params", () => {
    const decoded = parseComparisonParams(new URLSearchParams("salaryA=not-a-number&locA="));
    expect(decoded.salaryA).toBe(100_000);
    expect(decoded.locA).toBe("US-TX");
    expect(decoded.salaryB).toBe(120_000);
    expect(decoded.locB).toBe("CA-ON");
    expect(decoded.currency).toBe("USD");
    expect(decoded.adjustCol).toBe(false);
  });
});
