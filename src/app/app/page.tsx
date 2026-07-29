import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import AppContent from "@/components/sections/AppContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Accord Interact — the chemical trading app | Accord Chemical Corporation",
  description:
    "Accord Interact is the all-in-one Android app for chemical-industry professionals — live market prices, in-app trading and bids, broker & supplier tools, real-time chat and industry intelligence. Free on Google Play.",
  alternates: { canonical: "/app" },
};

export default function AppPage() {
  return (
    <>
      <Navbar />
      <main>
        <AppContent />
      </main>
      <Footer />
    </>
  );
}
