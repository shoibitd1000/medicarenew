import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, FileDown, X } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../authtication/Authticate"; // Adjust path as needed
import { apiUrls } from "../../../../components/Network/ApiEndpoint"; // Adjust path as needed
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomMultiSelect from "../../../../components/components/ui/CustomMultiSelect";
import { Button } from "../../../../components/components/ui/button";
import Toaster, { notify } from "../../../../lib/notify";
import IsLoader from "../../../loading";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";

const InvestigationsAppoin = () => {
    const { id: centerID, centername = "Tenwek Hospital" } = useParams();
    const navigate = useNavigate();
    const { token, userData, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
    const patientid = getCurrentPatientId();
    const patientName = `${userData?.FirstName || ""} ${userData?.LastName || ""}`.trim() || "User Name Not Found";

    const [tab, setTab] = useState("past");
    const [selectedDate, setSelectedDate] = useState(null);
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [toDate, setToDate] = useState(new Date());
    const [searchData, setSearchData] = useState([]);
    const [selectedInvestigations, setSelectedInvestigations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [upAppointments, setUpAppointments] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState("");
    const [webViewVisible, setWebViewVisible] = useState(false);
    const [latestTransactionNo, setLatestTransactionNo] = useState(null);
    console.log(latestTransactionNo,"latest");
    
    const iframeRef = useRef(null);

    const totalAmount = selectedInvestigations.reduce(
        (sum, item) => sum + (item.rate || 0),
        0
    );

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

    const formatAppointmentDate = (date) => {
        if (!date) return "04-Sep-2025";
        const day = date.getDate().toString().padStart(2, "0");
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formateToFetchApp = (date) => {
        if (!date) return "2025-02-02";
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    

    const Search_Package = async () => {
        setLoading(true);
        try {
            if (!token) {
                console.error("No token available");
                setTimeout(() => navigate("/login"), 10000);
                return;
            }
            const response = await axios.post(
                apiUrls.testNameapi,
                {},
                { headers: getAuthHeader() }
            );
            if (response?.data?.status === true) {
                setSearchData(response.data.response);
            } else {
                console.error("Unexpected response format:", response.data);
                setSearchData([]);
            }
        } catch (error) {
            console.error("Error fetching investigations:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
            setSearchData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async (centerID, selectedTab) => {
        setLoading(true);
        setNoDataMessage("");
        try {
            if (!token) {
                console.error("No token available");
                navigate("/login");
                return;
            }

            if (!centerID) {
                console.error("No center ID provided");
                setNoDataMessage("Please select a center.");
                return;
            }

            if (selectedTab === "past" && fromDate > toDate) {
                setNoDataMessage("From date must be before To date.");
                setPastAppointments([]);
                return;
            }

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const formattedFromDate =
                selectedTab === "upcoming"
                    ? formateToFetchApp(today)
                    : formateToFetchApp(fromDate);
            const formattedToDate =
                selectedTab === "upcoming"
                    ? formateToFetchApp(new Date(now.setFullYear(now.getFullYear() + 1)))
                    : formateToFetchApp(toDate);

            const encodedPatientId = encodeURIComponent(patientid || "");
            const apiUrl = `${apiUrls.bindServicesRequest}?PatientID=${encodedPatientId}&MobileAppID=esLCtIuIS8Ci9QmQlI01mJ1MBqICiAwxbqSDrevOH6I%3D&FromDate=${encodeURIComponent(
                formattedFromDate
            )}&ToDate=${encodeURIComponent(formattedToDate)}&CentreID=${centerID}`;

            const response = await axios.post(apiUrl, {}, { headers: getAuthHeader() });

            if (response?.data?.status === true && response.data.response?.length > 0) {
                const appointments = response.data.response
                    .map((item) => {
                        const dateParts = item.DATES.split("-");
                        if (dateParts.length !== 3) return null;

                        const day = parseInt(dateParts[0], 10);
                        const monthStr = dateParts[1];
                        const year = parseInt(dateParts[2], 10);
                        const monthNames = [
                            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                        ];
                        const month = monthNames.indexOf(monthStr);
                        if (month === -1) return null;

                        const appointmentDate = new Date(year, month, day);
                        if (isNaN(appointmentDate.getTime())) return null;

                        return {
                            id: `${item.ItemID}`,
                            TestName: item.ItemName,
                            PName: item.PatientName,
                            dateTime: item.DATES,
                            center: item.CentreName,
                            cancel: item?.IsActive,
                            appointmentDate: item.DATES,
                            STATUS: item.STATUS,
                            Department: item?.Department,
                            parsedDate: appointmentDate.getTime(),
                        };
                    })
                    .filter(Boolean);

                const past = [];
                const upcoming = [];
                appointments.forEach((appointment) => {
                    if (appointment.parsedDate >= today.getTime()) {
                        upcoming.push(appointment);
                    } else {
                        past.push(appointment);
                    }
                });

                past.sort((a, b) => b.parsedDate - a.parsedDate);
                upcoming.sort((a, b) => a.parsedDate - b.parsedDate);

                setPastAppointments(past);
                setUpAppointments(upcoming);
            } else {
                setNoDataMessage(response?.data?.message || "No appointments found.");
                setPastAppointments([]);
                setUpAppointments([]);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setNoDataMessage("Failed to fetch appointments. Please try again.");
            setPastAppointments([]);
            setUpAppointments([]);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSaveAppointment = async (referenceNo) => {
        try {
            const apiUrl = `${apiUrls.saveItemDetailsapi}?MobileAppID=esLCtIuIS8Ci9QmQlI01mJ1MBqICiAwxbqSDrevOH6I%3D`;
            const formattedDate = formatAppointmentDate(selectedDate);
            const user = {
                Address: userData?.Address || "",
                Age: userData?.Age || "",
                Email: userData?.Email || "",
                FirstName: userData?.FirstName || "",
                LastName: userData?.LastName || "",
                Gender: userData?.Gender || "",
                Mobile: userData?.Mobile || "",
                Title: userData?.Title || "",
            };
            const body = {
                investigation_Details: selectedInvestigations.map((item) => ({
                    AppDate: formattedDate,
                    AppTime: formattedDate,
                    CentreID: centerID || 1,
                    DiscountAmt: 0,
                    DiscountPer: 0,
                    EntryBy: "EMP009",
                    ItemID: item.value,
                    Address: user.Address,
                    Age: user.Age,
                    Rate: item.rate,
                    Email: user.Email,
                    PFirstName: user.FirstName,
                    Gender: user.Gender,
                    PLastName: user.LastName,
                    MobileNo: user.Mobile,
                    OnlineAppType: 1,
                    PTitle: user.Title,
                    PatientID: patientid,
                    RequestID: 0,
                })),
                appointment_mobilepaymentdetail: [
                    {
                        Adjustment: totalAmount,
                        ReffrenceNo: referenceNo,
                        OrderID: referenceNo,
                    },
                ],
            };
            const response = await axios.post(apiUrl, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            debugger
            if (response.data?.status) {
                notify("Appointment saved successfully!");
                setLatestTransactionNo(response.data.response);
                setWebViewVisible(false);
                setShowConfirm(false);
                // Open PDF in new tab
                const pdfUrl = getPdfUrl(response.data.response);
                if (pdfUrl) {
                    window.open(pdfUrl, "_blank");
                } else {
                    notify("Failed to generate PDF URL.");
                }
                // Reset states after opening PDF
                setSelectedDate(null);
                setSelectedInvestigations([]);
                setSearchQuery("");
                setLatestTransactionNo(null);
            } else {
                notify(response.data?.message || "Failed to save appointment.");
            }
        } catch (error) {
            console.error("Error saving appointment:", error);
            notify("Failed to save appointment. Please try again.");
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const handlePayment = () => {
        if (selectedInvestigations.length === 0 || !selectedDate) {
            notify("Please select an investigation and date.");
            return;
        }
        const patientID = userData?.PatientASID || "";
        const phoneNumber = userData?.Mobile || "";
        const billNo = "";
        const amount = totalAmount;
        // Replace with actual payment URL
        const url = `https://example.com/payment?patientID=${patientID}&amount=${amount}`;
        setPaymentUrl(url);
        setWebViewVisible(true);
        setShowConfirm(false);
        const element = document.activeElement;
        element.classList.add("animate-pulse");
        setTimeout(() => element.classList.remove("animate-pulse"), 100);
    };

    const handleConfirm = () => {
        if (selectedInvestigations.length === 0 || !selectedDate) {
            notify("Please select an investigation and date.");
            return;
        }
        setShowConfirm(true);
    };

    const handleIframeLoad = (event) => {
        const url = event.currentTarget.contentWindow.location.href;
        if (url.includes("/MobileMpesaSuccess.aspx")) {
            const queryString = url.split("?")[1] || "";
            const params = {};
            queryString.split("&").forEach((param) => {
                const [key, value] = param.split("=");
                params[key] = value;
            });
            const receiptNumber = params["ReceiptNumber"];
            if (receiptNumber) {
                fetchSaveAppointment(receiptNumber);
                notify("Payment received successfully!");
            } else {
                notify("Payment successful but no receipt number found.");
                setWebViewVisible(false);
            }
        } else if (url.includes("/failure") || url.includes("payment=failed")) {
            notify("Payment failed. Please try again.");
            setWebViewVisible(false);
        }
    };

    useEffect(() => {
        if (centerID && tab) {
            fetchAppointments(centerID, tab);
        }
    }, [token, selectedDate, centerID, fromDate, toDate, tab]);

    useEffect(() => {
        Search_Package();
    }, [token]);

    const multiSelectOptions = searchData.map((item) => ({
        value: item.ItemID,
        label: item.TestName,
        rate: item.ItemRate,
        precaution: item?.precaution,
    }));

    const UpcomingRender = ({ item }) => {
        const tests = item.TestName.split(",").map((t) => t.trim());
        return (
            <div
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full max-w-[600px] mx-auto"
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-blue-600 truncate">{item.PName}</h3>
                        <p className="text-sm text-gray-500 truncate">{item.center}</p>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">Tests: {tests.length}</p>
                    <p className="font-semibold text-gray-800 text-sm">{item.Department}</p>
                    <p className="text-gray-600 text-sm break-words">{tests.join(", ")}</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-600">{item.dateTime}</p>
                    {item.STATUS === "Done" && (
                        <span className="text-xs font-medium text-white bg-blue-400 px-2 py-1 rounded ml-2">
                            Schedule
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const PastRender = ({ item }) => (
        <div
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full max-w-[600px] mx-auto"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-blue-600  w-[calc(100%-20%)]">
                    {item.TestName}
                </h3>
                <p className="text-xs text-gray-500 font-bold truncate">{item.center}</p>
            </div>
            <p className="text-sm font-semibold text-gray-800 truncate">{item.PName}</p>
            <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-600">{item.dateTime}</p>
                <a
                    href={"http://197.138.207.30/Tenwek2208/Design/Common/CommonPrinterOPDThermal.aspx?ReceiptNo=&LedgerTransactionNo=4387151&IsBill=1&Duplicate=1&Type=OPD"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition-colors"
                >
                    <FileDown className="h-5 w-5 text-gray-600" />
                </a>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 p-4 min-h-screen bg-blue-50">
            <div className="text-center">
                <p className="text-gray-500">
                    Plan Your Upcoming and Past Investigations
                </p>
            </div>
            <Toaster />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-7xl m-auto">
                {["book", "upcoming", "past"].map((t) => (
                    <button
                        key={t}
                        className={`py-2 border rounded-t-md text-sm sm:text-base font-semibold ${
                            tab === t
                                ? "bg-blue-800 text-white shadow-md"
                                : "bg-gray-100"
                        } transition-colors`}
                        onClick={() => setTab(t)}
                    >
                        {t === "book" ? "Book New" : t === "upcoming" ? "Upcoming" : "Past"}
                    </button>
                ))}
            </div>

            {tab === "book" && (
                <div
                    className="bg-white border rounded-b-lg p-4 sm:p-6 shadow max-w-7xl mx-auto"
                >
                    {showConfirm ? (
                        <div>
                            <div className="p-2 text-center my-2">
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-600">
                                    Confirm Investigation
                                </h2>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-4">Investigation Details</h2>
                            </div>
                            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border p-4 sm:p-5 rounded">
                                <p>
                                    <strong>Patient:</strong> {patientName}
                                </p>
                                <p>
                                    {/* <strong>Center:</strong> {CenterName} */}
                                </p>
                                <p className="flex items-start gap-2">
                                    <strong className="text-gray-700 min-w-[120px]">Investigation:</strong>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-lg shadow-sm ${
                                            selectedInvestigations.length > 0
                                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                                : "bg-gray-100 text-gray-500 border border-gray-300 italic"
                                        }`}
                                    >
                                        {selectedInvestigations.length > 0
                                            ? selectedInvestigations.map((d) => d.label).join(", ")
                                            : "None selected"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {selectedDate
                                        ? selectedDate.toLocaleDateString("en-US", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "Not selected"}
                                </p>
                                <p>
                                    <strong>Total Cost:</strong> KES {totalAmount}
                                </p>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        className="px-4 py-2 bg-gray-200 rounded w-full text-sm sm:text-base"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded w-full text-sm sm:text-base"
                                        onClick={handlePayment}
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="py-2 px-4 sm:px-6 shadow-md flex mb-1 justify-between items-start sm:items-center">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold">
                                        Book a New Investigation(s)
                                    </h2>
                                    <p className="text-xs text-cyan-500">
                                        Booking a test at Tenwek. Change center for other locations
                                    </p>
                                </div>
                                <Button
                                    className="text-white bg-blue-600 mt-2 sm:mt-0 text-sm sm:text-base"
                                    onClick={() => navigate(-1)}
                                >
                                    Change Center
                                </Button>
                            </div>
                            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <CustomMultiSelect
                                    options={multiSelectOptions}
                                    selectedValues={selectedInvestigations}
                                    onChange={setSelectedInvestigations}
                                    placeholder="Select an Investigation(s)"
                                    placeholderText="Search Investigation..."
                                    repClass="focus:outline-none focus:ring focus:ring-blue-500 w-full"
                                    label="Select an Investigation(s)"
                                    required
                                />
                                <CustomDatePicker
                                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                    value={selectedDate}
                                    placeHolderText="Select Date"
                                    handleDate={(date) => setSelectedDate(date)}
                                    icon={
                                        <Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />
                                    }
                                    disablePastDates={true}
                                    minDate={new Date()}
                                />
                            </div>
                            {loading && (
                                <div className="flex justify-center my-4">
                                    <IsLoader isFullScreen={false} size="6" />
                                </div>
                            )}
                            <div className="flex justify-center mt-4">
                                <h2 className="text-xl sm:text-2xl font-bold">
                                    Total Amount: KES {totalAmount}
                                </h2>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    className={`px-4 py-2 bg-blue-600 text-white rounded uppercase text-sm sm:text-base ${
                                        !selectedInvestigations.length || !selectedDate
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={handleConfirm}
                                    disabled={!selectedInvestigations.length || !selectedDate}
                                >
                                    Confirm Investigation
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {tab === "upcoming" && (
                <div
                    className="bg-white border rounded-b-lg p-4 sm:p-6 shadow max-w-7xl mx-auto"
                >
                    <div className="py-2 px-4 sm:px-6 shadow-md my-2">
                        <h2 className="text-xl sm:text-2xl font-bold mb-1">Upcoming Investigations</h2>
                    </div>
                    {loading ? (
                        <div className="flex justify-center my-4">
                            <IsLoader isFullScreen={false} size="6" />
                        </div>
                    ) : upAppointments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                            {upAppointments.map((item) => (
                                <UpcomingRender key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <h2 className="text-lg sm:text-xl font-extrabold text-center">
                            {noDataMessage || "No Upcoming Investigations Found."}
                        </h2>
                    )}
                </div>
            )}

            {tab === "past" && (
                <div
                    className="bg-white border rounded-b-lg p-4 sm:p-6 shadow max-w-7xl mx-auto"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="py-2 px-4 sm:px-6">
                            <h2 className="text-xl sm:text-2xl font-bold mb-1">Past Investigations</h2>
                        </div>
                        <div className="grid grid:lg-cols-2">
                            <div className="flex gap-2">
                                <CustomDatePicker
                                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                    value={fromDate}
                                    placeHolderText="From Date"
                                    handleDate={(date) => setFromDate(date)}
                                />
                                <CustomDatePicker
                                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                    value={toDate}
                                    placeHolderText="To Date"
                                    handleDate={(date) => setToDate(date)}
                                />
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center my-4">
                            <IsLoader isFullScreen={false} size="6" />
                        </div>
                    ) : pastAppointments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                            {pastAppointments.map((item, i) => (
                                <PastRender key={i} item={item} />
                            ))}
                        </div>
                    ) : (
                        <h2 className="text-lg sm:text-xl font-extrabold text-center">
                            No Past Investigations Found.
                        </h2>
                    )}
                </div>
            )}

            {webViewVisible && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold text-blue-600">M-Pesa Payment</h2>
                            <button onClick={() => setWebViewVisible(false)}>
                                <X className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                        {paymentUrl ? (
                            <iframe
                                ref={iframeRef}
                                src={paymentUrl}
                                className="w-full h-full border-0"
                                onLoad={handleIframeLoad}
                                title="Payment"
                            />
                        ) : (
                            <p className="text-center text-gray-600">Loading payment page...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestigationsAppoin;