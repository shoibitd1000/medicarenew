import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Thermometer, Heart, Wind, Droplet, HeartPulse, Scale, Ruler, ChevronsRight } from 'lucide-react';
import { AuthContext } from '../../authtication/Authticate';
import { apiUrls } from '../../../components/Network/ApiEndpoint';
import IsLoader from '../../loading';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthTrackerPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState({
    temperature: '0',
    pulse: '0',
    respiration: '0',
    bloodPressure: '0',
    bloodSugar: '0',
    spo2: '0',
    weight: '0',
    height: '0',
    bmi: '27.8',
    bsa: '0',
  });
  const [tabSelected, setTabSelected] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1Month');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [weightRecords, setWeightRecords] = useState([]);

  const API_URL = `${apiUrls.helthTrackRecordapi}?MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`;

  // Function to format date (e.g., "2025-08-20T12:21:25" to "20-Aug-2025")
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  };

  // Fetch API
  const fetchHealthData = async () => {
    try {
      if (!token) {
        console.error('No token available');
        return;
      }
      setLoading(true);
      const response = await axios.post(
        API_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status === true) {
        const records = response.data.response;
        setTabSelected(records);

        const getLatest = type => {
          const filtered = records.filter(
            item => item.VitalSignType?.trim().toLowerCase() === type.toLowerCase(),
          );
          return filtered.length > 0
            ? {
                value: filtered[filtered.length - 1].VitalSignValue,
                enteredOn: filtered[filtered.length - 1].EnteredOn,
              }
            : { value: '0', enteredOn: null };
        };

        const latestBSA = records?.BSA;
        const latestBMI = '27.8';

        setHealthData({
          temperature: getLatest('Temp').value,
          pulse: getLatest('Pulse').value,
          respiration: getLatest('Respiration').value || '0',
          bloodPressure: getLatest('Blood Pressure').value || '0',
          bloodSugar: getLatest('Blood Sugar').value || '0',
          spo2: getLatest('SpO2').value || '0',
          weight: getLatest('Weight').value || '0',
          height: getLatest('Height').value || '0',
          bmi: latestBMI,
          bsa: latestBSA ? latestBSA.BSA : '0',
          temperatureDate: getLatest('Temp').enteredOn,
          pulseDate: getLatest('Pulse').enteredOn,
          respirationDate: getLatest('Respiration').enteredOn,
          bloodPressureDate: getLatest('Blood Pressure').enteredOn,
          bloodSugarDate: getLatest('Blood Sugar').enteredOn,
          spo2Date: getLatest('SpO2').enteredOn,
          weightDate: getLatest('Weight').enteredOn,
          heightDate: getLatest('Height').enteredOn,
        });
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchHealthData();
  }, [token]);

  // Prepare chart and table data for weight (default chart on main page)
  useEffect(() => {
    if (tabSelected.length === 0) return;

    let ago = new Date();
    if (selectedPeriod === '1Week') {
      ago.setDate(ago.getDate() - 7);
    } else if (selectedPeriod === '1Month') {
      ago.setMonth(ago.getMonth() - 1);
    } else if (selectedPeriod === '3Months') {
      ago.setMonth(ago.getMonth() - 3);
    } else if (selectedPeriod === '6Months') {
      ago.setMonth(ago.getMonth() - 6);
    }

    const allWeightRecords = tabSelected
      .filter(item => item.VitalSignType?.trim().toLowerCase() === 'weight')
      .sort((a, b) => new Date(a.EnteredOn) - new Date(b.EnteredOn));

    const filteredWeightRecords = allWeightRecords.filter(
      item => new Date(item.EnteredOn) >= ago,
    );

    setWeightRecords(filteredWeightRecords);

    const labels = filteredWeightRecords.map(record => formatDate(record.EnteredOn));
    const data = filteredWeightRecords.map(record => parseFloat(record.VitalSignValue) || 0);

    setChartData({
      labels: labels.length > 0 ? labels : ['No data'],
      datasets: [
        {
          label: 'Weight',
          data: data.length > 0 ? data : [0],
          borderColor: 'rgba(30, 144, 255, 1)',
          backgroundColor: 'rgba(30, 144, 255, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointBorderColor: '#1E90FF',
          pointBackgroundColor: '#1E90FF',
        },
      ],
    });
  }, [tabSelected, selectedPeriod]);

  const getLatestVitalType = type => {
    const normalizedType = type.replace('%20', ' ');
    const filtered = tabSelected.filter(
      item => item.VitalSignType?.trim().toLowerCase() === normalizedType.toLowerCase(),
    );
    return filtered.length > 0 ? filtered[filtered.length - 1].VitalSignType : normalizedType;
  };

  // Get 1-month records for a specific vital sign type
  const getOneMonthRecords = type => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return tabSelected
      .filter(
        item =>
          item.VitalSignType?.trim().toLowerCase() === type.toLowerCase() &&
          new Date(item.EnteredOn) >= oneMonthAgo,
      )
      .sort((a, b) => new Date(a.EnteredOn) - new Date(b.EnteredOn));
  };

  const HealthMetricCard = ({ icon: Icon, title, value, unit, vitalSignType, enteredOn }) => {
    return (
      <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-md relative">
        <div className="bg-[#D1E8FF] w-8 h-8 flex items-center justify-center rounded-full">
          <Icon size={20} className="opacity-25" />
        </div>
        <h3 className="text-base font-bold text-gray-800 mt-2 text-center">{title}</h3>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
        <p className="text-sm text-gray-600">{unit}</p>
        <p className="text-sm text-blue-600 font-bold">{formatDate(enteredOn)}</p>
        <Link
          to={`/health-tracker/details/${title}`}
          className="absolute bottom-2 right-2"
          state={{
            metricName: title,
            metricValue: value,
            unit,
            vitalSignType,
            enteredOn: formatDate(enteredOn),
            records: getOneMonthRecords(vitalSignType.toLowerCase()), // Pass 1-month records
          }}
        >
          <ChevronsRight size={15} className="opacity-50" />
        </Link>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <IsLoader isFullScreen={false} text='' />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-2">My Health Tracker</h1>
      <p className="text-sm text-blue-600 font-bold mb-2 text-center">
        {new Date().toDateString()}
      </p>
      <p className="text-base text-gray-700 mb-5 font-semibold">
        An overview of your key health metrics.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <HealthMetricCard
          icon={Thermometer}
          title="Temperature"
          value={healthData.temperature}
          unit="°C"
          vitalSignType={getLatestVitalType('Temp')}
          enteredOn={healthData.temperatureDate}
        />
        <HealthMetricCard
          icon={Heart}
          title="Pulse"
          value={healthData.pulse}
          unit="bpm"
          vitalSignType={getLatestVitalType('Pulse')}
          enteredOn={healthData.pulseDate}
        />
        <HealthMetricCard
          icon={Wind}
          title="Respiration"
          value={healthData.respiration}
          unit="Rate/Min"
          vitalSignType={getLatestVitalType('Respiration')}
          enteredOn={healthData.respirationDate}
        />
        <HealthMetricCard
          icon={Droplet}
          title="Blood Pressure"
          value={healthData.bloodPressure}
          unit="mmHg"
          vitalSignType={getLatestVitalType('Blood Pressure')}
          enteredOn={healthData.bloodPressureDate}
        />
        <HealthMetricCard
          icon={Droplet}
          title="Blood Sugar"
          value={healthData.bloodSugar}
          unit="mmol/L"
          vitalSignType={getLatestVitalType('Blood Sugar')}
          enteredOn={healthData.bloodSugarDate}
        />
        <HealthMetricCard
          icon={HeartPulse}
          title="SpO2"
          value={healthData.spo2}
          unit="%"
          vitalSignType={getLatestVitalType('SpO2')}
          enteredOn={healthData.spo2Date}
        />
        <HealthMetricCard
          icon={Scale}
          title="Weight"
          value={healthData.weight}
          unit="kg"
          vitalSignType={getLatestVitalType('Weight')}
          enteredOn={healthData.weightDate}
        />
        <HealthMetricCard
          icon={Ruler}
          title="Height"
          value={healthData.height}
          unit="cm"
          vitalSignType={getLatestVitalType('Height')}
          enteredOn={healthData.heightDate}
        />
      </div>

      <div className="flex flex-col gap-4 my-8">
        <div className="w-full bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-bold text-blue-600">BMI (Body Mass Index)</h2>
          <p className="text-2xl font-bold text-blue-600">{healthData.bmi}</p>
          <p className="text-sm text-gray-600">kg/m²</p>
        </div>
        <div className="w-full bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-bold text-blue-600">BSA (Body Surface Area)</h2>
          <p className="text-2xl font-bold text-blue-600">{healthData.bsa}</p>
          <p className="text-sm text-gray-600">m²</p>
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerPage;