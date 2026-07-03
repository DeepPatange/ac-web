import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Verticals from "@/components/sections/Verticals";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Products from "@/components/sections/Products";
import Industries from "@/components/sections/Industries";
import Growth from "@/components/sections/Growth";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Verticals />
        <Stats />
        <About />
        <Products />
        <Industries />
        <Growth />
        <GlobalPresence />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
