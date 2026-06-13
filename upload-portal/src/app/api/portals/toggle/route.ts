import { NextRequest, NextResponse } from "next/server";

import {
  getPortals,
  savePortals,
} from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const portals = getPortals();

    const portal = portals.find(
      (p: any) => p.id === body.id
    );

    if (!portal) {
      return NextResponse.json(
        {
          error: "Portal not found",
        },
        {
          status: 404,
        }
      );
    }

    portal.allowUploads =
      !portal.allowUploads;

    savePortals(portals);

    return NextResponse.json({
      success: true,
      portal,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
