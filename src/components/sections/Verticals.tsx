"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
  useHoverSliderContext,
} from "@/components/ui/animated-slideshow";
import Container from "@/components/ui/Container";
import PinnedScene from "@/components/ui/PinnedScene";
import SectionHeading from "@/components/ui/SectionHeading";
import { verticals, verticalsIntro } from "@/lib/site";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * 02 — "What we do" (REDESIGN_BRIEF §4.2 PEAK 1 + §5).
 *
 * ~280vh pinned scene: scroll-progress quarters (0–.25/.25–.5/.5–.75/.75–1)
 * auto-advance the four pillars via `useMotionValueEvent` (state changes only
 * at quarter boundaries — never per frame), driving the existing clip-path
 * image wipes and char-roll titles. On pointer-fine devices `mouseenter`
 * temporarily overrides scroll until the next quarter boundary reclaims it;
 * touch gets the full sequence from scroll alone. Reduced motion renders the
 * static four-card fallback, fully revealed.
 */

const SECTION_ID = "what-we-do";

/** Section H2. (Nav "Services" now routes to the dedicated /services page, so
    this on-home section keeps its own title.) */
const sectionTitle = "What we do";

/* verticals[]: 0 = Import & Distribution, 1 = Indenting, 2 = Exports,
   3 = Comprehensive Services. */
const [vImport, vIndent, vExport, vServices] = verticals;

/* Byte-for-byte the same URL NetworkShowcase and Gallery build for these
   photos — an identical string is what lets the browser serve all three
   sections from one download per picture. Keep the three helpers in sync. */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&auto=format&q=70`;

/* Each pillar paired with a real industrial photograph (Unsplash). */
const SLIDES = [
  { ...vImport, image: photo("1494412574643-ff11b0a5c1c3") }, // port + containers
  { ...vIndent, image: photo("1516937941344-00b4e0337589") }, // refinery
  { ...vExport, image: photo("1578575437130-527eed3abbec") }, // container ship loading
  { ...vServices, image: photo("1513828583688-c52646db42da") }, // pipework
] as const;

const QUARTER = SLIDES.length; // 4 — one progress quarter per pillar

/** `(pointer: fine)` — gates the mouseenter override to mouse/trackpad. */
function useIsPointerFine(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/**
 * Re-plumbs the slideshow trigger from hover to scroll: maps pin progress
 * quarters to the active slide. `changeSlide` (setState) fires ONLY when the
 * quarter index actually changes — four times per pass, never per frame.
 */
function ScrollDriver({ progress }: { progress: MotionValue<number> }) {
  const { changeSlide } = useHoverSliderContext();
  const lastIndex = useRef(0);

  useMotionValueEvent(progress, "change", (p) => {
    const index = Math.min(QUARTER - 1, Math.max(0, Math.floor(p * QUARTER)));
    if (index !== lastIndex.current) {
      lastIndex.current = index;
      changeSlide(index);
    }
  });

  return null;
}

/**
 * One pillar row — tracked mono red index tick + `.type-card` sentence-case
 * char-roll title (the site's best micro-detail, kept). The visual char roll
 * is aria-hidden; a plain sr-only line carries title + blurb so every pillar
 * is readable without scroll or hover.
 */
function PillarRow({
  slide,
  index,
}: {
  slide: (typeof SLIDES)[number];
  index: number;
}) {
  const { activeSlide } = useHoverSliderContext();
  const active = activeSlide === index;
  return (
    <li className="flex items-baseline gap-4">
      <span
        aria-hidden
        className={cn(
          "shrink-0 font-mono text-xs tracking-widest transition-colors duration-300",
          active ? "text-accord-red" : "text-steel-600"
        )}
      >
        0{index + 1}
      </span>
      <span className="sr-only">
        {slide.title} — {slide.blurb}
      </span>
      <TextStaggerHover
        aria-hidden
        index={index}
        text={slide.title}
        className="cursor-pointer whitespace-nowrap font-display text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.01em] text-white sm:text-[2rem] lg:text-[2.4rem]"
      />
    </li>
  );
}

/** Active pillar's blurb — crossfades in sync with the image wipe. */
function CaptionBody({ compact = false }: { compact?: boolean }) {
  const { activeSlide } = useHoverSliderContext();
  const active = SLIDES[activeSlide];
  return (
    <>
      <span className="font-mono text-[11px] tracking-[0.22em] text-accord-red">
        0{activeSlide + 1} / 0{SLIDES.length}
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={activeSlide}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: easeOut }}
          className={cn(
            "mt-3 font-medium leading-snug text-steel-100",
            compact
              ? "text-base sm:text-lg"
              : "text-xl sm:text-2xl lg:text-[1.6rem]"
          )}
        >
          {active.blurb}
        </motion.p>
      </AnimatePresence>
    </>
  );
}

/** The pinned h-screen stage — receives the 0→1 pin progress. */
function Stage({ progress }: { progress: MotionValue<number> }) {
  const isPointerFine = useIsPointerFine();

  // Pin release (brief §4.3.2): content settles −40px and dims to 80% as the
  // scene ends and the next section slides over. Transform/opacity only.
  const settleY = useTransform(progress, [0.92, 1], [0, -40]);
  const settleOpacity = useTransform(progress, [0.92, 1], [1, 0.8]);

  return (
    <motion.div
      style={{ y: settleY, opacity: settleOpacity }}
      className="relative flex h-full flex-col"
    >
      {/* ONE static blur blob — never animated (brief §2 / §7.4). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[8%] h-[26rem] w-[26rem] rounded-full bg-accord-red/10 blur-3xl"
      />

      <Container className="relative flex min-h-0 flex-1 flex-col justify-center pb-6 pt-20 sm:pt-24 lg:pb-10">
        <SectionHeading
          number="02"
          title={sectionTitle}
          intro={verticalsIntro}
        />

        <HoverSlider className="mt-6 flex min-h-0 flex-1 flex-col sm:mt-8 lg:mt-12">
          <ScrollDriver progress={progress} />

          <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:items-center lg:gap-16">
            {/* Pillar list + caption. Hover override is pointer-fine only —
                on touch the list is inert and scroll owns the sequence. */}
            <div className="lg:self-center">
              <ul
                className={cn(
                  "flex flex-col gap-3 sm:gap-4 lg:gap-6",
                  !isPointerFine && "pointer-events-none"
                )}
              >
                {SLIDES.map((slide, index) => (
                  <PillarRow key={slide.id} slide={slide} index={index} />
                ))}
              </ul>
              <div
                aria-hidden
                className="mt-8 hidden min-h-[9rem] max-w-lg border-l-2 border-accord-red/60 pl-5 lg:block"
              >
                <CaptionBody />
              </div>
            </div>

            {/* Image wipe stack — the kept clip-path reveals. */}
            <div className="relative min-h-[8rem] overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] lg:h-full lg:max-h-[30rem] lg:self-center">
              <HoverSliderImageWrap className="h-full w-full">
                {SLIDES.map((slide, index) => (
                  <HoverSliderImage
                    key={slide.id}
                    index={index}
                    imageUrl={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    className="size-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </HoverSliderImageWrap>

              {/* Brand tint + legibility scrim (clipped by the rounded frame) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
              <div className="pointer-events-none absolute inset-0 bg-accord-red/15 mix-blend-overlay" />

              {/* Mobile caption — overlaid on the image to keep the whole
                  scene inside one viewport at 375px. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 border-l-2 border-accord-red/60 p-4 pl-5 lg:hidden"
              >
                <CaptionBody compact />
              </div>
            </div>
          </div>
        </HoverSlider>
      </Container>
    </motion.div>
  );
}

/** Reduced-motion fallback — static, unpinned, all four pillars revealed. */
function ReducedVerticals() {
  return (
    <div className="relative py-20 sm:py-24">
      <Container>
        <SectionHeading
          number="02"
          title={sectionTitle}
          intro={verticalsIntro}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {SLIDES.map((slide, index) => (
            <article
              key={slide.id}
              className="glass-card flex flex-col gap-3 p-6"
            >
              <span className="font-mono text-xs tracking-widest text-accord-red">
                0{index + 1}
              </span>
              <h3 className="type-card text-white">{slide.title}</h3>
              <p className="text-sm leading-relaxed text-steel-300">
                {slide.blurb}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function Verticals() {
  return (
    <section id={SECTION_ID} className="section-peak zone-cool noise relative">
      {/* Trade Arc boundary — node lands at the section-number chip. */}

      <PinnedScene height="280vh" reducedFallback={<ReducedVerticals />}>
        {(progress) => <Stage progress={progress} />}
      </PinnedScene>
    </section>
  );
}
