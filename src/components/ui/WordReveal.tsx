"use client";

import { motion, type Variants } from "framer-motion";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type WordRevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

const wordVariants: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.7, ease: easeOut },
  },
};

/**
 * Masked word rise — each word slides up out of its own `overflow-hidden`
 * line wrapper, staggered left→right. Reserved for the seven section H2s
 * (brief §3); everything else uses `fadeSoft`.
 *
 *   <WordReveal as="h2" className="type-section text-white">
 *     One desk from indent to delivery.
 *   </WordReveal>
 */
export default function WordReveal({
  children,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.05,
  once = true,
  amount = 0.5,
}: {
  /** Plain text only — it gets split into words. */
  children: string;
  as?: WordRevealTag;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}) {
  const Tag = as;
  const words = children.split(/\s+/).filter(Boolean);

  return (
    <Tag className={cn(className)} aria-label={children}>
      <motion.span
        aria-hidden
        className="inline"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
            {i < words.length - 1 ? "\u00A0" : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
