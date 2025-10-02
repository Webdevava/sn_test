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
import { useLanguage } from "@/context/LanguageContext";

export default function WhyChooseUsSection() {
  const { t } = useLanguage();
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
      title: t("unmatchedSecurity"),
      description: t("withAes256Encryption"),
    },
    {
      icon: Lock,
      title: t("privacyYouControl"),
      description: t("hideTransactionsOrAssets"),
    },
    {
      icon: Gear,
      title: t("totalFlexibility"),
      description: t("pauseUpdateOrCancel"),
    },
    {
      icon: Bell,
      title: t("thoughtfulVerification"),
      description: t("weCheckInactivityMultiple"),
    },
    {
      icon: UserCircle,
      title: t("builtForEveryone"),
      description: t("fromFamiliesToRetirees"),
    },
    {
      icon: Heart,
      title: t("legacyWithLove"),
      description: t("realStoriesProveIt"),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden"
      id="why-choose-us"
    >
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
              {t("whyChooseUs")}
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            {t("whyWeStandOut")}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground ">
            {t("weAreMoreThanATool")}
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