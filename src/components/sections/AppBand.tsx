"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Container from "@/components/ui/Container";
import StoreBadges from "@/components/ui/StoreBadges";
import { appMeta } from "@/lib/site";
import { fadeSoft } from "@/lib/motion";

/* ============================================================================
   Home-page download band for the Accord Interact app — a compact strip near
   the end of the page. The full story lives on /app.
   ========================================================================== */

export default function AppBand() {
  return (
    <section className="section-quiet">
      <Container>
        <motion.div
          variants={fadeSoft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 sm:p-10 lg:p-12"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(225,27,34,0.2),transparent_65%)]"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex items-start gap-5">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src="/app/icon.png"
                  alt={`${appMeta.name} app icon`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-accord-red">
                  Accord Interact
                </p>
                <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                  The trading desk, on your phone.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-steel-300 sm:text-base">
                  Live market prices, in-app trading, broker &amp; supplier tools
                  and real-time chat — free on Android and iOS.
                </p>
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-steel-400">
                  <span className="inline-flex items-center gap-1 text-white">
                    <Star
                      className="h-3.5 w-3.5 fill-accord-red text-accord-red"
                      aria-hidden
                    />
                    {appMeta.rating} rating
                  </span>
                  <span>· {appMeta.downloads} downloads</span>
                  <Link
                    href="/app"
                    className="text-accord-red transition-colors hover:text-accord-redLight"
                  >
                    Learn more →
                  </Link>
                </p>
              </div>
            </div>

            <StoreBadges className="shrink-0" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
