"use client";
import { useRef } from "react";
import HeroSection from "@/components/landing/hero";
import AboutSection from "@/components/landing/about";
import WhoIsItForSection from "@/components/landing/WhoIsItForSection";
import FeaturesSection from "@/components/landing/features";
import HowItWorksSection from "@/components/landing/how-it-works";
import Footer from "@/components/landing/footer";
import FAQSection from "@/components/landing/faq";
import CTASection from "@/components/landing/cta";
import PricingSection from "@/components/landing/pricing";
import TestimonialsSection from "@/components/landing/testimonials";
import NotificationsVerificationSection from "@/components/landing/verification";
import SecurityPrivacySection from "@/components/landing/security";
import Navbar from "@/components/landing/navbar";
import WhyChooseUsSection from "@/components/landing/why-choose-us";

export default function Home() {
  const containerRef = useRef(null);

  return (
    <main>
      <div className="bg-primary">
        <Navbar />
      </div>
      <HeroSection />

      <div ref={containerRef} className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-slate-50/80 to-background" />
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: 0.05,
          }}
        />
        <div className="absolute top-1/4 -left-64 w-96 h-96 rounded-full bg-blue-200/10 blur-3xl z-0" />
        <div className="absolute bottom-1/3 -right-64 w-96 h-96 rounded-full bg-indigo-300/10 blur-3xl z-0" />

        <div className="relative z-10">
          <AboutSection />
          <WhoIsItForSection />
          <FeaturesSection />
          <WhyChooseUsSection />
          <HowItWorksSection />
          <PricingSection />
          <NotificationsVerificationSection />
          <SecurityPrivacySection />
          <FAQSection />
          <TestimonialsSection />
          <CTASection />
        </div>
      </div>

      <Footer />
    </main>
  );
}