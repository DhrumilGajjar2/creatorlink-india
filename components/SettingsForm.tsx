// components/SettingsForm.tsx
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
          name: form.name,
          bio: form.bio,
          avatarUrl: form.avatarUrl,
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
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Update your profile and affiliate IDs for auto-tagging.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {/* Header */}
          <div className="px-6 py-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-sm">👤</span>
            <h2 className="text-base font-semibold text-gray-900">Profile</h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm animate-fade-in-up">
                <span>✅</span> Settings saved successfully!
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Handle (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Handle</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="text-gray-400 text-sm">creatorlink.in/</span>
                <span className="font-semibold text-gray-800 text-sm">{creator.handle}</span>
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Cannot change</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                placeholder="Your name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white resize-none"
                placeholder="Fashion creator & lifestyle blogger 📸"
              />
              <p className="text-xs text-gray-400 mt-1">{form.bio.length}/150 characters</p>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar URL</label>
              <input
                type="url"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-400 mt-1">Paste a direct image URL. Leave blank to use auto-generated avatar.</p>
            </div>

            {/* Language selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Languages
                <span className="ml-1.5 text-gray-400 font-normal text-xs">(shown as toggle on your public page)</span>
              </label>
              <div className="flex gap-2">
                {LANG_OPTIONS.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => toggleLang(lang.value)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                      form.languages.includes(lang.value)
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                    {form.languages.includes(lang.value) && (
                      <span className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate IDs section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          <div className="px-6 py-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-sm">💰</span>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Affiliate IDs</h2>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <span>💡</span>
              <p className="text-xs text-blue-800">
                These are <strong>automatically appended</strong> to every link you add. Set them once and forget — every paste auto-tags!
              </p>
            </div>

            {AFFILIATE_FIELDS.map(({ key, label, emoji, placeholder, hint, bg, border, text }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${bg} ${text} border ${border}`}>
                    {emoji} {label.split(" ")[0]}
                  </span>
                  {label}
                </label>
                <input
                  type="text"
                  value={form.affiliateIds[key as keyof typeof form.affiliateIds]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      affiliateIds: { ...form.affiliateIds, [key]: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white font-mono"
                  placeholder={placeholder}
                />
                <p className="text-xs text-gray-400 mt-1 font-mono">{hint}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 active:scale-[0.98] transition-all text-sm shadow-sm shadow-indigo-200"
        >
          {saving ? "Saving..." : "✓ Save Settings"}
        </button>
      </form>
    </div>
  );
}
