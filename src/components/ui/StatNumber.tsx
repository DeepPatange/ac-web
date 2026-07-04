"use client";

import { motion } from "framer-motion";
import { useScrubCounter } from "@/hooks/useScrubCounter";
import { easeOut, maskRise } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Headline statistic in the mono "technical data" voice (brief §3 / §6).
 *
 * - `live` — MotionValue-driven count-up + spring suffix pop. Allowed ONLY in
 *   the About stats proof band; cascade left→right with the `delay` prop.
 * - default (static) — number reveals with `maskRise`, no counting.
 *
 * The red suffix/prefix carries the brand accent; digits stay white.
 */
export default function StatNumber({
  value,
  suffix,
  prefix,
  label,
  live = false,
  decimals = 0,
  delay = 0,
  duration = 1.8,
  className,
  numberClassName,
}: {
  value: number;
  /** Red accent after the digits, e.g. "+" or "M". */
  suffix?: string;
  /** Rendered before the digits, e.g. "$". */
  prefix?: string;
  label: string;
  /** Count-up + suffix pop. About stats band ONLY. */
  live?: boolean;
  decimals?: number;
  /** Seconds — stagger for left→right cascades. */
  delay?: number;
  /** Count duration in seconds (live only). */
  duration?: number;
  className?: string;
  numberClassName?: string;
}) {
  const { ref, value: counted } = useScrubCounter<HTMLDivElement>(value, {
    decimals,
    delay,
    duration,
    enabled: live,
  });

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div ref={ref} className={cn("flex flex-col items-start", className)}>
      <div
        className={cn(
          "flex items-baseline font-mono text-4xl font-medium tracking-tight text-white sm:text-5xl",
          numberClassName
        )}
      >
        {live ? (
          <>
            {prefix && <span>{prefix}</span>}
            <motion.span>{counted}</motion.span>
            {suffix && (
              // Signature detail: the red suffix pops in with a small spring
              // AFTER the number lands.
              <motion.span
                className="text-accord-red"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 17,
                  delay: delay + duration,
                }}
              >
                {suffix}
              </motion.span>
            )}
          </>
        ) : (
          <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em]">
            <motion.span
              className="inline-block"
              variants={maskRise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: easeOut, delay }}
            >
              {prefix && <span>{prefix}</span>}
              {formatted}
              {suffix && <span className="text-accord-red">{suffix}</span>}
            </motion.span>
          </span>
        )}
      </div>
      <span className="mt-2 font-mono text-xs uppercase tracking-widest text-steel-400">
        {label}
      </span>
    </div>
  );
}
