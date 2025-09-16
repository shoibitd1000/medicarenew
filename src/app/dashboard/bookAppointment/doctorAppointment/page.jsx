import React, { useContext, useEffect, useState } from "react";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomSelect from "../../../../components/components/ui/CustomSelect";
import { Button } from "../../../../components/components/ui/button";
import { AlarmClockPlus, Calendar, ChevronRight, FileDown, Hospital, SquarePlus } from "lucide-react";
import { closeIcon, DialogBox } from "../../../../components/components/ui/dialog";
import CustomTimePicker from "../../../../components/components/ui/CustomTimePicker";
import { Label } from "../../../../components/components/ui/label";
import CustomTextArea from "../../../../components/components/ui/CustomTextArea";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../app/authtication/Authticate";
import { notify } from "../../../../lib/notify";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";

// dummy data

const doctoAppointmentSecList = [
    {
        name: "Dr. Dino Crognale",
        hospitalName: "Tenwek Hospital",
        appointmentDate: "12-Aug-2026",
        appointmentTime: "09:45 AM",
        status: "Confirmed",

    },
    {
        name: "Ngito",
        hospitalName: "Tenwek Hospital",
        appointmentDate: "12-Aug-2026",
        appointmentTime: "09:45 AM",
        status: "Confirmed",
    },
    {
        name: "Tenwek Annex",
        hospitalName: "Tenwek Hospital",
        appointmentDate: "12-Aug-2026",
        appointmentTime: "09:45 AM",
        status: "Confirmed",
    },
    {
        name: "Dr. Nathanael",
        hospitalName: "Tenwek Hospital",
        appointmentDate: "12-Aug-2026",
        appointmentTime: "09:45 AM",
        status: "Confirmed",
    },
];


const pastAppointments = [
    {
        doctor: "Dr. Emily White",
        patientName: "Neelam singh",
        appointmentDate: "2024-07-10",
        appointmentTime: "11:00 AM",
        center: "Ngito Hospial",
        status: "Confirmed",
    },
    {
        doctor: "Dr. Michael Brown",
        patientName: "Orthopedic Surgeon",
        appointmentDate: "2024-06-22",
        appointmentTime: "09:00 AM",
        center: "Tenwek Hospital",
        status: "Expired",
    },
];

const doctors = [
    { value: "doc1", label: "Dr. Dino", specialty: "General Physician" },
    { value: "doc2", label: "Dr. Amit", specialty: "Orthopedist" },
    { value: "doc3", label: "Dr. Ibrahim", specialty: "ENT Specialist" },
    { value: "doc4", label: "Dr. Juma", specialty: "Dentist" },
];

const departments = [
    { value: "MCH clinic", label: "MCH clinic" },
    { value: "OUT PATIENT Clinic", label: "OUT PATIENT Clinic" },
    { value: "Dental Clinic", label: "Dental Clinic" },
    { value: "DERMATOLOGY", label: "DERMATOLOGY" },
];

const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
];


export default function AppointmentsPage() {
    const navigate = useNavigate()
    const centerID = useParams()
    const { token, getAuthHeader, getCurrentPatientId } = useContext(AuthContext)
    const patientid = getCurrentPatientId();
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [tab, setTab] = useState("book");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDoctors, setDoctors] = useState();
    const [isOpenCancellation, setISOpenCancellation] = useState(false);
    const [drSpecility, setDrSepcility] = useState('');
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [toDate, setToDate] = useState(new Date());
    const handleConfirm = () => setShowConfirm(true);

    const fetchDoctors = async () => {
        try {
            if (!token) {
                notify("No token available", "error");
                setDoctors([]);
                return;
            }

            const response = await axios.post(
                apiUrls.doctor_speciality,
                { CentreID: centerID?.ID || 1 },
                {
                    headers: {
                        ...getAuthHeader(),
                    },
                }
            );
            if (response.data.status) {
                setDoctors(response.data.response || []);
            } else {
                notify(response.data.message, "error");
                setDoctors([]);
            }
        } catch (error) {
            notify(
                error?.response?.data?.message || "Something went wrong",
                "error"
            );
            setDoctors([]);
        } finally {

        }
    };
    const fetchAppointments = async () => {
        try {
            const encodedPatientId = encryptPassword(patientid);
            console.log(encodedPatientId);

            const today = new Date().toISOString().split("T")[0];

            const apiUrl =
                setTab === "upcoming"
                    ? `${apiUrls.doctors}LoginAPIDynamic/GetAppHistory?patientid=${encodedPatientId}&IsTeleconsulation=0&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D&FromDate=${today}&Todate=${today}&DoctorID=&Status=`
                    : `${apiUrls.doctors}LoginAPIDynamic/GetAppHistory?patientid=${encodedPatientId}&IsTeleconsulation=0&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D&FromDate=${fromDate
                        .toISOString()
                        .split("T")[0]}&Todate=${toDate
                            .toISOString()
                            .split("T")[0]}&DoctorID=&Status=`;

            const response = await axios.post(
                apiUrl,
                null, // no request body needed
                {
                    headers: {
                        ...getAuthHeader(),
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching appointments:", error);
            return [];
        } finally {
        }
    };

    useEffect(() => {
        fetchAppointments()
        fetchDoctors()
    }, [])

    return (
        <>

            <div className="space-y-8 p-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">Doctor Appointments</h1>
                    <p className="text-gray-500">
                        Manage your upcoming and past appointments.
                    </p>
                </div>

                <div className="m-0">
                    <div className="grid grid-cols-3 gap-2 ">
                        <button
                            className={`py-2 shadow-md border rounded-t-md   ${tab === "book" ? " rounded-t-md bg-white font-semibold shadow-md" : ""
                                }`}
                            onClick={() => setTab("book")}
                        >
                            Book New
                        </button>
                        <button
                            className={`py-2 shadow-md border rounded-t-md  ${tab === "upcoming" ? "rounded-t-md bg-white font-semibold shadow-md" : ""
                                }`}
                            onClick={() => setTab("upcoming")}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`py-2 shadow-md border rounded-t-md  ${tab === "past" ? "rounded-t-md bg-white font-semibold shadow-md" : ""
                                }`}
                            onClick={() => setTab("past")}
                        >
                            Past
                        </button>
                    </div>


                    {tab === "book" && (
                        <>
                            <div className="bg-white border rounded-b-lg p-4 shadow">
                                {showConfirm ? (
                                    <>
                                        <div className="p-2 text-center my-2">
                                            <h2 className="text-xl font-bold mb-4 text-primary">Confirm Appointment</h2>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold mb-4 text-shadow-sm">Appointment Details</h2>
                                        </div>
                                        <div className="space-y-6  grid md:grid-cols-2  lg:grid-cols-3 gap-6 border p-5 rounded">
                                            <p><strong>Patient:</strong> {selectedDepartment}</p>
                                            <p><strong>Center:</strong> {selectedDoctor}</p>
                                            <p><strong>Doctor:</strong> {selectedDoctor}</p>
                                            <p><strong>Date:</strong> {selectedDate}</p>
                                            <p><strong>Time:</strong> {selectedSlot}</p>
                                            <p><strong>Item:</strong> {selectedSlot}</p>
                                            <p><strong>Rate:</strong> {selectedSlot}</p>
                                            <div className="flex gap-4 mt-4">
                                                <button
                                                    className="px-4 py-2 bg-emerald-200 rounded w-full bg-"
                                                    onClick={() => setShowConfirm(false)}
                                                >
                                                    Back
                                                </button>
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">
                                                    Proceed to Payment
                                                </button>
                                            </div>
                                        </div>
                                    </>

                                ) : (
                                    <>
                                        <div className="py-2 px-4 shadow-md my-2  flex justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold">Book a New Appointment</h2>
                                                <p className="text-xs text-cyan-500">Finding a doctor at tenwenk</p>
                                            </div>
                                            <div className="">
                                                <Button className="text-white btn" onClick={() => navigate(-1)}>Change Center</Button>
                                            </div>
                                        </div>
                                        <div className=" space-y-6  grid md:grid-cols-2 gap-6">
                                            <CustomSelect
                                                placeholder="Select a Department"
                                                options={isDoctors}
                                                value={selectedDoctor}
                                                onChange={(selectedOption) => setSelectedDepartment(selectedOption)}
                                                valueKey="ID"
                                                labelKey="doctorname"
                                            />

                                            <CustomSelect
                                                placeholder="Select a Doctor"
                                                options={isDoctors}
                                                value={selectedDoctor}
                                                onChange={(selectedOption) => setSelectedDoctor(selectedOption)}
                                                valueKey="ID"
                                                labelKey="doctorname"
                                            />


                                            <div className="m-0">
                                                <CustomDatePicker
                                                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                                    value={selectedDate}
                                                    placeHolderText={"Select Date"}
                                                    handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                                    icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                                                />
                                            </div>


                                            <CustomSelect
                                                placeholder="Select a Time Slot"
                                                options={timeSlots.map((slot) => ({
                                                    value: slot,
                                                    label: slot,
                                                }))}
                                                value={
                                                    selectedSlot
                                                        ? { value: selectedSlot, label: selectedSlot }
                                                        : null
                                                }
                                                onChange={(selectedOption) => setSelectedSlot(selectedOption.value)}
                                            />
                                        </div>
                                        <div className="flex justify-center pt-4">
                                            <button
                                                className="px-4 py-2 bg-primary text-white rounded uppercase"
                                                onClick={handleConfirm}
                                            >
                                                Confirm Appointment
                                            </button>
                                        </div>
                                    </>
                                )}


                            </div>

                        </>
                    )}

                    {tab === "upcoming" && (
                        <>
                            <DialogBox
                                open={isOpen}
                                onOpenChange={setIsOpen}
                                title="Rescheduled Appointment "
                                size="sm"
                                footer={
                                    <>
                                        <button
                                            className="px-3 py-1 text-sm font-medium bg-red-100  rounded hover:bg-blue-500 transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Save
                                        </button>
                                    </>

                                }
                            >
                                <div className="my-3">
                                    <Label>Select New Date</Label>
                                    <CustomDatePicker
                                        repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                        value={selectedDate}
                                        placeHolderText={"Select Date"}
                                        handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                        icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                                    />
                                </div>
                                <div className="my-3">
                                    <Label>Select New Time Slot</Label>
                                    <CustomTimePicker
                                        repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                        value={selectedDate}
                                        placeHolderText={"Select Time"}
                                        handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                    />
                                </div>
                            </DialogBox>


                            <DialogBox
                                open={isOpenCancellation}
                                onOpenChange={setISOpenCancellation}
                                title="Cancel Appointment "
                                size="sm"
                                footer={
                                    <>
                                        <button
                                            className="px-3 py-1 text-sm font-medium bg-red-100  rounded hover:bg-blue-500 transition"
                                            onClick={() => setISOpenCancellation(false)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                                            onClick={() => setISOpenCancellation(false)}
                                        >
                                            Cancel Appointment
                                        </button>
                                    </>

                                }
                            >
                                <div className="my-3">
                                    <Label>Reason For Cancellation</Label>
                                    <CustomTextArea
                                        repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                        value={""}
                                        placeHolderText={"Reasons....."}
                                    />
                                </div>
                            </DialogBox>
                            <div className="bg-white border rounded-b-lg p-4 shadow">
                                <div className="py-2 px-4 shadow-md my-2">
                                    <h2 className="text-2xl font-bold  mb-1">Upcoming Appointments</h2>
                                </div>

                                <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                                    {doctoAppointmentSecList.map((doctorAppoin, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-primary">{doctorAppoin.name}</h3>
                                                    <span className="text-xs font-semibold">
                                                        {doctorAppoin?.appointmentDate}
                                                        {doctorAppoin?.appointmentTime && (
                                                            <> at {doctorAppoin.appointmentTime}</>
                                                        )}


                                                    </span>
                                                    <div className="text-xs font-semibold text-green-900">
                                                        {doctorAppoin?.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="text-xs font-semibold py-3">
                                                    {doctorAppoin?.hospitalName}
                                                </div>
                                                <div className="text-xs font-semibold py-3 flex gap-2">
                                                    <button className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={() => setIsOpen(!isOpen)}>
                                                        Reschedule
                                                    </button>
                                                    <button className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition" onClick={() => setISOpenCancellation(!isOpen)}>
                                                        Cancel
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {tab === "past" && (
                        <>
                            <DialogBox
                                open={isOpen}
                                onOpenChange={setIsOpen}
                                title="Doctor Notes"
                                size="xl"
                                closeIcon={closeIcon}
                                footer={
                                    <button
                                        className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Close
                                    </button>
                                }
                            >
                                <p>Here are the doctor notes...</p>
                            </DialogBox>

                            <div className="bg-white border rounded-b-lg p-4 shadow">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                                    <div className="py-2 px-4">
                                        <h2 className="text-2xl font-bold  mb-1">Past Appointments</h2>
                                    </div>
                                    <div className="flex gap-3 gap-y-3">
                                        <CustomDatePicker
                                            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                            value={selectedDate}
                                            placeHolderText={"From Date"}
                                            handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                        />
                                        <CustomDatePicker
                                            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                            value={selectedDate}
                                            placeHolderText={"To Date"}
                                            handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                        />
                                    </div>
                                </div>

                                <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                                    {pastAppointments.map((pastAppoin, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-primary">{pastAppoin?.doctor}</h3>
                                                    <div className="text-xs font-semibold">
                                                        {pastAppoin?.patientName}
                                                    </div>
                                                    <span className="text-xs font-semibold">
                                                        {pastAppoin?.appointmentDate}
                                                        {pastAppoin?.appointmentTime && (
                                                            <> at {pastAppoin.appointmentTime}</>
                                                        )}


                                                    </span>
                                                    <div className="text-xs font-extrabold text-green-900">
                                                        {pastAppoin?.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="text-xs font-semibold text-green-600 py-4">
                                                    {pastAppoin?.center}
                                                </div>
                                                <div className="text-xs font-semibold py-4 flex gap-2">
                                                    <button className="px-2 py-1 text-xs text-primary font-medium bg-slate-200 rounded-md" onClick={() => setIsOpen(true)}>
                                                        <FileDown />
                                                    </button>

                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div >
        </>
    );
}
