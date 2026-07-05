import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import AboutContent from "@/components/sections/AboutContent";
import Footer from "@/components/sections/Footer";

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
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
