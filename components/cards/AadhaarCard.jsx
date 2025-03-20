// components/AadhaarCard.jsx
'use client'
import React from "react";

const AadhaarCard = ({ aadhaarNo = "XXXX XXXX XXXX", profilePic = "/images/dummy_profile.jpg" }) => {
  return (
    <div className="h-72 w-[27rem]  bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden relative">
      {/* Header with Government of India Logo and Colors */}
      <div className="flex items-center justify-between p-2 bg-gray-100">
        <div className="flex items-center space-x-2">
          <img
            src="/images/Emblem_of_India.png"
            alt="Government of India Emblem"
            className="h-12"
          />
        </div>
        <div>
          <div className="w-48 h-4 bg-orange-500 rounded-sm"></div>
          <div className="w-48 h-4 bg-green-500 rounded-sm"></div>
          </div>
        <div className="flex items-center space-x-2">

          <img
            src="/images/aadhaar_logo.svg"
            alt="Aadhaar Logo"
            className="w-12 h-12"
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex items-center justify-between">
        {/* Profile Picture Section */}
        <div className="relative">
          <div className="w-28 h-36 bg-gray-300 rounded-sm flex items-center justify-center overflow-hidden">
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/dummy_profile.jpg"; // Fallback image
              }}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 mx-4 ml-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 mr-3">Name</p>
            <p className="text-sm text-gray-600">XXXXXXXXXX</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 mr-3">Gender</p>
            <p className="text-sm text-gray-600">XXXXXXXXXX</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 mr-3">DOB</p>
            <p className="text-sm text-gray-600">XXXXXXXXXX</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base text-gray-800 font-mono font-semibold">{aadhaarNo}</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
          <img
            src="https://via.placeholder.com/100?text=QR+Code"
            alt="QR Code"
            className="w-20 h-20"
          />
        </div>
      </div>

      {/* Bottom Border */}
      <div className="w-full border-t-2 h-12 border-red-500 flex items-center justify-center text-lg font-semibold">
        <span className="text-red-500">आधार</span><span> - आम आदमी का अधिकार</span>
      </div>
    </div>
  );
};

export default AadhaarCard;