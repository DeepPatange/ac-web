"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { nav, cta, hero, siteConfig } from "@/lib/site";
import { TextRoll } from "@/components/ui/RollButton";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const pathname = usePathname();

  /* In-page section links are "#id" anchors. On any page other than home,
     rewrite them to "/#id" so they route home and then scroll — otherwise the
     anchor points at a section that doesn't exist on this route. Real routes
     (e.g. "/about-us") pass through unchanged. */
  const resolve = (href: string) =>
    href.startsWith("#") && pathname !== "/" ? `/${href}` : href;

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    // Auto-hide: once past the hero edge, hide on scroll-down, reveal on
    // scroll-up. Always visible near the top and while the menu is open.
    const prev = lastY.current;
    if (open || y < 140) setHidden(false);
    else if (y > prev + 4) setHidden(true);
    else if (y < prev - 4) setHidden(false);
    lastY.current = y;
  });

  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll while the menu is open; Escape closes it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return () => {
      document.body.style.overflow = "";
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <motion.header
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 mx-auto w-full max-w-[1560px] px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/10 px-2 py-2 pl-3 transition-[background-color,box-shadow] duration-500",
          scrolled
            ? "bg-ink/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),0_26px_64px_-32px_rgba(0,0,0,0.95)]"
            : "bg-ink/45 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_18px_48px_-32px_rgba(0,0,0,0.85)]"
        )}
      >
        {/* Subtle top sheen for a refined glass edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/* LEFT — full brand lockup (mark + wordmark are one asset). */}
        <Link
          href={resolve("#home")}
          aria-label={`${siteConfig.name} — home`}
          className={cn(
            "group/logo relative flex items-center rounded-xl",
            focusRing
          )}
        >
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={219}
            height={99}
            priority
            className="h-9 w-auto transition-transform duration-500 group-hover/logo:scale-105 sm:h-10"
          />
        </Link>

        {/* CENTER — nav links with a soft hover pill */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 xl:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={resolve(item.href)}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium text-steel-300 transition-colors duration-300 hover:bg-white/[0.07] hover:text-white",
                  focusRing
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT — primary CTA (desktop) */}
        <Link
          href={resolve(cta.primary.href)}
          className={cn(
            "group hidden items-center gap-2.5 rounded-xl bg-accord-red py-2 pl-5 pr-2 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-accord-redDark xl:flex",
            focusRing
          )}
        >
          <TextRoll text={cta.primary.label} />
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white">
            <ArrowRight
              size={14}
              className="text-accord-red transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
            />
          </span>
        </Link>

        {/* MOBILE / TABLET — toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "flex items-center gap-2 rounded-xl bg-accord-red px-4 py-2 text-[13px] font-medium text-white xl:hidden",
            focusRing
          )}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY — portalled to <body> so z-50 isn't trapped */}
      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-50 xl:hidden",
              open ? "pointer-events-auto" : "pointer-events-none"
            )}
            aria-hidden={!open}
          >
            <div
              onClick={close}
              className={cn(
                "absolute inset-0 bg-black/70 transition-opacity duration-500",
                open ? "opacity-100" : "opacity-0"
              )}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className={cn(
                "glass-strong absolute inset-x-0 bottom-0 mx-3 mb-3 p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                open ? "translate-y-0" : "translate-y-full"
              )}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-steel-300">
                <span className="h-1.5 w-1.5 rounded-full bg-accord-red" />
                {hero.eyebrow}
              </span>

              <ul className="mt-6 flex flex-col gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={resolve(item.href)}
                      onClick={close}
                      tabIndex={open ? 0 : -1}
                      className={cn(
                        "block rounded-lg py-2 text-[28px] font-medium leading-[32px] text-white",
                        focusRing
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={resolve(cta.primary.href)}
                onClick={close}
                tabIndex={open ? 0 : -1}
                className={cn(
                  "group mt-6 flex items-center justify-between rounded-full bg-accord-red py-2 pl-6 pr-2 text-[14px] font-medium text-white transition-colors hover:bg-accord-redDark",
                  focusRing
                )}
              >
                <TextRoll text={cta.primary.label} />
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <ArrowRight
                    size={16}
                    className="text-accord-red transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
                  />
                </span>
              </Link>
            </div>
          </div>,
          document.body
        )}
    </motion.header>
  );
}
