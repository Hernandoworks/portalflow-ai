import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google } from "googleapis";
import { getPortals, savePortals } from "@/lib/storage";

export const runtime = "nodejs";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const oauth2Client =
      new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token:
        token.accessToken as string,
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const folder =
      await drive.files.create({
        requestBody: {
          name: body.name,
          mimeType:
            "application/vnd.google-apps.folder",
          parents: [
            process.env
              .GOOGLE_DRIVE_UPLOAD_FOLDER!,
          ],
        },

        fields:
          "id,name,webViewLink",
      });

    const portals = getPortals();

    const portal = {
      id: crypto.randomUUID(),

      name: body.name,

      slug: slugify(body.name),

      description: body.description,

      template: body.template || null,

      folderId: folder.data.id,

      folderLink:
        folder.data.webViewLink,

      allowUploads: true,

      uploadCount: 0,

      password:
        body.password || "",

      expiryDate:
        body.expiryDate || "",

      createdAt:
        new Date().toISOString(),
    };

    portals.push(portal);

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
