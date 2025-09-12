import React, { useState, useMemo, useEffect } from "react";
import { FileDown, ArrowLeft, Calendar, TestTubeDiagonal } from "lucide-react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomTable from "../../../../components/components/ui/customTabel";
// import  Card  from "../../../../components/components/ui/card";

const initialLabReports = [
  {
    date: "2024-07-10",
    barcode: "L12345678",
    testName: "Complete Blood Count (CBC)",
    doctor: "Dr. John Smith",
    status: "Approved",
    url: "#",
  },
  {
    date: "2024-07-10",
    barcode: "L87654321",
    testName: "Lipid Profile",
    doctor: "Dr. John Smith",
    status: "Sample Collected",
    url: "#",
  },
  {
    date: "2024-06-15",
    barcode: "L54321678",
    testName: "Urine Analysis",
    doctor: "Dr. John Smith",
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

    setLabReports((prev) =>
      [
        ...prev,
        {
          date: new Date().toISOString(),
          barcode: "L98765432",
          testName: "Thyroid Panel",
          doctor: "Dr. Emily White",
          status: "Result Done",
          url: "#",
        },
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
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

  const Thead = [
    { key: "date", label: "Date" },
    { key: "barcode", label: "Barcode" },
    { key: "testName", label: "Test Name" },
    { key: "doctor", label: "Referring Doctor" },
    { key: "status", label: "Status" },
  ];

  const actions = [
    {
      label: <FileDown className="h-4 w-4" />,
      onClick: (row) => {
        window.open(row.url, "_blank");
      },
    },
  ];

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
        <TestTubeDiagonal className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-primary">
          Lab Investigation Reports
        </h1>
        <p className="text-gray-500">Access your lab test results.</p>
      </div>

      <div className="border rounded-lg shadow-md p-4 bg-white">
        <h2 className="text-lg font-semibold">Your Lab Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          View your past reports. Use the date picker to filter results.
        </p>

        <div className="grid md:grid-cols-2 gap-3 my-3">
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
            placeHolderText={"Select From Date"}
            handleDate={(selectedDate) => setFromDate(selectedDate)}
            icon={<Calendar className="absolute right-3 top-3 text-gray-500 pointer-events-none" />}
          />

          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
            placeHolderText={"Select To Date"}
            handleDate={(selectedDate) => setToDate(selectedDate)}
            icon={<Calendar className="absolute right-3 top-3 text-gray-500 pointer-events-none" />}
          />
        </div>

        {formattedData?.map(item => <div key={item?.id} className="">
          <div className="py-2  px-4">
            <h2 className="text-lg text-primary font-extrabold py-1 uppercase"> {item?.ambType} </h2>
            <span className="text-xs font-semibold py-1">{item?.baseFare}</span>
            <div><span className="text-xs text-gray font-bold">{item?.perKm}</span></div>
          </div>
        </div>)}

        {/* <div className="overflow-x-auto">
          <CustomTable
            Thead={Thead}
            data={formattedData}
            striped
            bordered
            hover
            wrapperClass="rounded-md shadow"
            tableClass="text-center"
            headerClass="bg-gray-200"
            rowClass="even:bg-gray-50"
            cellClass="text-gray-700"
            actions={actions}
          />
        </div> */}
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/clinical-record")}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Clinical Records
        </button>
      </div>
    </div>
  );
}
