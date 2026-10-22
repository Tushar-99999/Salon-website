import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import { getSalonInfo, updateSalonInfo } from "@/lib/db";


export async function GET(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const info = getSalonInfo();
  return NextResponse.json({ success: true, data: info });
}

export async function PUT(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = updateSalonInfo(body);
    return NextResponse.json({
      success: true,
      message: "Salon information updated successfully!",
      data: updated
    });
  } catch (error) {
    console.error("Error updating salon info:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update salon information" },
      { status: 500 }
    );
  }
}
