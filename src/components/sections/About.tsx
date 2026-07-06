"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Factory, TrendingUp, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StatNumber from "@/components/ui/StatNumber";
import { aboutCopy, stats } from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Icons for the three pillars, in site.ts copy order. */
const pillarIcons = [Factory, TrendingUp, Workflow] as const;

/* Condensed home-page intro — the full narrative lives on /about-us. */
const HOME_INTRO = [
  "Among India's top petrochemical distribution houses — importing, exporting and indenting a diverse basket of petrochemicals since 2009. Headquartered in Mumbai, with branch offices in Ahmedabad and Gandhidham.",
  "From 4,500 metric tons in year one to 110,000+ MT a year across 58+ countries — producer-direct pricing with in-house clearing, storage, insurance and logistics, so one call covers the consignment.",
];

/* Count-up cascade (brief §4.4) — the site's ONLY count-ups. */
const COUNT_DURATION = 1.4;
const COUNT_STEP = 0.12;

/**
 * 01 — About: the home-page teaser. Asymmetric intro (heading + link | copy),
 * the count-up stats proof band, and three capability pillars. No orbit ring —
 * the full story, timeline and vision/mission live on /about-us.
 */
export default function About() {
  return (
    <section id="about" className="section zone-warm noise overflow-hidden">
      <Container className="relative">
        {/* Soft red glow behind the heading — gradient only, never animated. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[6%] -top-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.12),transparent_62%)]"
        />

        {/* INTRO — heading + link on the left, condensed story on the right. */}
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              number="01"
              eyebrow={aboutCopy.eyebrow}
              title={aboutCopy.heading}
              align="left"
            />
            <motion.div
              variants={fadeSoft}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              <Link
                href="/about-us"
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] py-2.5 pl-5 pr-2.5 text-sm font-medium text-white transition-colors duration-300 hover:border-accord-red/50 hover:bg-accord-red/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                About Accord Chemical
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accord-red">
                  <ArrowRight
                    size={14}
                    className="text-white transition-transform duration-500 group-hover:-rotate-45"
                    aria-hidden
                  />
                </span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="flex flex-col gap-5 lg:col-span-7"
          >
            {HOME_INTRO.map((p) => (
              <motion.p
                key={p}
                variants={fadeSoft}
                className="text-base leading-relaxed text-steel-300 sm:text-lg"
              >
                {p}
              </motion.p>
            ))}
          </motion.div>
        </div>

        {/* STATS PROOF BAND — an open hairline strip (no card), the site's ONLY
            count-ups, cascading left→right. */}
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/10 py-10 lg:mt-20 lg:grid-cols-4"
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

        {/* PILLARS — open columns (no boxes): a red top-rule draws in on hover. */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-20"
        >
          {aboutCopy.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i] ?? Workflow;
            return (
              <motion.div
                key={pillar.title}
                variants={fadeSoft}
                className="group relative pt-6"
              >
                {/* Hairline top rule that reddens on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-white/12"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accord-red to-accord-ember transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accord-red/[0.12] text-accord-red transition-transform duration-500 group-hover:-translate-y-0.5">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-steel-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="type-card mt-5 text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-300">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
