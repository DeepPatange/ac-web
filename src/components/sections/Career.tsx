"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, LineChart, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   Career — an honest "join us" band (no fabricated job listings). Invites
   applications by email; the mailto is built from the real contact address.
   -------------------------------------------------------------------------- */

const POINTS = [
  {
    icon: LineChart,
    title: "Grow with us",
    body: "4,500 to 110,000+ tonnes a year since 2009 — a desk that keeps scaling.",
  },
  {
    icon: Globe2,
    title: "Global exposure",
    body: "Work across 58+ countries, from sourcing at origin to last-mile delivery.",
  },
  {
    icon: Users,
    title: "Learn the trade",
    body: "Sales, sourcing, logistics, compliance and operations under one roof.",
  },
];

const careersMailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
  "Career enquiry — Accord Chemical Corporation"
)}`;

export default function Career() {
  return (
    <section id="career" className="section-quiet zone-cool">
      <Container>
        <div className="glass-card relative overflow-hidden p-8 sm:p-12 lg:p-16">
          {/* soft brand glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-radial-fade opacity-60"
          />

          <SectionHeading
            eyebrow="Careers"
            title="Build a career in global chemical trade"
            intro="Accord is always looking for people who want to move real cargo across the world — in sales, sourcing, logistics, compliance or operations. If that's you, send your CV and we'll be in touch."
          />

          <motion.ul
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="relative mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {POINTS.map(({ icon: Icon, title, body }) => (
              <motion.li key={title} variants={fadeSoft} className="flex flex-col">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accord-red/25 bg-accord-red/[0.14]">
                  <Icon
                    className="h-[1.125rem] w-[1.125rem] text-accord-red"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
                <h3 className="type-card mt-4 text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-300">{body}</p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeSoft}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            transition={{ delay: 0.15 }}
            className="relative mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <a
              href={careersMailto}
              className={cn(
                "group inline-flex items-center gap-2.5 rounded-xl bg-accord-red py-2.5 pl-5 pr-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-accord-redDark",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              )}
            >
              Send your CV
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white">
                <ArrowUpRight
                  size={14}
                  className="text-accord-red transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </a>
            <span className="font-mono text-xs tracking-widest text-steel-400">
              {siteConfig.contact.email}
            </span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
