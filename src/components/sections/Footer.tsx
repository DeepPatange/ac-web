"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowUp,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { nav, products, siteConfig } from "@/lib/site";
import { fadeUp, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ABOUT_BLURB =
  "Accord Chemical Corporation stands out as one of the largest petrochemical distribution companies — leading in the import, export and indenting of diverse petrochemicals from our Mumbai headquarters.";

const socials = [
  { label: "Facebook", href: siteConfig.social.facebook, Icon: Facebook },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: Linkedin },
] as const;

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

/** Small column heading shared across the footer link groups. */
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
      {children}
    </h3>
  );
}

/** Animated footer link with a subtle slide + red hover. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <motion.span
        className="inline-block"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
      >
        <Link
          href={href}
          className="text-sm text-steel-400 transition-colors duration-300 hover:text-accord-red focus-visible:text-accord-red focus-visible:outline-none"
        >
          {children}
        </Link>
      </motion.span>
    </li>
  );
}

export default function Footer() {
  const { scrollY } = useScroll();
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowTop(latest > 600);
  });

  return (
    <footer
      id="footer"
      className="noise relative overflow-hidden bg-ink text-steel-300"
    >
      {/* Top gradient hairline: red → ember */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accord-red to-accord-ember" />

      {/* Soft red glow at the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 bg-radial-fade blur-2xl"
      />

      {/* Faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:54px_54px] opacity-60 mask-fade-b"
      />

      <Container className="relative z-10">
        {/* ── Top CTA strip — frosted glass panel ─────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 flex flex-col items-start justify-between gap-6 glass-card px-6 py-8 sm:flex-row sm:items-center sm:px-10 sm:py-10"
        >
          <p className="max-w-xl font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
            Ready to move your next{" "}
            <span className="text-gradient-ember">consignment?</span>
          </p>
          <Link
            href="#contact"
            className="group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-accord-red px-7 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_-10px_rgba(225,27,34,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accord-redDark"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Talk to our desk
              <ArrowUp className="h-4 w-4 rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </motion.div>

        {/* ── Main grid ───────────────────────────────────────────── */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
        >
          {/* 1. Brand */}
          <motion.div variants={fadeUp} className="lg:pr-6">
            <Link
              href="#home"
              className="inline-flex items-baseline font-display text-2xl font-bold tracking-tight"
            >
              <span className="text-white">Accord</span>
              <span className="text-accord-red">Chemicals</span>
            </Link>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-steel-400">
              {siteConfig.legalName}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-400">
              {ABOUT_BLURB}
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="glass grid h-10 w-10 place-items-center rounded-full text-steel-200 transition-colors duration-300 hover:border-accord-red/50 hover:bg-accord-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* 2. Products */}
          <motion.div variants={fadeUp}>
            <ColumnTitle>Products</ColumnTitle>
            <ul className="space-y-3">
              {products.map((product) => (
                <FooterLink key={product.name} href="#products">
                  {product.name}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* 3. Quick Links */}
          <motion.div variants={fadeUp}>
            <ColumnTitle>Quick Links</ColumnTitle>
            <ul className="space-y-3">
              {nav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* 4. Contact */}
          <motion.div variants={fadeUp}>
            <ColumnTitle>Contact</ColumnTitle>
            <ul className="space-y-4 text-sm text-steel-400">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accord-red" />
                <address className="not-italic leading-relaxed">
                  {siteConfig.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="group inline-flex items-center gap-3 transition-colors duration-300 hover:text-accord-red focus-visible:outline-none focus-visible:text-accord-red"
                >
                  <Phone className="h-[18px] w-[18px] shrink-0 text-accord-red" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.emailHref}
                  className="group inline-flex items-center gap-3 break-all transition-colors duration-300 hover:text-accord-red focus-visible:outline-none focus-visible:text-accord-red"
                >
                  <Mail className="h-[18px] w-[18px] shrink-0 text-accord-red" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-steel-400">
            © {new Date().getFullYear()} Accord Chemicals. All Rights Reserved. Powered by{" "}
            <span className="text-steel-300">{siteConfig.poweredBy}</span>.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-6">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs text-steel-400 transition-colors duration-300 hover:text-accord-red focus-visible:outline-none focus-visible:text-accord-red"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>

      {/* ── Floating actions ──────────────────────────────────────── */}
      {/* z-40: below the mobile menu (z-50) so it can't bleed over the open menu. */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-3 sm:bottom-8 sm:right-8">
        {/* Back to top — fades in after scrolling */}
        <AnimatePresence>
          {showTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                href="#home"
                aria-label="Back to top"
                className={cn(
                  "glass grid h-11 w-11 place-items-center rounded-full text-steel-200 transition-all duration-300",
                  "hover:scale-110 hover:border-accord-red/60 hover:text-accord-red",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red"
                )}
              >
                <ArrowUp className="h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp — green */}
        <FloatingAction
          href={siteConfig.contact.whatsappHref}
          label="Chat on WhatsApp"
          color="#25D366"
          external
        >
          <MessageCircle className="h-6 w-6" />
        </FloatingAction>

        {/* Email — brand red */}
        <FloatingAction
          href={siteConfig.contact.emailHref}
          label="Email us"
          color="#E11B22"
        >
          <Mail className="h-6 w-6" />
        </FloatingAction>
      </div>
    </footer>
  );
}

/** Round chip floating CTA with a hover scale + pulse ring. */
function FloatingAction({
  href,
  label,
  color,
  external = false,
  children,
}: {
  href: string;
  label: string;
  color: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative grid place-items-center overflow-hidden rounded-full text-white backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      style={{
        // Translucent brand fill over backdrop-blur reads as frosted glass
        // while the saturated hue keeps WhatsApp green / Email red recognizable.
        backgroundColor: `${color}e6`,
        height: "3.25rem",
        width: "3.25rem",
        border: `1px solid ${color}`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.35), 0 12px 30px -10px ${color}cc`,
      }}
    >
      {/* Pulse ring */}
      <span
        aria-hidden
        className="absolute inset-0 animate-pulse-ring rounded-full"
        style={{ backgroundColor: color }}
      />
      {/* Frosted top highlight sheen */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent"
      />
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
