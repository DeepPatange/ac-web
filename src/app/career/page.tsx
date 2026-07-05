import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import CareerContent from "@/components/sections/CareerContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Career | Accord Chemical Corporation",
  description:
    "Build a career at Accord Chemical Corporation — a people-centric petrochemical trading house in Mumbai. Open roles in Sales, Procurement, Business Development, Logistics and Accounts.",
  alternates: { canonical: "/career" },
};

export default function CareerPage() {
  return (
    <>
      <Navbar />
      <main>
        <CareerContent />
      </main>
      <Footer />
    </>
  );
}
