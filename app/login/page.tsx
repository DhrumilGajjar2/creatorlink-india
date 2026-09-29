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
   LEFT PANEL — desktop only
──────────────────────────────────────────────── */

function LeftPanel() {
  const perks = [
    "View your click analytics in real-time",
    "Manage all your affiliate links in one place",
    "Accept INR payments via Razorpay",
  ];

  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{ background: "var(--gradient-brand)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: "#a78bfa", filter: "blur(60px)", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none"
        style={{ background: "#6366f1", filter: "blur(50px)", transform: "translate(-30%, 30%)" }}
      />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🔗</span>
          <span className="font-extrabold text-white text-xl">CreatorLink India</span>
        </Link>
      </div>

      {/* Hero copy */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        <div className="text-5xl mb-6">👋</div>
        <h2 className="font-extrabold text-white text-3xl leading-tight mb-3">
          Welcome back,<br />Creator!
        </h2>
        <p className="text-indigo-200 text-base mb-10">
          Your audience is waiting. Let's pick up where you left off.
        </p>

        {/* Perks */}
        <ul className="space-y-4">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}
              >
                ✓
              </span>
              <span className="text-indigo-100 text-sm leading-relaxed">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom quote */}
      <div
        className="relative z-10 rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
      >
        <p className="text-white text-sm leading-relaxed italic">
          "CreatorLink ने मेरी income 3x कर दी!"
        </p>
        <p className="text-indigo-300 text-xs mt-2 font-semibold">— @priya_fashion · Mumbai</p>
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
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
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

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
      setError("Something went wrong. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-12 sm:px-10">
      {/* Mobile logo */}
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <span className="text-2xl">🔗</span>
        <span
          className="font-extrabold text-lg"
          style={{ color: "var(--color-brand)" }}
        >
          CreatorLink India
        </span>
      </div>

      <div className="w-full max-w-sm mx-auto">
        {/* Heading */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-extrabold text-2xl text-gray-900 mb-1">
            Sign in to your account
          </h1>
          <p className="text-gray-500 text-sm">
            Don't have one?{" "}
            <Link
              href="/register"
              className="font-semibold hover:underline"
              style={{ color: "var(--color-brand)" }}
            >
              Create for free →
            </Link>
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mb-5 flex items-start gap-3 rounded-xl px-4 py-3 animate-slide-in text-sm"
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
            }}
          >
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div className="animate-fade-in-up-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
              Email address
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
              className="input-field"
            />
          </div>

          {/* Password */}
          <div className="animate-fade-in-up-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-gray-700" htmlFor="password">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium hover:underline"
                style={{ color: "var(--color-brand)" }}
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field"
            />
          </div>

          {/* Submit */}
          <div className="animate-fade-in-up-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ opacity: loading ? 0.8 : 1, cursor: loading ? "not-allowed" : "pointer" }}
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

        {/* Divider */}
        <div className="relative my-6 animate-fade-in-up-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">
              Secure login · 256-bit encrypted
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 animate-fade-in-up-5">
          By signing in, you agree to our{" "}
          <a href="#" className="underline">Terms</a> &amp;{" "}
          <a href="#" className="underline">Privacy Policy</a>.
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
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: "#fafafa" }}
    >
      <LeftPanel />

      <div className="flex flex-col" style={{ background: "#ffffff" }}>
        <LoginForm />
      </div>
    </div>
  );
}
