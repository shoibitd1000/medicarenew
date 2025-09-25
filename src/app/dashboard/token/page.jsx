import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../authtication/Authticate"; 
import { ChevronRight, SquarePlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import GenerateTokenPage from "./generate/page";

const TokenPage = () => {
  const [tab, setTab] = useState("current");
  const [availableToken, setAvailableToken] = useState([]);
  const { token, userData,getCurrentPatientId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === "current") {
      fetchToken();
    }
  }, [tab]);

  const fetchToken = async () => {
    const id = userData?.PatientASID;
    try {
      const response = await axios.get(
        `${apiUrls.patientTokenGenerate}?patientId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status === true) {
        setAvailableToken(response.data.response);
      } else {
        setAvailableToken([]);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      setAvailableToken([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 m-0">
        <button
          onClick={() => setTab("current")}
          className={`py-2 px-5 rounded-t-md border transition-all duration-600 ${
            tab === "current"
              ? "bg-blue-800 text-white font-semibold border-b-0 border-gray-300"
              : "bg-gray-100 text-gray-600 border-gray-300 border-b-0"
          }`}
        >
          Current Token
        </button>
        <button
          onClick={() => setTab("generateToken")}
          className={`py-2 px-5 rounded-t-md border transition-all duration-600 ${
            tab === "generateToken"
              ? "bg-blue-800 text-white font-semibold border-b-0 border-gray-300 "
              : "bg-gray-100 text-gray-600 border-gray-300 border-b-0 "
          }`}
        >
          Generate Token
        </button>
      </div>

      {tab === "current" ? (
        <div className="bg-white rounded-b-lg p-6 shadow text-center transition-all duration-600">
          <h2 className="text-2xl font-bold text-blue-600">
            {availableToken[0]?.TokenNo?.length > 0
              ? `Token No: ${availableToken[0]?.TokenNo}`
              : "No Active Token"}
          </h2>
          {availableToken.length === 0 && (
            <button
              onClick={() => setTab("generateToken")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate New Token
            </button>
          )}
        </div>
      ) : (
        <GenerateTokenPage />
      )}
    </div>
  );
};

export default TokenPage;