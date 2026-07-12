"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import { siteConfig, hero, cta } from "@/lib/site";
import { fadeSoft, stagger } from "@/lib/motion";
import CharReveal from "@/components/ui/CharReveal";
import RollButton from "@/components/ui/RollButton";

/* The live Spline scene is client-only (WebGL) and loaded lazily. */
const SplineScene = dynamic(() => import("@/components/three/SplineScene"), {
  ssr: false,
  loading: () => null,
});

/* Local editor file by default; a published .splinecode URL overrides it. */
const LOCAL_SCENE =
  "/spline/hero_banner_for_transport_and_logistics_company_gmw_24_25.spline";

/* Pre-rendered still of the same tinted scene. It is the INSTANT hero backdrop
   (LCP, no blank flash) and the reduced-motion fallback; the live Spline fades
   in over it once loaded. Because the WebGL scene is heavy, it only RENDERS
   while the hero is on screen (paused via `active` when scrolled away), so the
   rest of the page stays smooth. */
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

  /* Keep the WebGL scene mounted (loads once) but only let it RENDER when the
     hero is at rest at the top of the page. The instant the user scrolls away
     from the top we freeze the render loop — the poster underneath shows the
     last frame — so the heavy full-screen WebGL + CSS tint filter never fights
     scroll compositing (the sole source of scroll jank per profiling). It
     resumes live the moment you scroll back to the top. */
  const inViewport = useInView(ref, { margin: "0px 0px 200px 0px" });
  const [atTop, setAtTop] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (p) => setAtTop(p < 0.12));
  const heroActive = inViewport && atTop;
  const sceneSrc = siteConfig.splineSceneUrl || LOCAL_SCENE;

  /* Headline block drifts up at 1.2× scroll speed (an extra −20vh over one
     viewport of exit) while the Spline wrapper scales to ~1.06 and dims —
     depth separation, transform/opacity only. */
  const contentY = useTransform(scrollYProgress, [0, 1], ["0vh", "-20vh"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  /* Big two-line headline. The accent (site.ts headlineAccent) renders red and
     sits at the end of line two; the remaining words balance across two lines.
     Line 1 = first half of the lead, line 2 = rest of the lead + red accent. */
  const accentIdx = hero.headline.lastIndexOf(hero.headlineAccent);
  const lead =
    accentIdx >= 0 ? hero.headline.slice(0, accentIdx).trimEnd() : hero.headline;
  const accent = accentIdx >= 0 ? hero.headline.slice(accentIdx) : "";
  const leadWords = lead.split(/\s+/).filter(Boolean);
  const splitAt = Math.ceil(leadWords.length / 2);
  const line1 = leadWords.slice(0, splitAt).join(" ");
  const line2Lead = leadWords.slice(splitAt).join(" ");
  const line2Delay = H1_DELAY + (line1.length + 1) * H1_STAGGER;
  const accentDelay = line2Delay + (line2Lead.length + 1) * H1_STAGGER;

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* Full-bleed port scene filling the hero background. Poster is the
          instant base; the live Spline fades in over it and pauses off-screen.
          Scales/dims on scroll (transform/opacity only). */}
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
        {/* Live 3D scene overlaid on the poster. Reduced motion → poster only. */}
        {!prefersReduced && (
          <div className="absolute inset-0">
            <SplineScene scene={sceneSrc} active={heroActive} />
          </div>
        )}
      </motion.div>

      {/* No full-bleed overlay — the scene pops. Only a small localized wash
          in the top-left corner keeps the text legible, plus a thin bottom fade
          so the hero blends into the section below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden sm:block"
        style={{
          background:
            "linear-gradient(to right, rgba(11,11,13,0.82) 0%, rgba(11,11,13,0.55) 32%, rgba(11,11,13,0.28) 52%, rgba(11,11,13,0.06) 70%, transparent 82%), linear-gradient(to top, #0b0b0d, transparent 12%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 sm:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,11,13,0.85) 0%, rgba(11,11,13,0.55) 36%, rgba(11,11,13,0.2) 58%, transparent 78%), linear-gradient(to top, #0b0b0d, transparent 10%)",
        }}
      />

      {/* Text — small, anchored top-left. eyebrow, H1, subtext, CTAs, chip. */}
      <div className="relative z-30 px-5 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32">
        <motion.div
          style={prefersReduced ? undefined : { y: contentY }}
          className="max-w-2xl sm:max-w-3xl lg:max-w-5xl"
        >
          <motion.p
            variants={fadeSoft}
            initial="hidden"
            animate="show"
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-accord-red sm:mb-4"
          >
            {hero.eyebrow}
          </motion.p>

          <h1
            aria-label={hero.headline}
            className="font-display font-semibold tracking-[-0.025em] text-white [text-shadow:0_2px_30px_rgba(11,11,13,0.85)] text-[clamp(2.25rem,6.65vw,4.15rem)] leading-[1.0]"
          >
            <span aria-hidden className="block">
              <CharReveal
                as="span"
                className="inline"
                delay={H1_DELAY}
                stagger={H1_STAGGER}
              >
                {line1}
              </CharReveal>
            </span>
            <span aria-hidden className="block">
              {line2Lead ? (
                <CharReveal
                  as="span"
                  className="inline"
                  delay={line2Delay}
                  stagger={H1_STAGGER}
                >
                  {line2Lead}
                </CharReveal>
              ) : null}
              {accent ? (
                <CharReveal
                  as="span"
                  className={line2Lead ? "ml-[0.3em] inline text-accord-red" : "inline text-accord-red"}
                  delay={accentDelay}
                  stagger={H1_STAGGER}
                >
                  {accent}
                </CharReveal>
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
              className="mt-4 max-w-sm text-sm/relaxed text-steel-300 sm:mt-5"
            >
              {hero.subtext}
            </motion.p>

            <motion.div
              variants={fadeSoft}
              className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-4"
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
              className="glass mt-5 inline-flex items-center gap-2.5 rounded-[6px] px-3 py-2 sm:mt-6"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-accord-red"
                aria-hidden
              />
              <span className="text-[13px] font-medium text-white">
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
