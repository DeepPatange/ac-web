"use client";

import { motion } from "framer-motion";
import { fadeUp, inView } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Agency-style section header: a numbered badge row (number chip + bordered pill
 * label) above a large, medium-weight heading. Dark theme, brand-red accents.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  number,
  // kept for API compatibility with existing call-sites; no longer used.
  invert: _invert = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  number?: string;
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
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-6 flex items-center gap-3 sm:mb-8"
        >
          {number && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accord-red text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              {number}
            </span>
          )}
          {eyebrow && (
            <span className="rounded-full border border-white/15 px-3 py-1 text-[12px] font-medium text-steel-200 sm:px-4 sm:py-1.5 sm:text-[13px]">
              {eyebrow}
            </span>
          )}
        </motion.div>
      )}

      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        transition={{ delay: 0.05 }}
        className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white"
      >
        {title}
      </motion.h2>

      {intro && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          transition={{ delay: 0.1 }}
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed text-steel-300 sm:text-lg",
            align === "center" ? "mx-auto" : ""
          )}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}
