"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/context/LanguageContext";

export default function TestimonialSection() {
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

  const testimonials = [
    {
      quote: t("afterMyFathersPassing"),
      author: t("amitSharma"),
      location: t("mumbai"),
    },
    {
      quote: t("iHaveAssetsThatI"),
      author: t("nehaJadhav"),
      location: t("pune"),
    },
    {
      quote: t("iNowHaveCompletePeace"),
      author: t("shwetaRathi"),
      location: t("nagpur"),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 min-h-[48rem]"
      id="testimonials"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              {t("testimonials")}
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            {t("realStoriesRealImpact")}
          </h1>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-card rounded-lg border border-primary/10 p-6 md:p-8 flex flex-col items-start shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Quotes size={24} className="text-primary mb-4" weight="fill" />
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="mt-6 text-left">
                <p className="text-sm md:text-base font-semibold text-foreground">
                  — {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}