"use client";

import { ReactNode, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
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

/**
 * Split-panel scroll sequence. Adapted from a wheel-hijacking "scroll adventure"
 * into a SCROLL-DRIVEN pinned section so it composes with the site's global
 * Lenis smooth scroll (it does NOT capture window wheel/keydown, which would
 * trap the user and fight Lenis). A tall wrapper pins a full-screen stage;
 * scroll progress selects the active panel, whose two halves converge — the
 * left slides up from below, the right slides down from above — while the
 * outgoing panel's halves split away. Transform-only (GPU) + a CSS transition.
 * Reduced motion / no-JS renders `reducedFallback` instead.
 */
export default function ScrollAdventure({
  panels,
  reducedFallback,
  vhPerPanel = 80,
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

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(
      panels.length - 1,
      Math.max(0, Math.floor(p * panels.length))
    );
    setActive((cur) => (cur === idx ? cur : idx));
  });

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
