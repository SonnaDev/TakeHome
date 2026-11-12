import { NextResponse } from "next/server";
import { FALLBACK_FX, type FxRateResult } from "@/lib/fx";

export const revalidate = 86400; // Cache daily

interface BoCObservation {
  d: string;
  FXUSDCAD: {
    v: string;
  };
}

interface BoCResponse {
  observations: BoCObservation[];
}

export async function GET() {
  try {
    const res = await fetch(
      "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1",
      {
        next: { revalidate: 86400 },
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      console.warn(`Bank of Canada API returned status ${res.status}, using cached fallback.`);
      return NextResponse.json(FALLBACK_FX);
    }

    const data = (await res.json()) as BoCResponse;
    const latest = data.observations?.[0];

    if (!latest || !latest.FXUSDCAD?.v) {
      console.warn("Bank of Canada API returned unexpected structure, using cached fallback.");
      return NextResponse.json(FALLBACK_FX);
    }

    const rate = parseFloat(latest.FXUSDCAD.v);
    if (!Number.isFinite(rate) || rate <= 0) {
      return NextResponse.json(FALLBACK_FX);
    }

    const payload: FxRateResult = {
      usdToCad: Math.round(rate * 10000) / 10000,
      cadToUsd: Math.round((1 / rate) * 10000) / 10000,
      date: latest.d,
      source: "Bank of Canada Valet API",
      isFallback: false,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Failed to fetch Bank of Canada exchange rate, returning cached fallback:", error);
    return NextResponse.json(FALLBACK_FX);
  }
}
