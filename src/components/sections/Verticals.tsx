"use client";

import { AnimatePresence, motion } from "framer-motion";

import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
  useHoverSliderContext,
} from "@/components/ui/animated-slideshow";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { verticals } from "@/lib/site";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* verticals[]: 0 = Import & Distribution, 1 = Indenting, 2 = Exports,
   3 = Comprehensive Services. */
const [vImport, vIndent, vExport, vServices] = verticals;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

/* Each pillar paired with a real industrial photograph (Unsplash). */
const SLIDES = [
  { ...vImport, image: img("photo-1494412574643-ff11b0a5c1c3") }, // port + containers
  { ...vIndent, image: img("photo-1516937941344-00b4e0337589") }, // refinery
  { ...vExport, image: img("photo-1578575437130-527eed3abbec") }, // container ship loading
  { ...vServices, image: img("photo-1513828583688-c52646db42da") }, // pipework
];

const titleClass =
  "cursor-pointer whitespace-nowrap font-display text-[clamp(1.45rem,2.9vw,2.4rem)] font-semibold uppercase leading-[1.05] tracking-tight text-white";

/* One title row — reads the active slide so its index turns red when active. */
function PillarRow({ slide, index }: { slide: (typeof SLIDES)[number]; index: number }) {
  const { activeSlide } = useHoverSliderContext();
  const active = activeSlide === index;
  return (
    <li className="flex items-baseline gap-4">
      <span
        className={cn(
          "shrink-0 font-mono text-xs transition-colors duration-300",
          active ? "text-accord-red" : "text-steel-600"
        )}
      >
        0{index + 1}
      </span>
      <TextStaggerHover index={index} text={slide.title} className={titleClass} />
    </li>
  );
}

/* Active pillar's copy — crossfades in sync with the image reveal. */
function ActiveCaption() {
  const { activeSlide } = useHoverSliderContext();
  const active = SLIDES[activeSlide];
  return (
    <div className="mt-9 max-w-md border-l-2 border-accord-red/60 pl-4">
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
          className="mt-2 text-sm leading-relaxed text-steel-300 sm:text-[15px]"
        >
          {active.blurb}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function Verticals() {
  return (
    <section id="verticals" className="section noise relative overflow-hidden">
      {/* Decorative background — frosted depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-grid-faint opacity-[0.4]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent 75%)",
          }}
        />
        <div className="absolute -top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accord-red/20 opacity-60 blur-[64px]" />
        <div className="absolute bottom-0 right-[12%] h-[24rem] w-[24rem] rounded-full bg-accord-red/20 opacity-50 blur-[64px]" />
      </div>

      <Container className="relative">
        <SectionHeading
          number="01"
          eyebrow="What We Do"
          title="Our Verticals"
          intro="Four pillars that move petrochemicals from source to destination — reliably, transparently, worldwide. Hover a pillar to explore it."
          invert
        />

        <HoverSlider className="mt-12 lg:mt-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* LEFT — pillar titles + active caption */}
            <div>
              <ul className="flex flex-col gap-5 sm:gap-6">
                {SLIDES.map((slide, index) => (
                  <PillarRow key={slide.title} slide={slide} index={index} />
                ))}
              </ul>
              <ActiveCaption />
            </div>

            {/* RIGHT — image reveal */}
            <div className="relative h-[26rem] overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] sm:h-[30rem] lg:h-[34rem]">
              <HoverSliderImageWrap className="h-full w-full">
                {SLIDES.map((slide, index) => (
                  <HoverSliderImage
                    key={slide.title}
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
            </div>
          </div>
        </HoverSlider>
      </Container>
    </section>
  );
}
