# HEIMDEX Landing Page

Marketing landing page for HEIMDEX — a fast, single-page React app built with Vite and Tailwind CSS, deployed on Vercel.

## Features

- **Vite 5** for instant dev server and fast production builds
- **React 18** with React Router (client-side routing)
- **Tailwind CSS 3** for styling with Heimdex design tokens
- **JavaScript (JSX)** — no build-time type layer
- **Animated hero** — self-playing product demo (typing → zoom-out → cursor sweep) with a fluid-scaled dashboard mockup
- **Scroll reveal** — fade-up on viewport entry via IntersectionObserver
- **Fully responsive** — desktop layout layered with tablet/mobile (`max-lg`/`max-md`/`max-sm`) variants
- **Vercel-ready** — auto-detected Vite build, literal client-route rewrites and a real 404 via `vercel.json`

## Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)

### Local Development

```bash
# Install dependencies
npm install

# Start the dev server (hot reload)
npm run dev
```

Visit http://localhost:5173

The dev server reloads automatically when you edit files.

## Available Commands

```bash
npm run dev       # Start the Vite dev server (http://localhost:5173)
npm run build     # Build for production → outputs to dist/
npm run preview   # Preview the production build locally
```

## Pages and Routes

Client-side routes (React Router):

- `/` — Home (hero, partners, use-case cards, testimonials, feature accordion, CTA)
- `/product` — Product / Solution page with tab switcher (`?tab=legal | creative | research`)
- `/contact` — Contact / inquiry form (lead capture)
- `/policy` — Terms & Privacy (`?tab=terms | privacy`)
- `/blog` — Blog (links out to https://blog.heimdex.co/)

## Project Structure

```
.
├── public/
│   └── assets/                # Images, logos, fonts
│       ├── fonts/             # Product Sans (Regular/Bold) woff2
│       └── stage/             # Hero mockup thumbnails
├── src/
│   ├── components/            # Shared + section components
│   │   ├── Navbar.jsx         # Header with mobile hamburger drawer
│   │   ├── Footer.jsx
│   │   ├── CtaBanner.jsx      # Bottom call-to-action banner
│   │   ├── HeroAppMockup.jsx  # Animated 동영상 검색 dashboard demo
│   │   ├── Reveal.jsx         # Scroll-reveal (IntersectionObserver)
│   │   └── FloatingActions.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Solution.jsx       # /product
│   │   ├── Contact.jsx
│   │   └── Policy.jsx
│   ├── data/                  # solutions / terms / privacy content
│   ├── App.jsx                # Route definitions
│   ├── main.jsx               # App entry
│   └── index.css              # Tailwind layers, @font-face, keyframes
├── index.html                 # Vite HTML entry (font preloads)
├── vite.config.js
├── tailwind.config.js         # Design tokens (navy/softblue/grayscale, fonts)
├── postcss.config.js
├── vercel.json                # literal rewrites for client-only routes (/blog, /heimlog); no catch-all
└── package.json
```

## Deployment to Vercel

Vercel auto-detects the Vite framework — no Docker required:

1. Push code to GitHub
2. Connect the repo to Vercel
3. Deploy

Build settings (auto-detected, override if needed):

- **Framework Preset:** Vite
- **Build Command:** `npm run build` (`vite build`)
- **Output Directory:** `dist`

### Unknown URLs answer 404

`vercel.json` has **no catch-all rewrite**. Every page is a prerendered file (`scripts/prerender.mjs`); unknown URLs get `dist/404.html` with a real 404 status, noindex, no canonical. A catch-all would turn every junk URL into a 200 soft 404 that Google indexes. The only rewrites are literal ones, with and without a trailing slash, for client-only routes (`/blog`, `/heimlog`, `/en/…`) to `_shell.html`; `public/_redirects` mirrors them for Netlify. `npm run build` runs `scripts/check-soft-404.mjs`, which fails on a pattern rewrite/redirect, `trailingSlash`/`cleanUrls`, a missing rewrite for an `App.jsx` route, a 404 head that is indexable, a real route or a trailing-slash/upper-case spelling that hits the 404 branch, RouteMeta/SeoLinks not applying `headFor`, and more; its rules are tested with `npm test`, which `npm run build` also runs. The live status can only be seen on a deployment: curl a preview URL.

- **Old `/ko/product*`, `/ko/contact*`, `/ko/policy*` and `/product/*`, `/contact/*`, `/policy/*` links** now answer 404 at the host; the client still sends a visitor to that page, but a crawler sees no redirect. Other `/ko/...` URLs (`/ko`, `/ko/cases`, `/ko/data`) show the 404 page. Closed as accepted (owner dropped D128), so there are no `redirects`.
- **`/blog` and `/heimlog`** stay as client-only routes (`/heimlog` is a client redirect to `/product?tab=vlog`) and answer 200 with the shell. Closed as accepted (owner dropped D129).
- **Case**: the host is case-sensitive, so `/Product` and `/CONTACT` (200 under the old catch-all) now answer 404. React Router matches case-insensitively, so the client renders the product page; the head and chrome decisions (`normalizePath` in `src/seo/notFound.js`) lowercase and drop the trailing slash, so such a visitor sees the page with the lowercase canonical. Accepted, not redirected.

## Design System

Design tokens live in `tailwind.config.js`:

- **Brand color:** Heimdex navy `#234c77` (`navy-500`), with `softblue` and `grayscale` scales
- **Typography:** Pretendard (body, via CDN), Noto Sans KR (Google Fonts), Product Sans (local `@font-face`, used for display headings via `font-product`)
- **Animations:** scroll-reveal fade-up, hero typing/zoom intro, looping cursor sweep, sliding tab highlight, marquee testimonials

Global styles, `@font-face`, and keyframes are in `src/index.css`. Fonts are preloaded in `index.html`.

## Tech Stack

- Vite 5 · React 18 · React Router 6
- Tailwind CSS 3 · PostCSS · Autoprefixer
- lucide-react (icons)

## License

© 2026 HEIMDEX. All rights reserved.

## Support

Email: heimdex@heimdex.co
Website: heimdex.co
