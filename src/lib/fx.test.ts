import { describe, expect, it } from "vitest";
import {
  adjustForCostOfLiving,
  convertCadToUsd,
  convertCurrency,
  convertUsdToCad,
  FALLBACK_FX,
} from "./fx";
import { getCostOfLivingIndex } from "@/data/col";

describe("FX & Currency Conversion", () => {
  const rate = 1.4; // 1 USD = 1.40 CAD

  it("converts USD to CAD correctly", () => {
    expect(convertUsdToCad(100_000, rate)).toBe(140_000);
    expect(convertUsdToCad(50_000, rate)).toBe(70_000);
  });

  it("converts CAD to USD correctly", () => {
    expect(convertCadToUsd(140_000, rate)).toBe(100_000);
    expect(convertCadToUsd(70_000, rate)).toBe(50_000);
  });

  it("handles identical from/to currencies without loss", () => {
    expect(convertCurrency(100_000, "USD", "USD", rate)).toBe(100_000);
    expect(convertCurrency(100_000, "CAD", "CAD", rate)).toBe(100_000);
  });

  it("handles zero and invalid inputs gracefully", () => {
    expect(convertUsdToCad(0, rate)).toBe(0);
    expect(convertCadToUsd(-10, rate)).toBe(0);
    expect(convertUsdToCad(100, 0)).toBe(0);
  });

  it("has valid static fallback rate", () => {
    expect(FALLBACK_FX.usdToCad).toBeGreaterThan(1.0);
    expect(FALLBACK_FX.cadToUsd).toBeLessThan(1.0);
    expect(FALLBACK_FX.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("Cost of Living Adjustments", () => {
  it("normalizes income by cost of living index", () => {
    // A $100k salary in a place with index 110.7 (California) has purchasing power:
    // 100,000 / 1.107 = 90,334.24
    expect(adjustForCostOfLiving(100_000, 110.7)).toBeCloseTo(90_334.24, 2);

    // A $100k salary in a place with index 97.1 (Texas) has higher purchasing power:
    // 100,000 / 0.971 = 102,986.61
    expect(adjustForCostOfLiving(100_000, 97.1)).toBeCloseTo(102_986.61, 2);
  });

  it("retrieves verified official indexes for states and provinces", () => {
    const ca = getCostOfLivingIndex("US-CA");
    expect(ca).toBeDefined();
    expect(ca?.index).toBe(110.7);
    expect(ca?.source).toContain("fred.stlouisfed.org");

    const on = getCostOfLivingIndex("CA-ON");
    expect(on).toBeDefined();
    expect(on?.index).toBe(104.5);
    expect(on?.source).toContain("statcan.gc.ca");
  });

  it("returns undefined for places without official comparable data", () => {
    expect(getCostOfLivingIndex("US-XX")).toBeUndefined();
    expect(getCostOfLivingIndex("CA-QC")).toBeUndefined();
  });
});
