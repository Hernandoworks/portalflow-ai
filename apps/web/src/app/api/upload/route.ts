import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import os from "os";

import {
  getPortals,
  savePortals,
  getUploads,
  saveUploads,
} from "@/lib/storage";

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

    const portalId = String(
      formData.get("portalId")
    );

    const portals = getPortals();

    const portal = portals.find(
      (p: any) => p.slug === portalId
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

    if (!portal.allowUploads) {
      return NextResponse.json(
        {
          error: "Uploads disabled",
        },
        {
          status: 403,
        }
      );
    }

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const tempPath = path.join(
      os.tmpdir(),
      file.name
    );

    fs.writeFileSync(tempPath, buffer);

    const uploaded = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [portal.folderId],
      },

      media: {
        mimeType: file.type,
        body: fs.createReadStream(tempPath),
      },

      fields:
        "id,name,webViewLink,webContentLink",
    });

    fs.unlinkSync(tempPath);

    const uploads = getUploads();

    const referenceId =
      "UPL-" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    uploads.push({
      id: crypto.randomUUID(),

      referenceId,

      portalId: portal.slug,

      fileName: file.name,

      driveFileId: uploaded.data.id,

      driveLink:
        uploaded.data.webViewLink,

      uploadedAt:
        new Date().toISOString(),
    });

    saveUploads(uploads);

    portal.uploadCount += 1;

    savePortals(portals);

    return NextResponse.json({
      success: true,

      referenceId,

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
