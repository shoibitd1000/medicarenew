import React, { useState, useMemo, useEffect, useContext } from "react";
import { FileDown, Calendar, TestTubeDiagonal } from "lucide-react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import { AuthContext } from "../../../authtication/Authticate";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";
import IsLoader from "../../../loading";

const statusClasses = {
  Approved: "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold",
  "Sample Collected": "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold",
  "Result Done": "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold",
  Pending: "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold",
};

export default function LabReportsPage() {
  const { token, getCurrentPatientId, getAuthHeader, Logout } = useContext(AuthContext);
  const [labReports, setLabReports] = useState([]);
  const [fromDate, setFromDate] = useState(subDays(new Date(), 30));
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const patientId = getCurrentPatientId();
  const formattedFromDate = format(fromDate, "yyyy-MM-dd");
  const formattedToDate = format(toDate, "yyyy-MM-dd");
  const fetchLabRecord = async () => {
    if (!patientId || !token) {
      console.error("Missing patientId or token");
      notify("Error", "Authentication details are missing");
      setLabReports([]);
      setLoading(false);
      return;
    }

    if (!formattedToDate || !formattedFromDate) {
      console.error("Missing fromDate or toDate");
      notify("Error", "Please select valid date range");
      setLabReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("mobileappid", "gRWyl7xEbEiVQ3u397J1KQ==");
      formData.append("UserType", "Patient");
      formData.append("AccessScreen", "Pathology");

      const encodedPatientId = encodeURIComponent(encryptPassword(patientId));

      // ✅ Format dates properly for API
      const formattedFromDate = format(fromDate, "dd-MM-yyyy");
      const formattedToDate = format(toDate, "dd-MM-yyyy");

      const response = await axios.post(
        `${apiUrls.patientLabHistory}?PatientID=${encodedPatientId}&Fromdate=${formattedFromDate}&Todate=${formattedToDate}`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      if (response.data?.status === true) {
        setLabReports(response.data.response || []);
        notify("Success", "Lab reports fetched successfully");
      } else {
        console.warn("API returned no data or invalid status");
        setLabReports([]);
        notify("Error", "No lab reports found for the selected date range");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        notify("Error", "Session expired. Please log in again.");
        Logout();
      } else {
        notify("Error", "Failed to fetch lab reports");
      }
      setLabReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabRecord();
  }, [formattedFromDate, formattedToDate, patientId, token]);


  const filteredReports = useMemo(() => {
    if (!formattedFromDate || !formattedToDate) return labReports;
    return labReports.filter((report) => {
      const reportDate = new Date(report.DATE);
      if (isNaN(reportDate)) return false;
      const from = new Date(formattedFromDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(formattedToDate);
      to.setHours(23, 59, 59, 999);
      return reportDate >= from && reportDate <= to;
    });
  }, [labReports, formattedFromDate, formattedToDate]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate)) return "Invalid Date";
    return format(parsedDate, "yyyy-MM-dd");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center m-0">
        <TestTubeDiagonal className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-primary">Lab Investigation Reports</h1>
        <p className="text-gray-500">Access your lab test results.</p>
      </div>

      {/* <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
      >
        <span className="mr-2">←</span> Back
      </button> */}

      <div className="border rounded-lg shadow-md p-4 bg-white">
        <h2 className="text-lg font-semibold">Your Lab Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          View your past reports. Use the date picker to filter results.
        </p>

        <div className="grid md:grid-cols-2 gap-3 my-3">
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
            placeHolderText="Select From Date"
            handleDate={(selectedDate) => setFromDate(selectedDate)}
            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
          />
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
            placeHolderText="Select To Date"
            handleDate={(selectedDate) => setToDate(selectedDate)}
            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
          />
        </div>

        {loading ? (
          <div className="text-center py-4">
            <IsLoader isFullScreen={false} size="6" text="Lab Investigation Reports..." />
          </div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((item, i) => (
            <div key={i} className="border rounded-lg shadow-md p-4 bg-white my-3">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  {item.InvestigationName || "Unknown"}
                </h2>
                <span className="text-sm text-gray-500">{item.BarcodeNo || "N/A"}</span>
              </div>
              <span className="text-sm font-semibold block">{formatDate(item.DATE)}</span>
              <p className="text-sm text-gray-700">Doctor: {item.DoctorName || "N/A"}</p>
              <div className="flex justify-between items-center mt-3">
                <span className={statusClasses[item.IsResult] || statusClasses.Pending}>
                  {item.IsResult || "Pending"}
                </span>
                <a
                  href={`http://197.138.207.15/Tenwek/Design/Lab/OnlineprintLabReport_pdf.aspx?IsPrev=1&TestID=${encryptPassword(
                    item.Test_ID || ""
                  )}&Phead=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition"
                >
                  <FileDown className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-lg font-extrabold text-center text-gray-500 py-4">
            No lab reports available.
          </h2>
        )}
      </div>
    </div>
  );
}