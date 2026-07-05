import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import NetworkShowcase from "@/components/sections/NetworkShowcase";
import About from "@/components/sections/About";
import Verticals from "@/components/sections/Verticals";
import CredibilityStrip from "@/components/sections/CredibilityStrip";
import Products from "@/components/sections/Products";
import Industries from "@/components/sections/Industries";
import Growth from "@/components/sections/Growth";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Process from "@/components/sections/Process";
import Career from "@/components/sections/Career";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NetworkShowcase />
        <About />
        <Verticals />
        <CredibilityStrip />
        <Products />
        <Industries />
        <Growth />
        <GlobalPresence />
        <Process />
        <Career />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
