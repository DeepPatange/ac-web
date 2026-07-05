"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { lenisStore } from "@/lib/lenis-store";
import { cn } from "@/lib/utils";

export interface ScrollPanel {
  /** Background image URL for the image half. */
  image: string;
  /** Which half shows the image; the other shows the text. */
  imageSide: "left" | "right";
  /** Small mono label above the heading, e.g. "04 / 10". */
  index?: string;
  heading: string;
  body?: ReactNode;
}

/** One wheel notch / arrow press advances exactly one panel; this is the lock
    window afterwards so a single flick can't skip several panels. */
const STEP_COOLDOWN = 850;

/**
 * Split-panel scroll sequence. Adapted from a wheel-hijacking "scroll adventure"
 * into a pinned section that composes with the app-wide Lenis smooth scroll.
 *
 * A tall wrapper pins a full-screen stage; scroll progress selects the active
 * panel, whose two halves converge (left up from below, right down from above)
 * while the outgoing panel's halves split away. To make the cadence consistent
 * — ONE scroll gesture = ONE panel, regardless of Lenis momentum — a wheel /
 * arrow-key handler snaps the scroll to the next panel's position and locks
 * briefly. It only engages while the stage is pinned and there's a next panel
 * to show; at either end it lets the page scroll on (never traps the user).
 * Reduced motion / no-JS renders `reducedFallback` instead.
 */
export default function ScrollAdventure({
  panels,
  reducedFallback,
  vhPerPanel = 100,
}: {
  panels: ScrollPanel[];
  reducedFallback?: ReactNode;
  vhPerPanel?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const lockedRef = useRef(false);
  const n = panels.length;

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    activeRef.current = idx;
    setActive((cur) => (cur === idx ? cur : idx));
  });

  // One-gesture-per-panel wheel / keyboard stepping.
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    /** Absolute scroll-Y that lands the given panel index at its window centre. */
    const scrollYForPanel = (idx: number) => {
      const wrapTop = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      return wrapTop + ((idx + 0.5) / n) * range;
    };

    const isPinned = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };

    const step = (dir: 1 | -1) => {
      const next = activeRef.current + dir;
      if (next < 0 || next > n - 1) return false; // let the page scroll on
      lockedRef.current = true;
      window.setTimeout(() => (lockedRef.current = false), STEP_COOLDOWN);
      const target = scrollYForPanel(next);
      const lenis = lenisStore.current;
      if (lenis) lenis.scrollTo(target, { duration: 0.85 });
      else window.scrollTo({ top: target, behavior: "smooth" });
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isPinned() || Math.abs(e.deltaY) < 2) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      // Boundary: nothing to step to → don't capture, let the page continue.
      if ((dir === 1 && activeRef.current >= n - 1) ||
          (dir === -1 && activeRef.current <= 0)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (lockedRef.current) return;
      step(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isPinned()) return;
      const dir: 1 | -1 | 0 =
        e.key === "ArrowDown" || e.key === "PageDown"
          ? 1
          : e.key === "ArrowUp" || e.key === "PageUp"
            ? -1
            : 0;
      if (!dir) return;
      if ((dir === 1 && activeRef.current >= n - 1) ||
          (dir === -1 && activeRef.current <= 0)) {
        return;
      }
      e.preventDefault();
      if (lockedRef.current) return;
      step(dir);
    };

    // capture-phase + non-passive so we run before Lenis and can preventDefault.
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, { capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
    };
  }, [reduced, n]);

  if (reduced) return <>{reducedFallback}</>;

  const slide =
    "absolute top-0 h-full w-1/2 transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform";

  return (
    <div
      ref={ref}
      style={{ height: `${panels.length * vhPerPanel}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        {panels.map((panel, i) => {
          const isActive = i === active;
          const imageLeft = panel.imageSide === "left";

          const imagePane = (
            <div
              className="relative h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${panel.image})` }}
            >
              {/* Brand darken + a red floor so the photo sits in the dark theme. */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(11,11,13,0.30), rgba(11,11,13,0.08) 42%, rgba(11,11,13,0.66)), radial-gradient(120% 80% at 50% 122%, rgba(225,27,34,0.24), transparent 60%)",
                }}
              />
            </div>
          );

          const textPane = (
            <div className="flex h-full w-full flex-col items-center justify-center bg-ink px-8 text-center lg:px-14">
              {panel.index && (
                <span className="mb-5 font-mono text-xs tracking-[0.3em] text-accord-red">
                  {panel.index}
                </span>
              )}
              <h3 className="type-section text-balance text-white">
                {panel.heading}
              </h3>
              {panel.body && (
                <div className="mt-6 max-w-sm text-steel-300">{panel.body}</div>
              )}
            </div>
          );

          return (
            <div key={i} className="absolute inset-0" aria-hidden={!isActive}>
              <div
                className={cn(slide, "left-0")}
                style={{
                  transform: isActive ? "translateY(0)" : "translateY(100%)",
                }}
              >
                {imageLeft ? imagePane : textPane}
              </div>
              <div
                className={cn(slide, "left-1/2")}
                style={{
                  transform: isActive ? "translateY(0)" : "translateY(-100%)",
                }}
              >
                {imageLeft ? textPane : imagePane}
              </div>
            </div>
          );
        })}

        {/* Progress rail — which industry, out of how many. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 sm:right-6"
        >
          {panels.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                i === active ? "scale-125 bg-accord-red" : "bg-white/25"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
