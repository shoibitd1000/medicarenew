import CustomTable from "../../../../components/components/ui/customTabel";
import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Sample data
const medicines = [
  {
    name: "Lisinopril 10mg",
    dosage: "1 tablet daily",
    prescribedBy: "Dr. John Smith",
    date: "2024-07-15",
  },
  {
    name: "Amlodipine 5mg",
    dosage: "1 tablet daily",
    prescribedBy: "Dr. John Smith",
    date: "2024-07-15",
  },
  {
    name: "Ibuprofen 400mg",
    dosage: "As needed for pain",
    prescribedBy: "Dr. Michael Brown",
    date: "2024-06-22",
  },
];

// ✅ Define Table Headers
const Thead = [
  { key: "name", label: "Medicine" },
  { key: "dosage", label: "Dosage" },
  { key: "prescribedBy", label: "Prescribed By" },
  { key: "date", label: "Date" },
];

// ✅ Format Data for CustomTable
const formattedData = medicines.map((med) => ({
  name: med.name,
  dosage: med.dosage,
  prescribedBy: med.prescribedBy,
  date: med.date,
}));

// ✅ Optional row actions
const actions = [
  {
    label: "View",
    onClick: (row) => alert(`Viewing details for ${row.name}`),
  },
];

export default function MedicinesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-4">
      {/* Page Header */}
      <div className="text-center">
        <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl">
          💊
        </div>
        <h1 className="text-3xl font-bold text-blue-600 mt-2">Medicines</h1>
        <p className="text-gray-500">A list of your prescribed medications.</p>
      </div>

      {/* ✅ Using CustomTable */}
      <div className=" rounded-lg p-4 ">
        <h2 className="text-lg font-semibold mb-4">Your Prescribed Medicines</h2>
        <CustomTable
          Thead={Thead}
          data={formattedData}
          striped
          bordered
          hover
          wrapperClass="rounded-md shadow"
          tableClass="text-center"
          headerClass="bg-gray-200"
          rowClass="even:bg-gray-50"
          cellClass="text-gray-700"
          actions={actions}
        />
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={() => navigate("/dashboard/clinical-record")}
          className="inline-flex items-center border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          <span className="mr-2">←</span> Back to Clinical Records
        </button>
      </div>
    </div>
  );
}
