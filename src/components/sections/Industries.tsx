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
import SectionSeam from "@/components/ui/SectionSeam";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { industries, industriesDetail, industriesIntro, nav } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   04 — Industries (brief §5). QUIET section: a static, scannable
   industry → product-family mapping grid fed by site.ts `industriesDetail`,
   plus ONE slow edge-masked ticker row as texture (the site's only marquee).
   Motion: WordReveal H2 via SectionHeading, staggered fadeSoft tiles — then
   complete stillness. Hover tier: informational tiles only (border brighten
   + 1px red top rule). No pin, no scrub, no count-ups.
   -------------------------------------------------------------------------- */

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

/** Section title sourced from nav (single source of truth — no inline copy). */
const sectionTitle =
  nav.find((item) => item.href === "#industries")?.label ?? "Industries";

/** One industry → product-families mapping tile. Informational hover tier. */
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
      {/* 1px red rule drawing along the top edge — informational hover tier. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accord-red transition-transform duration-300 ease-out group-hover:scale-x-100"
      />

      {/* Static per-card radial glow anchored to the icon (never animated). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-radial-fade opacity-60"
      />

      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-accord-red/25 bg-accord-red/[0.14]">
        <Icon className="h-[1.125rem] w-[1.125rem] text-accord-red" strokeWidth={2} aria-hidden="true" />
      </span>

      <h3 className="type-card relative mt-4 text-white">{name}</h3>

      {/* Product families — the mono "technical data" voice. */}
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

/**
 * The site's ONLY marquee (brief §7.7) — one slow, edge-masked ticker row as
 * texture. Decorative (aria-hidden: every name already appears in the grid).
 * The visible window is capped at the container width while a single copy of
 * the track is ~2× wider, so duplicates are never co-visible. The track is
 * rendered twice for a seamless −50% loop; the reduced-motion kill-switch in
 * globals.css (`.animate-marquee { animation: none }`) freezes it dead.
 */
function IndustryTicker() {
  return (
    <motion.div
      aria-hidden="true"
      variants={fadeSoft}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="relative mt-14 select-none sm:mt-16"
    >
      <div className="mx-auto max-w-container overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]">
        <div className="flex w-max animate-marquee [animation-duration:70s]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {industries.map((name) => (
                <span
                  key={name}
                  className="flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 font-mono text-xs uppercase tracking-[0.22em] text-steel-400"
                >
                  {name}
                  <span className="h-1 w-1 rounded-full bg-accord-red/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Industries() {
  return (
    <section id="industries" className="section-quiet zone-cool noise overflow-hidden">
      {/* Trade Arc boundary — full-bleed, self-centers to max-w-container. */}
      <SectionSeam number="04" />

      <Container className="relative">
        <SectionHeading number="04" title={sectionTitle} intro={industriesIntro} />

        {/* Static industry → product-family mapping grid. */}
        <motion.ul
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-5"
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

      <IndustryTicker />
    </section>
  );
}
