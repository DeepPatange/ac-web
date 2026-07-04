"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
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

  /* Keep the WebGL scene mounted (loads once) but only let it RENDER while the
     hero is on/near screen — its render loop is paused/resumed via `active`.
     When paused (scrolled away) the poster underneath shows the frozen scene. */
  const heroActive = useInView(ref, { margin: "200px 0px 200px 0px" });
  const sceneSrc = siteConfig.splineSceneUrl || LOCAL_SCENE;

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
            "radial-gradient(105% 88% at -10% -12%, rgba(11,11,13,0.94), rgba(11,11,13,0.5) 36%, transparent 56%), linear-gradient(to top, #0b0b0d, transparent 12%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 sm:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,11,13,0.9), rgba(11,11,13,0.4) 44%, transparent 66%), linear-gradient(to top, #0b0b0d, transparent 10%)",
        }}
      />

      {/* Text — small, anchored top-left. eyebrow, H1, subtext, CTAs, chip. */}
      <div className="relative z-30 px-5 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32">
        <motion.div
          style={prefersReduced ? undefined : { y: contentY }}
          className="max-w-md sm:max-w-lg"
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
            className="font-display font-semibold tracking-[-0.02em] text-white [text-shadow:0_2px_24px_rgba(11,11,13,0.6)] text-[2rem] leading-[1.05] sm:text-[2.5rem] lg:text-[2.9rem]"
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
