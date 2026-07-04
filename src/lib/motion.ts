import type { Variants } from "framer-motion";

/** Shared easing — a confident, premium ease-out (cubic-bezier). */
export const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * @deprecated for headings — use `maskRise` (via WordReveal/CharReveal) for
 * display type and `fadeSoft` for body copy. Kept for back-compat while
 * sections migrate.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } },
};

/* ============================================================================
   Redesign motion vocabulary (REDESIGN_BRIEF §4 / §6)
   ========================================================================== */

/**
 * Masked rise — element slides up from below inside an `overflow-hidden`
 * wrapper. The wrapper clips; this variant only moves the inner element.
 * Used by WordReveal / CharReveal / static StatNumber.
 */
export const maskRise: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.8, ease: easeOut },
  },
};

/**
 * Clip-path inset wipe for images / panels. Entrance-only (variant driven,
 * never scroll-linked).
 */
export const clipWipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  show: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: easeOut },
  },
};

/**
 * Blur-in entrance. ENTRANCE ONLY — never attach to scroll progress
 * (animating `filter` on a scroll path is banned by the performance budget).
 */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeOut },
  },
};

/**
 * The quiet workhorse for body copy / intros — fast and plain so the headline
 * reveals read as intentional contrast.
 */
export const fadeSoft: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

/** Stagger container — children should use fadeUp/fadeSoft/maskRise/scaleIn. */
export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Standard viewport config for whileInView reveals. */
export const inView = { once: true, amount: 0.25 } as const;
