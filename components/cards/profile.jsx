// ProfilePage.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { getProfileDetail } from '@/lib/profile-api';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

const ProfilePage = ({ expanded }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfileDetail();
      
      if (response) {
        setProfile(response);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getFullName = () => {
    if (!profile) return '';
    
    const parts = [
      profile.first_name,
      profile.middle_name,
      profile.last_name
    ].filter(Boolean);
    
    return parts.join(' ');
  };

  const getInitials = () => {
    if (!profile) return '';
    
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    
    return (first + last).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {expanded ? (
        <div className="flex flex-col items-center">
          {error && (
            <div className="text-red-600 p-4 mb-4 rounded w-full">
              {error}
            </div>
          )}

          <div className="mb-6">
            <Avatar className="w-40 h-40">
              {profile?.profile_picture ? (
                <AvatarImage 
                  src={profile.profile_picture} 
                  alt={getFullName()} 
                />
              ) : null}
              <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            {getFullName() || 'Not available'}
          </h2>
          
          <p className="text-gray-600 text-lg text-center">
            {formatDate(profile?.dob)}
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <Avatar className="w-10 h-10">
            {profile?.profile_picture ? (
              <AvatarImage 
                src={profile.profile_picture} 
                alt={getFullName()} 
              />
            ) : null}
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </>
  );
};

export default ProfilePage;