// components/VoterID.jsx
'use client'
import React from "react";

const VoterID = ({ 
  voterIdNo = "XXX1234567", 
  profilePic = "/images/dummy_profile.jpg",
  issueDate = "XX/XX/XXXX"
}) => {
  return (
    <div className="h-72 w-[27rem] bg-white shadow-lg border border-gray-300 rounded-md overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* <img
            src="/images/emblem_of_india.png"
            alt="Government Emblem"
            className="h-8"
            onError={(e) => {
              e.target.src = "/images/emblem_of_india.png"; // Fallback image
            }}
          /> */}
          <div>
            <p className="text-xs font-bold">ELECTION COMMISSION OF INDIA</p>
            <p className="text-xs">भारत निर्वाचन आयोग</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">VOTER ID CARD</p>
          <p className="text-xs">मतदाता पहचान पत्र</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 flex">
        {/* Left Column - Photo and EPIC number */}
        <div className="w-1/3 flex flex-col items-center space-y-3">
          {/* Profile Picture */}
          <div className="w-24 h-28 bg-white border border-gray-400 rounded-sm overflow-hidden">
            <img
              src={profilePic}
              alt="Voter Photo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/dummy_profile.jpg"; // Fallback image
              }}
            />
          </div>
          
          {/* EPIC Number */}
          <div className="w-full">
            <p className="text-xs text-gray-600 text-center">EPIC No. / मतदाता फोटो पहचान-पत्र संख्या</p>
            <p className="text-sm font-mono font-bold text-center">{voterIdNo}</p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="w-2/3 space-y-1 pl-2">
          {/* Personal Details - Using placeholder blocks for privacy */}
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-600">Name / नाम</p>
              <div className="w-56 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div>
              <p className="text-xs text-gray-600">Father's Name / पिता का नाम</p>
              <div className="w-56 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div>
              <p className="text-xs text-gray-600">Sex / लिंग</p>
              <div className="w-20 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div>
              <p className="text-xs text-gray-600">Date of Birth / जन्म तिथि</p>
              <div className="w-40 h-4 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div>
              <p className="text-xs text-gray-600">Address / पता</p>
              <div className="w-56 h-12 bg-gray-300 rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="flex justify-between items-center px-3 py-2 bg-gray-100 border-t border-gray-300">
        <div>
          <p className="text-xs text-gray-500">Issue Date / जारी करने की तिथि</p>
          <p className="text-sm font-medium">{issueDate}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Electoral Registration Officer / निर्वाचक रजिस्ट्रीकरण अधिकारी</p>
          <div className="w-20 h-8">
            <img
              src="/images/signature.png"
              alt="Officer Signature"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "/images/placeholder_signature.png"; // Fallback image
              }}
            />
          </div>
        </div>
        <div className="w-16 h-16">
          <img
            src="/images/electoral_symbol.png"
            alt="Electoral Symbol"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = "/images/placeholder_symbol.png"; // Fallback symbol
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VoterID;