"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CalendarClock, Globe2, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import RollButton from "@/components/ui/RollButton";
import { aboutCopy, siteConfig } from "@/lib/site";
import { easeOut } from "@/lib/motion";

/** Icons for the three brand pillars, in copy order. */
const pillarIcons = [CalendarClock, Globe2, Workflow] as const;

/** Years in business, derived so the stat never goes stale. */
const yearsActive = new Date().getFullYear() - siteConfig.established;

/**
 * About — light glass section. Brand story + frosted pillars on the left, a
 * self-contained animated "command panel" visual on the right (orbiting dots,
 * concentric rings, faint grid, floating glass stat card and a soft red glow),
 * with a gentle scroll-tied parallax drift.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // Parallax: the visual drifts subtly as the section scrolls through view.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const glowY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const cardY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section noise overflow-hidden"
    >
      {/* Decorative background: masked grid + soft red radial glow blob */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Soft red glow blob */}
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-accord-red/20 blur-3xl" />
        <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-accord-red/20 blur-3xl" />
        {/* Faint masked grid */}
        <div
          className="absolute inset-0 bg-grid-faint opacity-60"
          style={{
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)",
          }}
        />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — story + pillars + CTA */}
          <div>
            <SectionHeading
              number="02"
              eyebrow={aboutCopy.eyebrow}
              title={aboutCopy.heading}
              align="left"
              invert
            />

            <RevealGroup className="mt-6 flex flex-col gap-4">
              {aboutCopy.body.map((paragraph) => (
                <RevealItem key={paragraph}>
                  <p className="max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg">
                    {paragraph}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Pillars */}
            <RevealGroup
              className="mt-9 grid gap-4 sm:grid-cols-3"
              gap={0.08}
            >
              {aboutCopy.pillars.map((pillar, i) => {
                const Icon = pillarIcons[i] ?? Workflow;
                return (
                  <RevealItem key={pillar.title}>
                    <div className="group glass-card relative h-full overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accord-red/40 hover:shadow-[0_18px_44px_-20px_rgba(225,27,34,0.5)]">
                      {/* Red top accent */}
                      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accord-red to-accord-ember transition-transform duration-300 group-hover:scale-x-100" />
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accord-red/15 text-accord-red ring-1 ring-accord-red/20 transition-colors duration-300 group-hover:bg-accord-red group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                      </span>
                      <h3 className="mt-4 font-display text-base font-bold tracking-tight text-white">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-steel-300">
                        {pillar.desc}
                      </p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <Reveal delay={0.15} className="mt-9">
              <RollButton href="#contact" label="Partner with us" />
            </Reveal>
          </div>

          {/* RIGHT — decorative animated visual */}
          <Reveal delay={0.1} className="relative">
            <motion.div
              style={prefersReduced ? undefined : { y: visualY }}
              className="relative mx-auto aspect-square w-full max-w-[34rem]"
            >
              {/* Gradient panel — framed to match .glass-card */}
              <div className="glass-card relative h-full w-full overflow-hidden rounded-4xl border-white/10 bg-gradient-to-br from-ink-800 via-ink to-black backdrop-blur-xl">
                {/* Faint grid */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-grid-faint opacity-70"
                  style={{ backgroundSize: "40px 40px" }}
                />

                {/* Soft red glow (parallax) */}
                <motion.div
                  aria-hidden
                  style={prefersReduced ? undefined : { y: glowY }}
                  className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-radial-fade"
                />

                {/* Animated orbital SVG */}
                <svg
                  aria-hidden
                  viewBox="0 0 400 400"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    <radialGradient id="about-core" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF5A3C" stopOpacity="0.9" />
                      <stop offset="45%" stopColor="#E11B22" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#E11B22" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="about-ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FF5A3C" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#E11B22" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Concentric static rings */}
                  {[60, 100, 140, 180].map((r) => (
                    <circle
                      key={r}
                      cx="200"
                      cy="200"
                      r={r}
                      fill="none"
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Glowing core */}
                  <circle cx="200" cy="200" r="70" fill="url(#about-core)" />

                  {/* Rotating dashed ring + orbiting dots */}
                  <motion.g
                    style={{ originX: "200px", originY: "200px" }}
                    animate={prefersReduced ? undefined : { rotate: 360 }}
                    transition={{
                      duration: 40,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <circle
                      cx="200"
                      cy="200"
                      r="140"
                      fill="none"
                      stroke="url(#about-ring)"
                      strokeWidth="1.5"
                      strokeDasharray="3 10"
                    />
                    <circle cx="200" cy="60" r="5" fill="#FF5A3C" />
                    <circle cx="340" cy="200" r="3.5" fill="#E11B22" />
                  </motion.g>

                  {/* Counter-rotating inner ring */}
                  <motion.g
                    style={{ originX: "200px", originY: "200px" }}
                    animate={prefersReduced ? undefined : { rotate: -360 }}
                    transition={{
                      duration: 26,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <circle
                      cx="200"
                      cy="200"
                      r="100"
                      fill="none"
                      stroke="rgba(255,90,60,0.35)"
                      strokeWidth="1"
                      strokeDasharray="2 14"
                    />
                    <circle cx="100" cy="200" r="4" fill="#FFFFFF" opacity="0.55" />
                    <circle cx="300" cy="200" r="2.5" fill="#FF5A3C" />
                  </motion.g>

                  {/* Pulsing outer ping */}
                  {!prefersReduced && (
                    <motion.circle
                      cx="200"
                      cy="200"
                      r="70"
                      fill="none"
                      stroke="#E11B22"
                      strokeWidth="1"
                      initial={{ scale: 0.9, opacity: 0.5 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      transition={{
                        duration: 3.2,
                        ease: easeOut,
                        repeat: Infinity,
                      }}
                      style={{ originX: "200px", originY: "200px" }}
                    />
                  )}
                </svg>

                {/* Floating glass stat card (parallax + gentle float) */}
                <motion.div
                  style={prefersReduced ? undefined : { y: cardY }}
                  className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-auto sm:w-60"
                >
                  <motion.div
                    animate={prefersReduced ? undefined : { y: [0, -10, 0] }}
                    transition={{
                      duration: 6,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    className="glass rounded-2xl p-5"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel-400">
                      Since {siteConfig.established}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-display text-4xl font-bold leading-none text-white">
                        {yearsActive}+
                      </span>
                      <span className="font-display text-sm font-medium text-steel-300">
                        years
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-steel-300">
                      of trusted petrochemical trade across five continents.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Top-right floating tag */}
                <motion.div
                  animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
                  transition={{
                    duration: 7,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  className="glass-light absolute right-6 top-6 hidden items-center gap-2 rounded-full px-3 py-1.5 sm:inline-flex"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accord-red opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accord-red" />
                  </span>
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-steel-300">
                    Global Trade
                  </span>
                </motion.div>
              </div>

              {/* Outer offset accent ring for depth */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.6rem] border border-accord-red/15"
              />
            </motion.div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
