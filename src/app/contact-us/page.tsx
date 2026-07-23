import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import ContactContent from "@/components/sections/ContactContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Contact Us | Accord Chemical Corporation",
  description:
    "Talk to Accord Chemical Corporation's Mumbai desk — imports, indenting, exports and logistics of petrochemicals. Send the product, volume and destination and get a quote within one business day.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactUsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
