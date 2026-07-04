"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { siteConfig } from "@/lib/site";
import { easeOut } from "@/lib/motion";

/** WhatsApp glyph — recolored via currentColor (brand red when collapsed). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * The ONE persistent floating affordance (brief §7.6). A dark-glass pill,
 * bottom-right, that:
 * - appears only after the visitor scrolls past the hero,
 * - hides while a pinned scene ([data-pinned-scene]) is on screen,
 * - hides as the footer approaches,
 * - keeps platform-green strictly INSIDE its expanded state.
 *
 * The WhatsApp deep link comes from siteConfig — no hardcoded numbers.
 */
export default function ContactPill() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Document-space geometry, measured (not per-frame) so the scroll handler
  // stays pure arithmetic.
  const metrics = useRef({
    heroEnd: 720,
    footerTop: Number.POSITIVE_INFINITY,
    pins: [] as { top: number; bottom: number }[],
  });

  const measure = useCallback(() => {
    if (typeof window === "undefined") return;
    const scrollY = window.scrollY;
    const hero = document.getElementById("home");
    const heroEnd = hero
      ? hero.getBoundingClientRect().top + scrollY + hero.offsetHeight * 0.7
      : window.innerHeight * 0.7;
    const footer = document.querySelector("footer");
    const footerTop = footer
      ? footer.getBoundingClientRect().top + scrollY
      : Number.POSITIVE_INFINITY;
    const pins = Array.from(
      document.querySelectorAll<HTMLElement>("[data-pinned-scene]")
    ).map((el) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + scrollY;
      return { top, bottom: top + rect.height };
    });
    metrics.current = { heroEnd, footerTop, pins };
  }, []);

  useEffect(() => {
    measure();
    // Re-measure once layout settles (fonts, Spline, images).
    const t = window.setTimeout(measure, 1500);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [measure]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const { heroEnd, footerTop, pins } = metrics.current;
    const vh = window.innerHeight;
    const mid = y + vh / 2;
    const inPin = pins.some((pin) => mid > pin.top && mid < pin.bottom);
    const next = y > heroEnd && !inPin && y + vh < footerTop + 60;
    // setState only flips on threshold crossings — React bails out otherwise.
    setVisible(next);
    if (!next) setExpanded(false);
  });

  // Close on outside pointer / Escape while expanded.
  useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="contact-pill"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="flex flex-col items-end gap-3"
          >
            <AnimatePresence>
              {expanded && (
                <motion.div
                  key="contact-panel"
                  id="contact-pill-panel"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="glass w-60 rounded-2xl p-3"
                >
                  <p className="px-1 pb-2 font-mono text-[11px] uppercase tracking-widest text-steel-400">
                    Talk to our desk
                  </p>
                  <div className="flex flex-col gap-2">
                    {/* Platform green lives ONLY here, inside the expanded state. */}
                    <a
                      href={siteConfig.contact.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl bg-[#25D366] px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-[#1fc25b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <WhatsAppIcon className="h-[18px] w-[18px]" />
                      WhatsApp
                    </a>
                    <a
                      href={siteConfig.contact.phoneHref}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-steel-200 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accord-red"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="h-[18px] w-[18px]"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="contact-pill-panel"
              aria-label={
                expanded ? "Close contact options" : "Open contact options"
              }
              className="glass group flex items-center gap-2.5 rounded-full py-3 pl-4 pr-5 text-sm font-medium text-steel-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accord-red"
            >
              {/* Brand-system recolor when collapsed — never green out here. */}
              <WhatsAppIcon className="h-[18px] w-[18px] text-accord-red" />
              Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
