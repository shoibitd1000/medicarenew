import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileDown } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../authtication/Authticate";
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

  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  const [fromDate, setFromDate] = useState(lastYear);
  const [toDate, setToDate] = useState(today);

  const navigate = useNavigate();

  // Date formatting (DD-MMM-YYYY)
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch bills
  useEffect(() => {
    if (!activeSection || !patientid || !token) return;

    const fetchBills = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrls.patientBillapi}?PatientID=${patientid}&FromDate=${formatDate(
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

        if (response?.data?.status) {
          const sortedBills = response.data.response
            .filter((b) => b.BillDate)
            .sort((a, b) => new Date(b.BillDate) - new Date(a.BillDate));
          setBills(sortedBills);
        } else {
          setBills([]);
        }
      } catch (err) {
        console.error("Error fetching bills:", err);
        notify("Error fetching bills. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [activeSection, fromDate, toDate, patientid, token]);

  const prefixes = { OPD: "OPD", IPD: "IPD", Emergency: "EM" };
  const filteredBills = activeSection
    ? bills.filter((b) => b.TYPE?.startsWith(prefixes[activeSection]))
    : [];

  const billCategories = [
    { billNo: "OPD", billName: "OPD Bills" },
    { billNo: "IPD", billName: "IPD Bills" },
    { billNo: "Emergency", billName: "Emergency Bills" },
  ];

  const handlePrintBill = (bill) => {
    const pdfUrl = `http://197.138.207.30/Tenwek2208/Design/Common/CommonPrinterOPDThermal.aspx?ReceiptNo=&LedgerTransactionNo=${bill.Transaction_ID || ""
      }&IsBill=1&Duplicate=1&Type=${activeSection === "Emergency" ? "EM" : activeSection
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

      {/* Show bill categories if no section selected */}
      {!activeSection ? (
        <div className="max-w-4xl mx-auto">
          {billCategories.map((item, i) => (
            <div
              key={item.billNo}
              className="flex items-center justify-between my-3 py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => setActiveSection(item.billNo)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">💵</span>
                <div>
                  <p className="font-medium">{item.billName}</p>
                  <p className="text-xs text-primary">View {item.billName}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Back Button + Date Filters */}
          <div className="w-full m-auto md:w-1/2 my-3">
            {/* <button
              className="mb-4 border-2 py-2 px-4 rounded-lg hover:bg-primary-dark transition"
              onClick={() => setActiveSection(null)}
            >
              Back
            </button> */}

            <div className="mb-4 grid lg:grid-cols-2 gap-3 bg-white shadow-md p-4 rounded-md">
              <CustomDatePicker
                id="fromDate"
                value={fromDate}
                placeHolderText="From Date"
                handleDate={setFromDate}
              />
              <CustomDatePicker
                id="toDate"
                value={toDate}
                placeHolderText="To Date"
                handleDate={setToDate}
              />
            </div>
          </div>

          {/* Bill List */}
          {loading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <IsLoader isFullScreen={false} size="6" />
            </div>
          ) : filteredBills.length === 0 ? (
            <p className="text-gray-500 text-center text-lg font-bold">
              NO {activeSection?.toUpperCase()} BILLS
            </p>
          ) : (
            <div className="w-full m-auto  my-3">
              <div className="grid lg:grid-cols-2 gap-3 bg-white shadow-md p-4 rounded-md">
                {filteredBills.map((bill, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{bill.BillNo || "N/A"}</p>
                      <p className="text-sm text-gray-600">{bill.BillDate || "N/A"}</p>
                      <p className="text-sm text-gray-600"><b>{bill.CentreName || "N/A"}</b></p>


                    </div>
                    <div className="flex gap-2">
                      <p className="text-sm font-bold">
                        KES {(bill.BillAmount || 0).toFixed(2)}
                      </p>
                      
                      <FileDown
                        className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintBill(bill);
                        }}
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BillReportPage;
