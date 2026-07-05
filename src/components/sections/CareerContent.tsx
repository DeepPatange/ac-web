"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Calculator,
  GraduationCap,
  HeartHandshake,
  PackageSearch,
  Scale,
  TrendingUp,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";

/* ============================================================================
   /career — themed replica of accordchemicals.com/career. Intro → "Why join
   us" benefits → open roles (each Apply-Now opens the role's real Google Form).
   ========================================================================== */

const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Scale,
    title: "Fair HR Practices",
    desc: "Transparent, equitable policies that give every employee a clear pathway to success.",
  },
  {
    icon: GraduationCap,
    title: "Upskilling Opportunities",
    desc: "Avenues to build competencies and grow your expertise across the trade.",
  },
  {
    icon: Users,
    title: "Access to Leadership",
    desc: "Direct access to leadership for guidance, mentorship and career succession.",
  },
  {
    icon: HeartHandshake,
    title: "Respect & Trust",
    desc: "A people-centric culture, high on positivity, inclusivity and equal opportunity.",
  },
];

/** Open roles — Apply-Now opens each role's live Google Form (client-owned). */
const ROLES: { title: string; icon: LucideIcon; form: string }[] = [
  { title: "Sales", icon: TrendingUp, form: "https://forms.gle/khng8gXR7QdKEQRh7" },
  { title: "Procurement", icon: PackageSearch, form: "https://forms.gle/7LxASRKrPdhwPXwy5" },
  { title: "Business Development", icon: Briefcase, form: "https://forms.gle/bNVUXkosqa1Mc8E39" },
  { title: "Logistics", icon: Truck, form: "https://forms.gle/JWebunnoeZxWb5Xg8" },
  { title: "Accounts", icon: Calculator, form: "https://forms.gle/pqWUVhQs2HmUsWUU8" },
];

const careersMailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
  "Career enquiry — Accord Chemical Corporation"
)}`;

/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[8%] -top-[16%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.18),transparent_62%)]"
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
          <span className="text-steel-300">Career</span>
        </nav>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-3xl"
        >
          <motion.span
            variants={fadeSoft}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accord-red/30 bg-accord-red/[0.1] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accord-red"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accord-red opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accord-red" />
            </span>
            Now hiring · {ROLES.length} open roles
          </motion.span>
          <motion.h1 variants={fadeSoft} className="type-hero text-white">
            Careers
          </motion.h1>
          <motion.p
            variants={fadeSoft}
            className="mt-6 max-w-2xl text-base leading-relaxed text-steel-300 sm:text-lg"
          >
            Enabling our human capital is one of our core principles. As a
            people-centric, process-driven organisation, we run a sustainable
            talent-management framework — a high-energy workplace built on
            inclusivity and equal opportunity, with fair, transparent HR
            practices that help every employee build competencies and plan their
            career progression.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

function Benefits() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            Why join us
          </p>
          <h2 className="type-section text-balance text-white">
            A desk worth building a career on
          </h2>
        </div>
        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <motion.li
              key={title}
              variants={fadeSoft}
              className="group glass-card relative overflow-hidden p-6 transition-colors duration-300 hover:border-white/25"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accord-red to-accord-ember transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accord-red/25 bg-accord-red/[0.14] text-accord-red transition-transform duration-500 group-hover:-translate-y-0.5">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="type-card mt-5 text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">{desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

function OpenRoles() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            Open positions
          </p>
          <h2 className="type-section text-balance text-white">
            Areas where we&rsquo;re hiring
          </h2>
          <p className="mt-5 text-base leading-relaxed text-steel-300">
            Pick a role and apply in minutes — each opens its dedicated
            application form.
          </p>
        </div>

        <motion.ul
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {ROLES.map(({ title, icon: Icon, form }) => (
            <motion.li key={title} variants={fadeSoft}>
              <a
                href={form}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-card relative flex items-center gap-5 overflow-hidden p-6 transition-colors duration-300 hover:border-accord-red/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accord-red/25 bg-accord-red/[0.14] text-accord-red">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="relative flex-1">
                  <span className="type-card block text-white">{title}</span>
                  <span className="mt-0.5 block text-sm text-steel-400">
                    Full-time · Mumbai
                  </span>
                </span>
                <span className="relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accord-red/[0.12] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-accord-red transition-colors duration-300 group-hover:bg-accord-red group-hover:text-white">
                  Apply now
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>

        {/* General application */}
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-steel-400"
        >
          <span>Don&rsquo;t see your role?</span>
          <a
            href={careersMailto}
            className="inline-flex items-center gap-1.5 font-medium text-white underline decoration-accord-red/50 underline-offset-4 transition-colors hover:decoration-accord-red"
          >
            Send your CV to {siteConfig.contact.email}
            <ArrowUpRight className="h-3.5 w-3.5 text-accord-red" aria-hidden />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}

export default function CareerContent() {
  return (
    <>
      <Hero />
      <Benefits />
      <OpenRoles />
    </>
  );
}
