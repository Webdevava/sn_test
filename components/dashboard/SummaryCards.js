"use client";

import { useState, useEffect } from "react";
import { getFinancialSummary, getFinancialCount } from "@/lib/dashboard-api";
import { useLanguage } from "@/context/LanguageContext";

// Import SVG icons
import NetWorthIcon from "@/public/icons/net-worth.svg";
import TotalAssetsIcon from "@/public/icons/total-assets.svg";
import TotalLiabilitiesIcon from "@/public/icons/total-liabilities.svg";
import NomineesIcon from "@/public/icons/nominees.svg";
import FinancialAssetsIcon from "@/public/icons/financial-assets.svg";
import PoliciesIcon from "@/public/icons/policies.svg";
import SummaryCard from "../cards/summary-card";

export default function SummaryCards() {
  const { t } = useLanguage(); // ✅ use translation helper

  const [financialData, setFinancialData] = useState({
    netWorth: "0",
    totalAssets: "0",
    totalLiabilities: "0",
    nominees: 0,
    financialAssets: 0,
    policies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryResponse, countResponse] = await Promise.all([
          getFinancialSummary(),
          getFinancialCount(),
        ]);

        if (summaryResponse.status && countResponse.status) {
          const summaryData = summaryResponse.data || {};
          const countData = countResponse.data || {};

          setFinancialData({
            netWorth: parseFloat(summaryData.net_worth || "0").toFixed(2),
            totalAssets: parseFloat(summaryData.total_assets || "0").toFixed(2),
            totalLiabilities: parseFloat(summaryData.total_liabilities || "0").toFixed(2),
            nominees: countData.nominees || 0,
            financialAssets: countData.financial_assets || 0,
            policies: countData.policies || 0,
          });
        }
      } catch (err) {
        setError(t("failedLoadFinancial")); // ✅ translated error
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return <div className="text-center p-4">{t("loadingFinancial")}</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  const summaryCards = [
    {
      title: t("netWorth"),
      value: financialData.netWorth,
      icon: NetWorthIcon,
      isCurrency: true,
    },
    {
      title: t("totalAssets"),
      value: financialData.totalAssets,
      icon: TotalAssetsIcon,
      isCurrency: true,
    },
    {
      title: t("totalLiabilities"),
      value: financialData.totalLiabilities,
      icon: TotalLiabilitiesIcon,
      isCurrency: true,
    },
    {
      title: t("nominees"),
      value: financialData.nominees,
      icon: NomineesIcon,
      isCurrency: false,
    },
    {
      title: t("financialAssets"),
      value: financialData.financialAssets,
      icon: FinancialAssetsIcon,
      isCurrency: false,
    },
    {
      title: t("policies"),
      value: financialData.policies,
      icon: PoliciesIcon,
      isCurrency: false,
    },
  ];

  return (
    <div
      className="grid gap-3 w-full"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
    >
      {summaryCards.map((card, index) => (
        <SummaryCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          isCurrency={card.isCurrency}
        />
      ))}
    </div>
  );
}
