// components/LinksManager.tsx
// Premium link management UI — add, reorder, delete
"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import type { Link as LinkType } from "@/lib/db/types";

interface Props {
  initialLinks: LinkType[];
  creatorHandle: string;
}

const NETWORK_META: Record<string, { color: string; bg: string; border: string; emoji: string; label: string }> = {
  amazon: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", emoji: "🛒", label: "Amazon" },
  flipkart: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", emoji: "🛍️", label: "Flipkart" },
  myntra: { color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200", emoji: "👗", label: "Myntra" },
  other: { color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200", emoji: "🔗", label: "Store" },
};

export function LinksManager({ initialLinks, creatorHandle }: Props) {
  const [links, setLinks] = useState<LinkType[]>(initialLinks);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [addingLink, setAddingLink] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setAddingLink(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add link");
        return;
      }
      setLinks((prev) => [...prev, data]);
      setJustAdded(data.id);
      setTimeout(() => setJustAdded(null), 2000);
      setUrl("");
      setShowForm(false);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setAddingLink(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this link?")) return;
    const prev = links;
    setLinks((l) => l.filter((x) => x.id !== id).map((x, i) => ({ ...x, position: i })));
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (!res.ok) setLinks(prev);
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const idx = links.findIndex((l) => l.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= links.length) return;

    const reordered = [...links];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    const updated = reordered.map((l, i) => ({ ...l, position: i }));
    setLinks(updated);

    startTransition(async () => {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: updated.map((l) => l.id) }),
      });
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Links</h1>
          <p className="text-sm text-gray-500 mt-0.5">{links.length} link{links.length !== 1 ? "s" : ""} · your page: <a href={`/${creatorHandle}`} target="_blank" className="text-indigo-600 hover:underline font-medium">/{creatorHandle}</a></p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-sm shadow-indigo-200"
        >
          <span className="text-base">➕</span>
          Add Link
        </button>
      </div>

      {/* Add Link Form — slide-down panel */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-50 p-6 space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-base">🔗</span>
            <h2 className="text-base font-semibold text-gray-900">Add New Link</h2>
          </div>

          <form onSubmit={handleAddLink} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                <span>⚠️</span> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product URL</label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.amazon.in/dp/..."
                  className="w-full pl-4 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                  autoFocus
                />
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {["amazon.in", "flipkart.com", "myntra.com"].map((site) => (
                  <span key={site} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full font-medium">
                    {site}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={addingLink}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 active:scale-[0.98] transition-all text-sm shadow-sm"
              >
                {addingLink ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Fetching product info...
                  </>
                ) : (
                  "✓ Add Link"
                )}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); setUrl(""); }}
                className="px-4 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {links.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">🔗</div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Add your first link</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            Paste any Amazon, Flipkart, or Myntra product URL. We&apos;ll auto-tag it with your affiliate ID.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            ➕ Add First Link
          </button>
        </div>
      )}

      {/* Links list */}
      {links.length > 0 && (
        <div className="space-y-3">
          {isPending && (
            <div className="text-xs text-gray-400 text-right animate-pulse">Saving order...</div>
          )}
          {links.map((link, idx) => {
            const meta = NETWORK_META[link.network] || NETWORK_META.other;
            const isNew = justAdded === link.id;
            return (
              <div
                key={link.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden card-hover transition-all ${
                  isNew ? "border-indigo-300 shadow-indigo-100" : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3 p-4">
                  {/* Drag handle / position */}
                  <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                    <button
                      onClick={() => handleMove(link.id, "up")}
                      disabled={idx === 0}
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors text-xs font-bold"
                    >
                      ↑
                    </button>
                    <span className="text-xs text-gray-300 font-mono">{idx + 1}</span>
                    <button
                      onClick={() => handleMove(link.id, "down")}
                      disabled={idx === links.length - 1}
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-colors text-xs font-bold"
                    >
                      ↓
                    </button>
                  </div>

                  {/* Thumbnail */}
                  {link.image ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                      <Image src={link.image} alt={link.title} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${meta.bg} border ${meta.border}`}>
                      {meta.emoji}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${meta.bg} ${meta.color} border ${meta.border}`}>
                        {meta.emoji} {meta.label}
                      </span>
                      {isNew && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                          ✓ Added
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{link.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {link.price && <span className="text-indigo-600 font-bold text-sm">{link.price}</span>}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <span>👆</span> {link.clickCount.toLocaleString("en-IN")} click{link.clickCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 mt-0.5"
                    title="Remove link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Footer actions */}
                <div className="flex border-t border-gray-50 divide-x divide-gray-50">
                  <a
                    href={`/r/${link.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
                  >
                    <span>↗</span> Test Redirect
                  </a>
                  <a
                    href={`/${creatorHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <span>👁</span> View on Page
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pro tip */}
      {links.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <span className="text-lg flex-shrink-0">💡</span>
          <p className="text-xs text-indigo-700">
            <strong>Pro tip:</strong> Put your best-converting affiliate links first. Use ↑↓ to reorder. 
            Your affiliate IDs are auto-appended — check{" "}
            <a href="/dashboard/settings" className="underline font-semibold">Settings</a> to update them.
          </p>
        </div>
      )}
    </div>
  );
}
