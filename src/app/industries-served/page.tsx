import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import IndustriesServedContent from "@/components/sections/IndustriesServedContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Industries Served | Accord Chemical Corporation",
  description:
    "The downstream industries Accord Chemical Corporation supplies — paints, coatings, packaging, adhesives, resins, textiles, pharmaceuticals, agrochemicals, automobiles, polymers and more.",
  alternates: { canonical: "/industries-served" },
};

export default function IndustriesServedPage() {
  return (
    <>
      <Navbar />
      <main>
        <IndustriesServedContent />
      </main>
      <Footer />
    </>
  );
}
