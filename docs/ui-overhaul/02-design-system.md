# Phase 2: Design System Specification

**CreatorLink Design System (CLDS)**  
**Benchmark Reference:** Apple.com / Nike.com Digital Flagship Standards  
**Styling Architecture:** Tailwind CSS v4 Native Variables & CSS Custom Properties (`app/globals.css`)  
**Guiding Principles:** Effortless Minimalism, Generous Whitespace, Confident Monochrome Foundation, Tactile Spring Micro-interactions, Strict 8-Point Spatial Grid, Universal WCAG AA Accessibility.

---

## 1. Color Token Architecture

The design system establishes a semantic, double-tier color model: an **editorial neutral foundation** (90% of surfaces and text) accented by a **refined, high-contrast action color** (10% of interactive emphasis). This eliminates the chaotic mix of 20+ arbitrary hex codes identified in Phase 1.

### 1.1 Light Mode Canvas & Surfaces (Dashboard, Landing, Auth)

```css
:root {
  /* Neutral Canvas & Surfaces */
  --surface-canvas:            #ffffff;       /* Pure white page background */
  --surface-subtle:            #f5f5f7;       /* Apple secondary background (sections, wells) */
  --surface-card:              #ffffff;       /* Card and modal backgrounds */
  --surface-card-hover:        #fafafc;       /* Card interactive hover state */
  --surface-elevated:          rgba(255, 255, 255, 0.85); /* Frosted glass floating panels */
  --surface-glass-border:      rgba(0, 0, 0, 0.06);       /* Crisp 1px specular border */
  --surface-border-subtle:     #e5e5ea;       /* Clean neutral divider lines */
  --surface-border-strong:     #d1d1d6;       /* Form input neutral borders */

  /* Text & Content Hierarchy (WCAG AA Compliant >= 4.5:1) */
  --text-primary:              #1d1d1f;       /* High-contrast deep graphite (13.6:1) */
  --text-secondary:            #52525b;       /* Zinc-600 for body descriptions (5.4:1) */
  --text-tertiary:             #71717a;       /* Zinc-500 for timestamps & captions (4.6:1) */
  --text-inverse:              #ffffff;       /* Text on solid dark buttons */

  /* Semantic Brand & Action Accents */
  --color-accent:              #111111;       /* Nike/Apple deep black primary CTA */
  --color-accent-hover:        #2d2d2f;       /* Subtle lightening on button hover */
  --color-brand-indigo:        #4338ca;       /* Refined indigo-700 (primary link/tag accent) */
  --color-brand-indigo-light:  #6366f1;       /* Active indicators and highlights */
  --color-brand-soft:          #eef2ff;       /* Subtle tinted badge background */

  /* System Feedback */
  --feedback-success:          #059669;       /* Emerald-600 */
  --feedback-success-bg:       #ecfdf5;       /* Emerald-50 */
  --feedback-warning:          #d97706;       /* Amber-600 */
  --feedback-warning-bg:       #fffbeb;       /* Amber-50 */
  --feedback-error:            #dc2626;       /* Red-600 */
  --feedback-error-bg:         #fef2f2;       /* Red-50 */

  /* Focus Ring */
  --focus-ring:                0 0 0 3px rgba(67, 56, 202, 0.35);
  --focus-ring-dark:           0 0 0 3px rgba(255, 255, 255, 0.45);
}
```

### 1.2 Dark Obsidian Canvas (Public Creator Bio `/[handle]`)

```css
.theme-obsidian {
  /* Surfaces */
  --surface-canvas:            #09090b;       /* Pure deep obsidian black */
  --surface-subtle:            #121215;       /* Secondary tile well */
  --surface-card:              rgba(255, 255, 255, 0.05); /* Translucent frosted glass */
  --surface-card-hover:        rgba(255, 255, 255, 0.09); /* Responsive frosted highlight */
  --surface-glass-border:      rgba(255, 255, 255, 0.10); /* Specular highlight border */
  --surface-border-subtle:     rgba(255, 255, 255, 0.07);

  /* Typography */
  --text-primary:              #f4f4f5;       /* Near-white (15.2:1) */
  --text-secondary:            #a1a1aa;       /* Zinc-400 (7.1:1) */
  --text-tertiary:             #71717a;       /* Zinc-500 */
  --text-inverse:              #09090b;

  /* Accents */
  --color-accent:              #ffffff;       /* Pure white solid action buttons */
  --color-accent-hover:        #f4f4f5;
  --color-brand-indigo:        #818cf8;       /* Indigo-400 for dark mode */
  --color-brand-soft:          rgba(99, 102, 241, 0.15);
}
```

---

## 2. Typography Scale & Optical Hierarchy

Standardizes around modern high-legibility system sans (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif`).

| Token | Size | Line Height | Letter Spacing | Weight | Recommended Role |
|---|---|---|---|---|---|
| `--font-display-hero` | `clamp(2.75rem, 6vw, 4.25rem)` (44–68px) | `1.05` | `-0.035em` | Bold (700) | Landing Hero display statement |
| `--font-h1` | `2.25rem` (36px) | `1.15` | `-0.025em` | Bold (700) | Major Section headers, Product title |
| `--font-h2` | `1.75rem` (28px) | `1.2` | `-0.02em` | Semibold (600) | Page titles, Dashboard main headings |
| `--font-h3` | `1.25rem` (20px) | `1.3` | `-0.015em` | Semibold (600) | Card headers, Widget titles |
| `--font-body-lg` | `1.125rem` (18px) | `1.5` | `-0.01em` | Regular (400) / Medium (500) | Hero sub-copy, Lead paragraphs |
| `--font-body` | `0.9375rem` (15px) | `1.55` | `0em` | Regular (400) / Medium (500) | Primary interface text, Form labels |
| `--font-body-sm` | `0.8125rem` (13px) | `1.45` | `+0.005em` | Medium (500) | Subtext, Badge labels, Table data |
| `--font-caption` | `0.6875rem` (11px) | `1.4` | `+0.02em` | Semibold (600) uppercase | Section overlines, Micro-metadata |

---

## 3. Strict 8-Point Spatial Grid

Every layout dimension, padding, margin, and gap adheres strictly to the geometric 8-point system (with 4px for micro-alignment):

```css
:root {
  --space-1:  4px;    /* Micro: Icon-text gaps, badge padding */
  --space-2:  8px;    /* Compact: Chip gaps, tight list items */
  --space-3:  12px;   /* Standard compact: Input horizontal padding */
  --space-4:  16px;   /* Base: Card interior padding on mobile */
  --space-5:  20px;   /* Intermediate: Dialog headers */
  --space-6:  24px;   /* Standard: Desktop card interior, widget gaps */
  --space-8:  32px;   /* Section rhythm: Grid gaps, panel padding */
  --space-12: 48px;   /* Major separation: Dashboard content gaps */
  --space-16: 64px;   /* Page rhythm: Hero section padding */
  --space-24: 96px;   /* Major section breathing room (Landing) */
  --space-32: 128px;  /* Editorial showcase spacing */
}
```

---

## 4. Corner Radius & Elevation Hierarchy

```css
:root {
  /* Corner Radii */
  --radius-xs:   6px;   /* Micro badges */
  --radius-sm:   10px;  /* Dropdowns, small chips */
  --radius-md:   14px;  /* Form inputs, secondary buttons */
  --radius-lg:   20px;  /* Standard cards, dialogs, widgets */
  --radius-xl:   28px;  /* Hero mockup shells, feature spotlights */
  --radius-pill: 9999px;/* Action buttons, language toggles */

  /* Elevation Shadows & Specular Highlights */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.02);
  --shadow-card:   0 4px 16px -2px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  --shadow-hover:  0 16px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04);
  --shadow-modal:  0 24px 64px -12px rgba(0, 0, 0, 0.16);

  /* Apple Specular Inset Border (replaces muddy dark drop shadows) */
  --border-specular: inset 0 1px 0 0 rgba(255, 255, 255, 0.25);
  --border-specular-dark: inset 0 1px 0 0 rgba(255, 255, 255, 0.12);
}
```

---

## 5. Motion System & Spring Physics

```css
:root {
  /* Durations */
  --duration-instant: 120ms;
  --duration-swift:   220ms;
  --duration-normal:  320ms;
  --duration-relaxed: 480ms;

  /* Easing Functions (Apple HIG & Nike Fluid Dynamics) */
  --ease-apple-spring:  cubic-bezier(0.16, 1, 0.3, 1);       /* Instant response, graceful settle */
  --ease-out-quad:      cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth fade */
  --ease-in-out-smooth: cubic-bezier(0.65, 0, 0.35, 1);       /* Layout morph */
}

/* Universal Accessibility Reduced-Motion Fallback */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Core Component Specifications

### 6.1 Buttons & Interactive Controls
- **Primary Pill Action (`btn-primary`):** Solid `#111111` background, `#ffffff` text, `font-medium` (500), `height: 44px`, `px-6` (24px), `border-radius: 9999px`. Subtle scale on click: `active:scale-[0.985]`, `transition: all 220ms var(--ease-apple-spring)`. Focus ring: `outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2`.
- **Secondary Ghost Action (`btn-ghost`):** Transparent background, `1px solid var(--surface-border-strong)`, `#1d1d1f` text, `hover:bg-neutral-100`, `height: 44px`, `px-5`.
- **Mobile Touch Targets:** All clickable icons and reorder triggers strictly enforce `min-width: 44px; min-height: 44px;` using pseudo-hit areas where necessary.

### 6.2 Form Inputs & Controls
- **Field Container:** `height: 48px`, `px-4`, `border-radius: 12px`, background `#f5f5f7` (borderless subtle well) or `#ffffff` with `1px solid var(--surface-border-subtle)`.
- **Focus State:** Background transitions to `#ffffff`, crisp 1px border `#111111` or `#4338ca`, with subtle 3px glow ring.
- **Labels & Hints:** 13px bold/semibold label above input; helper text 12px with WCAG AA compliant `#52525b` color.

### 6.3 Cards & Surfaces
- **Surface Card:** `#ffffff`, `border-radius: 20px`, `1px solid var(--surface-glass-border)`, `box-shadow: var(--shadow-card)`. Internal padding `p-6` (24px) desktop, `p-4` (16px) mobile.
- **Interactive Card Hover (`card-hover`):** `transform: translateY(-2px); box-shadow: var(--shadow-hover); border-color: rgba(0, 0, 0, 0.1); transition: all 240ms var(--ease-apple-spring);`.
- **Obsidian Glass Card (Public Bio):** `background: rgba(255, 255, 255, 0.05)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255, 255, 255, 0.1)`, `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2)`.

### 6.4 Navigation Architecture
- **Sticky Desktop TopBar:** `height: 56px`, `backdrop-filter: blur(20px)`, `background: rgba(255, 255, 255, 0.8)`, `border-bottom: 1px solid rgba(0, 0, 0, 0.06)`, `z-index: 50`.
- **Mobile Bottom Navigation:** `height: 64px`, `backdrop-filter: blur(20px)`, `background: rgba(255, 255, 255, 0.92)`, border top `1px solid rgba(0, 0, 0, 0.06)`, `safe-area-inset-bottom` support.
- **Desktop Sidebar:** Clean minimalist flat sidebar, `width: 240px`, active item highlighted with soft neutral pill (`bg-neutral-100 text-neutral-900 font-semibold`) and 4px rounded left accent marker.
