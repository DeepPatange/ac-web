"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeUp, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. Use <Reveal> for a single fade-up element, or
 * <Reveal stagger> as a parent and <Reveal.Item> for staggered children.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({
  children,
  className,
  amount = 0.2,
  gap = 0.1,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={stagger(gap)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
