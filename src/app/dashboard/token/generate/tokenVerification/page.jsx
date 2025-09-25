import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../authtication/Authticate"; // Adjust path as needed
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../../components/Network/ApiEndpoint";
import { Button } from "../../../../../components/components/ui/button";
import CustomInput from "../../../../../components/components/ui/CustomInput";
import CustomTable from "../../../../../components/components/ui/customTabel";
import CustomSelect from "../../../../../components/components/ui/CustomSelect";
import { MoveLeft } from "lucide-react";

const TokenVerification = () => {
    const [uhidMobile, setUhidMobile] = useState("");
    const [patientDetails, setPatientDetails] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);
    const { centreId, kioskId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (kioskId) {
            fetchServiceCategories();
        }
    }, [kioskId]);

    const fetchServiceCategories = async () => {
        try {
            const response = await axios.get(
                `${apiUrls.kioskCategoryapi}?KID=${kioskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === true) {
                setServiceCategories(response.data.response);
            } else {
                setServiceCategories([]);
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error("Error fetching service categories:", error);
            setServiceCategories([]);
            setSelectedCategory(null);
        }
    };

    const fetchLevels = async (categoryId) => {
        try {
            const response = await axios.get(
                `${apiUrls.kioskLevelapi}?CategoryID=${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === true) {
                setLevels(response.data.response);
            } else {
                setLevels([]);
                setSelectedLevel(null);
            }
        } catch (error) {
            console.error("Error fetching levels:", error);
            setLevels([]);
            setSelectedLevel(null);
        }
    };

    const fetchServices = async (levelId) => {
        try {
            const response = await axios.get(
                `${apiUrls.kioskServicesapi}?LevelID=${levelId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === true) {
                setServices(response.data.response);
            } else {
                setServices([]);
                setSelectedService(null);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            setServices([]);
            setSelectedService(null);
        }
    };

    const handleVerify = async () => {
        if (!uhidMobile) {
            alert("Please enter UHID/Mobile No.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiUrls.kioskpatientDetailsapi}?PatientID=${uhidMobile}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === true) {
                const patientData = response.data.response || [];
                setPatientDetails(patientData);
                if (patientData.length === 1) {
                    setSelectedPatient(patientData[0]);
                } else {
                    setSelectedPatient(null);
                }
            } else {
                setPatientDetails([]);
                setSelectedPatient(null);
                alert("No patient details found.");
            }
        } catch (error) {
            console.error("Error fetching patient details:", error);
            setPatientDetails([]);
            setSelectedPatient(null);
            alert("Failed to fetch patient details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (
            !selectedPatient ||
            !selectedCategory ||
            !selectedLevel ||
            !selectedService
        ) {
            alert("Please complete all selections before saving.");
            return;
        }

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                centreId,
                kioskId,
                kioskName: "Kiosk-OPD", // Replace with dynamic kiosk name if available
                patientId: selectedPatient.PatientID,
                patientName: selectedPatient.PFirstName,
                mobileNo: selectedPatient.Mobile,
                serviceCategoryId: selectedCategory.SCID,
                serviceCategoryName: selectedCategory.Service_Category_Name,
                levelId: selectedLevel.LID,
                levelName: selectedLevel.Level_Name,
                serviceId: selectedService.SID,
                serviceName: selectedService.Service_Name,
            }).toString();

            const url = `${apiUrls.kioskSaveTokenGenerateapi}?${queryParams}`;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response?.data?.status === true) {
                alert("Token saved successfully.");
                navigate("/token");
            } else {
                alert(response?.data?.message || "Failed to save token.");
            }
        } catch (error) {
            console.error("Error saving token:", error);
            alert("Failed to save token. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const Thead = [
        { key: "PatientID", label: "Patient ID" },
        { key: "PFirstName", label: "Name" },
        { key: "Mobile", label: "Mobile" },
        ...(patientDetails.length > 1
            ? [
                {
                    key: "action",
                    label: "Action",
                    render: (row) => (
                        <Button
                            variant="outline"
                            onClick={() => setSelectedPatient(row)}
                            className="text-blue-600"
                        >
                            Select
                        </Button>
                    ),
                },
            ]
            : []),
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <Button
                variant="outline"
                onClick={() => navigate(`/token/kiosks/${centreId}`)}
                className="flex items-center"
            >
                <MoveLeft className="mr-2 h-4 w-4" /> Back to Kiosks
            </Button>

            <div className="bg-blue-300 p-4 shadow-sm rounded-md">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Center Name:</span>
                    <span className="font-medium text-white">Tenwek Hospital</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Kiosk Name:</span>
                    <span className="font-medium text-white">Kiosk-OPD</span>
                </div>
            </div>

            <div className="bg-white p-4 shadow-sm rounded-md">
                <label className="text-md text-blue-600 mb-2">Patient Lookup</label>
                <div className="relative flex-grow">
                    <CustomInput
                        id="uhidMobile"
                        type="text"
                        placeholder="UHID/Mobile No"
                        value={uhidMobile}
                        onChange={(e) => setUhidMobile(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                        required
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleVerify}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                </div>
            </div>

            {(patientDetails.length > 0 || selectedPatient) && (
                <div className="bg-white p-4 shadow-sm rounded-md">
                    <h3 className="text-md text-blue-600 mb-2">Patient Details</h3>
                    <CustomTable
                        Thead={Thead}
                        data={selectedPatient ? [selectedPatient] : patientDetails}
                        striped
                        bordered
                        hover
                        wrapperClass="rounded-md shadow"
                        tableClass="text-center"
                        headerClass="bg-gray-200"
                        rowClass="even:bg-gray-50"
                        cellClass="text-gray-700"
                    />
                </div>
            )}

            {selectedPatient && (
                <div className="bg-white p-4 shadow-sm rounded-md h-[280px] mb-5">
                    <h3 className="text-md text-blue-600 mb-2">Service Selection</h3>
                    <div className="mb-3">
                        <CustomSelect
                            placeholder="Select Service Category"
                            options={serviceCategories.map((category) => ({
                                value: category.SCID,
                                label: category.Service_Category_Name,
                            }))}
                            value={
                                selectedCategory
                                    ? {
                                        value: selectedCategory.SCID,
                                        label: selectedCategory.Service_Category_Name,
                                    }
                                    : null
                            }
                            onChange={(selectedOption) => {
                                const category = serviceCategories.find(
                                    (c) => c.SCID === selectedOption.value
                                );
                                setSelectedCategory(category);
                                setSelectedLevel(null);
                                setLevels([]);
                                setSelectedService(null);
                                setServices([]);
                                fetchLevels(category.SCID);
                            }}
                        />
                    </div>

                    {selectedCategory && (
                        <div className="mb-3">


                            <CustomSelect
                                placeholder="Select Level"
                                options={levels.map((level) => ({
                                    value: level.LID,
                                    label: level.Level_Name,
                                }))}
                                value={
                                    selectedLevel
                                        ? { value: selectedLevel.LID, label: selectedLevel.Level_Name }
                                        : null
                                }
                                onChange={(selectedOption) => {
                                    const level = levels.find((l) => l.LID === selectedOption.value);
                                    setSelectedLevel(level);
                                    setSelectedService(null);
                                    setServices([]);
                                    fetchServices(level.LID);
                                }}
                                className="mt-4"
                            />
                        </div>
                    )}
                    {selectedLevel && (
                        <div className="mb-3">
                            <CustomSelect
                                placeholder="Select Service"
                                options={services.map((service) => ({
                                    value: service.SID,
                                    label: service.Service_Name,
                                }))}
                                value={
                                    selectedService
                                        ? {
                                            value: selectedService.SID,
                                            label: selectedService.Service_Name,
                                        }
                                        : null
                                }
                                onChange={(selectedOption) => {
                                    const service = services.find(
                                        (s) => s.SID === selectedOption.value
                                    );
                                    setSelectedService(service);
                                }}
                                className="mt-4"
                            />
                        </div>
                    )}
                    {selectedService && (
                        <div className="text-end">
                            <Button
                                onClick={handleSave}
                                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TokenVerification;