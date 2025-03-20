"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import AuthDialog from "../dialogs/auth/auth-dialog";

export default function CTASection() {
  const sectionRef = useRef(null);
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative"
      id="cta"
    >
      {/* Split background */}
      <div className="absolute inset-0">
        <div className="h-1/2 bg-background"></div>
        <div className="h-1/2 bg-gray-900"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto bg-popover rounded-lg border border-primary/20 shadow-lg p-6 md:p-8 lg:p-10"
        >
          <div className="text-center space-y-6 md:space-y-8">
            {/* Heading */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/35 via-primary/15 to-transparent w-fit mx-auto px-3 py-1 rounded-md">
                <h2 className="text-sm md:text-base font-medium text-primary tracking-wide">
                  Take Control
                </h2>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Your Wealth, Your Decisions, Your Control
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Take charge of your financial legacy today. Keep your information safe, and ensure it reaches the right hands at the right time.
              </p>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <AuthDialog type="signup">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto py-6 px-8 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <span>Sign Up Here</span>
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </AuthDialog>
              <Link href="#process">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto py-6 px-8 rounded-lg font-medium flex items-center justify-center gap-2 border-primary/30 text-primary hover:bg-primary/10 transition-all"
                >
                  <span>See How It Works</span>
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}