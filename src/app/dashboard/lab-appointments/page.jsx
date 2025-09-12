import React, { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Calendar as CalendarIcon, IndianRupee } from "lucide-react";

const upcomingLabAppointments = [
  { test: "Complete Blood Count (CBC)", date: "2024-09-18", time: "09:00 AM", status: "Confirmed", center: "Tenwek" },
  { test: "Lipid Profile", date: "2024-09-21", time: "11:30 AM", status: "Pending", center: "Annex" },
];

const pastLabAppointments = [
  { test: "Thyroid Function Test", date: "2024-07-12", time: "10:00 AM", center: "Ngito", status: "Completed" },
  { test: "Urinalysis", date: "2024-06-25", time: "08:30 AM", center: "Tenwek", status: "Completed" },
];

const labTests = [
  { id: "cbc", label: "Complete Blood Count (CBC)", rate: 300 },
  { id: "lipid", label: "Lipid Profile", rate: 500 },
  { id: "thyroid", label: "Thyroid Function Test", rate: 450 },
  { id: "urinalysis", label: "Urinalysis", rate: 200 },
  { id: "blood_sugar", label: "Blood Sugar Test", rate: 150 },
];

const timeSlots = ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];

const statusColor = {
  Confirmed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-gray-100 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function LabAppointmentsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const center = params.get("center");

  const [activeTab, setActiveTab] = useState(center ? "book" : "upcoming");
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingStep, setBookingStep] = useState("selectTest");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const totalCost = useMemo(() => {
    return selectedTests.reduce((total, testId) => {
      const test = labTests.find((t) => t.id === testId);
      return total + (test?.rate || 0);
    }, 0);
  }, [selectedTests]);

  const handleTestSelection = (testId) => {
    setSelectedTests((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
    setBookingStep("selectDate");
  };

  const handleBook = () => {
    navigate(`/dashboard/lab-appointments/payment?amount=${totalCost}`);
  };

  const renderBookingContent = () => {
    if (showConfirmation) {
      const tests = labTests.filter((t) => selectedTests.includes(t.id));
      return (
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-4">Confirm Lab Appointment</h3>
          <div className="border rounded-lg shadow p-6 max-w-md mx-auto space-y-3">
            <p><strong>Center:</strong> {decodeURIComponent(center)}</p>
            <div>
              <strong>Tests:</strong>
              <ul className="list-disc pl-5">
                {tests.map((test) => (
                  <li key={test.id}>{test.label}</li>
                ))}
              </ul>
            </div>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedSlot}</p>
            <p className="font-bold text-lg"><strong>Total Cost:</strong> KES {totalCost}</p>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 border rounded">
              Back
            </button>
            <button onClick={handleBook} className="px-4 py-2 bg-blue-600 text-white rounded">
              Proceed to Payment
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 p-4">
        {/* Step 1: Select Tests */}
        <div>
          <label className="text-lg font-semibold">1. Select Lab Test(s)</label>
          <div className="space-y-3 mt-3">
            {labTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 rounded border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={test.id}
                    checked={selectedTests.includes(test.id)}
                    onChange={() => handleTestSelection(test.id)}
                  />
                  <label htmlFor={test.id} className="cursor-pointer">{test.label}</label>
                </div>
                <div className="flex items-center font-semibold text-blue-600">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {test.rate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Select Date */}
        {bookingStep !== "selectTest" && selectedTests.length > 0 && (
          <div>
            <label className="text-lg font-semibold">2. Select a Date</label>
            <input
              type="date"
              className="mt-2 w-full border rounded px-3 py-2"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setBookingStep("selectSlot");
              }}
            />
          </div>
        )}

        {/* Step 3: Select Time Slot */}
        {bookingStep === "selectSlot" && selectedDate && (
          <div>
            <label className="text-lg font-semibold">3. Select a Time Slot</label>
            <select
              className="mt-2 w-full border rounded px-3 py-2"
              value={selectedSlot}
              onChange={(e) => {
                setSelectedSlot(e.target.value);
                setBookingStep("confirm");
              }}
            >
              <option value="">-- Select a Time Slot --</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        {bookingStep === "confirm" && selectedSlot && (
          <div className="flex justify-end items-center pt-4 gap-4">
            <p className="text-lg font-bold">Total: KES {totalCost}</p>
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Confirm Appointment
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600">Lab Appointments</h1>
        <p className="text-gray-500">Manage your upcoming and past lab tests.</p>
      </div>

      {/* Tabs */}
      <div>
        <div className="grid grid-cols-3 border rounded overflow-hidden">
          <button
            onClick={() => setActiveTab("book")}
            className={`p-2 ${activeTab === "book" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Book New Lab Test
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`p-2 ${activeTab === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Upcoming Lab Tests
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`p-2 ${activeTab === "past" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Past Lab Tests
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "book" && (
            <div className="border rounded shadow p-4">
              <h2 className="text-xl font-semibold">Book a New Lab Test</h2>
              <p className="text-gray-500 mb-3">
                {center
                  ? `Booking a test at ${decodeURIComponent(center)}.`
                  : "Please select a center to book a lab test."}
              </p>

              {center ? (
                <>
                  <div className="flex justify-end mb-4">
                    <Link
                      to="/dashboard/lab-appointments/book"
                      className="px-3 py-1 border rounded"
                    >
                      Change Center
                    </Link>
                  </div>
                  {renderBookingContent()}
                </>
              ) : (
                <div className="text-center p-8">
                  <p className="mb-4 text-gray-500">
                    You need to select a hospital center before you can book a lab test.
                  </p>
                  <Link to="/dashboard/lab-appointments/book" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Select a Center
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "upcoming" && (
            <div className="border rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-3">Upcoming Lab Tests</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Test Name</th>
                    <th className="p-2 border">Date & Time</th>
                    <th className="p-2 border">Center</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border text-right">Doctor Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingLabAppointments.map((appt, i) => (
                    <tr key={i} className="border">
                      <td className="p-2">{appt.test}</td>
                      <td className="p-2">{appt.date} at {appt.time}</td>
                      <td className="p-2">{appt.center}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-sm ${statusColor[appt.status]}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <button className="px-2 py-1 border rounded text-sm">Doctor remark</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "past" && (
            <div className="border rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-3">Past Lab Tests</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Test Name</th>
                    <th className="p-2 border">Date & Time</th>
                    <th className="p-2 border">Center</th>
                    <th className="p-2 border">Result Status</th>
                    <th className="p-2 border text-right">View Result</th>
                  </tr>
                </thead>
                <tbody>
                  {pastLabAppointments.map((appt, i) => (
                    <tr key={i} className="border">
                      <td className="p-2">{appt.test}</td>
                      <td className="p-2">{appt.date} at {appt.time}</td>
                      <td className="p-2">{appt.center}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-sm ${statusColor[appt.status]}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <button className="px-2 py-1 border rounded text-sm">View Result</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
