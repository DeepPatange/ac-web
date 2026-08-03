"use client";

import { motion } from "framer-motion";
import WordReveal from "@/components/ui/WordReveal";
import { fadeSoft, inView } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Section header in the redesign type system (brief §3): mono index chip +
 * red eyebrow row, `.type-section` H2 revealed word-by-word (WordReveal),
 * quiet `fadeSoft` intro. Used by every numbered section — this is where the
 * typography tiers propagate from.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  number,
  /** Extra classes for the intro paragraph (e.g. to widen it / keep one line). */
  introClassName,
  // kept for API compatibility with existing call-sites; no longer used.
  invert: _invert = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  number?: string;
  introClassName?: string;
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left"
      )}
    >
      {(number || eyebrow) && (
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-6 flex items-center gap-3 sm:mb-8"
        >
          {number && (
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-accord-red/25 bg-accord-red/[0.14] px-2 font-mono text-[11px] tracking-widest text-accord-red">
              {number}
            </span>
          )}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
              {eyebrow}
            </span>
          )}
        </motion.div>
      )}

      <WordReveal
        as="h2"
        className={cn(
          "type-section max-w-4xl text-balance text-white",
          align === "center" ? "mx-auto" : ""
        )}
      >
        {title}
      </WordReveal>

      {intro && (
        <motion.p
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          transition={{ delay: 0.15 }}
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed text-steel-300 sm:text-lg",
            align === "center" ? "mx-auto" : "",
            introClassName
          )}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}
