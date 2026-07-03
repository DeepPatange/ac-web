"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WorldMap } from "@/components/ui/map";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Trade network — Mumbai HQ is the origin; arcs fan out to key global hubs.  */
/* -------------------------------------------------------------------------- */

const MUMBAI = { lat: 19.076, lng: 72.8777, label: "Mumbai HQ" };

const TRADE_ROUTES = [
  { start: MUMBAI, end: { lat: 29.7604, lng: -95.3698, label: "Houston" } },
  { start: MUMBAI, end: { lat: 51.9244, lng: 4.4777, label: "Rotterdam" } },
  { start: MUMBAI, end: { lat: 25.2048, lng: 55.2708, label: "Dubai" } },
  { start: MUMBAI, end: { lat: 1.3521, lng: 103.8198, label: "Singapore" } },
  { start: MUMBAI, end: { lat: 31.2304, lng: 121.4737, label: "Shanghai" } },
  { start: MUMBAI, end: { lat: -23.5505, lng: -46.6333, label: "São Paulo" } },
  { start: MUMBAI, end: { lat: -1.2921, lng: 36.8219, label: "Nairobi" } },
  { start: MUMBAI, end: { lat: -33.8688, lng: 151.2093, label: "Sydney" } },
];

const STAT_TILES = [
  { value: 58, suffix: "+", label: "Countries" },
  { value: 5, suffix: "+", label: "Continents" },
  { value: 20, suffix: "+", label: "Indian States" },
  { value: 1, suffix: "", label: "Mumbai HQ" },
] as const;

const CONTINENTS = [
  "Asia",
  "Europe",
  "North & South America",
  "Africa",
  "Middle East",
  "Oceania",
] as const;

/* -------------------------------------------------------------------------- */
/*  Stat tile — owns its own count-up so it animates when scrolled into view. */
/* -------------------------------------------------------------------------- */

function StatTile({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, value: current } = useCountUp(value);

  return (
    <RevealItem>
      <div
        ref={ref}
        className={cn(
          "glass-card group flex flex-col items-center px-4 py-6 text-center",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accord-red/50 hover:shadow-lg hover:shadow-accord-red/10",
          "sm:px-6 sm:py-7"
        )}
      >
        <div className="font-display text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
          <span className="tabular-nums">{Math.round(current)}</span>
          <span className="text-gradient-red" aria-hidden="true">
            {suffix}
          </span>
        </div>
        <div className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-steel-300 sm:text-xs">
          {label}
        </div>
      </div>
    </RevealItem>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main section                                                              */
/* -------------------------------------------------------------------------- */

export default function GlobalPresence() {
  return (
    <section
      id="presence"
      aria-label="Accord Chemical Corporation's global trading network"
      className="noise section relative overflow-hidden bg-ink text-steel-200"
    >
      {/* Faint grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:56px_56px] opacity-40"
      />
      {/* Red / ember glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-50 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accord-ember/10 blur-[64px]"
      />

      <Container className="relative">
        <SectionHeading
          invert
          number="06"
          eyebrow="Global Reach"
          title="A network that spans the globe"
          intro="From our Mumbai headquarters to partners across five continents — sourcing and supplying petrochemicals worldwide."
        />

        {/* -------------------------------------------------------------- */}
        {/*  Animated dotted world map with live trade-route arcs          */}
        {/* -------------------------------------------------------------- */}
        <Reveal className="relative mx-auto mt-12 w-full max-w-5xl sm:mt-16">
          <div className="glass-card p-4 sm:p-6 lg:p-8">
            <WorldMap
              dots={TRADE_ROUTES}
              lineColor="#E11B22"
              labelClassName="text-[11px]"
            />
          </div>
        </Reveal>

        {/* -------------------------------------------------------------- */}
        {/*  Stat tiles                                                    */}
        {/* -------------------------------------------------------------- */}
        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-4">
          {STAT_TILES.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </RevealGroup>

        {/* -------------------------------------------------------------- */}
        {/*  Continents legend / chips                                     */}
        {/* -------------------------------------------------------------- */}
        <Reveal className="mt-12 flex flex-col items-center gap-5 sm:mt-14">
          <div className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-steel-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accord-red shadow-[0_0_10px_2px_rgba(225,27,34,0.6)]" />
              Mumbai hub
            </span>
            <span className="h-3 w-px bg-white/15" />
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accord-red/40" />
              Partner node
            </span>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {CONTINENTS.map((c) => (
              <li key={c}>
                <span className="glass inline-flex items-center rounded-full px-4 py-2 text-xs font-medium text-steel-300 transition-colors duration-300 hover:border-accord-red/40 hover:text-white sm:text-sm">
                  {c}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
