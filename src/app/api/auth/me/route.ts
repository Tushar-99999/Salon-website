import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";


export async function GET(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      username: session.username,
      role: session.role
    }
  });
}
