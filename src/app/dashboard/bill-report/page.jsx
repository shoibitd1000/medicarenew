import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";

// Sample data
const completedBills = [
  {
    billNo: "OPB/24/000225664",
    date: "16-Sep-2024 12:29 PM",
    patientName: "Neelam Singh",
    amount: 1200.0,
  },
  {
    billNo: "IPD/24/000118992",
    date: "12-Aug-2024 03:45 PM",
    patientName: "John Doe",
    amount: 45000.0,
  },
  {
    billNo: "LAB/24/000345112",
    date: "25-Jul-2024 10:15 AM",
    patientName: "Jane Doe",
    amount: 3500.0,
  },
];

const pendingBills = [
  {
    billNo: "OPB/24/000225987",
    date: "28-Sep-2024 11:00 AM",
    patientName: "Sam Doe",
    amount: 500.0,
  },
  {
    billNo: "OPB/24/000225999",
    date: "29-Sep-2024 02:00 PM",
    patientName: "Sam Doe",
    amount: 1500.0,
  },
  {
    billNo: "LAB/24/000345223",
    date: "30-Sep-2024 09:30 AM",
    patientName: "John Doe",
    amount: 800.0,
  },
];

export default function BillReportPage() {
  const navigate = useNavigate();
  const [selectedBills, setSelectedBills] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const totalSelectedAmount = useMemo(() => {
    return selectedBills.reduce((total, billNo) => {
      const bill = pendingBills.find((b) => b.billNo === billNo);
      return total + (bill?.amount || 0);
    }, 0);
  }, [selectedBills]);

  const handlePrint = () => {
    alert("Print functionality is not implemented in this demo.");
  };

  const handleSelectBill = (billNo) => {
    setSelectedBills((prev) =>
      prev.includes(billNo)
        ? prev.filter((no) => no !== billNo)
        : [...prev, billNo]
    );
  };

  const handlePayNow = () => {
    navigate(`/dashboard/bill-report/payment?amount=${totalSelectedAmount}`);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600">Bill History</h1>
        <p className="text-gray-500">View your pending and completed bills.</p>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="grid grid-cols-2 shadow-md">
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-2 px-5 me-2 rounded-t-md border 
            ${activeTab === "pending"
                ? "bg-white font-semibold border-b-0 border-gray-300"
                : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"}
          `}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-2 px-5 me-2 rounded-t-md border 
            ${activeTab === "completed"
                ? "bg-white font-semibold border-b-0 border-gray-300"
                : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"}
          `}
          >
            Completed
          </button>
        </div>

        {/* Pending Bills */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingBills.length > 0 ? (
              <>
                {pendingBills.map((bill) => (
                  <div
                    key={bill.billNo}
                    className="border rounded-md shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white"
                  >
                    <div className="flex items-center gap-4 flex-grow">
                      <input
                        type="checkbox"
                        id={bill.billNo}
                        checked={selectedBills.includes(bill.billNo)}
                        onChange={() => handleSelectBill(bill.billNo)}
                        className="h-6 w-6"
                      />
                      <label
                        htmlFor={bill.billNo}
                        className="cursor-pointer flex-grow"
                      >
                        <p className="font-bold text-lg text-blue-600">
                          {bill.billNo}
                        </p>
                        <p className="text-sm text-gray-500">{bill.date}</p>
                        <p className="mt-2">{bill.patientName}</p>
                      </label>
                    </div>
                    <p className="text-lg font-semibold self-end sm:self-center">
                      KES {bill.amount.toFixed(2)}
                    </p>
                  </div>
                ))}

                {/* Total Selected */}
                {selectedBills.length > 0 && (
                  <div className="mt-6 border rounded-md shadow-lg sticky bottom-4 bg-white">
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div>
                        <p className="text-lg font-bold">Total Selected:</p>
                        <p className="text-2xl font-extrabold text-blue-600">
                          KES {totalSelectedAmount.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={handlePayNow}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium w-full sm:w-auto"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>No pending bills.</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Bills */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedBills.length > 0 ? (
              completedBills.map((bill) => (
                <div
                  key={bill.billNo}
                  className="border rounded-md shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white"
                >
                  <div>
                    <p className="font-bold text-lg text-blue-600">
                      {bill.billNo}
                    </p>
                    <p className="text-sm text-gray-500">{bill.date}</p>
                    <p className="mt-2">{bill.patientName}</p>
                    <p className="text-sm">
                      Paid Amount:{" "}
                      <span className="font-semibold">
                        KES {bill.amount.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>No completed bills found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
