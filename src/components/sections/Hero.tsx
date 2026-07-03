"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { siteConfig } from "@/lib/site";
import { easeOut } from "@/lib/motion";
import RollButton from "@/components/ui/RollButton";

/* The real Spline scene is client-only (WebGL). */
const SplineScene = dynamic(() => import("@/components/three/SplineScene"), {
  ssr: false,
  loading: () => null,
});

/* Local editor file by default; a published .splinecode URL overrides it. */
const LOCAL_SCENE =
  "/spline/hero_banner_for_transport_and_logistics_company_gmw_24_25.spline";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Keep the WebGL scene mounted the whole time (so it loads once and never
     reloads), but only let it RENDER while the hero is on/near screen — the
     Spline app's loop is paused/resumed via the `active` prop below. This drops
     the off-screen GPU cost without the reload-on-return that unmounting caused. */
  const heroActive = useInView(ref, { margin: "150px 0px 150px 0px" });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.95], [1, 0]);

  const sceneSrc = siteConfig.splineSceneUrl || LOCAL_SCENE;

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* Full-bleed Spline port scene — dark and clearly visible (no white wash). */}
      <motion.div
        style={prefersReduced ? undefined : { y: sceneY, opacity: sceneOpacity }}
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
      >
        {/* Natural size — fills the hero edge-to-edge, no zoom, no translate.
            Mounted only while the hero is in view (stops the GPU loop after). */}
        <div className="relative h-full w-full">
          <SplineScene scene={sceneSrc} active={heroActive} />
        </div>
      </motion.div>

      {/* Single legibility scrim — a top fade under the navbar, a left wash behind
          the headline, and a bottom fade into the next section, all in ONE layer
          (was three stacked full-bleed gradients = needless overdraw). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(11,11,13,0.7), transparent 26%)",
            "linear-gradient(to right, rgba(11,11,13,0.85), rgba(11,11,13,0.3) 38%, transparent 56%)",
            "linear-gradient(to top, #0b0b0d, transparent 16%)",
          ].join(","),
        }}
      />

      {/* Content pinned to the far top-left, snug under the fixed navbar. */}
      <div className="relative z-30 w-full pl-5 pr-5 pt-20 sm:pl-8 sm:pt-24 lg:pl-12 lg:pt-28">
        <motion.div
          style={prefersReduced ? undefined : { y: contentY }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mb-3 text-[13px] tracking-wide text-steel-300 sm:mb-4 sm:text-[14px]"
          >
            {siteConfig.name}
          </motion.p>

          <h1 className="text-[clamp(1.9rem,7vw,3.3rem)] font-medium leading-[1.07] tracking-[-0.03em] text-white [text-shadow:0_2px_30px_rgba(11,11,13,0.65)] sm:text-[clamp(2.3rem,4.6vw,3.7rem)]">
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
              className="inline-block"
            >
              Petrochemical trade,
            </motion.span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.24 }}
              className="inline-block text-accord-red"
            >
              moved with precision.
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.42 }}
            className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-5"
          >
            <RollButton href="#products" label="Explore Products" />

            <div className="glass flex items-center gap-2 self-start rounded-[6px] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accord-red" />
              <span className="text-[13px] font-medium text-white sm:text-[14px]">
                Trusted since {siteConfig.established}
              </span>
              <span className="rounded bg-accord-red px-2 py-0.5 text-[10px] font-semibold text-white sm:text-[11px]">
                186+ clients
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Spacer fills the remaining viewport below the top-aligned copy. */}
      <div className="relative flex-1" />
    </section>
  );
}
