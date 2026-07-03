"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCountUp } from "@/hooks/useCountUp";
import { growth } from "@/lib/site";
import { easeOut, fadeUp, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Chart geometry (fixed viewBox — scales fluidly via width: 100%).
 * ------------------------------------------------------------------ */
const VB_W = 1000;
const VB_H = 460;
const M = { top: 36, right: 28, bottom: 64, left: 60 } as const;
const PLOT_W = VB_W - M.left - M.right;
const PLOT_H = VB_H - M.top - M.bottom;
const BASELINE = M.top + PLOT_H; // y of the x-axis

type RevenueKey = "revenueUSD" | "revenueINR";

const SERIES: Record<
  RevenueKey,
  { label: string; pill: string; unit: string; kpiUnit: string; decimals: number }
> = {
  revenueUSD: {
    label: "USD",
    pill: "USD (millions)",
    unit: "USD M",
    kpiUnit: "USD M",
    decimals: 1,
  },
  revenueINR: {
    label: "INR",
    pill: "INR (crore)",
    unit: "₹ Cr",
    kpiUnit: "INR Cr",
    decimals: 0,
  },
};

/** "Nice" upper bound + step for axis ticks given a raw max. */
function niceScale(rawMax: number, ticks = 4): { max: number; step: number } {
  if (!Number.isFinite(rawMax) || rawMax <= 0) return { max: 1, step: 1 };
  const rough = rawMax / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  const step = niceNorm * mag;
  return { max: Math.ceil(rawMax / step) * step, step };
}

function fmt(n: number, decimals: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ------------------------------------------------------------------ *
 * KPI tile — owns a count-up that re-keys (remounts) on toggle so the
 * number re-animates to the new value when the series changes.
 * ------------------------------------------------------------------ */
function Kpi({
  target,
  decimals,
  prefix,
  suffix,
  label,
}: {
  target: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const { ref, value } = useCountUp(target);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="glass-card group relative overflow-hidden p-6 transition-colors duration-300 hover:border-accord-red/40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accord-red/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <dd className="font-display text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl">
        {prefix && <span className="text-steel-400">{prefix}</span>}
        <span className="tabular-nums">{fmt(value, decimals)}</span>
        {suffix && (
          <span className="ml-1 text-lg font-semibold text-accord-red sm:text-xl">
            {suffix}
          </span>
        )}
      </dd>
      <dt className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-steel-300">
        {label}
      </dt>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

export default function Growth() {
  const uid = useId().replace(/:/g, "");
  const [series, setSeries] = useState<RevenueKey>("revenueUSD");
  const [active, setActive] = useState<number | null>(null);

  const chartRef = useRef<HTMLDivElement | null>(null);
  // Trigger draw animations once the chart enters view.
  const chartInView = useInView(chartRef, { once: true, amount: 0.3 });

  const data = useMemo(() => growth.map((d) => d), []);
  const n = data.length;
  const cfg = SERIES[series];

  /* ----- scales (guard against empty / degenerate data) ----- */
  const volMax = useMemo(
    () => Math.max(1, ...data.map((d) => d.volumeKT)),
    [data]
  );
  const volScale = useMemo(() => niceScale(volMax, 4), [volMax]);

  const revMax = useMemo(
    () => Math.max(1, ...data.map((d) => d[series])),
    [data, series]
  );
  const revScale = useMemo(() => niceScale(revMax, 4), [revMax]);

  /* ----- column / bar layout ----- */
  const colW = n > 0 ? PLOT_W / n : PLOT_W;
  const barW = Math.min(46, colW * 0.5);
  const colCenter = (i: number) => M.left + colW * (i + 0.5);
  const volY = (v: number) => BASELINE - (v / volScale.max) * PLOT_H;
  const revY = (v: number) => BASELINE - (v / revScale.max) * PLOT_H;

  /* ----- revenue polyline points (keyed so the path re-draws on toggle) ----- */
  const points = useMemo(
    () =>
      data.map((d, i) => ({
        x: colCenter(i),
        y: revY(d[series]),
        d,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, series, revScale.max]
  );
  const linePath = useMemo(
    () =>
      points
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" "),
    [points]
  );

  /* ----- axis ticks ----- */
  const volTicks = useMemo(() => {
    const out: number[] = [];
    for (let v = 0; v <= volScale.max + 1e-6; v += volScale.step) out.push(v);
    return out;
  }, [volScale]);

  /* ----- KPI figures (recomputed per selected series) ----- */
  const latest = n > 0 ? data[n - 1] : undefined;
  const first = n > 0 ? data[0] : undefined;
  const multiple =
    first && latest && first[series] > 0
      ? latest[series] / first[series]
      : 0;

  /* ----- pointer → nearest column (works for mouse + touch drag) ----- */
  const handlePointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = chartRef.current;
    if (!el || n === 0) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const localX = ((e.clientX - rect.left) / rect.width) * VB_W;
    const idx = Math.floor((localX - M.left) / colW);
    setActive(idx >= 0 && idx < n ? idx : null);
  };

  // Show every label on desktop; thin to every other on small screens.
  const labelStep = n > 8 ? 2 : 1;

  const ariaSummary = latest
    ? `Growth chart, 2009-10 to ${latest.year}. Volume grew from ${first?.volumeKT} thousand metric tons to ${latest.volumeKT} thousand metric tons. ${cfg.label} revenue grew roughly ${Math.round(multiple)} times over the period.`
    : "Growth chart.";

  /* ----- tooltip position (clamped, % of container) ----- */
  const activePoint = active !== null ? points[active] : null;
  const tipLeftPct =
    activePoint !== null ? (activePoint.x / VB_W) * 100 : 50;
  const tipClampedPct = Math.min(86, Math.max(14, tipLeftPct));

  return (
    <section
      id="growth"
      aria-label="Accord Chemical Corporation growth story"
      className="noise section relative overflow-hidden bg-ink text-steel-200"
    >
      {/* faint grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:56px_56px] opacity-40"
      />
      {/* red glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-accord-red/20 blur-[72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-accord-ember/12 blur-[72px]"
      />

      <Container className="relative">
        <SectionHeading
          invert
          number="05"
          eyebrow="Track Record"
          title="Growth Story"
          intro="Quantum of volume and revenue, 2009-10 to 2022-23 — over 15 years of compounding trust."
        />

        {/* ---------- toggle + legend ---------- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row"
        >
          {/* legend */}
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-steel-300 sm:text-sm">
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-sm bg-gradient-to-b from-steel-300 to-steel-500/60"
              />
              Quantum of Volume (KT)
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-[3px] w-6 rounded-full bg-gradient-to-r from-accord-ember to-accord-red"
              />
              Revenue
            </li>
          </ul>

          {/* USD / INR pill toggle */}
          <div
            role="group"
            aria-label="Choose revenue currency"
            className="glass inline-flex rounded-full p-1"
          >
            {(Object.keys(SERIES) as RevenueKey[]).map((key) => {
              const selected = series === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSeries(key)}
                  aria-pressed={selected}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-300 sm:text-sm",
                    selected ? "text-white" : "text-steel-300 hover:text-white"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId={`growth-pill-${uid}`}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-accord-red shadow-[0_0_20px_rgba(225,27,34,0.5)]"
                    />
                  )}
                  <span className="relative">{SERIES[key].pill}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ---------- chart ---------- */}
        <div
          ref={chartRef}
          role="img"
          aria-label={ariaSummary}
          onPointerMove={handlePointer}
          onPointerLeave={() => setActive(null)}
          className="glass-card relative mt-8 w-full touch-pan-y rounded-3xl p-2 sm:p-4"
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* light steel bar gradient (readable on dark) */}
              <linearGradient id={`bar-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#94A3B8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#64748B" stopOpacity="0.35" />
              </linearGradient>
              {/* ember → red line gradient */}
              <linearGradient id={`line-${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF5A3C" />
                <stop offset="55%" stopColor="#E11B22" />
                <stop offset="100%" stopColor="#FF3B41" />
              </linearGradient>
              {/* soft red glow for the line */}
              <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* horizontal gridlines + y ticks (volume axis) */}
            {volTicks.map((t) => {
              const y = volY(t);
              return (
                <g key={`grid-${t}`}>
                  <line
                    x1={M.left}
                    x2={M.left + PLOT_W}
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth={1}
                  />
                  <text
                    x={M.left - 12}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="central"
                    className="fill-steel-400 font-mono"
                    fontSize={13}
                  >
                    {t}
                  </text>
                </g>
              );
            })}
            {/* y axis caption */}
            <text
              x={M.left - 12}
              y={M.top - 16}
              textAnchor="end"
              className="fill-steel-400 font-mono"
              fontSize={11}
            >
              KT
            </text>

            {/* baseline */}
            <line
              x1={M.left}
              x2={M.left + PLOT_W}
              y1={BASELINE}
              y2={BASELINE}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.5}
            />

            {/* hovered vertical guide */}
            {activePoint && (
              <line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={M.top}
                y2={BASELINE}
                stroke="rgba(225,27,34,0.45)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}

            {/* volume bars (staggered grow from baseline) */}
            {data.map((d, i) => {
              const h = BASELINE - volY(d.volumeKT);
              const x = colCenter(i) - barW / 2;
              const isActive = active === i;
              return (
                <motion.rect
                  key={`bar-${d.year}`}
                  x={x}
                  width={barW}
                  rx={4}
                  fill={`url(#bar-${uid})`}
                  initial={{ y: BASELINE, height: 0 }}
                  animate={
                    chartInView
                      ? { y: volY(d.volumeKT), height: h }
                      : { y: BASELINE, height: 0 }
                  }
                  transition={{
                    duration: 0.7,
                    ease: easeOut,
                    delay: 0.15 + i * 0.05,
                  }}
                  style={{ opacity: active === null || isActive ? 1 : 0.45 }}
                />
              );
            })}

            {/* revenue line — re-keyed on series so it redraws on toggle */}
            <motion.path
              key={`line-${series}`}
              d={linePath}
              fill="none"
              stroke={`url(#line-${uid})`}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${uid})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                chartInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 1.4, ease: easeOut, delay: 0.5 }}
            />

            {/* revenue dots (fade in after the line draws) */}
            {points.map((p, i) => {
              const isActive = active === i;
              return (
                <motion.circle
                  key={`dot-${series}-${p.d.year}`}
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 6 : 4}
                  fill="#0B0B0D"
                  stroke="#E11B22"
                  strokeWidth={2.5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    chartInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{
                    duration: 0.3,
                    ease: easeOut,
                    delay: 0.9 + (i / Math.max(1, n - 1)) * 0.8,
                  }}
                />
              );
            })}

            {/* x-axis year labels */}
            {data.map((d, i) => {
              if (i % labelStep !== 0 && i !== n - 1) return null;
              return (
                <text
                  key={`xl-${d.year}`}
                  x={colCenter(i)}
                  y={BASELINE + 22}
                  textAnchor="middle"
                  className={cn(
                    "font-mono",
                    active === i ? "fill-white" : "fill-steel-400"
                  )}
                  fontSize={11}
                >
                  {d.year}
                </text>
              );
            })}

            {/* invisible hit areas per column (keyboard/pointer friendly) */}
            {data.map((d, i) => (
              <rect
                key={`hit-${d.year}`}
                x={M.left + colW * i}
                y={M.top}
                width={colW}
                height={PLOT_H}
                fill="transparent"
                onPointerEnter={() => setActive(i)}
              />
            ))}
          </svg>

          {/* tooltip */}
          {activePoint && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: easeOut }}
              style={{ left: `${tipClampedPct}%` }}
              className="glass-strong pointer-events-none absolute top-4 z-10 -translate-x-1/2 rounded-xl px-4 py-3"
            >
              <p className="font-display text-sm font-bold text-white">
                {activePoint.d.year}
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-steel-300">
                <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-steel-300 to-steel-500/60" />
                Volume
                <span className="ml-auto font-mono tabular-nums text-white">
                  {fmt(activePoint.d.volumeKT, 1)} KT
                </span>
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-steel-300">
                <span className="h-[3px] w-2.5 rounded-full bg-gradient-to-r from-accord-ember to-accord-red" />
                Revenue
                <span className="ml-auto font-mono tabular-nums text-white">
                  {fmt(activePoint.d[series], cfg.decimals)} {cfg.unit}
                </span>
              </p>
            </motion.div>
          )}
        </div>

        {/* visually-hidden data table for assistive tech */}
        <table className="sr-only">
          <caption>
            Accord Chemical Corporation volume and revenue by financial year
          </caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col">Volume (thousand metric tons)</th>
              <th scope="col">Revenue ({cfg.kpiUnit})</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={`row-${d.year}`}>
                <th scope="row">{d.year}</th>
                <td>{d.volumeKT}</td>
                <td>{d[series]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- KPI tiles ---------- */}
        {latest && (
          <motion.dl
            // re-key on series so the count-ups re-run toward the new targets
            key={`kpi-${series}`}
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            <Kpi
              target={latest[series]}
              decimals={cfg.decimals}
              suffix={cfg.kpiUnit}
              label={`Latest revenue (${latest.year})`}
            />
            <Kpi
              target={latest.volumeKT}
              decimals={1}
              suffix="KT"
              label={`Volume ${latest.year}`}
            />
            <Kpi
              target={multiple}
              decimals={0}
              prefix="≈ "
              suffix="×"
              label={`Revenue growth since ${first?.year ?? "inception"}`}
            />
          </motion.dl>
        )}
      </Container>
    </section>
  );
}
