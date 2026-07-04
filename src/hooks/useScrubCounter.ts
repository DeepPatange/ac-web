"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface ScrubCounterOptions {
  /** Animation length in seconds. */
  duration?: number;
  /** Delay in seconds before the count starts (for left→right cascades). */
  delay?: number;
  /** Fraction digits rendered (default 0). */
  decimals?: number;
  /** Fire once (default true). */
  once?: boolean;
  /** In-view threshold (default 0.5). */
  amount?: number;
  /** When false, snaps straight to target (no animation ever runs). */
  enabled?: boolean;
}

/**
 * Count-up driven entirely by a MotionValue — ZERO React re-renders per
 * frame. Render the returned `value` inside a `<motion.span>`:
 *
 *   const { ref, value } = useScrubCounter(110000);
 *   <span ref={ref}><motion.span>{value}</motion.span></span>
 *
 * Snaps to target under `prefers-reduced-motion`. Replaces `useCountUp`.
 */
export function useScrubCounter<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  opts: ScrubCounterOptions = {}
): { ref: RefObject<T>; value: MotionValue<string> } {
  const {
    duration = 1.8,
    delay = 0,
    decimals = 0,
    once = true,
    amount = 0.5,
    enabled = true,
  } = opts;

  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once, amount });
  const reduced = useReducedMotion();

  const raw = useMotionValue(enabled ? 0 : target);
  const value = useTransform(raw, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  useEffect(() => {
    if (!enabled || reduced) {
      raw.set(target);
      return;
    }
    if (!isInView) return;

    const controls = animate(raw, target, {
      duration,
      delay,
      // easeOutExpo-adjacent for a snappy, premium finish
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [enabled, reduced, isInView, target, duration, delay, raw]);

  return { ref, value };
}
