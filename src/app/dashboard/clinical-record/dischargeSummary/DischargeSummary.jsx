import { FileDown, ArrowLeft, Calendar, FilePlus } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../authtication/Authticate";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import IsLoader from "../../../loading";

export default function DischargeSummary() {
    const { token, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
    const [labReports, setLabReports] = useState([]);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const patientId = getCurrentPatientId();

    const fetchDischargeSummaries = async () => {
        setLoading(true);
        try {
            const encodedPatientId = encodeURIComponent(encryptPassword(patientId));
            const response = await axios.get(
                `${apiUrls.dischargeSummaryapi}?PatientId=${encodedPatientId}&FromDate=${fromDate.toISOString().split('T')[0]}&ToDate=${toDate.toISOString().split('T')[0]}`,
                {
                    headers: {
                        ...getAuthHeader(),
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === true) {
                setLabReports(response.data.response || []);
            } else {
                setLabReports([]);
            }
        } catch (error) {
            console.error("Error fetching discharge summaries:", error.response?.data || error.message);
            setLabReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const to = new Date();
        const from = subDays(to, 30);
        setFromDate(from);
        setToDate(to);
    }, []);

    useEffect(() => {
        fetchDischargeSummaries();
    }, [fromDate, toDate, patientId, token]);

    const formatDate = (dateValue) => {
        if (!dateValue) return "N/A";
        const parsedDate = new Date(dateValue);
        if (isNaN(parsedDate)) return "Invalid Date";
        return format(parsedDate, "yyyy-MMM-dd");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4">
            <div className="text-center">
                <FilePlus className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
                <h1 className="text-3xl font-bold text-primary">Discharge Summary</h1>
                <p className="text-gray-500">View Your Discharge Summary.</p>
            </div>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
                <span className="mr-2">←</span> Back
            </button>
            <div className="border rounded-lg shadow-md p-4 bg-white">
                <h2 className="text-lg font-semibold">Your Discharge Summaries</h2>
                <p className="text-sm text-gray-500 mb-4">
                    View your past Discharge Summaries. Use the date picker to filter results. Update as of 05:13 PM IST, September 17, 2025.
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
                {loading ? (
                    <div className="text-center py-8">
                        <IsLoader isFullScreen={false} text="Loading dishcharge Summary..." />
                    </div>
                ) : labReports?.length > 0 ? (
                    labReports.map((item, i) => (
                        <div key={i} className="border rounded-xs shadow-md p-4 bg-white my-3">
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold text-primary">Discharge Summary</h2>
                                <span className="text-sm text-gray-500 mb-4">{item?.IPDNo}</span>
                            </div>
                            <span className="text-sm font-semibold mb-4">{formatDate(item?.EntryDate || item?.date)}</span>
                            <h2 className="text-sm font-semibold">{item?.NAME}</h2>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 mb-4">{item?.NoteID}</span>
                                <a
                                    href={`http://197.138.207.30/Tenwek2208/Design/IPD/printNoteCreationReport_pdf.aspx?TID=2014162&Status=IN&ReportType=PDF&NoteID=1347790`}
                                    fileName={`DischargeSummary_${item?.NoteID}.pdf`}
                                    token={token}
                                    target="_blank"
                                    // download={`discharge summary${item.App_ID}.pdf`}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition"
                                >
                                    <FileDown className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <h2 className="text-lg font-extrabold text-center">No discharge summary available.</h2>
                )}
            </div>
        </div>
    );
}