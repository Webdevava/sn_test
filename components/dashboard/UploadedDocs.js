"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const DocumentItem = ({ title, numberLabel, number, docName }) => {
  const { t } = useLanguage();

  return (
    <div className='bg-muted p-3 sm:p-4 rounded-lg'>
      <h3 className="text-base sm:text-lg font-semibold mb-2">{t(title)}</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-3 rounded-md">
        <div className="w-full sm:w-auto">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{t(numberLabel)}</p>
          <p className="text-xs sm:text-sm">{number}</p>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{t("document")}</p>
          <div className="flex items-center">
            <FileDown className='text-red-800 h-4 w-4' fill='#EF4343' />
            <span className="ml-2 text-xs sm:text-sm font-semibold">{docName}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8">
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function UploadedDocs() {
  const { t } = useLanguage();

  const documents = [
    {
      title: "aadhaarCard",
      numberLabel: "aadhaarNumber",
      number: "1234 5678 9012",
      docName: "Aadhaar.pdf",
    },
    {
      title: "panCard",
      numberLabel: "panNumber",
      number: "ABCDE1234F",
      docName: "PAN.pdf",
    },
    {
      title: "passport",
      numberLabel: "passportNumber",
      number: "X1234567",
      docName: "Passport.pdf",
    },
    {
      title: "passbook",
      numberLabel: "accountNumber",
      number: "9876543210",
      docName: "Passbook.pdf",
    },
  ];

  return (
    <Card className="w-full mx-auto shadow-sm">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg sm:text-xl font-bold">
          {t("uploadedDocuments")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 max-h-[380px] sm:max-h-[430px] overflow-y-auto">
        <div className="space-y-4 sm:space-y-6">
          {documents.map((doc, index) => (
            <DocumentItem
              key={index}
              title={doc.title}
              numberLabel={doc.numberLabel}
              number={doc.number}
              docName={doc.docName}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}