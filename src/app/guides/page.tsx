import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { GUIDES } from "@/data/guides";

export const metadata: Metadata = {
  title: "Cross-Border Tax & Compensation Guides (2026) | TakeHome North",
  description:
    "Comprehensive guides for US and Canadian technology workers. Cross-border taxes, remote employment, 401(k) vs RRSP, healthcare costs, and relocation realities.",
};

export default function GuidesDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-[var(--text)]">
            TakeHome <span className="text-[var(--accent)]">North</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[var(--muted)]">
            <Link href="/compare" className="hover:text-[var(--text)]">Compare Offers</Link>
            <Link href="/take-home" className="hover:text-[var(--text)]">Calculators</Link>
            <Link href="/data" className="hover:text-[var(--text)]">Data & Sources</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            In-Depth Resources
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
            Cross-Border Tax & Salary Guides
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Rigorous, verified guides written for engineers, founders, and cross-border workers navigating taxation, benefits, and currency across the US and Canada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GUIDES.map((g) => (
            <article
              key={g.slug}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex flex-col justify-between gap-4 group shadow-xs"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {g.readTimeMinutes} min read
                  </span>
                  <span>•</span>
                  <span>Updated {g.updatedDate}</span>
                </div>
                <h2 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  <Link href={`/guides/${g.slug}`}>{g.title}</Link>
                </h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {g.metaDescription}
                </p>
              </div>

              <Link
                href={`/guides/${g.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] group-hover:underline self-start pt-2"
              >
                <BookOpen className="w-3.5 h-3.5" /> Read Guide →
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8 mt-12 text-xs text-[var(--muted)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 TakeHome North. Editorial and research guides.</div>
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
