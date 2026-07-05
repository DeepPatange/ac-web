"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Container from "@/components/ui/Container";
import PinnedScene from "@/components/ui/PinnedScene";
import SectionHeading from "@/components/ui/SectionHeading";
import StatNumber from "@/components/ui/StatNumber";
import { growth, growthCopy } from "@/lib/site";
import { easeOut, fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * PEAK 3 — "The record" (brief §4.2). A ~200vh pinned scene: scroll
 * progress drives per-bar heights (staggered windows), the red revenue
 * line's pathLength (the Trade Arc's mid-page moment — glow faked with
 * a second wider low-opacity stroke, NO SVG filters) and a large
 * scrubbed mono year read-out. Forward AND backward. The USD/INR
 * layoutId toggle + pointer tooltip stay live mid-pin. KPI tiles sit
 * after the pin and maskRise on release — no count-ups (those are
 * exclusive to the About proof band).
 * ------------------------------------------------------------------ */

/* ----- chart geometry (fixed viewBox, scaled with `meet`) ----- */
const VB_W = 1000;
const VB_H = 420;
const M = { top: 30, right: 24, bottom: 56, left: 58 } as const;
const PLOT_W = VB_W - M.left - M.right;
const PLOT_H = VB_H - M.top - M.bottom;
const BASELINE = M.top + PLOT_H;

/* ----- progress choreography windows (0→1 across the 200vh pin) ----- */
const BAR_START_RANGE: readonly [number, number] = [0.06, 0.5];
const BAR_WINDOW = 0.16;
const LINE_RANGE: readonly [number, number] = [0.14, 0.82];
const YEAR_RANGE: readonly [number, number] = [0.06, 0.78];
const SETTLE_RANGE: readonly [number, number] = [0.94, 1];

type RevenueKey = "revenueUSD" | "revenueINR";

const SERIES: Record<
  RevenueKey,
  {
    label: string;
    pill: string;
    unit: string;
    kpiPrefix: string;
    kpiSuffix: string;
    decimals: number;
  }
> = {
  revenueUSD: {
    label: "USD",
    pill: "USD (millions)",
    unit: "USD M",
    kpiPrefix: "$",
    kpiSuffix: "M",
    decimals: 1,
  },
  revenueINR: {
    label: "INR",
    pill: "INR (crore)",
    unit: "₹ Cr",
    kpiPrefix: "₹",
    kpiSuffix: " Cr",
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
 * Scrub-driven SVG atoms — each owns its useTransform (hooks can't
 * live in .map callbacks). Transform + opacity ONLY on the scroll path.
 * ------------------------------------------------------------------ */

/** Deep-ink column with a red→ember top edge; grows via scaleY about the baseline. */
function ScrubBar({
  progress,
  start,
  x,
  width,
  yTop,
  height,
  fill,
  dimmed,
}: {
  progress: MotionValue<number>;
  start: number;
  x: number;
  width: number;
  yTop: number;
  height: number;
  fill: string;
  dimmed: boolean;
}) {
  const scaleY = useTransform(progress, [start, start + BAR_WINDOW], [0, 1]);
  return (
    <motion.rect
      x={x}
      y={yTop}
      width={width}
      height={height}
      rx={2.5}
      fill={fill}
      stroke="rgba(255,255,255,0.06)"
      strokeWidth={1}
      style={{ scaleY, originY: 1, opacity: dimmed ? 0.45 : 1 }}
    />
  );
}

/** Revenue node — lands as the line's draw reaches it. The final node gets a red fill + static halo (the Trade Arc terminus). */
function ScrubDot({
  progress,
  at,
  cx,
  cy,
  active,
  terminus,
}: {
  progress: MotionValue<number>;
  at: number;
  cx: number;
  cy: number;
  active: boolean;
  terminus: boolean;
}) {
  const opacity = useTransform(progress, [Math.max(0, at - 0.06), at], [0, 1]);
  const scale = useTransform(progress, [Math.max(0, at - 0.06), at], [0.3, 1]);
  return (
    <motion.g style={{ opacity }}>
      {terminus && <circle cx={cx} cy={cy} r={11} fill="rgba(225,27,34,0.22)" />}
      <motion.circle
        cx={cx}
        cy={cy}
        r={active ? 6 : terminus ? 5 : 4}
        fill={terminus ? "#E11B22" : "#0B0B0D"}
        stroke="#E11B22"
        strokeWidth={2.5}
        style={{ scale }}
      />
    </motion.g>
  );
}

/** Large scrubbed mono year read-out — a MotionValue<string> rendered in a motion.span (zero re-renders per frame). */
function YearReadout({
  progress,
  years,
  className,
}: {
  progress: MotionValue<number>;
  years: readonly string[];
  className?: string;
}) {
  const count = years.length;
  const label = useTransform(progress, (p) => {
    const [a, b] = YEAR_RANGE;
    const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
    return years[Math.min(count - 1, Math.floor(t * count))] ?? "";
  });
  return (
    <span aria-hidden className={className}>
      <span className="mr-[0.5em] align-baseline text-[0.38em] tracking-[0.3em] text-steel-400">
        FY
      </span>
      <motion.span className="tabular-nums">{label}</motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Legend + USD/INR toggle — kept live mid-pin (layoutId spring pill).
 * ------------------------------------------------------------------ */
function ControlsRow({
  series,
  onSeriesChange,
  className,
}: {
  series: RevenueKey;
  onSeriesChange: (s: RevenueKey) => void;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <motion.div
      variants={fadeSoft}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-3",
        className
      )}
    >
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-wide text-steel-300">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3.5 w-2.5 rounded-[3px]"
            style={{
              background:
                "linear-gradient(to bottom, #FF5A3C 0%, #E11B22 22%, #2A2A33 48%, #16161B 100%)",
            }}
          />
          Volume (KT)
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-[3px] w-6 rounded-full bg-gradient-to-r from-accord-ember to-accord-red"
          />
          Revenue
        </li>
      </ul>

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
              onClick={() => onSeriesChange(key)}
              aria-pressed={selected}
              className={cn(
                "relative rounded-full px-4 py-1.5 font-mono text-[11px] tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accord-red sm:text-xs",
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
  );
}

/* ------------------------------------------------------------------ *
 * The chart card. Pointer → nearest column tooltip (mouse + touch
 * drag), letterbox-aware since the SVG scales with `meet` inside a
 * flexible stage.
 * ------------------------------------------------------------------ */
function ChartFigure({
  progress,
  series,
  pinned,
  className,
}: {
  progress: MotionValue<number>;
  series: RevenueKey;
  pinned: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const figureRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<{
    idx: number;
    leftPct: number;
    topPx: number;
  } | null>(null);

  const data = growth;
  const n: number = data.length;
  const cfg = SERIES[series];
  const first = data[0];
  const latest = data[n - 1];

  /* ----- scales ----- */
  const volScale = useMemo(
    () => niceScale(Math.max(1, ...data.map((d) => d.volumeKT)), 4),
    [data]
  );
  const revScale = useMemo(
    () => niceScale(Math.max(1, ...data.map((d) => d[series])), 4),
    [data, series]
  );

  /* ----- layout helpers ----- */
  const colW = PLOT_W / n;
  const barW = Math.min(44, colW * 0.5);
  const colCenter = (i: number) => M.left + colW * (i + 0.5);
  const volY = (v: number) => BASELINE - (v / volScale.max) * PLOT_H;
  const revY = (v: number) => BASELINE - (v / revScale.max) * PLOT_H;

  const points = useMemo(
    () =>
      data.map((d, i) => ({
        x: M.left + (PLOT_W / n) * (i + 0.5),
        y: BASELINE - (d[series] / revScale.max) * PLOT_H,
        d,
      })),
    [data, n, series, revScale.max]
  );
  const linePath = useMemo(
    () =>
      points
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" "),
    [points]
  );

  const volTicks = useMemo(() => {
    const out: number[] = [];
    for (let v = 0; v <= volScale.max + 1e-6; v += volScale.step) out.push(v);
    return out;
  }, [volScale]);

  /* ----- scroll-scrubbed line draw (shared by glow + core strokes) ----- */
  const lineDraw = useTransform(progress, [LINE_RANGE[0], LINE_RANGE[1]], [0, 1]);

  /* ----- pointer → nearest column (letterbox-aware) ----- */
  const handlePointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = figureRef.current;
    if (!el || n === 0) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const scale = Math.min(rect.width / VB_W, rect.height / VB_H);
    if (scale <= 0) return;
    const ox = (rect.width - VB_W * scale) / 2;
    const oy = (rect.height - VB_H * scale) / 2;
    const localX = (e.clientX - rect.left - ox) / scale;
    const idx = Math.floor((localX - M.left) / colW);
    if (idx < 0 || idx >= n) {
      setActive(null);
      return;
    }
    const leftPct = Math.min(
      74,
      Math.max(14, ((ox + colCenter(idx) * scale) / rect.width) * 100)
    );
    const topPx = Math.max(8, oy + 10 * scale);
    setActive((prev) =>
      prev && prev.idx === idx && prev.leftPct === leftPct && prev.topPx === topPx
        ? prev
        : { idx, leftPct, topPx }
    );
  };

  const activePoint = active !== null ? points[active.idx] : null;

  const barStart = (i: number) =>
    BAR_START_RANGE[0] +
    (i / Math.max(1, n - 1)) * (BAR_START_RANGE[1] - BAR_START_RANGE[0]);
  const dotAt = (i: number) =>
    LINE_RANGE[0] + (i / Math.max(1, n - 1)) * (LINE_RANGE[1] - LINE_RANGE[0]);

  const ariaSummary = `Growth chart, FY ${first.year} to FY ${latest.year}. Volume grew from ${first.volumeKT} to ${latest.volumeKT} thousand metric tons; ${cfg.label} revenue from ${fmt(first[series], cfg.decimals)} to ${fmt(latest[series], cfg.decimals)} ${cfg.unit}.`;

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        role="img"
        aria-label={ariaSummary}
        className={cn(
          "glass-card relative flex w-full flex-col rounded-3xl p-2 sm:p-3",
          pinned && "min-h-0 flex-1"
        )}
      >
        <div
          ref={figureRef}
          onPointerMove={handlePointer}
          onPointerLeave={() => setActive(null)}
          className={cn(
            "relative w-full touch-pan-y",
            pinned ? "min-h-0 flex-1" : "aspect-[1000/420]"
          )}
        >
          {/* large scrubbed year read-out */}
          <YearReadout
            progress={progress}
            years={data.map((d) => d.year)}
            className="pointer-events-none absolute right-3 top-1 z-0 select-none font-mono text-[clamp(1.9rem,4.5vw,3.4rem)] font-medium leading-none tracking-tight text-white/[0.15]"
          />

          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="relative block h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* deep ink column, red→ember top edge (brief §4.2 — silver gradient killed) */}
              <linearGradient id={`bar-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FF5A3C" />
                <stop offset="0.055" stopColor="#E11B22" />
                <stop offset="0.16" stopColor="#2A2A33" />
                <stop offset="1" stopColor="#16161B" stopOpacity="0.6" />
              </linearGradient>
              {/* ember → red line gradient */}
              <linearGradient id={`line-${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF5A3C" />
                <stop offset="55%" stopColor="#E11B22" />
                <stop offset="100%" stopColor="#FF3B41" />
              </linearGradient>
            </defs>

            {/* horizontal gridlines + volume ticks (mono, unit inline) */}
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
                    x={M.left - 10}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="central"
                    className="fill-steel-400 font-mono"
                    fontSize={12}
                  >
                    {t > 0 ? `${t} KT` : "0"}
                  </text>
                </g>
              );
            })}

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

            {/* volume bars — per-bar staggered scaleY windows */}
            {data.map((d, i) => {
              const yTop = volY(d.volumeKT);
              return (
                <ScrubBar
                  key={`bar-${d.year}`}
                  progress={progress}
                  start={barStart(i)}
                  x={colCenter(i) - barW / 2}
                  width={barW}
                  yTop={yTop}
                  height={BASELINE - yTop}
                  fill={`url(#bar-${uid})`}
                  dimmed={active !== null && active.idx !== i}
                />
              );
            })}

            {/* revenue line = the Trade Arc's mid-page moment.
                Glow is a second, wider, low-opacity stroke — NO SVG filters. */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#E11B22"
              strokeOpacity={0.25}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: lineDraw }}
            />
            <motion.path
              d={linePath}
              fill="none"
              stroke={`url(#line-${uid})`}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: lineDraw }}
            />

            {/* revenue nodes — land as the draw reaches them */}
            {points.map((p, i) => (
              <ScrubDot
                key={`dot-${p.d.year}`}
                progress={progress}
                at={dotAt(i)}
                cx={p.x}
                cy={p.y}
                active={active?.idx === i}
                terminus={i === n - 1}
              />
            ))}

            {/* x-axis year labels (thinned; active year brightens) */}
            {data.map((d, i) => {
              if (i % 2 !== 0 && i !== n - 1) return null;
              return (
                <text
                  key={`xl-${d.year}`}
                  x={colCenter(i)}
                  y={BASELINE + 22}
                  textAnchor="middle"
                  className={cn(
                    "font-mono",
                    active?.idx === i ? "fill-white" : "fill-steel-400"
                  )}
                  fontSize={11}
                >
                  {d.year}
                </text>
              );
            })}
          </svg>

          {/* tooltip — pointer-driven, live mid-pin */}
          {activePoint && active && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: easeOut }}
              style={{ left: `${active.leftPct}%`, top: active.topPx }}
              className="glass-strong pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl px-4 py-3"
            >
              <p className="font-mono text-xs tracking-widest text-white">
                FY {activePoint.d.year}
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-xs text-steel-300">
                <span
                  className="h-2.5 w-2 rounded-[2px]"
                  style={{
                    background:
                      "linear-gradient(to bottom, #E11B22 0%, #E11B22 25%, #2A2A33 55%, #16161B 100%)",
                  }}
                />
                Volume
                <span className="ml-auto pl-4 font-mono tabular-nums text-white">
                  {fmt(activePoint.d.volumeKT, 1)} KT
                </span>
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-steel-300">
                <span className="h-[3px] w-2 rounded-full bg-gradient-to-r from-accord-ember to-accord-red" />
                Revenue
                <span className="ml-auto pl-4 font-mono tabular-nums text-white">
                  {fmt(activePoint.d[series], cfg.decimals)} {cfg.unit}
                </span>
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* chart caption */}
      <motion.p
        variants={fadeSoft}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-3 font-mono text-[11px] tracking-wide text-steel-400"
      >
        {growthCopy.caption}
      </motion.p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Scene layout — shared by the pinned stage and the reduced-motion
 * fallback (which passes a constant progress of 1: fully drawn chart).
 * ------------------------------------------------------------------ */
function SceneLayout({
  progress,
  pinned,
  series,
  onSeriesChange,
}: {
  progress: MotionValue<number>;
  pinned: boolean;
  series: RevenueKey;
  onSeriesChange: (s: RevenueKey) => void;
}) {
  // Pin release (brief §4.3): content settles −40px and dims to 85%
  // while the next section slides over. Transform + opacity only.
  const settleY = useTransform(progress, [SETTLE_RANGE[0], SETTLE_RANGE[1]], [0, -40]);
  const settleOpacity = useTransform(
    progress,
    [SETTLE_RANGE[0], SETTLE_RANGE[1]],
    [1, 0.85]
  );

  return (
    <Container
      className={cn(
        pinned ? "flex h-full min-h-0 flex-col pb-5 pt-20 sm:pb-7 sm:pt-24" : "py-16 sm:py-20"
      )}
    >
      <motion.div
        className={cn(pinned && "flex min-h-0 flex-1 flex-col")}
        style={pinned ? { y: settleY, opacity: settleOpacity } : undefined}
      >
        <SectionHeading
          number="05"
          eyebrow={growthCopy.eyebrow}
          title={growthCopy.heading}
          intro={growthCopy.intro}
        />
        <ControlsRow
          series={series}
          onSeriesChange={onSeriesChange}
          className="mt-5 sm:mt-7"
        />
        <ChartFigure
          progress={progress}
          series={series}
          pinned={pinned}
          className={cn("mt-4", pinned && "min-h-0 flex-1")}
        />
      </motion.div>
    </Container>
  );
}

/** Reduced-motion fallback: unpinned, natural height, chart fully drawn. */
function StaticScene({
  series,
  onSeriesChange,
}: {
  series: RevenueKey;
  onSeriesChange: (s: RevenueKey) => void;
}) {
  const complete = useMotionValue(1);
  return (
    <SceneLayout
      progress={complete}
      pinned={false}
      series={series}
      onSeriesChange={onSeriesChange}
    />
  );
}

/* ------------------------------------------------------------------ *
 * KPI band — AFTER the pin, so the maskRise fires exactly on release.
 * Static tabular mono numbers (StatNumber default) — NO count-ups.
 * ------------------------------------------------------------------ */
function KpiBand({ series }: { series: RevenueKey }) {
  const cfg = SERIES[series];
  const first = growth[0];
  const latest = growth[growth.length - 1];
  const multiple =
    first[series] > 0 ? Math.round(latest[series] / first[series]) : 0;

  const tiles = [
    {
      value: latest[series],
      decimals: cfg.decimals,
      prefix: cfg.kpiPrefix,
      suffix: cfg.kpiSuffix,
      label: `Revenue · FY ${latest.year}`,
    },
    {
      value: latest.volumeKT,
      decimals: 1,
      prefix: undefined,
      suffix: " KT",
      label: `Volume · FY ${latest.year}`,
    },
    {
      value: multiple,
      decimals: 0,
      prefix: "≈ ",
      suffix: "×",
      label: `Revenue growth since FY ${first.year}`,
    },
  ];

  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          variants={fadeSoft}
          className="group glass-card relative overflow-hidden p-6 transition-colors duration-300 hover:border-white/20"
        >
          {/* informational-tile hover (brief §4.4): border brightens +
              a 1px red rule draws along the top edge. No translate. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accord-red transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <StatNumber
            value={t.value}
            decimals={t.decimals}
            prefix={t.prefix}
            suffix={t.suffix}
            label={t.label}
            delay={i * 0.08}
            numberClassName="text-3xl sm:text-4xl"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

export default function Growth() {
  const [series, setSeries] = useState<RevenueKey>("revenueUSD");

  return (
    // NOTE: no overflow-hidden here — it would break the sticky pin.
    <section
      id="growth"
      aria-label={`${growthCopy.eyebrow} — ${growthCopy.heading}`}
      className="section-peak zone-warm relative"
    >

      <PinnedScene
        height="200vh"
        reducedFallback={
          <StaticScene series={series} onSeriesChange={setSeries} />
        }
      >
        {(progress) => (
          <SceneLayout
            progress={progress}
            pinned
            series={series}
            onSeriesChange={setSeries}
          />
        )}
      </PinnedScene>

      <Container className="relative pb-20 pt-2 sm:pb-24">
        <KpiBand series={series} />

        {/* full dataset for assistive tech (the scrubbed chart is decorative-summarised) */}
        <table className="sr-only">
          <caption>Volume and revenue by financial year</caption>
          <thead>
            <tr>
              <th scope="col">Financial year</th>
              <th scope="col">Volume (thousand metric tons)</th>
              <th scope="col">Revenue (USD millions)</th>
              <th scope="col">Revenue (INR crore)</th>
            </tr>
          </thead>
          <tbody>
            {growth.map((d) => (
              <tr key={`row-${d.year}`}>
                <th scope="row">{d.year}</th>
                <td>{d.volumeKT}</td>
                <td>{d.revenueUSD}</td>
                <td>{d.revenueINR}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </section>
  );
}
