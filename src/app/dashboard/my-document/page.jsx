"use client";

import { useRef } from "react";
import { Button } from "../../../components/components/ui/button";
import { Card, CardContent } from "../../../components/components/ui/card";
import {
  FileUp,
  FileText,
  BadgePercent as InsuranceIcon,
  Stethoscope,
  FileQuestion,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { Input } from "../../../components/components/ui/input";
import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/components/ui/alert-dialog";

// ✅ no interface, just plain objects
const documentTypes = [
  {
    name: "National ID Card",
    description: "PERSONAL DOCUMENT",
    icon: <FileText className="h-8 w-8 text-primary" />,
  },
  {
    name: "Insurance Card",
    description: "PERSONAL DOCUMENT",
    icon: <InsuranceIcon className="h-8 w-8 text-primary" />,
  },
  {
    name: "Doctor Prescription",
    description: "PERSONAL DOCUMENT",
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
  },
  {
    name: "Others document",
    description: "PERSONAL DOCUMENT",
    icon: <FileQuestion className="h-8 w-8 text-primary" />,
  },
];

const DocumentUploadCard = ({ docType }) => {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Uploading ${file.name} for ${docType.name}`);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {docType.icon}
          <div>
            <p className="font-bold text-lg text-primary">{docType.name}</p>
            <p className="text-sm text-muted-foreground">
              {docType.description}
            </p>
          </div>
        </div>

        {/* Upload Document Modal */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <FileUp className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Upload Document</AlertDialogTitle>
              <AlertDialogDescription>
                Choose how you would like to upload your document.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-8 w-8" />
                <span>Open Camera</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => galleryInputRef.current?.click()}
              >
                <ImageIcon className="h-8 w-8" />
                <span>Open Gallery</span>
              </Button>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Hidden Inputs */}
        <Input
          type="file"
          ref={galleryInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <Input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </CardContent>
    </Card>
  );
};

export default function MyDocumentsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">
          My Documents
        </h1>
        <p className="text-muted-foreground">
          Upload and manage your personal documents securely.
        </p>
      </div>

      <div className="space-y-4">
        {documentTypes.map((doc) => (
          <DocumentUploadCard key={doc.name} docType={doc} />
        ))}
      </div>
    </div>
  );
}
