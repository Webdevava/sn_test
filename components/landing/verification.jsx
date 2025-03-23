"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  SlidersHorizontal,
  CaretRight,
  EnvelopeSimple,
  ChatText,
  Phone,
  BellSimple
} from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function NotificationsVerificationSection() {
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
                Verification
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
              Notifications & Final Verification
            </h1>
          </motion.div>

          {/* Main content */}
          <div className="grid md:grid-cols-2 gap-8">
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
                      We DO NOT Notify Nominees Immediately
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Before releasing any information, we send notifications to your preferred communication channels (Email, SMS, Calls, In-App Alerts).
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      We check for inactivity at least 3 times across multiple days before any disclosure.
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
                      Final Confirmation Step
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      If no response is received, we proceed with data transfer to your nominees—but ONLY according to your predefined settings.
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
                      Absolute Control
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      You can pause, update, or cancel nominee disclosure settings at any time before inactivity is confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column with redesigned illustration and emphasis */}
            <div className="flex flex-col justify-center">
              <div className="p-8 bg-primary/5 rounded-xl border border-primary/20">
                {/* Verification illustration - redesigned with a better notification visualization */}
                <div className="mb-8">
                  <div className="bg-card p-5 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-4 flex items-center">
                      <Bell weight="duotone" className="text-primary mr-2" size={20} />
                      Notification Channels
                    </h4>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <div className="flex items-center bg-primary/10 px-4 py-2 rounded-full">
                        <EnvelopeSimple size={18} className="text-primary mr-2" weight="duotone" />
                        <span className="text-sm font-medium text-primary">Email</span>
                      </div>
                      
                      <div className="flex items-center bg-primary/10 px-4 py-2 rounded-full">
                        <ChatText size={18} className="text-primary mr-2" weight="duotone" />
                        <span className="text-sm font-medium text-primary">SMS</span>
                      </div>
                      
                      <div className="flex items-center bg-primary/10 px-4 py-2 rounded-full">
                        <Phone size={18} className="text-primary mr-2" weight="duotone" />
                        <span className="text-sm font-medium text-primary">Call</span>
                      </div>
                      
                      <div className="flex items-center bg-primary/10 px-4 py-2 rounded-full">
                        <BellSimple size={18} className="text-primary mr-2" weight="duotone" />
                        <span className="text-sm font-medium text-primary">In-App</span>
                      </div>
                    </div>
                    
                  </div>
                </div>



                {/* Verification Timeline - redesigned to match card style */}
                <div className="my-8 bg-card p-5 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-4 flex items-center">
                    <CheckCircle weight="duotone" className="text-primary mr-2" size={20} />
                    Verification Process
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <CaretRight size={14} className="text-primary" weight="bold" />
                      </div>
                      <p className="text-sm text-muted-foreground">First notification sent</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <CaretRight size={14} className="text-primary" weight="bold" />
                      </div>
                      <p className="text-sm text-muted-foreground">Follow-up check</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <CaretRight size={14} className="text-primary" weight="bold" />
                      </div>
                      <p className="text-sm text-muted-foreground">Final verification</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3">
                        <CheckCircle size={14} className="text-white" weight="fill" />
                      </div>
                      <p className="text-sm font-medium text-primary">Nominee notification</p>
                    </div>
                  </div>
                </div>

                                {/* Quote */}
                                <Alert className="bg-primary/10 border-primary/20">
                  <AlertTitle className="text-foreground font-semibold text-lg">
                    Your Peace of Mind
                  </AlertTitle>
                  <AlertDescription className="text-foreground/80 text-lg italic">
                    "You are always in control, even when you're not around."
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}