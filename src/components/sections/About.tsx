"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Factory, TrendingUp, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionSeam from "@/components/ui/SectionSeam";
import StatNumber from "@/components/ui/StatNumber";
import { FOUNDING_YEAR, aboutCopy, stats } from "@/lib/site";
import { easeOut, fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Icons for the three pillars, in site.ts copy order. */
const pillarIcons = [Factory, TrendingUp, Workflow] as const;

/* ============================================================================
   Orbit geometry — the simplified single-ring Trade Arc (brief §2.3).
   One hairline ring, one red arc segment drawn ONCE on entry, one node that
   lands where the draw completes. Then stillness.
   ========================================================================== */
const RING_R = 150; // ring radius in the 400×400 viewBox
const ARC = 0.38; // fraction of the ring the red arc covers
const DRAW_SECONDS = 1.5;
const DRAW_DELAY = 0.2;

// Node position: end of the arc. Circle paths start at 3 o'clock; the group
// is rotated -90° so the draw starts at 12 o'clock and sweeps clockwise.
const END_RAD = ((-90 + ARC * 360) * Math.PI) / 180;
const NODE_X = ((200 + RING_R * Math.cos(END_RAD)) / 400) * 100; // % of box
const NODE_Y = ((200 + RING_R * Math.sin(END_RAD)) / 400) * 100; // % of box

/* Count-up cascade (brief §4.4) — suffix pops land left→right, everything
   settles inside the 2s quiet-section stillness budget. */
const COUNT_DURATION = 1.4;
const COUNT_STEP = 0.12;

/**
 * 01 — About: "One desk from indent to delivery." The page's first quiet beat
 * (brief §4.1). WordReveal H2 via SectionHeading, fadeSoft body, three
 * informational pillar tiles, a simplified single-ring Trade Arc orbit with
 * ONE parallax layer — and the Stats proof band merged in as a glass strip:
 * the ONLY count-ups on the site.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // The one parallax layer: the orbit panel drifts as the section scrolls
  // through view. Scroll-linked transform only.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbitY = useTransform(scrollYProgress, [0, 1], [48, -48]);

  // Arc draws once on entry; renders complete under reduced motion.
  const drawInitial = reduced ? { pathLength: ARC } : { pathLength: 0 };
  const drawTransition = reduced
    ? { duration: 0 }
    : { duration: DRAW_SECONDS, ease: easeOut, delay: DRAW_DELAY };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-quiet zone-warm noise overflow-hidden"
    >
      {/* Trade Arc boundary into section 01 */}
      <SectionSeam number="01" className="-mt-8 sm:-mt-10" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* LEFT — story + pillars */}
          <div>
            <SectionHeading
              number="01"
              eyebrow={aboutCopy.eyebrow}
              title={aboutCopy.heading}
              align="left"
            />

            <motion.div
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-6 flex flex-col gap-4"
            >
              {aboutCopy.body.map((paragraph) => (
                <motion.p
                  key={paragraph}
                  variants={fadeSoft}
                  className="max-w-xl text-base leading-relaxed text-steel-300"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            {/* Pillars — informational tiles (§4.4): border brightens + a 1px
                red rule draws along the top edge. No lift, no color theatre. */}
            <motion.div
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {aboutCopy.pillars.map((pillar, i) => {
                const Icon = pillarIcons[i] ?? Workflow;
                return (
                  <motion.div key={pillar.title} variants={fadeSoft}>
                    <div className="group glass-card relative h-full overflow-hidden p-5 transition-colors duration-300 hover:border-white/25">
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accord-red to-accord-ember transition-transform duration-300 group-hover:scale-x-100"
                      />
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accord-red/25 bg-accord-red/[0.14] text-accord-red">
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                      </span>
                      <h3 className="type-card mt-4 text-white">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-steel-300">
                        {pillar.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT — simplified single-ring Trade Arc orbit (one parallax layer) */}
          <motion.div
            variants={fadeSoft}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="relative"
          >
            <motion.div
              style={reduced ? undefined : { y: orbitY }}
              className="relative mx-auto aspect-square w-full max-w-[30rem]"
            >
              <div className="glass-card relative h-full w-full overflow-hidden rounded-4xl">
                {/* Faint grid — allowed only in About + Products (brief §2) */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-grid-faint opacity-60"
                  style={{
                    backgroundSize: "40px 40px",
                    maskImage:
                      "radial-gradient(ellipse at 50% 50%, black 30%, transparent 78%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse at 50% 50%, black 30%, transparent 78%)",
                  }}
                />

                {/* Static red core glow — gradient only, never animated */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 bg-radial-fade"
                />

                <svg
                  aria-hidden
                  viewBox="0 0 400 400"
                  className="absolute inset-0 h-full w-full"
                  fill="none"
                >
                  {/* The single ring */}
                  <circle
                    cx="200"
                    cy="200"
                    r={RING_R}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Red arc segment — drawn once on entry, then still.
                      Glow is a wider low-opacity twin stroke (no SVG filters). */}
                  <g transform="rotate(-90 200 200)">
                    <motion.circle
                      cx="200"
                      cy="200"
                      r={RING_R}
                      stroke="#E11B22"
                      strokeOpacity="0.22"
                      strokeWidth="5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={drawInitial}
                      whileInView={{ pathLength: ARC }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={drawTransition}
                    />
                    <motion.circle
                      cx="200"
                      cy="200"
                      r={RING_R}
                      stroke="#E11B22"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={drawInitial}
                      whileInView={{ pathLength: ARC }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={drawTransition}
                    />
                  </g>
                </svg>

                {/* The one node — lands as the draw completes */}
                <motion.span
                  aria-hidden
                  className="absolute block h-2 w-2 rounded-full bg-accord-red"
                  style={{
                    left: `${NODE_X}%`,
                    top: `${NODE_Y}%`,
                    x: "-50%",
                    y: "-50%",
                    boxShadow:
                      "0 0 12px 2px rgba(225,27,34,0.55), 0 0 3px 0 rgba(255,90,60,0.8)",
                  }}
                  initial={
                    reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }
                  }
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 320,
                          damping: 20,
                          delay: DRAW_DELAY + DRAW_SECONDS - 0.15,
                        }
                  }
                />

                {/* Mono data line — the technical-data voice (brief §2 cards) */}
                <span className="absolute bottom-5 left-6 font-mono text-xs tracking-widest text-steel-400">
                  EST. {FOUNDING_YEAR} / MUMBAI
                </span>
              </div>

              {/* Static offset accent ring for depth */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.6rem] border border-accord-red/15"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* STATS PROOF BAND — glass strip, the site's ONLY count-ups.
            Suffix pops cascade left→right (§4.4). */}
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="glass-card relative mt-16 overflow-hidden p-6 sm:p-8 lg:mt-20 lg:p-10"
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(i > 0 && "lg:border-l lg:border-white/10 lg:pl-8")}
              >
                <StatNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  label={stat.label}
                  live
                  delay={i * COUNT_STEP}
                  duration={COUNT_DURATION}
                />
                {stat.sublabel && (
                  <span className="mt-1.5 block font-mono text-xs tracking-widest text-steel-400">
                    {stat.sublabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
