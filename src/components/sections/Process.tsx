"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeSoft, inView, stagger } from "@/lib/motion";
import { process as processSteps, processCopy } from "@/lib/site";

/**
 * 07 — Process: "How a consignment moves" (brief §5).
 *
 * The quietest section on the page, by design: four steps a procurement
 * manager can scan in seconds — mono numerals 01–04, title, one factual
 * line each. Motion is a single staggered fadeSoft entrance, then complete
 * stillness. No pin, no loop, no scrub, no parallax (§4.1: QUIET).
 *
 * Micro-interactions stay within the informational-tile tier (§4.4):
 * border brightens + a 1px red rule draws along the top edge on hover.
 * Nothing requires hover — all content is visible at rest.
 */
export default function Process() {
  return (
    <section id="process" className="section-quiet zone-warm noise relative overflow-hidden">
      {/* Trade Arc boundary — full-bleed, self-centers to max-w-container. */}

      <Container>
        <SectionHeading
          number="07"
          eyebrow={processCopy.eyebrow}
          title={processCopy.heading}
        />

        <motion.ol
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        >
          {processSteps.map((step) => (
            <motion.li
              key={step.step}
              variants={fadeSoft}
              className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/[0.16] sm:p-7"
            >
              {/* 1px red rule drawing along the top edge — the keeper accent. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-accord-red transition-transform duration-300 ease-out group-hover:scale-x-100 sm:inset-x-7"
              />

              {/* Mono numeral — the technical-data voice. */}
              <span className="font-mono text-xs tracking-widest text-accord-red">
                {step.step}
              </span>

              <h3 className="type-card mt-5 text-white sm:mt-6">{step.title}</h3>

              <p className="mt-2.5 text-base leading-relaxed text-steel-300">
                {step.desc}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}
