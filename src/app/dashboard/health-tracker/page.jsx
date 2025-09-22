import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { ChevronRight, Thermometer, HeartPulse, Wind, Heart, Droplets, Weight, Percent, Ruler } from "lucide-react";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import { format } from "date-fns";
import axios from "axios";
import { AuthContext } from "../../authtication/Authticate"; // Adjust path as needed
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import IsLoader from "../../loading";

const HealthTrackerPage = () => {
  const { token, getAuthHeader } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState({
    temperature: null,
    pulse: null,
    respiration: null,
    bloodPressure: null,
    bloodSugar: null,
    spo2: null,
    weight: null,
    height: null,
    bmi: null,
    bsa: null,
    temperatureDate: null,
    pulseDate: null,
    respirationDate: null,
    bloodPressureDate: null,
    bloodSugarDate: null,
    spo2Date: null,
    weightDate: null,
    heightDate: null,
  });
  const [tabSelected, setTabSelected] = useState([]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date)) return null;
    return format(date, "dd-MMM-yyyy");
  };

  // Fetch API
  const fetchHealthData = async () => {
    try {
      if (!token) {
        console.error("No token available");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        `${apiUrls.helthTrackRecordapi}?MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`,
        {},
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === true) {
        const records = response.data.response;
        setTabSelected(records);

        const getLatest = (type) => {
          const filtered = records.filter(
            (item) => item.VitalSignType?.trim().toLowerCase() === type.toLowerCase()
          );
          return filtered.length > 0
            ? {
                value: filtered[filtered.length - 1].VitalSignValue,
                enteredOn: filtered[filtered.length - 1].EnteredOn,
              }
            : { value: null, enteredOn: null };
        };

        const latestBSA = records?.BSA || { BSA: null };
        const latestBMI = records?.BMI || { BMI: null };
        setHealthData({
          temperature: getLatest("Temp").value,
          pulse: getLatest("Pulse").value,
          respiration: getLatest("Respiration").value,
          bloodPressure: getLatest("Blood Pressure").value,
          bloodSugar: getLatest("Blood Sugar").value,
          spo2: getLatest("SpO2").value,
          weight: getLatest("Weight").value,
          height: getLatest("Height").value,
          bmi: latestBMI.BMI,
          bsa: latestBSA.BSA,
          temperatureDate: getLatest("Temp").enteredOn,
          pulseDate: getLatest("Pulse").enteredOn,
          respirationDate: getLatest("Respiration").enteredOn,
          bloodPressureDate: getLatest("Blood Pressure").enteredOn,
          bloodSugarDate: getLatest("Blood Sugar").enteredOn,
          spo2Date: getLatest("SpO2").enteredOn,
          weightDate: getLatest("Weight").enteredOn,
          heightDate: getLatest("Height").enteredOn,
        });
      } else {
        console.error("API returned false status:", response.data);
      }
    } catch (error) {
      console.error("Error fetching health data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, [token]);

  // Vitals array
  const vitals = [
    {
      name: "Temperature",
      value: healthData.temperature,
      unit: "°C",
      icon: Thermometer,
      slug: "temperature",
      date: formatDate(healthData.temperatureDate),
      vitalSignType: "Temp",
    },
    {
      name: "Pulse",
      value: healthData.pulse,
      unit: "bpm",
      icon: HeartPulse,
      slug: "pulse",
      date: formatDate(healthData.pulseDate),
      vitalSignType: "Pulse",
    },
    {
      name: "Respiration",
      value: healthData.respiration,
      unit: "Rate/Min",
      icon: Wind,
      slug: "respiration",
      date: formatDate(healthData.respirationDate),
      vitalSignType: "Respiration",
    },
    {
      name: "Blood Pressure",
      value: healthData.bloodPressure,
      unit: "mmHg",
      icon: Heart,
      slug: "blood-pressure",
      date: formatDate(healthData.bloodPressureDate),
      vitalSignType: "Blood Pressure",
    },
    {
      name: "Blood Sugar",
      value: healthData.bloodSugar,
      unit: "mmol/L",
      icon: Droplets,
      slug: "blood-sugar",
      date: formatDate(healthData.bloodSugarDate),
      vitalSignType: "Blood Sugar",
    },
    {
      name: "SpO2",
      value: healthData.spo2,
      unit: "%",
      icon: Percent,
      slug: "spo2",
      date: formatDate(healthData.spo2Date),
      vitalSignType: "SpO2",
    },
    {
      name: "Weight",
      value: healthData.weight,
      unit: "kg",
      icon: Weight,
      slug: "weight",
      date: formatDate(healthData.weightDate),
      vitalSignType: "Weight",
    },
    {
      name: "Height",
      value: healthData.height,
      unit: "cm",
      icon: Ruler,
      slug: "height",
      date: formatDate(healthData.heightDate),
      vitalSignType: "Height",
    },
  ];

  return (
    <div className="space-y-8 p-6 bg-blue-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-4xl mx-auto">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-blue-600">My Health Tracker</h1>
          <p className="text-gray-600">An overview of your key health metrics.</p>
        </div>
        <div className="text-md text-blue-600">
          {format(new Date(), "dd-MMM-yyyy")}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {vitals.map((vital) => {
            const Icon = vital.icon;
            return (
              <Card
                key={vital.name}
                className="bg-blue-50 shadow-md h-full border border-blue-200 rounded-lg"
                aria-label={`Loading ${vital.name}`}
              >
                <CardContent className="p-4 flex flex-col items-center text-center justify-between h-full">
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="p-3 bg-blue-100 rounded-full mb-3">
                      <Icon className="h-8 w-8 text-blue-600 bg-white border border-blue-300 rounded-lg shadow-md p-1" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{vital.name}</p>
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-600 mt-2 self-end" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : vitals.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {vitals.map((vital) => {
            const Icon = vital.icon;
            return (
              <Link
                to={`/health-tracker/details/${vital.slug}`}
                key={vital.name}
                aria-label={`View details for ${vital.name}`}
              >
                <Card
                  className="hover:bg-blue-50 hover:shadow-lg transition-all duration-300 cursor-pointer h-full border border-blue-200 rounded-lg"
                  aria-label={`Vital information for ${vital.name}`}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center justify-between h-full">
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <div className="p-3 bg-blue-100 rounded-full mb-3">
                        <Icon className="h-8 w-8 text-blue-600 bg-white border border-blue-300 rounded-lg shadow-md p-1" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{vital.name}</p>
                      {vital.value && vital.unit && vital.date ? (
                        <>
                          <p className="text-xl sm:text-2xl font-bold text-blue-600">
                            {vital.value}
                          </p>
                          <p className="text-xs text-gray-600">{vital.unit}</p>
                          <p className="text-xs font-bold text-blue-600">{vital.date}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">No data available</p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600 mt-2 self-end" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No vitals found</p>
      )}

      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="shadow-lg border border-blue-200 rounded-lg" aria-label="BMI (Body Mass Index)">
          <CardHeader>
            <CardTitle className="text-blue-600">BMI (Body Mass Index)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : (
              <>
                <p className="text-5xl font-bold text-blue-600">{healthData.bmi || "N/A"}</p>
                <p className="text-gray-600">kg/m²</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg border border-blue-200 rounded-lg" aria-label="BSA (Body Surface Area)">
          <CardHeader>
            <CardTitle className="text-blue-600">BSA (Body Surface Area)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : (
              <>
                <p className="text-5xl font-bold text-blue-600">{healthData.bsa || "N/A"}</p>
                <p className="text-gray-600">m²</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthTrackerPage;