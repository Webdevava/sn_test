// NotificationsPanel.jsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons component to render the right icon based on notification type
const NotificationIcon = ({ type }) => {
  if (type === "success") {
    return (
      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-4 w-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  } else if (type === "warning") {
    return (
      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-4 w-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
    );
  }
  
  return null;
};

// Sample data structure for notifications
const sampleNotifications = [
  {
    id: 1,
    title: "Life Insurance Premium Due",
    message: "Your LIC policy premium of ₹25,000 is due on 10th Feb 2025. Pay now to avoid late fees!",
    time: "8hr ago",
    type: "warning",
    section: "new"
  },
  {
    id: 2,
    title: "Family Member Added",
    message: "You have successfully added Mike Deo (Father) to your Family Details section.",
    time: "8hr ago",
    type: "success",
    section: "earlier"
  },
  {
    id: 3,
    title: "Mutual Fund SIP Due",
    message: "Your SIP of ₹5,000 for HDFC Bluechip Fund is due on 5th Feb 2025. Invest now!",
    time: "8hr ago",
    type: "warning",
    section: "earlier"
  },
  {
    id: 4,
    title: "Family Member Added",
    message: "You have successfully added Mike Deo (Father) to your Family Details section.",
    time: "8hr ago",
    type: "success",
    section: "earlier"
  },
  {
    id: 5,
    title: "Mutual Fund SIP Due",
    message: "Your SIP of ₹5,000 for HDFC Bluechip Fund is due on 5th Feb 2025. Invest now!",
    time: "8hr ago",
    type: "warning", 
    section: "earlier"
  },
  {
    id: 6,
    title: "Mutual Fund SIP Due",
    message: "Your SIP of ₹5,000 for HDFC Bluechip Fund is due on 5th Feb 2025. Invest now!",
    time: "8hr ago",
    type: "warning",
    section: "earlier"
  },
  {
    id: 7,
    title: "Family Member Added",
    message: "You have successfully added Mike Deo (Father) to your Family Details section.",
    time: "8hr ago",
    type: "success",
    section: "earlier"
  }
];

const NotificationsPanel = ({ className }) => {
  const [notifications, setNotifications] = useState(sampleNotifications);

  // Filter notifications by section
  const newNotifications = notifications.filter(n => n.section === "new");
  const earlierNotifications = notifications.filter(n => n.section === "earlier");

  // Remove a single notification
  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className={`w-full max-w-md rounded-lg border bg-card shadow-lg hidden lg:block ${className}`}>
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-bold text-navy-900">Notifications</h2>
        <Button
          variant="ghost"
          onClick={clearAllNotifications}
        >
          Clear All
        </Button>
      </div>
      
      <ScrollArea className="h-full">
        {newNotifications.length > 0 && (
          <>
            <div className="px-4 pt-3 pb-1">
              <h3 className="text-sm text-gray-500 font-medium">New For You</h3>
            </div>
            <div>
              {newNotifications.map((notification) => (
                <div key={notification.id} className="relative px-4 py-3 border-b">
                  <div className="flex gap-3">
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <span className="text-xs text-gray-500 ml-1">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {earlierNotifications.length > 0 && (
          <>
            <div className="px-4 pt-3 pb-1">
              <h3 className="text-sm text-gray-500 font-medium">EARLIER</h3>
            </div>
            <div>
              {earlierNotifications.map((notification) => (
                <div key={notification.id} className="relative px-4 py-3 border-b">
                  <div className="flex gap-3">
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <span className="text-xs text-gray-500 ml-1">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationsPanel;

