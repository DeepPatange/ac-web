"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  Fuel,
  Route,
  ShieldCheck,
  Ship,
  Truck,
  Warehouse,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { cta } from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ============================================================================
   /services — a themed, dramatised replica of accordchemicals.com/services.
   Hero → intro (photo + copy + port chips) → 5 comprehensive-service cards →
   animated "Logistical Presence" flow diagram (Ports → Logistics → Warehouses).
   ========================================================================== */

const PORTS = ["Kandla", "Hazira", "JNPT", "Mundra", "Mumbai", "Cochin"];
const WAREHOUSES = ["Bhiwandi", "Ahmedabad", "Cochin", "Gandhidham"];

const SERVICES = [
  {
    icon: ClipboardCheck,
    title: "CHA & Surveyor",
    desc: "Appointment of Customs House Agent and cargo surveyor on behalf of our customers.",
  },
  {
    icon: Fuel,
    title: "Port Storage Tanks",
    desc: "Arranging dedicated and commingled bulk storage tanks at the port for imported chemicals.",
  },
  {
    icon: FileSearch,
    title: "Survey & Insurance",
    desc: "Pre-discharge and post-discharge survey and insurance for the consignment at the port.",
  },
  {
    icon: Truck,
    title: "Insurance & Delivery",
    desc: "Arranging cargo insurance and onward delivery of the consignment to your gate.",
  },
  {
    icon: Route,
    title: "Logistics Support",
    desc: "End-to-end logistics support for every consignment across our PAN-India network.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

function OrbitRings() {
  const reduced = useReducedMotion();
  const spin = (dur: number, dir = 1) =>
    reduced
      ? {}
      : {
          animate: { rotate: 360 * dir },
          transition: { duration: dur, ease: "linear", repeat: Infinity },
        };
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[-8%] top-1/2 hidden h-[36rem] w-[36rem] -translate-y-1/2 lg:block"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.22),transparent_62%)]" />
      <motion.div
        className="absolute inset-0 rounded-full border border-accord-red/25 [border-style:dashed]"
        {...spin(60)}
      />
      <motion.div
        className="absolute inset-[12%] rounded-full border border-white/10"
        {...spin(45, -1)}
      />
      <motion.div
        className="absolute inset-[26%] rounded-full border border-accord-red/30 [border-style:dashed]"
        {...spin(30)}
      />
      <div className="absolute inset-[40%] rounded-full bg-[radial-gradient(circle,rgba(255,90,60,0.4),transparent_70%)] blur-md" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accord-red shadow-[0_0_24px_6px_rgba(225,27,34,0.6)]" />
    </div>
  );
}

function ServicesHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <OrbitRings />
      <Container className="relative pb-6 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-steel-400"
        >
          <Link href="/" className="transition-colors hover:text-accord-red">
            Home
          </Link>
          <span className="px-2 text-steel-500">/</span>
          <span className="text-steel-300">Services</span>
        </nav>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-3xl"
        >
          <motion.p
            variants={fadeSoft}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red"
          >
            What we handle
          </motion.p>
          <motion.h1
            variants={fadeSoft}
            className="type-hero text-white"
          >
            Services
          </motion.h1>
          <motion.p
            variants={fadeSoft}
            className="mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
          >
            One of India&rsquo;s largest petrochemical distribution houses —
            specialising in the import, export, distribution and indenting of
            diverse petrochemicals, and moving them seamlessly from port to plant
            gate.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Intro — photo + copy + port chips                                          */
/* -------------------------------------------------------------------------- */

function ServicesIntro() {
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
            {/* Below the fold, so no `priority`. `sizes` mirrors the real slot:
                half the 1216px content column from lg up, full width under it. */}
            <Image
              src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&auto=format&q=70"
              alt="Imported chemical containers staged at a port terminal"
              width={1200}
              height={900}
              sizes="(min-width: 1280px) 576px, (min-width: 1024px) 45vw, 92vw"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
            />
            <div className="absolute bottom-4 left-5 font-mono text-xs tracking-widest text-white/80">
              PORT · BULK · BONDED
            </div>
          </motion.div>

          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.p
              variants={fadeSoft}
              className="text-base leading-relaxed text-steel-300"
            >
              Accord Chemical Corporation is one of the largest petrochemical
              distribution companies — specialising in the import, export,
              distribution and indenting of diverse petrochemicals. As your
              trusted partner, we ensure seamless transport, catering to the
              dynamic demands of the industry nationwide.
            </motion.p>
            <motion.p
              variants={fadeSoft}
              className="mt-4 text-base leading-relaxed text-steel-300"
            >
              A decade-long industry standing, complemented by a vast PAN-India
              supply-chain network, earns us a strategic advantage. Dedicated and
              commingled bulk storage tanks at multiple ports let us extend
              logistics support for imported bulk chemicals to our clients.
            </motion.p>

            <motion.div variants={fadeSoft} className="mt-7">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-steel-400">
                Storage & discharge ports
              </p>
              <div className="flex flex-wrap gap-2">
                {["Kandla", "JNPT – Nhava Sheva", "Hazira", "Mumbai"].map(
                  (port) => (
                    <span
                      key={port}
                      className="inline-flex items-center gap-2 rounded-full border border-accord-red/25 bg-accord-red/[0.08] px-3.5 py-1.5 text-sm text-steel-200"
                    >
                      <Ship className="h-3.5 w-3.5 text-accord-red" aria-hidden />
                      {port}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Comprehensive services — 5 cards                                           */
/* -------------------------------------------------------------------------- */

function ServicesGrid() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            End to end
          </p>
          <h2 className="type-section text-balance text-white">
            Our comprehensive services encompass
          </h2>
        </div>

        <motion.ul
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map(({ icon: Icon, title, desc }, i) => (
            <motion.li
              key={title}
              variants={fadeSoft}
              className="group glass-card relative overflow-hidden p-6 transition-colors duration-300 hover:border-white/25"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accord-red to-accord-ember transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accord-red/25 bg-accord-red/[0.14] text-accord-red transition-transform duration-500 group-hover:-translate-y-0.5">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="font-mono text-sm tracking-widest text-steel-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="type-card relative mt-5 text-white">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-steel-400">
                {desc}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Logistical Presence — animated flow diagram                                */
/* -------------------------------------------------------------------------- */

/** A central chain node (Ports / Logistics / Warehouse). */
function ChainNode({
  x,
  label,
  primary = false,
}: {
  x: number;
  label: string;
  primary?: boolean;
}) {
  const w = primary ? 150 : 148;
  const h = primary ? 100 : 92;
  return (
    <g>
      <motion.rect
        x={x - w / 2}
        y={320 - h / 2}
        width={w}
        height={h}
        rx={18}
        fill={primary ? "rgba(225,27,34,0.12)" : "rgba(255,255,255,0.035)"}
        stroke={primary ? "#E11B22" : "rgba(255,255,255,0.14)"}
        strokeWidth={primary ? 2 : 1.25}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.55, margin: "0px 0px -12% 0px" }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{ transformOrigin: `${x}px 320px` }}
      />
      <text
        x={x}
        y={320}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white font-display"
        style={{ fontSize: primary ? 16.5 : 15.5, fontWeight: 600, letterSpacing: "0.01em" }}
      >
        {label.split(" ").map((word, i, arr) => (
          <tspan
            key={word}
            x={x}
            dy={i === 0 ? (arr.length > 1 ? "-0.5em" : "0.05em") : "1.1em"}
          >
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function FlowDiagram() {
  const reduced = useReducedMotion();
  const drawn = reduced ? { pathLength: 1 } : { pathLength: 1 };
  const draw = (delay: number) => ({
    initial: { pathLength: reduced ? 1 : 0, opacity: 0.9 },
    whileInView: drawn,
    // Trigger later — only once the diagram is well into view (bottom margin
    // pulled up) so the lines draw as you arrive, not before you get there.
    viewport: { once: true, amount: 0.55, margin: "0px 0px -12% 0px" },
    transition: { duration: reduced ? 0 : 1.1, ease: "easeInOut", delay },
  });

  // Left port rows (6) and right warehouse rows (4), evenly distributed.
  const portY = PORTS.map((_, i) => 70 + i * 100); // 70..570
  const whY = WAREHOUSES.map((_, i) => 130 + i * 120); // 130..490

  return (
    <svg
      viewBox="0 0 1160 640"
      className="h-auto w-full"
      role="img"
      aria-label="Logistical presence: source ports feed the logistics hub, which distributes to regional warehouses."
    >
      <defs>
        <linearGradient id="svc-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF5A3C" />
          <stop offset="100%" stopColor="#E11B22" />
        </linearGradient>
      </defs>

      {/* Ports → PORTS node */}
      {portY.map((y, i) => (
        <g key={`p-${i}`}>
          <motion.path
            d={`M 150 ${y} C 250 ${y}, 300 320, 346 320`}
            fill="none"
            stroke="url(#svc-line)"
            strokeWidth={1.5}
            strokeOpacity={0.7}
            {...draw(0.05 * i)}
          />
          <circle cx={150} cy={y} r={4} fill="#E11B22" />
          <text
            x={138}
            y={y}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-steel-200 font-mono"
            style={{ fontSize: 17, letterSpacing: "0.04em" }}
          >
            {PORTS[i]}
          </text>
        </g>
      ))}

      {/* Central chain connectors */}
      <motion.path
        d="M 498 320 L 511 320"
        stroke="url(#svc-line)"
        strokeWidth={2.5}
        fill="none"
        markerEnd="url(#arrow)"
        {...draw(0.45)}
      />
      <motion.path
        d="M 679 320 L 692 320"
        stroke="url(#svc-line)"
        strokeWidth={2.5}
        fill="none"
        markerEnd="url(#arrow)"
        {...draw(0.55)}
      />
      <defs>
        <marker
          id="arrow"
          markerWidth="9"
          markerHeight="9"
          refX="6"
          refY="4.5"
          orient="auto"
        >
          <path d="M1,1 L7,4.5 L1,8" fill="none" stroke="#E11B22" strokeWidth="1.6" />
        </marker>
      </defs>

      {/* Nodes */}
      <ChainNode x={420} label="Ports" />
      <ChainNode x={600} label="Logistical Presence" primary />
      <ChainNode x={780} label="Warehouse" />

      {/* WAREHOUSE node → warehouses */}
      {whY.map((y, i) => (
        <g key={`w-${i}`}>
          <motion.path
            d={`M 854 320 C 900 320, 950 ${y}, 1010 ${y}`}
            fill="none"
            stroke="url(#svc-line)"
            strokeWidth={1.5}
            strokeOpacity={0.7}
            {...draw(0.6 + 0.06 * i)}
          />
          <circle cx={1010} cy={y} r={4} fill="#E11B22" />
          <text
            x={1022}
            y={y}
            textAnchor="start"
            dominantBaseline="middle"
            className="fill-steel-200 font-mono"
            style={{ fontSize: 17, letterSpacing: "0.04em" }}
          >
            {WAREHOUSES[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Mobile: a simple stacked flow (the SVG diagram is desktop-only). */
function FlowStacked() {
  const Col = ({ title, items }: { title: string; items: string[] }) => (
    <div className="glass-card p-5">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-accord-red">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-steel-200"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <div className="flex flex-col items-stretch gap-3">
      <Col title="Source ports" items={PORTS} />
      <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-accord-red" aria-hidden />
      <div className="glass-card border-accord-red/40 p-5 text-center">
        <p className="font-display text-lg font-semibold text-white">
          Logistical Presence
        </p>
        <p className="mt-1 text-sm text-steel-400">The Accord hub</p>
      </div>
      <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-accord-red" aria-hidden />
      <Col title="Regional warehouses" items={WAREHOUSES} />
    </div>
  );
}

function LogisticalPresence() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            Nationwide
          </p>
          <h2 className="type-section text-balance text-white">
            Logistical presence
          </h2>
          <p className="mt-5 text-base leading-relaxed text-steel-300">
            Cargo lands at India&rsquo;s major ports, moves through the Accord
            logistics hub, and is distributed to regional warehouses — one
            accountable chain from vessel to gate.
          </p>
        </div>

        <div className="mt-14 hidden md:block">
          <FlowDiagram />
        </div>
        <div className="mt-12 md:hidden">
          <FlowStacked />
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-accord-red py-2.5 pl-6 pr-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-accord-redDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {cta.primary.label}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <ArrowRight
                size={15}
                className="text-accord-red transition-transform duration-500 group-hover:-rotate-45"
              />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function ServicesContent() {
  return (
    <>
      <ServicesHero />
      <ServicesIntro />
      <ServicesGrid />
      <LogisticalPresence />
    </>
  );
}
