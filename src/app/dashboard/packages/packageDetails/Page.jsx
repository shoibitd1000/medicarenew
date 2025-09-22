import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { notify } from "../../../../lib/notify";
import { AuthContext } from "../../../authtication/Authticate";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";
import IsLoader from "../../../loading";
import { FlaskConical, UserRound, Package } from "lucide-react";

const PackageDetail = () => {
    const location = useLocation();
    const params = useParams();

    const packageID = params?.id;
    const packageType = location.state?.activeTab || "OPD";

    const { token, getAuthHeader,logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [packageData, setPackageData] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    const fetchPackageDetails = async () => {
        if (!packageType || !["OPD", "IPD"].includes(packageType)) {
            notify("Error", "Invalid package type.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const endpoint =
                packageType === "OPD"
                    ? apiUrls.opdPackageDetailapi
                    : apiUrls.ipdPackageDetailapi;

            const apiUrl = `${endpoint}?PackageID=${packageID}`;

            let response;
            debugger
            if (packageType === "OPD") {
                response = await axios.post(apiUrl, {}, { headers: { ...getAuthHeader() } });
            } else {
                response = await axios.get(apiUrl, { headers: { ...getAuthHeader() } });
            }

            if (response?.data?.status === true) {
                const items = response.data.response || [];

                const normalizedItems = items.map((item) => ({
                    ...item,
                    Item: item.Item || item.ItemName,
                    Rate: item.Rate || item.Amount,
                    LabType:
                        item.LabType || (item.CategoryName === "LABORATORY" ? "LAB" : undefined),
                }));

                setPackageData(normalizedItems);

                const total = normalizedItems.reduce(
                    (sum, item) => sum + (item.Rate || 0) * (item.Quantity || 1),
                    0
                );
                setTotalCost(total);
            }
            if (response?.data?.status === "401") {
                logout()
            }
            else {
                notify("Error", response?.data?.message || "Failed to load package details.");
            }
        } catch (error) {
            console.error("Error fetching package details:", error);
            notify("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        if (token) {
            fetchPackageDetails();
        } else {
            notify("Error", "User is not authenticated.");
            setLoading(false);
        }
    }, [token]);

    const groupItemsByCategory = () => {
        const labItems = packageData.filter(
            (item) => item.LabType === "LAB" || item.CategoryName === "LABORATORY"
        );
        const consultationItems = packageData.filter(
            (item) => item.TnxType === "5" || [148, 179, 180].includes(item.SubCategoryID)
        );
        const otherItems = packageData.filter(
            (item) =>
                !(item.LabType === "LAB" || item.CategoryName === "LABORATORY") &&
                item.TnxType !== "5" &&
                ![148, 179, 180].includes(item.SubCategoryID)
        );

        return { labItems, consultationItems, otherItems };
    };

    const { labItems, consultationItems, otherItems } = groupItemsByCategory();

    const handleBuyNow = () => {
        notify("Purchase Confirmation", "Are you sure you want to buy now?");
    };

    return (
        <div className='p-5'>
            <div className=" w-full m-auto md:w-1/2 my-3">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <IsLoader isFullScreen={false} size="6" text="package details..." />
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-[#D6ECFB] p-4 rounded-lg mb-6">
                            <div>
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase text-[#3287C2]">
                                        {packageType}
                                    </span>
                                    <h2 className="text-xl font-bold text-[#3287C2]">
                                        KES {totalCost.toLocaleString()}
                                    </h2>
                                </div>
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold text-[#3287C2]">Basic Health Checkup</h2>

                                    <span className="text-xs text-[#777]">Total Package Cost</span>
                                </div>
                                <p className="text-sm text-[#444] mt-2 ">
                                    A comprehensive package covering essential health parameters
                                    for a routine check.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-[#222] mb-4">Package Inclusions</h3>

                        {/* Lab */}
                        {labItems.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center mb-2">
                                    <FlaskConical size={20} color="#3287C2" />
                                    <h4 className="text-lg font-bold ml-2 text-[#000]">Lab</h4>
                                </div>
                                <ul className="list-disc pl-5">
                                    {labItems.map((item, index) => (
                                        <li key={index} className="text-sm text-[#444] mb-1">
                                            {item.Item} {item.Quantity > 1 ? `(x${item.Quantity})` : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Consultation */}
                        {consultationItems.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center mb-2">
                                    <UserRound size={20} color="#3287C2" />
                                    <h4 className="text-lg font-bold ml-2 text-[#000]">Consultation</h4>
                                </div>
                                <ul className="list-disc pl-5">
                                    {consultationItems.map((item, index) => (
                                        <li key={index} className="text-sm text-[#444] mb-1">
                                            {item.Item} {item.Quantity > 1 ? `(x${item.Quantity})` : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Other */}
                        {otherItems.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center mb-2">
                                    <Package size={20} color="#3287C2" />
                                    <h4 className="text-lg font-bold ml-2 text-[#000]">
                                        Supplies & Miscellaneous
                                    </h4>
                                </div>
                                <ul className="list-disc pl-5">
                                    {otherItems.map((item, index) => (
                                        <li key={index} className="text-sm text-[#444] mb-1">
                                            {item.Item} {item.Quantity > 1 ? `(x${item.Quantity})` : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-between items-center p-4 bg-white rounded-lg mb-6">
                            <div>
                                <span className="font-bold text-black">Total Price:</span>
                                <span className="font-bold text-[#2196F3] ml-2 text-lg">
                                    KES {totalCost.toLocaleString()}
                                </span>
                            </div>
                            <button
                                className="bg-[#2196F3] text-white font-bold py-2 px-4 rounded-lg"
                                onClick={handleBuyNow}
                            >
                                Buy Now
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PackageDetail;
