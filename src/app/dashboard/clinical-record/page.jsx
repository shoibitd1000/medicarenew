"use client";

import { Link } from "react-router-dom";
import React from "react";
import {  Scan, Pill, ChevronRight, Bed, ClipboardPlus, TestTubeDiagonal } from "lucide-react";

const recordTypes = [
  {
    name: "Consultation History",
    description: "View past doctor consultations and prescriptions.",
    icon: ClipboardPlus ,
    href: "/clinical-record/consultations",
  },
  {
    name: "Lab Investigation Reports",
    description: "Access your lab test results.",
    icon: TestTubeDiagonal ,
    href: "/clinical-record/lab-reports",
  },
  {
    name: "Diagnosis Investigation Reports",
    description: "View your imaging reports like X-rays and scans.",
    icon: Scan,
    href: "/clinical-record/radiology-reports",
  },
  {
    name: "Medicines",
    description: "See a list of your prescribed medications.",
    icon: Pill,
    href: "/clinical-record/medicines",
  },
  {
    name: "Discharge Summary",
    description: "See a discharge charge Summary.",
    icon: Bed ,
    href: "/clinical-record/discharge-summary",
  },
];

export default function ClinicalRecordPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">
          Clinical Record
        </h1>
        <p className="text-muted-foreground">
          Select a category to view your health records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {recordTypes.map((record) => (
          <Link
            to={record?.href}
            key={record.name}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <record.icon className="h-6 w-6 text-primary bg-slate-300 rounded-sm p-1" />
              <div><span className="text-lg font-medium">{record.name}</span>
                <p className="text-xs font-medium">{record.description}</p></div>
            </div>


            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
