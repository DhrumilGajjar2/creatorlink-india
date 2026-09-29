# Phase 1: Performance & Motion Audit (Agent D)

**Auditor:** Agent D — Performance & Motion Auditor  
**Standard:** Apple-Grade 60fps Micro-interactions & Core Web Vitals (LCP < 2.0s, CLS < 0.05, INP < 150ms)  
**Focus:** Lighthouse metrics, Core Web Vitals, asset optimization, image loading, layout shift prevention, animation physics, reduced motion.

---

## 1. Executive Summary & Baseline Metrics

The Next.js 16 (App Router) foundation is fast, compiling in ~3.1s on production build. However, runtime rendering and CSS animation performance can be significantly improved to reach Apple/Nike tier fluidity.

### Baseline Lighthouse Audit Scores (Dev Server Baseline):
- **Performance:** 46 (Dev build overhead; Turbopack unbundled client bundles and unoptimized CSS/images)
- **Accessibility:** 95
- **Best Practices:** 100
- **SEO:** 100

### Key Performance Bottlenecks:
1. **Unoptimized Retail Images:** `CreatorPublicPage.tsx` and `LinksManager.tsx` use `<Image ... unoptimized />`. This bypasses Next.js image resizing, serving full-size 2MB+ product images directly from Amazon/Flipkart CDNs without WebP/AVIF compression or responsive `srcset`.
2. **Heavy GPU Filter Blur Blobs:** `globals.css` uses multiple `.hero-blob` elements with `filter: blur(80px)` and large dimensions (560px × 560px) that trigger expensive GPU compositing layers during scroll.
3. **Cumulative Layout Shift (CLS) on Marquee and Forms:** The testimonial marquee and dynamic link list cause visible layout shifts during client-side hydration.
4. **Mechanical Linear Animations:** Existing CSS keyframes (`float 3s ease-in-out`, `pulse-glow 2.4s`, `fadeInUp 0.4s ease`) use basic easing curves rather than Apple's signature spring-physics timing (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 2. Detailed Findings & Remediation Matrix

| Page / Component | Performance & Motion Issue | Severity | Proposed Fix | Effort | Screenshot Reference |
|---|---|---|---|---|---|
| **Creator Profile (`/[handle]`)** | Retail product images bypass Next.js optimization (`unoptimized` flag). Causes slow LCP and high bandwidth usage on cellular networks. | **High** | Configure `next.config.ts` with allowed remote retail image domains; serve modern WebP formats with proper `sizes` and width/height dimensions. | M | `creator-profile-mobile.png` |
| **Landing (`/`) Hero Blobs** | `.hero-blob` elements use `filter: blur(80px)` and absolute layout, triggering repaints on mobile scroll. | **Med** | Replace CSS `filter: blur(80px)` with optimized radial-gradient CSS backgrounds or pre-rendered lightweight SVGs. | S | `landing-desktop.png` |
| **Landing (`/`) Marquee** | Infinite marquee animation runs on DOM elements directly, consuming continuous CPU/GPU cycles even when scrolled out of view. | **Med** | Add `content-visibility: auto` to off-screen marquee section; pause animation when off-screen using `IntersectionObserver` or CSS `animation-timeline`. | M | `landing-desktop.png` |
| **Global / Animation Easing** | Animations (`fadeInUp`, `slideIn`) feel sluggish with standard `ease` curves. Lack Apple-style instant responsiveness. | **Med** | Implement Apple-standard cubic bezier easing: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like deceleration) with swift durations (220ms–350ms). | S | All pages |
| **Global / Hover Transitions** | Card and button hover transforms (`translateY(-3px)`, `scale(1.02)`) lack hardware acceleration (`will-change: transform; transform: translateZ(0);`), causing occasional micro-stutters. | **Low** | Promote transforming elements to hardware compositor with `transform: translateZ(0)` or `backface-visibility: hidden`. | S | `dashboard-links-desktop.png` |
| **Dashboard Recharts** | BarChart rerenders on window resize without debounced RAF, causing jank during split-screen resizing. | **Low** | Ensure Recharts `ResponsiveContainer` uses `debounce={150}` to prevent frame drops during window resize. | S | `dashboard-analytics-desktop.png` |
| **Landing (`/`) Sticky Header** | Header scroll listener (`window.scrollY > 12`) runs on scroll events without throttling or passive listener optimization. | **Low** | Ensure passive scroll event listener with requestAnimationFrame debounce or modern CSS scroll-driven animation. | S | `landing-desktop.png` |

---

## 3. Motion System Design Specs (Apple/Nike Standard)

```css
/* Recommended Motion Tokens */
:root {
  /* Durations */
  --motion-duration-fast: 150ms;
  --motion-duration-normal: 250ms;
  --motion-duration-slow: 400ms;
  --motion-duration-deliberate: 600ms;

  /* Easings — Apple & Nike Spring Physics */
  --motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1);       /* Swift enter / smooth settle */
  --motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* Smooth continuous transitions */
  --motion-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Gentle delightful bounce */
}

/* Reduced Motion Fallback */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 4. Subtle Motion Opportunities to Elevate Polish

1. **Staggered Entry for Cards:** Apply subtle 40ms staggered reveal (`opacity: 0 -> 1; transform: translateY(8px) -> translateY(0)`) when dashboard links and products mount.
2. **Subtle Tactile Scale on Press:** Active button state should use `active:scale-[0.985]` with `transition: transform 120ms var(--motion-ease-out)`, mimicking native iOS buttons.
3. **Smooth Tab Indicators:** Mobile bottom navigation indicator dot should fluidly transition with a spring physics sliding pill.
4. **Delicate Frosted Glass Reveal:** TopBar blur activates smoothly upon scroll down with `backdrop-filter: blur(20px)` and subtle border highlight.
