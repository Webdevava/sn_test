// PersonalSidebar.jsx
'use client';
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarClose, SidebarOpen } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ProfileTabs from "../sections/profile-tabs";
import ProfilePage from "../cards/profile";
// import ProfilePage from "../../app/(pages)/profile/page";

const PersonalSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [openDialog, setOpenDialog] = useState({
    contact: false,
    address: false,
    document: false
  });

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleOpenDialog = (dialogType) => {
    setOpenDialog(prev => ({ ...prev, [dialogType]: true }));
  };

  const handleCloseDialog = (dialogType) => {
    setOpenDialog(prev => ({ ...prev, [dialogType]: false }));
  };

  const containerVariants = {
    expanded: {
      width: "24rem",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 1,
      },
    },
    collapsed: {
      width: "4rem",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 1,
      },
    },
  };

  const profileVariants = {
    expanded: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    collapsed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const profileItemVariants = {
    expanded: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    collapsed: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2,
      },
    },
    collapsed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <LayoutGroup>
      <motion.aside
        layout
        className="bg-muted p-4 flex flex-col gap-6 h-full overflow-hidden sidebar rounded-2xl"
        variants={containerVariants}
        initial="collapsed"
        animate={expanded ? "expanded" : "collapsed"}
      >
        <motion.div layout className="flex items-center justify-end">
          <Button
            className="size-8 bg-background text-foreground hover:bg-secondary"
            onClick={toggleExpand}
          >
            <motion.div
              initial={false}
              animate={{ rotate: expanded ? 0 : 360 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {expanded ? <SidebarClose /> : <SidebarOpen />}
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          layout
          variants={profileVariants}
          className="flex items-center flex-col justify-center gap-3"
        >
          <ProfilePage expanded={expanded} />
        </motion.div>

        <AnimatePresence mode="wait">
          {expanded && (
            <ProfileTabs 
              expanded={expanded}
              contentVariants={contentVariants}
              handleOpenDialog={handleOpenDialog}
            />
          )}
        </AnimatePresence>
      </motion.aside>
    </LayoutGroup>
  );
};

export default PersonalSidebar;