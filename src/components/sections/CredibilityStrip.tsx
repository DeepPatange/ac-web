"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import { credibility } from "@/lib/site";
import { fadeSoft, inView } from "@/lib/motion";

/**
 * CredibilityStrip — brief §5. A thin, quiet breath between the What-we-do
 * pin and the Products pin. No section number, no seam, no motif.
 *
 * One mono-voice line from site.ts; memberships / logos / testimonial are
 * client-input slots that render ONLY when data exists (they are empty
 * today — the strip must look complete with just the line).
 *
 * Motion: a single fadeSoft entrance for the whole band, then stillness.
 */
export default function CredibilityStrip() {
  const { line, memberships, logos, testimonial } = credibility;

  /* Presentational split of the one line — segments wrap cleanly at 375px
     instead of breaking mid-fact. Any string still yields ≥1 segment. */
  const segments = line.split(" · ");

  return (
    <section className="relative border-y border-white/[0.06] py-12 sm:py-14">
      <Container>
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="flex flex-col items-center gap-8 text-center"
        >
          {/* The mono-voice credibility line */}
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs tracking-widest text-steel-400">
            {segments.map((segment, i) => (
              <span key={segment} className="inline-flex items-center gap-x-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-accord-red">
                    ·
                  </span>
                )}
                <span>{segment}</span>
              </span>
            ))}
          </p>

          {/* Memberships — client-input slot; renders nothing while empty. */}
          {memberships.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {memberships.map((membership) => (
                <li
                  key={membership}
                  className="rounded-full border border-white/10 px-3 py-1 font-mono text-[0.6875rem] tracking-widest text-steel-400"
                >
                  {membership}
                </li>
              ))}
            </ul>
          )}

          {/* Client / principal logos — client-input slot. */}
          {logos.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {logos.map((logo) => (
                <li key={logo.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- client-supplied logo assets of unknown dimensions */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-8 w-auto opacity-60 grayscale"
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          )}

          {/* One attributed testimonial — client-input slot. */}
          {testimonial && (
            <figure className="max-w-2xl">
              <blockquote className="text-base/relaxed text-steel-300">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 font-mono text-xs tracking-widest text-steel-400">
                {testimonial.name}
                {testimonial.role && (
                  <>
                    {" "}
                    <span aria-hidden="true" className="text-accord-red">
                      ·
                    </span>{" "}
                    {testimonial.role}
                  </>
                )}
              </figcaption>
            </figure>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
