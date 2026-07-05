"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

/* On-brand industrial imagery (verified-loading Unsplash photos): container
   ship, port cranes, refinery, pipework, warehouse, chemical plant, lab. The
   first image is the centre hero of the zoom; the rest fan out around it. */
const IMAGES = [
  {
    // Centre frame — zooms to fill the viewport.
    src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1400&h=900&fit=crop&crop=entropy&auto=format&q=75",
    alt: "Aerial view of a container port terminal with gantry cranes",
  },
  {
    src: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=75",
    alt: "Petrochemical refinery and processing plant",
  },
  {
    src: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1000&h=1000&fit=crop&crop=entropy&auto=format&q=75",
    alt: "Industrial pipework at a chemical processing facility",
  },
  {
    src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=75",
    alt: "Aerial view of a stacked shipping-container yard",
  },
  {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000&h=1000&fit=crop&crop=entropy&auto=format&q=75",
    alt: "Container ship docked at a shipping terminal",
  },
  {
    src: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&h=800&fit=crop&crop=entropy&auto=format&q=75",
    alt: "Distribution warehouse with palletised stock",
  },
  {
    src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1000&h=1000&fit=crop&crop=entropy&auto=format&q=75",
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
