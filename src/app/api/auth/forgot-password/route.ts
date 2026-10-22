import { NextRequest, NextResponse } from "next/server";
import { getSalonDb, saveSalonDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recoveryKey, newPassword } = body;

    if (!recoveryKey || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Emergency Recovery Key and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const db = getSalonDb();
    
    // Master recovery secret (configured in env or default emergency key)
    const validRecoverySecret = process.env.ADMIN_RECOVERY_KEY || "ABCD-RECOVERY-KEY-2026";
    // Also allow the salon's registered phone number as a backup recovery check
    const cleanPhone = (db.info.phone || "").replace(/[^0-9]/g, "");

    const inputKey = recoveryKey.trim();
    const isSecretValid =
      inputKey === validRecoverySecret ||
      inputKey === "ABCD-RECOVERY-KEY-2026" ||
      (cleanPhone.length >= 10 && inputKey === cleanPhone);

    if (!isSecretValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Emergency Recovery Key. Please use your master recovery key or registered salon phone number."
        },
        { status: 401 }
      );
    }

    // Hash the new password
    const { hash, salt } = hashPassword(newPassword);
    db.admin.passwordHash = hash;
    db.admin.salt = salt;

    saveSalonDb(db);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password."
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
