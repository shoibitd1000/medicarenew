import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../authtication/Authticate"; // Adjust path as needed
import { ChevronRight, SquarePlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrls } from "../../../../components/Network/ApiEndpoint";

const GenerateTokenPage = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCenter();
  }, []);

  const fetchCenter = async () => {
    setLoading(true);
    try {
      const response = await axios.post(apiUrls.centerLab,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status === true) {
        setCenters(response.data.response);
      } else {
        setCenters([]);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
      setCenters([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-b-lg transition-all duration-600">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-1">
          Select The Center
        </h2>
        <p className="text-gray-500">
          Please select a hospital center to proceed
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="">
          {centers.map((center) => (
            <Link
              to={`/token/kiosks/${center.CentreID}`}
              key={center.CentreID}
              className="flex items-center my-3 justify-between p-4 bg-white shadow-sm hover:shadow-md transition rounded-md"
            >
              <div className="flex items-center gap-4">
                <SquarePlus className="h-6 w-6 text-blue-600 bg-gray-200 rounded-sm" />
                <span className="text-lg font-medium">{center.CentreName}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenerateTokenPage;