"use client";

import { motion } from "framer-motion";
import { Check, X, CaretUp, Crown, Star, Table, Calendar } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useRef, useState } from "react";

export default function PricingSection() {
  const sectionRef = useRef(null);
  const [activePlan, setActivePlan] = useState(1); // Default to Standard plan

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

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      icon: CaretUp,
      tagline: "Basic features",
      features: [
        { text: "Limited Personal Data Storage", available: true },
        { text: "Basic Account Tracking", available: true },
        { text: "1 Nominee", available: true },
        { text: "Inactivity Verification", available: true },
        { text: "Advanced Features", available: false },
      ],
    },
    {
      name: "Standard",
      price: "₹9",
      period: "/month",
      icon: Star,
      tagline: "Most popular choice",
      features: [
        { text: "Full Financial Asset Tracking", available: true },
        { text: "Up to 5 Nominees", available: true },
        { text: "10 Document Storage", available: true },
        { text: "Custom Time Delay for Nominees", available: true },
        { text: "24/7 Priority Support", available: true },
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "₹49",
      period: "/month",
      icon: Crown,
      tagline: "Complete protection",
      badge: "1 Month FREE",
      features: [
        { text: "Unlimited Storage & Nominees", available: true },
        { text: "Hidden Transaction Storage", available: true },
        { text: "Advanced Analytics & Reports", available: true },
        { text: "Customizable Notifications", available: true },
        { text: "Premium Support & Security", available: true },
      ],
    },
  ];

  const renderFeatureValue = (value) => {
    if (value === true) {
      return <Check size={20} weight="bold" className="text-green-500 mx-auto" />;
    } else if (value === false) {
      return <X size={20} className="text-red-500 mx-auto" />;
    } else {
      return <span className="text-sm font-medium">{value}</span>;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bg-background py-8 md:py-12 lg:py-16"
      id="pricing"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-4 md:space-y-6 mb-8 md:mb-12 text-left"
        >
          <div className="bg-gradient-to-r from-primary/35 via-primary/15 to-transparent w-fit px-3 py-1 rounded-md ">
            <h2 className="text-sm md:text-base font-medium text-primary tracking-wide">
              Pricing
            </h2>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Pricing Plans
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl ">
            Flexible plans to suit your needs. Choose what fits you best and get the security and control you deserve.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid grid-cols-2 w-48 sm:w-56 mx-auto mb-6 md:mb-8">
            <TabsTrigger value="plans" className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar size={16} weight="duotone" />
              Plans
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 text-xs sm:text-sm">
              <Table size={16} weight="duotone" />
              Compare
            </TabsTrigger>
          </TabsList>

          {/* Comparison Table */}
          <TabsContent value="comparison">
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="overflow-x-auto bg-card rounded-lg border border-primary/10 shadow-sm"
            >
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-muted/70">
                    <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-lg text-foreground border-b">
                      Feature
                    </th>
                    <th className="p-3 sm:p-4 text-center font-semibold text-sm sm:text-lg text-foreground border-b w-20 sm:w-24">
                      <div className="flex flex-col items-center">
                        <CaretUp size={16} weight="duotone" className="mb-1" />
                        Free
                      </div>
                    </th>
                    <th className="p-3 sm:p-4 text-center font-semibold text-sm sm:text-lg text-primary border-b w-20 sm:w-24">
                      <div className="flex flex-col items-center">
                        <Star size={16} weight="duotone" className="mb-1" />
                        Standard
                      </div>
                    </th>
                    <th className="p-3 sm:p-4 text-center font-semibold text-sm sm:text-lg text-foreground border-b w-20 sm:w-24">
                      <div className="flex flex-col items-center">
                        <Crown size={16} weight="duotone" className="mb-1" />
                        Premium
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Storage Features */}
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="p-2 sm:p-3 pl-4 font-medium text-foreground text-sm sm:text-base">
                      Storage Features
                    </td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Secure Personal Data Storage</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Limited</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Bank Accounts, FD/RD, EPF/PPF Tracking</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Limited</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Insurance (Life, Health, Vehicle, etc.)</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Limited</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Investments (Stocks, Mutual Funds, Crypto)</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Gold/Silver/Ornaments Asset Tracking</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Property & Utility Bill Management</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>

                  {/* Nominee & Security Features */}
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="p-2 sm:p-3 pl-4 font-medium text-foreground text-sm sm:text-base">
                      Nominee & Security Features
                    </td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Nominee Assignment & Notifications</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">1 Nominee</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Up to 5</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Unlimited</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Secure Document Upload & Storage</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Up to 10 Docs</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Unlimited</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Inactivity Verification (Triple Check)</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Custom Time Delay for Nominee Disclosure</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>

                  {/* Advanced Features */}
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="p-2 sm:p-3 pl-4 font-medium text-foreground text-sm sm:text-base">
                      Advanced Features
                    </td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Alerts & Reminders for Financial Planning</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">Limited</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Advanced Analytics & Reports</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Downloadable PDF/Excel Reports</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Undocumented Money & Hidden Transactions Storage</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">24/7 Priority Customer Support</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">Customizable Notification Preferences</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </TabsContent>

          {/* Plans Cards */}
          <TabsContent value="plans">
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 mt-6"
            >
              {plans.map((plan, index) => {
                const isActive = activePlan === index;
                const bgColor = index === 1 ? "bg-primary" : "bg-card";

                return (
                  <motion.div
                    key={index}
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    onClick={() => setActivePlan(index)}
                    className={`relative rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-80 overflow-hidden border border-primary/10 transition-colors duration-300 cursor-pointer
                      ${bgColor} ${isActive ? "shadow-lg scale-105" : "hover:shadow-md"}`}
                  >
                    {/* Plan Header */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-base sm:text-lg md:text-xl font-semibold ${index === 1 ? "text-white" : "text-foreground"}`}>
                            {plan.name}
                          </h3>
                          <p className={`text-xs sm:text-sm mt-1 ${index === 1 ? "text-white/80" : "text-muted-foreground"}`}>
                            {plan.tagline}
                          </p>
                        </div>
                        <plan.icon
                          size={20} sm={24}
                          weight="duotone"
                          className={index === 1 ? "text-white/90" : "text-primary"}
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 flex items-baseline">
                        <span className={`text-2xl sm:text-3xl font-bold ${index === 1 ? "text-white" : "text-foreground"}`}>
                          {plan.price}
                        </span>
                        <span className={`ml-1 text-xs sm:text-sm ${index === 1 ? "text-white/80" : "text-muted-foreground"}`}>
                          {plan.period}
                        </span>
                      </div>
                      {plan.badge && (
                        <div className="absolute bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full top-2 right-2">
                          {plan.badge}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                      {plan.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 sm:gap-3"
                        >
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center
                              ${feature.available ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                          >
                            {feature.available ? (
                              <Check size={10} sm={12} weight="bold" />
                            ) : (
                              <X size={10} sm={12} />
                            )}
                          </div>
                          <span className={`text-xs sm:text-sm font-medium ${index === 1 ? "text-white/90" : "text-foreground"}`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="p-4 sm:p-6 pt-0">
                      <Button
                        className={`w-full py-3 sm:py-4 rounded-lg font-medium text-xs sm:text-sm
                          ${isActive
                            ? index === 1
                              ? "bg-white text-primary hover:bg-white/90"
                              : "bg-primary text-white hover:bg-primary/90"
                            : "bg-muted text-foreground hover:bg-muted/80"}`}
                      >
                        {index === 0 ? "Sign Up Free" : isActive ? "Get Started Now" : "Select Plan"}
                      </Button>
                      <p className={`text-center text-xs mt-2 ${index === 1 ? "text-white/80" : "text-muted-foreground"}`}>
                        {index === 0 ? "No payment required" : "No credit card required for 14-day trial"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Additional Info */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 sm:mt-10 md:mt-12 bg-muted/30 p-4 sm:p-6 rounded-lg border border-primary/10 text-center max-w-3xl mx-auto"
        >
          <h4 className="font-semibold text-foreground text-sm sm:text-base">All plans include:</h4>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            Industry-leading security, inactivity verification, data encryption, 24/7 monitoring, and 30-day money-back guarantee.
          </p>
        </motion.div>
      </div>
    </section>
  );
}