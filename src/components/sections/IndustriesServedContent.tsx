"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { cta } from "@/lib/site";
import { fadeSoft, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ============================================================================
   /industries-served — themed replica of accordchemicals.com/industries-served.
   18 downstream industries as an interactive hover-reveal index (desktop) with
   a sticky image panel; a scannable image-card grid on mobile. Images are
   content-verified Unsplash placeholders — swap for licensed brand photos.
   ========================================================================== */

interface Industry {
  name: string;
  id: string; // Unsplash photo id
}

const INDUSTRIES: Industry[] = [
  { name: "Paints", id: "1562259949-e8e7689d7828" },
  { name: "Coatings", id: "1620641788421-7a1c342ea42e" },
  { name: "Packaging", id: "1607166452427-7e4477079cb9" },
  { name: "Adhesive", id: "1589939705384-5185137a7f0f" },
  { name: "Resins", id: "1610375461246-83df859d849d" },
  { name: "Textile", id: "1441984904996-e0b6ba687e04" },
  { name: "Pharmaceuticals", id: "1584308666744-24d5c474f2ae" },
  { name: "BOPP Tapes", id: "1607344645866-009c320b63e0" },
  { name: "Fiber", id: "1587293852726-70cdb56c2866" },
  { name: "Leather", id: "1594223274512-ad4803739b7c" },
  { name: "Agrochemical", id: "1574943320219-553eb213f72d" },
  { name: "Electronics", id: "1518770660439-4636190af475" },
  { name: "Laminates", id: "1493809842364-78817add7ffb" },
  { name: "Lubricants", id: "1558618666-fcd25c85cd64" },
  { name: "Automobiles", id: "1567789884554-0b844b597180" },
  { name: "Perfume", id: "1541643600914-78b084683601" },
  { name: "Petroleum", id: "1516937941344-00b4e0337589" },
  { name: "Polymers", id: "1605600659908-0ef719419d41" },
];

const img = (id: string, w = 900, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=70`;

/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* faint grid + red glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint opacity-40"
        style={{
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 70% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 70% 0%, black, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[20%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.18),transparent_62%)]"
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
          <span className="text-steel-300">Industries Served</span>
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
            {INDUSTRIES.length} downstream sectors
          </motion.p>
          <motion.h1 variants={fadeSoft} className="type-hero text-white">
            Industries Served
          </motion.h1>
          <motion.p
            variants={fadeSoft}
            className="mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
          >
            Accord Chemical Corporation stands out as the largest petrochemical
            distribution company — leading in the import, export and indenting of
            diverse petrochemicals from our Mumbai headquarters, and supplying
            every downstream industry below.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function IndustriesServedContent() {
  const [active, setActive] = useState(0);

  // Preload every panel image so hover reveals are instant (no empty flash).
  useEffect(() => {
    INDUSTRIES.forEach((ind) => {
      const im = new window.Image();
      im.src = img(ind.id);
    });
  }, []);

  return (
    <>
      <Hero />

      <section className="section-quiet">
        <Container>
          {/* DESKTOP: hover-reveal index + sticky image panel */}
          <div className="hidden gap-14 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
            <ul>
              {INDUSTRIES.map((ind, i) => (
                <li
                  key={ind.name}
                  onMouseEnter={() => setActive(i)}
                  className="group border-b border-white/10 first:border-t"
                >
                  <div className="flex items-center gap-5 py-4 transition-all duration-300 group-hover:pl-3">
                    <span className="w-8 shrink-0 font-mono text-xs tracking-widest text-steel-500 transition-colors group-hover:text-accord-red">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-section flex-1 text-steel-300 transition-colors duration-300 group-hover:text-white">
                      {ind.name}
                    </span>
                    <ArrowUpRight
                      className="h-6 w-6 -translate-x-2 text-accord-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Sticky panel — crossfades to the hovered industry's image. */}
            <div className="relative">
              <div className="sticky top-28">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-white/10">
                  <AnimatePresence>
                    <motion.img
                      key={active}
                      src={img(INDUSTRIES[active].id)}
                      alt={INDUSTRIES[active].name}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-accord-red">
                      {String(active + 1).padStart(2, "0")} / {INDUSTRIES.length}
                    </span>
                    <p className="type-card mt-1 text-white">
                      {INDUSTRIES[active].name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE: image-card grid */}
          <motion.div
            variants={stagger(0.04)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden"
          >
            {INDUSTRIES.map((ind) => (
              <motion.figure
                key={ind.name}
                variants={fadeSoft}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img(ind.id, 500, 620)}
                  alt={ind.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 font-display text-sm font-semibold text-white">
                  {ind.name}
                </figcaption>
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-accord-red/60"
                />
              </motion.figure>
            ))}
          </motion.div>

          {/* CTA */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/#contact"
              className={cn(
                "group inline-flex items-center gap-3 rounded-full bg-accord-red py-2.5 pl-6 pr-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-accord-redDark",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              )}
            >
              {cta.primary.label}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <ArrowRight
                  size={15}
                  className="text-accord-red transition-transform duration-500 group-hover:-rotate-45"
                />
              </span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
