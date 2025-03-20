// components/UploadedDocuments.jsx
"use client";

import AadhaarCard from '@/components/cards/AadhaarCard';
import DrivingLicense from '@/components/cards/DrivingLicense';
import PanCard from '@/components/cards/PanCard';
import Passport from '@/components/cards/Passport';
import VoterID from '@/components/cards/VoterID';
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UploadedDocuments = () => {
  const documents = [
    {
      component: (
        <AadhaarCard
          aadhaarNo="1234 5678 9012"
          profilePic="/images/dummy_profile.jpg"
        />
      ),
      title: "Aadhaar Card"
    },
    {
      component: <PanCard />,
      title: "PAN Card"
    },
    {
      component: <Passport />,
      title: "Passport"
    },
    {
      component: <DrivingLicense />,
      title: "Driving License"
    },
    {
      component: <VoterID />,
      title: "Voter ID"
    }
  ];

  return (
  <Card className='max-w-lg p-0'>
    <CardHeader className="border-b">
        <CardTitle className="p-4">
            Uploaded Documents
        </CardTitle>

    </CardHeader>
    <CardContent className='p-4 pt-0'>
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {documents.map((doc, index) => (
              <CarouselItem 
                key={index} 
                className="basis-full"
              >
                <div className="flex justify-center">
                      {doc.component}
                    </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious 
            className="left-2 md:left-4 bg-card/80 hover:bg-card text-gray-600 w-8 h-8" 
          />
          <CarouselNext 
            className="right-2 md:right-4 bg-card/80 hover:bg-card text-gray-600 w-8 h-8" 
          />
        </Carousel>
        </CardContent>
  </Card>
  );
};

export default UploadedDocuments;