"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scissors,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Forgot Password Modal State
  const [forgotOpen, setForgotOpen] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPasswordReset, setNewPasswordReset] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 600);
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recoveryKey: recoveryKey.trim(),
          newPassword: newPasswordReset
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResetMessage(data.message);
        setPassword(newPasswordReset);
        setTimeout(() => {
          setForgotOpen(false);
          setResetMessage("");
          setRecoveryKey("");
          setNewPasswordReset("");
        }, 2000);
      } else {
        setResetError(data.message || "Failed to reset password.");
      }
    } catch {
      setResetError("Network error. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Golden Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to website button */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Website</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#131317] border border-[#d4af37]/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black">
          {/* Logo Badge */}
          <div className="text-center flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#aa7c11] p-[2px] shadow-lg shadow-[#d4af37]/25 mb-3">
              <div className="w-full h-full bg-[#101014] rounded-[14px] flex items-center justify-center">
                <Scissors className="w-7 h-7 text-[#d4af37]" />
              </div>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Admin Portal
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Sign in to manage salon prices, deals & website content
            </p>
          </div>

          {/* Error / Success Alerts */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Login successful! Opening dashboard...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-[11px] text-[#d4af37] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl pl-10 pr-10 py-3 text-white text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-black bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7c11] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Default Credentials Tip */}
          <div className="mt-6 p-3.5 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[11px] text-zinc-400">
            <div className="font-semibold text-[#f3e5ab] mb-0.5">Initial Login:</div>
            <div>Username: <code className="text-white font-mono">admin</code></div>
            <div>Password: <code className="text-white font-mono">admin123</code></div>
            <div className="mt-1 text-zinc-400">
              Emergency recovery key: <code className="text-[#f3e5ab] font-mono">ABCD-RECOVERY-KEY-2026</code> (or your salon phone number)
            </div>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD RECOVERY MODAL */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#141419] border border-[#d4af37]/40 rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-serif-luxury font-bold text-white text-lg">
                  Emergency Password Reset
                </h3>
              </div>
              <button
                onClick={() => setForgotOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{resetError}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resetMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Recovery Key or Salon Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  placeholder="ABCD-RECOVERY-KEY-2026 or Salon Phone"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-white text-xs outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Use your master key <code className="text-[#d4af37]">ABCD-RECOVERY-KEY-2026</code> or your salon phone number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  New Password (Minimum 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordReset}
                  onChange={(e) => setNewPasswordReset(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-white text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
