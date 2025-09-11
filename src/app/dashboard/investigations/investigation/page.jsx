import React, { useState } from "react";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import { Button } from "../../../../components/components/ui/button";
import { Calendar, FileDown, Video } from "lucide-react";

import CustomMultiSelect from "../../../../components/components/ui/CustomMultiSelect";


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
   
];


const doctors = [
    { value: "doc1", label: "Dr. Dino", specialty: "General Physician" },
    { value: "doc2", label: "Dr. Amit", specialty: "Orthopedist" },
    { value: "doc3", label: "Dr. Ibrahim", specialty: "ENT Specialist" },
    { value: "doc4", label: "Dr. Juma", specialty: "Dentist" },
];



const options = [
    { value: "11-Alpha-Hydroxyl progesteronen", label: "11-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "12-Alpha-Hydroxyl progesteronen", label: "12-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "13-Alpha-Hydroxyl progesteronen", label: "13-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "14-Alpha-Hydroxyl progesteronen", label: "14-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "15-Alpha-Hydroxyl progesteronen", label: "15-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "16-Alpha-Hydroxyl progesteronen", label: "16-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "17-Alpha-Hydroxyl progesteronen", label: "17-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "18-Alpha-Hydroxyl progesteronen", label: "18-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "19-Alpha-Hydroxyl progesteronen", label: "19-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "20-Alpha-Hydroxyl progesteronen", label: "20-Alpha-Hydroxyl progesteronen", rate: 5090 },
    { value: "21-Alpha-Hydroxyl progesteronen", label: "21-Alpha-Hydroxyl progesteronen", rate: 5090 },
];


export default function InvestigationsAppoin() {
    const [tab, setTab] = useState("past");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const totalAmount = selected.reduce((sum, item) => sum + item.rate, 0);
    const handleConfirm = () => setShowConfirm(true);

    return (
        <>

            <div className="space-y-8 p-4">
                <div className="text-center">
                    <p className="text-gray-500">
                        Plan Your upcoming and  Past Investigations
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
                                            <h2 className="text-xl font-bold mb-4 text-primary">Confirm Teleconsultation</h2>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold mb-4 text-shadow-sm">Investgation  Details</h2>
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
                                                <h2 className="text-2xl font-bold">Book a New Investigation(s)</h2>
                                                <p className="text-xs text-cyan-500">Booking atest at Tewenk. change  center for the other locations</p>
                                            </div>
                                            <div className="">
                                                <Button className="text-white btn">Change Center</Button>
                                            </div>
                                        </div>
                                        <div className=" space-y-6  grid md:grid-cols-2 gap-6">
                                            <CustomMultiSelect
                                                options={options}
                                                selectedValues={selected}
                                                onChange={setSelected}
                                                placeholder="Select an Investigation(s)"
                                                placeholderText="Search Investigation..."
                                                repClass="focus:outline-none focus:ring focus:ring-blue-500"
                                            />
                                            <div className="m-0">
                                                <CustomDatePicker
                                                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                                    value={selectedDate}
                                                    placeHolderText={"Select Date"}
                                                    handleDate={(selectedDate) => setSelectedDate(selectedDate)}
                                                    icon={<Calendar className="absolute right-3 top-3 text-gray-500 pointer-events-none" />}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <h2 className="text-2xl font-bold">Total Amount : KES {totalAmount}</h2>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <button
                                                className="px-4 py-2  bg-primary text-white rounded uppercase"
                                                onClick={handleConfirm}
                                            >
                                                Confirm Investigation
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>

                        </>
                    )}

                    {tab === "upcoming" && (
                        <>
                            <div className="bg-white border rounded-b-lg p-4 shadow">
                                <div className="py-2 px-4 shadow-md my-2">
                                    <h2 className="text-2xl font-bold  mb-1">Upcoming Teleconsultations</h2>
                                </div>

                                <div className={`${doctoAppointmentSecList.length > 0 ? "grid md:grid-cols-1 lg:grid-cols-2 gap-4" : ""} `}>
                                    {doctoAppointmentSecList.length > 0 ? (
                                        doctoAppointmentSecList.map((doctorAppoin, i) => (
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
                                                <div>
                                                    <div className="text-xs font-semibold py-3">
                                                        {doctorAppoin?.hospitalName}
                                                    </div>
                                                    <div className="text-xs font-semibold py-3 flex gap-2">
                                                        <button className="px-2 py-1 text-xs font-medium bg-blue-300 text-gray-700 rounded hover:bg-blue-700 transition">
                                                            <Video />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h2 className="text-md text-red-400 text-center">
                                            Upcoming Investigations.
                                        </h2>
                                    )}

                                </div>
                            </div>
                        </>
                    )}

                    {tab === "past" && (
                        <>
                            {/* <DialogBox
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
                            </DialogBox> */}

                            <div className="bg-white border rounded-b-lg p-4 shadow">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                                    <div className="py-2 px-4">
                                        <h2 className="text-2xl font-bold  mb-1">Past Teleconsultations</h2>
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

                                <div className={`${pastAppointments.length > 0 ? "grid md:grid-cols-1 lg:grid-cols-2 gap-4" : ""} `}>
                                    {pastAppointments.length > 0 ? (
                                        pastAppointments.map((pastAppoin, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-primary">
                                                            {pastAppoin?.doctor}
                                                        </h3>
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
                                                <div>
                                                    <div className="text-xs font-semibold text-green-600 py-4">
                                                        {pastAppoin?.center}
                                                    </div>
                                                    <div className="text-xs font-semibold py-4 flex gap-2">
                                                        <button
                                                            className="px-2 py-1 text-xs text-primary font-medium bg-slate-200 rounded-md"
                                                            onClick={() => setIsOpen(true)}
                                                        >
                                                            <FileDown />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h2 className="text-md text-red-400 text-center">No Past Investigatios Found.</h2>
                                    )}

                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div >
        </>
    );
}
