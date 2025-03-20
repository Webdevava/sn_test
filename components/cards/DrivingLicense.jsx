// components/DrivingLicense.jsx
'use client'
import React from "react";

const DrivingLicense = ({ 
  licenseNo = "XXXXXXXXXXXXXXX", 
  profilePic = "/images/dummy_profile.jpg",
  validFrom = "XX-XX-XXXX",
  validUpto = "XX-XX-XXXX",
  bloodGroup = "X+"
}) => {
  return (
    <div className="h-72 w-[27rem] bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg border border-gray-300 rounded-md overflow-hidden">
      {/* Header Section */}
      <div className="bg-blue-700 text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* <img
            src="/images/emblem_of_india.png"
            alt="Government Emblem"
            className="h-8"
            onError={(e) => {
              e.target.src = "/images/placeholder_emblem.png"; // Fallback image
            }}
          /> */}
          <div>
            <p className="text-sm font-bold">GOVERNMENT OF INDIA</p>
            <p className="text-xs">MINISTRY OF ROAD TRANSPORT & HIGHWAYS</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-yellow-300">DRIVING LICENCE</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 flex">
        {/* Left Column - Photo and Basic Info */}
        <div className="w-1/3 flex flex-col items-center space-y-2">
          {/* Profile Picture */}
          <div className="w-24 h-28 bg-white border border-gray-400 rounded-sm overflow-hidden">
            <img
              src={profilePic}
              alt="License Photo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/dummy_profile.jpg"; // Fallback image
              }}
            />
          </div>
          
          {/* License Number */}
          <div className="w-full">
            <p className="text-xs text-gray-600 text-center">DL No.</p>
            <p className="text-sm font-mono font-bold text-center">{licenseNo}</p>
          </div>
          
          {/* Blood Group */}
          <div className="w-full">
            <p className="text-xs text-gray-600 text-center">Blood Group</p>
            <p className="text-sm font-bold text-center text-red-600">{bloodGroup}</p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="w-2/3 space-y-1">
          {/* Personal Details - Using placeholder blocks for privacy */}
          <div className="space-y-1">
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Name</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">S/W/D of</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Address</p>
              <div className="w-40 h-8 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Date of Birth</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">First Issued On</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
          </div>

          {/* Validity Dates */}
          <div className="flex space-x-4 mt-2 pt-1 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-600">Valid From</p>
              <p className="text-sm font-medium">{validFrom}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Valid Upto</p>
              <p className="text-sm font-medium">{validUpto}</p>
            </div>
          </div>
          
          {/* Vehicle Categories */}
          <div className="mt-2">
            <p className="text-xs text-gray-600">Authorized to Drive</p>
            <div className="flex flex-wrap gap-1 mt-1">
              <div className="px-2 py-0.5 text-xs bg-blue-200 border border-blue-300 rounded-sm">
                MC
              </div>
              <div className="px-2 py-0.5 text-xs bg-blue-200 border border-blue-300 rounded-sm">
                LMV
              </div>
              <div className="px-2 py-0.5 text-xs bg-gray-200 border border-gray-300 rounded-sm">
                HMV
              </div>
              <div className="px-2 py-0.5 text-xs bg-gray-200 border border-gray-300 rounded-sm">
                TRANS
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="flex justify-between items-center px-3 py-2 bg-blue-50 border-t border-gray-300">
        <div className="w-24 h-10 border-b border-black">
          {/* Signature space */}
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Issuing Authority</p>
          <div className="w-20 h-8">
            <img
              src="/images/signature.png"
              alt="Authority Signature"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "/images/placeholder_signature.png"; // Fallback image
              }}
            />
          </div>
          <p className="text-xs font-medium">RTO OFFICER</p>
        </div>
        <div className="w-16 h-16">
          <img
            src="/images/qr_code.png"
            alt="QR Code"
            className="w-full h-full"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/64?text=QR"; // Fallback QR
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DrivingLicense;