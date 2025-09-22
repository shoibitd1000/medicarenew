import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Printer } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../authtication/Authticate"; // Adjust path as needed
import { encryptPassword } from "../../../components/EncyptHooks/EncryptLib";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import Toaster, { notify } from "../../../lib/notify";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import IsLoader from "../../loading";

const BillReportPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const patientid = getCurrentPatientId();
  const [fromDate, setFromDate] = useState(new Date("2024-01-01"));
  const [toDate, setToDate] = useState(new Date("2025-09-09"));
  const navigate = useNavigate();

  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch bills
  useEffect(() => {
    if (activeSection) {
      const fetchBills = async () => {
        setLoading(true);
        try {
          if (!token) throw new Error("No token available");
          if (!patientid) throw new Error("Patient ID is not available");

          const encodedPatientId = encryptPassword(patientid);

          const response = await axios.get(
            `${apiUrls.patientBillapi}?PatientID=${encodedPatientId}&FromDate=${formatDate(
              fromDate
            )}&ToDate=${formatDate(toDate)}`,
            {
              headers: {
                ...getAuthHeader(),
                "Content-Type": "application/x-www-form-urlencoded",
              },
              timeout: 10000,
            }
          );

          if (response?.data?.status === true) {
            const sortedBills = [...response.data.response]
              .filter((bill) => bill.BillDate)
              .sort((a, b) => {
                const dateA = new Date(
                  a.BillDate.replace(/(\d+)-(\d+)-(\d+)/, "$3-$2-$1")
                );
                const dateB = new Date(
                  b.BillDate.replace(/(\d+)-(\d+)-(\d+)/, "$3-$2-$1")
                );
                return dateB.getTime() - dateA.getTime();
              });
            setBills(sortedBills);
          } else {
            setBills([]);
            notify(response?.data?.message || "No bills found");
          }
        } catch (error) {
          console.error("Error fetching bills:", error);
          notify("Sorry, please try again later");
          if (error.code === "ECONNABORTED") {
            notify("Request timed out. Please check your network connection.");
          } else if (error.response?.status === 401) {
            notify("Unauthorized. Please log in again");
          } else if (error.message) {
            notify(error.message);
          }
          setBills([]);
        } finally {
          setLoading(false);
        }
      };
      fetchBills();
    }
  }, [token, activeSection, fromDate, toDate, patientid, navigate]);

  const prefixes = {
    OPD: "OPD",
    IPD: "IPD",
    Emergency: "EM",
  };

  const filteredBills = activeSection
    ? bills.filter((bill) => bill.TYPE?.startsWith(prefixes[activeSection]))
    : [];

  const billCategories = [
    { billNo: "OPD", billName: "OPD Bills" },
    { billNo: "IPD", billName: "IPD Bills" },
    { billNo: "Emergency", billName: "Emergency Bills" },
  ];

  // PDF print handler
  const handlePrintBill = (bill) => {
    const pdfUrl = `http://197.138.207.30/Tenwek2208/Design/Common/CommonPrinterOPDThermal.aspx?ReceiptNo=&LedgerTransactionNo=${
      bill.Transaction_ID || ""
    }&IsBill=1&Duplicate=1&Type=${
      activeSection === "Emergency" ? "EM" : activeSection
    }`;
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-1">
          My {activeSection || "Bills"}
        </h2>
        <p className="text-gray-500">
          {activeSection
            ? "View your selected bills below."
            : "Please select a hospital center to proceed"}
        </p>
      </div>
      <Toaster />
      {activeSection === null ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          {billCategories.map((item, index) => (
            <div
              key={item.billNo}
              className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => setActiveSection(item.billNo)}
            >
              <div className="flex items-center gap-4">
                <span className="h-6 w-6 text-primary bg-slate-300 rounded-sm">
                  💵
                </span>
                <div>
                  <span className="text-md font-medium">{item.billName}</span>
                  <span className="text-md font-medium block text-xs text-primary">
                    View {item.billName}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full m-auto md:w-1/2 my-3">
          <button
            className="mb-4 border-2 py-2 px-4 rounded-lg hover:bg-primary-dark transition"
            onClick={() => setActiveSection(null)}
          >
            Back
          </button>

          {/* Date filters */}
          <div className="mb-4 grid lg:grid-cols-2 gap-3 bg-white shadow-md p-4 rounded-md">
            <CustomDatePicker value={fromDate} onChange={setFromDate} />
            <CustomDatePicker value={toDate} onChange={setToDate} />
          </div>

          {/* Bills list */}
          {loading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <IsLoader isFullScreen={false} size="6" />
            </div>
          ) : filteredBills.length === 0 ? (
            <p className="text-gray-500 text-center text-lg font-bold">
              NO {activeSection?.toUpperCase()} BILLS
            </p>
          ) : (
            <div className="space-y-3">
              {filteredBills.map((bill, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center cursor-pointer"
                  onClick={() => navigate(`/bill-details/${bill.BillNo}`)}
                >
                  <div>
                    <p className="font-semibold">
                      Bill No: {bill.BillNo || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {bill.BillDate || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Centre: {bill.CentreName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: KES {(bill.BillAmount || 0).toFixed(2)}
                    </p>
                  </div>
                  <Printer
                    className="text-primary cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrintBill(bill);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// BillDetails component
const BillDetails = ({ billNo }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bill, setBill] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="mb-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition"
        onClick={() => navigate(-1)}
      >
        Back to Bills
      </button>

      <div className="mb-4 flex gap-2">
        <CustomDatePicker />
        <CustomDatePicker />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <IsLoader isFullScreen={false} size="6" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : !bill ? (
        <p className="text-gray-500 text-center text-lg font-bold">
          NO BILL DETAILS
        </p>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p>Bill No: {bill.BillNo}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default BillReportPage;
export { BillDetails };
