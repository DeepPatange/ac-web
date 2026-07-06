"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Handshake, Ship, Truck, Warehouse } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StatNumber from "@/components/ui/StatNumber";
import { aboutCopy, stats } from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* The desk, drawn as four moves — "indent to delivery" made visual. */
const FLOW = [
  { Icon: Handshake, step: "Indent", note: "Producer-direct" },
  { Icon: Ship, step: "Import", note: "Duty-paid stock" },
  { Icon: Warehouse, step: "Clear & store", note: "In-house" },
  { Icon: Truck, step: "Deliver", note: "To your gate" },
];

/* Count-up cascade (brief §4.4) — the site's ONLY count-ups. */
const COUNT_DURATION = 1.4;
const COUNT_STEP = 0.12;

/**
 * 01 — About: a lean, representational home teaser. Heading + one line + link,
 * a four-step "indent → delivery" flow (icons on a connecting rail), and the
 * count-up stat rail. The full narrative lives on /about-us.
 */
export default function About() {
  return (
    <section id="about" className="section zone-warm noise overflow-hidden">
      <Container className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[6%] -top-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.12),transparent_62%)]"
        />

        {/* HEADER — heading + one concise line + link. */}
        <div className="relative max-w-3xl">
          <SectionHeading
            number="01"
            eyebrow={aboutCopy.eyebrow}
            title={aboutCopy.heading}
            align="left"
          />
          <motion.p
            variants={fadeSoft}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-6 text-base leading-relaxed text-steel-300 sm:text-lg"
          >
            Among India&rsquo;s top petrochemical distribution houses — moving
            product from producer to plant gate since 2009.
          </motion.p>
          <motion.div
            variants={fadeSoft}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <Link
              href="/about-us"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-medium text-white transition-colors duration-300 hover:text-accord-red focus-visible:outline-none focus-visible:text-accord-red"
            >
              About Accord Chemical
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accord-red transition-transform duration-500 group-hover:translate-x-0.5">
                <ArrowRight size={14} className="text-white" aria-hidden />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* FLOW — four moves on a connecting rail (representational, minimal text) */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-16 lg:mt-20"
        >
          {/* Connecting rail through the icon centres (desktop) */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-accord-red/50 via-white/15 to-accord-red/50 sm:block"
          />
          <ol className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
            {FLOW.map(({ Icon, step, note }, i) => (
              <motion.li
                key={step}
                variants={fadeSoft}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-accord-red/30 bg-ink text-accord-red shadow-[0_0_0_6px_rgba(11,11,13,1)]">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="mt-4 font-mono text-[11px] uppercase tracking-widest text-steel-500">
                  0{i + 1}
                </span>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-white">
                  {step}
                </h3>
                <p className="mt-0.5 text-sm text-steel-400">{note}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* STAT RAIL — open hairline strip, the site's ONLY count-ups. */}
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-10 lg:mt-20 lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(i > 0 && "lg:border-l lg:border-white/10 lg:pl-8")}
            >
              <StatNumber
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
                live
                delay={i * COUNT_STEP}
                duration={COUNT_DURATION}
              />
              {stat.sublabel && (
                <span className="mt-1.5 block font-mono text-xs tracking-widest text-steel-400">
                  {stat.sublabel}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
