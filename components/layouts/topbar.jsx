"use client";

import React from "react";
import Link from "next/link";
import { Bell, GlobeSimple, User, List, X } from "@phosphor-icons/react/dist/ssr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const TopBar = () => {
//   const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(3);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Personal Details", href: "/personal-details" },
    { name: "Settings", href: "/settings" },
  ];

  const languages = [
    { name: "English", code: "en" },
    { name: "हिन्दी", code: "hi" },
    { name: "मराठी", code: "mr" },
    { name: "ગુજરાતી", code: "gu" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden mr-2">
            <Button variant="ghost" size="icon" aria-label="Menu">
              {mobileOpen ? (
                <X weight="bold" className="h-5 w-5" />
              ) : (
                <List weight="bold" className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">U</span>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Uttaradhikari
                </span>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">U</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Uttaradhikari
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 mr-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Right side items */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Change language">
                      <GlobeSimple weight="fill" className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {languages.map((lang) => (
                      <DropdownMenuItem key={lang.code}>
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>Language</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Theme toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Switch
                    // checked={theme === "dark"}
                    // onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{"Dark mode"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notifications */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell weight="fill" className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Profile */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                      <User weight="fill" className="h-5 w-5 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default TopBar;