import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomSelect from "../../../../components/components/ui/CustomSelect";
import { Button } from "../../../../components/components/ui/button";
import { Calendar, FileDown, Video } from "lucide-react";
import { closeIcon, DialogBox } from "../../../../components/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../../../app/authtication/Authticate';
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";
// import { GET_DR_TELE } from "../../../../src/const/config"; // Adjust path as needed

const TeleconsultationAppointment = () => {
    const navigate = useNavigate();
    const { token, userData, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
    const patientid = getCurrentPatientId();
    const centerID = 1; // Replace with dynamic center ID if passed via props or context
    const centerName = "Kaboson"; // Replace with dynamic center name if available

    // State management
    const [tab, setTab] = useState("book");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
    const [upAppointments, setUpAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [upcomingErrorMessage, setUpcomingErrorMessage] = useState("");
    const [pastErrorMessage, setPastErrorMessage] = useState("");
    const [appointmentRate, setAppointmentRate] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [toDate, setToDate] = useState(new Date());

    // Fetch appointments on mount and when token changes
    useEffect(() => {
        fetchAppointments();
    }, [token, tab, fromDate, toDate]);

    // Fetch doctors when doctor selection modal is opened
    useEffect(() => {
        if (tab === "book") {
            fetchDoctors();
        }
    }, [tab, token]);

    // Fetch time slots when doctor and date are selected
    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchTimeSlots();
        } else {
            setTimeSlots([]);
            setSelectedSlot(null);
        }
    }, [selectedDoctor, selectedDate, token]);

    // API: Fetch Doctors
    const fetchDoctors = async () => {
        setDoctorLoading(true);
        try {
            if (!token) {
                console.error("No token available");
                setDoctors([]);
                return;
            }
            const response = await axios.post(
                apiUrls.doctor_speciality,
                { CentreID: centerID || 1 },
                { headers: getAuthHeader() }
            );
            if (response?.data?.status === true) {
                setDoctors(response.data.response);
            } else {
                console.error("Unexpected doctors response format:", response.data);
                setDoctors([]);
            }
        } catch (error) {
            console.error(
                "Error fetching doctors:",
                error.response?.status,
                error.response?.data
            );
            if (error.response?.status === 401) {
                navigate("/enter-mpin");
            }
            setDoctors([]);
        } finally {
            setDoctorLoading(false);
        }
    };

    // API: Fetch Time Slots
    const fetchTimeSlots = async () => {
        setTimeSlotsLoading(true);
        try {
            if (!token) {
                console.error("No token available");
                setTimeSlots([]);
                return;
            }
            const doctor = doctors.find((doc) => doc.DoctorName === selectedDoctor);
            if (!doctor || !doctor.DoctorID) {
                console.error("Selected doctor or DoctorID not found");
                setTimeSlots([]);
                return;
            }
            const formattedDate = selectedDate
                ? selectedDate.toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0];
            const apiUrl = `http://197.138.207.30/MobileApp_API/API/LoginAPIDynamic/ReactbindappointmentslotMobileApp?CentreID=${centerID}&appdate=${formattedDate}&DoctorID=${doctor.DoctorID}`;
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response?.data?.status === true && Array.isArray(response.data.response)) {
                setTimeSlots(response.data.response);
            } else {
                console.warn("No time slots available or invalid response format:", response.data);
                setTimeSlots([]);
            }
        } catch (error) {
            console.error(
                "Error fetching time slots:",
                error.response?.status,
                error.response?.data || error.message
            );
            if (error.response?.status === 401) {
                navigate("/enter-mpin");
            }
            setTimeSlots([]);
        } finally {
            setTimeSlotsLoading(false);
        }
    };

    // API: Fetch Appointment Rate
    const fetchAppointmentRate = async (doctorId) => {
        try {
            const apiUrl = `http://197.138.207.30/MobileApp_API/API/LoginAPIDynamic/GetAppointmentRate?IsTeleconsultation=1&DoctorID=${doctorId}&CenteID=${centerID}`;
            const response = await axios.post(
                apiUrl,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response?.data?.status === true && response.data.response.length > 0) {
                setAppointmentRate(response.data.response[0]);
            } else {
                console.error("Unexpected rate response format:", response.data);
                setAppointmentRate(null);
                alert("Unable to fetch appointment rate.");
            }
        } catch (error) {
            console.error(
                "Error fetching appointment rate:",
                error.response?.status,
                error.response?.data
            );
            setAppointmentRate(null);
            alert("Failed to fetch appointment rate.");
            if (error.response?.status === 401) {
                navigate("/enter-mpin");
            }
        }
    };

    // API: Save Appointment
    const fetchSaveAppointment = async (referenceNo) => {
        try {
            const apiUrl =
                "http://197.138.207.30/MobileApp_API/API/LoginAPIDynamic/SaveAppointment?sourceType=video";
            const selectedDoctorData = doctors.find(
                (doc) => doc.DoctorName === selectedDoctor
            );

            if (!selectedDoctorData) {
                alert("Selected doctor data not found.");
                return;
            }

            const formatAppointmentDate = (date) => {
                if (!date) return "01-Sep-2025";
                const day = date.getDate().toString().padStart(2, "0");
                const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ];
                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };

            const formattedDate = formatAppointmentDate(selectedDate);
            const fromTime = selectedSlot ? selectedSlot.FromTime : "03:00:00";
            const toTime = selectedSlot ? selectedSlot.ToTime : "03:40:00";

            const body = {
                appointment_mobile: [
                    {
                        AppDate: formattedDate,
                        AppType: 5,
                        CenrteID: centerID,
                        DoctorID: selectedDoctorData?.DoctorID || selectedDoctorData?.ID,
                        Doctor_Name: selectedDoctor,
                        EndTime: toTime,
                        FromTime: fromTime,
                        HashCode: "534",
                        ItemCode: appointmentRate?.ItemCode || "",
                        ItemID: appointmentRate?.ItemID || "4660",
                        PAddress: userData?.Address || "",
                        PAge: userData?.Age || "",
                        PAmount: appointmentRate?.Rate || 1100.0,
                        PEmail: userData?.Email || "n11@gmail.com",
                        PFirstName: userData?.FirstName || "NEELAM",
                        PGender: userData?.Gender || "Female",
                        PLastName: userData?.LastName || "SINGH",
                        PMobileno: userData?.Mobile || "0757270488",
                        PTitle: userData?.Title || "Mrs.",
                        PatientID: patientid,
                        Ratelistid: appointmentRate?.RateListID || 10,
                        ScheduleChargeID: appointmentRate?.ScheduleChargeID || 100,
                        UserID: userData?.ID || "gRWyl7xEbEiVQ3u397J1KQ==",
                    },
                ],
                appointment_mobilepaymentdetail: [
                    {
                        Adjustment: appointmentRate?.Rate || 1100.0,
                        ReffrenceNo: referenceNo || "zxc12345678",
                        OrderID: "zxc123456",
                    },
                ],
            };

            const response = await axios.post(apiUrl, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data?.status === true) {
                alert("Appointment saved successfully!");
                setShowConfirm(false);
                setPdfModalVisible(true);
                fetchAppointments();
            } else {
                alert(response.data?.message || "Failed to save appointment.");
            }
        } catch (error) {
            console.error(
                "Error calling SaveAppointment:",
                error.response?.status,
                error.response?.data || error.message
            );
            alert("Failed to save appointment. Please try again.");
            if (error.response?.status === 401) {
                navigate("/enter-mpin");
            }
        }
    };

    // API: Fetch Appointments
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            if (!token) {
                console.error("No token available");
                return;
            }

            const formatAppointmentDate = (date) => {
                if (!date) return "04-Sep-2025";
                const day = date.getDate().toString().padStart(2, "0");
                const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ];
                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };

            const dateToUse = new Date();
            const formattedDate = formatAppointmentDate(dateToUse);
            const encodedPatientId = encodeURIComponent(encryptPassword(patientid));
            const formattedFromDate =
                tab === "upcoming" ? formattedDate : formatAppointmentDate(fromDate);
            const formattedToDate =
                tab === "upcoming" ? formattedDate : formatAppointmentDate(toDate);

            const doctor = selectedDoctor
                ? doctors.find((doc) => doc.DoctorName === selectedDoctor)
                : null;
            const doctorID = doctor?.DoctorID || 555;



            const response = await axios.post(
                `${apiUrls.doctors}?patientid=${encodedPatientId}` +
                `&IsTeleconsulation=1` +
                `&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D` +
                `&FromDate=${encodeURIComponent(encryptPassword(formattedFromDate))}` +
                `&ToDate=${encodeURIComponent(encryptPassword(formattedToDate))}` +
                `&DoctorID=${doctorID}` +
                `&Status=IsConform`,
                null,
                {headers: getAuthHeader(),
            }
            );



            if (response?.data?.status === true) {
                const appointments = response.data.response || [];
                const past = [];
                const upcoming = [];

                appointments.forEach((item) => {
                    const dateParts = item.BookingDate.split("-");
                    const day = parseInt(dateParts[0], 10);
                    const monthStr = dateParts[1];
                    const year = parseInt(dateParts[2], 10);

                    const monthNames = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                    ];
                    const month = monthNames.indexOf(monthStr);

                    if (month === -1) {
                        console.error(`Invalid month format in BookingDate: ${item.BookingDate}`);
                        return;
                    }

                    const [hours, minutes] = item.BookingTime.split(":");
                    const appointmentDate = new Date(year, month, day, parseInt(hours), parseInt(minutes));

                    const appointmentData = {
                        id: `${item.App_ID}`,
                        doctor: item.DrName,
                        PName: item.PName,
                        specialty: item.DoctorSpeciality,
                        dateTime: `${item.BookingDate} at ${item.BookingTime}`,
                        center: item.CentreName,
                        status: item.IsConform === 1 ? "Confirmed" : "Pending",
                    };

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const appointmentOnlyDate = new Date(appointmentDate);
                    appointmentOnlyDate.setHours(0, 0, 0, 0);

                    if (appointmentOnlyDate.getTime() < today.getTime()) {
                        past.push(appointmentData);
                    } else {
                        upcoming.push(appointmentData);
                    }
                });

                setPastAppointments(past);
                setUpAppointments(upcoming);

                setUpcomingErrorMessage(
                    upcoming.length === 0 && tab === "upcoming"
                        ? "No upcoming appointments found."
                        : ""
                );
                setPastErrorMessage(
                    past.length === 0 && tab === "past" ? "No past appointments found." : ""
                );
            } else {
                setPastAppointments([]);
                setUpAppointments([]);
                setUpcomingErrorMessage(
                    tab === "upcoming"
                        ? response?.data?.message || "No upcoming appointments available"
                        : ""
                );
                setPastErrorMessage(
                    tab === "past" ? response?.data?.message || "No past appointments available" : ""
                );
            }
        } catch (error) {
            console.error(
                "Error fetching appointments:",
                error,
                error.response?.data || error.message
            );
            if (error.response?.status === 401) {
                navigate("/enter-mpin");
            }
            setPastAppointments([]);
            setUpAppointments([]);
            setUpcomingErrorMessage(
                tab === "upcoming" ? "Failed to fetch upcoming appointments" : ""
            );
            setPastErrorMessage(tab === "past" ? "Failed to fetch past appointments" : "");
        } finally {
            setLoading(false);
        }
    };

    // Handle Video Call
    const handleVideoCall = async () => {
        const url = "https://demo.vimhans.live/AppID12";
        if (window.confirm("You are about to start a video consultation. Do you want to proceed?")) {
            try {
                window.open(url, "_blank");
            } catch (error) {
                console.error("Error opening video call link:", error.message);
                alert("Failed to open video call link.");
            }
        }
    };

    // Handle Payment
    const handlePayment = () => {
        const patientID = userData?.PatientASID;
        const phoneNumber = userData?.Mobile;
        const billNo = "";
        const amount = appointmentRate?.Rate || 800;

        const url = `http://197.138.207.30/Tenwek2208/Design/OPD/MobileMpesaRequest.aspx?PatientID=${encodeURIComponent(
            encryptPassword(patientID)
        )}&PhoneNumber=${encodeURIComponent(
            encryptPassword(phoneNumber)
        )}&BillNo=${encodeURIComponent(
            encryptPassword(billNo)
        )}&Amount=${encodeURIComponent(encryptPassword(amount))}`;

        setPaymentUrl(url);
        setShowPaymentModal(true);
    };


    // Confirm Appointment
    const handleConfirm = async () => {
        if (!selectedDoctor || !selectedDate || !selectedSlot) {
            alert("Please select a doctor, date, and time slot.");
            return;
        }

        const selectedDoctorData = doctors.find((doc) => doc.DoctorName === selectedDoctor);
        if (!selectedDoctorData) {
            alert("Selected doctor not found.");
            return;
        }

        setLoading(true);
        await fetchAppointmentRate(selectedDoctorData.DoctorID);
        setLoading(false);
        setShowConfirm(true);
    };

    return (
        <div className="space-y-8 p-4">
            <div className="text-center">
                <p className="text-gray-500">
                    Manage your upcoming and past Consultations.
                </p>
            </div>

            <div className="m-0">
                <div className="grid grid-cols-3 gap-2">
                    {["book", "upcoming", "past"].map((tabName) => (
                        <button
                            key={tabName}
                            className={`py-2 shadow-md border rounded-t-md ${tab === tabName ? "bg-white font-semibold shadow-md" : ""
                                }`}
                            onClick={() => setTab(tabName)}
                        >
                            {tabName === "book" ? "Book New" : tabName === "upcoming" ? "Upcoming" : "Past"}
                        </button>
                    ))}
                </div>

                {tab === "book" && (
                    <div className="bg-white border rounded-b-lg p-4 shadow">
                        {showConfirm ? (
                            <DialogBox
                                open={showConfirm}
                                onOpenChange={setShowConfirm}
                                title="Confirm Teleconsultation"
                                size="xl"
                                closeIcon={closeIcon}
                                footer={
                                    <div className="flex gap-4">
                                        <button
                                            className="px-4 py-2 bg-gray-200 rounded w-full"
                                            onClick={() => setShowConfirm(false)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                                            onClick={handlePayment}
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                }
                            >
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-shadow-sm">Consultation Details</h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 border p-5 rounded">
                                        <p>
                                            <strong>Patient:</strong> {userData?.FirstName || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Center:</strong> {centerName}
                                        </p>
                                        <p>
                                            <strong>Doctor:</strong> {selectedDoctor}
                                        </p>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "numeric",
                                                    day: "numeric",
                                                })
                                                : "N/A"}
                                        </p>
                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {selectedSlot
                                                ? `${selectedSlot.FromTime} - ${selectedSlot.ToTime} (${selectedSlot.ShiftName})`
                                                : "N/A"}
                                        </p>
                                        {appointmentRate && (
                                            <>
                                                <p>
                                                    <strong>Item:</strong> {appointmentRate.Item}
                                                </p>
                                                <p>
                                                    <strong>Rate:</strong> {appointmentRate.Rate}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </DialogBox>
                        ) : (
                            <>
                                <div className="py-2 px-4 shadow-md my-2 flex justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Book a New Teleconsultation</h2>
                                        <p className="text-xs text-cyan-500">
                                            Finding a doctor for online consultations. Your physical location is {centerName}
                                        </p>
                                    </div>
                                    <div>
                                        <Button className="text-white btn" onClick={() => navigate(-1)}>
                                            Change Center
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-6 grid md:grid-cols-2 gap-6">
                                    <CustomSelect
                                        placeholder="Select a Doctor"
                                        options={doctors.map((doc) => ({
                                            value: doc.DoctorName,
                                            label: doc.DoctorName,
                                        }))}
                                        value={
                                            doctors.find((d) => d.DoctorName === selectedDoctor) || null
                                        }
                                        onChange={(selectedOption) => setSelectedDoctor(selectedOption.value)}
                                        isLoading={doctorLoading}
                                    />
                                    <CustomDatePicker
                                        repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                        value={selectedDate}
                                        placeHolderText="Select Date"
                                        handleDate={setSelectedDate}
                                        icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                                    />
                                    <CustomSelect
                                        placeholder="Select a Time Slot"
                                        options={timeSlots.map((slot) => ({
                                            value: slot,
                                            label: `${slot.FromTime} - ${slot.ToTime} (${slot.ShiftName})`,
                                            disabled: slot.SlotStatus === "Booked",
                                        }))}
                                        value={selectedSlot ? { value: selectedSlot, label: `${selectedSlot.FromTime} - ${selectedSlot.ToTime}` } : null}
                                        onChange={(selectedOption) => {
                                            const slot = timeSlots.find((s) => s.FromTime === selectedOption.value.FromTime);
                                            if (slot.SlotStatus === "Booked") {
                                                alert("This time slot is not available for booking.");
                                                return;
                                            }
                                            setSelectedSlot(selectedOption.value);
                                        }}
                                        isLoading={timeSlotsLoading}
                                    />
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        className={`px-4 py-2 bg-blue-600 text-white rounded uppercase ${!selectedDoctor || !selectedDate || !selectedSlot ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        onClick={handleConfirm}
                                        disabled={!selectedDoctor || !selectedDate || !selectedSlot}
                                    >
                                        Confirm Appointment
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {tab === "upcoming" && (
                    <div className="bg-white border rounded-b-lg p-4 shadow">
                        <div className="py-2 px-4 shadow-md my-2">
                            <h2 className="text-2xl font-bold mb-1">Upcoming Teleconsultations</h2>
                        </div>
                        {loading ? (
                            <div className="text-center">Loading...</div>
                        ) : upAppointments.length === 0 ? (
                            <p className="text-center text-gray-500">{upcomingErrorMessage}</p>
                        ) : (
                            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                                {upAppointments.map((app, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-blue-600">{app.doctor}</h3>
                                                <span className="text-xs font-semibold">
                                                    {app.dateTime}
                                                </span>
                                                <div className="text-xs font-semibold text-green-900">{app.status}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold py-3">{app.center}</div>
                                            <div className="text-xs font-semibold py-3 flex gap-2">
                                                <button
                                                    className="px-2 py-1 text-xs font-medium bg-blue-300 text-gray-700 rounded hover:bg-blue-700 transition"
                                                    onClick={handleVideoCall}
                                                >
                                                    <Video />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tab === "past" && (
                    <div className="bg-white border rounded-b-lg p-4 shadow">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3">
                            <div className="py-2 px-4">
                                <h2 className="text-2xl font-bold mb-1">Past Teleconsultations</h2>
                            </div>
                            <div className="flex gap-3">
                                <CustomDatePicker
                                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                    value={fromDate}
                                    placeHolderText="From Date"
                                    handleDate={setFromDate}
                                />
                                <CustomDatePicker
                                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                    value={toDate}
                                    placeHolderText="To Date"
                                    handleDate={setToDate}
                                />
                            </div>
                        </div>
                        {loading ? (
                            <div className="text-center">Loading...</div>
                        ) : pastAppointments.length === 0 ? (
                            <p className="text-center text-gray-500">{pastErrorMessage}</p>
                        ) : (
                            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                                {pastAppointments.map((app, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-blue-600">{app.doctor}</h3>
                                                <div className="text-xs font-semibold">{app.PName}</div>
                                                <span className="text-xs font-semibold">{app.dateTime}</span>
                                                <div>
                                                    <span
                                                        className={`text-xs font-extrabold border rounded py-1 px-2 ${app.status === "Confirmed" ? "text-green-900" : "text-black"
                                                            }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-green-600 py-4">{app.center}</div>
                                            <div className="text-xs font-semibold py-4 flex gap-2">
                                                <button
                                                    className="px-2 py-1 text-xs text-blue-600 font-medium bg-slate-200 rounded-md"
                                                    onClick={() => setPdfModalVisible(true)}
                                                >
                                                    <FileDown />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Payment Modal (using iframe instead of WebView) */}
                <DialogBox
                    open={showPaymentModal}
                    onOpenChange={setShowPaymentModal}
                    title="M-Pesa Payment"
                    size="xl"
                    closeIcon={closeIcon}
                    footer={
                        <button
                            className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                            onClick={() => setShowPaymentModal(false)}
                        >
                            Close
                        </button>
                    }
                >
                    {paymentUrl ? (
                        <iframe
                            src={paymentUrl}
                            className="w-full h-96"
                            onLoad={() => {
                                // Note: Handling payment success/failure via iframe is limited.
                                // Consider implementing a server-side callback or polling mechanism.
                            }}
                        />
                    ) : (
                        <p>Loading payment page...</p>
                    )}
                </DialogBox>

                {/* PDF Modal */}
                <DialogBox
                    open={pdfModalVisible}
                    onOpenChange={setPdfModalVisible}
                    title="Doctor Notes"
                    size="xl"
                    closeIcon={closeIcon}
                    footer={
                        <button
                            className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                            onClick={() => {
                                setPdfModalVisible(false);
                                setDoctors([]);
                                setSelectedDate(null);
                                setTimeSlots([]);
                                setSelectedDoctor(null);
                            }}
                        >
                            Close
                        </button>
                    }
                >
                    <iframe
                        src="http://197.138.207.30/Tenwek2208/Design/Common/CommonPrinterOPDThermal.aspx?ReceiptNo=&LedgerTransactionNo=2019489&IsBill=1&Duplicate=1&Type=OPD"
                        className="w-full h-96"
                        onError={() => {
                            alert("Failed to load PDF.");
                            setPdfModalVisible(false);
                            setDoctors([]);
                            setSelectedDate(null);
                            setTimeSlots([]);
                            setSelectedDoctor(null);
                        }}
                    />
                </DialogBox>
            </div>
        </div>
    );
};

export default TeleconsultationAppointment;