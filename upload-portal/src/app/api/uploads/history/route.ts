import { NextResponse } from "next/server";

import { getUploads } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    uploads: getUploads(),
  });
}
