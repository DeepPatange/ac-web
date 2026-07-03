"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { useCountUp } from "@/hooks/useCountUp";
import { stats } from "@/lib/site";
import { fadeUp, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StatEntry = (typeof stats)[number];

/* Breathing dark-red bloom behind the metrics — a deep brand-red glow that
   reads as a luminous gradient on the ink page, fading to the page colour. */
const STATS_GRADIENT = [
  "#5a0f17",
  "#3c0b11",
  "#24080b",
  "#160609",
  "#0B0B0D",
  "#0B0B0D",
  "#0B0B0D",
];
const STATS_STOPS = [0, 16, 32, 48, 64, 82, 100];

/**
 * A single animated metric. Owns its own `useCountUp` instance so the number
 * counts up the moment this specific cell scrolls into view.
 */
function StatItem({ value, suffix, label }: StatEntry) {
  const { ref, value: current } = useCountUp(value);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="flex flex-1 flex-col-reverse items-center px-6 py-8 text-center sm:py-10 lg:px-10"
    >
      {/* DOM order is dt → dd (valid HTML); flex-col-reverse keeps the number on top */}
      <dt className="mt-4 max-w-[18ch] text-xs font-semibold uppercase tracking-[0.18em] text-steel-400 sm:text-sm">
        {label}
      </dt>
      <dd className="font-display text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl">
        <span className="tabular-nums">
          {Math.round(current).toLocaleString("en-US")}
        </span>
        <span className="text-accord-red" aria-hidden="true">
          {suffix}
        </span>
      </dd>
    </motion.div>
  );
}

/** Dark headline-metrics band with scroll-triggered count-ups. */
export default function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      id="stats"
      aria-label="Accord Chemical Corporation in numbers"
      className="noise relative overflow-hidden bg-ink py-20 sm:py-24"
    >
      {/* Live breathing brand-red gradient backdrop */}
      <AnimatedGradientBackground
        Breathing
        startingGap={105}
        breathingRange={16}
        animationSpeed={0.03}
        topOffset={10}
        gradientColors={STATS_GRADIENT}
        gradientStops={STATS_STOPS}
      />

      {/* Faint grid backdrop layered over the gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-grid-faint bg-[size:56px_56px] opacity-40"
      />

      <Container className="relative z-10">
        {/* Single frosted glass strip floating on the dark band, holding the
            four metrics split by hairline dividers. */}
        <motion.dl
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className={cn(
            "glass-card overflow-hidden",
            "grid grid-cols-2 divide-x divide-y divide-white/10",
            "lg:grid-cols-4 lg:divide-y-0"
          )}
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
