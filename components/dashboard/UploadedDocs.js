import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '../ui/button';
import { FileDown, Eye, Download } from 'lucide-react';

const DocumentItem = ({ title, numberLabel, number, docName }) => {
  return (
    <div className='bg-muted p-4 rounded-lg'>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex items-center justify-between p-3 rounded-md">
        <div>
          <p className="text-sm text-gray-500 mb-1">{numberLabel}</p>
          <p className="text-sm">{number}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Document</p>
          <div className="mr-4 font-semibold flex items-center">
            <FileDown className='text-red-800' fill='#EF4343' />
            <span className="ml-2">{docName}</span>
          </div>
        </div>
        
        <div className="flex">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const UploadedDocs = () => {
  const documents = [
    {
      title: "Aadhaar Card",
      numberLabel: "Aadhaar Number",
      number: "1234 5678 9012",
      docName: "Aadhaar.pdf"
    },
    {
      title: "PAN Card",
      numberLabel: "PAN Number",
      number: "ABCDE1234F",
      docName: "PAN.pdf"
    },
    {
      title: "Passport",
      numberLabel: "Passport Number",
      number: "X1234567",
      docName: "Passport.pdf"
    },
    {
      title: "Passbook",
      numberLabel: "Account Number",
      number: "9876543210",
      docName: "Passbook.pdf"
    }
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="border-b flex items-center flex-row justify-between p-3 h-16">
        <CardTitle className="text-xl font-bold">
          Uploaded Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-[400px] overflow-y-auto">
        <div className="space-y-6">
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
};

export default UploadedDocs;