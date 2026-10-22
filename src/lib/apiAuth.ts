import { NextRequest } from "next/server";
import { verifySessionToken, SessionPayload } from "@/lib/auth";

export function authenticateRequest(req: NextRequest): SessionPayload | null {
  // Check cookie first
  const cookieToken = req.cookies.get("salon_admin_token")?.value;
  if (cookieToken) {
    const verified = verifySessionToken(cookieToken);
    if (verified) return verified;
  }

  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const headerToken = authHeader.substring(7);
    const verified = verifySessionToken(headerToken);
    if (verified) return verified;
  }

  return null;
}
