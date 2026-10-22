"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scissors, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Golden Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to website button */}
        <div className="mb-6">
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
              Sign in to manage ABCD Salon prices, deals & website content
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
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Password
              </label>
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
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white"
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
          <div className="mt-8 p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[11px] text-zinc-400">
            <div className="font-semibold text-[#f3e5ab] mb-0.5">Initial Setup Credentials:</div>
            <div>Username: <code className="text-white font-mono">admin</code></div>
            <div>Password: <code className="text-white font-mono">admin123</code></div>
            <div className="mt-1 text-zinc-400">
              (You can change your username & password inside the dashboard)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
