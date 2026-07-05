import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import ServicesContent from "@/components/sections/ServicesContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Services | Accord Chemical Corporation",
  description:
    "Import, export, distribution and indenting of petrochemicals — CHA & surveyor, port bulk storage, survey & insurance, and PAN-India logistics from Accord Chemical Corporation.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesContent />
      </main>
      <Footer />
    </>
  );
}
