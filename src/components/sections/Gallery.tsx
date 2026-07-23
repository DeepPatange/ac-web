"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeSoft, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   Gallery — a bento showcase of the operation (ports, refineries, storage,
   logistics). Images are content-verified Unsplash placeholders in the brand's
   look; swap for Accord's own photography when available.
   -------------------------------------------------------------------------- */

interface Shot {
  id: string;
  alt: string;
  /** md+ grid span for the bento layout. */
  cls?: string;
}

const SHOTS: Shot[] = [
  {
    id: "1494412574643-ff11b0a5c1c3",
    alt: "Aerial view of a container port terminal",
    cls: "md:col-span-2 md:row-span-2",
  },
  { id: "1516937941344-00b4e0337589", alt: "Petrochemical refinery" },
  { id: "1513828583688-c52646db42da", alt: "Industrial pipework at a processing plant" },
  {
    id: "1578575437130-527eed3abbec",
    alt: "Container ship at a shipping terminal",
    cls: "md:col-span-2",
  },
  { id: "1494412651409-8963ce7935a7", alt: "Stacked shipping-container yard" },
  { id: "1587293852726-70cdb56c2866", alt: "Distribution warehouse" },
  { id: "1504328345606-18bbc8c9d7d1", alt: "Welder at a fabrication plant" },
];

/* Same seven photographs as NetworkShowcase (the zoom showcase) and four of
   them again in Verticals, so the URL is built identically in all three — one
   fetch per photo for the whole page instead of one per section. Deliberately
   NOT next/image: the other two sections render these through primitives that
   take a plain <img> (zoom-parallax) or a motion.img (animated-slideshow), so
   routing this one through /_next/image would mint a third URL per photo and
   undo the sharing. Keep in sync with the helper in NetworkShowcase.tsx. */
function src(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=1200&auto=format&q=70`;
}

export default function Gallery() {
  return (
    <section id="gallery" className="section-quiet zone-warm">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          title="Inside the operation"
          intro="From loading ports and refineries to bonded storage and last-mile logistics — a look across the lanes Accord moves petrochemicals through."
        />

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:gap-4 md:grid-cols-3"
        >
          {SHOTS.map((shot) => (
            <motion.figure
              key={shot.id}
              variants={fadeSoft}
              className={cn(
                "group relative overflow-hidden rounded-2xl ring-1 ring-white/10",
                shot.cls
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src(shot.id)}
                alt={shot.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Brand darken so photos sit in the dark theme; lifts on hover. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-60"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accord-red transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
