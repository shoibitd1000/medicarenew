import { FileDown, Pill } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../authtication/Authticate";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../../components/EncyptHooks/EncryptLib";
import { format } from "date-fns";
import IsLoader from "../../../loading";

export default function MedicinesPage() {
  const { token, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState("prescription Medicines");
  const [medicineData, setMedicineData] = useState([]);
  const [issuedMedicines, setIssuedMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const patientId = getCurrentPatientId();

  const fetchMedicines = async () => {
    if (!patientId || !token) {
      console.error("Missing patientId or token");
      setMedicineData([]);
      setIssuedMedicines([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let response;
      const encodedPatientId = encodeURIComponent(encryptPassword(patientId));

      if (tab === "prescription Medicines") {
        response = await axios.get(
          `${apiUrls.doctorPrescribedToPatient}?PatientId=${patientId}`,
          {
            headers: {
              ...getAuthHeader(),
            },
          }
        );
        if (response?.data?.status === true) {
          setMedicineData(response.data.response || []);
          setIssuedMedicines([]);
        } else {
          setMedicineData([]);
          setIssuedMedicines([]);
        }
      } else if (tab === "issued") {
        response = await axios.get(
          `${apiUrls.patientOPDMedicines}?PatientId=${patientId}`,
          {
            headers: {
              ...getAuthHeader(),
            },
          }
        );
        if (response?.data?.status === true) {
          const rawData = response.data.response || [];
          const mergedData = rawData.reduce((acc, item) => {
            const key = `${item.OPDTransactionID}-${item.DateTimes}`;
            if (!acc[key]) {
              acc[key] = {
                MedicineName: [item.ItemName],
                Dose: item.Dose,
                DurationName: item.DurationName,
                DoctorName: item.DoctorName,
                DateTimes: item.DateTimes,
                BillNo: item.billno,
                Times: item.Times,
                App_ID: item.App_ID,
                OPDTransactionID: item?.OPDTransactionID,
              };
            } else {
              acc[key].MedicineName.push(item.ItemName);
            }
            return acc;
          }, {});

          const formattedData = Object.values(mergedData).map((item) => ({
            ...item,
            MedicineName: item.MedicineName.join(", "),
            Dose: parseInt(item.Dose, 10).toString(),
          }));
          setIssuedMedicines(formattedData);
          setMedicineData([]);
        } else {
          setIssuedMedicines([]);
          setMedicineData([]);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${tab} medicines:`, error.response?.data || error.message);
      setMedicineData([]);
      setIssuedMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [tab, patientId, token]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate)) return "Invalid Date";
    return format(parsedDate, "dd-MMM-yyyy HH:mm:ss");
  };

  const MedicineItem = ({
    name,
    dosage,
    duration,
    doctor,
    date,
    BillNo,
    Times,
    App_ID,
    OPDTransactionID,
    medicineNames = [],
    isPrescriptionTab,
  }) => (
    <div className="p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-md font-extrabold text-primary">{BillNo || "N/A"}</span>
        {isPrescriptionTab ? (
          <span className="text-xs font-medium">{`${dosage} Dose, ${duration || "N/A"}, ${Times || "N/A"}`}</span>
        ) : (
          <a
            href={`http://197.138.207.30/Tenwek2208/Design/CPOE/CPOEMedicinePrintOut_pdf.aspx?IsIPDData=0&App_ID=${App_ID || ""}&TID=${OPDTransactionID || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition"
          >
            <FileDown className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="text-[13px] py-[2px] font-medium text-primary">{doctor || "N/A"}</div>
      <div className="text-[13px] py-[2px] font-medium text-primary">{formatDate(date)}</div>
      <div className="text-[13px] py-[2px] font-extrabold">Medicine</div>
      {medicineNames.length > 0 ? (
        medicineNames.map((medicine, index) => (
          <div key={index} className="py-[2px]">
            <div className="text-[13px] font-medium text-primary">
              {medicine}
            </div>
            {!isPrescriptionTab && (
              <span className="text-xs font-medium">
                {`${dosage} Dose, ${duration || "N/A"}, ${Times || "N/A"}`}
              </span>
            )}
          </div>
        ))
      ) : ""}

      {isPrescriptionTab && (
        <div className="flex justify-between">
          <div className="text-[13px] py-[2px] font-medium text-primary">{name || "N/A"}</div>
          <a
            href={`http://197.138.207.30/Tenwek2208/Design/CPOE/CPOEMedicinePrintOut_pdf.aspx?IsIPDData=0&App_ID=${App_ID || ""}&TID=${OPDTransactionID || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition"
          >
            <FileDown className="h-4 w-4" />
          </a>
        </div>
      )}


    </div>
  );

  const currentData = tab === "prescription Medicines" ? medicineData : issuedMedicines;

  return (
    <div className="space-y-8 p-4">
      {/* Page Header */}
      <div className="text-center mb-3">
        <Pill className="h-12 w-12 mx-auto text-primary bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-blue-600 mt-2">Medicines</h1>
        <p className="text-gray-500">A list of your prescribed medications.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        {/* <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          <span className="mr-2">←</span> Back
        </button> */}
        <div className="xl:m-auto">
          <button
            onClick={() => setTab("prescription Medicines")}
            className={`py-2 px-5 me-2 rounded-t-md border 
      ${tab === "prescription Medicines"
                ? "bg-blue-800 text-white font-semibold border-b-0 border-gray-300"
                : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"}`}
          >
            Prescription Medicines
          </button>
          <button
            onClick={() => setTab("issued")}
            className={`py-2 px-5 me-2 rounded-t-md border 
      ${tab === "issued"
                ? "bg-blue-800 text-white font-semibold border-b-0 border-gray-300"
                : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"}`}
          >
            Issued Medicines
          </button>
        </div>

        {tab === "issued" && (
          <>
            <div className="bg-white rounded-b-lg p-4 shadow">
              <div className="space-y-8 p-6 bg-white rounded-lg rounded-s-0">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary mb-1">Issued Medicines</h2>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                  {loading ? (
                    <div className="text-center col-span-2 py-8">
                      <IsLoader isFullScreen={false} size="6" text="Issued Medicines" />
                    </div>
                  ) : issuedMedicines.length > 0 ? (
                    issuedMedicines.map((item, i) => (
                      <MedicineItem
                        key={i}
                        name={item.MedicineName}
                        dosage={item.Dose}
                        duration={item.DurationName}
                        doctor={item.DoctorName}
                        date={item.DateTimes}
                        BillNo={item.BillNo}
                        Times={item.Times}
                        App_ID={item.App_ID}
                        OPDTransactionID={item.OPDTransactionID}
                        medicineNames={item.MedicineName.split(", ")}
                        isPrescriptionTab={false}
                      />
                    ))
                  ) : (
                    <div className="text-center col-span-2 py-8">
                      <span className="text-lg font-semibold text-gray-500">No medicines found.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "prescription Medicines" && (
          <>
            <div className="space-y-8 p-6 bg-white rounded-lg rounded-s-0">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-1">Prescription Medicines</h2>
              </div>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {loading ? (
                  <div className="text-center col-span-2 py-8">
                    <IsLoader isFullScreen={false} size="6" text="Prescription Medicines" />
                  </div>
                ) : medicineData.length > 0 ? (
                  medicineData.map((item, i) => (
                    <MedicineItem
                      key={i}
                      name={item.MedicineName}
                      dosage={item.Dose}
                      duration={item.DurationName}
                      doctor={item.DoctorName}
                      date={item.DateTimes}
                      BillNo={item.BillNo}
                      Times={item.Times}
                      App_ID={item.App_ID}
                      OPDTransactionID={item.OPDTransactionID}
                      medicineNames={[]}
                      isPrescriptionTab={true}
                    />
                  ))
                ) : (
                  <div className="text-center col-span-2 py-8">
                    <span className="text-lg font-semibold text-gray-500">No medicines found.</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}