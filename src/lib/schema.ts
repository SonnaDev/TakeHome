import { z } from "zod";

export const PayFrequencySchema = z.enum([
  "annually",
  "monthly",
  "semi-monthly",
  "bi-weekly",
  "weekly",
]);
export type PayFrequency = z.infer<typeof PayFrequencySchema>;

export const OfferFormSchema = z.object({
  location: z.string().min(1),
  grossSalary: z.coerce.number().min(0).max(10_000_000),
  bonus: z.coerce.number().min(0).max(10_000_000).default(0),
  payFrequency: PayFrequencySchema.default("annually"),
  preTaxRetirement: z.coerce.number().min(0).max(10_000_000).default(0),
  healthPremiumMonthly: z.coerce.number().min(0).max(100_000).default(0),
  commuteMonthly: z.coerce.number().min(0).max(100_000).default(0),
});
export type OfferFormData = z.infer<typeof OfferFormSchema>;

export const ComparisonQuerySchema = z.object({
  locA: z.string().min(1).catch("US-TX"),
  salaryA: z.coerce.number().min(0).max(10_000_000).catch(100_000),
  bonusA: z.coerce.number().min(0).catch(0),
  freqA: PayFrequencySchema.catch("annually"),
  retireA: z.coerce.number().min(0).catch(0),
  healthA: z.coerce.number().min(0).catch(0),
  commuteA: z.coerce.number().min(0).catch(0),

  locB: z.string().min(1).catch("CA-ON"),
  salaryB: z.coerce.number().min(0).max(10_000_000).catch(120_000),
  bonusB: z.coerce.number().min(0).catch(0),
  freqB: PayFrequencySchema.catch("annually"),
  retireB: z.coerce.number().min(0).catch(0),
  healthB: z.coerce.number().min(0).catch(0),
  commuteB: z.coerce.number().min(0).catch(0),

  currency: z.enum(["USD", "CAD"]).catch("USD"),
  adjustCol: z
    .enum(["true", "false", "1", "0"])
    .catch("false")
    .transform((val) => val === "true" || val === "1"),
});
export type ComparisonQuery = z.infer<typeof ComparisonQuerySchema>;

export function encodeComparisonParams(query: ComparisonQuery): string {
  const p = new URLSearchParams();
  p.set("locA", query.locA);
  p.set("salaryA", query.salaryA.toString());
  if (query.bonusA > 0) p.set("bonusA", query.bonusA.toString());
  if (query.freqA !== "annually") p.set("freqA", query.freqA);
  if (query.retireA > 0) p.set("retireA", query.retireA.toString());
  if (query.healthA > 0) p.set("healthA", query.healthA.toString());
  if (query.commuteA > 0) p.set("commuteA", query.commuteA.toString());

  p.set("locB", query.locB);
  p.set("salaryB", query.salaryB.toString());
  if (query.bonusB > 0) p.set("bonusB", query.bonusB.toString());
  if (query.freqB !== "annually") p.set("freqB", query.freqB);
  if (query.retireB > 0) p.set("retireB", query.retireB.toString());
  if (query.healthB > 0) p.set("healthB", query.healthB.toString());
  if (query.commuteB > 0) p.set("commuteB", query.commuteB.toString());

  p.set("currency", query.currency);
  if (query.adjustCol) p.set("adjustCol", "true");

  return p.toString();
}

export function parseComparisonParams(
  searchParams: Record<string, unknown> | URLSearchParams | Partial<ComparisonQuery>,
): ComparisonQuery {
  const raw: Record<string, unknown> = {};
  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((v, k) => {
      raw[k] = v;
    });
  } else if (searchParams && typeof searchParams === "object") {
    for (const [k, v] of Object.entries(searchParams)) {
      raw[k] = Array.isArray(v) ? v[0] : v;
    }
  }
  return ComparisonQuerySchema.parse(raw);
}
