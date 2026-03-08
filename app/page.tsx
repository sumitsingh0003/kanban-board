// pages/index.tsx
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import About from "@/sections/About";
import HowItWorks from "@/sections/HowItWorks";
import Testimonials from "@/sections/Testimonials";
import Pricing from "@/sections/Pricing";
import Contact from "@/sections/Contact";
import CTA from "@/sections/CTA";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Header />
      <Hero />
      <Features />
      <About />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
}