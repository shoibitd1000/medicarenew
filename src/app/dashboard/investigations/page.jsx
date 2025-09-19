import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SquarePlus, ChevronRight } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../authtication/Authticate"; // Adjust path as needed
import { apiUrls } from "../../../components/Network/ApiEndpoint"; // Adjust path to your API config
import IsLoader from "../../loading";

const Investigations = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState([]);
    const animations = useRef({}).current;

    useEffect(() => {
        fetchCenter();
    }, []);

    const fetchCenter = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                apiUrls.centerLab,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === true) {
                setCenter(response.data.response);
            } else {
                console.error("Unexpected response format:", response.data);
                setCenter([]);
            }
        } catch (error) {
            console.error("Error fetching centers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = () => {
        // Simulate vibration feedback for web (e.g., visual feedback)
        // const element = document.activeElement;
        // element.classList.add("animate-pulse");
        // setTimeout(() => element.classList.remove("animate-pulse"), 100);
    };

    return (
        <div className="space-y-8 p-6 min-h-screen bg-blue-50">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <IsLoader />
                </div>
            ) : (
                <>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-blue-600 mb-1">Book an Investigation</h2>
                        <p className="text-gray-500">Please select a hospital center to proceed</p>
                    </div>

                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {center.map((item, index) => {
                                // Initialize animation for each item
                                if (!animations[item.CentreID]) {
                                    animations[item.CentreID] = {
                                        initial: { x: "-100vw", opacity: 0 },
                                        animate: { x: 0, opacity: 1 },
                                        transition: { duration: 0.6, delay: index * 0.2 },
                                    };
                                }

                                return (
                                    <div
                                        key={item.CentreID}
                                        initial={animations[item.CentreID].initial}
                                        animate={animations[item.CentreID].animate}
                                        transition={animations[item.CentreID].transition}
                                    >
                                        <Link
                                            to={`/investigations/${item.CentreID}/${item.CentreName}`}
                                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <SquarePlus className="h-6 w-6 text-blue-500 bg-blue-100 rounded-sm p-1" />
                                                <span className="text-lg font-medium text-gray-800">{item.CentreName}</span>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </Link>
                                    </div>
                                );
                            })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Investigations;