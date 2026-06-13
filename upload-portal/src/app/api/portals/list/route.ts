import { NextResponse } from "next/server";
import { getPortals } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    portals: getPortals(),
  });
}
