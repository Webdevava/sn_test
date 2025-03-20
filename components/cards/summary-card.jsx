"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCard({ title, value, icon, isCurrency = false }) {
  const formattedValue = isCurrency
    ? `₹ ${parseFloat(value).toLocaleString()}`
    : value;
    
  return (
    <Card className="bg-primary text-primary-foreground overflow-hidden h-full">
      <CardContent className="p-2 sm:p-3 md:p-4 flex items-center h-full">
        <div className="flex flex-col flex-grow min-w-0">
          <p className="text-xs sm:text-sm font-bold truncate">
            {title}
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mt-1 truncate">
            {formattedValue}
          </p>
        </div>
        <div className="flex-shrink-0 ml-2">
          <Image
            src={icon}
            alt={title}
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
            width={24}
            height={24}
          />
        </div>
      </CardContent>
    </Card>
  );
}