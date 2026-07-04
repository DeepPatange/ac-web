"use client";

import type { RefObject } from "react";
import { useScroll, type MotionValue } from "framer-motion";

/**
 * Shared plumbing for the three pinned peaks (What-we-do, Products, Growth).
 *
 * Attach the returned ref's element to a TALL section (e.g. `h-[280vh]`)
 * containing a `sticky top-0 h-screen` child; this hook returns a 0→1
 * MotionValue spanning the full pin duration. Lenis-compatible: it reads the
 * native scroll position framer tracks — no extra rAF loop, no GSAP.
 *
 * Feed the result into `useTransform` — never into React state.
 */
export function usePinnedScene(
  ref: RefObject<HTMLElement>
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return scrollYProgress;
}
