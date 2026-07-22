"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StatNumber from "@/components/ui/StatNumber";
import TradeArc, { type ArcPoint } from "@/components/ui/TradeArc";
import { easeOut, fadeSoft, inView } from "@/lib/motion";
import { presenceCopy, stats, yearsInBusiness } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Geography — map annotations (coordinates/city names), not marketing copy.  */
/*  All prose comes from presenceCopy in @/lib/site; the hubs below are the    */
/*  exact cities that intro names, plus lanes for global spread.               */
/* -------------------------------------------------------------------------- */

const MUMBAI = { city: "Mumbai", lat: 19.076, lng: 72.8777 } as const;

const HUBS = [
  { city: "Houston", lat: 29.7604, lng: -95.3698 },
  { city: "Rotterdam", lat: 51.9244, lng: 4.4777 },
  { city: "Dubai", lat: 25.2048, lng: 55.2708 },
  { city: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Shanghai", lat: 31.2304, lng: 121.4737 },
  { city: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { city: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { city: "Sydney", lat: -33.8688, lng: 151.2093 },
] as const;

/** Equirectangular projection into TradeArc's 0–100 box. */
function project(lat: number, lng: number): ArcPoint {
  return { x: (lng + 180) / 3.6, y: (90 - lat) / 1.8 };
}

/** Bow height for a lane — longer lanes arc higher, clamped so nothing clips. */
function bow(from: ArcPoint, to: ArcPoint): number {
  return Math.max(7, Math.min(18, Math.abs(to.x - from.x) * 0.3));
}

/* -------------------------------------------------------------------------- */
/*  LaneArc — one shipping lane. Draws ONCE when the map enters the viewport   */
/*  (motionValue + animate(), zero React re-renders per frame), then holds     */
/*  static. Under prefers-reduced-motion TradeArc renders complete.            */
/* -------------------------------------------------------------------------- */

function LaneArc({
  from,
  to,
  active,
  delay,
}: {
  from: ArcPoint;
  to: ArcPoint;
  active: boolean;
  delay: number;
}) {
  const progress = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    const controls = animate(progress, 1, {
      duration: 1.2,
      delay,
      ease: easeOut,
    });
    return () => controls.stop();
  }, [active, reduced, delay, progress]);

  return (
    <TradeArc
      progress={progress}
      from={from}
      to={to}
      curve={bow(from, to)}
      nodeAt={1}
      strokeWidth={1}
      nodeSize={5}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Main section — 06 · "58 countries. One desk." Medium intensity: arcs draw  */
/*  once on entry then hold; tiles are static mono tabular numbers (maskRise). */
/* -------------------------------------------------------------------------- */

export default function GlobalPresence() {
  const mapRef = useRef<HTMLDivElement>(null);
  const arcsActive = useInView(mapRef, { once: true, amount: 0.4 });

  // Static dotted world base — pre-generated at build time into
  // public/world-dots.svg (see scripts/generate-world-map.mjs). Generating it
  // in the browser cost ~635 ms of blocked main thread and inlined ~964 KB of
  // SVG into the HTML; serving it as a file makes it a cacheable 24 KB (gzip).
  const mumbai = project(MUMBAI.lat, MUMBAI.lng);

  // Presence tiles — static references (the count-ups live in the About band).
  const countriesStat = stats.find((s) => s.label === "Countries");
  const tiles: { value: number; suffix?: string; label: string }[] = [
    ...(countriesStat
      ? [
          {
            value: countriesStat.value,
            suffix: countriesStat.suffix,
            label: "Countries served",
          },
        ]
      : []),
    { value: HUBS.length, label: "Lanes on the map" },
    { value: yearsInBusiness(), label: "Years on the record" },
    { value: 1, label: "Desk · Mumbai" },
  ];

  return (
    <section
      id="presence"
      className="section-quiet zone-cool noise relative overflow-hidden"
    >
      {/* Trade Arc boundary — full-bleed, self-centers to max-w-container. */}

      {/* The section's single static blur blob (never animated). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-40 blur-2xl"
      />

      <Container className="relative">
        <SectionHeading
          number="06"
          eyebrow={presenceCopy.eyebrow}
          title={presenceCopy.heading}
          intro={presenceCopy.intro}
        />

        {/* ---------------------------------------------------------------- */}
        {/*  Dotted world map — lanes draw once on entry, then hold static.  */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mx-auto mt-12 w-full max-w-5xl sm:mt-16"
        >
          <div className="glass-card p-4 sm:p-6 lg:p-8">
            {/* Decorative visual — the intro prose names the same lanes. */}
            <div
              ref={mapRef}
              aria-hidden
              className="relative aspect-[2/1] w-full select-none overflow-hidden rounded-lg"
            >
              <Image
                src="/world-dots.svg"
                alt=""
                width={1056}
                height={495}
                draggable={false}
                unoptimized
                className="pointer-events-none h-full w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
              />

              {/* Shipping lanes — Mumbai fans out to each hub. */}
              {HUBS.map((hub, i) => (
                <LaneArc
                  key={hub.city}
                  from={mumbai}
                  to={project(hub.lat, hub.lng)}
                  active={arcsActive}
                  delay={i * 0.12}
                />
              ))}

              {/* Mumbai origin — static node + halo ring (no pulse loops). */}
              <span
                className="absolute block h-2 w-2 rounded-full bg-accord-red shadow-[0_0_14px_4px_rgba(225,27,34,0.5)]"
                style={{
                  left: `${mumbai.x}%`,
                  top: `${mumbai.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
              <span
                className="absolute block h-5 w-5 rounded-full border border-accord-red/35"
                style={{
                  left: `${mumbai.x}%`,
                  top: `${mumbai.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
              <motion.span
                className="absolute whitespace-nowrap rounded-md border border-white/10 bg-ink-900/85 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-white"
                style={{ left: `${mumbai.x}%`, top: `${mumbai.y}%`, x: "-50%" }}
                initial={{ opacity: 0, y: 16 }}
                animate={arcsActive ? { opacity: 1, y: 10 } : undefined}
                transition={{ duration: 0.4, ease: easeOut, delay: 0.2 }}
              >
                {MUMBAI.city}
              </motion.span>

              {/* Hub labels — settle in after their lane lands (≥sm only). */}
              {HUBS.map((hub, i) => {
                const p = project(hub.lat, hub.lng);
                return (
                  <motion.span
                    key={hub.city}
                    className="absolute hidden whitespace-nowrap rounded-md border border-white/10 bg-ink-900/85 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-steel-300 sm:block"
                    style={{ left: `${p.x}%`, top: `${p.y}%`, x: "-50%" }}
                    initial={{ opacity: 0, y: -16 }}
                    animate={arcsActive ? { opacity: 1, y: -26 } : undefined}
                    transition={{
                      duration: 0.4,
                      ease: easeOut,
                      delay: 0.55 + i * 0.12,
                    }}
                  >
                    {hub.city}
                  </motion.span>
                );
              })}
            </div>

            {/* Mono data line — legend + desk coordinates (technical voice). */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-steel-400">
              <span className="inline-flex items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-accord-red shadow-[0_0_8px_2px_rgba(225,27,34,0.5)]"
                  />
                  Mumbai desk
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full border border-accord-red/60 bg-accord-red/30"
                  />
                  Partner hub
                </span>
              </span>
              <span>
                {MUMBAI.lat.toFixed(4)}° N · {MUMBAI.lng.toFixed(4)}° E
              </span>
            </div>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/*  Presence tiles — static tabular mono numbers, maskRise reveal.  */}
        {/*  No count-ups here: those are exclusive to the About proof band. */}
        {/* ---------------------------------------------------------------- */}
        <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 lg:grid-cols-4">
          {tiles.map((tile, i) => (
            <div
              key={tile.label}
              className="group relative border-t border-white/10 pt-5 transition-colors duration-300 hover:border-white/25"
            >
              {/* Informational-tile accent: 1px red rule draws along the top. */}
              <span
                aria-hidden
                className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-accord-red transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <StatNumber
                value={tile.value}
                suffix={tile.suffix}
                label={tile.label}
                delay={i * 0.08}
                numberClassName="text-3xl sm:text-4xl"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
