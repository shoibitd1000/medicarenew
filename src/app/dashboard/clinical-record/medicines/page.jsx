import { ChevronRight, FileDown, Pill, SquarePlus } from "lucide-react";
import CustomTable from "../../../../components/components/ui/customTabel";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Sample data

import { Link } from "react-router-dom";

const medicines = [
  {
    center: "OPB/25/0001638488",
    name: "RCO Phillip Ogutu",
    dosage: "6 Dose, 3days,Every 12 Hours",
    prescribedBy: "Dr. John Smith",
    date: "02-sep-2025 11:23:34",
    medi: "Medicine",
    medicines: "Paracetamol/ caffeine/ Doxylamine (surepyn) Tabs"
  },
  {
    center: "OPB/25/0001638488",
    name: "RCO Phillip Ogutu",
    dosage: "6 Dose, 3days,Every 12 Hours",
    prescribedBy: "Dr. John Smith",
    date: "02-sep-2025 11:23:34",
    medi: "Medicine",
    medicines: "Paracetamol/ caffeine/ Doxylamine (surepyn) Tabs"
  },
  {
    center: "OPB/25/0001638488",
    name: "RCO Phillip Ogutu",
    dosage: "6 Dose, 3days,Every 12 Hours",
    prescribedBy: "Dr. John Smith",
    date: "02-sep-2025 11:23:34",
    medi: "Medicine",
    medicines: "Paracetamol/ caffeine/ Doxylamine (surepyn) Tabs"
  },

];




export default function MedicinesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("prescription Medicines");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const generateNewToken = () => {
    const newTokenNumber = Math.floor(100 + Math.random() * 900);
    setToken(`T-${newTokenNumber}`);
  };
  return (
    <div className="space-y-8 p-4">
      {/* Page Header */}
      <div className="text-center">
        <Pill className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-blue-600 mt-2">Medicines</h1>
        <p className="text-gray-500">A list of your prescribed medications.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="xl:m-auto">
          <button
            onClick={() => setTab("prescription Medicines")}
            className={`py-2 px-5 me-2 rounded-t-md border 
      ${tab === "prescription Medicines"
                ? "bg-white font-semibold border-b-0 border-gray-300" // active
                : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"} // inactive
    `}
          >
            Prescription Medicines
          </button>
          <button
            onClick={() => setTab("issued")}
            className={`py-2 px-5 me-2 rounded-t-md border 
      ${tab === "issued"
                ? "bg-white font-semibold border-b-0 border-gray-300" // active
                : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"} // inactive
    `}
          >
            Issued Medicines
          </button>



        </div>


        {tab === "issued" && (
          <>
            <div className="bg-white  rounded-b-lg p-4 shadow">
              <>
                <>
                  <div className="space-y-8 p-6 bg-white rounded-lg  rounded-s-0">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-primary mb-1">Prescription Medicines</h2>
                    </div>

                    <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                      {medicines?.map((item, i) => (
                        <div
                          key={item?.center}
                          className="p-4 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-md font-extrabold text-primary">{item?.center}</span>
                            <button className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition" onClick={() => setIsOpen(true)}>
                              <FileDown className="h-4 w-4" />
                            </button>

                          </div>
                          <div className="text-[10px] py-[2px] font-medium text-primary">{item?.name}</div>
                          <div className="text-[10px] py-[2px] font-medium text-primary">{item?.date}</div>
                          <div className="text-[10px] py-[2px] font-extrabold ">{item?.medi}</div>
                          <div className="text-[10px] py-[2px] font-medium text-primary">{item?.medicines}</div>
                          <span className="text-xs font-medium">{item?.dosage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              </>
            </div>
          </>
        )}

        {tab === "prescription Medicines" && (
          <>
            <div className="space-y-8 p-6 bg-white rounded-lg  rounded-s-0">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-1">Prescription Medicines</h2>
              </div>

              <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {medicines?.map((item, i) => (
                  <div
                    key={item?.center}
                    className="p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-md font-extrabold text-primary">{item?.center}</span>
                      <span className="text-xs font-medium">{item?.dosage}</span>
                    </div>
                    <div className="text-[10px] py-[2px] font-medium text-primary">{item?.name}</div>
                    <div className="text-[10px] py-[2px] font-medium text-primary">{item?.date}</div>
                    <div className="text-[10px] py-[2px] font-extrabold ">{item?.medi}</div>
                    <div className="flex justify-between">
                      <div className="text-[10px] py-[2px] font-medium text-primary">{item?.medicines}</div>
                      <button className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition" onClick={() => setIsOpen(true)}>
                        <FileDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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
    </div>
  );
}
