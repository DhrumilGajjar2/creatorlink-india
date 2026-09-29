// components/SettingsForm.tsx
// Apple & Nike Tier Settings UI
"use client";
import { useState } from "react";

interface CreatorData {
  id: string;
  handle: string;
  name: string;
  bio: string;
  avatarUrl: string;
  languages: string[];
  affiliateIds: Record<string, string>;
  email: string;
}

interface Props {
  creator: CreatorData;
}

const LANG_OPTIONS = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { value: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
];

const AFFILIATE_FIELDS = [
  {
    key: "amazon",
    label: "Amazon Associates Tag",
    emoji: "🛒",
    placeholder: "yourstore-21",
    hint: "Appended as ?tag=yourstore-21",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  {
    key: "flipkart",
    label: "Flipkart Affiliate ID",
    emoji: "🛍️",
    placeholder: "affid123",
    hint: "Appended as ?affid=affid123",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    key: "myntra",
    label: "Myntra Affiliate Code",
    emoji: "👗",
    placeholder: "utm_code",
    hint: "Appended as ?utm_source=utm_code",
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
  },
];

export function SettingsForm({ creator }: Props) {
  const [form, setForm] = useState({
    name: creator.name,
    bio: creator.bio,
    avatarUrl: creator.avatarUrl,
    languages: creator.languages ?? ["en"],
    affiliateIds: {
      amazon: creator.affiliateIds?.amazon ?? "",
      flipkart: creator.affiliateIds?.flipkart ?? "",
      myntra: creator.affiliateIds?.myntra ?? "",
    },
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleLang(lang: string) {
    setForm((prev) => {
      const langs = prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: langs.length > 0 ? langs : ["en"] };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/creator/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          bio: form.bio.trim(),
          avatarUrl: form.avatarUrl.trim(),
          languages: form.languages,
          affiliateIds: form.affiliateIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save settings");
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-7 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          Account Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Manage your creator profile, bio page languages, and automatic affiliate tracking tags.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {success && (
          <div role="status" className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in-up">
            <span>✅</span> Settings updated successfully!
          </div>
        )}
        {error && (
          <div role="alert" className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-2xs divide-y divide-neutral-100 overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-sm">
              👤
            </span>
            <h2 className="text-sm font-bold text-neutral-900">
              Public Bio Profile
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Handle Display */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Creator Link Handle
              </label>
              <div className="flex items-center gap-2 px-3.5 py-3 bg-[#f5f5f7] border border-neutral-200/80 rounded-xl">
                <span className="text-neutral-400 font-mono text-xs">creatorlink.in/</span>
                <span className="font-semibold text-neutral-900 font-mono text-xs">{creator.handle}</span>
                <span className="ml-auto text-[10px] text-neutral-400 bg-white border border-neutral-200 px-2 py-0.5 rounded-full font-medium">
                  Verified
                </span>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="set-name">
                Display Name
              </label>
              <input
                id="set-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field text-sm"
                placeholder="Your full name or brand"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="set-bio">
                Short Bio
              </label>
              <textarea
                id="set-bio"
                rows={2}
                maxLength={150}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="input-field text-sm resize-none"
                placeholder="What do you share? (e.g. Daily tech reviews & home office inspiration ✨)"
              />
              <p className="text-[11px] text-neutral-400 mt-1 text-right">
                {form.bio.length}/150 characters
              </p>
            </div>

            {/* Page Languages */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Trilingual Bio Switcher
                <span className="ml-1.5 text-neutral-400 font-normal text-[11px]">
                  (allows visitors to switch languages on your bio page)
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {LANG_OPTIONS.map((lang) => {
                  const active = form.languages.includes(lang.value);
                  return (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => toggleLang(lang.value)}
                      className={`
                        touch-target-44 flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer
                        ${
                          active
                            ? "border-neutral-900 bg-neutral-900 text-white font-semibold shadow-xs"
                            : "border-neutral-200/80 text-neutral-600 hover:border-neutral-300 bg-white"
                        }
                      `}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {active && <span className="text-[11px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate Tracking Tags */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-2xs divide-y divide-neutral-100 overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-sm">
              🏷️
            </span>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Affiliate Auto-Tagging
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl">
              <span className="text-sm">💡</span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Add your tracking IDs once. Whenever you paste a product link into CreatorLink, your tag is <strong>automatically appended</strong> before visitors are redirected.
              </p>
            </div>

            {AFFILIATE_FIELDS.map(({ key, label, emoji, placeholder, hint, bg, border, text }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor={`aff-${key}`}>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold mr-1.5 ${bg} ${text} border ${border}`}>
                    {emoji} {label.split(" ")[0]}
                  </span>
                  {label}
                </label>
                <input
                  id={`aff-${key}`}
                  type="text"
                  value={form.affiliateIds[key as keyof typeof form.affiliateIds]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      affiliateIds: { ...form.affiliateIds, [key]: e.target.value.trim() },
                    })
                  }
                  className="input-field text-xs sm:text-sm font-mono"
                  placeholder={placeholder}
                />
                <p className="text-[11px] text-neutral-400 mt-1 font-mono">{hint}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3.5 text-xs sm:text-sm font-semibold disabled:opacity-50"
        >
          {saving ? "Saving Changes…" : "Save Settings →"}
        </button>
      </form>
    </div>
  );
}
