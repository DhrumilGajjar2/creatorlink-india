"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────── */

const sanitizeHandle = (raw: string): string =>
  raw
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 30);

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
   LEFT PANEL (Editorial Dark Theme)
──────────────────────────────────────────────── */

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-14 relative bg-[#09090b] text-white border-r border-neutral-800">
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="text-2xl">🔗</span>
          <span className="font-bold text-lg tracking-tight text-white">
            CreatorLink <span className="text-zinc-400 font-normal">India</span>
          </span>
        </Link>
      </div>

      <div className="relative z-10 max-w-md">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
          Creator Onboarding
        </span>
        <h2 className="font-bold text-3xl leading-tight text-white tracking-tight mb-4">
          Claim your bio link.<br />Start earning in minutes.
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Join over 10,000 creators across Mumbai, Bengaluru, Delhi, and beyond monetizing their social presence.
        </p>

        {/* Stats card */}
        <div className="grid grid-cols-3 gap-3 rounded-2xl p-4 bg-white/[0.04] border border-white/[0.08]">
          {[
            { value: "10K+", label: "Creators" },
            { value: "₹2Cr+", label: "Earned" },
            { value: "4.9★", label: "Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-bold text-white text-base sm:text-lg">{value}</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-xs text-zinc-500">
        Free forever · No credit card required
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   REGISTER FORM (Unified Single Screen)
──────────────────────────────────────────────── */

interface FormState {
  displayName: string;
  handle: string;
  bio: string;
  email: string;
  password: string;
}

function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    displayName: "",
    handle: "",
    bio: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (error) setError(null);

      setForm((prev) => ({
        ...prev,
        [name]: name === "handle" ? sanitizeHandle(value) : value,
      }));
    },
    [error]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim() || !form.handle.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.displayName.trim(),
          handle: form.handle.trim(),
          bio: form.bio.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? data?.message ?? "Registration failed. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleIsValid =
    form.displayName.trim().length > 0 &&
    form.handle.trim().length >= 3 &&
    form.email.trim().length > 0 &&
    form.password.length >= 8;

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-10 sm:px-12">
      <div className="mb-6 flex items-center gap-2 lg:hidden">
        <span className="text-2xl">🔗</span>
        <span className="font-bold text-base text-neutral-900">
          CreatorLink India
        </span>
      </div>

      <div className="w-full max-w-sm mx-auto">
        <div className="mb-6">
          <h1 className="font-bold text-2xl text-neutral-950 tracking-tight mb-2">
            Create your creator page
          </h1>
          <p className="text-neutral-500 text-sm">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-medium text-neutral-900 underline underline-offset-4 hover:text-indigo-600 transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>

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
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="displayName">
              Your Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              maxLength={50}
              required
              disabled={loading}
              value={form.displayName}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="input-field text-sm"
            />
          </div>

          {/* Handle */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="handle">
              Choose Handle
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400 select-none">
                @
              </span>
              <input
                id="handle"
                name="handle"
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                maxLength={30}
                required
                disabled={loading}
                value={form.handle}
                onChange={handleChange}
                placeholder="yourhandle"
                className="input-field text-sm pl-8 pr-10"
              />
              {form.handle.length >= 3 && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">
                  ✓
                </span>
              )}
            </div>
            {/* Live handle preview tag */}
            <p className="mt-1.5 text-xs text-neutral-500 font-mono">
              creatorlink.in/{form.handle || "yourhandle"}
            </p>
          </div>

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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-700" htmlFor="password">
                Password (min 8 chars)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="input-field text-sm"
            />
          </div>

          {/* Optional Bio */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="bio">
              Short Bio <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              id="bio"
              name="bio"
              type="text"
              maxLength={120}
              disabled={loading}
              value={form.bio}
              onChange={handleChange}
              placeholder="e.g. Fashion &amp; everyday essentials"
              className="input-field text-sm"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !handleIsValid}
              className="btn-primary w-full text-sm font-semibold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Creating your storefront…</span>
                </>
              ) : (
                "Create Free Page →"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-400">
          By signing up, you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <LeftPanel />
      <div className="flex flex-col bg-white">
        <RegisterForm />
      </div>
    </div>
  );
}
