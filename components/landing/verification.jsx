"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "@phosphor-icons/react";
import { useRef } from "react";

export default function NotificationsVerificationSection() {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
    ref={sectionRef}
    className="bg-background py-12 md:py-16 lg:py-20 relative overflow-hidden"
    id="verification"
  >
      <div className="container mx-auto px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className=" space-y-12"
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
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Left column with cards */}
            <div className="space-y-8 grid">
              {/* No Immediate Notification */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all"
              >
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
              </motion.div>

              {/* Final Confirmation Step */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all"
              >
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
              </motion.div>

              {/* Absolute Control */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all"
              >
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
              </motion.div>
            </div>

            {/* Right column with illustration and emphasis */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative p-10 bg-primary/5 rounded-2xl border border-primary/20"
              >
                {/* Decorative elements */}
                {/* <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bell size={24} className="text-primary" weight="fill" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-primary" weight="fill" />
                </div> */}

                {/* Verification illustration */}
                <div className="flex flex-col items-center space-y-4 mb-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <div
                      className="w-24 h-24 border-2 border-primary/30 border-dashed rounded-full flex items-center justify-center"
                    >
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Bell size={32} className="text-primary" weight="duotone" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 my-4">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Email</Badge>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">SMS</Badge>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Call</Badge>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">In-App</Badge>
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

                {/* Verification Timeline */}
                <div className="mt-8">
                  <div className="relative pl-8  space-y-4">
                    <div className="relative">
                      <div className="absolute -left-10 top-1 w-4 h-4 bg-primary rounded-full"></div>
                      <div className="w-0.5 h-8 bg-primary/20 absolute -left-[2.05rem] top-2"></div>
                      <p className="text-sm text-muted-foreground">First notification sent</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 top-1 w-4 h-4 bg-primary rounded-full"></div>
                      <div className="w-0.5 h-8 bg-primary/20 absolute -left-[2.05rem] top-2"></div>
                      <p className="text-sm text-muted-foreground">Follow-up check</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 top-1 w-4 h-4 bg-primary rounded-full"></div>
                      <div className="w-0.5 h-8 bg-primary/20 absolute -left-[2.05rem] top-2"></div>
                      <p className="text-sm text-muted-foreground">Final verification</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 top-1 w-4 h-4 bg-primary/40 rounded-full border-2 border-primary"></div>
                      <p className="text-sm font-medium text-primary">Nominee notification</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}