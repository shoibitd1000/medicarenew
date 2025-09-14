import React, { useState, useMemo, useEffect } from "react";
import { FileDown, Calendar, TestTubeDiagonal } from "lucide-react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";

const initialLabReports = [
  {
    date: "2024-Mar-10",
    ReportName: "Vitamin B12 -s",
    doctor: "Dr. Lois Cheker",
    topN: "162",
    status: "Approved",
  },
  {
    date: "2024-Mar-10",
    ReportName: "24 Hrs Urine Protine",
    doctor: "Self",
    topN: "162",
    status: "Pending",
  },
];

const statusClasses = {
  Approved:
    "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold",
  "Sample Collected":
    "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold",
  "Result Done":
    "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold",
  Pending:
    "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold",
};

export default function LabReportsPage() {
  const [labReports, setLabReports] = useState(initialLabReports);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const to = new Date();
    const from = subDays(to, 30);
    setFromDate(from);
    setToDate(to);

  }, []);

  const filteredReports = useMemo(() => {
    if (!fromDate || !toDate) return labReports;
    return labReports.filter((report) => {
      const reportDate = new Date(report.date);
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return reportDate >= from && reportDate <= to;
    });
  }, [labReports, fromDate, toDate]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center">
        <TestTubeDiagonal className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-primary">
          Lab Investigation Reports
        </h1>
        <p className="text-gray-500">Access your lab test results.</p>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
      >
        <span className="mr-2">←</span> Back
      </button>

      {/* Reports Section */}
      <div className="border rounded-lg shadow-md p-4 bg-white">
        <h2 className="text-lg font-semibold">Your Lab Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          View your past reports. Use the date picker to filter results.
        </p>

        {/* Date Filters */}
        <div className="grid md:grid-cols-2 gap-3 my-3">
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
            placeHolderText={"Select From Date"}
            handleDate={(selectedDate) => setFromDate(selectedDate)}
            icon={
              <Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />
            }
          />

          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
            placeHolderText={"Select To Date"}
            handleDate={(selectedDate) => setToDate(selectedDate)}
            icon={
              <Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />
            }
          />
        </div>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          filteredReports.map((item, i) => (
            <div
              key={i}
              className="border rounded-lg shadow-md p-4 bg-white my-3"
            >
              {/* Report Name & TopN */}
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  {item.ReportName}
                </h2>
                <span className="text-sm text-gray-500">{item.topN}</span>
              </div>

              {/* Date */}
              <span className="text-sm font-semibold block">
                {format(new Date(item.date), "yyyy-MM-dd")}
              </span>

              {/* Doctor */}
              <p className="text-sm text-gray-700">Doctor: {item.doctor}</p>

              {/* Status + Download */}
              <div className="flex justify-between items-center mt-3">
                <span className={statusClasses[item.status] || ""}>
                  {item.status}
                </span>

                <button className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition">
                  <FileDown className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-lg font-extrabold text-center">
            No lab reports available.
          </h2>
        )}
      </div>
    </div>
  );
}
