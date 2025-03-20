import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Gear, Bell, Shield, Moon, CreditCard } from 'lucide-react';
import { GearSix } from '@phosphor-icons/react/dist/ssr';
import { PixLogo } from '@phosphor-icons/react';

const ProfileSettingsSidebar = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'account', label: 'Account', icon: <GearSix size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon size={16} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={16} /> }
  ];

  const userProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@gmail.com",
    avatar: "AJ",
    role: "Product Designer"
  };

  return (
    <div className="w-80 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            {userProfile.avatar}
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{userProfile.name}</h2>
            <p className="text-sm text-gray-500">{userProfile.email}</p>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
            {userProfile.role}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-100">
        <div className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
                  activeTab === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 cursor-pointer hover:bg-red-50">
              <PixLogo size={16} />
              <span className="font-medium">Sign out</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 mt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <p>Need help?</p>
            <p className="text-indigo-600 font-medium cursor-pointer">Contact support</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>App version</p>
            <p className="font-medium">v2.3.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsSidebar;