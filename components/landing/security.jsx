"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
  LockKey,
  ShieldCheck,
  Gear,
  EyeSlash,
  Database,
  UserCircle,
  CheckCircle,
  Lock,
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
      className="py-12 md:py-16 lg:py-20"
      id="security"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
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

          {/* Enhanced Privacy Promises */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 p-6 md:p-8 rounded-2xl border border-primary/20 shadow-xl relative overflow-hidden"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <defs>
                  <pattern id="privacy-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
                    <path 
                      d="M0 0 L100 0 L0 100 Z" 
                      fill="currentColor" 
                      fillOpacity="0.1"
                    />
                    <path 
                      d="M100 0 L0 100 L100 100 Z" 
                      fill="currentColor" 
                      fillOpacity="0.1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#privacy-pattern)" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <EyeSlash size={32} weight="duotone" className="text-primary" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center tracking-tight">
                Our Unbreakable Privacy Commitment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
                {[
                  {
                    icon: <Database size={28} weight="duotone" />,
                    title: "Data Sovereignty",
                    description: "Your data is exclusively yours. We never compromise on ownership or access."
                  },
                  {
                    icon: <UserCircle size={28} weight="duotone" />,
                    title: "Total Confidentiality",
                    description: "Zero third-party sharing. Your information remains strictly confidential."
                  },
                  {
                    icon: <Lock size={28} weight="duotone" />,
                    title: "Consent-First Approach",
                    description: "Every data interaction requires your explicit, informed consent."
                  },
                  {
                    icon: <CheckCircle size={28} weight="duotone" />,
                    title: "Transparency Guaranteed",
                    description: "Full visibility into how, when, and why your data might be used."
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-background/50 p-4 rounded-lg border border-primary/10 flex items-start gap-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="text-primary opacity-80">{item.icon}</div>
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <blockquote className="text-lg md:text-xl font-medium text-foreground italic opacity-80 mx-auto">
                  "Privacy isn't a feature we add—it's the core principle we never compromise."
                </blockquote>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}