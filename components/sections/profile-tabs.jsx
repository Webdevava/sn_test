'use client'
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { motion } from "framer-motion";
import AddressList from "./address-section";
import ContactList from "./contact-section";
import DocumentList from "./document-section";

const ProfileTabs = ({ expanded, contentVariants, handleOpenDialog }) => {
  if (!expanded) return null;

  return (
    <motion.div
      variants={contentVariants}
      initial="collapsed"
      animate="expanded"
      exit="collapsed"
      className="w-full h-full"
    >
      <Tabs defaultValue="Contact" className="w-full h-full">
        <Card className="bg-popover rounded-lg min-h-96 h-full flex flex-col justify-between p-0 overflow-hidden">
          <CardHeader className="p-2 border-b">
            <TabsList className="w-full bg-transparent">
              <TabsTrigger
                value="Contact"
                className="w-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Contact
              </TabsTrigger>
              <TabsTrigger
                value="Address"
                className="w-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Address
              </TabsTrigger>
              <TabsTrigger
                value="Documents"
                className="w-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-2 flex-1">
            <TabsContent value="Contact" className="h-full flex-1">
              <ContactList/>
            </TabsContent>
            <TabsContent value="Address" className="h-full flex-1">
            <AddressList />
            </TabsContent>
            <TabsContent value="Documents" className="h-full flex-1">
 <DocumentList/>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </motion.div>
  );
};

export default ProfileTabs;