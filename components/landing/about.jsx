"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  const sectionVariants = {
    highlighter: { opacity: 0, x: -50 },
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      x: 0,
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
      className="flex items-center py-12 md:py-16 lg:py-20"
      id="about-us"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="bg-gradient-to-r from-primary/35 via-primary/15 to-transparent w-fit px-3 py-1 rounded-md">
              <h2 className="text-sm md:text-base font-medium text-primary tracking-wide">
                {t("aboutUs")}
              </h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {t("whyWeExist")}
              </h1>
              <div className="space-y-3">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-prose">
                  {t("lifeIsUnpredictable")}
                </p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                {t("whatSetsUsApart")}
              </h3>
              <ul className="space-y-3 md:space-y-4 text-base md:text-lg text-muted-foreground list-disc pl-5">
                <li>
                  <span className="font-semibold text-foreground">
                    {t("weDontJustStoreData")}{" "}
                  </span>
                  {t("weDonNotJustStoreDataDescription")}
                </li>
                <li>
                  <span className="font-semibold text-foreground">
                    {t("weVerifyBeforeWeShare")}{" "}
                  </span>
                  {t("weVerifyBeforeWeShareDescription")}
                </li>
                <li>
                  <span className="font-semibold text-foreground">
                    {t("yourPrivacyIsOurPriority")}{" "}
                  </span>
                  {t("yourPrivacyIsOurPriorityDescription")}
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative w-full h-[250px] sm:h-[300px] md:h-[300px] lg:h-[500px]"
          >
            <Image
              src="/images/about.png"
              alt={t("aboutUs")}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}