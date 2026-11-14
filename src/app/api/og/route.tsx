import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { calculateTakeHome } from "@/lib/calc/takeHome";
import { getJurisdiction } from "@/data/tax/2026/jurisdictions";
import { convertCurrency, FALLBACK_FX, type Currency } from "@/lib/fx";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const locA = searchParams.get("locA") || "US-TX";
    const salaryA = Math.max(0, parseFloat(searchParams.get("salaryA") || "100000"));
    const locB = searchParams.get("locB") || "CA-ON";
    const salaryB = Math.max(0, parseFloat(searchParams.get("salaryB") || "120000"));
    const displayCurrency: Currency = searchParams.get("currency") === "CAD" ? "CAD" : "USD";

    const placeA = getJurisdiction(locA);
    const placeB = getJurisdiction(locB);

    const nameA = placeA?.name || locA;
    const nameB = placeB?.name || locB;

    const resA = calculateTakeHome({ location: locA, grossSalary: salaryA });
    const resB = calculateTakeHome({ location: locB, grossSalary: salaryB });

    const currA: Currency = placeA?.country === "CA" ? "CAD" : "USD";
    const currB: Currency = placeB?.country === "CA" ? "CAD" : "USD";

    const takeHomeLocalA = resA.ok ? resA.takeHome : salaryA * 0.7;
    const takeHomeLocalB = resB.ok ? resB.takeHome : salaryB * 0.7;

    const normA = convertCurrency(takeHomeLocalA, currA, displayCurrency, FALLBACK_FX.usdToCad);
    const normB = convertCurrency(takeHomeLocalB, currB, displayCurrency, FALLBACK_FX.usdToCad);

    const diff = Math.round(Math.abs(normA - normB));
    const winnerName = normA > normB ? nameA : nameB;
    const sym = displayCurrency === "USD" ? "$" : "C$";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0E1116",
            padding: "50px 60px",
            fontFamily: "system-ui, sans-serif",
            color: "#F2F4F7",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                  color: "#FFFFFF",
                }}
              >
                TakeHome <span style={{ color: "#2DD4BF" }}>North</span>
              </div>
              <div
                style={{
                  backgroundColor: "#161B22",
                  border: "1px solid #2A313B",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#9AA4B2",
                }}
              >
                2026 Cross-Border Engine
              </div>
            </div>
            <div style={{ fontSize: "16px", color: "#9AA4B2" }}>takehomenorth.com</div>
          </div>

          {/* Verdict Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#2DD4BF",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Take-Home Comparison
            </div>
            <div
              style={{
                fontSize: "44px",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#FFFFFF",
              }}
            >
              {winnerName} leaves you {sym}{diff.toLocaleString()}/yr more in net pay.
            </div>
          </div>

          {/* Side by side comparison cards */}
          <div style={{ display: "flex", gap: "24px" }}>
            {/* Offer A */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#161B22",
                border: "1px solid #2A313B",
                borderRadius: "16px",
                padding: "24px 28px",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "18px", color: "#9AA4B2", fontWeight: 600 }}>{nameA}</div>
              <div style={{ fontSize: "40px", fontWeight: 900, color: "#FFFFFF" }}>
                {sym}{Math.round(normA).toLocaleString()}
                <span style={{ fontSize: "18px", fontWeight: 500, color: "#9AA4B2" }}>/yr</span>
              </div>
              <div style={{ fontSize: "16px", color: "#2DD4BF" }}>
                {sym}{Math.round(normA / 12).toLocaleString()}/month net
              </div>
            </div>

            {/* Offer B */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#161B22",
                border: "1px solid #2A313B",
                borderRadius: "16px",
                padding: "24px 28px",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "18px", color: "#9AA4B2", fontWeight: 600 }}>{nameB}</div>
              <div style={{ fontSize: "40px", fontWeight: 900, color: "#FFFFFF" }}>
                {sym}{Math.round(normB).toLocaleString()}
                <span style={{ fontSize: "18px", fontWeight: 500, color: "#9AA4B2" }}>/yr</span>
              </div>
              <div style={{ fontSize: "16px", color: "#2DD4BF" }}>
                {sym}{Math.round(normB / 12).toLocaleString()}/month net
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#9AA4B2",
              borderTop: "1px solid #2A313B",
              paddingTop: "16px",
            }}
          >
            <div>Statutory federal & state/provincial tax calculation</div>
            <div>Free & zero-login • Browser client-side computation</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("OpenGraph image generation failed:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
