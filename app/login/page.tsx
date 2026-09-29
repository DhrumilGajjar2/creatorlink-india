"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────── */

interface FormState {
  email: string;
  password: string;
}

/* ────────────────────────────────────────────────
   LEFT PANEL (Editorial Dark Prestige)
──────────────────────────────────────────────── */

function LeftPanel() {
  const perks = [
    "Real-time click analytics & conversion attribution",
    "Automated Amazon, Flipkart & Myntra affiliate tagging",
    "Direct digital product checkout via Razorpay in INR",
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between p-14 relative bg-[#09090b] text-white border-r border-neutral-800">
      {/* Brand logo */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="text-2xl">🔗</span>
          <span className="font-bold text-lg tracking-tight text-white">
            CreatorLink <span className="text-zinc-400 font-normal">India</span>
          </span>
        </Link>
      </div>

      {/* Copy */}
      <div className="relative z-10 max-w-md">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
          Creator Portal
        </span>
        <h2 className="font-bold text-3xl leading-tight text-white tracking-tight mb-4">
          Welcome back.<br />Your audience awaits.
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Sign in to check today&apos;s link clicks, update your product offerings, and track affiliate earnings.
        </p>

        <ul className="space-y-3.5">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-white/10 text-white flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Creator Quote */}
      <div className="relative z-10 rounded-2xl p-5 bg-white/[0.04] border border-white/[0.08]">
        <p className="text-zinc-200 text-xs sm:text-sm italic leading-relaxed">
          &ldquo;CreatorLink helped double my monthly brand conversions. The clean layout makes all the difference.&rdquo;
        </p>
        <p className="text-zinc-400 text-xs mt-2 font-medium">— @priya_fashion · Mumbai</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   SPINNER
──────────────────────────────────────────────── */

function Spinner() {
  return (
    <svg
      className="animate-spin-slow"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/* ────────────────────────────────────────────────
   LOGIN FORM
──────────────────────────────────────────────── */

function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? data?.message ?? "Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network connection issue. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-14 sm:px-12">
      {/* Mobile brand header */}
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <span className="text-2xl">🔗</span>
        <span className="font-bold text-base text-neutral-900">
          CreatorLink India
        </span>
      </div>

      <div className="w-full max-w-sm mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-2xl text-neutral-950 tracking-tight mb-2">
            Sign in to CreatorLink
          </h1>
          <p className="text-neutral-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-neutral-900 underline underline-offset-4 hover:text-indigo-600 transition-colors"
            >
              Create page free →
            </Link>
          </p>
        </div>

        {/* Accessible Error alert */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-5 flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs text-red-700 bg-red-50 border border-red-200"
          >
            <span className="flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field text-sm"
            />
          </div>

          {/* Password with visibility toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-700" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={loading}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="input-field text-sm pr-10"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="btn-primary w-full text-sm font-semibold"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-400">
          Protected by 256-bit encryption · CreatorLink India
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <LeftPanel />
      <div className="flex flex-col bg-white">
        <LoginForm />
      </div>
    </div>
  );
}
