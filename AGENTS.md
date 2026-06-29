# AGENTS.md — Austine Tech Innovation Hub

> Knowledge for AI agents working in this repository. Read this first.

## Project identity

Company website for **Austine Tech Innovation Hub**, a Bungoma, Kenya-based tech studio (founded May 2026). Single-page marketing/portfolio site deployed at `https://austine-tech-innovation-hub.vercel.app`.

## Tech stack

- **Pure HTML / CSS / JS** — no frameworks, no build tools, no package.json
- **Three.js 0.160** — CDN import map for the spinning globe (`jsdelivr`)
- **Deployment**: Vercel (some linked projects also on Netlify)
- **External CDN deps**: Google Fonts (Fraunces, Inter, JetBrains Mono), Unsplash images, thum.io screenshots, three-globe textures

## File map

| File | Role |
|------|------|
| `index.html` | **Canonical site** — ~1,530 lines, 14 sections |
| `css/styles.css` | All styles — ~810 lines. CSS custom properties for theming, 6 breakpoints |
| `js/script.js` | Core site JS — ~250 lines. IIFE-wrapped vanilla JS, 13 features |
| `js/translations.js` | Translation engine + SW/FR/AR dictionaries — IIFE-wrapped, sets `window.atSetLang` |
| `images/` | 14 local assets (logo, team photos, gallery shots, preview) |

## Architecture: page sections (in order)

1. **Scroll progress bar** — fixed 3px lime→warm gradient at page top
2. **Back-to-top button** — fixed bottom-right, fades in after 500px scroll
3. **Ticker ribbon** — scrolling announcement bar (CSS animation only)
4. **Header** — sticky nav with logo, 6 nav links, language switcher, theme toggle, CTA, hamburger
5. **Hero** — display headline, photo collage, postcard, 4 WhatsApp-linked pathways
6. **Story** — company origin, 2-column grid with landscape photo
7. **Workflow** — 5-step alternating timeline (Discovery→Design→Prototype→Build→Ship) with scroll-triggered reveal, sticky badges, and animated vertical progress line
8. **Who / Stats** — animated counter numbers, Three.js spinning globe backdrop with 23.5° axial tilt
9. **Services (Programs)** — 6 service cards in responsive grid
10. **Projects (Startups)** — magazine-style grid with live thum.io screenshots
11. **Testimonials** — 4-slide auto-rotating carousel (6s interval), dot navigation
12. **Team (Spaces)** — 3 co-founder cards
13. **Impact** — philosophy + client testimonial
14. **Contact (Signoff)** — full-bleed team photo, contact blocks (WhatsApp, Email, Social with SVG icons), newsletter form
15. **Footer** — brand info, service/studio links

## CSS architecture

- **Theme engine**: `:root` (light) + `[data-theme="dark"]` overrides
- **Key variables**: `--ff-display` (Fraunces), `--ff-sans` (Inter), `--ff-mono` (JetBrains Mono), `--c-ink`, `--c-paper`, `--c-bg`, `--c-accent` (lime `#E8FF8B`), `--c-warm` (orange `#FF7A59`)
- **Breakpoints**: 1100px, 1000px, 900px, 700px, 480px, 380px + landscape + `prefers-reduced-motion` + print
- **Accessibility**: `.skip-link`, `prefers-reduced-motion`, RTL via `[dir="rtl"]`, print styles

## JS features (13 total, each in own try/catch)

1. Scroll header class (`.is-scrolled`)
2. Mobile nav toggle (burger → `.is-open`)
3. Theme toggle (`data-theme` on `<html>`, persisted to `atih-theme`)
4. Reveal animations (IntersectionObserver on `.reveal`)
5. Animated counters (IntersectionObserver on `.stat-num`)
6. Newsletter form → `mailto:`
7. Smooth scroll for anchor links
8. Hero text stagger animation
9. Language switcher (calls `window.atSetLang`)
10. Saved language restore on load
11. **Scroll progress bar** + **back-to-top button**
12. **Testimonial carousel** (auto-rotate + dot nav)
13. **Workflow flow-line fill** (IntersectionObserver tracks step reveals, scales vertical line)

**Utility helpers**: `$(s, c)` = `querySelector`, `$$(s, c)` = `querySelectorAll` with array conversion. `isHttp` flag gates `history.pushState`.

## Three.js globe (inline `<script type="module">`)

- Only initializes if `#globeCanvas` element exists (in `.who` stats section)
- Earth sphere with blue-marble texture + topology bump map
- 23.5° axial tilt, additive lime atmosphere glow shader, dot grid overlay
- Radial gradient CSS veil blends globe into section background in both themes
- `pointer-events: none` on canvas so stat counters remain clickable

## Gotchas

- **`color-mix()`** in header — no legacy fallback (intentional)
- **`font-variation-settings`** on Fraunces — controls optical size, softness, wonkiness. Don't remove blindly
- **thum.io screenshots** — `https://image.thum.io/get/width/1200/crop/720/noanimate/` + target URL. Generated on-the-fly
- **WhatsApp links**: Austine `+254758336196`, Paul `+254711507497`, Bevan `+254723100467`
- **localStorage keys**: `atih-theme` (theme), `at-lang` (language)
- **All local assets live in `images/`** — team, gallery, logo, preview
- **Translations are in `js/translations.js`** — not in `index.html`. Contains SW, FR, AR dictionaries plus auto-detect logic
- **Kiswahili dictionary is comprehensive** — covers all section headers, workflow steps, testimonials, nav, footer

## Development workflow

- **No build step** — edit HTML/CSS/JS directly, refresh browser
- **No test suite** — manual browser verification
- **Local preview**: Open `index.html` in browser (or `npx serve` for HTTP)
- **Live URL**: `https://austine-tech-innovation-hub.vercel.app`
- **Git**: `main` branch
