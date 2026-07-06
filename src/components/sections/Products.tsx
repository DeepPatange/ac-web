"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, FileDown } from "lucide-react";
import Container from "@/components/ui/Container";
import PinnedScene from "@/components/ui/PinnedScene";
import RollButton from "@/components/ui/RollButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { cta, productListPdf, products, productsIntro } from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Larger, bolder section intro (bigger than the shared SectionHeading intro). */
function ProductsIntro({ align = "left" }: { align?: "left" | "center" }) {
  return (
    <motion.p
      variants={fadeSoft}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay: 0.12 }}
      className={cn(
        "mt-6 max-w-3xl text-lg font-medium leading-snug text-steel-100 sm:text-xl lg:text-[1.6rem]",
        align === "center" && "mx-auto text-center"
      )}
    >
      {productsIntro}
    </motion.p>
  );
}

/* ============================================================================
   PEAK 2 — Products (brief §4.2 / §5).
   ~300vh pinned scene. Phase A (0–0.6): a field of the six unique molecule
   renders parts around the heading, y/scale driven by scroll progress × each
   tile's depth factor (depth from SCROLL, never mouse). Phase B (0.6–1): the
   field settles (−40px, dims out) and the pin releases into the static,
   scannable 8-row product-family ledger — the UX payload.
   Mobile <768px: no scatter, no pin — heading then a clean vertical list.
   Reduced motion: PinnedScene renders the same static heading + ledger.
   ========================================================================== */

/** Structural section labels (site.ts exports no heading for section 03). */
const SECTION_NUMBER = "03";
const SECTION_EYEBROW = "Products";
const SECTION_TITLE = "What we carry";

interface MoleculeSpec {
  /** One of the 6 unique renders in /public/products — never repeated. */
  src: string;
  /** Resting (parted) position — absolute placement classes. */
  pos: string;
  size: string;
  /** Depth factor — multiplies the parting vector; nearer = bigger travel. */
  depth: number;
  /** Gathered offset (px) toward the heading at progress 0. */
  from: { x: number; y: number };
  scaleFrom: number;
}

/* Exactly the six unique molecule PNGs in /public/products — each used once,
   dotted irregularly around the heading. Depth comes from scroll only. */
const MOLECULE_FIELD: MoleculeSpec[] = [
  {
    src: "/products/fumarate.png",
    pos: "left-[7%] top-[10%]",
    size: "w-36 lg:w-44",
    depth: 1.6,
    from: { x: 110, y: 95 },
    scaleFrom: 0.84,
  },
  {
    src: "/products/succinate.png",
    pos: "left-[74%] top-[7%]",
    size: "w-32 lg:w-40",
    depth: 1.2,
    from: { x: -100, y: 85 },
    scaleFrom: 0.9,
  },
  {
    src: "/products/theanine.png",
    pos: "left-[3%] top-[46%]",
    size: "w-28 lg:w-36",
    depth: 1.9,
    from: { x: 120, y: 10 },
    scaleFrom: 0.8,
  },
  {
    src: "/products/pyroglutamic-acid.png",
    pos: "left-[81%] top-[42%]",
    size: "w-36 lg:w-44",
    depth: 1.4,
    from: { x: -125, y: 0 },
    scaleFrom: 0.86,
  },
  {
    src: "/products/ethylene-carbonate.png",
    pos: "left-[13%] top-[70%]",
    size: "w-32 lg:w-40",
    depth: 1.1,
    from: { x: 95, y: -90 },
    scaleFrom: 0.9,
  },
  {
    src: "/products/propylene-carbonate.png",
    pos: "left-[64%] top-[71%]",
    size: "w-40 lg:w-48",
    depth: 1.7,
    from: { x: -105, y: -100 },
    scaleFrom: 0.84,
  },
];

/** One molecule tile — rim-lit render on a dark card, parting on scroll. */
function MoleculeTile({
  item,
  progress,
}: {
  item: MoleculeSpec;
  progress: MotionValue<number>;
}) {
  // Gathered near the heading at 0 → parted to rest by 0.55. Progress × depth.
  const x = useTransform(progress, [0, 0.55], [item.from.x * item.depth, 0]);
  const y = useTransform(progress, [0, 0.55], [item.from.y * item.depth, 0]);
  const scale = useTransform(progress, [0, 0.55], [item.scaleFrom, 1]);

  return (
    <motion.div
      className={cn("absolute", item.pos, item.size)}
      style={{ x, y, scale }}
    >
      <div
        className="relative aspect-square overflow-hidden rounded-3xl bg-[#0a0a0e] ring-1 ring-white/10"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.10), 0 30px 70px -30px rgba(0,0,0,0.9)",
        }}
      >
        {/* Rim-lit radial red so the geometry reads on the dark base (static). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(225,27,34,0.30), transparent 62%)",
          }}
        />
        <Image
          src={item.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 12rem, 10rem"
          className="object-contain p-3 [filter:brightness(1.16)_saturate(1.05)]"
        />
      </div>
    </motion.div>
  );
}

/** Per-family enquire link — pre-fills the contact form via ?product=<slug>. */
function EnquireLink({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  // Plain <a>, not next/link: this is an in-page hash anchor with a query
  // ("#contact?product=…"). next/link would intercept the click and update the
  // hash via the router WITHOUT firing a native `hashchange`, so the Contact
  // form's pre-fill listener would never run. A plain anchor lets the global
  // SmoothScroll handler set location.hash and fire hashchange correctly.
  return (
    <a
      href={`#contact?product=${slug}`}
      aria-label={`${cta.enquire} — ${name}`}
      className={cn(
        "group/enq inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-steel-300 transition-colors duration-300 hover:text-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        className
      )}
    >
      {cta.enquire}
      <ArrowUpRight
        size={15}
        aria-hidden
        className="transition-transform duration-300 group-hover/enq:-translate-y-0.5 group-hover/enq:translate-x-0.5"
      />
    </a>
  );
}

/** Ledger footer: mono data line, optional PDF link slot, primary CTA. */
function LedgerFooter({ dense = false }: { dense?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-8 gap-y-4",
        dense ? "mt-5" : "mt-8"
      )}
    >
      <span className="font-mono text-xs tracking-widest text-steel-400">
        {String(products.length).padStart(2, "0")} FAMILIES
      </span>

      {/* CLIENT-INPUT slot — renders only when site.ts provides the file. */}
      {productListPdf ? (
        <a
          href={productListPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-steel-300 underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <FileDown size={15} aria-hidden />
          Download product list (PDF)
        </a>
      ) : null}

      <RollButton
        href={cta.primary.href}
        label={cta.primary.label}
        variant="outline"
        className="ml-auto"
      />
    </div>
  );
}

/** The inner grid for one ledger row — shared by the static + scroll variants. */
function RowBody({
  product,
  i,
  dense,
}: {
  product: (typeof products)[number];
  i: number;
  dense: boolean;
}) {
  const number = (
    <span className="font-mono text-[11px] tracking-widest text-accord-red">
      {String(i + 1).padStart(2, "0")}
    </span>
  );
  const name = (extra?: string) => (
    <h3
      className={cn(
        "type-card text-white transition-transform duration-300 ease-out group-hover:translate-x-1.5",
        extra
      )}
    >
      {product.name}
    </h3>
  );

  return dense ? (
    <div className="grid grid-cols-[2.75rem_minmax(15rem,21rem)_1fr_auto] items-baseline gap-x-6 py-2.5 lg:py-3.5">
      {number}
      {name("whitespace-nowrap")}
      <p className="min-w-0 truncate text-sm leading-relaxed text-steel-400">
        {product.desc}
      </p>
      <EnquireLink
        slug={product.slug}
        name={product.name}
        className="justify-self-end"
      />
    </div>
  ) : (
    <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 py-4 sm:gap-x-4">
      {number}
      {name()}
      <EnquireLink slug={product.slug} name={product.name} className="py-1" />
      <p className="col-start-2 mt-1.5 text-sm leading-relaxed text-steel-400">
        {product.desc}
      </p>
    </div>
  );
}

/** Shared row chrome: hairline + the red top-rule that draws in on hover. */
const ROW_CLASS =
  "group relative border-t border-white/10 transition-colors duration-300 hover:bg-white/[0.02]";
const rowRule = (
  <span
    aria-hidden
    className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-accord-red transition-transform duration-500 ease-out group-hover:scale-x-100"
  />
);

/** Pinned-stage row — scroll-driven staggered rise as Phase B arrives. */
function ScrollRow({
  product,
  i,
  progress,
}: {
  product: (typeof products)[number];
  i: number;
  progress: MotionValue<number>;
}) {
  const start = 0.63 + i * 0.02;
  const opacity = useTransform(progress, [start, start + 0.09], [0, 1]);
  const y = useTransform(progress, [start, start + 0.13], [26, 0]);
  return (
    <motion.li style={{ opacity, y }} className={ROW_CLASS}>
      {rowRule}
      <RowBody product={product} i={i} dense />
    </motion.li>
  );
}

/**
 * The 8-row product-family ledger. `dense` = single-line table rows for the
 * pinned stage; default = stacked rows for mobile / reduced motion. When
 * `progress` is supplied the rows cascade in on scroll; otherwise they reveal
 * with a whileInView stagger.
 */
function ProductLedger({
  dense = false,
  progress,
}: {
  dense?: boolean;
  progress?: MotionValue<number>;
}) {
  return (
    <div>
      {progress ? (
        <ul className="border-b border-white/10">
          {products.map((product, i) => (
            <ScrollRow
              key={product.slug}
              product={product}
              i={i}
              progress={progress}
            />
          ))}
        </ul>
      ) : (
        <motion.ul
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="border-b border-white/10"
        >
          {products.map((product, i) => (
            <motion.li key={product.slug} variants={fadeSoft} className={ROW_CLASS}>
              {rowRule}
              <RowBody product={product} i={i} dense={dense} />
            </motion.li>
          ))}
        </motion.ul>
      )}

      <LedgerFooter dense={dense} />
    </div>
  );
}

/** Static layout — mobile (<768px) and the reduced-motion fallback. */
function StaticProducts() {
  return (
    <div className="relative py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <Container className="relative">
        <SectionHeading
          number={SECTION_NUMBER}
          eyebrow={SECTION_EYEBROW}
          title={SECTION_TITLE}
        />
        <ProductsIntro />
        <div className="mt-10">
          <ProductLedger />
        </div>
      </Container>
    </div>
  );
}

/** The pinned stage — render-prop child of PinnedScene (md+ only). */
function MoleculeScene({ progress }: { progress: MotionValue<number> }) {
  // Phase B: the field settles −40px and dims out while the ledger rises in.
  const fieldOpacity = useTransform(progress, [0.58, 0.78], [1, 0]);
  const fieldY = useTransform(progress, [0.58, 0.85], [0, -40]);

  // Heading sits near the viewport centre through Phase A, glides to its
  // resting slot as the ledger arrives. Transform-only (vh string values).
  const headingY = useTransform(
    progress,
    [0, 0.55, 0.85],
    ["17vh", "14vh", "0vh"]
  );

  const gridOpacity = useTransform(progress, [0.62, 0.8], [0, 1]);
  const gridY = useTransform(progress, [0.62, 0.85], [48, 0]);
  // Keep invisible rows out of the tab order (a11y §7.9).
  const gridVisibility = useTransform(gridOpacity, (o): "hidden" | "visible" =>
    o < 0.03 ? "hidden" : "visible"
  );

  return (
    <div className="relative flex-1">
      {/* Static backdrops — grid overlay (allowed in Products) + one red
          radial so the field reads. Never animated. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 42% at 50% 52%, rgba(225,27,34,0.12), transparent 70%)",
        }}
      />

      {/* Phase A — the molecule field (decorative, scroll-driven). */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: fieldOpacity, y: fieldY }}
      >
        {MOLECULE_FIELD.map((item) => (
          <MoleculeTile key={item.src} item={item} progress={progress} />
        ))}
        {/* Soft ink scrim behind the heading — the section's one blur blob,
            static, for headline contrast over the gathered field. */}
        <div className="absolute left-1/2 top-1/2 h-64 w-[42rem] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/60 blur-3xl" />
      </motion.div>

      <Container className="relative z-10 flex h-full flex-col justify-center py-10">
        <motion.div style={{ y: headingY }}>
          <SectionHeading
            number={SECTION_NUMBER}
            eyebrow={SECTION_EYEBROW}
            title={SECTION_TITLE}
            align="center"
          />
          <ProductsIntro align="center" />
        </motion.div>

        {/* Phase B payload — the static, scannable family ledger. Rows cascade
            in on scroll; the block opacity/visibility gates tab order. */}
        <motion.div
          className="mt-8"
          style={{ opacity: gridOpacity, y: gridY, visibility: gridVisibility }}
        >
          <ProductLedger dense progress={progress} />
        </motion.div>
      </Container>
    </div>
  );
}

export default function Products() {
  return (
    <section
      id="products"
      className="section-peak zone-cool relative text-white noise"
    >
      {/* Trade Arc boundary — very top, full-bleed (self-centers). */}

      {/* Mobile <768px: no scatter, no pin — heading then a clean list. */}
      <div className="md:hidden">
        <StaticProducts />
      </div>

      {/* md+: the ~300vh pinned choreography. Reduced motion renders the
          same static heading + ledger via reducedFallback. */}
      <PinnedScene
        height="300vh"
        className="hidden md:block"
        reducedFallback={<StaticProducts />}
      >
        {(progress) => <MoleculeScene progress={progress} />}
      </PinnedScene>
    </section>
  );
}
