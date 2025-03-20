// components/PanCard.jsx
'use client'
import React from "react";

const PanCard = ({ panNo = "XXXXXXXXXX", profilePic = "/images/dummy_profile.jpg" }) => {
  return (
    <div className="h-72 w-[27rem] bg-blue-200 shadow-lg rounded-md overflow-hidden relative">
      {/* Header with Government of India and Income Tax Department */}
      <div className="flex items-center justify-between p-2">
        <div className="text-left">
          <p className="text-sm font-semibold">आयकर विभाग</p>
          <p className="text-xs">INCOME TAX DEPARTMENT</p>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/images/Emblem_of_India.png"
            alt="Government of India Emblem"
            className="h-10"
            onError={(e) => {
              e.target.src = "/images/Emblem_of_India.png"; // Fallback image
            }}
          />
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">भारत सरकार</p>
          <p className="text-xs">GOVT. OF INDIA</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex items-start justify-between">
        {/* Information Section */}
        <div className="flex-1 space-y-3">

          
          {/* Redacted User Details */}
          <div className="space-y-1">
            <div className="w-48 h-6 bg-gray-600 rounded-sm"></div>
            <div className="w-48 h-6 bg-gray-600 rounded-sm"></div>
            <div className="w-48 h-6 bg-gray-600 rounded-sm"></div>
          </div>

                    {/* PAN Number */}
                    <div className="mt-2">
            <p className="text-xl font-mono font-bold">{panNo}</p>
          </div>
          
          {/* Signature Block */}
          <div className="mt-4">
            <div className="w-36 h-8 border-b border-black"></div>
            <p className="text-xs mt-1">Signature</p>
          </div>
        </div>

        {/* Profile Picture and QR Code Section */}
        <div className="flex flex-col items-center space-y-2">
          {/* Profile Picture */}
          <div className="w-24 h-28 bg-white border border-gray-400 rounded-sm overflow-hidden">
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/dummy_profile.jpg"; // Fallback image
              }}
            />
          </div>
          
          {/* QR Code */}
          <div className="w-20 h-20 bg-white flex items-center justify-center">
            <img
              src="/images/qr_code.png"
              alt="QR Code"
              className="w-16 h-16"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/64?text=QR"; // Fallback QR
              }}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default PanCard;