import React, { useState, useEffect, useMemo } from "react";
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

const initialTemperatureHistory = [
  { date: "2025-09-11T12:00:00", value: 98 },
  { date: "2025-09-04T12:00:00", value: 78 },
  { date: "2025-09-04T12:00:00", value: 98 },
  { date: "2025-09-03T12:00:00", value: 99 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 690 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 540 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 230 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },
  { date: "2025-09-03T12:00:00", value: 23 },

];

const Thead = [
  { key: "date", label: "Date & Time" },
  { key: "value", label: "Value" },
];

export default function HealthTrackerPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [activeTab, setActiveTab] = useState("capture");
  const [captureDate, setCaptureDate] = useState(new Date());
  const [vitalValue, setVitalValue] = useState("");
  const [history, setHistory] = useState(initialTemperatureHistory);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600">Temperature</h2>
        <p className="text-gray-500">
          Capture New Pulse Reading.
        </p>
      </div>

      <div className="xl:m-auto">
        <button
          onClick={() => setActiveTab("capture")}
          className={`py-2 px-5 me-2 rounded-t-md border 
            ${activeTab === "capture"
              ? "bg-white font-semibold border-b-0 border-gray-300"
              : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"}
          `}
        >
          Capture Vital
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-2 px-5 me-2 rounded-t-md border 
            ${activeTab === "history"
              ? "bg-white font-semibold border-b-0 border-gray-300"
              : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"}
          `}
        >
          History
        </button>
      </div>

      {activeTab === "capture" && (
        <div className="bg-white  rounded-b-lg p-4 shadow">
          <h2 className="font-semibold text-lg">Capture New Temperature</h2>
          <div className="p-4 max-w-md mx-auto">
            <CustomDateTimeInput
              repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
              label="Date & Time"
              value={captureDate}
              onChange={setCaptureDate}
            />
          </div>

          <div className="p-4 max-w-md mx-auto">
            <label htmlFor="temp-value" className="font-medium">
              Enter Pulse bpm
            </label>
            <CustomInput
              id="userId"
              type="number"
              value={vitalValue}
              placeholder="e.g., 98"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              onChange={(e) => setVitalValue(e.target.value)}
              leftIcon={<Thermometer className="h-5 w-5" />}
              required={"required"}
            />         </div>

          <div className="flex justify-space-between">
            <button
              onClick={handleSaveVital}
              className="max-w-md mx-auto bg-blue-600 text-white p-2 rounded"
            >
              Save Reading
            </button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white  rounded-b-lg p-4 shadow">
          <h3 className="font-semibold">Temperature History</h3>
          <p className="text-sm text-gray-500">
            View your past readings. Use the date picker to filter results.
          </p>

          <div className="flex gap-2 flex-wrap">
            <button
              className="border my-2 px-2 py-1 rounded"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 1));
                setToDate(new Date());
              }}
            >
              2 Days
            </button>
            <button
              className="border my-2 px-2 py-1 rounded"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 6));
                setToDate(new Date());
              }}
            >
              7 Days
            </button>
            <button
              className="border my-2 px-2 py-1 rounded"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 14));
                setToDate(new Date());
              }}
            >
              15 Days
            </button>
            <button
              className="border my-2 px-2 py-1 rounded"
              onClick={() => {
                setSelectedDate(subDays(new Date(), 29));
                setToDate(new Date());
              }}
            >
              30 Days
            </button>
          </div>

          <div className="flex gap-3">
            <CustomDatePicker
              repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
              value={selectedDate}
              placeHolderText={"From Date"}
              icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
              handleDate={(date) => setSelectedDate(date)}
            />

            <CustomDatePicker
              repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
              value={toDate}
              placeHolderText={"To Date"}
              icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
              handleDate={(date) => setToDate(date)}
            />
          </div>

          <div className="border shadow-md my-3 rounded p-3">
            <h3 className="font-semibold mb-2">Trend Graph</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 600]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 p-8">
                No data available for selected range
              </div>
            )}
          </div>

          <CustomTable
            Thead={Thead}
            data={tableRows}
            striped
            bordered
            hover
            wrapperClass="rounded-md shadow h-[calc(100vh-200px)]"
            tableClass="text-center"
            headerClass="bg-gray-200"
            rowClass="even:bg-gray-50"
            cellClass="text-gray-700"
          />
        </div>
      )}
    </div>
  );
}
