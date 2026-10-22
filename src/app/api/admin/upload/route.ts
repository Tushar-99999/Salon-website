import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import fs from "fs";
import path from "path";


export async function POST(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file was uploaded." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const ext = path.extname(file.name) || ".jpg";
    const cleanExt = ext.toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
    if (!allowed.includes(cleanExt)) {
      return NextResponse.json(
        { success: false, message: "Unsupported image format. Allowed: JPG, PNG, WEBP, GIF, SVG" },
        { status: 400 }
      );
    }

    const uniqueName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${cleanExt}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully!",
        url: `/uploads/${uniqueName}`
      });
    } catch (diskErr) {
      console.warn("Disk write failed (likely serverless/read-only environment), falling back to data URL:", diskErr);
      const mime = file.type || "image/jpeg";
      const base64Url = `data:${mime};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully (optimized inline)!",
        url: base64Url
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process image upload." },
      { status: 500 }
    );
  }
}
