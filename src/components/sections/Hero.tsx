"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { hero, cta } from "@/lib/site";
import { fadeSoft, stagger } from "@/lib/motion";
import CharReveal from "@/components/ui/CharReveal";
import RollButton from "@/components/ui/RollButton";

/* The hero backdrop is a pre-rendered still of the Accord port scene (a high-res
   frame of the original Spline scene, tint baked in). We deliberately do NOT run
   the live WebGL scene here: profiling showed the continuously-rendering Spline
   runtime was ~40% of main-thread CPU and the sole cause of scroll jank. The
   still is visually identical behind the scrim and costs ~0% CPU. */
const HERO_POSTER = "/spline/hero-poster.webp";

/* CharReveal rhythm — shared so the accent span picks up exactly where the
   leading words leave off (delay + wordIndex * beat + charIndex * stagger). */
const H1_DELAY = 0.15;
const H1_STAGGER = 0.04;
const H1_BEAT = H1_STAGGER * 2.5;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  /* §4.3 seam 3 — scrubbed exit. Progress 0→1 as the hero scrolls out. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Headline block drifts up at 1.2× scroll speed (an extra −20vh over one
     viewport of exit) while the Spline wrapper scales to ~1.06 and dims —
     depth separation, transform/opacity only. */
  const contentY = useTransform(scrollYProgress, [0, 1], ["0vh", "-20vh"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  /* Split the headline around the accent word so only it renders red
     (mobile contrast mandate); the copy itself stays in site.ts. */
  const accentIdx = hero.headline.lastIndexOf(hero.headlineAccent);
  const lead =
    accentIdx >= 0 ? hero.headline.slice(0, accentIdx).trimEnd() : hero.headline;
  const accent = accentIdx >= 0 ? hero.headline.slice(accentIdx) : "";
  const leadWordCount = lead.split(/\s+/).filter(Boolean).length;
  const accentDelay = H1_DELAY + leadWordCount * H1_BEAT;

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* Full-bleed port scene (pre-rendered still) — LOCKED: scene + text
          overlay only. Scales/dims on scroll: transform + opacity only. */}
      <motion.div
        style={
          prefersReduced
            ? undefined
            : { scale: sceneScale, opacity: sceneOpacity }
        }
        className="pointer-events-none absolute inset-0 z-10 origin-center"
        aria-hidden
      >
        <Image
          src={HERO_POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="select-none object-cover object-center"
          draggable={false}
        />
      </motion.div>

      {/* Legibility scrim, desktop: top fade under the navbar, left wash behind
          the headline block, bottom fade into About — one layer. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden sm:block"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(11,11,13,0.7), transparent 26%)",
            "linear-gradient(to right, rgba(11,11,13,0.85), rgba(11,11,13,0.3) 38%, transparent 56%)",
            "linear-gradient(to top, #0b0b0d, transparent 16%)",
          ].join(","),
        }}
      />

      {/* Mobile scrim — ~0.9 ink behind the text block (headline contrast
          ≥4.5:1 against the rendered scene is a QA gate). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 sm:hidden"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(11,11,13,0.78), rgba(11,11,13,0.9) 34%, rgba(11,11,13,0.9) 72%, #0b0b0d)",
          ].join(","),
        }}
      />

      {/* Text overlay — eyebrow, H1, subtext, CTAs, trust chip. */}
      <div className="relative z-30 flex w-full flex-1 items-center px-5 pb-28 pt-24 sm:px-8 sm:pt-28 lg:px-12">
        <motion.div
          style={prefersReduced ? undefined : { y: contentY }}
          className="max-w-4xl"
        >
          <motion.p
            variants={fadeSoft}
            initial="hidden"
            animate="show"
            className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red sm:mb-5"
          >
            {hero.eyebrow}
          </motion.p>

          <h1
            aria-label={hero.headline}
            className="type-hero text-white [text-shadow:0_2px_30px_rgba(11,11,13,0.65)] max-sm:text-[2.6rem] max-sm:leading-[1.06]"
          >
            <span aria-hidden>
              <CharReveal
                as="span"
                className="inline"
                delay={H1_DELAY}
                stagger={H1_STAGGER}
              >
                {lead}
              </CharReveal>
              {accent ? (
                <>
                  {" "}
                  <CharReveal
                    as="span"
                    className="inline text-accord-red"
                    delay={accentDelay}
                    stagger={H1_STAGGER}
                  >
                    {accent}
                  </CharReveal>
                </>
              ) : null}
            </span>
          </h1>

          <motion.div
            variants={stagger(0.12, 0.85)}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={fadeSoft}
              className="mt-5 max-w-xl text-base/relaxed text-steel-300 sm:mt-6"
            >
              {hero.subtext}
            </motion.p>

            <motion.div
              variants={fadeSoft}
              className="mt-7 flex flex-col gap-4 sm:mt-9 sm:flex-row sm:items-center sm:gap-4"
            >
              <RollButton href={cta.primary.href} label={cta.primary.label} />
              <RollButton
                href={cta.secondary.href}
                label={cta.secondary.label}
                variant="outline"
              />
            </motion.div>

            <motion.div
              variants={fadeSoft}
              className="glass mt-6 inline-flex items-center gap-2.5 rounded-[6px] px-3 py-2 sm:mt-7"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-accord-red"
                aria-hidden
              />
              <span className="text-[13px] font-medium text-white sm:text-[14px]">
                {hero.trustChip}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trade Arc scroll cue — 24px red stroke drawing downward on loop,
          bottom-left. Static full stroke under reduced motion. */}
      <div
        aria-hidden
        className="absolute bottom-7 left-5 z-30 sm:left-8 lg:left-12"
      >
        <span className="relative block h-6 w-px overflow-hidden bg-white/10">
          {prefersReduced ? (
            <span className="absolute inset-0 bg-accord-red" />
          ) : (
            <motion.span
              className="absolute inset-0 bg-accord-red"
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          )}
        </span>
      </div>
    </section>
  );
}
