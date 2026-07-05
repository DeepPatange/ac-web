"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Factory,
  Globe2,
  MapPin,
  Quote,
  Target,
  Telescope,
  TrendingUp,
  Workflow,
} from "lucide-react";
import Container from "@/components/ui/Container";
import StatNumber from "@/components/ui/StatNumber";
import { FOUNDING_YEAR, aboutCopy, stats } from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ============================================================================
   /about-us — a dedicated, editorial About page. Varied blocks (fact rail,
   story + photo, milestone timeline, stats strip, capability rows, vision /
   mission quotes, locations band, CTA) — no orbit-ring circle.
   ========================================================================== */

const AT_A_GLANCE = [
  { label: "Established", value: `${FOUNDING_YEAR}` },
  { label: "Headquarters", value: "Mumbai, India" },
  { label: "Branch offices", value: "Ahmedabad · Gandhidham" },
  { label: "Global reach", value: "58+ countries" },
];

const MILESTONES = [
  {
    year: "2009",
    title: "The desk opens",
    desc: "Founded in Mumbai and moving 4,500 metric tons in its first year — built on a foundation of trust and transparency.",
  },
  {
    year: "2014",
    title: "Accord Chemcorp Pvt. Ltd.",
    desc: "A sister company established to broaden sourcing and the product portfolio, serving industrial applications more comprehensively.",
  },
  {
    year: "Today",
    title: "110,000+ MT a year",
    desc: "A colossal distribution network across India and 58+ countries, backed by branch offices in Ahmedabad and Gandhidham.",
  },
];

const CAPABILITIES = aboutCopy.pillars.map((p, i) => ({
  ...p,
  Icon: [Factory, TrendingUp, Workflow][i] ?? Workflow,
}));

const LOCATIONS = [
  { city: "Mumbai", role: "Headquarters", note: "Maharashtra" },
  { city: "Ahmedabad", role: "Branch office", note: "Gujarat" },
  { city: "Gandhidham", role: "Branch office", note: "Gujarat" },
];

/* -------------------------------------------------------------------------- */
/*  Hero — editorial headline + a hairline "at a glance" rail                   */
/* -------------------------------------------------------------------------- */

function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6%] -top-[10%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.16),transparent_62%)]"
      />
      <Container className="relative pb-6 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-steel-400"
        >
          <Link href="/" className="transition-colors hover:text-accord-red">
            Home
          </Link>
          <span className="px-2 text-steel-500">/</span>
          <span className="text-steel-300">About Us</span>
        </nav>

        <div className="mt-10 grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
            className="lg:col-span-7"
          >
            <motion.p
              variants={fadeSoft}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red"
            >
              {aboutCopy.eyebrow}
            </motion.p>
            <motion.h1
              variants={fadeSoft}
              className="type-hero text-balance text-white"
            >
              One desk from indent to delivery.
            </motion.h1>
            <motion.p
              variants={fadeSoft}
              className="mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
            >
              Among India&rsquo;s top petrochemical distribution houses —
              importing, exporting and indenting a diverse basket of
              petrochemicals, and moving them from producer to plant gate.
            </motion.p>
          </motion.div>

          {/* Hairline fact rail — not a card. */}
          <motion.dl
            variants={stagger(0.08)}
            initial="hidden"
            animate="show"
            className="lg:col-span-5"
          >
            {AT_A_GLANCE.map((f) => (
              <motion.div
                key={f.label}
                variants={fadeSoft}
                className="flex items-baseline justify-between gap-6 border-t border-white/10 py-3.5 first:border-t-0"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel-500">
                  {f.label}
                </dt>
                <dd className="text-right text-[15px] font-medium text-white">
                  {f.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Story — photo + prose, offset editorial                                     */
/* -------------------------------------------------------------------------- */

function AboutStory() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={fadeSoft}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="group relative overflow-hidden rounded-3xl ring-1 ring-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1100&h=1200&fit=crop&crop=entropy&auto=format&q=74"
              alt="Bulk chemical storage terminal at an Indian port"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
            />
            <div className="absolute bottom-5 left-6">
              <p className="font-mono text-xs tracking-widest text-white/80">
                MUMBAI · SINCE {FOUNDING_YEAR}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-white">
                Trust &amp; transparency, in bulk.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.h2
              variants={fadeSoft}
              className="type-section text-balance text-white"
            >
              A colossal network, one accountable desk.
            </motion.h2>
            {aboutCopy.body.map((p) => (
              <motion.p
                key={p}
                variants={fadeSoft}
                className="mt-5 text-base leading-relaxed text-steel-300"
              >
                {p}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Timeline — connected milestone nodes (the signature non-boxy block)         */
/* -------------------------------------------------------------------------- */

function AboutTimeline() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            The journey
          </p>
          <h2 className="type-section text-balance text-white">
            From 4,500 tonnes to a global desk.
          </h2>
        </div>

        <motion.ol
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8"
        >
          {/* Connecting line (desktop) */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-accord-red/60 via-white/15 to-transparent md:block"
          />
          {MILESTONES.map((m) => (
            <motion.li key={m.year} variants={fadeSoft} className="relative">
              <span
                aria-hidden
                className="block h-3.5 w-3.5 rounded-full bg-accord-red shadow-[0_0_14px_2px_rgba(225,27,34,0.55)] ring-4 ring-ink"
              />
              <p className="mt-5 font-display text-3xl font-semibold text-white">
                {m.year}
              </p>
              <h3 className="mt-2 text-[15px] font-semibold uppercase tracking-wide text-accord-red">
                {m.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-steel-300">
                {m.desc}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats strip — the site's count-ups, dividers not boxes                      */
/* -------------------------------------------------------------------------- */

function AboutStats() {
  return (
    <section className="section-quiet">
      <Container>
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="glass-card relative overflow-hidden p-8 sm:p-10"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
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
                  delay={i * 0.12}
                  duration={1.4}
                />
                {stat.sublabel && (
                  <span className="mt-1.5 block font-mono text-xs tracking-widest text-steel-400">
                    {stat.sublabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Capabilities — horizontal feature rows with ghost numerals                  */
/* -------------------------------------------------------------------------- */

function AboutCapabilities() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            Why Accord
          </p>
          <h2 className="type-section text-balance text-white">
            What clients actually buy is certainty.
          </h2>
        </div>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 flex flex-col"
        >
          {CAPABILITIES.map(({ title, desc, Icon }, i) => (
            <motion.div
              key={title}
              variants={fadeSoft}
              className="group grid grid-cols-[auto_1fr] items-start gap-5 border-t border-white/10 py-7 transition-colors duration-300 last:border-b hover:bg-white/[0.02] sm:grid-cols-[6rem_auto_1fr] sm:gap-8"
            >
              <span className="hidden font-display text-4xl font-semibold text-white/10 transition-colors duration-300 group-hover:text-accord-red/40 sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accord-red/25 bg-accord-red/[0.14] text-accord-red transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h3 className="type-card text-white">{title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-steel-300 sm:text-[15px]">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Vision & Mission — oversized-quote editorial panels                         */
/* -------------------------------------------------------------------------- */

function AboutVisionMission() {
  const items = [
    { label: "Vision", text: aboutCopy.vision, Icon: Telescope },
    { label: "Mission", text: aboutCopy.mission, Icon: Target },
  ];
  return (
    <section className="section-quiet">
      <Container>
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 md:grid-cols-2"
        >
          {items.map(({ label, text, Icon }) => (
            <motion.figure
              key={label}
              variants={fadeSoft}
              className="glass-card relative overflow-hidden p-8 sm:p-10"
            >
              {/* Left accent bar */}
              <span
                aria-hidden
                className="absolute inset-y-8 left-0 w-[3px] rounded-full bg-gradient-to-b from-accord-red to-accord-redDark"
              />
              <Quote
                aria-hidden
                className="absolute -right-3 -top-3 h-24 w-24 rotate-180 text-white/[0.04]"
                strokeWidth={1}
                fill="currentColor"
              />
              <div className="relative flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accord-red/25 bg-accord-red/[0.14] text-accord-red">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <figcaption className="text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
                  {label}
                </figcaption>
              </div>
              <blockquote className="relative mt-5 text-lg leading-relaxed text-steel-100 sm:text-xl">
                {text}
              </blockquote>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Locations — horizontal pins band                                            */
/* -------------------------------------------------------------------------- */

function AboutLocations() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="flex items-center gap-3">
          <Globe2 className="h-4 w-4 text-accord-red" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            Where we operate
          </p>
        </div>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-3"
        >
          {LOCATIONS.map(({ city, role, note }, i) => (
            <motion.div
              key={city}
              variants={fadeSoft}
              className="group relative bg-ink p-7 transition-colors duration-300 hover:bg-white/[0.02] sm:p-8"
            >
              <div className="flex items-center gap-2.5">
                {i === 0 ? (
                  <Building2 className="h-5 w-5 text-accord-red" aria-hidden />
                ) : (
                  <MapPin className="h-5 w-5 text-accord-red" aria-hidden />
                )}
                <span className="font-display text-xl font-semibold text-white">
                  {city}
                </span>
              </div>
              <p className="mt-3 text-sm text-steel-300">{role}</p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-steel-500">
                {note}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function AboutContent() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutTimeline />
      <AboutStats />
      <AboutCapabilities />
      <AboutVisionMission />
      <AboutLocations />
    </>
  );
}
