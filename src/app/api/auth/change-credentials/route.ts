import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import { getSalonDb, saveSalonDb } from "@/lib/db";
import { hashPassword, verifyPassword, createSessionToken } from "@/lib/auth";


export async function POST(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is required to verify changes." },
        { status: 400 }
      );
    }

    const db = getSalonDb();
    const admin = db.admin;

    // Verify current password
    const isCurrentValid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect current password." },
        { status: 400 }
      );
    }

    // Update username if provided
    if (newUsername && newUsername.trim()) {
      admin.username = newUsername.trim();
    }

    // Update password if provided
    if (newPassword && newPassword.length >= 6) {
      const { hash, salt } = hashPassword(newPassword);
      admin.passwordHash = hash;
      admin.salt = salt;
    } else if (newPassword && newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    saveSalonDb(db);

    // Refresh token with new username
    const token = createSessionToken(admin.username);
    const response = NextResponse.json({
      success: true,
      message: "Credentials updated successfully!",
      user: { username: admin.username }
    });

    response.cookies.set("salon_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Change credentials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update credentials." },
      { status: 500 }
    );
  }
}
