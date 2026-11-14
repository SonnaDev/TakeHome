import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { JURISDICTIONS, type Jurisdiction } from "@/data/tax/2026/jurisdictions";
import { calculateTakeHome } from "@/lib/calc/takeHome";
import { getCostOfLivingIndex } from "@/data/col";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function jurisdictionToSlug(j: Jurisdiction): string {
  return j.name.toLowerCase().replace(/\s+/g, "-");
}

function findJurisdictionBySlug(slug: string): Jurisdiction | undefined {
  return JURISDICTIONS.find(
    (j) => j.status === "verified" && jurisdictionToSlug(j) === slug.toLowerCase(),
  );
}

export async function generateStaticParams() {
  return JURISDICTIONS.filter((j) => j.status === "verified").map((j) => ({
    slug: jurisdictionToSlug(j),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = findJurisdictionBySlug(slug);
  if (!place) return {};

  const title = `${place.name} Take-Home Pay Calculator (2026 Tax Year)`;
  const description = `Calculate your real take-home pay in ${place.name} after 2026 federal & ${
    place.country === "US" ? "state" : "provincial"
  } income taxes, standard deduction, and payroll withholdings.`;

  return {
    title: `${title} | TakeHome North`,
    description,
    alternates: {
      canonical: `https://takehomenorth.com/take-home/${slug}`,
    },
  };
}

export default async function TakeHomeLocationPage({ params }: PageProps) {
  const { slug } = await params;
  const place = findJurisdictionBySlug(slug);
  if (!place) notFound();

  const col = getCostOfLivingIndex(place.code);
  const sampleSalaries = [40_000, 60_000, 80_000, 100_000, 125_000, 150_000, 200_000, 300_000];

  const sampleRows = sampleSalaries.map((salary) => {
    const res = calculateTakeHome({ location: place.code, grossSalary: salary });
    if (!res.ok) throw new Error("Calculation failed");
    return {
      gross: salary,
      totalTax: res.totalTax,
      takeHome: res.takeHome,
      monthly: Math.round(res.takeHome / 12),
      effectiveRate: ((res.totalTax / salary) * 100).toFixed(1),
    };
  });

  const sym = place.country === "US" ? "$" : "C$";

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the take-home pay on $100,000 in ${place.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `For a single filer in ${place.name} during tax year 2026, an annual salary of $100,000 yields an estimated net take-home pay of ${sym}${sampleRows.find(r => r.gross === 100000)?.takeHome.toLocaleString()} (approx. ${sym}${sampleRows.find(r => r.gross === 100000)?.monthly.toLocaleString()}/month), representing an effective tax and payroll rate of ${sampleRows.find(r => r.gross === 100000)?.effectiveRate}%.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${place.name} have state/provincial income tax?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: place.noIncomeTax
            ? `${place.name} has no state tax on wage income. Workers only pay federal income tax and FICA.`
            : `${place.name} levies personal income tax on employee income according to statutory 2026 tax brackets.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-[var(--text)]">
            TakeHome <span className="text-[var(--accent)]">North</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[var(--muted)]">
            <Link href="/take-home" className="hover:text-[var(--text)] text-[var(--accent)]">
              All Locations
            </Link>
            <Link href="/compare" className="hover:text-[var(--text)]">Compare Offers</Link>
            <Link href="/data" className="hover:text-[var(--text)]">Data & Sources</Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-[1040px] w-full mx-auto px-4 sm:px-6 pt-4 text-xs text-[var(--muted)] flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/take-home" className="hover:underline">Take-Home</Link>
        <span>/</span>
        <span className="text-[var(--text)] font-medium">{place.name}</span>
      </div>

      <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Tax Year 2026 Calculator
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
            {place.name} Take-Home Pay & Tax Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Estimate your exact after-tax salary in {place.name}. Includes 2026 federal brackets, {place.country === "US" ? "state" : "provincial"} taxes, standard deductions, and payroll deductions.
          </p>
        </div>

        {/* Quick Facts Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-1">
            <span className="text-xs text-[var(--muted)] font-medium">Jurisdiction</span>
            <span className="text-lg font-bold text-[var(--text)]">{place.name}</span>
            <span className="text-xs text-[var(--accent)]">{place.country === "US" ? "United States" : "Canada"}</span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-1">
            <span className="text-xs text-[var(--muted)] font-medium">Local Income Tax Status</span>
            <span className="text-lg font-bold text-[var(--text)]">
              {place.noIncomeTax ? "0% State Tax" : "Progressive / Statutory"}
            </span>
            <span className="text-xs text-[var(--muted)]">Tax Year 2026 Verified</span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-1">
            <span className="text-xs text-[var(--muted)] font-medium">Cost of Living Index</span>
            <span className="text-lg font-bold text-[var(--text)]">
              {col ? `${col.index} (Base 100)` : "State Average"}
            </span>
            <span className="text-xs text-[var(--muted)]">
              {col ? col.sourceName : "Official Source"}
            </span>
          </div>
        </div>

        {/* Salary Benchmark Table */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              {place.name} Salary Take-Home Table (2026)
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Annual and monthly net income for single employee filers (local currency: {sym})
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase tracking-wider">
                  <th scope="col" className="py-3 px-2 font-semibold">Gross Salary</th>
                  <th scope="col" className="py-3 px-2 font-semibold text-right">Total Deductions</th>
                  <th scope="col" className="py-3 px-2 font-semibold text-right">Effective Rate</th>
                  <th scope="col" className="py-3 px-2 font-semibold text-right">Monthly Net</th>
                  <th scope="col" className="py-3 px-2 font-semibold text-right">Annual Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60 text-[var(--text)]">
                {sampleRows.map((row) => (
                  <tr key={row.gross} className="hover:bg-[var(--bg)]/50 transition-colors">
                    <td className="py-3 px-2 font-bold tabular-nums">
                      {sym}{row.gross.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums text-[var(--warn)]">
                      {sym}{Math.round(row.totalTax).toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums font-medium text-[var(--muted)]">
                      {row.effectiveRate}%
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums font-semibold">
                      {sym}{row.monthly.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums font-bold text-[var(--win)] text-base">
                      {sym}{Math.round(row.takeHome).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Call to action to compare */}
        <section className="bg-[var(--accent)]/5 border border-[var(--accent)]/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-[var(--text)]">
              Comparing an offer in {place.name} to another location?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              Use our interactive comparison tool to compare against any other state or Canadian province side-by-side.
            </p>
          </div>
          <Link
            href={`/?locA=${place.code}`}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-bold hover:opacity-90 transition-opacity shrink-0 shadow-2xs"
          >
            Compare {place.name} Offers →
          </Link>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8 mt-12 text-xs text-[var(--muted)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 TakeHome North. Verified statutory tax calculations.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[var(--text)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text)]">Terms</Link>
            <Link href="/disclaimer" className="hover:text-[var(--text)]">Disclaimer</Link>
            <Link href="/data" className="hover:text-[var(--text)]">Data Sources</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
