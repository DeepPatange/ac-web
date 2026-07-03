"use client";

import { useReducedMotion } from "framer-motion";
import {
  Paintbrush,
  Layers,
  Pill,
  Shirt,
  Building2,
  Sparkles,
  Sprout,
  Boxes,
  Car,
  Printer,
  Factory,
  type LucideIcon,
} from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { industries } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Icon per industry, mapped by index to match the order in `industries`.
 * Falls back to Factory if the list ever grows beyond this map.
 */
const industryIcons: LucideIcon[] = [
  Paintbrush, // Paints & Coatings
  Layers, // Adhesives & Sealants
  Pill, // Pharmaceuticals
  Shirt, // Textiles
  Building2, // Construction
  Sparkles, // Personal Care
  Sprout, // Agrochemicals
  Boxes, // Plastics & Polymers
  Car, // Automotive
  Printer, // Inks & Printing
];

function iconFor(index: number): LucideIcon {
  return industryIcons[index] ?? Factory;
}

/** A single industry pill/chip. */
function Chip({
  label,
  Icon,
  ariaHidden = false,
}: {
  label: string;
  Icon: LucideIcon;
  ariaHidden?: boolean;
}) {
  return (
    <span
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "glass group/chip inline-flex shrink-0 items-center gap-2.5 rounded-full",
        "px-5 py-3",
        "text-sm font-medium text-steel-200 sm:text-base",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-accord-red hover:bg-accord-red hover:text-white hover:shadow-lg hover:shadow-accord-red/30"
      )}
    >
      <Icon
        className="h-4 w-4 shrink-0 text-accord-red transition-colors duration-300 group-hover/chip:text-white sm:h-[1.125rem] sm:w-[1.125rem]"
        strokeWidth={2}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}

/**
 * A kinetic marquee row. The track is rendered twice so the `-50%` translate
 * keyframe loops seamlessly. Pass `reverse` to scroll right-to-left.
 */
function MarqueeRow({
  items,
  startIndex,
  reverse = false,
}: {
  items: readonly string[];
  startIndex: number;
  reverse?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden py-1">
      <div
        className={cn(
          "flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {/* Rendered twice for a seamless loop (the second copy is decorative). */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-4" aria-hidden={copy === 1 ? true : undefined}>
            {items.map((label, i) => (
              <Chip
                key={`${copy}-${label}`}
                label={label}
                Icon={iconFor(startIndex + i)}
                ariaHidden={copy === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Industries() {
  const reduceMotion = useReducedMotion();

  // Split the list into two rows that scroll in opposite directions.
  const mid = Math.ceil(industries.length / 2);
  const rowOne = industries.slice(0, mid);
  const rowTwo = industries.slice(mid);

  return (
    <section id="industries" className="noise section relative overflow-hidden">
      {/* Faint masked grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      {/* Soft brand-red radial glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-radial-fade opacity-80 blur-2xl" />
        <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-accord-ember/12 blur-3xl" />
      </div>

      <Container className="relative">
        <SectionHeading
          number="04"
          eyebrow="Where We Serve"
          title="Industries Served"
          intro="Our petrochemicals power formulations across a wide spectrum of industries."
          invert
        />
      </Container>

      {reduceMotion ? (
        /* Reduced motion: static, centered, wrapped chips. */
        <Container className="relative mt-12 sm:mt-16">
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {industries.map((label, i) => {
              const Icon = iconFor(i);
              return (
                <li key={label}>
                  <Chip label={label} Icon={Icon} />
                </li>
              );
            })}
          </ul>
        </Container>
      ) : (
        <Reveal className="relative mt-12 flex flex-col gap-5 sm:mt-16">
          {/* Edge fade masks — ink to transparent on left/right. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-28"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-28"
          />

          <MarqueeRow items={rowOne} startIndex={0} />
          <MarqueeRow items={rowTwo} startIndex={mid} reverse />
        </Reveal>
      )}
    </section>
  );
}
