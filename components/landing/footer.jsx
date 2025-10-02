"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Envelope,
  Phone,
  MapPin,
  ArrowRight,
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
  Globe,
} from "@phosphor-icons/react/dist/ssr";
import { useState, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext"; // Import useLanguage hook
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming you have a Select component from shadcn/ui

export default function Footer() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [email, setEmail] = useState("");
  const footerRef = useRef(null);
  const { language, setLanguage, t } = useLanguage(); // Use the language context

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
    alert(t("thanksForSubscribing")); // Use translation for alert
  };

  const [wavePosition, setWavePosition] = useState(50);

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const x = e.clientX - container.getBoundingClientRect().left;
    const relativeX = (x / container.offsetWidth) * 100;
    setWavePosition(relativeX);
  };

  const socialLinks = [
    {
      Icon: InstagramLogo,
      url: "https://www.instagram.com/makeuttaradhikari?igsh=MWdzM2pnOTFxdGV0ag==",
    },
    {
      Icon: FacebookLogo,
      url: "https://www.facebook.com/share/1ADV2EenHa/",
    },
    {
      Icon: YoutubeLogo,
      url: "http://www.youtube.com/@uttaradhikari2025",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-gray-900 relative overflow-hidden pt-20 text-gray-200"
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute top-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${wavePosition}% 0%, 
                      rgba(var(--primary-rgb), 0.3) 0%, 
                      rgba(var(--primary-rgb), 0.1) 30%, 
                      rgba(31, 41, 55, 1) 70%)`,
        }}
      />

      <div className="container mx-auto px-6 relative z-20">
        <motion.div
          style={{ translateY, opacity }}
          className="grid md:grid-cols-12 gap-x-8 gap-y-12"
        >
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/logos/logo_white_lg.png"
                alt="Uttaradhikari Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>

            <p className="text-gray-400">
              {t("footerDescription")} {/* Translated description */}
            </p>

            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <Globe size={20} className="text-primary" />
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value)}
              >
                <SelectTrigger className="w-32 bg-gray-800 text-gray-200 border-gray-700 focus:ring-primary">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary/20 hover:text-primary transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-100 mb-6 relative">
              {t("quickLinks")} {/* Translated heading */}
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-primary/70 rounded-full" />
            </h4>
            <ul className="space-y-3 text-gray-400">
              {["home", "aboutUs", "keyFeatures", "pricing", "faq"].map(
                (link, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="hover:text-primary transition-colors inline-flex items-center"
                    >
                      <ArrowRight
                        size={12}
                        className="mr-2 opacity-0 group-hover:opacity-100"
                      />
                      {t(link)} {/* Translated links */}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-100 mb-6 relative">
              {t("resources")} {/* Translated heading */}
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-primary/70 rounded-full" />
            </h4>
            <ul className="space-y-3 text-gray-400">
              {["Blog", "Help Center", "Privacy", "Terms", "Sitemap"].map(
                (link, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="hover:text-primary transition-colors inline-flex items-center"
                    >
                      <ArrowRight
                        size={12}
                        className="mr-2 opacity-0 group-hover:opacity-100"
                      />
                      {link} {/* These can be translated if added to JSON */}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-lg font-semibold text-gray-100 mb-6 relative">
              {t("stayUpdated")} {/* Translated heading */}
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-primary/70 rounded-full" />
            </h4>
            <p className="text-gray-400 mb-4">
              {t("subscribeDescription")} {/* Translated description */}
            </p>

            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")} 
                  className={`bg-gray-800 text-gray-200 p-3 pr-12 rounded-lg border ${
                    emailFocus
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-700"
                  } w-full focus:outline-none transition-all`}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  required
                />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </form>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Envelope size={16} className="text-primary" />
                </div>
                <span className="text-gray-400">info@uttaradhikari.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Phone size={16} className="text-primary" />
                </div>
                <span className="text-gray-400">+91 8788335151</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <span className="text-gray-400">
                  {t("address")} {/* Translated address */}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="py-6 text-center text-gray-500 text-sm relative z-10 border-t border-gray-800 mt-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {new Date().getFullYear()} Uttaradhikari. {t("allRightsReserved")} {/* Translated */}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">
                {t("privacyPolicy")} {/* Translated */}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("termsOfService")} {/* Translated */}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("cookies")} {/* Translated */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}