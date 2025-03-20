"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
  House,
  Briefcase,
  PiggyBank,
  Buildings,
  Lock,
  Person,
} from "@phosphor-icons/react/dist/ssr";

export default function AudienceSection() {
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const audienceGroups = [
    {
      icon: House,
      title: "Families & Parents",
      description:
        "Ensure your loved ones don't suffer financially if something happens to you.",
    },
    {
      icon: Briefcase,
      title: "Working Professionals",
      description:
        "Your growing wealth and assets deserve to be tracked and secured for the future.",
    },
    {
      icon: PiggyBank,
      title: "Investors & Business Owners",
      description:
        "Keep your investments and debts organized—whether disclosed or hidden.",
    },
    {
      icon: Buildings,
      title: "Property Owners",
      description:
        "Manage your real estate, rental properties, and undisclosed investments in one place.",
    },
    {
      icon: Lock,
      title: "Individuals with Unreported Assets",
      description:
        "Safeguard and control access to your confidential transactions.",
    },
    {
      icon: Person,
      title: "Retirees & Senior Citizens",
      description:
        "Leave a well-organized legacy for your family. Because they should never have to struggle to find what matters.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-background py-12 md:py-16 lg:py-20 relative overflow-hidden"
      id="audience"
    >
      {/* Subtle Radial Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-radial from-primary/5 via-background to-background" />
      </div>

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
              Our Audience
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            Who Is This For?
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Smart Nominee was designed with everyone in mind. No matter your situation, we have solutions to protect what matters most to you.
          </p>
        </motion.div>

        {/* Spotlight Carousel */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {audienceGroups.map((group, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
              }}
              className="bg-card rounded-lg border border-primary/10 p-6 flex flex-col items-center text-center shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"
              >
                <group.icon size={24} className="text-primary" weight="duotone" />
              </motion.div>

              {/* Content */}
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                {group.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {group.description}
              </p>

              {/* Spotlight Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0"
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