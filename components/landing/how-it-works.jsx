"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProcessSection() {
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

  const steps = [
    {
      step: "1",
      title: t("signUpSecureYourProfile"),
      description: t("yourDataIsEncrypted"),
    },
    {
      step: "2",
      title: t("addOrganizeYourInformation"),
      description: t("storeAllYourAssets"),
    },
    {
      step: "3",
      title: t("setRulesForAccessNotifications"),
      description: t("youControlWhenAndHow"),
    },
    {
      step: "4",
      title: t("smartInactivityTracking"),
      description: t("weAttemptContact"),
    },
    {
      step: "5",
      title: t("dataIsSharedOnlyWhenNecessary"),
      description: t("ifWeConfirmSomething"),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20"
      id="process"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* Heading - Left Side on Large Screens */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6 md:space-y-8 mb-10 md:mb-14 lg:mb-0 lg:w-1/2"
          >
            <div className="bg-gradient-to-r from-primary/35 via-primary/15 to-transparent w-fit px-3 py-1 rounded-md">
              <h2 className="text-sm md:text-base font-medium text-primary tracking-wide">
                {t("ourProcess")}
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t("howItWorksTheSafetyProcess")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t("weveCreatedASecure")}
            </p>
          </motion.div>

          {/* Timeline - Right Side on Large Screens */}
          <div className="lg:w-1/2">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative mb-8 last:mb-0"
              >
                <div className="flex items-start">
                  {/* Step Number Circle */}
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mr-4 relative z-10">
                    <span className="text-xl font-bold text-primary">
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Vertical Line */}
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-14 bg-primary/20 absolute left-8 top-16"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}