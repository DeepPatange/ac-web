# Accord Chemicals — Design System & Build Contract

This is the binding spec for every section component. Follow it exactly so all
independently-built sections feel like one premium, professional site.

## Brand & art direction

- **Mood:** industrial-premium, confident, kinetic. Think a global commodities
  trader crossed with a modern tech brand. Lots of motion, deep contrast,
  precise typography. "Alive" = scroll-linked reveals, parallax, count-ups,
  drawn SVG, hover micro-interactions.
- **Palette (Tailwind tokens already defined):**
  - `accord-red` `#E11B22` (primary), `accord-redDark`, `accord-redLight`, `accord-ember` `#FF5A3C`
  - `ink` `#0B0B0D` (near-black), `ink-900/800/700/600` (raised dark surfaces)
  - `bone` `#F6F6F4` (warm light background), `white`
  - `steel-400/300/200` (muted grays for dark sections)
- **Light sections** sit on `bg-bone`/`white` with `text-ink`.
  **Dark sections** sit on `bg-ink`/`ink-900` with `text-white` + `text-steel-300`.
  Alternate light/dark down the page for rhythm.
- **Red is an accent, not a flood.** Use it for eyebrows, key numbers, CTAs,
  gradients, underlines, hovers. Helpers: `.text-gradient-red`, `.text-gradient-ember`.

## Typography

- Display/headings: `font-display` (Space Grotesk), bold, tight tracking.
- Body: `font-sans` (Inter). Numbers/labels can use `font-mono`.
- Eyebrows: `text-xs font-semibold uppercase tracking-[0.22em] text-accord-red`.

## Reusable primitives (IMPORT THESE — do not re-implement)

- `@/components/ui/Container` — `<Container>` max-width 1280 + gutters. Pass `as` / `className`.
- `@/components/ui/SectionHeading` — `<SectionHeading eyebrow title intro align invert />`.
  Use `invert` on dark sections.
- `@/components/ui/Reveal` — `<Reveal>` single fade-up; `RevealGroup` + `RevealItem` for stagger.
- `@/components/ui/Button` — `<Button href variant="primary|outline|ghost">`.
- `@/hooks/useCountUp` — `const { ref, value } = useCountUp(target)`.
- `@/lib/motion` — `fadeUp, fadeIn, scaleIn, stagger, inView, easeOut`.
- `@/lib/utils` — `cn(...)` class merge.
- Icons: `lucide-react`. Animation: `framer-motion`. No other deps.

## Content (IMPORT — never hardcode copy)

All copy lives in `@/lib/site.ts`: `siteConfig, nav, verticals, stats, products,
industries, growth, aboutCopy`. Import what you need.

## Engineering rules

1. Add `"use client";` to any file using framer-motion / hooks / state.
2. Each section is a default-exported component wrapping its content in a
   `<section id="...">` with class `section` (vertical rhythm) + a background.
   Use the `id` from `nav` so anchor links work.
3. **Only create the file(s) you are assigned.** Do NOT edit shared files,
   `page.tsx`, `layout.tsx`, configs, or other sections.
4. Do NOT run `npm run dev` / `next build` / install packages. Integration &
   verification are done centrally. Just write clean, type-correct TSX.
5. TypeScript strict. No `any` unless unavoidable. Keep imports valid.
6. Responsive: mobile-first, test mentally at 375 / 768 / 1280. Generous spacing.
7. Respect `prefers-reduced-motion` for large/looping animations where practical.
8. Accessibility: semantic tags, `aria-label` on icon-only buttons, alt text,
   focus-visible states, sufficient contrast.

## Section order (for context; you build only your slice)

Navbar → Hero → Verticals → Stats → About → Products → Industries → Growth →
GlobalPresence → Contact → Footer.

## Motion vocabulary to reuse

- Section entrance: `Reveal` / `RevealGroup`+`RevealItem` (fade-up + stagger).
- Numbers: `useCountUp`.
- Hover cards: subtle lift (`hover:-translate-y-1`), border/red glow, shadow.
- Backgrounds: faint grid (`bg-grid-faint`), radial red glow (`bg-radial-fade`),
  blurred color blobs, `.noise` grain on dark sections.
- Parallax: `useScroll` + `useTransform` on decorative layers.
