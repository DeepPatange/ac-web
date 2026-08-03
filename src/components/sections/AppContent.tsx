"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Handshake,
  LineChart,
  MessagesSquare,
  Newspaper,
  Ship,
  Star,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import StoreBadges from "@/components/ui/StoreBadges";
import { appMeta } from "@/lib/site";
import { fadeSoft, inView, stagger } from "@/lib/motion";

/* ============================================================================
   /app — landing page for Accord Interact, the company's Android trading app.
   Content + screenshots are the client's own Google Play listing.
   ========================================================================== */

const ICONS: Record<string, LucideIcon> = {
  LineChart,
  Handshake,
  Briefcase,
  Ship,
  MessagesSquare,
  Newspaper,
};

/* -------------------------------------------------------------------------- */
/*  Hero                                                                        */
/* -------------------------------------------------------------------------- */

function AppHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6%] -top-[12%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.18),transparent_62%)]"
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
          <span className="text-steel-300">Accord Interact</span>
        </nav>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Copy */}
          <motion.div variants={stagger(0.1)} initial="hidden" animate="show">
            <motion.div
              variants={fadeSoft}
              className="flex items-center gap-3.5"
            >
              <span className="relative h-14 w-14 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src="/app/icon.png"
                  alt={`${appMeta.name} app icon`}
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
                Accord Interact · Mobile app
              </span>
            </motion.div>

            <motion.h1
              variants={fadeSoft}
              className="mt-6 font-display font-bold leading-[1.03] tracking-[-0.03em] text-white text-[clamp(2.7rem,5.8vw,4.25rem)]"
            >
              The trading desk,
              <br />
              in your pocket.
            </motion.h1>

            <motion.p
              variants={fadeSoft}
              className="mt-6 max-w-xl text-lg leading-relaxed text-steel-300 sm:text-xl"
            >
              {appMeta.tagline}
            </motion.p>

            {/* Rating / installs / category */}
            <motion.dl
              variants={fadeSoft}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <div>
                <dt className="flex items-center gap-1.5 font-display text-[1.9rem] font-semibold text-white">
                  {appMeta.rating}
                  <Star className="h-5 w-5 fill-accord-red text-accord-red" aria-hidden />
                </dt>
                <dd className="font-mono text-[11px] uppercase tracking-widest text-steel-400">
                  Rating
                </dd>
              </div>
              <div>
                <dt className="font-display text-[1.9rem] font-semibold text-white">
                  {appMeta.downloads}
                </dt>
                <dd className="font-mono text-[11px] uppercase tracking-widest text-steel-400">
                  Downloads
                </dd>
              </div>
              <div>
                <dt className="font-display text-[1.9rem] font-semibold text-white">
                  {appMeta.category}
                </dt>
                <dd className="font-mono text-[11px] uppercase tracking-widest text-steel-400">
                  Category
                </dd>
              </div>
            </motion.dl>

            <motion.div variants={fadeSoft} className="mt-8">
              <StoreBadges />
            </motion.div>
          </motion.div>

          {/* Phone */}
          <motion.div
            variants={fadeSoft}
            initial="hidden"
            animate="show"
            className="relative mx-auto w-full max-w-[19rem]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.14),transparent_65%)]"
            />
            <PhoneFrame src={appMeta.screens[1].src} priority />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phone frame                                                                 */
/* -------------------------------------------------------------------------- */

function PhoneFrame({
  src,
  priority = false,
  className = "",
}: {
  src: string;
  priority?: boolean;
  className?: string;
}) {
  // Fixed dark bezel (a real phone is dark) so the mockup reads on BOTH the dark
  // and the white theme — a theme token here would go near-white on the light
  // site and the bezel would vanish.
  return (
    <div
      className={`relative aspect-[9/19.5] overflow-hidden rounded-[2.2rem] border border-black/50 bg-[#141418] p-2 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.7rem]">
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, 60vw"
          className="object-cover object-top"
          priority={priority}
        />
      </div>
      {/* notch */}
      <span
        aria-hidden
        className="absolute left-1/2 top-2 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-[#141418]"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features                                                                    */
/* -------------------------------------------------------------------------- */

function AppFeatures() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            What it does
          </p>
          <h2 className="type-section text-balance text-white">
            One app for the whole trade.
          </h2>
        </div>

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {appMeta.features.map((f) => {
            const Icon = ICONS[f.icon] ?? LineChart;
            return (
              <motion.div
                key={f.title}
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
                <h3 className="type-card mt-5 text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-300">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screenshots                                                                 */
/* -------------------------------------------------------------------------- */

function AppScreens() {
  return (
    <section className="section-quiet">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
            A look inside
          </p>
          <h2 className="type-section text-balance text-white">
            Built for how the desk actually works.
          </h2>
        </div>

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4"
        >
          {appMeta.screens.map((s) => (
            <motion.figure key={s.src} variants={fadeSoft}>
              <PhoneFrame src={s.src} />
              <figcaption className="mt-4 text-center text-sm leading-snug text-steel-400">
                {s.label}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Roles + download CTA                                                        */
/* -------------------------------------------------------------------------- */

function AppRolesCta() {
  return (
    <section className="section-quiet">
      <Container>
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 sm:p-12"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.2),transparent_65%)]"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
                Personalised for your role
              </p>
              <h2 className="type-section text-balance text-white">
                Every user gets a tailored experience.
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {appMeta.roles.map((r) => (
                  <li
                    key={r}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-sm text-steel-200"
                  >
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-steel-400">
                Free to download · {appMeta.rating}★ · {appMeta.downloads} installs
                · Updated {appMeta.updated}.
              </p>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-center">
              <span className="relative h-20 w-20 overflow-hidden rounded-3xl ring-1 ring-white/10">
                <Image
                  src="/app/icon.png"
                  alt={`${appMeta.name} app icon`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
              <StoreBadges />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function AppContent() {
  return (
    <>
      <AppHero />
      <AppFeatures />
      <AppScreens />
      <AppRolesCta />
    </>
  );
}
