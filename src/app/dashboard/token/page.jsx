import React, { useEffect, useState } from "react";
import { Button } from "../../../components/components/ui/button";
import { Calendar, ChevronRight, FileDown, SquarePlus, Video } from "lucide-react";

import CustomMultiSelect from "../../../components/components/ui/CustomMultiSelect";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import { Link } from "react-router-dom";
const recordTypes = [
  { name: "Kaboson" },
  { name: "Ngito" },
  { name: "Tenwek Annex" },
  { name: "Tenwek Hospital" },
];
export default function TokenPage() {
  const [tab, setTab] = useState("generateToken");
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="xl:m-auto">
        <button
          onClick={() => setTab("generateToken")}
          className={`py-2 px-5 me-2 rounded-t-md border 
      ${tab === "generateToken"
              ? "bg-white font-semibold border-b-0 border-gray-300" // active
              : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"} // inactive
    `}
        >
          Generate Token
        </button>
        <button
          onClick={() => setTab("current")}
          className={`py-2 px-5 me-2 rounded-t-md border 
      ${tab === "current"
              ? "bg-white font-semibold border-b-0 border-gray-300" // active
              : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"} // inactive
    `}
        >
          Current Token
        </button>



      </div>


      {tab === "current" && (
        <>
          <div className="bg-white  rounded-b-lg p-4 shadow">
            <>
              <div className="py-2 px-4 shadow-xl my-2">
                <h2 className="text-2xl font-bold text-primary text-center">Generate New Token</h2>
              </div>
            </>
          </div>
        </>
      )}

      {tab === "generateToken" && (
        <>
          <div className="space-y-8 p-6 bg-white rounded-lg  rounded-s-0">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-1">Select The Center</h2>
              <p className="text-gray-500">Please Select a hospital Center to Proceed</p>
            </div>

            <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
              {recordTypes.map((record) => (
                <Link
                  to={"/token/generate"}
                  key={record.name}
                  className="flex items-center justify-between p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <SquarePlus className="h-6 w-6 text-primary bg-slate-300 rounded-sm" />
                    <span className="text-lg font-medium">{record.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div >
  );
}
