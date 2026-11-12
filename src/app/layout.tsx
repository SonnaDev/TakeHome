import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TakeHome North — US & Canada Salary and Cost-of-Living Comparison",
  description:
    "Compare job offers and locations across US states and Canadian provinces after tax, payroll deductions, and cost of living. Free, zero-login, and 100% private.",
  metadataBase: new URL("https://takehomenorth.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
