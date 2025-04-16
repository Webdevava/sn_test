"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import styles from "./FeaturesSection.module.css";

export default function FeaturesSection() {
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
      title: "Secure Asset & Debt Storage",
      description: (
        <>
          <em>"Your financial footprint, safeguarded until the right moment."</em> Store all your transactions, assets, debts—whether your family knows about them or not.
        </>
      ),
      icon: "/icons/features/1.svg",
    },
    {
      title: "Nominee Management & Controlled Access",
      description: (
        <>
          <em>"Your loved ones should never be left in the dark."</em>{" "}
          <strong>Assign nominees, define access levels, and control when they receive the information.</strong>
        </>
      ),
      icon: "/icons/features/2.svg",
    },
    {
      title: "Smart Inactivity Detection & Triple Confirmation System",
      description: (
        <>
          <em>"Because mistakes are not an option."</em> Before we disclose any information to your nominees,{" "}
          <strong>we verify your inactivity at least 3 times through multiple communication channels.</strong> If there is no response, only then do we share the data.
        </>
      ),
      icon: "/icons/features/3.svg",
    },
    {
      title: "Hidden or Delayed Asset Disclosure",
      description: (
        <>
          <em>"Protect your family's future the way you want."</em> Maybe you have investments you{" "}
          <strong>don't want your family to know about until the right time.</strong> Maybe you fear sudden wealth will{" "}
          <strong>make them lazy, careless, or unmotivated.</strong> You decide when and how your financial secrets are revealed.
        </>
      ),
      icon: "/icons/features/4.svg",
    },
    {
      title: "Unaccounted Transactions",
      description: (
        <>
          Your secrets, protected and revealed on your terms. If you have transactions or assets that {" "}
          <strong>you want to disclose only after your passing</strong>, you can store them here securely. No immediate reporting. No interference. Only your chosen nominee will access it—when you allow it.
        </>
      ),
      icon: "/icons/features/5.svg",
    },
    {
      title: "Insights & Reports",
      description:
        "Your financial roadmap, always clear. Understand your total assets, liabilities, and nominee allocations with advanced analytics.",
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
              Key Features
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Our Top Key Features That Empowers YOU
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