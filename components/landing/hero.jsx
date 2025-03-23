"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import AuthDialog from "../dialogs/auth/auth-dialog";

export default function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-20 pb-0" id="home">
      {/* Bold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-blue-600 to-background z-0" />
      
      {/* Prominent decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        
        {/* Wave pattern */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-20">
            <path fill="#246" fillOpacity="0.3" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Dot pattern overlay */}
        {/* <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }} /> */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-grow flex items-center">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Text Content */}
          <motion.div
            variants={fadeInUp}
            className="space-y-6 md:space-y-8 text-center lg:text-left max-w-lg mx-auto lg:max-w-none lg:mx-0"
          >
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold leading-tight text-foreground">
              <span className="block text-white">Your Life. Your Legacy.</span>
              {/* <span className="block text-white">Protected</span> */}
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold">Protected & Shared Only When It Matters.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-lg text-foreground">
            Your hard-earned assets, your hidden investments, and your responsibilities should never be lost or forgotten. Store them securely and ensure they reach your loved ones at the right time, in the right way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <AuthDialog type="signup">
                <Button
                  size="lg"
                  className="bg-blue-700 text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Get Started Today
                </Button>
              </AuthDialog>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 px-6 py-3 rounded-lg font-medium transition-all"
              >
                Explore Features
              </Button>
            </div>
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-primary/10"
            >
              {[
                { value: "12M+", text: "Assets Secured" },
                { value: "15K+", text: "Families Protected" },
                { value: "99.9%", text: "Uptime Guarantee" },
              ].map((metric, index) => (
                <div key={index} className="flex flex-col items-center lg:items-start">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-card">
                    {metric.value}
                  </p>
                  <p className="text-xs sm:text-sm ">{metric.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Placeholder (hidden on desktop to allow absolute positioning) */}
          <div className="hidden lg:block"></div>
        </motion.div>
      </div>

      {/* Image Container - Pinned to Bottom */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative w-full z-10"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-md mx-auto lg:max-w-2xl lg:absolute lg:bottom-0 lg:right-0">
            <Image
              src="/images/hero.png"
              alt="Digital legacy protection"
              width={600}
              height={600}
              className="w-full h-auto object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </motion.div>

      {/* Light effect overlays */}
      {/* <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary to-transparent opacity-60 z-0" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-0" /> */}
    </section>
  );
}