"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MenuIcon, X, ChevronDown } from "lucide-react";
import AuthDialog from "../dialogs/auth/auth-dialog";

export default function Navbar() {
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
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      const navbarHeight = 80;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
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
        // shadow: progress > 0.5 ? "shadow-md" : "shadow-none",
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
            ? "rounded-b-xl lg:rounded-full w-full lg:w-auto lg:max-w-4xl lg:mx-auto lg:mt-2 border border-slate-200 " +
              navStyles.shadow
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
                      ? "/logos/logo_lg.png"
                      : "/logos/logo_white_lg.png"
                  }
                  alt="Logo"
                  className="h-8 block md:hidden"
                />
                <img
                  src={
                    scrollY > 20
                      ? "/logos/logo_sm.png"
                      : "/logos/logo_white_md.png"
                  }
                  alt="Logo"
                  className="h-8 hidden md:block lg:hidden"
                />
                <img
                  src={
                    scrollY > 20
                      ? "/logos/logo_sm.png"
                      : "/logos/logo_white_lg.png"
                  }
                  alt="Logo"
                  className="h-8 hidden lg:block"
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              {[
                { name: "Home", href: "#home", id: "home" },
                { name: "About Us", href: "#about-us", id: "about-us" },
                { name: "Key Features", href: "#features", id: "features" },
                {
                  name: "Why Choose Us",
                  href: "#why-choose-us",
                  id: "why-choose-us",
                },
                { name: "Pricing", href: "#pricing", id: "pricing" },
                { name: "FAQ's", href: "#faq", id: "faq" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.id)}
                  className={`${
                    scrollY > 20
                      ? "text-foreground font-medium hover:text-primary text-sm lg:text-sm cursor-pointer text-nowrap " +
                        navStyles.shadow
                      : "text-white font-medium hover:text-foreground text-sm lg:text-sm cursor-pointer text-nowrap"
                  }`}
                >
                  {item.name}
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
                      ? "text-foreground font-medium hover:text-primary text-sm lg:text-sm cursor-pointer text-nowrap " +
                        navStyles.shadow
                      : "text-white font-medium hover:text-foreground text-sm lg:text-sm cursor-pointer text-nowrap"
                  }`}
                >
                  Log In
                </Button>
              </AuthDialog>
              <AuthDialog type="signup">
                <Button
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-500/75 text-white text-sm cursor-pointer"
                >
                  Sign Up
                </Button>
              </AuthDialog>
            </div>

            <button
              className="md:hidden text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
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
              { name: "Home", id: "home" },
              { name: "About Us", id: "about-us" },
              { name: "Key Features", id: "features" },
              { name: "Why Choose Us", id: "why-choose-us" },
              { name: "Pricing", id: "pricing" },
              { name: "FAQ's", id: "faq" },
            ].map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                className="block py-2 px-4 text-slate-700 font-medium text-sm"
                onClick={(e) => handleSmoothScroll(e, item.id)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-3">
              <AuthDialog type="login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    scrollY > 20
                      ? "text-foreground font-medium hover:text-primary text-sm lg:text-sm cursor-pointer text-nowrap " +
                        navStyles.shadow
                      : "text-white font-medium hover:text-foreground text-sm lg:text-sm cursor-pointer text-nowrap"
                  }`}
                >
                  Log In
                </Button>
              </AuthDialog>
              <AuthDialog type="signup">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-white/15 text-white text-sm cursor-pointer"
                >
                  Sign Up
                </Button>
              </AuthDialog>
            </div>
          </div>
        </motion.div>
      </motion.header>
    </div>
  );
}
