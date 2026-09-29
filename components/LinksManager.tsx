// components/LinksManager.tsx
// Apple & Nike Tier Link Management UI
"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Link as LinkType } from "@/lib/db/types";

interface Props {
  initialLinks: LinkType[];
  creatorHandle: string;
}

const NETWORK_META: Record<string, { color: string; bg: string; border: string; emoji: string; label: string }> = {
  amazon:   { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", emoji: "🛒", label: "Amazon" },
  flipkart: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", emoji: "🛍️", label: "Flipkart" },
  myntra:   { color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200", emoji: "👗", label: "Myntra" },
  other:    { color: "text-neutral-700", bg: "bg-neutral-100", border: "border-neutral-200", emoji: "🔗", label: "Store" },
};

export function LinksManager({ initialLinks, creatorHandle }: Props) {
  const [links, setLinks] = useState<LinkType[]>(initialLinks);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [addingLink, setAddingLink] = useState(false);
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
        setError(data.error || "Failed to add link. Please check the URL.");
        return;
      }
      setLinks((prev) => [...prev, data]);
      setJustAdded(data.id);
      setTimeout(() => setJustAdded(null), 2500);
      setUrl("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAddingLink(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this link?")) return;
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
    <div className="space-y-7 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
            Curated Links
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {links.length} active link{links.length !== 1 ? "s" : ""} on{" "}
            <Link
              href={`/${creatorHandle}`}
              target="_blank"
              className="text-indigo-600 hover:underline font-mono font-medium"
            >
              creatorlink.in/{creatorHandle}
            </Link>
          </p>
        </div>
      </div>

      {/* Non-Disruptive Quick-Add Bar */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-xs">
        <form onSubmit={handleAddLink} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any Amazon, Flipkart, or Myntra product link…"
                className="w-full pl-4 pr-10 py-3 bg-[#f5f5f7] border border-neutral-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-xs sm:text-sm text-neutral-900"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl("")}
                  className="touch-target-44 absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-sm"
                  aria-label="Clear URL"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={addingLink || !url.trim()}
              className="btn-primary py-3 px-6 text-xs sm:text-sm font-semibold disabled:opacity-50 flex-shrink-0"
            >
              {addingLink ? (
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Fetching info…</span>
                </span>
              ) : (
                "Add Link +"
              )}
            </button>
          </div>

          {/* Supported platform chips */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-neutral-400 font-medium">Auto-tags:</span>
            {["Amazon.in", "Flipkart", "Myntra"].map((site) => (
              <span key={site} className="px-2 py-0.5 text-[10px] bg-neutral-100 text-neutral-600 rounded-md font-medium">
                {site}
              </span>
            ))}
          </div>

          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Empty State */}
      {links.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-neutral-300 p-8">
          <div className="text-4xl mb-3">🔗</div>
          <h2 className="text-base font-bold text-neutral-900 mb-1">
            No links added yet
          </h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Paste any shopping or product URL above. We will fetch the thumbnail, title, and automatically attach your affiliate ID.
          </p>
        </div>
      )}

      {/* Links List */}
      {links.length > 0 && (
        <div className="space-y-3">
          {isPending && (
            <div className="text-[11px] text-neutral-400 text-right animate-pulse">
              Syncing order…
            </div>
          )}

          {links.map((link, idx) => {
            const meta = NETWORK_META[link.network] || NETWORK_META.other;
            const isNew = justAdded === link.id;

            return (
              <div
                key={link.id}
                className={`
                  bg-white rounded-2xl border transition-all card-hover overflow-hidden
                  ${isNew ? "border-indigo-400 ring-2 ring-indigo-100 shadow-md" : "border-black/[0.06] shadow-2xs"}
                `}
              >
                <div className="flex items-start gap-3.5 p-4 sm:p-5">
                  {/* Reorder Buttons (Guaranteed 44px Touch Targets) */}
                  <div className="flex flex-col items-center justify-center flex-shrink-0 pt-0.5">
                    <button
                      onClick={() => handleMove(link.id, "up")}
                      disabled={idx === 0}
                      className="touch-target-44 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 transition-colors text-xs font-bold"
                      aria-label={`Move ${link.title} up`}
                    >
                      ▲
                    </button>
                    <span className="text-[10px] text-neutral-400 font-mono select-none">
                      {idx + 1}
                    </span>
                    <button
                      onClick={() => handleMove(link.id, "down")}
                      disabled={idx === links.length - 1}
                      className="touch-target-44 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 transition-colors text-xs font-bold"
                      aria-label={`Move ${link.title} down`}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Thumbnail / Platform Icon */}
                  {link.image ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200/80">
                      <Image
                        src={link.image}
                        alt={link.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${meta.bg} border ${meta.border}`}
                      aria-hidden="true"
                    >
                      {meta.emoji}
                    </div>
                  )}

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md ${meta.bg} ${meta.color} border ${meta.border}`}>
                        {meta.label}
                      </span>
                      {isNew && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Saved
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug">
                      {link.title}
                    </p>

                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      {link.price && (
                        <span className="text-emerald-600 font-bold text-xs">
                          {link.price}
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-medium">
                        <span>👆</span> {link.clickCount.toLocaleString("en-IN")} click{link.clickCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button (44px target) */}
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="touch-target-44 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50/60 transition-colors flex-shrink-0"
                    aria-label={`Delete link ${link.title}`}
                    title="Remove link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Footer Quick Actions */}
                <div className="flex border-t border-neutral-100 divide-x divide-neutral-100 bg-[#fafafa]/50">
                  <a
                    href={`/r/${link.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target-44 flex-1 flex items-center justify-center gap-1.5 text-xs text-neutral-600 font-medium hover:text-neutral-900 hover:bg-neutral-100/60 transition-colors"
                  >
                    <span>↗</span> Test Redirect
                  </a>
                  <Link
                    href={`/${creatorHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target-44 flex-1 flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60 transition-colors"
                  >
                    <span>👁</span> View Live
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pro tip card with next/link fix */}
      <div className="flex items-start gap-3 p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
        <span className="text-base flex-shrink-0">💡</span>
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong className="text-neutral-900 font-semibold">Pro tip:</strong> Position your highest-converting items at the top using the arrows. Make sure your affiliate tags are set in{" "}
          <Link href="/dashboard/settings" className="underline font-semibold text-neutral-900 hover:text-indigo-600">
            Settings
          </Link>{" "}
          to ensure proper revenue attribution.
        </p>
      </div>
    </div>
  );
}
