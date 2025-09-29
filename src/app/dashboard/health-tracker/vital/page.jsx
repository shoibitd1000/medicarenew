import React, { useState, useEffect, useMemo, useContext } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, Thermometer } from 'lucide-react';
import CustomDatePicker from '../../../../components/components/ui/CustomDatePicker';
import CustomDateTimeInput from '../../../../components/components/ui/CustomDateTimePicker';
import CustomInput from '../../../../components/components/ui/CustomInput';
import CustomTable from '../../../../components/components/ui/customTabel';
import { AuthContext } from '../../../authtication/Authticate';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { apiUrls } from '../../../../components/Network/ApiEndpoint';
import IsLoader from '../../../loading';
import Toaster, { notify } from '../../../../lib/notify';

const Thead = [
  { key: 'date', label: 'Date & Time' },
  { key: 'value', label: 'Value' },
];

const HealthTrackerDetailsPage = () => {
  const { slug } = useParams(); // Metric name from URL (e.g., "Temperature")
  const { state } = useLocation(); // State passed from Link (metricName, unit, vitalSignType)
  const { token, getAuthHeader, userData, getCurrentPatientId } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Default to past 1 month
    return date;
  });
  const [toDate, setToDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('history');
  const [captureDate, setCaptureDate] = useState(new Date());
  const [vitalValue, setVitalValue] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');

  const patientID = getCurrentPatientId();

  // Format date for API (MM-DD-YYYY)
  const formatApiDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}-${day}-${year}`;
  };

  // Format date for chart labels (DD-MMM)
  const formatDateLabel = dateString => {
    const date = new Date(dateString);
    return format(date, 'dd-MMM');
  };

  // Get metric configuration
  const getMetricConfig = () => {
    switch (slug.toLowerCase()) {
      case 'temperature':
        return { yAxisDomain: [30, 45], unit: '°C', inputLabel: 'Enter Temperature (°C)' };
      case 'pulse':
        return { yAxisDomain: [40, 120], unit: 'bpm', inputLabel: 'Enter Pulse (bpm)' };
      case 'respiration':
        return { yAxisDomain: [10, 30], unit: 'Rate/Min', inputLabel: 'Enter Respiration (Rate/Min)' };
      case 'blood pressure':
        return { yAxisDomain: [60, 200], unit: 'mmHg', inputLabel: 'Enter Blood Pressure (mmHg)' };
      case 'blood sugar':
        return { yAxisDomain: [3, 15], unit: 'mmol/L', inputLabel: 'Enter Blood Sugar (mmol/L)' };
      case 'spo2':
        return { yAxisDomain: [80, 100], unit: '%', inputLabel: 'Enter SpO2 (%)' };
      case 'weight':
        return { yAxisDomain: [40, 150], unit: 'kg', inputLabel: 'Enter Weight (kg)' };
      case 'height':
        return { yAxisDomain: [100, 220], unit: 'cm', inputLabel: 'Enter Height (cm)' };
      default:
        return { yAxisDomain: [0, 'auto'], unit: '', inputLabel: `Enter ${slug}` };
    }
  };

  const { yAxisDomain, unit, inputLabel } = getMetricConfig();

  // Fetch history data
  useEffect(() => {
    const fetchGraph = async () => {
      try {
        if (!token || !state?.vitalSignType) return;
        setLoading(true);
        const response = await axios.post(
          `${apiUrls.trendGraphDetails}?VitalSignType=${state.vitalSignType}&FromDate=${formatApiDate(
            selectedDate
          )}&ToDate=${formatApiDate(toDate)}&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === true) {
          setHistory(
            response.data.response.map(item => ({
              date: item.VitalSignChartDate,
              value: parseFloat(item.VitalSignValue) || 0,
            }))
          );
        } else {
          console.error('Unexpected response format:', response.data);
          setHistory([]);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [token, selectedDate, toDate, state?.vitalSignType]);

  // Handle saving new vital reading
  const handleSaveVital = async () => {
    if (!vitalValue) {
      setErrorMessage(`Please Enter ${state?.metricName || slug} ${unit}`);
      return;
    }

    setLoading(true);
    try {
      const formattedDate = formatApiDate(captureDate);
      const encodedPatientId = encodeURIComponent(patientID || '');
      const apiUrl = `${apiUrls.insertVitalSignValue}?DateAndTime=${formattedDate}&VitalSignType=${state?.vitalSignType || slug
        }&VitalSignValue=${vitalValue}&VitalSignUnit=${encodeURIComponent(
          unit
        )}&PatientType=&PatientID=${encodedPatientId}&updatedid=0&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

      const response = await axios.post(apiUrl, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === true) {
        const newEntry = {
          date: captureDate.toISOString(),
          value: parseFloat(vitalValue),
        };
        setHistory(prev => [...prev, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));
        setVitalValue('');
        setErrorMessage('');
        notify(`${state?.metricName || slug} saved successfully!`);
        setActiveTab('history');
      } else {
        setErrorMessage('Failed to save vital. Please try again.');
      }
    } catch (error) {
      console.error('Error saving vital:', error);
      setErrorMessage('Error saving vital. Please try again.');
      if (error.response?.status === 401) {
        notify('Unauthorized. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter history based on selected date range
  const filteredHistory = useMemo(() => {
    if (!selectedDate || !toDate) return history;
    return history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= selectedDate && entryDate <= toDate;
    });
  }, [history, selectedDate, toDate]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return filteredHistory.map(entry => ({
      date: formatDateLabel(entry.date),
      value: entry.value,
    }));
  }, [filteredHistory]);

  // Prepare table data
  const tableRows = useMemo(() => {
    return filteredHistory.map(entry => ({
      date: format(new Date(entry.date), 'dd-MMM yyyy HH:mm'),
      value: entry.value,
    }));
  }, [filteredHistory]);

  // Handle period selection
  const handlePeriodSelect = period => {
    setSelectedPeriod(period);
    const to = new Date();
    const from = new Date();
    switch (period) {
      case '2 Days':
        from.setDate(to.getDate() - 1);
        break;
      case '7 Days':
        from.setDate(to.getDate() - 6);
        break;
      case '15 Days':
        from.setDate(to.getDate() - 14);
        break;
      case '30 Days':
        from.setMonth(to.getMonth() - 1);
        break;
      default:
        from.setMonth(to.getMonth() - 1);
    }
    setSelectedDate(from);
    setToDate(to);
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-[#E6F3FA]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#4B9CD3]">{state?.metricName || slug}</h2>
        <p className="text-gray-600 text-sm">Capture and view your {state?.metricName || slug} history.</p>
      </div>
      <Toaster />
      {/* Tabs */}
      <div className="flex justify-start bg-[#F4F7F9]  overflow-hidden">
        <button
          className={`flex-1 py-2 px-5 text-sm font-medium ${activeTab === 'capture'
              ? 'bg-blue-800 text-white transition-all duration-600 font-semibold shadow-md rounded-t-md'
              : 'bg-[#F4F7F9] text-gray-600 transition-all duration-600 shadow-md rounded-t-md'
            }`}
          onClick={() => setActiveTab('capture')}
        >
          Capture Vital
        </button>
        <button
          className={`flex-1 py-2 px-5 text-sm font-medium ${activeTab === 'history'
              ? 'bg-blue-800 text-white transition-all duration-600 font-semibold shadow-md rounded-t-md'
              : 'bg-[#F4F7F9] text-gray-600 transition-all duration-600 shadow-md rounded-t-md'
            }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {/* Capture Vital Tab */}
      {activeTab === 'capture' && (
        <div className="bg-white rounded-b-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Capture New {state?.metricName || slug} Reading
          </h3>
          {loading && (
            <div className="flex justify-center items-center p-8">
              <IsLoader isFullScreen={false} size='6' text='' />
            </div>
          )}
          {!loading && (
            <>
              <div className="max-w-md mx-auto mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Date & Time</label>
                <CustomDateTimeInput
                  repClass="w-full bg-[#F4F7F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
                  value={captureDate}
                  onChange={setCaptureDate}
                />
              </div>
              <div className="max-w-md mx-auto mb-4">
                <label htmlFor="vital-value" className="block text-sm font-medium text-gray-600 mb-1">
                  {inputLabel}
                </label>
                <CustomInput
                  id="vital-value"
                  type="number"
                  value={vitalValue}
                  placeholder={`e.g., ${slug === 'Temperature' ? '37' : slug === 'Pulse' ? '70' : '100'}`}
                  className="w-full bg-[#F4F7F9] rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
                  onChange={e => setVitalValue(e.target.value)}
                  leftIcon={<Thermometer className="h-5 w-5 text-[#4B9CD3]" />}
                  required
                />
                {errorMessage && (
                  <p className="text-red-500 text-xs font-semibold mt-1">{errorMessage}</p>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  className={`w-48 bg-[#4B9CD3] text-white py-2 rounded-md hover:bg-[#3B8BB0] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  onClick={handleSaveVital}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Reading'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-b-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{state?.metricName || slug} History</h3>
          <p className="text-sm text-gray-600 mb-4">
            View your past {state?.metricName || slug} readings. Use the date picker to filter results.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {['2 Days', '7 Days', '15 Days', '30 Days'].map(period => (
              <button
                key={period}
                className={`px-3 py-1 rounded-md text-sm ${selectedPeriod === period
                    ? 'bg-[#4B9CD3] text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => handlePeriodSelect(period)}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <CustomDatePicker
                repClass="w-full bg-[#F4F7F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
                value={selectedDate}
                placeHolderText="From Date"
                icon={<Calendar className="absolute right-3 top-2 text-gray-500" />}
                handleDate={date => setSelectedDate(date)}
              />
            </div>
            <div className="flex-1">
              <CustomDatePicker
                repClass="w-full bg-[#F4F7F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#4B9CD3]"
                value={toDate}
                placeHolderText="To Date"
                icon={<Calendar className="absolute right-3 top-2 text-gray-500" />}
                handleDate={date => setToDate(date)}
              />
            </div>
          </div>

          {/* Chart Section with Loader */}
          <div className="border rounded-lg p-3 mb-4 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{state?.metricName || slug} Trend Graph</h3>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <IsLoader isFullScreen={false} size='6' text='' />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#333" />
                  <YAxis domain={yAxisDomain} stroke="#333" />
                  <Tooltip formatter={value => `${value} ${unit}`} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4B9CD3"
                    strokeWidth={1}
                    dot={{ r: 3, strokeWidth: 1, stroke: '#4B9CD3' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-[#4B9CD3] font-bold p-8">No data available</div>
            )}
          </div>

          {/* Table Section with Loader */}
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <IsLoader isFullScreen={false} size='6' text='' />
            </div>
          ) : (
            <CustomTable
              Thead={Thead}
              data={tableRows}
              striped
              bordered
              hover
              wrapperClass="rounded-lg shadow max-h-[calc(100vh-200px)] overflow-y-auto"
              tableClass="text-center"
              headerClass="bg-[#F4F7F9] text-gray-600 font-semibold"
              rowClass="even:bg-gray-50"
              cellClass="text-gray-700"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HealthTrackerDetailsPage;