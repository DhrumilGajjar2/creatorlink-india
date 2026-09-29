"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: "🔗",
    title: "Link-in-Bio",
    desc: "Share all your links in one beautiful page. Works on Instagram, YouTube, WhatsApp & more.",
  },
  {
    icon: "🏷️",
    title: "Auto Affiliate Tags",
    desc: "Paste any Amazon or Flipkart URL — we auto-detect and tag it with your affiliate ID.",
  },
  {
    icon: "🌐",
    title: "Multilingual",
    desc: "Toggle your page between English, हिन्दी, and ગુજરાતી. Reach every corner of India.",
  },
  {
    icon: "📊",
    title: "Real Analytics",
    desc: "See exactly who's clicking what. Track clicks, devices, and last-clicked timestamps.",
  },
  {
    icon: "💳",
    title: "Sell Products",
    desc: "Create digital product listings and accept INR payments via Razorpay — zero setup.",
  },
  {
    icon: "📱",
    title: "WhatsApp Share",
    desc: "One-tap WhatsApp sharing for every link and your full page — built for Indian audiences.",
  },
];

const TESTIMONIALS = [
  { handle: "@priya_fashion", text: "CreatorLink ने मेरी income 3x कर दी! 🔥" },
  { handle: "@techguyjaipur", text: "Amazon affiliate earnings doubled in 2 weeks 🚀" },
  { handle: "@mumbai_foodie", text: "Finally a tool that understands Indian creators ❤️" },
  { handle: "@sneha_lifestyle", text: "Flipkart links with auto affiliate — game changer! 💫" },
  { handle: "@fitness_delhi", text: "WhatsApp share feature is absolutely brilliant 💪" },
  { handle: "@kochi_vlogs", text: "Setup लिया 2 minutes में, earnings शुरू same day! 🎉" },
  { handle: "@bengaluru_tech", text: "Analytics are insanely detailed. I love this product 📈" },
  { handle: "@kolkata_artist", text: "বাংলায় page করা যাবে কি? Yes please! 🙌" },
];

const TRUST_LOGOS = [
  { emoji: "🛒", name: "Amazon.in" },
  { emoji: "🛍️", name: "Flipkart" },
  { emoji: "👗", name: "Myntra" },
  { emoji: "💳", name: "Razorpay" },
];

/* ────────────────────────────────────────────────
   PHONE MOCKUP
──────────────────────────────────────────────── */

function PhoneMockup() {
  return (
    <div className="relative flex justify-center">
      {/* Glow ring behind the phone */}
      <div
        style={{
          position: "absolute",
          inset: "-12%",
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.25) 0%, transparent 70%)",
          borderRadius: "9999px",
          pointerEvents: "none",
        }}
      />

      {/* Phone shell */}
      <div
        className="relative animate-float"
        style={{
          width: 220,
          height: 420,
          borderRadius: 36,
          background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)",
          boxShadow:
            "0 32px 80px rgba(79,70,229,0.35), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
          padding: 3,
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 33,
            background: "#f8fafc",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "20px 12px 12px",
          }}
        >
          {/* Notch */}
          <div
            style={{
              width: 60,
              height: 10,
              borderRadius: 99,
              background: "#1e1b4b",
              marginBottom: 4,
              flexShrink: 0,
            }}
          />

          {/* Avatar */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            ✨
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#111827",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            Priya Sharma
            <br />
            <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 9 }}>
              Fashion & Lifestyle
            </span>
          </div>

          {/* Link cards */}
          {[
            { emoji: "🛒", label: "Amazon Wishlist", color: "#fff7ed", border: "#fed7aa" },
            { emoji: "📸", label: "Instagram Page",  color: "#fdf2f8", border: "#f9a8d4" },
            { emoji: "▶️", label: "YouTube Channel", color: "#fef2f2", border: "#fca5a5" },
            { emoji: "💬", label: "WhatsApp Group",  color: "#f0fdf4", border: "#86efac" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 12,
                background: item.color,
                border: `1px solid ${item.border}`,
                display: "flex",
                alignItems: "center",
                gap: 7,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 12 }}>{item.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: "#374151" }}>
                {item.label}
              </span>
            </div>
          ))}

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              fontSize: 7,
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            creatorlink.in/priyasharma
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   NAV
──────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-sm py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🔗</span>
          <span
            className="font-extrabold text-lg tracking-tight"
            style={{ color: "var(--color-brand)" }}
          >
            CreatorLink
            <span className="text-gray-800"> India</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
          <Link href="/register" className="btn-primary py-2 px-5 text-sm">
            Start for Free
          </Link>
        </nav>

        {/* Mobile CTA */}
        <Link href="/register" className="btn-primary py-2 px-4 text-sm md:hidden">
          Start Free
        </Link>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background blobs */}
      <div
        className="hero-blob"
        style={{
          width: 560,
          height: 560,
          background: "rgba(99,102,241,0.18)",
          top: "-10%",
          right: "-8%",
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 400,
          height: 400,
          background: "rgba(124,58,237,0.12)",
          bottom: "5%",
          left: "-6%",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div className="flex flex-col items-start">
            {/* Trust badge */}
            <div
              className="animate-fade-in-up animate-pulse-glow mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "var(--color-brand)",
              }}
            >
              <span>✨</span>
              <span>Trusted by 10,000+ Indian creators</span>
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in-up-1 font-extrabold leading-tight text-balance mb-5"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "#0f0c29" }}
            >
              Your Links,{" "}
              <span className="gradient-text">Your Earnings</span>,
              <br />
              Your India&nbsp;🇮🇳
            </h1>

            {/* Sub-headline */}
            <p
              className="animate-fade-in-up-2 text-lg text-gray-600 leading-relaxed mb-8 max-w-lg"
            >
              India's first link-in-bio built for creators from{" "}
              <strong className="text-gray-800">Kochi to Kolkata</strong>. Monetize
              with Amazon, Flipkart &amp; Myntra affiliate links — in{" "}
              <strong className="text-gray-800">Hindi, Gujarati &amp; English</strong>.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up-3 flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary">
                Create Your Page Free
              </Link>
              <a href="#features" className="btn-ghost">
                See an Example →
              </a>
            </div>

            {/* Social proof micro */}
            <div className="animate-fade-in-up-4 mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["🧑‍💻", "👩‍🎤", "👨‍🍳", "👩‍🏫"].map((em, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white"
                    style={{ background: `hsl(${240 + i * 30}, 70%, 92%)` }}
                  >
                    {em}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">10,000+</span> creators
                already earning
              </p>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="animate-fade-in-up-2 hidden lg:flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   TRUST LOGOS
──────────────────────────────────────────────── */

function TrustLogos() {
  return (
    <section className="py-12 border-y border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
          Works with India's favourite platforms
        </p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {TRUST_LOGOS.map(({ emoji, name }) => (
            <div
              key={name}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 card-hover"
            >
              <span className="text-xl">{emoji}</span>
              <span className="font-semibold text-gray-700 text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   FEATURES
──────────────────────────────────────────────── */

function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4"
            style={{
              background: "rgba(99,102,241,0.08)",
              color: "var(--color-brand)",
            }}
          >
            Everything you need
          </span>
          <h2
            className="font-extrabold text-3xl sm:text-4xl text-gray-900 mb-4"
          >
            Built for the{" "}
            <span className="gradient-text">Indian creator economy</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every feature is designed around how Indian creators actually work —
            not a copy-paste of Western tools.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card-hover rounded-2xl bg-white p-6"
              style={{
                border: "1px solid #e5e7eb",
                boxShadow: "var(--shadow-card)",
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: "rgba(99,102,241,0.1)" }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   MARQUEE / SOCIAL PROOF
──────────────────────────────────────────────── */

function SocialProof() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-16 overflow-hidden" style={{ background: "#f8faff" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          What creators are saying 💬
        </h2>
        <p className="text-gray-500 text-sm">Real creators. Real results. No paid promotions.</p>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f8faff, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #f8faff, transparent)" }}
        />

        {/* Track */}
        <div className="flex gap-4" style={{ width: "max-content" }}>
          <div className="flex gap-4 animate-marquee">
            {doubled.map((t, i) => (
              <div
                key={`${t.handle}-${i}`}
                className="flex-shrink-0 rounded-2xl bg-white p-5"
                style={{
                  width: 260,
                  border: "1px solid #e5e7eb",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  "{t.text}"
                </p>
                <p
                  className="text-xs font-bold"
                  style={{ color: "var(--color-brand)" }}
                >
                  {t.handle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   CTA SECTION
──────────────────────────────────────────────── */

function CTASection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--gradient-brand)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: "#ffffff", filter: "blur(80px)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full opacity-15 pointer-events-none"
        style={{ background: "#a78bfa", filter: "blur(60px)" }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-4xl mb-6 block">🚀</span>
        <h2 className="font-extrabold text-3xl sm:text-4xl text-white mb-4 text-balance">
          Start earning from your links today
        </h2>
        <p className="text-indigo-200 text-lg mb-10">
          Free forever. No credit card. Setup in 2 minutes.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:-translate-y-1"
          style={{
            color: "var(--color-brand)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          Create Your Free Page ✨
        </Link>

        <p className="mt-6 text-indigo-300 text-sm">
          Join 10,000+ creators already on CreatorLink India
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   FOOTER
──────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              <span className="font-extrabold text-white text-lg">
                CreatorLink <span style={{ color: "var(--color-brand-light)" }}>India</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">Made with ❤️ for Indian Creators</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Register",  href: "/register" },
              { label: "Login",     href: "/login" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="hover:text-indigo-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
          © 2024 CreatorLink India. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <TrustLogos />
      <Features />
      <SocialProof />
      <CTASection />
      <Footer />
    </main>
  );
}
