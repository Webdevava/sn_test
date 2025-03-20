"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, QuestionMark, Lightbulb, Shield, Clock } from "@phosphor-icons/react/dist/ssr";

export default function FAQSection() {
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
      question: "How secure is my data?",
      answer:
        "Your data is encrypted with military-grade security and stored in a vault that only activates when conditions are met. We use end-to-end encryption and zero-knowledge architecture to ensure that only you and your designated nominees can access your information when the time is right.",
    },
    {
      icon: Clock,
      question: "What happens if I don't respond to alerts?",
      answer:
        "After five unanswered emails or notifications, your pre-set plan triggers, securely passing your assets to your nominees. This automated system ensures nothing falls through the cracks, while giving you ample opportunity to respond if you're simply on vacation or temporarily unreachable.",
    },
    {
      icon: QuestionMark,
      question: "Can I change my nominees?",
      answer:
        "Yes, you can update your nominees anytime through your secure dashboard. We've made the process simple while maintaining strict security protocols to verify your identity before any changes are made to your succession plan.",
    },
    {
      icon: Lightbulb,
      question: "Is there a limit to the assets I can add?",
      answer:
        "No limits—add as many financial, property, or personal assets as you need. Our flexible system accommodates everything from traditional assets like real estate and bank accounts to digital assets such as cryptocurrencies and online accounts.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-background py-12 md:py-16 lg:py-20"
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
                FAQs
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Everything you need to know about securing your legacy with confidence and clarity.
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