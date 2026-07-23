import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import ProductsContent from "@/components/sections/ProductsContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Products | Accord Chemical Corporation",
  description:
    "Eight petrochemical families supplied producer-direct by Accord Chemical Corporation — acrylates and monomers, aromatics and hydrocarbons, amines, chlorinated solvents, glycols and glycol ethers, OXO alcohols, specialty acrylates, and custom sourcing. COA on every lot.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductsContent />
      </main>
      <Footer />
    </>
  );
}
