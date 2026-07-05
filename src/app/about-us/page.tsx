import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About Us | Accord Chemical Corporation",
  description:
    "Accord Chemical Corporation is among India's top petrochemical distribution companies — import, export and indenting of petrochemicals from Mumbai since 2009, across 58+ countries.",
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 sm:pt-32">
        {/* Breadcrumb — signals this is a standalone page. */}
        <Container className="pb-1 pt-4">
          <nav
            aria-label="Breadcrumb"
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-steel-400"
          >
            <Link
              href="/"
              className="transition-colors hover:text-accord-red focus-visible:outline-none focus-visible:text-accord-red"
            >
              Home
            </Link>
            <span className="px-2 text-steel-500">/</span>
            <span className="text-steel-300">About Us</span>
          </nav>
        </Container>

        <About />
      </main>
      <Footer />
    </>
  );
}
