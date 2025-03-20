"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
  ShieldCheck,
  Lock,
  Gear,
  Bell,
  UserCircle,
  Heart,
} from "@phosphor-icons/react/dist/ssr";

export default function WhyChooseUsSection() {
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

  const reasons = [
    {
      icon: ShieldCheck,
      title: "Unmatched Security",
      description:
        "With AES-256 encryption and triple verification, your sensitive data is protected like a bank vault—never shared without your consent.",
    },
    {
      icon: Lock,
      title: "Privacy You Control",
      description:
        "Hide transactions or assets until the right time. You decide what’s revealed, when, and to whom—even after you're gone.",
    },
    {
      icon: Gear,
      title: "Total Flexibility",
      description:
        "Pause, update, or cancel nominee settings anytime. Tailor your legacy plan to fit your life, no matter your situation.",
    },
    {
      icon: Bell,
      title: "Thoughtful Verification",
      description:
        "We check inactivity multiple times via email, SMS, calls, and alerts before any disclosure, ensuring accuracy and peace of mind.",
    },
    {
      icon: UserCircle,
      title: "Built for Everyone",
      description:
        "From families to retirees, investors to property owners—our platform serves all, safeguarding what matters most to you.",
    },
    {
      icon: Heart,
      title: "Legacy with Love",
      description:
        "Real stories prove it: we help your loved ones avoid financial struggles, leaving a legacy that’s organized and secure.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-background py-12 md:py-16 lg:py-20 relative overflow-hidden"
      id="why-choose-us"
    >
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-background z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6 md:space-y-8 mb-10 md:mb-14 text-left"
        >
          <div className="bg-gradient-to-r from-primary/35 via-primary/15 to-transparent w-fit px-3 py-1 rounded-md">
            <h2 className="text-sm md:text-base font-medium text-primary tracking-wide">
              Why Choose Us
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            Why We Stand Out
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl ">
            We’re more than a tool—we’re your partner in securing your legacy with unmatched care and control.
          </p>
        </motion.div>

        {/* Highlight Stack */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
              }}
              className="bg-card rounded-lg border border-primary/10 p-6 gap-4 flex flex-row items-center shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Icon */}
              <div className="w-24 h-fit bg-primary/10 rounded-full flex  items-center justify-center">
                <reason.icon size={24} className="text-primary" weight="duotone" />
              </div>

              {/* Content */}
             <div className="w-full">
             <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                {reason.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {reason.description}
              </p>

             </div>
              {/* Highlight Effect */}
              <motion.div
                className="absolute inset-0 border-2 border-primary/20 rounded-lg opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}