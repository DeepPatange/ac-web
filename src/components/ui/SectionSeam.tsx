"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import TradeArc from "@/components/ui/TradeArc";
import { cn } from "@/lib/utils";

/**
 * The Trade Arc section boundary (brief §2.2 / §4.3). Place at the very top
 * of a numbered section, before its Container/heading:
 *
 *   <SectionSeam number="03" />
 *
 * A thin red arc sweeps in from the right edge as the boundary enters the
 * viewport (its own `useScroll`, scrubbed `pathLength` — transform/opacity
 * only), terminating in a glowing node that lands beside the mono
 * section-number chip at the left margin. Purely decorative (`aria-hidden`);
 * renders complete under `prefers-reduced-motion`.
 */
export default function SectionSeam({
  number,
  className,
}: {
  /** Section index, e.g. "03". Omit for un-numbered boundaries. */
  number?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Scrub the draw across the boundary's entry into the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });
  const complete = useMotionValue(1);
  const p = reduced ? complete : scrollYProgress;

  const chipOpacity = useTransform(p, [0.6, 0.95], [0, 1]);
  const chipX = useTransform(p, [0.6, 0.95], [8, 0]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none relative mx-auto h-20 w-full max-w-container select-none sm:h-28",
        className
      )}
    >
      <TradeArc
        progress={p}
        from={{ x: 103, y: 14 }}
        to={{ x: 7, y: 70 }}
        curve={-26}
        nodeAt={1}
        strokeWidth={1.25}
        nodeSize={7}
      />
      {number && (
        <motion.span
          className="absolute flex items-center font-mono text-xs tracking-widest text-steel-400"
          style={{
            left: "7%",
            top: "70%",
            y: "-50%",
            opacity: chipOpacity,
            x: chipX,
            paddingLeft: "1.25rem",
          }}
        >
          {number}
        </motion.span>
      )}
    </div>
  );
}
