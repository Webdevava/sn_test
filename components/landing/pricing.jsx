"use client";

import { motion } from "framer-motion";
import { Check, X, CaretUp, Crown, Star, Table, Calendar } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useRef, useState } from "react";
import AuthDialog from "../dialogs/auth/auth-dialog";
import { useLanguage } from "@/context/LanguageContext";

export default function PricingSection() {
  const { t } = useLanguage();
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
      name: t("free"),
      price: "₹0",
      period: t("perMonth"),
      icon: CaretUp,
      tagline: t("basicFeatures"),
      features: [
        { text: t("limitedPersonalDataStorage"), available: true },
        { text: t("basicAccountTracking"), available: true },
        { text: t("oneNominee"), available: true },
        { text: t("inactivityVerification"), available: true },
        { text: t("advancedFeatures"), available: false },
      ],
    },
    {
      name: t("standard"),
      price: "₹9",
      period: t("perMonth"),
      icon: Star,
      tagline: t("mostPopularChoice"),
      features: [
        { text: t("fullFinancialAssetTracking"), available: true },
        { text: t("upTo5Nominees"), available: true },
        { text: t("10DocumentStorage"), available: true },
        { text: t("customTimeDelayForNominees"), available: true },
        { text: t("prioritySupport"), available: true },
      ],
      highlighted: true,
    },
    {
      name: t("premium"),
      price: "₹49",
      period: t("perMonth"),
      icon: Crown,
      tagline: t("completeProtection"),
      badge: t("oneMonthFree"),
      features: [
        { text: t("unlimitedStorageNominees"), available: true },
        { text: t("hiddenTransactionStorage"), available: true },
        { text: t("advancedAnalyticsReports"), available: true },
        { text: t("customizableNotifications"), available: true },
        { text: t("premiumSupportSecurity"), available: true },
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
      className="py-8 md:py-12 lg:py-16"
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
              {t("pricing")}
            </h2>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {t("pricingPlans")}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl ">
            {t("flexiblePlans")}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid grid-cols-2 w-48 sm:w-56 mx-auto mb-6 md:mb-8">
            <TabsTrigger value="plans" className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar size={16} weight="duotone" />
              {t("plans")}
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 text-xs sm:text-sm">
              <Table size={16} weight="duotone" />
              {t("compare")}
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
                      {t("feature")}
                    </th>
                    <th className="p-3 sm:p-4 text-center font-semibold text-sm sm:text-lg text-foreground border-b w-20 sm:w-24">
                      <div className="flex flex-col items-center">
                        <CaretUp size={16} weight="duotone" className="mb-1" />
                        {t("free")}
                      </div>
                    </th>
                    <th className="p-3 sm:p-4 text-center font-semibold text-sm sm:text-lg text-primary border-b w-20 sm:w-24">
                      <div className="flex flex-col items-center">
                        <Star size={16} weight="duotone" className="mb-1" />
                        {t("standard")}
                      </div>
                    </th>
                    <th className="p-3 sm:p-4 text-center font-semibold text-sm sm:text-lg text-foreground border-b w-20 sm:w-24">
                      <div className="flex flex-col items-center">
                        <Crown size={16} weight="duotone" className="mb-1" />
                        {t("premium")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Storage Features */}
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="p-2 sm:p-3 pl-4 font-medium text-foreground text-sm sm:text-base">
                      {t("storageFeatures")}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("securePersonalDataStorage")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("limited")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("bankAccountsFDRDEPFPFTracking")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("limited")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("insuranceLifeHealthVehicleEtc")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("limited")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("investmentsStocksMutualFundsCrypto")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("goldSilverOrnamentsAssetTracking")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("propertyUtilityBillManagement")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>

                  {/* Nominee & Security Features */}
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="p-2 sm:p-3 pl-4 font-medium text-foreground text-sm sm:text-base">
                      {t("nomineeSecurityFeatures")}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("nomineeAssignmentNotifications")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("oneNominee")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("upTo5")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("unlimited")}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("secureDocumentUploadStorage")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("upTo10Docs")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("unlimited")}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("inactivityVerificationTripleCheck")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("customTimeDelayForNomineeDisclosure")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>

                  {/* Advanced Features */}
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="p-2 sm:p-3 pl-4 font-medium text-foreground text-sm sm:text-base">
                      {t("advancedFeatures")}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("alertsRemindersForFinancialPlanning")}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{t("limited")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("advancedAnalyticsReports")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("downloadablePDFExcelReports")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("undocumentedMoneyHiddenTransactionsStorage")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("24/7PriorityCustomerSupport")}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(false)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                    <td className="p-2 sm:p-3 text-center">{renderFeatureValue(true)}</td>
                  </tr>
                  <tr className="border-b border-primary/20 hover:bg-muted/20 transition-colors">
                    <td className="p-2 sm:p-3 pl-4 text-xs sm:text-sm">{t("customizableNotificationPreferences")}</td>
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
                      <AuthDialog type="signup">
                      <Button
                        className={`w-full py-3 sm:py-4 rounded-lg font-medium text-xs sm:text-sm
                          ${isActive
                            ? index === 1
                              ? "bg-white text-primary hover:bg-white/90"
                              : "bg-primary text-white hover:bg-primary/90"
                            : "bg-muted text-foreground hover:bg-muted/80"}`}
                      >
                        {index === 0 ? t("signUpFree") : isActive ? t("getStartedNow") : t("selectPlan")}
                      </Button></AuthDialog>
                      <p className={`text-center text-xs mt-2 ${index === 1 ? "text-white/80" : "text-muted-foreground"}`}>
                        {index === 0 ? t("noPaymentRequired") : t("noCreditCardRequired")}
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
          <h4 className="font-semibold text-foreground text-sm sm:text-base">{t("allPlansInclude")}</h4>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            {t("industryLeadingSecurity")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}