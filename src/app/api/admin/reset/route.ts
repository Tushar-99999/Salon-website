import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import { resetDatabaseToDefault } from "@/lib/db";


export async function POST(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = resetDatabaseToDefault();
    return NextResponse.json({
      success: true,
      message: "Database has been reset to default values successfully!",
      data
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset database." },
      { status: 500 }
    );
  }
}
