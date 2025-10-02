"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";

const Policy = () => {
  const { t } = useLanguage();

  return (
    <section className="lg:px-8" id="FAQ">
      <div className="container mx-auto mb-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Header */}
          <div className="w-full md:w-1/3 text-left">
            <h2 className="text-lg font-bold mt-4 mb-2">{t("privacyPolicy")}</h2>
          </div>
          <div className="w-full md:w-2/3">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base">{t("dataCollection")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("dataCollectionDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("useOfData")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("useOfDataDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("dataProtection")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("dataProtectionDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("thirdPartyServices")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("thirdPartyServicesDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("cookiesAndTracking")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("cookiesAndTrackingDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("userRights")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("userRightsDescription")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-base">{t("policyUpdates")}</h3>
                <p className="text-xs opacity-75 mt-2">{t("policyUpdatesDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Policy;