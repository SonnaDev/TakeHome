import { Suspense } from "react";
import { ComparisonTool } from "@/components/calculator/ComparisonTool";
import { parseComparisonParams } from "@/lib/schema";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialQuery = parseComparisonParams(resolvedParams);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-[var(--text)]">
              TakeHome <span className="text-[var(--accent)]">North</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]">
              2026 Engine
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-[var(--muted)]">
            <a href="/data" className="hover:text-[var(--text)] transition-colors">
              Data & Sources
            </a>
            <a href="/guides" className="hover:text-[var(--text)] transition-colors hidden sm:inline">
              Guides
            </a>
          </nav>
        </div>
      </header>

      {/* Main Comparison Area */}
      <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Hero headline - concise so tool is above the fold on 375px phone */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
            US vs Canada Take-Home Pay Comparison
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            See what job offers actually leave you after 2026 federal & state/provincial taxes, payroll deductions, and cost of living.
          </p>
        </div>

        {/* Tool */}
        <Suspense fallback={<div className="h-96 rounded-xl bg-[var(--surface)] animate-pulse" />}>
          <ComparisonTool initialQuery={initialQuery} />
        </Suspense>

        {/* Explanatory Context Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col gap-4 text-[var(--text)]">
          <h2 className="text-xl font-bold">How Cross-Border Take-Home Comparison Works</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Comparing salary offers between the United States and Canada requires more than a simple currency exchange rate. TakeHome North runs full statutory payroll formulas for both countries:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col gap-1.5">
              <strong className="text-[var(--text)]">1. True Statutory Tax Brackets</strong>
              <p className="text-[var(--muted)]">
                Computes federal and state/provincial progressive income brackets, standard deductions, personal exemption credits, and high-income surtaxes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col gap-1.5">
              <strong className="text-[var(--text)]">2. Mandatory Payroll Deductions</strong>
              <p className="text-[var(--muted)]">
                Calculates US Social Security, Medicare, and state disability (SDI/PFL) alongside Canadian CPP/CPP2 and Employment Insurance (EI).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col gap-1.5">
              <strong className="text-[var(--text)]">3. Real Cost-of-Living Purchasing Power</strong>
              <p className="text-[var(--muted)]">
                Adjusts take-home pay using official Bureau of Economic Analysis (BEA) Regional Price Parities and Statistics Canada inter-city price differentials.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8 mt-12 text-xs text-[var(--muted)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© 2026 TakeHome North. Free and open salary tool.</span>
            <span className="hidden sm:inline">•</span>
            <span>100% private: salary data never leaves your browser.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-[var(--text)]">Privacy</a>
            <a href="/terms" className="hover:text-[var(--text)]">Terms</a>
            <a href="/disclaimer" className="hover:text-[var(--text)]">Disclaimer</a>
            <a href="/data" className="hover:text-[var(--text)]">Data Sources</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
