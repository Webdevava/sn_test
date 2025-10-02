"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, QuestionMark, Lightbulb, Shield, Clock } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/context/LanguageContext";

export default function FAQSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(null);
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

  const faqs = [
    {
      icon: Shield,
      question: t("howSecureIsMyDataFaq"),
      answer: t("howSecureIsMyDataFaqDescription"),
    },
    {
      icon: Clock,
      question: t("whatHappensIfIDontRespond"),
      answer: t("whatHappensIfIDontRespondDescription"),
    },
    {
      icon: QuestionMark,
      question: t("canIChangeMyNominees"),
      answer: t("canIChangeMyNomineesDescription"),
    },
    {
      icon: Lightbulb,
      question: t("isThereALimitToAssets"),
      answer: t("isThereALimitToAssetsDescription"),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20"
      id="faq"
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
                {t("faq")}
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t("frequentlyAskedQuestions")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              {t("everythingYouNeedToKnow")}
            </p>
          </motion.div>

          {/* FAQs - Right Side on Large Screens */}
          <div className="lg:w-1/2 space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-xl overflow-hidden bg-white border border-primary/10 hover:bg-white/50 transition-colors duration-300 group"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <faq.icon size={24} className="group-hover:text-primary transition-colors duration-300" weight="duotone" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold group-hover:text-primary text-foreground transition-colors duration-300">
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="group-hover:text-primary transition-colors duration-300"
                    >
                      <CaretDown size={24} weight="bold" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-6 pt-6 border-t border-primary/20">
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}