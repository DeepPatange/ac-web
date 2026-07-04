# ACCORD CHEMICAL CORPORATION — REDESIGN BRIEF (BINDING)

**Creative Director sign-off. This document supersedes conflicting guidance in DESIGN_SYSTEM.md
where the two disagree. Three teams execute in parallel: CONTENT (site.ts + layout.tsx metadata),
SYSTEM (motion primitives, typography, globals.css, shared UI), SECTIONS (one file each).
A builder reading only this brief + their section file must produce consistent work.**

Locked client decisions (never question): dark ink base + red #E11B22; full-immersive scroll
with RHYTHM (peaks separated by quiet); hero = Spline scene + text overlay ONLY; framer-motion 11 +
Lenis ONLY; must not read as an AI template.

---

## 1. VISION

Today the site is a well-dressed template: one fade-up fired nine times, decorative sections where
buyers need scannable facts, self-declared trust with zero evidence, and numbers that contradict
each other (18,600 MT in Stats vs 110,200 MT in the chart). The redesign turns it into **a dark,
cinematic trade ledger**: the page IS the story of consignments moving — who Accord is, the four
ways material moves through them, what they carry, who buys it, fourteen years of audited growth
you physically scrub through, the lanes on the map, and exactly what happens after you enquire.
Three pinned scroll scenes carry all the drama; everything between them is deliberately quiet,
factual, and scannable in under ten seconds. Every number on the page comes from one source and
agrees with every other number.

**The one-line test for every decision:** does this help a paints-company procurement manager
confirm "they carry my molecule, they've done this at scale, I know what happens when I enquire"
— while feeling like a site only Accord could have?

---

## 2. VISUAL SIGNATURE — "THE TRADE ARC"

**One recurring motif, threaded through the whole page: a thin red arc with a glowing node — the
shipping-lane curve.** It already exists embryonically in the About orbit and the GlobalPresence
map arcs. It becomes the site's signature; every other per-section gimmick is demoted or deleted.

Where the Trade Arc appears (and nowhere else — restraint is the point):

1. **Hero scroll cue** — a 24px vertical red stroke that draws downward on loop, bottom-left.
2. **SectionSeam** — a thin red arc that draws (scroll-scrubbed `pathLength`, transform/opacity
   only) across the boundary into each numbered section, terminating in a red node next to the
   section-number chip. This replaces the current hard cuts and undesigned 300–500px black gaps.
3. **About** — the existing orbit visual, kept but slowed and simplified (one ring, one node).
4. **Growth** — the revenue line IS a Trade Arc: thick scrubbed red stroke, drawn by scroll.
5. **GlobalPresence** — the map arcs, drawn ONCE on entry (or scrubbed), then held static. No
   infinite loops.
6. **Footer close** — arcs converge on the final CTA band (see §6.11).

**Red hierarchy (fixes "death by a thousand accents"):** exactly TWO large-scale red moments on
the page — the hero Spline wash and the footer red-field CTA band. The Growth line is the third,
earned, mid-page red stroke. All other red is small: eyebrows, nodes, key numbers, CTA fills.
Demote current red icon-tile glyphs to `rgba(225,27,34,0.14)` fill + `border-red/25` + red glyph.
The green WhatsApp FAB is banned from the persistent UI (see §7.6).

**Tonal zones:** alternate section base temperature so scrolling has perceptible shifts —
`ink` (default) vs `ink-900` with a warmer/cooler radial tint per section. Grid overlay
(`bg-grid-faint`) appears ONLY in About and Products. Max ONE blurred blob per section, never
animated. Quiet sections must look quiet, not just move less.

**Cards:** keep the glass recipe but add one premium detail everywhere: a faint top-edge specular
gradient (`inset 0 1px 0 rgba(255,255,255,0.10)` upgrade) + a per-card radial glow anchored to the
icon. Equalize card heights; fill trailing space with a small mono data line (e.g. `EST. 2009 /
MUMBAI`).

**The light-theme Google Map is gone.** Contact reuses the dark dotted-map visual language from
GlobalPresence with a single Mumbai pin, linking out to the exact Google Business listing
("Kanakia Western Edge II", not the generic pincode area).

---

## 3. TYPOGRAPHY SYSTEM (SYSTEM TEAM — build first, everyone consumes)

Space Grotesk is loaded and never used. That ends now.

**Three-tier display scale (add as globals.css utilities; names are binding):**

| Utility | Face / weight | Size | Used by |
|---|---|---|---|
| `.type-hero` | `font-display` 600, tracking -0.03em, leading 1.02 | `clamp(3.5rem, 8vw, 7rem)` | Hero H1, Footer CTA line ONLY |
| `.type-section` | `font-display` 500, tracking -0.02em, leading 1.08 | `clamp(2.25rem, 4.5vw, 3.75rem)` | Section H2s (all seven) |
| `.type-card` | `font-display` 500 | `clamp(1.125rem, 1.5vw, 1.375rem)` | Card/tile titles |

- **Body:** Inter 400, `text-base/relaxed`, `text-steel-300` on dark. Never `font-medium` walls.
- **Mono = the "technical data" voice, used consistently, nowhere else:** stats digits, years,
  chart axes (`150 KT` with unit inline), coordinates, section indices (01–07), the credibility
  strip, card data lines. `text-xs font-mono tracking-widest text-steel-400`.
- **Eyebrows:** unchanged (`text-xs font-semibold uppercase tracking-[0.22em] text-accord-red`).
- **No uppercase-extrabold anywhere** (kills the shouting Verticals list voice). Verticals pillar
  titles restyle to `.type-card` sentence case + tracked mono index (the red 01–04 indices are the
  best micro-detail on the page — lean into them).

**Text-reveal usage rules (binding):**
- `CharReveal` (character-level): hero headline entrance + footer CTA line. NOWHERE else.
- `WordReveal` (masked word rise): the seven section H2s. NOWHERE else.
- Body copy / intros: `fadeSoft` (0.4s, y:12) — fast and plain, so headline moments read as
  intentional contrast.

---

## 4. MOTION SYSTEM & CHOREOGRAPHY MAP

### 4.1 The intensity curve (binding rhythm)

```
Hero            ENTRANCE MOMENT   char-reveal headline, scrubbed exit
About (+Stats)  QUIET             word-reveal H2, one parallax, count-ups (only here)
Verticals       ★ PEAK 1 (PIN)    280vh scrubbed pillar sequence
Credibility     BREATH            single fadeSoft, then stillness
Products        ★ PEAK 2 (PIN)    300vh molecule choreography → releases into static grid
Industries      QUIET             static mapping grid + one slow ticker (the ONLY marquee on the site)
Growth          ★ PEAK 3 (PIN)    200vh scrub the 14-year chart
GlobalPresence  MEDIUM            arcs draw once on entry, then hold; static tabular stats
Process         QUIET             4 steps, staggered fadeSoft, mono numerals
Contact         QUIET             entrance + form focus states only
Footer          FINAL FLOURISH    red-field band, CharReveal CTA line (not pinned)
```

No other section may pin, loop, or scrub. If a builder wants extra motion: the answer is no.

### 4.2 Pinned scene pattern (all three peaks use the same plumbing)

`position: sticky` child inside a tall section, `useScroll({ target, offset: ['start start',
'end end'] })` → `scrollYProgress` → `useTransform`. Provided by `usePinnedScene` /
`<PinnedScene>` (§7). Lenis-compatible, no GSAP. Every pinned scene MUST ship a reduced-motion
fallback: unpinned, fully-revealed static layout.

**PEAK 1 — Verticals (~280vh).** Pin the two-column layout. Map progress quarters
(0–.25/.25–.5/.5–.75/.75–1) to `activeSlide` via `useMotionValueEvent`, so the four pillars
auto-advance with the existing clip-path image wipes and char-roll captions (keep these — they are
the site's best assets; re-plumb the trigger). Index ticks 01→04. On pointer-fine devices,
`mouseenter` temporarily overrides scroll. Touch gets the full sequence for free. Delete the
"Hover a pillar" copy.

**PEAK 2 — Products (~300vh).** Phase A (progress 0–0.6): pinned molecule field — 6 curated
renders (only the 6 unique ones; never repeat within view), each tile's y/scale driven by progress
× its depth factor, parting around the heading as you scroll. Depth from SCROLL, not mouse.
Molecules rim-lit / brighter radial red so geometry reads. Phase B (0.6–1): the field settles and
the pin releases into a **static, scannable 8-row product-family grid** (name + one-line desc +
per-family "Enquire" that pre-fills the contact form) — the UX payload. On mobile (<768px): NO
scatter, NO pin — heading, then a clean vertical list/2-col grid. Nothing may clip. Delete the
Products marquee (Industries owns the marquee motif exclusively).

**PEAK 3 — Growth (~200vh).** Pin the chart card. Progress drives bar heights (per-bar stagger via
progress offsets), the red revenue line's `pathLength` (this is the Trade Arc's mid-page moment —
thick stroke, NO SVG filter glow; fake the glow with a second wider low-opacity stroke), and a
large scrubbed mono year read-out (2009-10 … 2022-23). Scrolling plays 14 years forward and
backward. Keep the excellent USD/INR layoutId toggle and pointer tooltip as-is. KPI tiles render
as static tabular numbers with maskRise when the pin releases (no count-ups here — count-ups are
exclusive to the About stats band). Recolor bars into the system: deep ink columns with a
red-to-ember top edge (kill the silver gradient).

### 4.3 Section seams

Three treatments, reused (SYSTEM builds `SectionSeam`, sections consume):
1. **Arc seam** (default between numbered sections): thin red arc draws across the boundary,
   scrubbed to entry progress, node lands beside the section-number chip.
2. **Pin release**: as each pinned scene ends, its content settles −40px and dims to 80% while the
   next section slides over (zIndex + sticky layering).
3. **Hero → About**: headline drifts up at 1.2× scroll speed while the Spline scene scales to
   ~1.06 and dims — depth separation, the page's first taste of scroll-linked motion.

### 4.4 Micro-interaction tiers (binding)

- **CTA cards/buttons only:** lift + red glow (`hover:-translate-y-1`) + the TextRoll buttons
  (keep — genuinely distinctive).
- **Informational tiles:** border brightens + a 1px red rule draws along the top edge (the
  scale-x accent from About pillars — the keeper).
- **Chips:** color-fill only. No translate.
- **Count-ups:** About stats band ONLY, driven by motionValue (no setState per frame), with one
  signature detail: the red suffix (+/M) pops in with a small spring after each number lands,
  cascading left→right.

### 4.5 Reduced motion & performance (hard rules — see also §8)

- `<MotionConfig reducedMotion="user">` wraps the app in layout.tsx (SYSTEM team).
- Global CSS: `@media (prefers-reduced-motion: reduce) { .animate-marquee, .animate-pulse-ring
  { animation: none } }`; counters snap to target; map arcs render complete.
- NEVER animate anything wrapped in an SVG filter. NEVER animate `filter`/`backdrop-filter`.
  Transform + opacity only on scroll paths.
- One shared rAF (Lenis + framer's frame scheduler). No per-frame `setState` anywhere.

---

## 5. CONTENT ARCHITECTURE — FINAL SECTION ORDER

New page order (page.tsx; nav labels/order mirror this EXACTLY):

| # | id | Section (component) | Eyebrow # | Status |
|---|---|---|---|---|
| — | home | Hero | — | refine |
| 01 | about | About (Stats merged in as proof band) | 01 | merge + rewrite |
| 02 | what-we-do | Verticals → "What we do" | 02 | rebuild (pin) |
| — | — | CredibilityStrip (NEW, thin band, no number) | — | new |
| 03 | products | Products | 03 | rebuild (pin + grid) |
| 04 | industries | Industries | 04 | rebuild (mapping grid) |
| 05 | growth | Growth → "The record" | 05 | refine (pin) |
| 06 | presence | GlobalPresence → "58 countries. One desk." | 06 | refine |
| 07 | process | Process (NEW: "How a consignment moves") | 07 | new |
| 08 | contact | Contact | 08 | refine |
| — | — | Footer (incl. red CTA band) | — | rebuild |

**Standalone Stats section: CUT (merged into About). FloatingButtons stack: CUT (see §7.6).**

**Nav (site.ts):** Home · About · What we do · Products · Industries · Track record · Contact.
Navbar CTA: **"Request a quote"** ("Book a strategy call" is banned).

**CTA system (one vocabulary, everywhere):**
- Primary conversion verb: **"Request a quote"** → #contact (navbar, hero primary, products, per-family Enquire).
- Secondary: **"Explore products"** → #products (hero ghost CTA).
- Relationship verb: **"Talk to our desk"** (footer band button only).
- Form submit: **"Send enquiry"**.

**Number canon (single source of truth — CONTENT team fixes site.ts; no section may hardcode):**
- Volume: **110,000+ MT annually** (18,600 is a units error — banned).
- Revenue: **$168M / ₹1,400 Cr (FY 2022-23)** — surface it; it's the strongest number.
- Tenure: **computed `new Date().getFullYear() − 2009` = "17 years"** — one helper in site.ts,
  used everywhere. "Over 15 years" and hardcoded "17+" are both banned.
- 58+ countries, 186+ **active clients** (not "satisfied customers"). Each headline stat appears
  ONCE in its strongest context (the About proof band); other sections may reference in prose.
- Growth chart caption until new data arrives: "FY 2009-10 to 2022-23, latest audited."

### Per-section content mandates (CONTENT team — final copy in site.ts)

**Hero (Hero.tsx — LOCKED: Spline + text overlay only; everything below is inside the overlay):**
- Eyebrow (replaces redundant company-name line): `Mumbai · Est. 2009 · 58+ countries`
- H1 (keep): "Petrochemical trade, moved with precision."
- NEW subtext line: "Imports, exports and indenting of commodity and specialty petrochemicals —
  110,000+ metric tons a year between 58 countries and India."
- CTAs: primary "Request a quote" → #contact; ghost "Explore products" → #products.
- Keep the "Trusted since 2009 · 186+ clients" chip. Add the Trade Arc scroll cue.
- Mobile: strengthen the scrim behind the headline block to ~0.9 ink and/or render "moved with
  precision." white with only "precision" red on small viewports — ≥4.5:1 against the rendered
  scene is a QA gate.

**01 About:** Heading: **"One desk from indent to delivery."** Body per content audit: para 1 =
the 4,500 → 110,000 MT arc since 2009, Mumbai, 58+ countries; para 2 = what 186+ clients actually
buy: producer-direct relationships, transparent indent pricing, in-house clearing/storage/
insurance/logistics — one call covers the consignment. Pillars: "Producer-direct" / "110,000+ MT
a year" / "End-to-end" (copy per content audit). **Stats proof band lives here** (glass strip):
110,000+ MT · $168M FY23 · 58+ countries · 186+ active clients — the page's only count-ups.
Visual: simplified single-ring Trade Arc orbit, slow.

**02 What we do (Verticals):** Intro: "Four ways petrochemicals move through Accord — from
producer to plant gate." Rewritten blurbs (verbatim from content audit): Import & Distribution =
own-account imports, duty-paid stock in INR, quantity on demand; Indenting = direct
producer↔buyer contracts, producer pricing, transparent commission, no middle inventory; Exports
= Indian-origin petrochemicals to five continents, documentation/inspection/freight handled;
Comprehensive Services = customs clearing, bonded storage, survey, marine insurance, inland
logistics — one desk accountable. No UI instructions in copy, ever.

**CredibilityStrip (NEW — one line, mono voice):** "IEC-registered exporter · COA supplied with
every consignment · Est. 2009, Mumbai" + client logos/memberships WHEN client supplies them
(slots in site.ts: `credibility: { line, memberships[], logos[], testimonial? }`). Never invent
certifications. If the client provides a testimonial, it renders here as one attributed quote.

**03 Products:** Intro: "Eight product families, sourced producer-direct and delivered on spec —
with COA on every lot." Rename "Others" → **"Custom Sourcing"**, desc: "Don't see your molecule?
We source niche and campaign-quantity chemicals through our producer network — send the spec."
The 8-row grid shows every family's one-line desc + Enquire link (`#contact?product=<family>` —
form pre-fills an enquiry-type/product field). Add `Download product list (PDF)` link slot in
site.ts (renders only when the client supplies the file).

**04 Industries:** Intro: "Ten downstream industries buy through Accord — from paints and
coatings to pharma and personal care." REBUILD as a static scannable grid where each industry
maps to its product families (add `industriesDetail: { name, icon, families: string[] }[]` to
site.ts — e.g. Paints & Coatings → Acrylates, Glycol Ethers, Aromatics). A single slow ticker row
may remain as texture: edges masked, loop long enough that no duplicate is ever co-visible.

**05 Growth → "The record":** Intro: "From 4,500 tonnes and $0.9M in our first year to 110,000
tonnes and $168M — every year on the record." Chart caption: "FY 2009-10 to 2022-23, latest
audited." (Swap in FY 23-24 / 24-25 the moment the client delivers.)

**06 GlobalPresence → "58 countries. One desk."** Intro: "Producers in Houston, Rotterdam,
Shanghai and Singapore; buyers from São Paulo to Sydney — every lane cleared through Mumbai."
(Kills the third "five continents".) Presence tiles: static tabular mono numbers, maskRise, no
count-ups.

**07 Process (NEW) — "How a consignment moves":** four steps, mono numerals, quiet:
01 **Enquire** — send product, grade, volume, destination. 02 **Quote** — indent or import
pricing within one business day. 03 **Contract** — LC/DA/DP terms, COA and pre-shipment survey on
every lot. 04 **Deliver** — customs cleared, insured, tracked to your gate. (Data:
`process: { step, title, desc }[]` in site.ts.)

**08 Contact:** Intro: "Tell us the product, volume and destination — sourcing, indenting, export
or logistics. Quotes within one business day." Form gains a product/enquiry-type select (families
from site.ts) and submit "Send enquiry". Dark map card per §2. Small print slot: `GSTIN [—] · IEC
[—] · Mon–Sat 9:30–18:30 IST` (placeholders render only when client confirms values).

**Footer:** CTA band keeps the headline **"Ready to move your next consignment?"** verbatim —
staged as the page's final flourish: full-width red-field band (the palette's one inversion),
`.type-hero` CharReveal, Trade Arcs converging, button "Talk to our desk". Footer proper is quiet:
one-liner ("Mumbai-based petrochemical trading house — imports, exports and indenting across 58+
countries since 2009."), meaningful links only (product links deep-link to grid rows or collapse
to "View all products"), legal line with legal name + CIN/GST slots, clarified Itarsia line
("An Itarsia India Limited group company" IF confirmed; else "Site by Itarsia India Limited";
else remove). **Remove social icons until real URLs exist.** Back-to-top lives here, not floating.

**Global (CONTENT team, layout.tsx):** title → "Petrochemical Trading, Imports & Indenting
Company in Mumbai | Accord Chemical Corporation"; description → the 110,000+ MT version from the
content audit; add `metadataBase` + OG image (1200×630 red port scene); delete `keywords`.
siteConfig.tagline → **"Petrochemicals traded across 58 countries — from Mumbai, since 2009."**

**CLIENT INPUTS NEEDED (build with graceful fallbacks; never block, never fabricate):**
FY 2023-24 / 2024-25 growth figures (highest value ask) · principal/client logos with permission ·
one attributed testimonial · GSTIN/IEC/CIN · membership confirmations (CHEMEXCIL/FIEO) · real
social URLs · Itarsia relationship · product-list PDF · quote-SLA confirmation.

---

## 6. SHARED PRIMITIVES TO BUILD (SYSTEM TEAM — exact names; SECTIONS import, never re-implement)

**`src/hooks/usePinnedScene.ts`**
`usePinnedScene(ref: RefObject<HTMLElement>): MotionValue<number>` — wraps
`useScroll({ target: ref, offset: ['start start', 'end end'] })`, returns `scrollYProgress`.

**`src/components/ui/PinnedScene.tsx`**
`<PinnedScene height="280vh" className children={(progress: MotionValue<number>) => ReactNode}
reducedFallback={ReactNode} />` — tall relative section wrapper + `sticky top-0 h-screen` child;
render-prop receives progress; renders `reducedFallback` (static, unpinned, fully revealed) when
`prefers-reduced-motion`.

**`src/components/ui/WordReveal.tsx`**
`<WordReveal as="h2" className delay stagger={0.05}>text</WordReveal>` — splits into words inside
`overflow-hidden` line wrappers, staggered `y:'110%'→0`. For section H2s only.

**`src/components/ui/CharReveal.tsx`**
`<CharReveal as="h1" className delay stagger={0.04} />` — character rise with per-word beat
grouping. Hero H1 + footer CTA line only.

**`src/components/ui/SectionSeam.tsx`**
`<SectionSeam number="03" />` — the Trade Arc boundary: SVG arc, `pathLength` scrubbed to entry
progress via its own `useScroll`, red node landing at the section-number chip. Transform/opacity
only, no filters.

**`src/components/ui/TradeArc.tsx`**
`<TradeArc progress={MotionValue} from to curve nodeAt />` — low-level arc+node SVG primitive
used by SectionSeam, About orbit, Footer convergence, GlobalPresence.

**`src/hooks/useScrubCounter.ts`**
`useScrubCounter(target: number, opts?): { ref, value: MotionValue<string> }` — motionValue +
`animate()` rendered via `<motion.span>`; ZERO React re-renders per frame; snaps to target under
reduced motion. Replaces `useCountUp` everywhere (delete old hook usage).

**`src/components/ui/StatNumber.tsx`**
`<StatNumber value suffix prefix label live={boolean} />` — mono technical-data voice; `live`
(counting + spring suffix pop) allowed ONLY in the About stats band; elsewhere static + maskRise.

**`src/lib/motion.ts` additions:** `maskRise` (y:'110%'→0 in clipped wrapper), `clipWipe`
(clip-path inset wipe for images/panels), `blurIn` (blur(8px)→0 + opacity — ENTRANCE ONLY, never
scroll-linked), `fadeSoft` (0.4s, y:12) for body copy. Existing `fadeUp` is deprecated for
headings.

**globals.css additions:** `.type-hero` / `.type-section` / `.type-card` (§3); section padding
tiers `.section-quiet` (py-20/24) and `.section-peak` (no vertical padding — height comes from
the pin) replacing blanket `.section`; reduced-motion kill-switch for `.animate-marquee` /
`.animate-pulse-ring`; tonal-zone helpers `.zone-warm` / `.zone-cool` (ink vs ink-900 + radial
tint).

**layout.tsx (SYSTEM):** wrap app in `<MotionConfig reducedMotion="user">`; new metadata per §5.

**site.ts (CONTENT):** all rewrites in §5 + new data: `credibility`, `industriesDetail`,
`process`, `contactMeta` (gstin/iec/hours), `yearsInBusiness()` helper, product `slug` for
enquiry pre-fill. Delete dead `social` links.

---

## 7. BUILD RULES

1. **File ownership.** Section builders touch ONLY their assigned file in
   `src/components/sections/`. SYSTEM team owns `src/lib/motion.ts`, `src/app/globals.css`,
   `src/components/ui/*`, `src/hooks/*`, `src/app/layout.tsx`. CONTENT team owns `src/lib/site.ts`
   + metadata block in layout.tsx (coordinate with SYSTEM). `page.tsx` reorder is an integration
   task — one owner, at the end.
2. **Copy discipline.** No hardcoded copy in sections — everything imports from site.ts. No
   invented facts, certifications, logos, or testimonials, ever. Client-input slots render nothing
   until data exists.
3. **Hero rule (locked).** Hero = Spline scene + text overlay (eyebrow, H1, subtext, CTAs, trust
   chip, scroll cue). Nothing else may be added to the hero. No exceptions.
4. **Performance budget (hard gates):**
   - Scroll-linked animation: `transform` + `opacity` ONLY. Never animate `filter`,
     `backdrop-filter`, layout properties, or anything inside an SVG filter. Glows = pre-rendered
     second stroke / static radial gradient.
   - No per-frame `setState`. Counters/scrubbers ride motionValues into `<motion.*>`.
   - Max ONE decorative blur blob per section; blobs never animate. Kill the
     AnimatedGradientBackground scale-entrance (opacity only) and its breathing loop.
   - `willChange: transform` only while a pin is active; removed after.
   - Ambient loops consolidated into framer's frame scheduler; target ≤2 rAF loops site-wide
     (Lenis + framer).
5. **Reduced motion.** MotionConfig handles framer; every pinned scene ships `reducedFallback`;
   counters snap; arcs render complete; marquee/pulse killed via CSS. Non-negotiable.
6. **Floating UI.** The 3-FAB stack is deleted. ONE persistent affordance max: a dark-glass pill
   ("WhatsApp" glyph recolored to the brand system) that appears after the hero, hides during
   pinned scenes and near footer, and never overlaps content at 375px. Platform-green may appear
   only inside its expanded state. Back-to-top → footer.
7. **Marquee monopoly.** Industries owns the marquee. No other section may auto-scroll anything.
8. **Mobile is a first-class composition, not a scaled desktop.** Products scatter and Verticals
   hover theatre have explicit mobile layouts (§4.2). Nothing clips, overlaps, or requires hover.
   Test mentally at 375 / 768 / 1280.
9. **A11y:** semantic sections, `aria-label` on icon buttons, focus-visible on all interactive
   elements, headline contrast ≥4.5:1 over the real rendered Spline scene, keyboard path to every
   piece of content that scroll/hover reveals.

---

## 8. QA CHECKLIST (integration gate — every item must pass)

**Numbers & copy**
- [ ] 110,000+ MT everywhere; "18,600" appears nowhere. $168M surfaced in About band.
- [ ] Tenure says "17 years" (computed) everywhere; "over 15" / hardcoded "17+" nowhere.
- [ ] Each headline stat count-up appears exactly once (About band).
- [ ] CTAs: only "Request a quote" / "Explore products" / "Talk to our desk" / "Send enquiry".
      "Book a strategy call" appears nowhere.
- [ ] No UI instructions in copy ("hover…"), no dead `#` social links, no "Others" product,
      no "Pioneering Petrochemical Excellence".
- [ ] Nav labels + order exactly mirror scroll order; every anchor lands correctly under the
      fixed navbar.

**Visual**
- [ ] Space Grotesk visibly renders on H1/H2s; three-tier scale evident (hero > section > card).
- [ ] Trade Arc appears in: hero cue, ≥4 section seams, About orbit, Growth line, Presence map,
      footer band. No section introduces a competing motif.
- [ ] Exactly two large red fields (hero wash, footer band). Google Map light-theme rectangle gone.
- [ ] No green pixel outside the expanded contact pill. No 300px+ undesigned black gaps.
- [ ] Mobile hero headline contrast ≥4.5:1 against the rendered scene (screenshot check).

**Motion**
- [ ] Exactly three pinned scenes (What-we-do, Products, Growth); all scrub smoothly forward AND
      backward; all show static fallback with `prefers-reduced-motion: reduce`.
- [ ] Verticals full 4-pillar sequence completes via scroll alone on a touch device.
- [ ] Products: pin releases into the static grid; mobile shows list, zero clipped labels.
- [ ] Growth: line/bars scrub with scroll; year read-out tracks; toggle + tooltip still work
      mid-pin.
- [ ] Quiet sections (About, Credibility, Industries, Process, Contact) settle to complete
      stillness within 2s of entering.
- [ ] DevTools performance pass: no filter animation on scroll, no long tasks from counter
      re-renders, ≤2 rAF loops.

**Conversion**
- [ ] A cold visitor can confirm a specific product family in <10s from landing on Products.
- [ ] Every "Request a quote" path lands on the form with product pre-filled when launched from a
      family row.
- [ ] Form has enquiry-type/product field; submit reads "Send enquiry".
- [ ] Credibility strip renders gracefully with only the facts currently confirmed.
