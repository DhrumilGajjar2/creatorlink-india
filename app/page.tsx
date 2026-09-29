"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: "🔗",
    title: "One Bio Link for Everything",
    desc: "Unify all your affiliate products, brand partnerships, and social channels into a single, high-converting mobile storefront.",
  },
  {
    icon: "🏷️",
    title: "Automatic Affiliate Tagging",
    desc: "Paste any Amazon, Flipkart, or Myntra link. CreatorLink automatically detects the platform and embeds your affiliate tag.",
  },
  {
    icon: "🌐",
    title: "Native Trilingual Experience",
    desc: "Offer 1-tap switching between English, हिन्दी, and ગુજરાતી. Connect authentically with audiences across India.",
  },
  {
    icon: "📊",
    title: "Real-Time Click Analytics",
    desc: "Track device breakdown, hourly click surges, and top-converting products to maximize your earnings per post.",
  },
  {
    icon: "💳",
    title: "Sell Digital Products in INR",
    desc: "Accept payments via UPI, Credit Cards, and NetBanking through seamless Razorpay integration with zero setup hassle.",
  },
  {
    icon: "📱",
    title: "Instant WhatsApp Sharing",
    desc: "Engineered for India: followers can instantly share individual products or your full storefront directly to WhatsApp chats.",
  },
];

const TESTIMONIALS = [
  { handle: "@priya_fashion", text: "CreatorLink helped double my monthly brand conversions. The clean layout makes all the difference." },
  { handle: "@techguyjaipur", text: "Amazon affiliate revenue grew 140% in three weeks. The auto-tagging feature saves hours every week." },
  { handle: "@mumbai_foodie", text: "Finally an Indian platform that feels world-class. It loads instantly and looks incredibly sleek." },
  { handle: "@sneha_lifestyle", text: "Being able to offer my bio page in Hindi and Gujarati connected me with thousands of new followers." },
  { handle: "@fitness_delhi", text: "WhatsApp sharing direct from product cards has been a game-changer for my fitness guides." },
  { handle: "@kochi_vlogs", text: "Setup took 90 seconds. It works effortlessly with all shopping links." },
  { handle: "@bengaluru_tech", text: "The cleanest creator dashboard I have used. Fast, focused, and no unnecessary clutter." },
  { handle: "@kolkata_artist", text: "Selling digital art presets with UPI payments transformed my creative business." },
];

const TRUST_LOGOS = [
  { emoji: "🛒", name: "Amazon Associates" },
  { emoji: "🛍️", name: "Flipkart Affiliate" },
  { emoji: "👗", name: "Myntra Creator" },
  { emoji: "⚡", name: "Razorpay Payments" },
];

/* ────────────────────────────────────────────────
   PHONE MOCKUP (Apple-Grade Precision Titanium Shell)
──────────────────────────────────────────────── */

function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center">
      {/* Soft ambient backlight */}
      <div
        className="absolute w-72 h-72 rounded-full opacity-30 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(255,255,255,0) 70%)",
        }}
        aria-hidden="true"
      />

      {/* Outer titanium frame */}
      <div
        className="relative animate-float"
        style={{
          width: 250,
          height: 480,
          borderRadius: 44,
          background: "linear-gradient(145deg, #27272a 0%, #09090b 100%)",
          boxShadow:
            "0 32px 64px -12px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 1px rgba(255,255,255,0.2)",
          padding: 8,
        }}
      >
        {/* Inner screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 36,
            background: "#09090b",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "18px 14px 14px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              width: 72,
              height: 14,
              borderRadius: 99,
              background: "#000000",
              marginBottom: 6,
              flexShrink: 0,
            }}
          />

          {/* Avatar */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3730a3, #4338ca)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              border: "1.5px solid rgba(255,255,255,0.15)",
            }}
          >
            ✨
          </div>

          {/* Creator Name & Tag */}
          <div style={{ textAlign: "center", lineHeight: 1.25 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
              Aarav Mehta
            </span>
            <div style={{ fontWeight: 400, color: "#a1a1aa", fontSize: 10, marginTop: 2 }}>
              Tech &amp; Everyday Gear · Bengaluru
            </div>
          </div>

          {/* Sample Product Cards */}
          {[
            { tag: "Amazon", label: "Sony WH-1000XM5 Headphones", price: "₹29,990", color: "#f97316" },
            { tag: "Flipkart", label: "Minimalist Felt Desk Mat", price: "₹1,299", color: "#3b82f6" },
            { tag: "Product", label: "Ultimate Notion Workspace 2026", price: "₹499", color: "#10b981" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: item.color }}>{item.tag}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#ffffff" }}>{item.price}</span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#f4f4f5",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}

          {/* Subtle branding footer */}
          <div
            style={{
              marginTop: "auto",
              fontSize: 8,
              color: "#71717a",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            creatorlink.in/aarav
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   NAVBAR (Apple Minimalist Translucent Header)
──────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-black/[0.06] shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl">🔗</span>
          <span className="font-bold text-base tracking-tight text-neutral-900 group-hover:text-indigo-600 transition-colors">
            CreatorLink <span className="font-normal text-neutral-500">India</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#features"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Stories
          </a>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Sign In
          </Link>
          <Link href="/register" className="btn-primary py-2 px-5 text-sm">
            Get Started Free
          </Link>
        </nav>

        {/* Mobile Action */}
        <Link href="/register" className="btn-primary py-2 px-4 text-xs md:hidden">
          Get Started
        </Link>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────
   HERO SECTION (Effortless Apple/Nike Authority)
──────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-20 bg-gradient-to-b from-[#fbfbfd] to-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200/60 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Built for modern Indian social creators</span>
            </div>

            {/* Display Headline */}
            <h1
              className="font-bold text-neutral-950 tracking-tight leading-[1.08] text-balance mb-6"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)", letterSpacing: "-0.035em" }}
            >
              Your links. <br />
              <span className="gradient-text">Your earnings.</span> <br />
              Effortlessly in one place.
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-xl text-balance">
              The premier link-in-bio built for creators across India. Automatically monetize
              Amazon, Flipkart &amp; Myntra affiliate recommendations with trilingual support
              and direct INR payment links.
            </p>

            {/* Single-Purpose High-Contrast CTAs */}
            <div className="flex flex-wrap gap-3.5 items-center">
              <Link href="/register" className="btn-primary">
                Get Started Free →
              </Link>
              <a href="#features" className="btn-ghost">
                Explore Features
              </a>
            </div>

            {/* Creator Social Proof Strip */}
            <div className="mt-10 flex items-center gap-3.5 pt-6 border-t border-neutral-100 w-full max-w-lg">
              <div className="flex -space-x-2">
                {["🧑‍💻", "👩‍🎤", "👨‍🍳", "👩‍🏫"].map((em, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-neutral-100 border-2 border-white shadow-xs"
                  >
                    {em}
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Trusted by <strong className="text-neutral-900 font-semibold">10,000+</strong> Indian creators nationwide
              </p>
            </div>
          </div>

          {/* Right Phone Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   TRUSTED PLATFORMS STRIP
──────────────────────────────────────────────── */

function TrustLogos() {
  return (
    <section className="py-12 border-y border-neutral-100 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
          Works seamlessly with major Indian platforms
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
          {TRUST_LOGOS.map(({ emoji, name }) => (
            <div
              key={name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-neutral-200/60 shadow-xs"
            >
              <span className="text-base">{emoji}</span>
              <span className="font-semibold text-neutral-700 text-xs sm:text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   FEATURES GRID (Generous 32px Whitespace & Polish)
──────────────────────────────────────────────── */

function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 block">
            Crafted for Creators
          </span>
          <h2 className="font-bold text-3xl sm:text-4xl text-neutral-950 tracking-tight mb-4">
            Everything you need to monetize your influence.
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed">
            Eliminate messy bio link trees. Every feature is specifically engineered around the daily
            workflows of Indian social creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-hover rounded-2xl bg-[#fafafc] border border-neutral-200/60 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-2xl mb-6 shadow-xs">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-neutral-900 text-lg mb-2 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   TESTIMONIALS MARQUEE (Accessible & Pausable)
──────────────────────────────────────────────── */

function Testimonials() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-20 bg-[#f5f5f7] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mb-3">
          Creator Stories
        </h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Hover or focus to pause. Real feedback from creators driving genuine revenue.
        </p>
      </div>

      <div className="relative">
        {/* Edge fade gradients */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f5f5f7, transparent)" }}
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #f5f5f7, transparent)" }}
          aria-hidden="true"
        />

        {/* Marquee Track */}
        <div className="flex gap-4" style={{ width: "max-content" }}>
          <div className="flex gap-4 animate-marquee">
            {doubled.map((t, i) => (
              <div
                key={`${t.handle}-${i}`}
                className="flex-shrink-0 rounded-2xl bg-white p-6 border border-neutral-200/60 shadow-xs flex flex-col justify-between"
                style={{ width: 300 }}
              >
                <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-xs font-semibold text-indigo-700">
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
   MINIMALIST FINAL CALL TO ACTION
──────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <h2 className="font-bold text-3xl sm:text-4xl text-white tracking-tight mb-4">
          Ready to elevate your bio link?
        </h2>
        <p className="text-neutral-400 text-base max-w-lg mx-auto mb-8">
          Free forever. No credit card required. Set up your custom trilingual page in under two minutes.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-white text-neutral-950 font-semibold px-8 py-3.5 rounded-full hover:bg-neutral-100 active:scale-98 transition-all text-sm shadow-lg"
        >
          Create Your Free Page ✨
        </Link>
        <p className="text-xs text-neutral-500 mt-4">
          Takes less than 2 minutes · Join 10,000+ creators
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   FOOTER (Clean & Accessible)
──────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200/60 text-neutral-500 py-12 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span>🔗</span>
          <span className="font-bold text-neutral-900">CreatorLink India</span>
          <span className="text-xs text-neutral-400">· Made for Indian Creators</span>
        </div>
        <nav className="flex items-center gap-6 text-xs font-medium">
          <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/register" className="hover:text-neutral-900 transition-colors">
            Register
          </Link>
          <Link href="/login" className="hover:text-neutral-900 transition-colors">
            Sign In
          </Link>
        </nav>
        <div className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} CreatorLink India. All rights reserved.
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
    <main className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <TrustLogos />
      <Features />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
