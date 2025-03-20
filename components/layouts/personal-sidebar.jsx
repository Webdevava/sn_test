'use client';
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarClose, SidebarOpen } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ProfileTabs from "../sections/profile-tabs";
import Cookies from 'js-cookie';
import { getProfileDetail } from "@/lib/profile-api";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [openDialog, setOpenDialog] = useState({
    contact: false,
    address: false,
    document: false
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    profilePicture: ""
  });

  // Fetch profile data from cookies or API
  useEffect(() => {
    const fetchProfileData = async () => {
      const profileCookie = Cookies.get('profile');
      if (profileCookie) {
        // Use data from cookies
        const profile = JSON.parse(profileCookie);
        setProfileData({
          firstName: profile.first_name,
          lastName: profile.last_name,
          dob: profile.dob || "Not specified",
          profilePicture: profile.profile_picture || ""
        });
      } else {
        // Fetch data from API if not in cookies
        try {
          const response = await getProfileDetail();
          const profile = response.data; // Use the response data
          setProfileData({
            firstName: profile.first_name,
            lastName: profile.last_name,
            dob: profile.dob || "Not specified",
            profilePicture: profile.profile_picture || ""
          });
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };

    fetchProfileData();
  }, []);

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

  // Generate initials for avatar fallback
  const getInitials = () => {
    const first = profileData.firstName ? profileData.firstName.charAt(0) : '';
    const last = profileData.lastName ? profileData.lastName.charAt(0) : '';
    return `${first}${last}`;
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
          <motion.div
            layout
            className="relative"
            animate={{
              width: expanded ? "6rem" : "2.5rem",
              height: expanded ? "6rem" : "2.5rem",
              rotate: expanded ? 0 : 360,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <Avatar className="w-full h-full">
              <AvatarImage 
                src={profileData.profilePicture || ""}
                alt={`${profileData.firstName} ${profileData.lastName}`} 
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </motion.div>

          <AnimatePresence mode="wait">
            {expanded && (
              <motion.div
                variants={profileItemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="flex flex-col items-center gap-2"
              >
                <motion.p variants={profileItemVariants} className="text-xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </motion.p>
                <motion.p variants={profileItemVariants} className="flex items-center gap-2 text-xs">
                  <span>Date of Birth:</span>
                  <span className="font-semibold">{profileData.dob || "Not specified"}</span>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          <ProfileTabs 
            expanded={expanded}
            contentVariants={contentVariants}
            handleOpenDialog={handleOpenDialog}
          />
        </AnimatePresence>

      </motion.aside>
    </LayoutGroup>
  );
};

export default Sidebar;