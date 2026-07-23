"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ClipboardCheck,
  FileDown,
  Handshake,
  PackageSearch,
  Route,
} from "lucide-react";
import Container from "@/components/ui/Container";
import RollButton from "@/components/ui/RollButton";
import {
  cta,
  productListPdf,
  products,
  productsIntro,
  type Product,
} from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ============================================================================
   /products — the standalone product page. Deliberately calm and scannable:
   hero → decorative molecule rail → the eight families as an asymmetric
   editorial index (the last family, Custom Sourcing, gets its own panel) →
   a factual "how we supply" strip. No pinned choreography — that stays on the
   home section (components/sections/Products.tsx).
   ========================================================================== */

/** Where every enquiry lands — the contact page reads ?product=<slug>. */
const CONTACT_PATH = "/contact-us";

/**
 * The six molecule renders in /public/products — decorative only. There are
 * six renders for eight families, so the rail is presented as illustrative and
 * never sits beside a family name (no implied one-to-one mapping).
 */
const RAIL = [
  { src: "/products/fumarate.png", lift: "lg:-translate-y-6" },
  { src: "/products/succinate.png", lift: "lg:translate-y-4" },
  { src: "/products/theanine.png", lift: "lg:-translate-y-2" },
  { src: "/products/pyroglutamic-acid.png", lift: "lg:translate-y-6" },
  { src: "/products/ethylene-carbonate.png", lift: "lg:-translate-y-4" },
  { src: "/products/propylene-carbonate.png", lift: "lg:translate-y-2" },
];

/**
 * Column spans for the seven indexed families (the eighth is the panel).
 * A 2 → 3 → 2 rhythm across the 12-column grid keeps the index editorial
 * rather than a uniform box grid.
 */
const SPANS = [
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
  "lg:col-span-6",
];

/** Supply facts — every line traceable to site.ts canon. Invent nothing. */
const SUPPLY = [
  {
    icon: ClipboardCheck,
    title: "COA on every lot",
    desc: "A certificate of analysis is supplied with every consignment we ship.",
  },
  {
    icon: Handshake,
    title: "Producer-direct",
    desc: "Direct relationships with producers worldwide — producer pricing, transparent terms, no middle inventory.",
  },
  {
    icon: PackageSearch,
    title: "Custom sourcing",
    desc: "Niche and campaign-quantity chemicals sourced through our producer network — send us the spec.",
  },
  {
    icon: Route,
    title: "One desk, end to end",
    desc: "Clearing, storage, survey, insurance and inland logistics handled in-house.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

function ProductsHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[14%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.16),transparent_62%)]"
      />
      <Container className="relative pb-6 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-steel-400"
        >
          <Link href="/" className="transition-colors hover:text-accord-red">
            Home
          </Link>
          <span className="px-2 text-steel-500">/</span>
          <span className="text-steel-300">Products</span>
        </nav>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-3xl"
        >
          <motion.p
            variants={fadeSoft}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red"
          >
            What we carry
          </motion.p>
          <motion.h1 variants={fadeSoft} className="type-hero text-white">
            Products
          </motion.h1>
          <motion.p
            variants={fadeSoft}
            className="mt-6 max-w-2xl text-lg font-medium leading-snug text-steel-200 sm:text-xl"
          >
            {productsIntro}
          </motion.p>
          <motion.p
            variants={fadeSoft}
            className="mt-7 font-mono text-[11px] uppercase tracking-[0.28em] text-steel-500"
          >
            {String(products.length).padStart(2, "0")} families · 58+ countries ·
            Since 2009
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Molecule rail — decorative, staggered heights, never labelled              */
/* -------------------------------------------------------------------------- */

function MoleculeRail() {
  return (
    <section className="relative pt-14 sm:pt-16">
      <Container>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-steel-500">
          Illustrative molecular renders
        </p>

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          aria-hidden
          className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-5"
        >
          {RAIL.map(({ src, lift }) => (
            <motion.div key={src} variants={fadeSoft} className={cn(lift)}>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-white/10">
                {/* Rim-lit radial so the geometry reads on the dark base. */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 42%, rgba(225,27,34,0.28), transparent 62%)",
                  }}
                />
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 16vw, 30vw"
                  className="object-contain p-3 [filter:brightness(1.16)_saturate(1.05)]"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  The eight families                                                         */
/* -------------------------------------------------------------------------- */

/** Per-family enquire link — the contact page pre-fills from ?product=<slug>. */
function EnquireLink({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  return (
    <Link
      href={`${CONTACT_PATH}?product=${slug}`}
      aria-label={`${cta.enquire} — ${name}`}
      className={cn(
        "group/enq inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-steel-300 transition-colors duration-300 hover:text-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        className
      )}
    >
      {cta.enquire}
      <ArrowUpRight
        size={15}
        aria-hidden
        className="transition-transform duration-300 group-hover/enq:-translate-y-0.5 group-hover/enq:translate-x-0.5"
      />
    </Link>
  );
}

/** One indexed family — hairline entry, not a card. */
function FamilyEntry({
  product,
  i,
  span,
}: {
  product: Product;
  i: number;
  span: string;
}) {
  return (
    <motion.li
      variants={fadeSoft}
      className={cn(
        "group relative flex flex-col border-t border-white/10 pb-9 pt-6 transition-colors duration-300 hover:bg-white/[0.02]",
        span
      )}
    >
      <span
        aria-hidden
        className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-accord-red transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <span className="relative font-mono text-[11px] tracking-widest text-accord-red">
        {String(i + 1).padStart(2, "0")}
      </span>
      <h3 className="type-card relative mt-3 text-white transition-transform duration-300 ease-out group-hover:translate-x-1">
        {product.name}
      </h3>
      <p className="relative mt-2 max-w-md text-sm leading-relaxed text-steel-400">
        {product.desc}
      </p>
      <EnquireLink
        slug={product.slug}
        name={product.name}
        className="relative mt-5 self-start"
      />
    </motion.li>
  );
}

/**
 * The last family (Custom Sourcing) is the catch-all, so it reads as a panel
 * rather than another index entry — different job, different weight.
 */
function CustomSourcingPanel({ product, i }: { product: Product; i: number }) {
  return (
    <motion.li
      variants={fadeSoft}
      className="glass-card relative overflow-hidden p-8 sm:p-10 lg:col-span-12"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.18),transparent_70%)]"
      />
      <span
        aria-hidden
        className="absolute inset-y-8 left-0 w-[3px] rounded-full bg-gradient-to-b from-accord-red to-accord-redDark"
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] tracking-widest text-accord-red">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {product.name}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-steel-300">
            {product.desc}
          </p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.24em] text-steel-500">
            Product · Grade · Volume · Destination
          </p>
        </div>

        <RollButton
          href={`${CONTACT_PATH}?product=${product.slug}`}
          label={cta.enquire}
          className="shrink-0"
        />
      </div>
    </motion.li>
  );
}

function FamilyIndex() {
  // site.ts keeps Custom Sourcing last — it renders as the closing panel.
  const lastIndex = products.length - 1;

  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            The basket
          </p>
          <h2 className="type-section text-balance text-white">
            Eight families, one desk.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-steel-300">
            Each family is quoted on indent or from duty-paid stock in India —
            tell us the grade, volume and destination, and the quote follows
            within one business day.
          </p>
        </div>

        <motion.ul
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.06 }}
          className="mt-14 grid grid-cols-1 gap-x-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-12"
        >
          {products.map((product, i) =>
            i === lastIndex ? (
              <CustomSourcingPanel key={product.slug} product={product} i={i} />
            ) : (
              <FamilyEntry
                key={product.slug}
                product={product}
                i={i}
                span={SPANS[i]}
              />
            )
          )}
        </motion.ul>

        {/* Ledger meta — count, the client's PDF slot, and the primary CTA. */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
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
            href={CONTACT_PATH}
            label={cta.primary.label}
            variant="outline"
            className="ml-auto"
          />
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  How we supply — factual strip, hairline dividers                           */
/* -------------------------------------------------------------------------- */

function SupplyStrip() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            How we supply
          </p>
          <h2 className="type-section text-balance text-white">
            What comes with every consignment.
          </h2>
        </div>

        <motion.dl
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid gap-x-8 gap-y-10 border-y border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SUPPLY.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={fadeSoft}
              className={cn(i > 0 && "lg:border-l lg:border-white/10 lg:pl-8")}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accord-red/25 bg-accord-red/[0.14] text-accord-red">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <dt className="mt-5 text-[15px] font-semibold text-white">
                {title}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-steel-400">
                {desc}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function ProductsContent() {
  return (
    <>
      <ProductsHero />
      <MoleculeRail />
      <FamilyIndex />
      <SupplyStrip />
    </>
  );
}
