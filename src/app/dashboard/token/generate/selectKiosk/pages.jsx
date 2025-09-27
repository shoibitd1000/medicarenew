import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../authtication/Authticate"; // Adjust path as needed
import { ChevronRight, MoveLeft, LaptopMinimal } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../../../components/Network/ApiEndpoint";
import { Button } from "../../../../../components/components/ui/button";
import Toaster, { notify } from "../../../../../lib/notify";

const KioskSelectionPage = () => {
  const [kiosks, setKiosks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { centreId } = useParams();

  useEffect(() => {
    fetchKiosks(centreId);
  }, [centreId]);

  const fetchKiosks = async (centreID) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrls.kioskMachineapi}?CentreID=${centreID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status === true) {
        setKiosks(response.data.response);
      } else {
        setKiosks([]);
      }
    } catch (error) {
      console.error("Error fetching kiosks:", error);
      setKiosks([]);
      notify("Failed to fetch kiosks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="outline"
        onClick={() => navigate("/token")}
        className="flex items-center my-3"
      >
        <MoveLeft className="mr-2 h-4 w-4" /> Back to Centers
      </Button>
      <Toaster />
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : kiosks.length > 0 ? (
        <>
          <div className="flex justify-center">
            <div>
              <h3 className="text-lg font-bold text-blue-600 text-center">
                Select a Kiosk
              </h3>
              <p className="text-xs mb-3 font-semibold text-center">
                Please select a Kiosk to Proceed
              </p>
            </div>
          </div>
          <div className="">
            {kiosks.map((kiosk) => (
              <Link
                to={`/token/verification/${centreId}/${kiosk.KID}`}
                key={kiosk.KID}
                className="flex items-center justify-between bg-white p-4 shadow-sm hover:shadow-md transition rounded-md"
              >
                <div className="flex items-center gap-4">
                  <LaptopMinimal className="h-6 w-6 text-blue-600 bg-gray-200 rounded-sm" />
                  <span className="text-lg font-medium">{kiosk.Kiosk_Name}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div>
            <h1 className="text-xl font-bold text-blue-600 text-center">
              No Kiosks Available
            </h1>
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/token")}
              >
                <MoveLeft className="mr-2 h-4 w-4" /> Back to Centers
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskSelectionPage;