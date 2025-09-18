import React, { useState, useEffect, useContext, useCallback } from "react";
import { FileDown, ClipboardPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DialogBox } from "../../../../components/components/ui/dialog";
import { AuthContext } from "../../../authtication/Authticate";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";
import Toaster, { notify } from "../../../../lib/notify";
import IsLoader from "../../../loading";

const ConsultationHistoryPage = () => {
  const navigate = useNavigate();
  const { token, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  console.log(consultations, "consultations");

  const [isOpen, setIsOpen] = useState(false);
  const patientId = getCurrentPatientId();
  const deviceID = localStorage.getItem("deviceId")
  const fetchConsultationHistory = async (pageNum = 1, append = false) => {
    try {
      setLoading(pageNum === 1);
      setLoadingMore(pageNum > 1);

      // Prepare FormData payload
      const formData = new FormData();
      const encodedPatientId = encryptPassword(patientId);
      formData.append("PatientID", encodedPatientId);
      // ✅ Pass formData as the body, not null
      const response = await axios.post(
        `${apiUrls.consualtationHistory}?PatientID=${encodedPatientId}`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      if (response.data?.status) {
        const newData = response.data.response || [];
        setConsultations(prev => (append ? [...prev, ...newData] : newData));
        setHasMore(newData.length === 10);
      } else {
        if (pageNum === 1) {
          notify('No Data', 'No consultation history found.');
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        'Error fetching consultation history:',
        error.response?.status,
        error.response?.data || error.message,
      );
      if (error.response?.status === 500) {
        notify(
          'Server Error',
          'An internal server error occurred. Please try again later.',
        );
      } else {
        notify('Error', 'Failed to load consultation history.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };



  /* useEffect(() => {
    if (deviceID && token && patientId) {
      fetchConsultationHistory(1);
    }
  }, [deviceID, token, patientId]); */

  useEffect(() => {
    if (deviceID && token && patientId) {
      fetchConsultationHistory(1);
    }
  }, [deviceID, token, patientId]);

  // Load more consultations
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchConsultationHistory(nextPage, true);
        return nextPage;
      });
    }
  };

  const handleDownloadPDF = async (appId) => {
    try {
      const response = await axios.get(
        `${apiUrls.doctorPrescription}?App_ID=${appId}&fileName=Consultation.pdf`,
        {
          responseType: "blob", // 👈 important to handle binary files
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Consultation.pdf"); // filename for the user
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notify("Error: Failed to download PDF.");
    }
  };


  // Rest of your JSX return statement remains the same...
  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        {/* Page Header */}
        <div className="text-center">
          <ClipboardPlus className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
          <h1 className="text-xl font-bold font-headline text-primary mt-2">
            Consultation History
          </h1>
          <p className="text-muted-foreground text-sm font-bold">
            A record of your past consultations with our doctors.
          </p>
        </div>

        <div className="p-4">
          <div className="space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              <span className="mr-2">←</span> Back
            </button>

            {loading ? (
              <div className="text-center">
                {/* <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p>Loading...</p> */}
                <IsLoader isFullScreen={false} size="6" text="Consultation History..." />
              </div>
            ) : consultations.length > 0 ? (
              <>
                {consultations.map((consult, index) => (
                  <div
                    key={`${index} -${consult?.DoctorName} `}
                    className="border rounded-lg shadow-md p-4 bg-white"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-primary">
                          {consult.DoctorName || "N/A"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {consult.Designation || "N/A"} | {consult.Date || ""}
                        </p>
                      </div>
                      <a
                        href={`http://197.138.207.30/Tenwek2208/Design/CPOE/DoctorPrescription.aspx?App_ID=567803`}
                        target="blank"
                        className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition"

                      >
                        <FileDown className="h-4 w-4" />
                      </a>
                    </div>
                    <h4 className="text-md underline font-semibold">Diagnosis:</h4>
                    <span className="text-sm font-normal">{consult.Diagnosis || "N/A"}</span>
                    <div className="mt-4">
                      <h5 className="font-semibold">Medications:</h5>
                      <ul className="text-muted-foreground text-xs">
                        {consult.MedicineName ? (
                          <li>{consult.MedicineName}</li>
                        ) : (
                          <li>N/A</li>
                        )}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-semibold">Test/Procedure Prescribe:</h5>
                      <p className="text-muted-foreground text-sm">{consult.Investigation || "N/A"}</p>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <div className="text-center mt-4">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className={`px - 4 py - 2 rounded - md text - white font - medium ${loadingMore ? "bg-gray-400" : "bg-primary hover:bg-blue-600"
                        } `}
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                No consultation history available.
              </p>
            )}
          </div>
        </div>

        <DialogBox
          open={isOpen}
          onOpenChange={setIsOpen}
          title="Doctor Notes"
          size="xl"
          footer={
            <button
              className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          }
        >
          <p>Here are the doctor notes...</p>
        </DialogBox>
      </div>
    </>

  );
};

export default ConsultationHistoryPage;