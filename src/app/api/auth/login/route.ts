import { NextRequest, NextResponse } from "next/server";
import { getSalonDb } from "@/lib/db";
import { verifyPassword, createSessionToken } from "@/lib/auth";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = getSalonDb();
    const admin = db.admin;

    // Check username
    if (admin.username.toLowerCase() !== username.trim().toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password hash
    const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session token
    const token = createSessionToken(admin.username);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { username: admin.username }
    });

    // Set secure HTTP-only cookie
    response.cookies.set("salon_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during login" },
      { status: 500 }
    );
  }
}
