"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
  Bell,
  CheckCircle,
  SlidersHorizontal,
  CaretRight,
  EnvelopeSimple,
  ChatText,
  Phone,
  BellSimple,
  ShieldCheck,
  Clock,
  UsersFour
} from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function NotificationsVerificationSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  // Simplified animations with reduced motion
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden"
      id="verification"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-12"
        >
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
                {t("verification")}
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
              {t("notificationsFinalVerification")}
            </h1>
          </motion.div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left column with cards */}
            <div className="space-y-8 grid">
              {/* No Immediate Notification */}
              <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <Bell 
                    size={32} 
                    className="text-primary flex-shrink-0" 
                    weight="duotone" 
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {t("weDoNotNotifyNomineesImmediately")}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {t("beforeReleasingAnyInformation")}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      {t("weCheckForInactivity")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Confirmation Step */}
              <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <CheckCircle 
                    size={32} 
                    className="text-primary flex-shrink-0" 
                    weight="duotone" 
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {t("finalConfirmationStep")}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {t("ifNoResponseIsReceived")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Absolute Control */}
              <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <SlidersHorizontal
                    size={32} 
                    className="text-primary flex-shrink-0" 
                    weight="duotone" 
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {t("absoluteControl")}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {t("youCanPauseUpdateOrCancel")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column with redesigned illustration and emphasis */}
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 rounded-2xl border border-primary/20 shadow-xl overflow-hidden">
            
            
            <div className="p-8 relative z-10">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <defs>
                    <pattern id="verification-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
                      <path 
                        d="M0 0 L100 0 L0 100 Z" 
                        fill="currentColor" 
                        fillOpacity="0.1"
                      />
                      <path 
                        d="M100 0 L0 100 L100 100 Z" 
                        fill="currentColor" 
                        fillOpacity="0.1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#verification-pattern)" />
                </svg>
              </div>

              <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                      <ShieldCheck size={32} weight="duotone" className="text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                      {t("foolproofVerification")}
                    </h3>
                  </div>

              {/* Content Container */}
              <div className="relative z-20 grid md:grid-cols-2 gap-8 items-center">
                {/* Left Column - Detailed Explanation */}
                <div>
 

                  <div className="space-y-4">
                    {[
                      {
                        icon: <Clock size={24} weight="duotone" />,
                        title: t("multiStageConfirmation"),
                        description: t("rigorous3StageVerification")
                      },
                      {
                        icon: <UsersFour size={24} weight="duotone" />,
                        title: t("nomineeNetworkProtection"),
                        description: t("comprehensiveChecksToEnsure")
                      },
                      {
                        icon: <ShieldCheck size={24} weight="duotone" />,
                        title: t("continuousMonitoring"),
                        description: t("ongoingVerificationAndSecurity")
                      }
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 p-4 bg-background/50 rounded-lg border border-primary/10 hover:shadow-md transition-all duration-300"
                      >
                        <div className="text-primary opacity-80">{item.icon}</div>
                        <div>
                          <h4 className="text-base font-semibold text-foreground mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Verification Flow */}
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h4 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                    <CheckCircle weight="duotone" className="text-primary mr-3" size={24} />
                    {t("verificationFlow")}
                  </h4>

                  <div className="space-y-4">
                    {[
                      { 
                        step: t("initialTrigger"), 
                        description: t("inactivityDetected"),
                        status: "pending"
                      },
                      { 
                        step: t("notificationWave"), 
                        description: t("multiChannelAlerts"),
                        status: "pending"
                      },
                      { 
                        step: t("responseWindow"), 
                        description: t("waitingForConfirmation"),
                        status: "pending"
                      },
                      { 
                        step: t("finalVerification"), 
                        description: t("nomineeAuthentication"),
                        status: "completed"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-3 h-3 mr-3 rounded-full ${
                          item.status === 'completed' 
                            ? 'bg-primary' 
                            : 'bg-muted-foreground/30'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground text-sm">{item.step}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-8 text-center">
                <blockquote className="text-lg md:text-xl font-medium text-foreground italic opacity-80 max-w-2xl mx-auto">
                  {t("securityIsNotAProduct")}
                </blockquote>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}