"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { fadeSoft, stagger } from "@/lib/motion";

/* ============================================================================
   /gallery — the company's own photos (team, office, reception) from
   accordchemicals.com/gallery, served locally from /public/gallery, shown in
   an interactive bento grid (drag to reorder, click for a lightbox + dock).
   ========================================================================== */

const NAMES = [
  "reception",
  "staff-06",
  "staff-08",
  "staff-09",
  "staff-10",
  "staff-11",
  "staff-12",
  "staff-13",
  "staff-14",
  "staff-15",
  "staff-16",
  "staff-17",
  "staff-18",
  "staff-19",
  "staff-20",
];

const CAPTIONS: { title: string; desc: string }[] = [
  { title: "Reception", desc: "Where every consignment begins" },
  { title: "The trading floor", desc: "Deals in motion" },
  { title: "Sourcing desk", desc: "Producer-direct, every day" },
  { title: "At the desk", desc: "Documentation & clearing" },
  { title: "The team", desc: "One desk, end to end" },
  { title: "In session", desc: "Working a consignment" },
  { title: "Deal desk", desc: "Indent to delivery" },
  { title: "Operations", desc: "Logistics in real time" },
  { title: "The floor", desc: "Mumbai headquarters" },
  { title: "Client calls", desc: "Quotes within a day" },
  { title: "Focus", desc: "Precision at every step" },
  { title: "Collaboration", desc: "Sales & sourcing together" },
  { title: "The crew", desc: "People-centric by design" },
  { title: "Morning huddle", desc: "Aligned on every lane" },
  { title: "At work", desc: "Trust and transparency" },
];

/* Bento span pattern cycled across the photos for a varied grid. */
const SPANS = [
  "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
  "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
  "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
  "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
];

const MEDIA = NAMES.map((name, i) => ({
  id: i + 1,
  type: "image",
  title: CAPTIONS[i]?.title ?? "Accord",
  desc: CAPTIONS[i]?.desc ?? "",
  url: `/gallery/${name}.webp`,
  span: SPANS[i % SPANS.length],
}));

export default function GalleryContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[8%] -top-[18%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.16),transparent_62%)]"
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
            <span className="text-steel-300">Gallery</span>
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
              Life at Accord
            </motion.p>
            <motion.h1 variants={fadeSoft} className="type-hero text-white">
              Gallery
            </motion.h1>
            <motion.p
              variants={fadeSoft}
              className="mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
            >
              A look inside Accord Chemical Corporation — our people, our desk and
              our Mumbai headquarters. Drag the tiles to rearrange, or click any
              photo to open it.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Interactive bento gallery (header omitted — the page hero above serves
          as the title). */}
      <section className="section-quiet pt-4">
        <InteractiveBentoGallery mediaItems={MEDIA} />
      </section>
    </>
  );
}
