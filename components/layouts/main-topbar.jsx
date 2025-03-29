"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun, House, User, Gear } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MainTopbar = () => {
  const [theme, setTheme] = useState("light");
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    profilePicture: "https://github.com/shadcn.png",
  });
  const pathname = usePathname();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Toggle theme and update localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
  };

  const getInitials = () => {
    const first = profileData.firstName ? profileData.firstName.charAt(0) : "";
    const last = profileData.lastName ? profileData.lastName.charAt(0) : "";
    return `${first}${last}`;
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: House },
    { name: "Personal Details", href: "/personal-details", icon: User },
    { name: "Settings", href: "/settings", icon: Gear },
  ];

  // Check if the link is active (including sub-routes)
  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full bg-gray-900 border-b border-gray-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm rounded-4xl lg:rounded-none"
    >
      {/* Left Section: Logo - Different logo for small screens */}
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block w-32 h-10">
          <Image
            src="/logos/logo_white_lg.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative sm:hidden w-10 h-10">
          <Image
            src="/logos/logo_white_sm.png"
            alt="Logo"
            fill
            className="object-contain rounded-full"
          />
        </div>
      </div>

      {/* Center Section: Navigation Links with enhanced active states */}
      <nav className="flex gap-3 sm:gap-6">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 font-medium transition-colors px-3 py-2 ${
                active
                  ? "bg-white text-primary rounded-md"
                  : "text-gray-300 hover:text-white hover:bg-gray-800 hover:rounded-md"
              }`}
            >
              <Icon
                size={20}
                weight="duotone"
                className={active ? "text-primary" : ""}
              />
              {/* Only show text on medium screens and up, never on small screens */}
              <span className="hidden md:inline">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Section: Theme Toggle, Notification, and Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-300 hover:bg-gray-800 rounded-full"
        >
          {theme === "light" ? (
            <Moon size={20} weight="duotone" />
          ) : (
            <Sun size={20} weight="duotone" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:bg-gray-800 rounded-full"
        >
          <Bell size={20} weight="duotone" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarImage
              src={profileData.profilePicture}
              alt={`${profileData.firstName} ${profileData.lastName}`}
            />
            <AvatarFallback className="bg-indigo-500 text-white flex items-center justify-center">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.header>
  );
};

export default MainTopbar;