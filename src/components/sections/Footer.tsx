"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import CharReveal from "@/components/ui/CharReveal";
import Container from "@/components/ui/Container";
import TradeArc from "@/components/ui/TradeArc";
import { TextRoll } from "@/components/ui/RollButton";
import { contactMeta, cta, footerCopy, nav, siteConfig } from "@/lib/site";
import { fadeSoft, stagger } from "@/lib/motion";

/**
 * Footer — the page's final flourish (brief §5 Footer, §2.6, §4.1).
 *
 * 1. Red-field CTA band: the palette's ONE inversion. Trade Arcs converge in
 *    the dark strip above the band (red strokes stay legible on ink), the node
 *    lands at the band's edge directly above the CTA, and the headline enters
 *    via CharReveal in .type-hero — its only allowed use outside the hero.
 * 2. Footer proper: deliberately quiet. One-liner, meaningful deep links,
 *    conditional legal slots (CIN/GST render only when confirmed), Itarsia
 *    byline per site.ts, back-to-top button. No social icons while the URLs
 *    are empty. Not pinned; no scroll theatrics beyond the arc scrub.
 *
 * ContactPill measures the site <footer> element to hide near it — this
 * component MUST stay a semantic <footer>.
 */

/** Social slots — icons render ONLY for non-empty URLs (all empty today). */
const SOCIALS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Facebook", href: siteConfig.social.facebook, Icon: Facebook },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: Linkedin },
].filter((s) => Boolean(s.href));

/** Mono micro-heading for the quiet link columns (technical-data voice). */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-steel-400">
      {children}
    </p>
  );
}

/** Quiet footer link — color-only hover (no translate; brief §4.4 chips). */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-steel-400 transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red rounded-sm"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const reduced = useReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);

  // Entry progress for the converging Trade Arcs — scrubbed, transform/opacity
  // only (TradeArc animates pathLength; renders complete under reduced motion).
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "start center"],
  });
  const arcMain = scrollYProgress;
  const arcLate = useTransform(scrollYProgress, [0.18, 1], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-steel-300">
      {/* ══ 1. RED-FIELD CTA BAND — the final flourish ═══════════════════ */}
      <div ref={bandRef}>
        {/* Convergence strip: Trade Arcs draw across the dark boundary and
            meet at a single node above the CTA. Red on ink stays legible;
            red on the red field would not. */}
        <div
          aria-hidden
          className="relative h-28 overflow-visible sm:h-40"
        >
          <TradeArc
            progress={arcMain}
            from={{ x: -2, y: 18 }}
            to={{ x: 50, y: 96 }}
            curve={22}
            nodeAt={1}
            nodeSize={9}
          />
          <TradeArc
            progress={arcMain}
            from={{ x: 102, y: 18 }}
            to={{ x: 50, y: 96 }}
            curve={22}
            showNode={false}
          />
          <TradeArc
            progress={arcLate}
            from={{ x: 12, y: -6 }}
            to={{ x: 50, y: 96 }}
            curve={14}
            strokeWidth={1}
            showNode={false}
            className="opacity-50"
          />
          <TradeArc
            progress={arcLate}
            from={{ x: 88, y: -6 }}
            to={{ x: 50, y: 96 }}
            curve={14}
            strokeWidth={1}
            showNode={false}
            className="opacity-50"
          />
        </div>

        {/* The palette's one inversion: a full-width red field. */}
        <div className="noise relative overflow-hidden bg-gradient-to-b from-accord-red to-accord-redDark">
          {/* Static ember glow continuing the node's landing point. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_65%_at_50%_0%,rgba(255,90,60,0.38),transparent_62%)]"
          />
          {/* Static bottom vignette for depth — never animated. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_115%,rgba(0,0,0,0.30),transparent_58%)]"
          />

          <Container className="relative z-10 flex flex-col items-center gap-10 py-24 text-center sm:py-28 lg:py-32">
            <CharReveal
              as="h2"
              className="type-hero mx-auto max-w-5xl text-balance text-white max-[430px]:text-[2.75rem]"
            >
              {footerCopy.ctaHeadline}
            </CharReveal>

            {/* CTA tier: lift + glow + TextRoll (brief §4.4). Inverted fill so
                the button reads against the red field. */}
            <motion.div
              variants={fadeSoft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
            >
              <Link
                href={cta.desk.href}
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2.5 pl-6 pr-2.5 text-[15px] font-medium text-accord-red shadow-[0_18px_50px_-14px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-14px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accord-red"
              >
                <TextRoll text={cta.desk.label} />
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accord-red">
                  <ArrowRight
                    size={16}
                    className="text-white transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
                  />
                </span>
              </Link>
            </motion.div>
          </Container>
        </div>
      </div>

      {/* ══ 2. FOOTER PROPER — quiet ═════════════════════════════════════ */}
      <Container>
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-12 lg:gap-8"
        >
          {/* Brand + one-liner */}
          <motion.div variants={fadeSoft} className="sm:col-span-2 lg:col-span-5 lg:pr-10">
            <Link
              href="#home"
              className="inline-flex items-baseline font-display text-2xl font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red rounded-sm"
            >
              <span className="text-white">Accord</span>
              <span className="text-accord-red">Chemicals</span>
            </Link>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-steel-400">
              {siteConfig.legalName}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-400">
              {footerCopy.oneLiner}
            </p>
            <Link
              href={cta.secondary.href}
              className="group mt-6 inline-flex items-center gap-2 text-sm text-steel-300 transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red rounded-sm"
            >
              {footerCopy.productsCollapsedLabel}
              <ArrowRight className="h-3.5 w-3.5 text-accord-red transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Socials — only when the client supplies real URLs (none today). */}
            {SOCIALS.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-steel-300 transition-colors duration-300 hover:border-accord-red/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Explore — mirrors the nav's section order exactly. */}
          <motion.nav variants={fadeSoft} aria-label="Footer" className="lg:col-span-3">
            <ColumnLabel>Explore</ColumnLabel>
            <ul className="space-y-3">
              {nav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </motion.nav>

          {/* Contact */}
          <motion.div variants={fadeSoft} className="lg:col-span-4">
            <ColumnLabel>Contact</ColumnLabel>
            <ul className="space-y-4 text-sm text-steel-400">
              <li>
                <a
                  href={siteConfig.contact.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red rounded-sm"
                >
                  <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accord-red" />
                  <address className="not-italic leading-relaxed">
                    {siteConfig.contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="inline-flex items-center gap-3 transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red rounded-sm"
                >
                  <Phone className="h-[18px] w-[18px] shrink-0 text-accord-red" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.emailHref}
                  className="inline-flex items-center gap-3 break-all transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red rounded-sm"
                >
                  <Mail className="h-[18px] w-[18px] shrink-0 text-accord-red" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              {/* Hours — client-input slot; renders only when confirmed. */}
              {contactMeta.hours && (
                <li className="font-mono text-xs tracking-widest text-steel-400">
                  {contactMeta.hours}
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Bottom bar: legal line (mono voice) + byline + back-to-top ── */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-8 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[11px] leading-relaxed tracking-wider text-steel-400">
            © {year} {siteConfig.legalName}. All rights reserved.
            {siteConfig.legal.cin && (
              <span className="whitespace-nowrap"> · CIN {siteConfig.legal.cin}</span>
            )}
            {siteConfig.legal.gst && (
              <span className="whitespace-nowrap"> · GST {siteConfig.legal.gst}</span>
            )}
            <span className="block sm:inline"> · {footerCopy.byline}</span>
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label={footerCopy.backToTop}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-steel-300 transition-colors duration-300 hover:border-accord-red/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red"
          >
            <ArrowUp className="h-3.5 w-3.5 text-accord-red transition-transform duration-300 group-hover:-translate-y-0.5" />
            {footerCopy.backToTop}
          </button>
        </div>
      </Container>
    </footer>
  );
}
