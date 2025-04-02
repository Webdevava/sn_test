"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications, readNotification } from "@/lib/notification-api";

// Icons component to render the right icon based on notification type
const NotificationIcon = ({ type, isRead }) => {
  const baseClasses = "h-8 w-8 flex items-center justify-center rounded-full shrink-0";
  const iconClasses = `h-4 w-4 ${isRead ? 'opacity-50' : ''}`;

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
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
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
    <div className={`h-full flex flex-col rounded-lg overflow-hidden border bg-card shadow-lg ${className}`}>
      <div className="flex items-center justify-between border-b p-4 sticky top-0 bg-card z-10">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <div className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            {unreadCount} Unread
          </div>
        )}
      </div>
      
      {/* Use ScrollArea component for scrolling */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {sortedNotifications.length > 0 ? (
          <div className="divide-y">
            {sortedNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`relative  p-4 ${!notification.read ? 'bg-accent/10' : ''} transition-all duration-300`}
              >
                <div className="flex gap-3">
                  <NotificationIcon 
                    type={notification.type} 
                    isRead={notification.read} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-medium truncate ${notification.read ? 'text-muted-foreground' : ''}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs absolute bottom-3 right-3 bg-accent shadow rounded text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-sm turncate mt-1 ${notification.read ? 'text-muted-foreground' : ''}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="absolute top-3 right-3 hover:bg-destructive/10 rounded-full p-1 transition-colors"
                    aria-label="Mark as read"
                  >
                    <X size={16} className="text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;