import type { Metadata } from "next";
import Link from "next/link";
import { COMPARISON_PAIRS } from "@/data/comparisons";
import { getJurisdiction } from "@/data/tax/2026/jurisdictions";

export const metadata: Metadata = {
  title: "Compare Take-Home Pay Across US States and Canadian Provinces (2026)",
  description:
    "Browse cross-border salary and tax comparisons between US states and Canadian provinces. Calculate real take-home pay after federal, state, and provincial taxes.",
};

export default function CompareDirectoryPage() {
  const crossBorderPairs = COMPARISON_PAIRS.filter(
    (p) =>
      (p.locA.startsWith("US") && p.locB.startsWith("CA")) ||
      (p.locA.startsWith("CA") && p.locB.startsWith("US")),
  );

  const usPairs = COMPARISON_PAIRS.filter(
    (p) => p.locA.startsWith("US") && p.locB.startsWith("US"),
  );

  const caPairs = COMPARISON_PAIRS.filter(
    (p) => p.locA.startsWith("CA") && p.locB.startsWith("CA"),
  );

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-[var(--text)]">
            TakeHome <span className="text-[var(--accent)]">North</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[var(--muted)]">
            <Link href="/data" className="hover:text-[var(--text)]">Data & Sources</Link>
            <Link href="/guides" className="hover:text-[var(--text)]">Guides</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
            Salary & Tax Comparisons Directory
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Select any pair below to explore in-depth tax differences, payroll withholding, cost of living, and net take-home pay.
          </p>
        </div>

        {/* Cross Border */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <h2 className="text-xl font-bold text-[var(--text)]">US vs Canada Comparisons</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
              Cross-Border
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {crossBorderPairs.map((p) => {
              const nameA = getJurisdiction(p.locA)?.name;
              const nameB = getJurisdiction(p.locB)?.name;
              return (
                <Link
                  key={p.slug}
                  href={`/compare/${p.slug}`}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex flex-col gap-1 group shadow-2xs"
                >
                  <span className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {nameA} vs {nameB}
                  </span>
                  <span className="text-xs text-[var(--muted)] line-clamp-2">
                    {p.metaDescription}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* US to US */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <h2 className="text-xl font-bold text-[var(--text)]">US State-to-State Comparisons</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {usPairs.map((p) => {
              const nameA = getJurisdiction(p.locA)?.name;
              const nameB = getJurisdiction(p.locB)?.name;
              return (
                <Link
                  key={p.slug}
                  href={`/compare/${p.slug}`}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex flex-col gap-1 group shadow-2xs"
                >
                  <span className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {nameA} vs {nameB}
                  </span>
                  <span className="text-xs text-[var(--muted)] line-clamp-2">
                    {p.metaDescription}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Canada to Canada */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <h2 className="text-xl font-bold text-[var(--text)]">Canadian Interprovincial Comparisons</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {caPairs.map((p) => {
              const nameA = getJurisdiction(p.locA)?.name;
              const nameB = getJurisdiction(p.locB)?.name;
              return (
                <Link
                  key={p.slug}
                  href={`/compare/${p.slug}`}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex flex-col gap-1 group shadow-2xs"
                >
                  <span className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {nameA} vs {nameB}
                  </span>
                  <span className="text-xs text-[var(--muted)] line-clamp-2">
                    {p.metaDescription}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8 mt-12 text-xs text-[var(--muted)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 TakeHome North. Free comparison tool for US and Canadian workers.</div>
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
