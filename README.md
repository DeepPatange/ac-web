# Accord Chemical Corporation — Website

A redesigned, premium marketing site for **Accord Chemical Corporation** — a Mumbai-based
petrochemical trading, indenting, import/export and customs-clearing company.

Built to feel *alive*: a real-time 3D hero, momentum scrolling, scroll-linked
parallax, count-up metrics, a drawn growth chart, an animated global-network map,
and motion across every section — in the client's red / charcoal / white brand.

![hero](./_source/) <!-- screenshots live in /_source if you add them -->

## Tech stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 14** (App Router) + React 18 + TypeScript |
| Styling | **Tailwind CSS** (custom brand theme) |
| Animation | **Framer Motion** (reveals, parallax, stagger, count-ups) |
| Smooth scroll | **Lenis** |
| 3D / WebGL | **React Three Fiber** + **drei** (custom hero scene) |
| Spline | **@splinetool/react-spline** (drop-in for the client's scene) |
| Icons | **lucide-react** |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
# production
npm run build && npm run start
```

Requires Node 18.18+ (built and tested on Node 24).

## Project structure

```
src/
  app/
    layout.tsx            # fonts, metadata, ScrollProgress + SmoothScroll providers
    page.tsx              # section composition (the page order)
    globals.css           # Tailwind layers, brand utilities, Lenis baseline
    api/contact/route.ts  # POST handler for the contact form (validation only — see below)
  components/
    SmoothScroll.tsx      # Lenis momentum scroll + anchor smooth-scroll
    ui/                   # Container, SectionHeading, Reveal, Button, ScrollProgress
    three/
      LogisticsScene.tsx  # custom R3F hero: container yard + chemical molecules
      SplineEmbed.tsx     # loads a published Spline .splinecode scene
    sections/             # Navbar, Hero, Verticals, Stats, About, Products,
                          # Industries, Growth, GlobalPresence, Contact, Footer
  hooks/useCountUp.ts     # scroll-triggered number count-up
  lib/
    site.ts               # ALL copy/content/config — edit the site here
    motion.ts             # shared motion variants + easing
    utils.ts              # cn() class merge
DESIGN_SYSTEM.md          # the build contract the whole site follows
_source/                  # original client assets (PDF + .spline editor file)
public/spline/            # the client's .spline editor file (for reference/publishing)
```

### Editing content

Almost everything (company name, tagline, contact details, verticals, stats,
products, industries, the 14-year growth data, about copy) lives in
**`src/lib/site.ts`**. Change it there once and it updates everywhere.

## ⭐ The Spline hero

The hero renders the client's **actual Spline scene** —
`public/spline/hero_banner_for_transport_and_logistics_company_gmw_24_25.spline`
(an isometric port: cargo ships, oil tanker, container stacks, trucks, cranes).

Two things happen automatically (`src/components/three/SplineScene.tsx`):

1. **Baked-in UI is hidden on load.** The scene shipped with its own "Global
   Shipping" headline + "Learn More" button; we hide those objects via the
   runtime so they don't collide with our hero copy.
2. **Recolour to brand red/white.** The scene is natively blue. The
   `.spline-tint` CSS rule (`src/app/globals.css`) applies a GPU-cheap
   `hue-rotate` that turns the blues into Accord red while leaving the white
   ships and charcoal ground intact — no editor round-trip needed.

> Note: the Spline runtime logs an advisory warning that `.spline` editor files
> "are meant for the editor" — it loads and renders fine regardless.

### Optional: use a published `.splinecode` instead

For the most optimised delivery you can publish the scene and point at the
hosted runtime file:

1. Open [spline.design](https://spline.design) → **import** the `.spline` file.
2. **Export → Code / Public URL** → copy the `.../scene.splinecode` URL.
3. Paste it into `src/lib/site.ts`:

   ```ts
   splineSceneUrl: "https://prod.spline.design/XXXXXXXXXXXX/scene.splinecode",
   ```

The hero uses that URL automatically when set, falling back to the local
`.spline` file when empty. (For a *permanent* recolour, do it in the Spline
editor before exporting and drop the `.spline-tint` rule.)

> A custom React-Three-Fiber fallback scene also ships in
> `src/components/three/LogisticsScene.tsx` if you ever want a non-Spline hero.

## Contact form / backend

`src/app/api/contact/route.ts` validates submissions and returns JSON. It does
**not** send email yet — there's a clearly marked `TODO` showing where to plug in
your provider (Resend, Nodemailer/SMTP, etc.). Add credentials via environment
variables and send from that handler.

## Accessibility & motion

- Honors `prefers-reduced-motion` (smooth scroll, marquees and looping 3D/SVG
  animations degrade gracefully).
- Semantic landmarks, labelled form fields, aria-labels on icon-only controls,
  focus-visible states, and a visually-hidden data table for the growth chart.

## Deploy

Optimised for **Vercel** (zero config):

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Or any Node host: `npm run build` then `npm run start`. Also deployable to
Netlify / Cloudflare / a container — it's a standard Next.js app.

## Brand tokens

Defined in `tailwind.config.ts`:
`accord-red #E11B22`, `accord-ember #FF5A3C`, `ink #0B0B0D` (+ raised `ink-700/800/900`),
`bone #F6F6F4`, `steel-*`. Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (numerals).

---

© 2026 Accord Chemicals. Built with Next.js. Powered by Itarsia India Limited.
