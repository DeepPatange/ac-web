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

/** The Google Play "triangle" glyph in its brand colours, drawn inline. */
function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <path fill="#00D3FF" d="M47 24c-6 4-10 11-10 20v424c0 9 4 16 10 20l236-232L47 24z" />
      <path fill="#00F076" d="M47 24c4-3 10-3 16 1l318 181-72 71L47 24z" />
      <path fill="#FFCE00" d="M381 206l73 42c16 9 16 27 0 36l-73 42-72-80 72-80z" />
      <path fill="#FF3A44" d="M309 286l72 71-318 181c-6 4-12 4-16 1l262-253z" />
    </svg>
  );
}

/** Reusable "Get it on Google Play" badge → the Play Store listing. */
function PlayBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={appMeta.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get ${appMeta.name} on Google Play`}
      className={`group inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${className}`}
    >
      <PlayGlyph className="h-7 w-7 shrink-0" />
      <span className="text-left leading-tight">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-steel-400">
          Get it on
        </span>
        <span className="block font-display text-lg font-semibold text-white">
          Google Play
        </span>
      </span>
    </a>
  );
}

/** Apple logo glyph. */
function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" className={className} fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/** "Download on the App Store" badge → the Apple App Store listing. */
function AppStoreBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={appMeta.appStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Download ${appMeta.name} on the App Store`}
      className={`group inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${className}`}
    >
      <AppleGlyph className="h-7 w-7 shrink-0 text-white" />
      <span className="text-left leading-tight">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-steel-400">
          Download on the
        </span>
        <span className="block font-display text-lg font-semibold text-white">
          App Store
        </span>
      </span>
    </a>
  );
}

/** Both store badges, side by side. */
function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <PlayBadge />
      <AppStoreBadge />
    </div>
  );
}

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
          <span className="text-steel-300">App</span>
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
