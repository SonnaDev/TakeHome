import type { Metadata } from "next";
import Link from "next/link";
import { JURISDICTIONS, type Jurisdiction } from "@/data/tax/2026/jurisdictions";

export const metadata: Metadata = {
  title: "Take-Home Pay Calculators by State & Province (2026) | TakeHome North",
  description:
    "Explore individual take-home pay calculators for all verified US states and Canadian provinces. Calculate exact net pay after statutory taxes and payroll deductions.",
};

function jurisdictionToSlug(j: Jurisdiction): string {
  return j.name.toLowerCase().replace(/\s+/g, "-");
}

export default function TakeHomeDirectoryPage() {
  const verifiedUS = JURISDICTIONS.filter(
    (j) => j.country === "US" && j.status === "verified",
  ).sort((a, b) => a.name.localeCompare(b.name));

  const verifiedCA = JURISDICTIONS.filter(
    (j) => j.country === "CA" && j.status === "verified",
  ).sort((a, b) => a.name.localeCompare(b.name));

  const pending = JURISDICTIONS.filter((j) => j.status === "pending").sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-[var(--text)]">
            TakeHome <span className="text-[var(--accent)]">North</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[var(--muted)]">
            <Link href="/compare" className="hover:text-[var(--text)]">Compare Offers</Link>
            <Link href="/data" className="hover:text-[var(--text)]">Data & Sources</Link>
            <Link href="/guides" className="hover:text-[var(--text)]">Guides</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
            Take-Home Pay Calculators by Location (2026)
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Select your state or province below to view statutory income tax brackets, sample salary tables, and local payroll deductions.
          </p>
        </div>

        {/* United States */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <h2 className="text-xl font-bold text-[var(--text)]">United States</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] font-semibold">
              Verified States
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {verifiedUS.map((j) => (
              <Link
                key={j.code}
                href={`/take-home/${jurisdictionToSlug(j)}`}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {j.name}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {j.noIncomeTax ? "0% State Wage Tax" : "Verified 2026 Rules"}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[var(--accent)]">Calculate →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Canada */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <h2 className="text-xl font-bold text-[var(--text)]">Canada</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] font-semibold">
              Verified Provinces
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {verifiedCA.map((j) => (
              <Link
                key={j.code}
                href={`/take-home/${jurisdictionToSlug(j)}`}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {j.name}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    Verified 2026 Brackets & BPA
                  </span>
                </div>
                <span className="text-xs font-semibold text-[var(--accent)]">Calculate →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Pending / Coming Soon */}
        <section className="flex flex-col gap-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[var(--muted)]">Other Jurisdictions (Coming Soon)</h3>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Per our non-negotiable policy, jurisdictions remain unselectable until their 2026 parameters are confirmed directly from official government tax gazettes.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {pending.map((j) => (
              <span
                key={j.code}
                className="px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]"
              >
                {j.name} (Coming soon)
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8 mt-12 text-xs text-[var(--muted)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 TakeHome North. Free and open salary comparison.</div>
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
