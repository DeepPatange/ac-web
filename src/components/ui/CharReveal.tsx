"use client";

import { motion, type Variants } from "framer-motion";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CharRevealTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

const charVariants: Variants = {
  hidden: { y: "110%" },
  show: (d: number) => ({
    y: "0%",
    transition: { duration: 0.55, ease: easeOut, delay: d },
  }),
};

/**
 * Character-level rise with per-word beat grouping: characters cascade at
 * `stagger`, each new word adds a `wordBeat` pause so the line reads in
 * spoken rhythm rather than a flat typewriter sweep.
 *
 * Reserved for the hero H1 and the footer CTA line ONLY (brief §3).
 *
 *   <CharReveal as="h1" className="type-hero text-white">
 *     Petrochemical trade, moved with precision.
 *   </CharReveal>
 */
export default function CharReveal({
  children,
  as = "h1",
  className,
  delay = 0,
  stagger = 0.04,
  wordBeat,
  once = true,
  amount = 0.4,
}: {
  /** Plain text only — it gets split into words and characters. */
  children: string;
  as?: CharRevealTag;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Extra pause added per word (defaults to 2.5 × stagger). */
  wordBeat?: number;
  once?: boolean;
  amount?: number;
}) {
  const Tag = as;
  const beat = wordBeat ?? stagger * 2.5;
  const words = children.split(/\s+/).filter(Boolean);

  return (
    <Tag className={cn(className)} aria-label={children}>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount }}
      >
        {words.map((word, wi) => (
          <span
            key={`${word}-${wi}`}
            className="inline-block whitespace-nowrap"
          >
            {Array.from(word).map((char, ci) => (
              <span
                key={ci}
                className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <motion.span
                  className="inline-block"
                  variants={charVariants}
                  custom={delay + wi * beat + ci * stagger}
                >
                  {char}
                </motion.span>
              </span>
            ))}
            {wi < words.length - 1 ? "\u00A0" : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
