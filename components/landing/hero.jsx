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
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-primary via-primary to-background flex flex-col justify-between pt-20 pb-0">
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
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary">
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

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent z-0" />
    </section>
  );
}