"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import styles from "./FeaturesSection.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function FeaturesSection() {
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
      },
    },
  };

  const features = [
    {
      title: t("secureAssetDebtStorage"),
      description: t("secureAssetDebtStorageDescription"),
      icon: "/icons/features/1.svg",
    },
    {
      title: t("nomineeManagement"),
      description: t("nomineeManagementDescription"),
      icon: "/icons/features/2.svg",
    },
    {
      title: t("smartInactivityDetection"),
      description: t("smartInactivityDetectionDescription"),
      icon: "/icons/features/3.svg",
    },
    {
      title: t("hiddenOrDelayedAssetDisclosure"),
      description: t("hiddenOrDelayedAssetDisclosureDescription"),
      icon: "/icons/features/4.svg",
    },
    {
      title: t("unaccountedTransactions"),
      description: t("unaccountedTransactionsDescription"),
      icon: "/icons/features/5.svg",
    },
    {
      title: t("insightsReports"),
      description: t("insightsReportsDescription"),
      icon: "/icons/features/6.svg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20"
      id="features"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6 md:space-y-8 mb-10 md:mb-14"
        >
          <div className="bg-gradient-to-r from-primary/35 via-primary/15 to-transparent w-fit px-3 py-1 rounded-md">
            <h2 className="text-sm md:text-base font-medium text-primary tracking-wide">
              {t("keyFeatures")}
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t("ourTopKeyFeatures")}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-card border border-primary/10 rounded-lg overflow-hidden flex flex-col hover:bg-white transition-colors duration-300"
            >
              <div className="w-full h-40 sm:h-48 md:h-56 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
                <img 
                  src={feature.icon} 
                  alt={feature.title} 
                  className="w-32 h-32 md:w-40 md:h-40"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}