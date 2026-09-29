"use client";

import { useState } from "react";
import Image from "next/image";
import { t, LANG_LABELS, Lang } from "@/lib/i18n";
import { Link as LinkType, Product } from "@/lib/db/types";

// ─── Network meta ────────────────────────────────────────────────────────────

const NETWORK_COLORS: Record<string, string> = {
  amazon:  "bg-orange-500",
  flipkart: "bg-blue-600",
  myntra:  "bg-pink-500",
  meesho:  "bg-purple-500",
  ajio:    "bg-red-500",
  nykaa:   "bg-pink-600",
  other:   "bg-gray-500",
};

const NETWORK_LABELS: Record<string, string> = {
  amazon:   "Amazon",
  flipkart: "Flipkart",
  myntra:   "Myntra",
  meesho:   "Meesho",
  ajio:     "AJIO",
  nykaa:    "Nykaa",
  other:    "Link",
};

const NETWORK_EMOJI: Record<string, string> = {
  amazon:   "📦",
  flipkart: "🛍️",
  myntra:   "👗",
  meesho:   "🎀",
  ajio:     "👠",
  nykaa:    "💄",
  other:    "🔗",
};

// ─── WhatsApp share helper ────────────────────────────────────────────────────

function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Glassmorphism link / affiliate card */
function LinkCard({ link, lang }: { link: LinkType; lang: Lang }) {
  const network = (link.network ?? "other").toLowerCase();
  const networkColor = NETWORK_COLORS[network] ?? NETWORK_COLORS.other;
  const networkLabel = NETWORK_LABELS[network] ?? "Link";
  const networkEmoji = NETWORK_EMOJI[network] ?? "🔗";

  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${link.id}`
      : `/r/${link.id}`;

  const checkThisOut = { en: "Check this out", hi: "यह देखें", gu: "આ જુઓ" }[lang] ?? "Check this out";
  const shareText = `${checkThisOut}: ${link.title}\n${redirectUrl}`;

  return (
    <div className="group relative">
      {/* Main card */}
      <a
        href={redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center gap-3 p-3 rounded-2xl
          bg-white/10 backdrop-blur-sm border border-white/20
          hover:bg-white/20 hover:border-white/30
          transition-all duration-200 ease-out
          hover:scale-[1.02] active:scale-[0.99]
          shadow-lg shadow-black/10
          cursor-pointer
        "
        aria-label={`Visit ${link.title}`}
      >
        {/* Thumbnail / Icon */}
        <div className="flex-shrink-0">
          {link.image ? (
            <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-1 ring-white/20 shadow-md">
              <Image
                src={link.image}
                alt={link.title ?? "Product image"}
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            </div>
          ) : (
            <div
              className={`
                w-14 h-14 rounded-xl flex items-center justify-center
                ${networkColor} shadow-md text-2xl
              `}
              aria-hidden="true"
            >
              {networkEmoji}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Network badge */}
          <span
            className={`
              inline-block text-[10px] font-bold px-2 py-0.5 rounded-full
              text-white mb-1 ${networkColor}
            `}
          >
            {networkLabel}
          </span>

          {/* Title */}
          <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
            {link.title}
          </p>

          {/* Price */}
          {link.price != null && (
            <p className="text-emerald-400 font-bold text-sm mt-0.5">
              ₹{Number(link.price).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div
          className="
            flex-shrink-0 w-8 h-8 rounded-full
            bg-white/10 flex items-center justify-center
            group-hover:bg-indigo-500/60 transition-colors duration-200
          "
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4 text-white/70 group-hover:text-white transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </a>

      {/* WhatsApp share strip */}
      <div className="flex justify-end mt-1 pr-1">
        <a
          href={whatsappShareUrl(shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-1 text-[11px] text-white/40
            hover:text-emerald-400 transition-colors duration-150
            px-2 py-0.5 rounded-full hover:bg-white/5
          "
          aria-label="Share on WhatsApp"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share
        </a>
      </div>
    </div>
  );
}

/** Product card */
function ProductCard({ product, handle }: { product: Product; handle: string }) {
  const DELIVERY_ICON: Record<string, string> = {
    file:    "📄",
    booking: "📅",
    digital: "⚡",
    course:  "🎓",
  };
  const icon = DELIVERY_ICON[(product.deliveryType ?? "file").toLowerCase()] ?? "📦";
  const buyUrl = `/${handle}/buy/${product.id}`;

  return (
    <a
      href={buyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center gap-3 p-3 rounded-2xl
        bg-white/10 backdrop-blur-sm
        border-l-2 border-indigo-400 border border-indigo-400/30
        hover:bg-white/20 hover:scale-[1.02] active:scale-[0.99]
        transition-all duration-200 ease-out
        shadow-lg shadow-black/10
        group
      "
      aria-label={`Buy ${product.title}`}
    >
      {/* Icon */}
      <div
        className="
          flex-shrink-0 w-12 h-12 rounded-xl
          bg-indigo-500/30 border border-indigo-400/30
          flex items-center justify-center text-xl
        "
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {product.title}
        </p>
        {product.price != null && (
          <p className="text-emerald-400 font-bold text-sm mt-0.5">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        )}
      </div>

      {/* Buy Now button */}
      <button
        className="
          flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full
          bg-indigo-500 text-white
          group-hover:bg-indigo-400 transition-colors duration-200
          shadow-md
        "
        tabIndex={-1}
        aria-hidden="true"
      >
        Buy Now
      </button>
    </a>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreatorPublicPageProps {
  creator: {
    id: string;
    handle: string;
    name: string;
    bio?: string | null;
    avatarUrl?: string | null;
    languages: string[];
    affiliateIds?: Record<string, string>;
  };
  links: LinkType[];
  products: Product[];
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CreatorPublicPage({
  creator,
  links,
  products,
}: CreatorPublicPageProps) {
  const availableLangs = (creator.languages?.filter((l) =>
    ["en", "hi", "gu"].includes(l)
  ) ?? ["en"]) as Lang[];

  const defaultLang: Lang = availableLangs[0] ?? "en";
  const [lang, setLang] = useState<Lang>(defaultLang);

  const profileShareText = `Check out @${creator.handle} on CreatorLink India!\n${
    typeof window !== "undefined" ? window.location.href : ""
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 relative">
      {/* Ambient orbs for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header
        className="
          sticky top-0 z-50
          flex items-center justify-between
          px-4 h-12
          bg-white/5 backdrop-blur-md border-b border-white/10
        "
        aria-label="Site header"
      >
        {/* Logo */}
        <span className="text-white/80 text-sm font-semibold tracking-tight select-none">
          🔗 <span className="hidden sm:inline">CreatorLink</span>
        </span>

        {/* Language toggle — only when multiple languages configured */}
        {availableLangs.length > 1 && (
          <nav
            className="flex items-center gap-1"
            aria-label="Language selector"
          >
            {availableLangs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`
                  text-[11px] font-medium px-2.5 py-0.5 rounded-full
                  transition-all duration-150
                  ${
                    lang === l
                      ? "bg-white text-indigo-900 font-bold shadow"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }
                `}
                aria-pressed={lang === l}
              >
                {LANG_LABELS[l] ?? l.toUpperCase()}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center px-4 py-8 pb-16">
        <div className="w-full max-w-[480px]">

          {/* ── Profile section ──────────────────────────────────────────── */}
          <section className="flex flex-col items-center" aria-label="Creator profile">
            {/* Avatar */}
            <div
              className="
                relative w-24 h-24 rounded-full
                ring-4 ring-white/20 shadow-2xl
                overflow-hidden bg-indigo-700
                flex items-center justify-center
              "
              aria-hidden={!creator.avatarUrl}
            >
              {creator.avatarUrl ? (
                <Image
                  src={creator.avatarUrl}
                  alt={`${creator.name} avatar`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                />
              ) : (
                <span className="text-white text-3xl font-bold select-none">
                  {creator.name?.[0]?.toUpperCase() ?? "C"}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold text-white mt-3 tracking-tight">
              {creator.name}
            </h1>

            {/* Handle */}
            <p className="text-white/60 text-sm mt-0.5">@{creator.handle}</p>

            {/* Bio */}
            {creator.bio && (
              <p className="text-white/80 text-sm text-center mt-2 leading-relaxed max-w-[300px] mx-auto">
                {creator.bio}
              </p>
            )}

            {/* WhatsApp profile share */}
            <a
              href={whatsappShareUrl(profileShareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4 flex items-center gap-2
                bg-emerald-500 hover:bg-emerald-400
                text-white text-sm font-semibold
                px-5 py-2 rounded-full shadow-lg shadow-emerald-900/30
                transition-all duration-200 hover:scale-105 active:scale-95
              "
              aria-label="Share profile on WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {{ en: "Share on WhatsApp", hi: "WhatsApp पर शेयर करें", gu: "WhatsApp પર શેર કરો" }[lang] ?? "Share on WhatsApp"}
            </a>
          </section>

          {/* ── Links section ─────────────────────────────────────────────── */}
          {links.length > 0 && (
            <section
              className="mt-8 space-y-3"
              aria-label="Affiliate links"
            >
              {/* Section label */}
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase text-center mb-4">
                {{ en: "✨ My Picks", hi: "✨ मेरी पसंद", gu: "✨ મારી પસંદ" }[lang] ?? "✨ My Picks"}
              </p>

              {links.map((link) => (
                <LinkCard key={link.id} link={link} lang={lang} />
              ))}
            </section>
          )}

          {/* ── Products section ──────────────────────────────────────────── */}
          {products.length > 0 && (
            <section
              className="mt-8 space-y-3"
              aria-label="Products for sale"
            >
              {/* Section label */}
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase text-center mb-4">
                🛒 {{ en: "Available Now", hi: "अभी उपलब्ध", gu: "હવે ઉપલબ્ધ" }[lang] ?? "Available Now"}
              </p>

              {products.map((product) => (
                <ProductCard key={product.id} product={product} handle={creator.handle} />
              ))}
            </section>
          )}

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <footer className="mt-10 text-center" aria-label="Site footer">
            <a
              href="https://creatorlink.in"
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-xs text-white/25 hover:text-white/50
                transition-colors duration-200
              "
            >
              Powered by CreatorLink India 🇮🇳
            </a>
          </footer>
        </div>
      </main>
    </div>
  );
}
