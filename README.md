# BWI Contractors — Website

A bespoke, dependency-free website for **BWI Contractors**, a minority
woman-owned general contractor serving the Dallas–Fort Worth metroplex.

## Highlights

- **Zero frameworks, zero build step** — hand-written HTML, CSS and vanilla JS.
  Open `index.html` and it works. Host it anywhere (GitHub Pages, Netlify,
  Cloudflare Pages, any static host).
- **Custom architectural aesthetic** — animated blueprint skyline that draws
  itself, drifting constellation canvas that reacts to the mouse, film-grain
  overlay, fluid type scale (Fraunces + Space Grotesk + Space Mono).
- **Signature interactions** — preloader with progress meter, custom cursor,
  magnetic buttons, 3D tilt cards, scroll-driven horizontal project gallery,
  animated counters, staggered scroll reveals, services accordion.
- **Fast & accessible** — respects `prefers-reduced-motion`, semantic HTML,
  keyboard-operable accordion, ARIA states on the mobile menu, `IntersectionObserver`
  everywhere (no scroll-jank), canvas paused off-screen.
- **Local SEO built in** — `GeneralContractor` JSON-LD structured data,
  meta/OG tags, click-to-call everywhere.

## Structure

```
index.html      — single-page site (hero, about, services, process, work, contact)
css/style.css   — design system + all components
js/main.js      — interaction layer
vercel.json     — Vercel config (clean URLs, security + cache headers)
```

## Deploy to Vercel

The repo is Vercel-ready as a zero-config static site:

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Framework preset: **Other** — leave build command and output directory
   empty (there is no build step; the repo root is served as-is).
3. Deploy. `vercel.json` already sets clean URLs, security headers, and
   sensible caching.

Or from the CLI: `npx vercel --prod` in the repo root.

## Editing

- **Phone / address** — search `817` or `Ball Park` in `index.html`.
- **Colors** — edit the custom properties at the top of `css/style.css`
  (`--accent` is the safety-orange brand color).
- **Projects** — duplicate an `<article class="project">` block in the Work
  section; swap the visual class (`project__visual--a…d`) or drop a real photo in.
- **Form** — currently routes to a phone call (no backend). Point the submit
  handler in `js/main.js` at your form service (Formspree, Basin, etc.) when ready.
