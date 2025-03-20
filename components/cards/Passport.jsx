// components/PassportContent.jsx
'use client'
import React from "react";

const PassportContent = ({ 
  passportNo = "XXXXXXXXX", 
  profilePic = "/images/dummy_profile.jpg",
  issueDate = "XX/XX/XXXX",
  expiryDate = "XX/XX/XXXX" 
}) => {
  return (
    <div className="h-72 w-[27rem] bg-white shadow-lg border border-gray-300 overflow-hidden rounded-lg">
      {/* Main Content */}
      <div className="p-4 flex h-full">
        {/* Left Column - Photo and Signature */}
        <div className="w-1/3 pr-3 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="w-28 h-36 bg-gray-100 border border-gray-400 overflow-hidden">
            <img
              src={profilePic}
              alt="Passport Photo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/dummy_profile.jpg"; // Fallback image
              }}
            />
          </div>
          
          {/* Signature */}
          <div className="w-full mt-2">
            <div className="w-28 h-8 border-b border-black mx-auto"></div>
            <p className="text-xs text-center mt-1">Signature</p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="w-2/3 space-y-1">
          {/* Passport Type and Country Code */}
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-bold">P</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Country Code</p>
              <p className="font-bold">IND</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Passport No.</p>
              <p className="font-bold font-mono">{passportNo}</p>
            </div>
          </div>

          {/* Personal Details - Using placeholder blocks for privacy */}
          <div className="space-y-1">
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Surname</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Given Name</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Nationality</p>
              <p className="text-sm font-medium">INDIAN</p>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Date of Birth</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Place of Birth</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="flex">
              <p className="w-32 text-xs text-gray-600">Gender</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
          </div>

          {/* Issue and Expiry Dates */}
          <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Date of Issue</p>
              <p className="text-sm font-medium">{issueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date of Expiry</p>
              <p className="text-sm font-medium">{expiryDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Readable Zone */}
      <div className="bg-gray-100 border-t border-gray-300 p-2">
        <div className="font-mono text-xs tracking-wider">
          <p>P&lt;INDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <p>{passportNo}&lt;0IND0000000000&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
        </div>
      </div>
    </div>
  );
};

export default PassportContent;