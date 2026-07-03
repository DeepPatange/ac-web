"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import RollButton from "@/components/ui/RollButton";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { products } from "@/lib/site";
import { cn } from "@/lib/utils";

/* Rendered molecule models (public/products). Eight families cycle through the
   six available renders. */
const MOLECULES = [
  "/products/fumarate.png",
  "/products/succinate.png",
  "/products/theanine.png",
  "/products/pyroglutamic-acid.png",
  "/products/ethylene-carbonate.png",
  "/products/propylene-carbonate.png",
];

/* Scattered placement — molecules are dotted around the heading at irregular
   positions, heights and sizes (not in neat rows). The central band is still
   kept clearish for the title, and the items closest to it get the smallest
   depth so the stronger mouse-parallax doesn't shove their labels into it. */
const LAYOUT = [
  { pos: "top-[3%] left-[6%]", size: "w-28 sm:w-32 md:w-40", depth: 1.8 },
  { pos: "top-[14%] left-[24%]", size: "w-24 sm:w-28 md:w-32", depth: 1.4 },
  { pos: "top-[1%] left-[48%]", size: "w-32 sm:w-36 md:w-44", depth: 1.1 },
  { pos: "top-[8%] left-[74%]", size: "w-24 sm:w-28 md:w-36", depth: 1.7 },
  { pos: "top-[44%] left-[5%]", size: "w-24 sm:w-28 md:w-32", depth: 1.8 },
  { pos: "top-[47%] left-[79%]", size: "w-28 sm:w-32 md:w-40", depth: 1.9 },
  { pos: "top-[75%] left-[15%]", size: "w-32 sm:w-36 md:w-44", depth: 1.5 },
  { pos: "top-[80%] left-[58%]", size: "w-24 sm:w-28 md:w-36", depth: 1.3 },
];

/* One floating molecule per product family, labelled with its name. */
const ITEMS = products.map((p, i) => ({
  name: p.name,
  image: MOLECULES[i % MOLECULES.length],
  ...LAYOUT[i % LAYOUT.length],
}));

export default function Products() {
  return (
    <section
      id="products"
      className="section relative overflow-hidden text-white noise"
    >
      {/* Faint grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      {/* Red glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-accord-red/20 blur-[64px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accord-ember/10 blur-[72px]"
      />

      <Container className="relative">
        {/* FLOATING SHOWCASE — the molecule renders drift around the heading on
            pointer-move; each is labelled with its family name directly below. */}
        <div className="relative min-h-[700px] overflow-hidden sm:min-h-[820px] lg:min-h-[900px]">
          <Floating sensitivity={-0.8} easingFactor={0.1} className="z-0">
            {ITEMS.map((item) => (
              <FloatingElement key={item.name} depth={item.depth} className={item.pos}>
                <figure className={cn("group", item.size)}>
                  {/* Molecule render on a dark tile (object-contain so the model
                      is never cropped and the renders' dark edges blend in). */}
                  <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#08080b] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 45%, rgba(225,27,34,0.2), transparent 60%)",
                      }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {/* Name, directly below the image */}
                  <figcaption className="mt-3 text-center text-sm font-medium leading-snug text-steel-100 sm:text-[15px]">
                    {item.name}
                  </figcaption>
                </figure>
              </FloatingElement>
            ))}
          </Floating>

          {/* Soft scrim behind the copy for legibility over the molecules */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-72 w-[42rem] max-w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/65 blur-3xl"
          />

          {/* Centred heading + CTA */}
          <div className="relative z-20 flex min-h-[700px] flex-col items-center justify-center text-center sm:min-h-[820px] lg:min-h-[900px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accord-red text-[12px] font-semibold text-white">
                03
              </span>
              <span className="rounded-full border border-white/15 bg-ink/40 px-4 py-1.5 text-[13px] font-medium text-steel-200 backdrop-blur-sm">
                Portfolio
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="text-[clamp(2rem,6vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white"
            >
              Our Products
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
            >
              A broad basket of commodity and specialty petrochemicals, sourced
              globally and delivered on spec.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8"
            >
              <RollButton href="#contact" label="Request a quote" />
            </motion.div>
          </div>
        </div>

        {/* Kinetic marquee accent */}
        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max motion-safe:animate-marquee motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center gap-6 pr-6"
              >
                {products.map((product) => (
                  <li
                    key={product.name}
                    className="flex items-center gap-6 whitespace-nowrap text-sm font-medium uppercase tracking-[0.18em] text-steel-400"
                  >
                    <span>{product.name}</span>
                    <span aria-hidden className="text-accord-red">
                      &bull;
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
