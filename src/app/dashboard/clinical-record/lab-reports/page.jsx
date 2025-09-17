import React, { useState, useMemo, useEffect, useContext } from "react";
import { FileDown, Calendar, TestTubeDiagonal } from "lucide-react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import { AuthContext } from "../../../authtication/Authticate";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";

const statusClasses = {
  Approved: "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold",
  "Sample Collected": "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold",
  "Result Done": "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold",
  Pending: "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold",
};

export default function LabReportsPage() {
  const { token, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const [labReports, setLabReports] = useState([]);
  const [fromDate, setFromDate] = useState(subDays(new Date(), 30));
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const patientId = getCurrentPatientId();

  const fetchLabRecord = async () => {
    if (!patientId || !token) {
      console.error("Missing patientId or token");
      setLabReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("mobileappid", "gRWyl7xEbEiVQ3u397J1KQ==");
      formData.append("UserType", "Patient");
      formData.append("AccessScreen", "Pathology");

      const encodedPatientId = encodeURIComponent(encryptPassword(patientId));
      const response = await axios.post(
        `${apiUrls.patientLabHistory}?PatientID=${encodedPatientId}&Fromdate=${format(
          fromDate,
          "yyyy-MM-dd"
        )}&Todate=${format(toDate, "yyyy-MM-dd")}`,
        formData.toString(),
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      if (response.data?.status === true) {
        setLabReports(response.data.response || []);
      } else {
        console.warn("API returned no data or invalid status");
        setLabReports([]);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setLabReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabRecord();
  }, [fromDate, toDate, patientId, token]);

  const filteredReports = useMemo(() => {
    if (!fromDate || !toDate) return labReports;
    return labReports.filter((report) => {
      const reportDate = new Date(report.DATE);
      if (isNaN(reportDate)) return false;
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return reportDate >= from && reportDate <= to;
    });
  }, [labReports, fromDate, toDate]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate)) return "Invalid Date";
    return format(parsedDate, "yyyy-MM-dd");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <TestTubeDiagonal className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-primary">Lab Investigation Reports</h1>
        <p className="text-gray-500">Access your lab test results.</p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
      >
        <span className="mr-2">←</span> Back
      </button>

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
            <div className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full"></div>
            <p className="text-gray-500 mt-2">Loading reports...</p>
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