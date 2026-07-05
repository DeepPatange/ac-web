"use client";

import { motion } from "framer-motion";
import {
  Car,
  Factory,
  HardHat,
  Hexagon,
  Link,
  Paintbrush,
  Pill,
  Printer,
  Shirt,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollAdventure, {
  type ScrollPanel,
} from "@/components/ui/animated-scroll";
import { fadeSoft, stagger } from "@/lib/motion";
import { industriesDetail, industriesIntro } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   04 — Industries. Desktop: a scroll-driven SPLIT-PANEL sequence (one industry
   per panel — photo on one half, name + product families on the other, halves
   converging on scroll). Mobile / reduced-motion: the scannable
   industry → product-family grid. Data from site.ts `industriesDetail`.
   -------------------------------------------------------------------------- */

/** On-brand, content-verified Unsplash photo per industry (portrait crops for
    the tall image half). Keyed by the exact `industriesDetail` name. */
const IMAGE_BY_NAME: Record<string, string> = {
  "Paints & Coatings": "1562259949-e8e7689d7828",
  "Adhesives & Sealants": "1589939705384-5185137a7f0f",
  Pharmaceuticals: "1584308666744-24d5c474f2ae",
  Textiles: "1441984904996-e0b6ba687e04",
  Construction: "1541888946425-d81bb19240f5",
  "Personal Care": "1596462502278-27bfdc403348",
  Agrochemicals: "1574943320219-553eb213f72d",
  "Plastics & Polymers": "1516937941344-00b4e0337589",
  Automotive: "1567789884554-0b844b597180",
  "Inks & Printing": "1611532736597-de2d4265fba3",
};

/** Fallback (aerial container port) for any unmapped industry. */
const FALLBACK_IMAGE = "1494412574643-ff11b0a5c1c3";

function imageUrl(name: string): string {
  const id = IMAGE_BY_NAME[name] ?? FALLBACK_IMAGE;
  return `https://images.unsplash.com/photo-${id}?w=1100&h=1450&fit=crop&crop=entropy&auto=format&q=72`;
}

/** Lucide icons keyed by the `icon` strings in site.ts `industriesDetail`. */
const iconMap: Record<string, LucideIcon> = {
  Paintbrush,
  Link,
  Pill,
  Shirt,
  HardHat,
  Sparkles,
  Sprout,
  Hexagon,
  Car,
  Printer,
};

function iconFor(name: string): LucideIcon {
  return iconMap[name] ?? Factory;
}

/** Section title. (Nav "Industries Served" now routes to the dedicated
    /industries-served page, so this on-home section keeps its own title.) */
const sectionTitle = "Industries Served";

/* -------------------------------------------------------------------------- */
/*  Desktop split-panel sequence                                              */
/* -------------------------------------------------------------------------- */

const total = industriesDetail.length;

const PANELS: ScrollPanel[] = industriesDetail.map((industry, i) => ({
  image: imageUrl(industry.name),
  imageSide: i % 2 === 0 ? "left" : "right",
  index: `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
  heading: industry.name,
  body: (
    <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 font-mono text-xs tracking-wide text-steel-400">
      {industry.families.map((family, fi) => (
        <li key={family} className="flex items-center gap-2">
          {fi > 0 && (
            <span className="h-1 w-1 rounded-full bg-accord-red/60" aria-hidden />
          )}
          {family}
        </li>
      ))}
    </ul>
  ),
}));

/* -------------------------------------------------------------------------- */
/*  Mobile / reduced-motion grid                                              */
/* -------------------------------------------------------------------------- */

function IndustryTile({
  name,
  icon,
  families,
}: {
  name: string;
  icon: string;
  families: readonly string[];
}) {
  const Icon = iconFor(icon);
  return (
    <motion.li
      variants={fadeSoft}
      className={cn(
        "glass-card group relative flex h-full flex-col overflow-hidden p-5",
        "transition-colors duration-300 hover:border-white/25"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accord-red transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-radial-fade opacity-60"
      />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-accord-red/25 bg-accord-red/[0.14]">
        <Icon
          className="h-[1.125rem] w-[1.125rem] text-accord-red"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
      <h3 className="type-card relative mt-4 text-white">{name}</h3>
      <ul className="relative mt-auto space-y-1.5 border-t border-white/5 pt-4">
        {families.map((family) => (
          <li
            key={family}
            className="flex items-start gap-2 font-mono text-xs leading-relaxed tracking-wide text-steel-400"
          >
            <span
              aria-hidden="true"
              className="mt-[0.4375rem] h-1 w-1 shrink-0 rounded-full bg-accord-red/70"
            />
            {family}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}

function IndustryGrid() {
  return (
    <Container className="pb-20 sm:pb-28">
      <motion.ul
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {industriesDetail.map((industry) => (
          <IndustryTile
            key={industry.name}
            name={industry.name}
            icon={industry.icon}
            families={industry.families}
          />
        ))}
      </motion.ul>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */

export default function Industries() {
  return (
    <section id="industries" className="relative bg-ink">
      <Container className="section-quiet pb-8 sm:pb-10">
        <SectionHeading number="04" title={sectionTitle} intro={industriesIntro} />
      </Container>

      {/* Mobile / reduced-motion: scannable grid. */}
      <div className="md:hidden">
        <IndustryGrid />
      </div>

      {/* Desktop: split-panel scroll sequence. */}
      <div className="hidden md:block">
        <ScrollAdventure panels={PANELS} reducedFallback={<IndustryGrid />} />
      </div>
    </section>
  );
}
