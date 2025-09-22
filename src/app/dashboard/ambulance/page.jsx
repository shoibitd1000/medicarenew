import React, { useState, useEffect } from "react";
import { Button } from '../../../components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../../components/components/ui/radio-group';
import { PhoneCall, MapPin, LocateFixed, Clock, User, LifeBuoy, Calendar } from 'lucide-react';
import CustomInput from "../../../components/components/ui/CustomInput";
import CustomSelect from "../../../components/components/ui/CustomSelect";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/components/ui/tabs";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomTimePicker from "../../../components/components/ui/CustomTimePicker";
import axios from 'axios';
import { AuthContext } from '../../authtication/Authticate';
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import Toaster, { notify } from "../../../lib/notify";
import IsLoader from "../../loading";

export default function AmbulancePage() {
    const { token, getCurrentPatientId } = React.useContext(AuthContext);
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [condition, setCondition] = useState('');
    const [schedule, setSchedule] = useState('immediate');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('request');
    const [ambulanceDetails, setAmbulanceDetails] = useState([]);
    const [ambulanceHistory, setAmbulanceHistory] = useState([]);
    const [ambulanceType, setAmbulanceType] = useState([]);
    const [emergencyNumber, setEmergencyNumber] = useState([]);
    const [typeModalVisible, setTypeModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const patientId = getCurrentPatientId();

    const fetchData = async (tab) => {
        setLoading(true);
        try {
            if (!token) {
                console.error('No token available');
                notify('Error', 'Authentication token is missing');
                return;
            }

            const requests = [];
            if (tab === 'request' || tab === 'all') {
                requests.push(
                    axios.get(`${apiUrls.ambulanceTypesapi}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get(`${apiUrls.centreWiseEmergencyNoapi}?CentreID=1`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                );
            }
            if (tab === 'charges' || tab === 'all') {
                requests.push(
                    axios.get(`${apiUrls.ambulanceDetailsapi}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                );
            }
            if (tab === 'history' || tab === 'all') {
                requests.push(
                    axios.get(`${apiUrls.ambulancePatientHisapi}?patientId=${patientId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                );
            }

            const responses = await Promise.all(requests);

            let responseIndex = 0;
            if (tab === 'request' || tab === 'all') {
                const typeRes = responses[responseIndex++];
                const emergencyRes = responses[responseIndex++];
                setAmbulanceType(typeRes?.data?.status === true ? typeRes?.data?.response || [] : []);
                setEmergencyNumber(emergencyRes?.data?.status === true ? emergencyRes?.data?.response || [] : []);
            }
            if (tab === 'charges' || tab === 'all') {
                const chargeRes = responses[responseIndex++];
                setAmbulanceDetails(chargeRes?.data?.status === true ? chargeRes?.data?.response || [] : []);
            }
            if (tab === 'history' || tab === 'all') {
                const historyRes = responses[responseIndex++];
                setAmbulanceHistory(historyRes?.data?.status === true ? historyRes?.data?.response || [] : []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                notify('Error', 'Session expired. Please log in again.');
                // window.location.href = '/enter-mpin'; // Adjust as needed
            }
            if (tab === 'charges' || tab === 'all') setAmbulanceDetails([]);
            if (tab === 'history' || tab === 'all') setAmbulanceHistory([]);
            if (tab === 'request' || tab === 'all') {
                setAmbulanceType([]);
                setEmergencyNumber([]);
            }
            notify('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab, token, patientId]);

    const saveAmbulanceRequest = async () => {
        setLoading(true);
        try {
            if (!token) {
                console.error('No token available');
                notify('Error', 'Authentication token is missing');
                return;
            }

            let requestPayload = {
                PickupLocation: location,
                AmbulanceType: type,
                PatientScheduleRequest: schedule,
                PatientContact: contact,
                PatientRequestCentreID: 1,
                CreatedPatientBy: patientId,
                MobileAppID: 'gRWyl7xEbEiVQ3u397J1KQ==',
                PatientDiscription: condition,
            };

            if (schedule === 'later' && selectedDate && selectedTime) {
                const scheduledDateTime = new Date(selectedDate);
                const [hours, minutes] = selectedTime.split(':');
                scheduledDateTime.setHours(hours, minutes);
                requestPayload.ScheduledDateTime = scheduledDateTime.toISOString();
            }

            const queryString = new URLSearchParams(requestPayload).toString();
            const response = await axios.post(
                `${apiUrls.patientAmmbulanceReqapi}?${queryString}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response?.data?.status === true) {
                notify('Success', 'Ambulance request saved successfully');
                setCondition('');
                setContact('');
                setLocation('');
                setType('');
                setSelectedDate(null);
                setSelectedTime(null);
                // window.location.href = '/live-tracking'; // Adjust as needed
            } else {
                notify('Error', 'Failed to save ambulance request');
            }
        } catch (error) {
            console.error('Error saving ambulance request:', error);
            if (error.response?.status === 401) {
                notify('Error', 'Session expired. Please log in again.');
                // window.location.href = '/enter-mpin'; // Adjust as needed
            }
            notify('Error', 'An error occurred while saving the request');
        } finally {
            setLoading(false);
        }
    };

    const handlepatientconditions = (val) => {
        setCondition(val);
    };

    const fetchLocation = async () => {
        setLoading(true);
        if (!navigator.geolocation) {
            notify('Geolocation is not supported by this browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'YourAppName/1.0 (your.email@example.com)', // Replace with your app name and contact email
                                Accept: 'application/json',
                            },
                        },
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        throw new Error('Response is not JSON');
                    }

                    const data = await response.json();

                    if (data?.display_name) {
                        setLocation(data.display_name);
                    } else {
                        setLocation(`${latitude}, ${longitude}`);
                    }
                } catch (err) {
                    console.error('Geocoding error:', err);
                    setLocation(`${latitude}, ${longitude}`);
                    notify('Error', 'Failed to fetch address, using coordinates instead');
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                notify('Unable to fetch location');
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    const makeEmergencyCall = () => {
        const number = emergencyNumber[0]?.LandlineNo;
        if (number) {
            window.location.href = `tel:${number}`;
        } else {
            notify('Error', 'Emergency number not available');
        }
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        if (!location || !contact || !condition || !type) {
            const missingFields = [
                !location && 'Pickup Location',
                !type && 'Ambulance Type',
                !contact && 'Contact Number',
                !condition && 'Patient’s Condition',
            ]
                .filter(Boolean)
                .join(', ');
            notify(`Please fill in the following required fields: ${missingFields}`);
            return;
        }
        if (schedule === 'later' && (!selectedDate || !selectedTime)) {
            notify('Please select both a date and time for the scheduled request.');
            return;
        }
        saveAmbulanceRequest();
    };

    const renderBookingHistory = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-[60vh]">
                    <IsLoader isFullScreen={false} size="6" />
                </div>
            );
        }

        if (ambulanceHistory.length === 0) {
            return <p className="text-center text-gray-500">No Booking History</p>;
        }

        return ambulanceHistory.map((item, index) => (
            <Card key={index} className="mb-4">
                <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold text-primary">{item.PatientDiscription}</span>
                        <span className="text-center">{item.RcNo}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{item.BookingDate}</span>
                        <span className="text-sm">{item.KmRun} KM</span>
                    </div>
                    <div className="text-sm font-semibold mt-2">{item.Status}</div>
                </CardContent>
            </Card>
        ));
    };

    const renderAmbulanceCharges = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-[60vh]">
                    <IsLoader isFullScreen={false} size="6" />
                </div>
            );
        }

        return (
            <div className="grid lg:grid-cols-2 gap-3 bg-white shadow-md rounded p-4">
                {ambulanceDetails?.map((item, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <h2 className="text-lg font-bold text-primary uppercase">{item?.VehicleName}</h2>
                            <p className="text-xs font-semibold">{item?.VehicleNo}/ {item?.ReadingType}</p>
                            <p className="text-xs text-gray-600">KES: {item?.RatePerKM}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Toaster />
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="request" className="w-full">
                <TabsList className="w-full">
                    <div className="flex w-full justify-between mt-4">
                        <TabsTrigger value="request">Request Ambulance</TabsTrigger>
                        <TabsTrigger value="history">Booking History</TabsTrigger>
                        <TabsTrigger value="charges">Ambulance Charges</TabsTrigger>
                    </div>
                </TabsList>

                <TabsContent value="request">
                    <div className="text-center">
                        <p className="text-sm text-green-600 font-extrabold">Request, track, and manage your emergency transport.</p>
                    </div>

                    <Card className="p-4 my-3 text-center bg-slate-200">
                        <div className="flex-grow">
                            <p className="font-bold text-sm">In case of a critical emergency, please call us directly at {emergencyNumber[0]?.LandlineNo || 'N/A'}</p>
                        </div>
                        <Button size="lg" onClick={makeEmergencyCall} className="w-full md:w-auto mt-3 md:mt-2">
                            <PhoneCall className="mr-2 h-5 w-5" /> Call Emergency Helpline
                        </Button>
                        <p className="text-xs text-destructive/80">Our team is available 24/7 to assist you immediately.</p>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>New Ambulance Request</CardTitle>
                            <CardDescription>Fill out the form below to request an ambulance. All fields are required.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRequestSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-base">Pickup Location</label>
                                    <div className="relative flex-grow">
                                        <CustomInput
                                            id="location"
                                            type="text"
                                            placeholder="Pickup Location"
                                            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                                            leftIcon={<MapPin className="h-5 w-5" />}
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={fetchLocation}
                                            disabled={loading}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-auto"
                                        >
                                            {loading ? 'Loading...' : <><LocateFixed className="mr-2 h-4 w-4" /> Use GPS</>}
                                        </Button>
                                    </div>
                                </div>

                                <CustomSelect
                                    placeholder="Select ambulance type"
                                    options={ambulanceType.map((t) => ({
                                        value: t.VehicleType,
                                        label: t.VehicleType,
                                    }))}
                                    value={
                                        ambulanceType
                                            .map((t) => ({
                                                value: t.VehicleType,
                                                label: t.VehicleType,
                                            }))
                                            .find((d) => d.value === type) || null
                                    }
                                    onChange={(selectedOption) => setType(selectedOption.value)}
                                />

                                <div className="space-y-2">
                                    <label htmlFor="condition" className="text-base">Patient's Condition (Briefly)</label>
                                    <CustomTextArea
                                        repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                        value={condition}
                                        handleChange={handlepatientconditions}
                                        placeHolderText="e.g., Chest pain, accident, difficulty breathing..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-base">Schedule Request</label>
                                    <RadioGroup value={schedule} onValueChange={setSchedule}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="immediate" id="immediate" />
                                            <label htmlFor="immediate">Request Immediately</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="later" id="later" />
                                            <label htmlFor="later">Schedule for Later</label>
                                        </div>
                                    </RadioGroup>
                                    {schedule === 'later' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 sm:pl-6 pt-2">
                                            <CustomDatePicker
                                                repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                                value={selectedDate}
                                                placeHolderText="Select Date"
                                                handleDate={(date) => setSelectedDate(date)}
                                                icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                                            />
                                            <CustomTimePicker
                                                repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                                                value={selectedTime}
                                                placeHolderText="Select Time"
                                                handleTime={(time) => setSelectedTime(time)}
                                            />
                                        </div>
                                    )}
                                </div>
                                <CustomInput
                                    id="contact"
                                    type="number"
                                    placeholder="Contact Number"
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                                    leftIcon={<PhoneCall className="h-5 w-5" />}
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                />

                                <div className="flex justify-center">
                                    <Button type="submit" size="lg" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Request'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    {renderBookingHistory()}
                </TabsContent>
                <TabsContent value="charges">
                    {renderAmbulanceCharges()}
                </TabsContent>
            </Tabs>
        </div>
    );
}