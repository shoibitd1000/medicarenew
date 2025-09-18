import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SquarePlus, ChevronRight, Loader } from "lucide-react";
import { AuthContext } from "../../../app/authtication/Authticate";
import Toaster, { notify } from "../../../lib/notify";
import { ToastContainer } from "react-toastify";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import axios from "axios";
import IsLoader from "../../../app/loading";

const recordTypes = [
    { name: "Kaboson" },
    { name: "Ngito" },
    { name: "Tenwek Annex" },
    { name: "Tenwek Hospital" },
];

export default function BookAppointment() {
    const { getAuthHeader } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);


    const getCenterlab = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                apiUrls.centerLab,
                null,
                {
                    headers: {
                        ...getAuthHeader(),
                    },
                }
            );

            if (res.data.status) {
                // Store the full array of centers
                console.log(res.data.response);
                setData(res.data.response || []);
            } else {
                notify(res.data.message, "error");
            }
        } catch (error) {
            notify(
                error?.response?.data?.message || "Something went wrong, please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getCenterlab();
    }, []);

    // if (loading) return <div><IsLoader /></div>;
    return (
        <div className="space-y-8 p-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-1">Book An Appointment</h2>
                <p className="text-gray-500">Please Select a hospital Center to Proceed</p>
            </div>
            <Toaster />
            <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {loading ? (
                    <div className="flex justify-center items-center col-span-full">
                        <IsLoader isFullScreen={false} size="6" text="Loading discharge Summary..." />
                    </div>
                ) : data?.length > 0 ? (
                    data.map((item, i) => (
                        <Link
                            to={`/doctor-appointment/${item?.CentreID}`}
                            key={i}
                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <SquarePlus className="h-6 w-6 text-primary bg-slate-300 rounded-sm" />
                                <span className="text-lg font-medium">{item?.CentreName}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>
                    ))
                ) : (
                    <p className="text-center py-8 text-gray-500">No Center Avilable.</p>
                )}

            </div>
        </div>
    );
}
