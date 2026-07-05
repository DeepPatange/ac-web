"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { lenisStore } from "@/lib/lenis-store";

/**
 * Buttery momentum scrolling via Lenis. Wraps the whole app so every section's
 * scroll-linked animation feels weighted and "alive". Respects reduced motion.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisStore.current = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    // Make in-page anchor links use Lenis for smooth jumps.
    const onClick = (e: MouseEvent) => {
      // Ignore modified / non-primary clicks so open-in-new-tab still works.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const target = (e.target as HTMLElement)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      // Support deep-link shapes like "#contact?product=meg": the fragment
      // before "?" is the scroll target; the query is read by the destination
      // section (e.g. Contact pre-fills its product select from ?product=).
      // NOTE: the full href is NOT a valid CSS selector, so we must split first
      // and guard querySelector — otherwise it throws a SyntaxError.
      const targetId = href.split("?")[0]; // "#contact"
      if (targetId.length < 2) return;
      let el: Element | null = null;
      try {
        el = document.querySelector(targetId);
      } catch {
        return;
      }
      if (!el) return;

      e.preventDefault();
      // For deep links that carry a query (e.g. "#contact?product=meg"), reflect
      // it in the URL so sections listening for `hashchange` react (Contact
      // pre-fills its product select). Assigning `location.hash` fires a native
      // hashchange reliably — `history.pushState` does NOT. Plain "#id" links
      // leave the URL untouched (just a smooth scroll), as before.
      if (href.includes("?") && href !== window.location.hash) {
        window.location.hash = href.slice(1);
      }
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisStore.current = null;
    };
  }, []);

  return <>{children}</>;
}
