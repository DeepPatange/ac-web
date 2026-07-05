"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Container from "@/components/ui/Container";
import { fadeSoft, stagger } from "@/lib/motion";

/* ============================================================================
   /gallery — the company's own photos (team, office, reception) from
   accordchemicals.com/gallery, served locally from /public/gallery. Responsive
   grid with a keyboard-navigable lightbox.
   ========================================================================== */

const PHOTOS = [
  "reception",
  "staff-06",
  "staff-08",
  "staff-09",
  "staff-10",
  "staff-11",
  "staff-12",
  "staff-13",
  "staff-14",
  "staff-15",
  "staff-16",
  "staff-17",
  "staff-18",
  "staff-19",
  "staff-20",
].map((name, i) => ({
  src: `/gallery/${name}.webp`,
  alt: `Accord Chemical Corporation — office & team photo ${i + 1}`,
}));

export default function GalleryContent() {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((v) => (v === null ? v : (v - 1 + PHOTOS.length) % PHOTOS.length)),
    []
  );
  const next = useCallback(
    () => setOpen((v) => (v === null ? v : (v + 1) % PHOTOS.length)),
    []
  );

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, prev, next]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[8%] -top-[18%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.16),transparent_62%)]"
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
            <span className="text-steel-300">Gallery</span>
          </nav>

          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-3xl"
          >
            <motion.p
              variants={fadeSoft}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red"
            >
              Life at Accord
            </motion.p>
            <motion.h1 variants={fadeSoft} className="type-hero text-white">
              Gallery
            </motion.h1>
            <motion.p
              variants={fadeSoft}
              className="mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
            >
              A look inside Accord Chemical Corporation — our people, our desk and
              our Mumbai headquarters.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Grid */}
      <section className="section-quiet">
        <Container>
          <motion.div
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {PHOTOS.map((photo, i) => (
              <motion.button
                key={photo.src}
                variants={fadeSoft}
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open image ${i + 1}`}
                className="group relative aspect-[3/2] overflow-hidden rounded-2xl ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-30"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accord-red transition-transform duration-500 group-hover:scale-x-100"
                />
              </motion.button>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-ink/92 backdrop-blur-sm"
              onClick={close}
              aria-hidden
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-accord-red/60 hover:text-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-accord-red/60 hover:text-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-accord-red/60 hover:text-accord-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accord-red sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-[1] max-h-full w-full max-w-5xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[open].src}
                alt={PHOTOS[open].alt}
                className="mx-auto max-h-[82vh] w-auto rounded-2xl object-contain ring-1 ring-white/10"
              />
              <p className="mt-3 text-center font-mono text-xs tracking-widest text-steel-400">
                {String(open + 1).padStart(2, "0")} / {PHOTOS.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
