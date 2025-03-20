"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

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
      description:
        "Your financial footprint, safeguarded until the right moment. Store all your transactions, assets, debts—whether your family knows about them or not.",
      image: "/images/placeholder.svg",
    },
    {
      title: "Nominee Management & Controlled Access",
      description:
        "Your loved ones should never be left in the dark. Assign nominees, define access levels, and control when they receive the information.",
      image: "/images/placeholder.svg",
    },
    {
      title: "Smart Inactivity Detection & Triple Confirmation System",
      description:
        "Because mistakes are not an option. Before we disclose any information to your nominees, we verify your inactivity at least 3 times through multiple communication channels. If there is no response, only then do we share the data.",
      image: "/images/placeholder.svg",
    },
    {
      title: "Hidden or Delayed Asset Disclosure",
      description:
        "Protect your family's future the way you want. Maybe you have investments you don’t want your family to know about until the right time. Maybe you fear sudden wealth will make them lazy, careless, or unmotivated. You decide when and how your financial secrets are revealed.",
      image: "/images/placeholder.svg",
    },
    {
      title: "Unaccounted Transactions",
      description:
        "Your secrets, protected and revealed on your terms. If you have transactions or assets that you want to disclose only after your passing, you can store them here securely. No immediate reporting. No interference. Only your chosen nominee will access it—when you allow it.",
      image: "/images/placeholder.svg",
    },
    {
      title: "Insights & Reports",
      description:
        "Your financial roadmap, always clear. Understand your total assets, liabilities, and nominee allocations with advanced analytics.",
      image: "/images/placeholder.svg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-background py-12 md:py-16 lg:py-20"
      id="features"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
            Our Top Key Features That Empower The Users
          </h1>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white/5 border border-primary/10 rounded-lg overflow-hidden flex flex-col hover:bg-white/10 transition-colors duration-300"
            >
              <div className="relative w-full h-40 sm:h-48 md:h-56">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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