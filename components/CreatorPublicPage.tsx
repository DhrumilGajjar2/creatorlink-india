"use client";

import { useState } from "react";
import Image from "next/image";
import { LANG_LABELS, Lang } from "@/lib/i18n";
import { Link as LinkType, Product } from "@/lib/db/types";

// ─── Network metadata ─────────────────────────────────────────────────────────

const NETWORK_COLORS: Record<string, string> = {
  amazon:   "text-orange-400 bg-orange-500/10 border-orange-500/20",
  flipkart: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  myntra:   "text-pink-400 bg-pink-500/10 border-pink-500/20",
  meesho:   "text-purple-400 bg-purple-500/10 border-purple-500/20",
  ajio:     "text-red-400 bg-red-500/10 border-red-500/20",
  nykaa:    "text-pink-300 bg-pink-500/10 border-pink-500/20",
  other:    "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
};

const NETWORK_LABELS: Record<string, string> = {
  amazon:   "Amazon",
  flipkart: "Flipkart",
  myntra:   "Myntra",
  meesho:   "Meesho",
  ajio:     "AJIO",
  nykaa:    "Nykaa",
  other:    "Store",
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

// ─── WhatsApp helper ──────────────────────────────────────────────────────────

function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Luxury Obsidian Link Card */
function LinkCard({ link, lang }: { link: LinkType; lang: Lang }) {
  const network = (link.network ?? "other").toLowerCase();
  const networkStyle = NETWORK_COLORS[network] ?? NETWORK_COLORS.other;
  const networkLabel = NETWORK_LABELS[network] ?? "Store";
  const networkEmoji = NETWORK_EMOJI[network] ?? "🔗";

  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${link.id}`
      : `/r/${link.id}`;

  const checkThisOut = { en: "Check this out", hi: "यह देखें", gu: "આ જુઓ" }[lang] ?? "Check this out";
  const shareText = `${checkThisOut}: ${link.title}\n${redirectUrl}`;

  return (
    <div className="group relative transition-transform duration-200">
      {/* Main card */}
      <a
        href={redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center gap-3.5 p-3.5 rounded-2xl
          bg-white/[0.05] hover:bg-white/[0.08]
          border border-white/[0.08] hover:border-white/[0.16]
          backdrop-blur-md
          transition-all duration-200 ease-out
          hover:scale-[1.015] active:scale-[0.99]
          shadow-lg shadow-black/20
          cursor-pointer
        "
        aria-label={`Visit ${link.title} on ${networkLabel} (opens in new tab)`}
      >
        {/* Thumbnail / Icon */}
        <div className="flex-shrink-0">
          {link.image ? (
            <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-sm bg-zinc-900">
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
                border ${networkStyle} text-2xl
              `}
              aria-hidden="true"
            >
              {networkEmoji}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`
                inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border
                ${networkStyle}
              `}
            >
              {networkLabel}
            </span>
          </div>

          <p className="text-zinc-100 font-medium text-sm leading-snug line-clamp-2">
            {link.title}
          </p>

          {link.price != null && (
            <p className="text-emerald-400 font-semibold text-xs mt-1">
              ₹{Number(link.price).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* Action arrow */}
        <div
          className="
            flex-shrink-0 w-8 h-8 rounded-full
            bg-white/[0.06] flex items-center justify-center
            group-hover:bg-white/[0.12] transition-colors duration-200
          "
          aria-hidden="true"
        >
          <svg
            className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </a>

      {/* WhatsApp share pill */}
      <div className="flex justify-end mt-1.5 pr-1">
        <a
          href={whatsappShareUrl(shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className="
            touch-target-44 flex items-center gap-1.5 text-xs text-zinc-400
            hover:text-emerald-400 transition-colors px-2 py-1 rounded-full
            hover:bg-white/[0.04]
          "
          aria-label={`Share ${link.title} on WhatsApp`}
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>Share</span>
        </a>
      </div>
    </div>
  );
}

/** Luxury Obsidian Product Card */
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
        flex items-center gap-3.5 p-3.5 rounded-2xl
        bg-gradient-to-r from-indigo-950/30 to-white/[0.04]
        border border-indigo-500/25 hover:border-indigo-400/40
        backdrop-blur-md
        hover:scale-[1.015] active:scale-[0.99]
        transition-all duration-200 ease-out
        shadow-lg shadow-black/20
        group
      "
      aria-label={`Buy ${product.title} for ₹${Number(product.price).toLocaleString("en-IN")}`}
    >
      <div
        className="
          flex-shrink-0 w-12 h-12 rounded-xl
          bg-indigo-500/20 border border-indigo-400/20
          flex items-center justify-center text-xl
        "
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-zinc-100 font-medium text-sm leading-snug line-clamp-2">
          {product.title}
        </p>
        {product.price != null && (
          <p className="text-emerald-400 font-bold text-xs mt-1">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        )}
      </div>

      <button
        className="
          flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full
          bg-white text-zinc-950 group-hover:bg-zinc-100 transition-colors
          shadow-sm
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

// ─── Main Component ───────────────────────────────────────────────────────────

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

  const profileShareText = `Check out @${creator.handle} on CreatorLink India:\n${
    typeof window !== "undefined" ? window.location.href : ""
  }`;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 relative selection:bg-white selection:text-black">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden opacity-25"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
      </div>

      {/* Sticky minimal header */}
      <header
        className="
          sticky top-0 z-50
          flex items-center justify-between
          px-4 h-14
          bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08]
        "
        aria-label="CreatorLink navigation"
      >
        <span className="text-zinc-300 text-xs font-semibold tracking-tight select-none">
          🔗 <span className="font-normal text-zinc-500">CreatorLink</span>
        </span>

        {/* Multi-language selector with guaranteed 44px tap target */}
        {availableLangs.length > 1 && (
          <nav
            className="flex items-center gap-1 bg-white/[0.06] p-1 rounded-full border border-white/[0.08]"
            aria-label="Language options"
          >
            {availableLangs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`
                  touch-target-44 text-xs font-medium px-3 rounded-full
                  transition-all duration-150 cursor-pointer
                  ${
                    lang === l
                      ? "bg-white text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-white"
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

      {/* Main Container */}
      <main className="relative z-10 flex flex-col items-center px-4 py-10 pb-20">
        <div className="w-full max-w-[460px]">

          {/* Profile Section */}
          <section className="flex flex-col items-center text-center" aria-label="Creator profile">
            {/* Avatar */}
            <div
              className="
                relative w-24 h-24 rounded-full
                ring-2 ring-white/20 shadow-2xl
                overflow-hidden bg-zinc-900
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
                <span className="text-white text-2xl font-bold select-none">
                  {creator.name?.[0]?.toUpperCase() ?? "C"}
                </span>
              )}
            </div>

            {/* Display Name */}
            <h1 className="text-xl font-bold text-white mt-4 tracking-tight">
              {creator.name}
            </h1>

            {/* Handle */}
            <p className="text-zinc-400 text-xs font-mono mt-0.5">@{creator.handle}</p>

            {/* Bio */}
            {creator.bio && (
              <p className="text-zinc-300 text-xs sm:text-sm mt-2.5 leading-relaxed max-w-[340px] text-balance">
                {creator.bio}
              </p>
            )}

            {/* Integrated WhatsApp Profile Share Pill */}
            <a
              href={whatsappShareUrl(profileShareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4 inline-flex items-center gap-2
                bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 hover:text-white
                text-xs font-semibold px-4 py-2 rounded-full border border-white/[0.1]
                transition-all duration-200 active:scale-95 shadow-sm
              "
              aria-label="Share creator profile on WhatsApp"
            >
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{{ en: "Share on WhatsApp", hi: "WhatsApp पर शेयर करें", gu: "WhatsApp પર શેર કરો" }[lang] ?? "Share on WhatsApp"}</span>
            </a>
          </section>

          {/* Links Section */}
          {links.length > 0 && (
            <section className="mt-8 space-y-3" aria-label="Curated recommendations">
              <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase text-center mb-3">
                {{ en: "Featured Links", hi: "मेरी पसंद", gu: "મારી પસંદ" }[lang] ?? "Featured Links"}
              </p>
              {links.map((link) => (
                <LinkCard key={link.id} link={link} lang={lang} />
              ))}
            </section>
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <section className="mt-8 space-y-3" aria-label="Products for sale">
              <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase text-center mb-3">
                {{ en: "Digital Store", hi: "डिजिटल स्टोर", gu: "ડિજિટલ સ્ટોર" }[lang] ?? "Digital Store"}
              </p>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} handle={creator.handle} />
              ))}
            </section>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center" aria-label="Site footer">
            <a
              href="https://creatorlink.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Powered by CreatorLink India 🇮🇳
            </a>
          </footer>
        </div>
      </main>
    </div>
  );
}
