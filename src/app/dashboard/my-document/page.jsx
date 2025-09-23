import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../authtication/Authticate"; // Adjust path as needed
import {
  FileUp,
  FileText,
  BadgePercent as InsuranceIcon,
  Stethoscope,
  FileQuestion,
  Trash2,
} from "lucide-react";
import { Button } from "../../../components/components/ui/button";
import { Card, CardContent } from "../../../components/components/ui/card";
import { Input } from "../../../components/components/ui/input";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import Toaster, { notify } from "../../../lib/notify";
import IsLoader from "../../loading";

// Document types
const documentTypes = [
  {
    name: "National ID Card",
    description: "PERSONAL DOCUMENT",
    icon: <FileText className="h-8 w-8 text-primary" />,
    formId: "national_id", // Example formId, adjust based on API
  },
  {
    name: "Insurance Card",
    description: "PERSONAL DOCUMENT",
    icon: <FileText className="h-8 w-8 text-primary" />,
    formId: "insurance_card",
  },
  {
    name: "Doctor Prescription",
    description: "PERSONAL DOCUMENT",
    icon: <FileText className="h-8 w-8 text-primary" />,
    formId: "doctor_prescription",
  },
  {
    name: "Others document",
    description: "PERSONAL DOCUMENT",
    icon: <FileText className="h-8 w-8 text-primary" />,
    formId: "others_document",
  },
  {
    name: "Insurance Card",
    description: "PERSONAL DOCUMENT",
    icon: <FileText className="h-8 w-8 text-primary" />,
    formId: "others_document",
  },
];

const DocumentUploadCard = ({ docType, uploadedDocs, removeDocument, handleUpload }) => {
  const galleryInputRef = useRef(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState(null);

  // Find if the document type has an uploaded document
  const uploadedDoc = uploadedDocs.find(
    (doc) => doc.DocumentType === docType.name || doc.FormID === docType.formId
  );

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Remove data:image/*;base64,
        handleUpload(base64String, selectedFormId, selectedDocType);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          {uploadedDoc?.Img ? (
            <img
              src={uploadedDoc.Img}
              alt={docType.name}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
          ) : (
            docType.icon
          )}
          <div>
            <p className="font-bold text-lg text-primary">{docType.name}</p>
            <p className="text-sm text-muted-foreground">{docType.description}</p>
          </div>
        </div>

        {uploadedDoc?.Img ? (
          <Button
            variant="ghost"
            className="text-red-500 font-bold hover:text-red-700"
            onClick={() => removeDocument(uploadedDoc.DocID, uploadedDoc.FormID)}
          >
            Remove
          </Button>
        ) : (
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100"
            onClick={() => {
              setSelectedDocType(docType.name);
              setSelectedFormId(docType.formId);
              galleryInputRef.current?.click();
            }}
          >
            <FileUp className="h-4 w-4 text-black" />
            <span className="text-sm text-black font-medium">Upload Document</span>
          </Button>
        )}

        {/* Hidden Input for Gallery */}
        <Input
          type="file"
          accept="image/*"
          ref={galleryInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </CardContent>
    </Card>
  );
};

export default function MyDocumentsPage() {
  const { token, saveDeviceId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dataFromServer, setDataFromServer] = useState([]);
  const deviceID = saveDeviceId();

  // Fetch documents on component mount
  useEffect(() => {
    Show_Document();
  }, []);

  /** Fetch Documents from API */
  const Show_Document = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error("No token available");
        notify("No token available. Please log in.");
        return;
      }

      const apiUrl = `${apiUrls.getUloadedapi}?MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status === true) {
        setDataFromServer(response?.data?.response);
      } else {
        console.error("Unexpected API response:", response.data);
        notify("Failed to fetch documents.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      notify("An error occurred while fetching documents.");
    } finally {
      setLoading(false);
    }
  };

  /** Upload Document API */
  const uploadDocumentToAPI = async (base64Image, formId, docType) => {
    try {
      const apiUrl = `${apiUrls.saveDocumentapi}?MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

      const payload = [
        {
          data: base64Image,
          documentId: formId,
          name: docType || "Document",
        },
      ];

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.status === true) {
        Show_Document();
        notify("Document uploaded successfully.");
      } else {
        notify(response?.data?.message || "Failed to upload document.");
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      notify("An error occurred while uploading the document.");
    }
  };

  /** Remove Document API */
  const removeDocument = async (docId, formId) => {
    try {
      const apiUrl = `${apiUrls.removeDocumentApi}?FormId=${formId}&MobileAppId=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

      const payload = new URLSearchParams({
        AccessScreen: "Remove Document",
        AppVersion: "1.0.6",
        Device_ID: deviceID,
        mobileappid: "gRWyl7xEbEiVQ3u397J1KQ==",
        UserType: "Patient",
      }).toString();

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "accept-encoding": "gzip",
          connection: "Keep-Alive",
          "user-agent": "okhttp/5.0.0-alpha.2",
        },
      });

      if (response?.data?.status) {
        notify("Document removed successfully.");
        Show_Document(); // Refresh list
      } else {
        notify(response?.data?.message || "Failed to remove document.");
      }
    } catch (error) {
      console.error("Remove error:", error.response?.data || error.message);
      notify("An error occurred while removing the document.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">
          My Documents
        </h1>
        <p className="text-muted-foreground">
          Upload and manage your personal documents securely.
        </p>
      </div>
      <Toaster />
      {loading ? (
        <div className="text-center">
          <IsLoader isFullScreen={false} text="" />
        </div>
      ) : (
        <div className="space-y-4">
          {documentTypes.map((doc) => (
            <DocumentUploadCard
              key={doc.name}
              docType={doc}
              uploadedDocs={dataFromServer}
              removeDocument={removeDocument}
              handleUpload={uploadDocumentToAPI}
            />
          ))}
          {dataFromServer.length === 0 && (
            <p className="text-center font-bold">No documents found.</p>
          )}
        </div>
      )}
    </div>
  );
}