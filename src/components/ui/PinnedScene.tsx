"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { usePinnedScene } from "@/hooks/usePinnedScene";
import { cn } from "@/lib/utils";

/**
 * The one pinned-scene wrapper all three peaks use (brief §4.2 / §6).
 *
 * Tall relative wrapper (`height`) + `sticky top-0 h-screen` stage. The
 * render-prop receives a 0→1 MotionValue spanning the whole pin — feed it
 * into `useTransform` (transform/opacity only), never into state.
 *
 * Under `prefers-reduced-motion` it renders `reducedFallback`: unpinned,
 * natural height, fully revealed.
 *
 *   <PinnedScene height="280vh" reducedFallback={<StaticLayout />}>
 *     {(progress) => <Scene progress={progress} />}
 *   </PinnedScene>
 */
export default function PinnedScene({
  height = "280vh",
  className,
  stickyClassName,
  children,
  reducedFallback,
}: {
  /** Total scroll length of the scene, e.g. "280vh". */
  height?: string;
  className?: string;
  /** Extra classes on the sticky h-screen stage (e.g. "overflow-visible"). */
  stickyClassName?: string;
  children: (progress: MotionValue<number>) => ReactNode;
  /** Static, unpinned, fully-revealed layout for reduced motion. Required. */
  reducedFallback: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = usePinnedScene(ref);
  const prefersReduced = useReducedMotion();

  // `willChange: transform` only while the pin is active; released after
  // (perf budget §7.4). MotionValue-driven — no re-renders.
  const willChange = useTransform(progress, (p) =>
    p > 0.001 && p < 0.999 ? "transform" : "auto"
  );

  if (prefersReduced) {
    return (
      <div ref={ref} className={cn("relative", className)}>
        {reducedFallback}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-pinned-scene=""
      className={cn("relative", className)}
      style={{ height }}
    >
      <motion.div
        className={cn(
          "sticky top-0 flex h-screen flex-col overflow-hidden",
          stickyClassName
        )}
        style={{ willChange }}
      >
        {children(progress)}
      </motion.div>
    </div>
  );
}
