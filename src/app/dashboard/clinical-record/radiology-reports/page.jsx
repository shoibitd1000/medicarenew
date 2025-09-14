import React, { useState, useMemo, useEffect } from "react";
import { FileDown, ArrowLeft, Calendar, Scan } from "lucide-react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomTable from "../../../../components/components/ui/customTabel";

const initialLabReports = [
  {
    date: "2024-07-10",
    barcode: "L12345678",
    ReportName: "Complete Blood Count (CBC)",
    Radiology: "Dr. John Smith",
    status: "Approved",
    url: "#",
  },
  {
    date: "2024-07-10",
    barcode: "L87654321",
    ReportName: "Lipid Profile",
    Radiology: "Dr. John Smith",
    status: "Sample Collected",
    url: "#",
  },
  {
    date: "2024-06-15",
    barcode: "L54321678",
    ReportName: "Urine Analysis",
    Radiology: "Dr. John Smith",
    status: "Approved",
    url: "#",
  },
];

const statusClasses = {
  Approved: "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold",
  "Sample Collected": "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold",
  "Result Done": "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold",
  Pending: "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold",
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



  const formattedData = filteredReports.map((report) => ({
    ...report,
    date: format(new Date(report.date), "yyyy-MM-dd"),
    status: (
      <span className={statusClasses[report.status] || ""}>
        {report.status}
      </span>
    ),
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
          {formattedData?.length > 0 ? (
            formattedData.map((item, i) => (
              <div
                key={i}
                className="border rounded-lg shadow-md p-4 bg-white my-3 "
              >
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold text-primary">{item?.ReportName}</h2>
                  <span className="text-sm text-gray-500 mb-4">
                    {item?.topN}
                  </span>
                </div>
                <span className="text-sm font-semibold mb-4">
                  {item?.date}
                </span>
                <h2 className="text-lg font-semibold">{item?.pName}</h2>
                <div className="flex justify-between">
                  <div className="flex justify-between">
                    <span
                      className={`text-sm mb-4 ${statusClasses[item?.status] || ""}`}
                    >
                      {item?.status}
                    </span>
                  </div>

                  <button className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition" /* onClick={() => setIsOpen(true)} */>
                    <FileDown className="h-4 w-4" />
                  </button>

                </div>
              </div>
            ))
          ) : (
            <h2 className="text-lg font-extrabold text-center">No Radiology Investigation available.</h2>
          )}
        </div>
      </div>
    </div>
  );
}
