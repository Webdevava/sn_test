"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications, readNotification } from "@/lib/notification-api";

// Icons component to render the right icon based on notification type
const NotificationIcon = ({ type, isRead }) => {
  const baseClasses = "h-6 w-6 flex items-center justify-center rounded-full";
  const iconClasses = `h-4 w-4 ${isRead ? 'opacity-50 grayscale' : ''}`;

  if (type === "success") {
    return (
      <div className={`${baseClasses} ${isRead ? 'bg-green-50' : 'bg-green-100'}`}>
        <svg
          className={`${iconClasses} text-green-500`}
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
      <div className={`${baseClasses} ${isRead ? 'bg-red-50' : 'bg-red-100'}`}>
        <svg
          className={`${iconClasses} text-red-500`}
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

const NotificationsPanel = ({ className = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [sortedNotifications, setSortedNotifications] = useState([]);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        
        // Transform API response to match our expected format
        const transformedNotifications = response.data.nootification.map(notification => ({
          id: notification.id,
          title: notification.model,
          message: notification.message,
          time: formatTime(notification.created_at),
          type: notification.action === 'Add' ? 'success' : 'warning',
          read: notification.read,
          created_at: notification.created_at
        }));

        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  // Sort notifications with unread on top and sorted by date
  useEffect(() => {
    const sorted = [...notifications].sort((a, b) => {
      // Unread notifications first
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      // Then sort by most recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setSortedNotifications(sorted);
  }, [notifications]);

  // Format time to human-readable format
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return `${diffInHours}hr ago`;
  };

  // Remove a single notification and mark as read
  const removeNotification = async (id) => {
    try {
      // Call API to mark notification as read
      await readNotification(id);

      // Update local state
      const updatedNotifications = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );

      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`w-full max-w-md rounded-lg border bg-card shadow-lg hidden lg:block h-[90vh] ${className}`}>
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-bold text-navy-900">Notifications</h2>
        <div className="text-sm text-gray-500">
          {unreadCount} Unread
        </div>
      </div>
      
      <ScrollArea className="h-[calc(90vh-60px)]">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`relative px-4 py-3 border-b ${!notification.read ? 'bg-popover' : 'bg-muted/30'} transition-all duration-300`}
            >
              <div className={`flex gap-3 ${notification.read ? 'opacity-60 grayscale-[30%]' : ''}`}>
                <NotificationIcon 
                  type={notification.type} 
                  isRead={notification.read} 
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-navy-900'}`}>
                      {notification.title}
                    </h4>
                    <span className={`text-xs ${notification.read ? 'text-gray-400' : 'text-gray-500'} ml-1`}>
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                    {notification.message}
                  </p>
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-2 left-[26rem] hover:bg-red-400 rounded-lg p-1 duration-150 transition-all hover:text-background"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationsPanel;