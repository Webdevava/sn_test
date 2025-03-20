"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export default function ProcessSection() {
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
      title: "Sign Up & Secure Your Profile",
      description:
        "Your data is encrypted. No one—not even us—can access it without your consent.",
    },
    {
      step: "2",
      title: "Add & Organize Your Information",
      description:
        "Store all your assets, debts, transactions, and nominee details.",
    },
    {
      step: "3",
      title: "Set Rules for Access & Notifications",
      description:
        "You control when and how your family receives this information.",
    },
    {
      step: "4",
      title: "Smart Inactivity Tracking",
      description:
        "We attempt contact at least 3 times before confirming inactivity and notifying your nominee.",
    },
    {
      step: "5",
      title: "Data is Shared Only When Necessary",
      description:
        "If we confirm something has happened, only then do we securely disclose your stored information to your nominees.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-background py-12 md:py-16 lg:py-20"
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
                Our Process
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              How It Works – The Safety Process
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              We've created a secure and transparent system to protect your information while ensuring it reaches the right people at the right time.
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
                {/* Horizontal Line */}
                {/* <div className="w-1 h-10 bg-primary/20 absolute left-0 top-8"></div> */}

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