import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { COMPARISON_PAIRS, getComparisonPair } from "@/data/comparisons";
import { getJurisdiction } from "@/data/tax/2026/jurisdictions";
import { ComparisonTool } from "@/components/calculator/ComparisonTool";
import { encodeComparisonParams } from "@/lib/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARISON_PAIRS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pair = getComparisonPair(slug);
  if (!pair) return {};

  const ogUrl = `/api/og?${encodeComparisonParams({
    locA: pair.locA,
    salaryA: pair.salaryA,
    bonusA: 0,
    freqA: "annually",
    retireA: 0,
    healthA: 0,
    commuteA: 0,
    locB: pair.locB,
    salaryB: pair.salaryB,
    bonusB: 0,
    freqB: "annually",
    retireB: 0,
    healthB: 0,
    commuteB: 0,
    currency: pair.locA.startsWith("US") ? "USD" : "CAD",
    adjustCol: false,
  })}`;

  return {
    title: `${pair.title} | TakeHome North`,
    description: pair.metaDescription,
    alternates: {
      canonical: `https://takehomenorth.com/compare/${pair.slug}`,
    },
    openGraph: {
      title: pair.title,
      description: pair.metaDescription,
      url: `https://takehomenorth.com/compare/${pair.slug}`,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: pair.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pair.title,
      description: pair.metaDescription,
      images: [ogUrl],
    },
  };
}

export default async function ComparisonPairPage({ params }: PageProps) {
  const { slug } = await params;
  const pair = getComparisonPair(slug);
  if (!pair) notFound();

  const placeA = getJurisdiction(pair.locA);
  const placeB = getJurisdiction(pair.locB);

  // Schema.org Structured Data
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pair.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://takehomenorth.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Comparisons",
        item: "https://takehomenorth.com/compare",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${placeA?.name ?? pair.locA} vs ${placeB?.name ?? pair.locB}`,
        item: `https://takehomenorth.com/compare/${pair.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-extrabold text-xl tracking-tight text-[var(--text)]">
              TakeHome <span className="text-[var(--accent)]">North</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-[var(--muted)]">
            <Link href="/compare" className="hover:text-[var(--text)] text-[var(--accent)]">
              All Comparisons
            </Link>
            <Link href="/data" className="hover:text-[var(--text)]">
              Data & Sources
            </Link>
            <Link href="/guides" className="hover:text-[var(--text)] hidden sm:inline">
              Guides
            </Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb nav */}
      <div className="max-w-[1040px] w-full mx-auto px-4 sm:px-6 pt-4 text-xs text-[var(--muted)] flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:underline">Comparisons</Link>
        <span>/</span>
        <span className="text-[var(--text)] font-medium">{placeA?.name} vs {placeB?.name}</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Verified 2026 Tax Comparison
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text)] tracking-tight">
            {pair.heading}
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            {pair.metaDescription}
          </p>
        </div>

        {/* Live Interactive Comparison Tool Pre-loaded */}
        <Suspense fallback={<div className="h-96 rounded-xl bg-[var(--surface)] animate-pulse" />}>
          <ComparisonTool
            initialQuery={{
              locA: pair.locA,
              salaryA: pair.salaryA,
              locB: pair.locB,
              salaryB: pair.salaryB,
              currency: pair.locA.startsWith("US") ? "USD" : "CAD",
            }}
          />
        </Suspense>

        {/* In-Depth Location Analysis */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-[var(--text)] shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold">
            Key Differences: {placeA?.name} vs {placeB?.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col gap-2">
              <strong className="text-base text-[var(--text)]">Tax Structure & Deductions</strong>
              <p className="text-[var(--muted)] leading-relaxed">{pair.insights.taxDifferences}</p>
            </div>
            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col gap-2">
              <strong className="text-base text-[var(--text)]">Cost of Living & Housing</strong>
              <p className="text-[var(--muted)] leading-relaxed">{pair.insights.colAnalysis}</p>
            </div>
            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col gap-2">
              <strong className="text-base text-[var(--text)]">Healthcare & Benefits Model</strong>
              <p className="text-[var(--muted)] leading-relaxed">{pair.insights.healthcareAndBenefits}</p>
            </div>
            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col gap-2">
              <strong className="text-base text-[var(--text)]">Overall Verdict & Lifestyle</strong>
              <p className="text-[var(--muted)] leading-relaxed">{pair.insights.lifestyleVerdict}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section with Schema.org markup */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-[var(--text)] shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="flex flex-col divide-y divide-[var(--border)]">
            {pair.faqs.map((faq, index) => (
              <div key={index} className="py-4 flex flex-col gap-2">
                <h3 className="font-semibold text-base text-[var(--text)]">{faq.question}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8 mt-12 text-xs text-[var(--muted)]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 TakeHome North. Client-side verified salary comparisons.</div>
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
