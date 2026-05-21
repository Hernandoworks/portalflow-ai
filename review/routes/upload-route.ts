import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: token.accessToken as string,
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({
        error: "No file uploaded",
      });
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const tempPath = path.join(os.tmpdir(), file.name);

    fs.writeFileSync(tempPath, buffer);

    const uploaded = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: ["1YD_3pLjVpHBWDW8xRmG82q44qGH5L_wn"],
      },
      media: {
        mimeType: file.type,
        body: fs.createReadStream(tempPath),
      },
      fields: "id,name,webViewLink",
    });

    fs.unlinkSync(tempPath);

    return NextResponse.json({
      success: true,
      file: uploaded.data,
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
