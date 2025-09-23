import React, { useState, useMemo, useEffect, useContext } from "react";
import { FileDown, ArrowLeft, Calendar, Scan } from "lucide-react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomTable from "../../../../components/components/ui/customTabel";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import IsLoader from "../../../loading";
import { AuthContext } from "../../../authtication/Authticate";

const IsResultClasses = {
  Approved: "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold",
  "Sample Collected": "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold",
  "Result Done": "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold",
  Pending: "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold",
};

export default function LabReportsPage() {
  const { token, getCurrentPatientId, getAuthHeader, Logout } = useContext(AuthContext);
  const [labReports, setLabReports] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const patientId = getCurrentPatientId(); // Replace with actual patient ID from your auth context

  useEffect(() => {
    const to = new Date();
    const from = subDays(to, 30);
    setFromDate(from);
    setToDate(to);
  }, []);

  const fetchRadioRecord = async () => {
    if (!fromDate || !toDate) return;
    try {
      setLoading(true);
      const RADIO_RECORD = `${apiUrls.patientRadiologyHistoryapi}?PatientID=${encodeURIComponent(
        patientId
      )}&Fromdate=${fromDate.toISOString().split("T")[0]}&Todate=${toDate
        .toISOString()
        .split("T")[0]}`;

      const formData = new URLSearchParams();
      formData.append("mobileappid", "gRWyl7xEbEiVQ3u397J1KQ==");
      formData.append("UserType", "Patient");
      formData.append("AccessScreen", "Pathology");

      const response = await axios.post(RADIO_RECORD, formData.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.status === true) {
        debugger
        setLabReports(response.data.response);
      } else {
        setLabReports([]);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setLabReports([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate)) return "Invalid Date";
    return parsedDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  useEffect(() => {
    fetchRadioRecord();
  }, [fromDate, toDate]);

  const filteredReports = useMemo(() => {
    if (!fromDate || !toDate) return labReports;
    return labReports.filter((report) => {
      const reportDate = new Date(report.DATE);
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return reportDate >= from && reportDate <= to;
    });
  }, [labReports, fromDate, toDate]);

  const formattedData = filteredReports.map((report) => ({
    ...report,
    date: formatDate(report.DATE),
    ReportName: report.InvestigationName || "Unknown",
    barcode: report.BarcodeNo || "N/A",
    Radiology: report.DoctorName || "N/A",
    IsResult: (
      <span className={IsResultClasses[report.IsResult || "Pending"] || ""}>
        {report.IsResult || "Pending"}
      </span>
    ),
    url: `http://197.138.207.15/Tenwek/Design/Lab/OnlineprintLabReport_pdf.aspx?IsPrev=1&TestID=${encodeURIComponent(
      report.Test_ID || ""
    )}&Phead=0`,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <Scan className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-primary">
          Radiology  Investigation Reports
        </h1>
        <p className="text-gray-500">View Your imaging Reports like X-rays and Scans.</p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center border  px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
      >
        <span className="mr-2">←</span> Back
      </button>
      <div className="border rounded-lg shadow-md p-4 bg-white">
        <h2 className="text-lg font-semibold">Your Radiology Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          View your past reports. Use the date picker to filter results.Update as of 03:21 PM IST, August 26,2025.
        </p>

        <div className="grid md:grid-cols-2 gap-3 my-3">
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
            placeHolderText={"Select From Date"}
            handleDate={(selectedDate) => setFromDate(selectedDate)}
            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
          />

          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
            placeHolderText={"Select To Date"}
            handleDate={(selectedDate) => setToDate(selectedDate)}
            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
          />
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <IsLoader
                isFullScreen={false}
                size="6"
                text="Radiology Investigation Reports..."
              />
            </div>
          ) : formattedData?.length > 0 ? (
            formattedData.map((item, i) => (
              <div
                key={i}
                className="border rounded-lg shadow-md p-4 bg-white my-3 "
              >
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold text-primary">{item.ReportName}</h2>
                  <span className="text-sm text-gray-500 mb-4">{item.barcode}</span>
                </div>

                <p className="text-xs font-semibold">{item.date}</p>

                <span className="text-sm font-semibold mb-4">{item.Radiology}</span>

                <div className="flex justify-between">
                  <div className="flex items-center">{item.IsResult}</div>

                  {/* PDF open in new tab */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition"
                  >
                    <FileDown className="h-4 w-4" />
                    
                  </a>

                  {/* OR PDF force download */}
                  {/* 
        <a
          href={item.url}
          download={`RadiologyReport_${item.Test_ID}.pdf`}
          className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition"
        >
          <FileDown className="h-4 w-4" />
          Download
        </a>
        */}
                </div>
              </div>
            ))
          ) : (
            <h2 className="text-lg font-extrabold text-center">
              No Radiology Investigation available.
            </h2>
          )}

        </div>
      </div>
    </div>
  );
}