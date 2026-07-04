"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type ArcPoint = { x: number; y: number };

/**
 * The site's signature motif (brief §2): a thin red shipping-lane arc with a
 * glowing node. Low-level primitive consumed by SectionSeam, the About orbit,
 * the Footer convergence and GlobalPresence.
 *
 * - Coordinates are in a 0–100 × 0–100 box mapped onto the wrapper's measured
 *   pixel size, and the path is built in pixel space. This is deliberate:
 *   the earlier `preserveAspectRatio="none"` + `non-scaling-stroke` approach
 *   breaks framer-motion's `pathLength` dash normalization in Chromium (the
 *   dash pattern repeats along the path), rendering a partially-drawn arc as
 *   scattered dashes instead of one continuous stroke.
 * - `progress` (0→1 MotionValue) scrubs the stroke's `pathLength` —
 *   transform/opacity only, NO SVG filters. The glow is a second, wider,
 *   low-opacity stroke plus a static box-shadow on the node.
 * - Under `prefers-reduced-motion` the arc renders complete.
 */
export default function TradeArc({
  progress,
  from = { x: 0, y: 80 },
  to = { x: 100, y: 20 },
  curve = 30,
  nodeAt = 1,
  strokeWidth = 1.5,
  nodeSize = 8,
  showNode = true,
  className,
}: {
  /** 0→1 scrub value. Pass a static MotionValue(1) for an always-drawn arc. */
  progress: MotionValue<number>;
  /** Start point, 0–100 box units. */
  from?: ArcPoint;
  /** End point, 0–100 box units. */
  to?: ArcPoint;
  /** Bow height in box units (+ bows up, − bows down). */
  curve?: number;
  /** Where the node sits along the curve, 0–1 (default: the end). */
  nodeAt?: number;
  /** Stroke width in px. */
  strokeWidth?: number;
  /** Node diameter in px. */
  nodeSize?: number;
  showNode?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const complete = useMotionValue(1);
  const p = reduced ? complete : progress;

  const wrapRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Quadratic bezier: control point = midpoint lifted by `curve` (box units).
  const ctrl: ArcPoint = {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2 - curve,
  };

  // Node position: point on the bezier at t = nodeAt (clamped), box units.
  const t = Math.min(1, Math.max(0.05, nodeAt));
  const omt = 1 - t;
  const node: ArcPoint = {
    x: omt * omt * from.x + 2 * omt * t * ctrl.x + t * t * to.x,
    y: omt * omt * from.y + 2 * omt * t * ctrl.y + t * t * to.y,
  };

  // Node lands as the draw reaches it — opacity + scale only.
  const nodeOpacity = useTransform(p, [Math.max(0, t - 0.12), t], [0, 1]);
  const nodeScale = useTransform(p, [Math.max(0, t - 0.12), t], [0.4, 1]);

  // Path in pixel space (only once the wrapper is measured).
  const px = (pt: ArcPoint) =>
    size ? { x: (pt.x / 100) * size.w, y: (pt.y / 100) * size.h } : pt;
  const pFrom = px(from);
  const pCtrl = px(ctrl);
  const pTo = px(to);
  const d = `M ${pFrom.x.toFixed(1)} ${pFrom.y.toFixed(1)} Q ${pCtrl.x.toFixed(1)} ${pCtrl.y.toFixed(1)} ${pTo.x.toFixed(1)} ${pTo.y.toFixed(1)}`;

  return (
    <span
      ref={wrapRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 block", className)}
    >
      {size && (
        <svg
          className="h-full w-full overflow-visible"
          viewBox={`0 0 ${size.w} ${size.h}`}
          fill="none"
        >
          {/* faked glow: wider, low-opacity twin stroke (no SVG filters) */}
          <motion.path
            d={d}
            stroke="#E11B22"
            strokeOpacity={0.22}
            strokeWidth={strokeWidth * 3.5}
            strokeLinecap="round"
            style={{ pathLength: p }}
          />
          <motion.path
            d={d}
            stroke="#E11B22"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ pathLength: p }}
          />
        </svg>
      )}
      {showNode && (
        <motion.span
          className="absolute block rounded-full bg-accord-red"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: nodeSize,
            height: nodeSize,
            x: "-50%",
            y: "-50%",
            opacity: nodeOpacity,
            scale: nodeScale,
            boxShadow:
              "0 0 12px 2px rgba(225,27,34,0.55), 0 0 3px 0 rgba(255,90,60,0.8)",
          }}
        />
      )}
    </span>
  );
}
