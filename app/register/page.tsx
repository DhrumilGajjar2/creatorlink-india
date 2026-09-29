"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────── */

const CREATOR_TYPES = [
  { label: "👗 Fashion",   value: "fashion"  },
  { label: "💻 Tech",      value: "tech"     },
  { label: "🍛 Food",      value: "food"     },
  { label: "💰 Finance",   value: "finance"  },
  { label: "🎮 Gaming",    value: "gaming"   },
  { label: "💪 Fitness",   value: "fitness"  },
];

/* ────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────── */

/** Sanitise a handle: lowercase, only a-z 0-9 _ */
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
   LEFT PANEL
──────────────────────────────────────────────── */

function LeftPanel() {
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{ background: "var(--gradient-brand)" }}
    >
      {/* Decorative */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "#a78bfa", filter: "blur(70px)", transform: "translate(25%, -25%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-15 pointer-events-none"
        style={{ background: "#818cf8", filter: "blur(60px)", transform: "translate(-25%, 25%)" }}
      />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🔗</span>
          <span className="font-extrabold text-white text-xl">CreatorLink India</span>
        </Link>
      </div>

      {/* Copy */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
        <div className="text-5xl mb-5">🎉</div>
        <h2 className="font-extrabold text-white text-3xl leading-tight mb-3">
          Join 10,000+<br />Indian Creators
        </h2>
        <p className="text-indigo-200 text-base mb-8">
          From Jaipur to Bengaluru — they're all monetising with CreatorLink.
        </p>

        {/* Creator type pills */}
        <p className="text-indigo-300 text-xs uppercase tracking-widest font-semibold mb-4">
          I am a creator in…
        </p>
        <div className="flex flex-wrap gap-2">
          {CREATOR_TYPES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveType(value === activeType ? null : value)}
              className="text-sm font-semibold rounded-full px-4 py-2 transition-all duration-200"
              style={{
                background: activeType === value
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.15)",
                color: activeType === value
                  ? "var(--color-brand)"
                  : "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                transform: activeType === value ? "scale(1.04)" : "scale(1)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        className="relative z-10 grid grid-cols-3 gap-3 rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        {[
          { value: "10K+", label: "Creators" },
          { value: "₹2Cr+", label: "Earned" },
          { value: "4.9★", label: "Rating" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-extrabold text-white text-xl">{value}</div>
            <div className="text-indigo-300 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   STEP INDICATOR (decorative)
──────────────────────────────────────────────── */

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={{
              background: s <= step ? "var(--color-brand)" : "#f3f4f6",
              color:      s <= step ? "#fff" : "#9ca3af",
            }}
          >
            {s}
          </div>
          {s < 2 && (
            <div
              className="w-8 h-0.5 rounded-full transition-all duration-300"
              style={{ background: step > 1 ? "var(--color-brand)" : "#e5e7eb" }}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-xs text-gray-400 font-medium">
        {step === 1 ? "Profile setup" : "Account details"}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────
   REGISTER FORM
──────────────────────────────────────────────── */

interface FormState {
  displayName: string;
  handle:      string;
  bio:         string;
  email:       string;
  password:    string;
}

function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    displayName: "",
    handle:      "",
    bio:         "",
    email:       "",
    password:    "",
  });

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  /* ── Field change handler ── */
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

  /* ── Step navigation ── */
  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim()) { setError("Please enter your display name."); return; }
    if (!form.handle.trim())      { setError("Please choose a handle."); return; }
    setError(null);
    setCurrentStep(2);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.displayName.trim(),
          handle:   form.handle.trim(),
          bio:      form.bio.trim(),
          email:    form.email.trim(),
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
    form.handle.trim().length > 0;

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-12 sm:px-10">
      {/* Mobile logo */}
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <span className="text-2xl">🔗</span>
        <span className="font-extrabold text-lg" style={{ color: "var(--color-brand)" }}>
          CreatorLink India
        </span>
      </div>

      <div className="w-full max-w-sm mx-auto">
        {/* Heading */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="font-extrabold text-2xl text-gray-900 mb-1">
            Create your free page
          </h1>
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--color-brand)" }}>
              Sign in →
            </Link>
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator step={currentStep} />

        {/* Error banner */}
        {error && (
          <div
            className="mb-5 flex items-start gap-3 rounded-xl px-4 py-3 animate-slide-in text-sm"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}
          >
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: Profile ── */}
        {currentStep === 1 && (
          <form onSubmit={goToStep2} className="space-y-5" noValidate>
            {/* Display Name */}
            <div className="animate-fade-in-up-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="displayName">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                maxLength={50}
                required
                value={form.displayName}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="input-field"
              />
            </div>

            {/* Handle */}
            <div className="animate-fade-in-up-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="handle">
                Your Handle
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold select-none pointer-events-none"
                  style={{ color: "var(--color-brand)" }}
                >
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
                  value={form.handle}
                  onChange={handleChange}
                  placeholder="yourhandle"
                  className="input-field pl-7 pr-10"
                />
                {/* Green checkmark when valid */}
                {form.handle.length >= 3 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm font-bold">
                    ✓
                  </span>
                )}
              </div>

              {/* Live preview */}
              <p
                className="mt-2 text-xs rounded-lg px-3 py-2 font-mono transition-all"
                style={{
                  background: form.handle
                    ? "rgba(99,102,241,0.07)"
                    : "#f9fafb",
                  color: form.handle ? "var(--color-brand)" : "#9ca3af",
                  border: "1px solid",
                  borderColor: form.handle ? "rgba(99,102,241,0.2)" : "#f3f4f6",
                }}
              >
                {form.handle
                  ? `creatorlink.in/${form.handle}`
                  : "creatorlink.in/yourhandle"}
              </p>
              <p className="mt-1.5 text-xs text-gray-400">
                Only lowercase letters, numbers, and underscores. Auto-formatted.
              </p>
            </div>

            {/* Bio */}
            <div className="animate-fade-in-up-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="bio">
                Bio{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={2}
                maxLength={160}
                value={form.bio}
                onChange={handleChange}
                placeholder="Fashion creator from Mumbai 🌸 | Affiliate links inside"
                className="input-field resize-none"
                style={{ lineHeight: 1.6 }}
              />
              <p className="mt-1 text-xs text-gray-400 text-right">
                {form.bio.length}/160
              </p>
            </div>

            <div className="animate-fade-in-up-4 pt-1">
              <button
                type="submit"
                disabled={!handleIsValid}
                className="btn-primary w-full"
                style={{ opacity: handleIsValid ? 1 : 0.55, cursor: handleIsValid ? "pointer" : "not-allowed" }}
              >
                Continue →
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: Account details ── */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Back */}
            <button
              type="button"
              onClick={() => { setCurrentStep(1); setError(null); }}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-2"
            >
              ← Back
            </button>

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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={loading}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="input-field"
              />
              {/* Strength hint */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          form.password.length < 6 && n <= 1 ? "#ef4444" :
                          form.password.length < 8 && n <= 2 ? "#f59e0b" :
                          form.password.length >= 8 && n <= 3 ? "#10b981" :
                          form.password.length >= 12 && n <= 4 ? "#10b981" :
                          "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                Use 8+ characters, a number, and a special character.
              </p>
            </div>

            {/* Summary card */}
            <div
              className="animate-fade-in-up-3 rounded-xl p-4"
              style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Your page preview
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "var(--gradient-brand)", color: "#fff" }}
                >
                  {form.displayName?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {form.displayName || "Your Name"}
                  </p>
                  <p className="text-xs font-mono" style={{ color: "var(--color-brand)" }}>
                    creatorlink.in/{form.handle || "yourhandle"}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="animate-fade-in-up-4 pt-1">
              <button
                type="submit"
                disabled={loading || !form.email || !form.password}
                className="btn-primary w-full"
                style={{
                  opacity: loading || !form.email || !form.password ? 0.7 : 1,
                  cursor: loading || !form.email || !form.password ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Creating your page…</span>
                  </>
                ) : (
                  "Create My Page →"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Legal */}
        <p className="mt-6 text-center text-xs text-gray-400 animate-fade-in-up-5">
          By registering, you agree to our{" "}
          <a href="#" className="underline">Terms</a> &amp;{" "}
          <a href="#" className="underline">Privacy Policy</a>.
          <br />No credit card required. Free forever.
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
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: "#fafafa" }}
    >
      <LeftPanel />

      <div className="flex flex-col" style={{ background: "#ffffff" }}>
        <RegisterForm />
      </div>
    </div>
  );
}
