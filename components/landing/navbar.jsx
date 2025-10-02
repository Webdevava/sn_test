"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MenuIcon, X } from "lucide-react";
import AuthDialog from "../dialogs/auth/auth-dialog";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Ensure mobile menu closes when link is clicked
      setMobileMenuOpen(false);
      
      // Use a small timeout to ensure menu closes before scrolling
      setTimeout(() => {
        const navbarHeight = 80; // Adjust based on your navbar height
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }, 300); // Small delay to allow menu to close
    }
  };

  const calculateNavbarStyles = () => {
    const scrollThreshold = 20;
    const maxScrollEffect = 120;

    if (scrollY <= scrollThreshold) {
      return {
        opacity: 0,
        blur: 0,
        background: "transparent",
        shadow: "shadow-none",
      };
    } else {
      const progress = Math.min(
        (scrollY - scrollThreshold) / (maxScrollEffect - scrollThreshold),
        1
      );
      return {
        opacity: progress * 0.8,
        blur: progress * 12,
        background: `rgba(249, 250, 251, ${progress * 0.95})`,
      };
    }
  };

  const navStyles = calculateNavbarStyles();

  return (
    <div className="flex items-center justify-center">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: navStyles.background,
          backdropFilter: `blur(${navStyles.blur}px)`,
          WebkitBackdropFilter: `blur(${navStyles.blur}px)`,
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrollY > 20
            ? "rounded-b-xl lg:rounded-full w-full lg:w-auto lg:max-w-4xl lg:mx-auto lg:mt-2 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]"
            : "bg-transparent w-full"
        }`}
      >
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-10 h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center">
                <img
                  src={
                    scrollY > 20
                      ? "/logos/logo_sm.png"
                      : "/logos/logo_white_sm.png"
                  }
                  alt="Logo"
                  className="h-7 sm:h-8 md:h-9 lg:h-10"
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              {[
                { name: "home", href: "#home", id: "home" },
                { name: "aboutUs", href: "#about-us", id: "about-us" },
                { name: "keyFeatures", href: "#features", id: "features" },
                {
                  name: "whyChooseUs",
                  href: "#why-choose-us",
                  id: "why-choose-us",
                },
                { name: "pricing", href: "#pricing", id: "pricing" },
                { name: "faq", href: "#faq", id: "faq" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.id)}
                  className={`${
                    scrollY > 20
                      ? "text-foreground font-medium hover:text-primary text-sm lg:text-sm cursor-pointer text-nowrap "
                      : "text-white font-medium hover:text-foreground text-sm lg:text-sm cursor-pointer text-nowrap"
                  }`}
                >
                  {t(item.name)}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <AuthDialog type="login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    scrollY > 20
                      ? "text-foreground font-medium hover:text-primary text-sm lg:text-sm cursor-pointer text-nowrap "
                      : "text-white font-medium hover:text-foreground text-sm lg:text-sm cursor-pointer text-nowrap"
                  }`}
                >
                  {t("logIn")}
                </Button>
              </AuthDialog>
              <AuthDialog type="signup">
                <Button
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-500/75 text-white text-sm cursor-pointer"
                >
                  {t("signUp")}
                </Button>
              </AuthDialog>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X
                  className={`h-5 w-5 ${
                    scrollY > 20 ? "text-black" : "text-background"
                  }`}
                />
              ) : (
                <MenuIcon
                  className={`h-5 w-5 ${
                    scrollY > 20 ? "text-black" : "text-background"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white border-t border-slate-100"
        >
          <div className="container mx-auto px-4 pt-2 pb-4 space-y-1">
            {[
              { name: "home", id: "home" },
              { name: "aboutUs", id: "about-us" },
              { name: "keyFeatures", id: "features" },
              { name: "whyChooseUs", id: "why-choose-us" },
              { name: "pricing", id: "pricing" },
              { name: "faq", id: "faq" },
            ].map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                className="block py-2 px-4 text-slate-700 font-medium text-sm"
                onClick={(e) => handleSmoothScroll(e, item.id)}
              >
                {t(item.name)}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-3">
              <AuthDialog type="login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground font-medium hover:text-primary text-sm lg:text-sm cursor-pointer text-nowrap"
                >
                  {t("logIn")}
                </Button>
              </AuthDialog>
              <AuthDialog type="signup">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-white/15 text-white text-sm cursor-pointer"
                >
                  {t("signUp")}
                </Button>
              </AuthDialog>
            </div>
          </div>
        </motion.div>
      </motion.header>
    </div>
  );
}