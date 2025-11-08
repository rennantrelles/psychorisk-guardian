import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Methodology } from "@/components/Methodology";
import { Dimensions } from "@/components/Dimensions";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Hero />
        <Methodology />
        <Dimensions />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
