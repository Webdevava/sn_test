"use client";

import { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import mr from "@/locales/mr.json";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLanguage(savedLang);
    setTranslations(getTranslations(savedLang));
  }, []);

  const getTranslations = (lang) => {
    switch (lang) {
      case "hi":
        return hi;
      case "mr":
        return mr;
      default:
        return en;
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setTranslations(getTranslations(lang));
    localStorage.setItem("lang", lang);
  };

  // ✅ t helper
  const t = (key) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
