"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

/* ONE canonical URL per photograph. Gallery and Verticals show these same
   seven pictures, and all three sections build the URL exactly like this — an
   identical string means the browser fetches each photo once for the whole
   page instead of once per section. Native aspect ratio (every frame
   object-covers) at the width the biggest slot needs: the centre frame below,
   which zooms out to fill the viewport. Keep this helper in sync with the
   copies in Gallery.tsx and Verticals.tsx. */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&auto=format&q=70`;

/* On-brand industrial imagery (verified-loading Unsplash photos): container
   ship, port cranes, refinery, pipework, warehouse, chemical plant, lab. The
   first image is the centre hero of the zoom; the rest fan out around it. */
const IMAGES = [
  {
    // Centre frame — zooms to fill the viewport.
    src: photo("1494412574643-ff11b0a5c1c3"),
    alt: "Aerial view of a container port terminal with gantry cranes",
  },
  {
    src: photo("1516937941344-00b4e0337589"),
    alt: "Petrochemical refinery and processing plant",
  },
  {
    src: photo("1513828583688-c52646db42da"),
    alt: "Industrial pipework at a chemical processing facility",
  },
  {
    src: photo("1494412651409-8963ce7935a7"),
    alt: "Aerial view of a stacked shipping-container yard",
  },
  {
    src: photo("1578575437130-527eed3abbec"),
    alt: "Container ship docked at a shipping terminal",
  },
  {
    src: photo("1587293852726-70cdb56c2866"),
    alt: "Distribution warehouse with palletised stock",
  },
  {
    src: photo("1504328345606-18bbc8c9d7d1"),
    alt: "Welder at work in a fabrication plant",
  },
];

/**
 * Full-bleed scroll showcase placed as the second section (after the hero).
 * A branded intro, then the ZoomParallax pins for ~300vh and the centre frame
 * grows to fill the viewport as the surrounding frames fan out. Uses the global
 * Lenis smooth scroll (SmoothScroll in layout) — no local Lenis instance.
 */
export default function NetworkShowcase() {
  return (
    <section id="network" className="relative bg-ink">
      <div className="section-quiet">
        <Container>
          <motion.div
            variants={stagger(0.12, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeSoft}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red"
            >
              The network in motion
            </motion.p>
            <motion.h2 variants={fadeSoft} className="type-section text-white">
              From the world&rsquo;s ports and refineries to your plant gate.
            </motion.h2>
            <motion.p
              variants={fadeSoft}
              className="mt-5 max-w-xl text-base/relaxed text-steel-300"
            >
              We source at origin, clear and ship through Mumbai, and deliver
              across 58 countries — 110,000+ metric tons of commodity and
              specialty petrochemicals a year.
            </motion.p>
          </motion.div>
        </Container>
      </div>

      <ZoomParallax images={IMAGES} />
    </section>
  );
}
