import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomSelect from "../../../../components/components/ui/CustomSelect";
import { Button } from "../../../../components/components/ui/button";
import { Calendar, FileDown, Video } from "lucide-react";
import { closeIcon, DialogBox } from "../../../../components/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../app/authtication/Authticate";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";
import IsLoader from "../../../loading";
import Toaster, { notify } from "../../../../lib/notify";

const TeleconsultationAppointment = () => {
    const navigate = useNavigate();
    const { token, userData, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
    const patientid = getCurrentPatientId();
    const { id: centerID } = useParams();
    const centerName = "Kaboson";

    // State management
    const [tab, setTab] = useState("book");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
    const [upAppointments, setUpAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [upcomingErrorMessage, setUpcomingErrorMessage] = useState("");
    const [pastErrorMessage, setPastErrorMessage] = useState("");
    const [appointmentRates, setAppointmentRates] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [toDate, setToDate] = useState(new Date());

    // Memoized format date function
    const formatDateForApi = useCallback((date) => {
        if (!date || isNaN(new Date(date).getTime())) {
            return null;
        }
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
    }, []);

    // Validation for booking
    const validateBooking = () => {
        if (!selectedDoctor) {
            notify("Please select a doctor", "warn");
            return false;
        }
        if (!selectedDate) {
            notify("Please select a date", "warn");
            return false;
        }
        if (!selectedSlot) {
            notify("Please select a time slot", "warn");
            return false;
        }
        return true;
    };

    useEffect(() => {
        fetchAppointments();
    }, [token, tab, fromDate, toDate]);

    useEffect(() => {
        if (tab === "book") {
            fetchDoctors();
        }
    }, [tab, token]);

    useEffect(() => {
        let timeoutId;
        if (selectedDoctor && selectedDate && !isNaN(new Date(selectedDate).getTime())) {
            timeoutId = setTimeout(() => {
                fetchTimeSlots();
            }, 300);
        } else {
            setTimeSlots([]);
            setSelectedSlot(null);
        }
        return () => clearTimeout(timeoutId);
    }, [selectedDoctor, selectedDate]);

    // API: Fetch Doctors
    const fetchDoctors = async () => {
        setDoctorLoading(true);
        try {
            if (!token) {
                setDoctors([]);
                notify("Authentication token is missing.", "error");
                return;
            }
            const response = await axios.post(
                apiUrls.doctor_speciality,
                { CentreID: centerID || 1 },
                { headers: getAuthHeader() }
            );
            if (response?.data?.status && Array.isArray(response.data.response)) {
                setDoctors(response.data.response);
            } else {
                setDoctors([]);
                notify("No doctors found.", "info");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setDoctors([]);
            notify("Failed to fetch doctors.", "error");
            if (error.response?.status === 401) {
                navigate("/");
            }
        } finally {
            setDoctorLoading(false);
        }
    };

    // API: Fetch Time Slots
    const fetchTimeSlots = async () => {
        setTimeSlotsLoading(true);
        setTimeSlots([]);
        setSelectedSlot(null);
        try {
            if (!token) {
                notify("Authentication token is missing.", "error");
                return;
            }
            if (!selectedDate || isNaN(new Date(selectedDate).getTime())) {
                notify("Please select a valid date.", "error");
                return;
            }
            const doctor = doctors.find((doc) => doc.doctorname === selectedDoctor);
            if (!doctor?.ID) {
                notify("Selected doctor not found.", "error");
                return;
            }
            const formattedDate = new Date(
                new Date(selectedDate).setDate(new Date(selectedDate).getDate() + 1)
            ).toISOString().split("T")[0];

            const response = await axios.get(
                `${apiUrls.appointmentslot}?CentreID=${centerID || 1}&appdate=${formattedDate}&DoctorID=${doctor.ID}`,
                { headers: getAuthHeader() }
            );
            if (response?.data?.status && Array.isArray(response.data.response)) {
                const uniqueSlots = response.data.response
                    .filter(
                        (slot, index, self) =>
                            index ===
                            self.findIndex(
                                (s) => s.FromTime === slot.FromTime && s.ToTime === slot.ToTime
                            )
                    )
                    .filter((slot) => slot.SlotStatus !== "Booked")
                    .map((slot) => ({
                        value: `${slot.FromTime}-${slot.ToTime}`,
                        label: `${slot.FromTime} - ${slot.ToTime} (${slot.ShiftName})`,
                        fromTime: slot.FromTime,
                        toTime: slot.ToTime,
                        status: slot.SlotStatus,
                        shiftName: slot.ShiftName,
                    }));
                setTimeSlots(uniqueSlots);
                if (uniqueSlots.length === 0) {
                    notify("No available time slots for the selected doctor and date.", "info");
                }
            } else {
                notify(response.data?.message || "No time slots available.", "info");
            }
        } catch (error) {
            console.error("Error fetching time slots:", error);
            notify("Failed to fetch time slots. Please try again.", "error");
            if (error.response?.status === 401) {
                navigate("/");
            }
        } finally {
            setTimeSlotsLoading(false);
        }
    };

    // API: Fetch Appointment Rate
    const fetchAppointmentRates = async (doctorId) => {
        try {
            const response = await axios.post(
                `${apiUrls.appointmentRate}?IsTeleconsultation=1&DoctorID=${doctorId}&CentreID=${1}`,
                {},
                {
                    headers: {
                        ...getAuthHeader(),
                    },
                }
            );
            if (response?.data?.status && response.data.response?.length > 0) {
                setAppointmentRates(response.data.response[0]);
            } else {
                setAppointmentRates(null);
                notify("Unable to fetch appointment rate.", "error");
            }
        } catch (error) {
            console.error("Error fetching appointment rate:", error);
            setAppointmentRates(null);
            notify("Failed to fetch appointment rate.", "error");
            if (error.response?.status === 401) {
                navigate("/");
            }
        }
    };

    // API: Save Appointment
    const fetchSaveAppointment = async (referenceNo) => {
        try {
            const selectedDoctorData = doctors.find((doc) => doc.doctorname === selectedDoctor);
            if (!selectedDoctorData) {
                notify("Selected doctor data not found.", "error");
                return;
            }
            if (!selectedSlot) {
                notify("Please select a valid time slot.", "error");
                return;
            }
            const formattedDate = formatDateForApi(selectedDate);
            if (!formattedDate) {
                notify("Invalid appointment date.", "error");
                return;
            }
            const body = {
                appointment_mobile: [
                    {
                        AppDate: formattedDate,
                        AppType: 5,
                        CentreID: centerID || 1,
                        DoctorID: selectedDoctorData.ID,
                        Doctor_Name: selectedDoctor,
                        EndTime: selectedSlot.toTime,
                        FromTime: selectedSlot.fromTime,
                        HashCode: "534",
                        ItemCode: appointmentRates?.ItemCode || "",
                        ItemID: appointmentRates?.ItemID || "4660",
                        PAddress: userData?.Address || "",
                        PAge: userData?.Age || "",
                        PAmount: appointmentRates?.Rate || 1100.0,
                        PEmail: userData?.Email || "n11@gmail.com",
                        PFirstName: userData?.FirstName || "NEELAM",
                        PGender: userData?.Gender || "Female",
                        PLastName: userData?.LastName || "SINGH",
                        PMobileno: userData?.Mobile || "0757270488",
                        PTitle: userData?.Title || "Mrs.",
                        PatientID: patientid,
                        Ratelistid: appointmentRates?.RateListID || 10,
                        ScheduleChargeID: appointmentRates?.ScheduleChargeID || 100,
                        UserID: userData?.ID || "gRWyl7xEbEiVQ3u397J1KQ==",
                    },
                ],
                appointment_mobilepaymentdetail: [
                    {
                        Adjustment: appointmentRates?.Rate || 1100.0,
                        ReferenceNo: referenceNo || "zxc12345678",
                        OrderID: "zxc123456",
                    },
                ],
            };
            const response = await axios.post(
                `${apiUrls.saveAppointment}?sourceType=video`,
                body,
                { headers: getAuthHeader() }
            );
            if (response.data?.status) {
                notify("Appointment saved successfully!", "success");
                setShowConfirm(false);
                setPdfModalVisible(true);
                fetchAppointments();
                setSelectedDoctor("");
                setSelectedDate(null);
                setSelectedSlot(null);
            } else {
                notify(response.data?.message || "Failed to save appointment.", "error");
            }
        } catch (error) {
            console.error("Error saving appointment:", error);
            notify("Failed to save appointment. Please try again.", "error");
            if (error.response?.status === 401) {
                navigate("/");
            }
        }
    };

    // API: Fetch Appointments
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            if (!token) {
                notify("Authentication token is missing.", "error");
                return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const formattedFromDate = tab === "past" ? formatDateForApi(fromDate) : formatDateForApi(today);
            const formattedToDate = tab === "past" ? formatDateForApi(toDate) : formatDateForApi(today);
            if (!formattedFromDate || !formattedToDate) {
                notify("Invalid date range selected.", "error");
                setPastAppointments([]);
                setUpAppointments([]);
                setUpcomingErrorMessage(tab === "upcoming" ? "Invalid date range." : "");
                setPastErrorMessage(tab === "past" ? "Invalid date range." : "");
                return;
            }
            const encodedPatientId = encodeURIComponent(encryptPassword(patientid));
            const doctor = selectedDoctor
                ? doctors.find((doc) => doc.doctorname === selectedDoctor)
                : null;
            const DoctorID = doctor?.ID || 0;
            const response = await axios.post(
                `${apiUrls.doctors}?patientid=${encodedPatientId}&IsTeleconsulation=1&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D&FromDate=${formattedFromDate}&ToDate=${formattedToDate}&DoctorID=${DoctorID}&status=`,
                null,
                { headers: getAuthHeader() }
            );
            if (response?.data?.status && Array.isArray(response.data.response)) {
                const past = [];
                const upcoming = [];
                response.data.response.forEach((item) => {
                    const dateParts = item.BookingDate.split("-");
                    if (dateParts.length !== 3) {
                        console.warn(`Invalid BookingDate format: ${item.BookingDate}`);
                        return;
                    }
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
                        console.warn(`Invalid month format in BookingDate: ${item.BookingDate}`);
                        return;
                    }
                    const [hours, minutes] = item.BookingTime.split(":");
                    const appointmentDate = new Date(year, month, day, parseInt(hours), parseInt(minutes));
                    if (isNaN(appointmentDate.getTime())) {
                        console.warn(`Invalid appointment date/time: ${item.BookingDate} ${item.BookingTime}`);
                        return;
                    }
                    const appointmentData = {
                        id: `${item.App_ID}`,
                        doctor: item.DrName,
                        PName: item.PName,
                        specialty: item.DoctorSpeciality,
                        dateTime: `${item.BookingDate} at ${item.BookingTime}`,
                        center: item.CentreName,
                        status: item.IsConform === 1 ? "Confirmed" : "Pending",
                        meetingUrl: item.PatientMeetingUrl || null,
                        isShowJoin: item.isshowjoin === 1,
                    };
                    const appointmentOnlyDate = new Date(year, month, day);
                    appointmentOnlyDate.setHours(0, 0, 0, 0);
                    if (appointmentOnlyDate.getTime() <= today.getTime()) {
                        past.push(appointmentData);
                    } else {
                        upcoming.push(appointmentData);
                    }
                });
                const sortAppointments = (apps) =>
                    apps.sort((a, b) => {
                        const dateA = new Date(a.dateTime.split(" at ")[0].split("-").reverse().join("-"));
                        const dateB = new Date(b.dateTime.split(" at ")[0].split("-").reverse().join("-"));
                        return dateA - dateB;
                    });
                setPastAppointments(sortAppointments(past));
                setUpAppointments(sortAppointments(upcoming));
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
            console.error("Error fetching appointments:", error);
            setPastAppointments([]);
            setUpAppointments([]);
            setUpcomingErrorMessage(
                tab === "upcoming" ? "Failed to fetch upcoming appointments" : ""
            );
            setPastErrorMessage(tab === "past" ? "Failed to fetch past appointments" : "");
            if (error.response?.status === 401) {
                navigate("/");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Video Call
    const handleVideoCall = (meetingUrl) => {
        const url = meetingUrl || "https://demo.vimhans.live/AppID12";
        if (window.confirm("You are about to start a video consultation. Do you want to proceed?")) {
            try {
                window.open(url, "_blank");
            } catch (error) {
                console.error("Error opening video call link:", error);
                notify("Failed to open video call link.", "error");
            }
        }
    };

    // Handle Payment
    const handlePayment = () => {
        if (!userData?.PatientASID || !userData?.Mobile) {
            notify("User data incomplete. Please ensure profile is complete.", "error");
            return;
        }
        const patientID = userData.PatientASID;
        const phoneNumber = userData.Mobile;
        const billNo = "";
        const amount = appointmentRates?.Rate || 800;
        const url = `${apiUrls.paymentRequest}?PatientID=${encodeURIComponent(
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
        if (!validateBooking()) {
            return;
        }
        const selectedDoctorData = doctors.find((doc) => doc.doctorname === selectedDoctor);
        if (!selectedDoctorData) {
            notify("Selected doctor not found.", "error");
            return;
        }
        setLoading(true);
        await fetchAppointmentRates(selectedDoctorData.ID);
        setLoading(false);
        setShowConfirm(true);
    };

    return (
        <>
            <Toaster />
            <div className="space-y-8 p-4">
                <div className="text-center">
                    <p className="text-gray-500">
                        Manage your upcoming and past consultations.
                    </p>
                </div>
                <div className="m-0">
                    <div className="grid grid-cols-3 gap-2">
                        {["book", "upcoming", "past"].map((tabName) => (
                            <button
                                key={tabName}
                                className={`py-2 shadow-md border rounded-t-md transition-all duration-600 ${tab === tabName ? "bg-blue-800 text-white transition-all duration-600 font-semibold shadow-md" : ""}`}
                                onClick={() => setTab(tabName)}
                            >
                                {tabName === "book" ? "Book New" : tabName === "upcoming" ? "Upcoming" : "Past"}
                            </button>
                        ))}
                    </div>
                    {tab === "book" && (
                        <div className="bg-white border rounded-b-lg p-4 shadow">
                            {showConfirm ? (
                                <>
                                    <div className="p-2 text-center my-2">
                                        <h2 className="text-xl font-bold mb-4 text-primary">Confirm Teleconsultation</h2>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-shadow-sm">Consultation Details</h2>
                                    </div>
                                    <div className="space-y-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 border p-5 rounded">
                                        <p><strong>Patient:</strong> {userData?.FirstName || "N/A"}</p>
                                        <p><strong>Center:</strong> {centerName}</p>
                                        <p><strong>Doctor:</strong> {selectedDoctor || "N/A"}</p>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {selectedDate && !isNaN(new Date(selectedDate).getTime())
                                                ? selectedDate.toLocaleDateString("en-GB")
                                                : "N/A"}
                                        </p>
                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {selectedSlot
                                                ? `${selectedSlot.fromTime} - ${selectedSlot.toTime} (${selectedSlot.shiftName})`
                                                : "N/A"}
                                        </p>
                                        {appointmentRates && (
                                            <>
                                                <p><strong>Item:</strong> {appointmentRates.Item || "N/A"}</p>
                                                <p><strong>Rate:</strong> {appointmentRates.Rate || "N/A"}</p>
                                            </>
                                        )}
                                        <div className="flex gap-4 mt-4">
                                            <button
                                                className="px-4 py-2 bg-emerald-200 rounded w-full"
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
                                    </div>
                                </>
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
                                                value: doc.doctorname,
                                                label: doc.doctorname,
                                            }))}
                                            value={
                                                selectedDoctor
                                                    ? { value: selectedDoctor, label: selectedDoctor }
                                                    : null
                                            }
                                            onChange={(selectedOption) => setSelectedDoctor(selectedOption?.value || "")}
                                            isLoading={doctorLoading}
                                            isDisabled={doctorLoading || doctors.length === 0}
                                        />
                                        <CustomDatePicker
                                            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                            value={selectedDate}
                                            placeHolderText="Select Date"
                                            handleDate={setSelectedDate}
                                            disablePastDates={true}
                                            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                                            minDate={new Date()}
                                        />
                                        <CustomSelect
                                            placeholder={timeSlotsLoading ? "Loading..." : timeSlots.length === 0 ? "No available slots" : "Select a Time Slot"}
                                            options={timeSlots}
                                            value={selectedSlot ? { value: selectedSlot.value, label: selectedSlot.label } : null}
                                            onChange={(selectedOption) => {
                                                const slot = timeSlots.find((slot) => slot.value === selectedOption.value);
                                                if (slot.status !== "Booked") {
                                                    setSelectedSlot(slot);
                                                } else {
                                                    notify("This time slot is not available for booking", "warn");
                                                }
                                            }}
                                            isDisabled={timeSlotsLoading || timeSlots.length === 0}
                                        />
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <button
                                            className={`px-4 py-2 bg-blue-600 text-white rounded uppercase ${!selectedDoctor || !selectedDate || !selectedSlot ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={handleConfirm}
                                            disabled={!selectedDoctor || !selectedDate || !selectedSlot || loading}
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
                                <IsLoader isFullScreen={false} />
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
                                                    <span className="text-xs font-semibold">{app.dateTime}</span>
                                                    <div className="text-xs font-semibold text-green-900">{app.status}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold py-3">{app.center}</div>
                                                <div className="text-xs font-semibold py-3 flex gap-2">
                                                    {app.isShowJoin && app.meetingUrl && (
                                                        <button
                                                            className="px-2 py-1 text-xs font-medium bg-blue-300 text-gray-700 rounded hover:bg-blue-700 transition"
                                                            onClick={() => handleVideoCall(app.meetingUrl)}
                                                        >
                                                            <Video />
                                                        </button>
                                                    )}
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
                                        maxDate={toDate}
                                    />
                                    <CustomDatePicker
                                        repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                        value={toDate}
                                        placeHolderText="To Date"
                                        handleDate={setToDate}
                                        minDate={fromDate}
                                        maxDate={new Date()}
                                    />
                                </div>
                            </div>
                            {loading ? (
                                <IsLoader isFullScreen={false} />
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
                                                            className={`text-xs font-extrabold border rounded py-1 px-2 ${app.status === "Confirmed" ? "text-green-900" : "text-black"}`}
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
                                title="M-Pesa Payment"
                                onLoad={() => console.log("Payment iframe loaded")}
                                onError={() => {
                                    notify("Failed to load payment page.", "error");
                                    setShowPaymentModal(false);
                                }}
                            />
                        ) : (
                            <p>Loading payment page...</p>
                        )}
                    </DialogBox>
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
                                    setSelectedDoctor("");
                                    setSelectedDate(null);
                                    setSelectedSlot(null);
                                }}
                            >
                                Close
                            </button>
                        }
                    >
                        <iframe
                            src={`${apiUrls.doctorNotes}?ReceiptNo=&LedgerTransactionNo=2019489&IsBill=1&Duplicate=1&Type=OPD`}
                            className="w-full h-96"
                            title="Doctor Notes PDF"
                            onError={() => {
                                notify("Failed to load PDF.", "error");
                                setPdfModalVisible(false);
                                setSelectedDoctor("");
                                setSelectedDate(null);
                                setSelectedSlot(null);
                            }}
                        />
                    </DialogBox>
                </div>
            </div>
        </>
    );
};

export default TeleconsultationAppointment;