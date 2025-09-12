import { Label } from "../../../components/components/ui/label";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import { DialogBox } from "../../../components/components/ui/dialog";
import { ChevronRight, FileDown, Mail, Pill, SquarePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Sample data

import { Link } from "react-router-dom";

const medicines = [
  {
    center: "OPB/25/0001638488",
    name: "Mrs. Neelam Singh",
    prescribedBy: "Dr. John Smith",
    date: "02-sep-2025 11:23:34",
    status: "confirmed",
    centerH: "Tenwek Hospital",
    mess: "Sent Message",
  },
  {
    center: "OPB/25/0001638488",
    name: "Mrs. Neelam Singh",
    prescribedBy: "Dr. John Smith",
    date: "02-sep-2025 11:23:34",
    status: "confirmed",
    centerH: "Tenwek Hospital",
    mess: "Sent Message",
  },
  {
    center: "OPB/25/0001638488",
    name: "Mrs. Neelam Singh",
    prescribedBy: "Dr. John Smith",
    date: "02-sep-2025 11:23:34",
    status: "confirmed",
    centerH: "Tenwek Hospital",
    mess: "Send Message",
  },

];




export default function SendMessagePage() {
  const navigate = useNavigate();
  const [isOpenCancellation, setISOpenCancellation] = useState(false);
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
        <Mail className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-blue-600 mt-2">Your Past Appointment</h1>
        <p className="text-gray-500">Send message to your doctor </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <>
          <div className="bg-white  rounded-b-lg p-4 shadow">
            <>
              <>
                <div className="space-y-8 p-6 bg-white rounded-lg  rounded-s-0">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-1">Past Appoinments</h2>
                  </div>

                  <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                    {medicines?.map((item, i) => (
                      <div
                        key={item?.center}
                        className="p-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-md font-extrabold text-primary">{item?.name}</span>
                          <span className="text-xs font-bold ">{item?.centerH}</span>
                        </div>
                        <div className="text-[10px] py-[2px] font-medium text-primary">{item?.name}</div>
                        <div className="text-[10px] py-[2px] font-medium text-primary">{item?.date}</div>
                        <div className="flex justify-between">
                          <div className="text-[10px] py-[2px] font-extrabold text-green-400 capitalize">{item?.status}</div>
                          <button className="text-xs font-bold text-green-400" onClick={() => setISOpenCancellation(true)} disabled={item?.mess === "Sent Message"}>
                            {item?.mess}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            </>
          </div>
        </>
      </div>
      <DialogBox
        open={isOpenCancellation}
        onOpenChange={setISOpenCancellation}
        title="Send Message"
        description={"You Can Send Only One Message To Your Selected Doctor."}
        size="lg"
        footer={
          <>
            <button
              className="px-3 py-1 text-sm font-medium bg-red-100  rounded hover:bg-blue-500 transition"
              onClick={() => setISOpenCancellation(false)}
            >
              Send Message
            </button>
            <button
              className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
              onClick={() => setISOpenCancellation(false)}
            >
              Cancel
            </button>
          </>

        }
      >
        <div className="my-3">
          <Label>Type Your Message</Label>
          <CustomTextArea
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={""}
            placeHolderText={"Send Message to your Doctor."}
          />
        </div>
      </DialogBox>
    </div >
  );
}
