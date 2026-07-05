import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import GalleryContent from "@/components/sections/GalleryContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Gallery | Accord Chemical Corporation",
  description:
    "A look inside Accord Chemical Corporation — our people, our desk and our Mumbai headquarters.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <GalleryContent />
      </main>
      <Footer />
    </>
  );
}
