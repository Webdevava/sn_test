"use client";
import { motion, useScroll, useTransform } from "framer-motion";
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
  // Create refs for the parallax container
  const containerRef = useRef(null);

  // Set up scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Create transform values for parallax elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const patternOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.05, 0.1, 0.05]
  );

  return (
    <main>
      <div className="bg-primary">
        <Navbar />
      </div>
      <HeroSection />

      {/* Gradient background container with parallax effects */}
      <motion.div ref={containerRef} className="relative overflow-hidden">
        {/* Parallax background elements */}
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-b from-background via-slate-50/80 to-background"
          style={{ y: backgroundY }}
        />

        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: patternOpacity,
          }}
        />

        {/* Animated gradient accent shapes */}
        <motion.div
          className="absolute top-1/4 -left-64 w-96 h-96 rounded-full bg-blue-200/10 blur-3xl z-0"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute bottom-1/3 -right-64 w-96 h-96 rounded-full bg-indigo-300/10 blur-3xl z-0"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Content sections with reveal animations */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <AboutSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <WhoIsItForSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <FeaturesSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <WhyChooseUsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <HowItWorksSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <PricingSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <NotificationsVerificationSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <SecurityPrivacySection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <FAQSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <TestimonialsSection />
      <CTASection />
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </main>
  );
}
