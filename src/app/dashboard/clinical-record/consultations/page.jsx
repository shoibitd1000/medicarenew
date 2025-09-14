import React, { useState } from "react"
import { FileDown, Eye, Pill, ArrowLeft, ClipboardPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DialogBox } from "../../../../components/components/ui/dialog";

const consultations = [
  {
    date: "2024-07-15",
    time: "T00:00:00",
    doctor: "Dr. John Smith",
    department: "Self",
    diagnosis: "Pain,Unspecified",
    prescription: [
      { name: "Lisinopril 10mg", dosage: "1 tablet daily" },
      { name: "Amlodipine 5mg", dosage: "1 tablet daily" },
    ],
    followUp: "US Pelvis,X_Ray Shouder AP andlat.,X-Ray Spine Cerivical AP and Lat.",
  },
  {
    date: "2024-06-22",
    time: "T00:00:00",
    doctor: "Dr. Michael Brown",
    department: "Orthopedics",
    diagnosis: "Knee Sprain",
    prescription: [
      { name: "Ibuprofen 400mg", dosage: "As needed for pain" },
      { name: "Physiotherapy", dosage: "3 sessions per week for 2 weeks" },
    ],
    followUp: "N/A",
  },
];

export default function ConsultationHistoryPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Page Header */}
      <div className="text-center">
        <ClipboardPlus className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-xl font-bold font-headline text-primary mt-2">
          Consultation History
        </h1>
        <p className="text-muted-foreground text-sm font-bold">
          A record of your past consultations with our doctors.
        </p>
      </div>


      <div className=" p-4">
        <div className="space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center border  px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <span className="mr-2">←</span> Back
          </button>
          {consultations.map((consult, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-md p-4 bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-primary">
                    {consult.doctor}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {consult.department} | {consult.date} {consult.time}
                  </p>
                </div>
                <button className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition" onClick={() => setIsOpen(true)}>
                  <FileDown className="h-4 w-4" />
                </button>
              </div>
              <h4 className="text-md underline font-semibold">diagnosis:{" "}</h4>
              <span className="text-sm font-normal">{consult.diagnosis}</span>
              <div className="mt-4">
                <h5 className="font-semibold">Medications:</h5>
                <ul className="text-muted-foreground text-xs">
                  {consult.prescription.map((p, i) => (
                    <li key={i}>
                      {p.name} - {p.dosage}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h5 className="font-semibold">Test/Procedure Prescribe:</h5>
                <p className="text-muted-foreground text-sm">{consult.followUp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DialogBox
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Doctor Notes"
        size="xl"
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
    </div>
  );
}

