import { NextRequest, NextResponse } from "next/server";
import { runTippPipeline } from "@/lib/tipps-pipeline";

// Wird einmal täglich von Vercel Cron aufgerufen (siehe vercel.json).
// Vercel sendet dabei automatisch "Authorization: Bearer $CRON_SECRET",
// wenn die Umgebungsvariable CRON_SECRET gesetzt ist – so kann niemand
// sonst diese Route auslösen.

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const result = await runTippPipeline();
  return NextResponse.json(result);
}
