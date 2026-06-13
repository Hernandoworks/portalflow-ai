import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken || null,
    message: token.refreshToken
      ? "Copy the refreshToken value and set it as GOOGLE_REFRESH_TOKEN in your .env"
      : "No refresh token. Re-authenticate with ?prompt=consent to get one.",
  });
}
