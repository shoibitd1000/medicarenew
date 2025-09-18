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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [healthData, setHealthData] = useState({
    temperature: "0",
    pulse: "0",
    respiration: "0",
    bloodPressure: "0",
    bloodSugar: "0",
    spo2: "0",
    weight: "0",
    height: "0",
    bmi: "27.8",
    bsa: "0",
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

  // Function to format date (e.g., "2025-08-20T12:21:25" to "20-Aug-2025")
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
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
            (item) =>
              item.VitalSignType?.trim().toLowerCase() === type.toLowerCase()
          );
          return filtered.length > 0
            ? {
              value: filtered[filtered.length - 1].VitalSignValue,
              enteredOn: filtered[filtered.length - 1].EnteredOn,
            }
            : { value: "0", enteredOn: null };
        };

        const latestBSA = records?.BSA;
        setHealthData({
          temperature: getLatest("Temp").value,
          pulse: getLatest("Pulse").value,
          respiration: getLatest("Respiration").value || "0",
          bloodPressure: getLatest("Blood Pressure").value || "0",
          bloodSugar: getLatest("Blood Sugar").value || "0",
          spo2: getLatest("SpO2").value || "0",
          weight: getLatest("Weight").value || "0",
          height: getLatest("Height").value || "0",
          bmi: "27.8", // Hardcoded as per original, update if API provides BMI
          bsa: latestBSA ? latestBSA.BSA : "0",
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

  // Fetch data on mount and when token or selectedDate changes
  useEffect(() => {
    fetchHealthData();
  }, [token, selectedDate]);

  // Define vitals array with dynamic data
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
    <div className="space-y-8 p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-4xl mx-auto">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold font-headline text-primary">My Health Tracker</h1>
          <p className="text-muted-foreground">An overview of your key health metrics.</p>
        </div>
        <div className="flex flex-col items-center sm:items-end">
          <span className="text-md text-primary">
            {new Date().toDateString()} {/* Dynamic date like React Native */}
          </span>

        </div>
      </div>

      {/* {loading ? (
        <IsLoader isFullScreen={false} />
      ) : vitals.length > 0 ? ( */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {vitals.map((vital) => {
            const Icon = vital.icon; // ✅ fix for rendering component
            return (
              <Link
                to={{
                  pathname: `/health-tracker/details`,
                  state: {
                    metricName: vital.name,
                    metricValue: vital.value,
                    unit: vital.unit,
                    vitalSignType: vital.vitalSignType,
                    enteredOn: vital.date,
                  },
                }}
                key={vital.name}
              >
                <Card className="hover:bg-accent/50 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center justify-between h-full">
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <div className="p-3 bg-accent/20 rounded-full mb-2 inline-block">
                        <Icon className="h-8 w-8 mx-auto text-primary bg-white border rounded-lg shadow-md p-1 animate-blink" />
                      </div>
                      <p className="text-sm font-semibold">{vital.name}</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {vital.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{vital.unit}</p>
                      <p className="text-xs font-bold text-primary">{vital.date}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 self-end" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      {/* ) : (
        <p className="text-center text-gray-500">No vitals found</p>
      )} */}


      {/* BMI + BSA */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg my-3">
          <CardHeader>
            <CardTitle>BMI (Body Mass Index)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">{healthData.bmi}</p>
            <p className="text-muted-foreground">kg/m²</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg my-3">
          <CardHeader>
            <CardTitle>BSA (Body Surface Area)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">{healthData.bsa}</p>
            <p className="text-muted-foreground">m²</p>
          </CardContent>
        </Card>
      </div>
    </div >
  );
};

export default HealthTrackerPage;