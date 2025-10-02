"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";

const Term = () => {
  const { t } = useLanguage();

  return (
    <section className="lg:px-8" id="FAQ">
      <div className="container mx-auto mb-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Header */}
          <div className="w-full md:w-1/3 text-left">
            <h2 className="text-lg font-bold mt-4 mb-2">{t("termsAndConditions")}</h2>
          </div>
          <div className="w-full md:w-2/3">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base">{t("introduction")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("introductionDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("userEligibility")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("userEligibilityDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("accountRegistration")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("accountRegistrationDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("useOfServices")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("useOfServicesDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("dataAccuracy")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("dataAccuracyDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("securityAndCompliance")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("securityAndComplianceDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("terminationOfServices")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("terminationOfServicesDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("limitationOfLiability")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("limitationOfLiabilityDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("changesToTerms")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("changesToTermsDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Term;