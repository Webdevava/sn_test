"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthDialog from "../dialogs/auth/auth-dialog";
import { ArrowRight } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      {/* Split background */}
      <div className="absolute inset-0">
        <div className="h-1/2 bg-transparent"></div>
        <div className="h-1/2 bg-gray-900"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl border border-primary/20 shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-12 lg:p-16 text-center">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4 text-sm font-medium">
              {t("takeControl")}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t("yourWealthYourDecisions")}
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {t("takeChargeDescription")}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <AuthDialog type="signup">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  {t("signUpHere")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </AuthDialog>
              
              <Link href="#process" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  {t("seeHowItWorks")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>{t("secureYourFinancialFuture")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}