import React, { useState, useEffect, useMemo, useContext } from "react";
import { format, subDays } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTable from "../../../../components/components/ui/customTabel";
import { Calendar, Thermometer } from "lucide-react";
import CustomDatePicker from "../../../../components/components/ui/CustomDatePicker";
import CustomDateTimeInput from "../../../../components/components/ui/CustomDateTimePicker";
import CustomInput from "../../../../components/components/ui/CustomInput";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import { AuthContext } from "../../../authtication/Authticate";
import axios from "axios";
import { useParams } from "react-router-dom";

const Thead = [
  { key: "date", label: "Date & Time" },
  { key: "value", label: "Value" },
];

// Default history data
const initialTemperatureHistory = [];

const HealthTrackerPage = () => {
  const { getAuthHeader, token } = useContext(AuthContext);
  const {slug} = useParams()
  const [selectedDate, setSelectedDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [activeTab, setActiveTab] = useState("capture");
  const [captureDate, setCaptureDate] = useState(new Date());
  const [vitalValue, setVitalValue] = useState("");
  const [history, setHistory] = useState(initialTemperatureHistory);
  const [loading, setLoading] = useState(true);
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
  });

  const API_URL =
    `${apiUrls.helthTrackRecordapi}?MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

  // Fetch health data from API
  const fetchHealthData = async () => {
    try {
      if (!token) {
        console.error("No token available");
        return;
      }
      setLoading(true);
      const response = await axios.post(API_URL, {}, { headers: getAuthHeader() });

      if (response.data.status === true && Array.isArray(response.data.response)) {
        const records = response.data.response;

        const getLatest = (type) => {
          
          const filtered = records.filter(
            (item) => item.VitalSignType?.trim().toLowerCase() === type.toLowerCase()
          );
          return filtered.length > 0
            ? {
                value: filtered[filtered.length - 1].VitalSignValue,
                enteredOn: filtered[filtered.length - 1].EnteredOn,
              }
            : { value: "0", enteredOn: null };
        };

        // Update history with temperature records from API
        const temperatureRecords = records
          .filter((item) => item.VitalSignType?.trim().toLowerCase() === "temp")
          .map((item) => ({
            date: item.EnteredOn,
            value: parseFloat(item.VitalSignValue) || 0,
          }));

          
        setHistory(temperatureRecords);

        setHealthData({
          temperature: getLatest("Temp").value,
          pulse: getLatest("Pulse").value,
          respiration: getLatest("Respiration").value || "0",
          bloodPressure: getLatest("Blood Pressure").value || "0",
          bloodSugar: getLatest("Blood Sugar").value || "0",
          spo2: getLatest("SpO2").value || "0",
          weight: getLatest("Weight").value || "0",
          height: getLatest("Height").value || "0",
          bmi: "27.8", // Static value; update if API provides it
          bsa: records?.BSA ? records.BSA : "0",
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
        console.error("Invalid API response structure");
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, [token]);

  useEffect(() => {
    const to = new Date();
    const from = subDays(to, 29);
    setSelectedDate(from);
    setToDate(to);
  }, []);

  const filteredHistory = useMemo(() => {
    if (!selectedDate || !toDate) return history;
    return history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= selectedDate && entryDate <= toDate;
    });
  }, [history, selectedDate, toDate]);

  const chartData = useMemo(() => {
    return filteredHistory.map((entry) => ({
      date: format(new Date(entry.date), "dd-MMM"),
      value: entry.value,
    }));
  }, [filteredHistory]);

  const tableRows = useMemo(() => {
    return filteredHistory.map((entry) => ({
      date: format(new Date(entry.date), "dd-MMM yyyy HH:mm"),
      value: entry.value,
    }));
  }, [filteredHistory]);

  const handleSaveVital = () => {
    if (!vitalValue) return alert("Enter a value before saving");
    const newEntry = {
      date: captureDate.toISOString(),
      value: parseFloat(vitalValue),
    };
    setHistory((prev) => [...prev, newEntry]);
    setVitalValue("");
    alert("Temperature saved successfully!");
    setActiveTab("history");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen space-x-2">
        <div className="w-6 h-6 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
        <span className="text-primary font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5 bg-secondary">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary">{slug}</h2>
        <p className="text-gray-500">Capture New {slug} Reading</p>
      </div>

      <div className="flex justify-start">
        <button
          className={`py-2 px-5 mr-2 rounded-t-md border ${
            activeTab === "capture"
              ? "bg-blue-800 text-white font-semibold border-b-0 border-gray-300"
              : "bg-gray-100 text-gray-600 border-gray-300"
          }`}
          onClick={() => setActiveTab("capture")}
        >
          Capture Vital
        </button>
        <button
          className={`py-2 px-5 rounded-t-md border ${
            activeTab === "history"
              ? "bg-blue-800 text-white font-semibold border-b-0 border-gray-300"
              : "bg-gray-100 text-gray-600 border-gray-300"
          }`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {activeTab === "capture" && (
        <div className="bg-white rounded-b-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Capture New {slug}</h3>
          <div className="max-w-md mx-auto mb-4">
            <CustomDateTimeInput
              repClass="w-full focus:outline-none focus:ring focus:ring-primary"
              label="Date & Time"
              value={captureDate}
              onChange={setCaptureDate}
            />
          </div>
          <div className="max-w-md mx-auto mb-4">
            <label htmlFor="temp-value" className="block text-sm font-medium text-gray-700 mb-1">
              Enter {slug} (°F)
            </label>
            <CustomInput
              id="temp-value"
              type="number"
              value={vitalValue}
              placeholder="e.g., 98"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-medium"
              onChange={(e) => setVitalValue(e.target.value)}
              leftIcon={<Thermometer className="h-5 w-5 text-primary" />}
              required="required"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="w-48 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSaveVital}
            >
              Save Reading
            </button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-b-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{slug} History</h3>
          <p className="text-sm text-gray-500 mb-4">
            View your past readings. Use the date picker to filter results.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 1));
                setToDate(new Date());
              }}
            >
              2 Days
            </button>
            <button
              className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 6));
                setToDate(new Date());
              }}
            >
              7 Days
            </button>
            <button
              className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 14));
                setToDate(new Date());
              }}
            >
              15 Days
            </button>
            <button
              className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 29));
                setToDate(new Date());
              }}
            >
              30 Days
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <CustomDatePicker
              repClass="w-full focus:outline-none focus:ring focus:ring-primary"
              value={selectedDate}
              placeHolderText="From Date"
              icon={<Calendar className="absolute right-3 top-2 text-gray-500" />}
              handleDate={(date) => setSelectedDate(date)}
            />
            <CustomDatePicker
              repClass="w-full focus:outline-none focus:ring focus:ring-primary"
              value={toDate}
              placeHolderText="To Date"
              icon={<Calendar className="absolute right-3 top-2 text-gray-500" />}
              handleDate={(date) => setToDate(date)}
            />
          </div>

          <div className="border shadow-md rounded-lg p-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Trend Graph</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[90, 110]} /> {/* Adjusted for {slug} in °F */}
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 p-8">No data available for selected range</div>
            )}
          </div>

          <CustomTable
            Thead={Thead}
            data={tableRows}
            striped
            bordered
            hover
            wrapperClass="rounded-lg shadow max-h-[calc(100vh-200px)] overflow-y-auto"
            tableClass="text-center"
            headerClass="bg-gray-200"
            rowClass="even:bg-gray-50"
            cellClass="text-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default HealthTrackerPage;