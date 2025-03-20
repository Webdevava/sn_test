"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
  LockKey,
  ShieldCheck,
  Gear,
  Eye,
  Database,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent } from "@/components/ui/card";

export default function SecuritySection() {
  const sectionRef = useRef(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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
      className="bg-background py-12 md:py-16 lg:py-20"
      id="security"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className=""
        >
          {/* Heading */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 md:space-y-8 mb-10 md:mb-14 text-left"
          >
            <div className="bg-gradient-to-r from-primary/35 via-primary/15 to-transparent w-fit px-3 py-1 rounded-md">
              <h2 className="text-sm md:text-base font-medium text-primary tracking-wide">
                Security & Privacy
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
              How We Keep You Safe
            </h1>
          </motion.div>

          {/* Main Features */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12"
          >
            {/* Bank-Grade Security */}
            <Card className="bg-card border border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <LockKey size={24} weight="duotone" className="text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Bank-Grade Security
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    AES-256 encryption ensures maximum protection of all your sensitive information.
                  </p>
                </CardContent>
              </motion.div>
            </Card>

            {/* Triple Verification */}
            <Card className="bg-card border border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck size={24} weight="duotone" className="text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Triple Verification
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    No premature disclosure of your data. We verify thoroughly before any information is shared.
                  </p>
                </CardContent>
              </motion.div>
            </Card>

            {/* Complete Control */}
            <Card className="bg-card border border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Gear size={24} weight="duotone" className="text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Complete Control
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    You control what's revealed, when, and to whom. Your data remains under your authority at all times.
                  </p>
                </CardContent>
              </motion.div>
            </Card>
          </motion.div>

          {/* Privacy Promises */}
          <motion.div
            variants={itemVariants}
            className="bg-card p-6 md:p-8 rounded-lg border border-primary/10 shadow-md"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Eye size={20} weight="duotone" className="text-primary" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 text-center">
              Our Privacy Promise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex items-start gap-3">
                <Database size={24} className="text-primary flex-shrink-0 mt-1" weight="duotone" />
                <p className="text-sm md:text-base text-muted-foreground">
                  We respect your privacy. Your data remains yours—always.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <UserCircle size={24} className="text-primary flex-shrink-0 mt-1" weight="duotone" />
                <p className="text-sm md:text-base text-muted-foreground">
                  Your data is never shared, sold, or accessed without your consent.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-base md:text-lg font-medium text-foreground italic">
                "Security isn't just a feature—it's the foundation of everything we build."
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}