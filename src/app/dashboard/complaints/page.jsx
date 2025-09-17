import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Calendar, Star } from "lucide-react";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import { AuthContext } from "../../authtication/Authticate"; // Adjust path as needed
import Toaster, { notify } from "../../../lib/notify";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import { useNavigate } from "react-router-dom";



const FeedbackSection = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apisubject, setApiSubject] = useState("");
  const { token, userData, getCurrentPatientId } = useContext(AuthContext);
  const patientId = getCurrentPatientId();
  const navigate = useNavigate();

  // // Environment variable for API base URL
  // const envUrl = process.env.REACT_APP_API_URL || "http://197.138.207.30/MobileApp_API/API";

  // // API Endpoints
  // const patientFeedbackapi = `${envUrl}/LoginAPIDynamic/ReactGetPatientFeedback`;
  // const patientFeedbackSubjectapi = `${envUrl}/LoginAPIDynamic/ReactGetPatientFeedbackSubject`;
  // const patientFeedbackSaveapi = `${envUrl}/LoginAPIDynamic/ReactSavePatientFeedback`;

  const getStarColor = (ratingValue, index) => {
    if (ratingValue > index) {
      switch (index + 1) {
        case 1:
          return "text-red-500"; // Red for Very Poor
        case 2:
          return "text-orange-500"; // Orange for Poor
        case 3:
          return "text-yellow-400"; // Yellow for Average
        case 4:
          return "text-green-400"; // Light Green for Good
        case 5:
          return "text-green-500"; // Green for Excellent
        default:
          return "text-gray-300";
      }
    }
    return "text-gray-300";
  };

  // Get rating label for history display
  const getRatingLabel = (ratingValue) => {
    switch (Number(ratingValue)) {
      case 1:
        return "Very Poor";
      case 2:
        return "Poor";
      case 3:
        return "Average";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  // Render stars for feedback history
  const renderStars = (ratingValue) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`inline-block ${getStarColor(Number(ratingValue), index)}`}
      />
    ));
  };

  // Fetch feedback history
  useEffect(() => {
    const fetchFeedbackHistory = async () => {
      try {
        if (!token) {
          console.error("No token available");
          notify("Authentication token is missing");
          return;
        }
        if (!patientId) {
          notify("Patient ID is missing");
          return;
        }

        const url = `${apiUrls.patientFeedbackapi}?PatientID=${encodeURIComponent(patientId)}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response?.data?.status) {
          setFeedbackHistory(response.data.response);
        } else {
          console.error("Unexpected feedback response:", response.data);
          notify("Failed to fetch feedback history");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        if (error.response?.status === 401) {
          notify("Session expired. Please log in again.", "error");
          navigate("/enter-mpin");
        } else {
          notify("Error fetching feedback history", "error");
        }
      }
    };

    fetchFeedbackHistory();
  }, [token, patientId, navigate]);

  // Fetch subject (Date of Visit)
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (!token) {
          console.error("No token available");
          notify("Authentication token is missing");
          return;
        }
        if (!patientId) {
          notify("Patient ID is missing");
          return;
        }

        const url = `${apiUrls.patientFeedbackSubjectapi}?PatientId=${encodeURIComponent(patientId)}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response?.data?.status) {
          const dateOfVisit = response.data.response[0]?.DateOfVisit || "";
          setApiSubject(dateOfVisit);
          setSubject(dateOfVisit);
        } else {
          console.error("Unexpected subject response:", response.data);
          notify("Failed to fetch feedback subject");
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
        if (error.response?.status === 401) {
          notify("Session expired. Please log in again.", "error");
          navigate("/enter-mpin");
        } else {
          notify("Error fetching feedback subject", "error");
        }
      }
    };

    fetchSubject();
  }, [token, patientId, navigate]);

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      notify("Please provide a rating");
      return;
    }

    setLoading(true);
    try {
      if (!token) {
        console.error("No token available");
        notify("Authentication token is missing");
        setLoading(false);
        return;
      }
      if (!patientId) {
        notify("Patient ID is missing");
        setLoading(false);
        return;
      }

      const remarks = description.trim() || apisubject;
      const url = `${apiUrls.patientFeedbackSaveapi}?PatientID=${encodeURIComponent(
        patientId
      )}&PatientRating=${rating}&Remarks=${encodeURIComponent(
        remarks
      )}&Subject=${encodeURIComponent(apisubject)}`;

      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.status) {
        notify(response?.data?.message || "Feedback submitted successfully", "success");
        setSubject(apisubject);
        setDescription("");
        setRating(0);

        // Refresh feedback history
        const fetchUrl = `${apiUrls.patientFeedbackapi}?PatientID=${encodeURIComponent(patientId)}`;
        const fetchResponse = await axios.get(fetchUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (fetchResponse?.data?.status) {
          setFeedbackHistory(fetchResponse.data.response);
        } else {
          notify("Failed to refresh feedback history");
        }
      } else {
        console.error("Unexpected feedback response:", response.data);
        notify("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.", "error");
        navigate("/enter-mpin");
      } else {
        notify("Error submitting feedback", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-4">
        <div className="header mb-4">
          <h1 className="text-xl font-semibold">
            We value your opinion. Please let us know how we're doing.
          </h1>
        </div>

        <div className="feedback-form bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="font-medium text-lg">Submit New Feedback</h2>
          <p className="text-sm text-gray-500 mb-4">
            Use this form to submit a new complaint or share your feedback.
          </p>

          <div className="mb-4">
            <CustomDatePicker
              repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
              selected={subject ? new Date(subject) : null}
              placeHolderText="From Date"
              handleDate={(date) => setSubject(date.toLocaleDateString("en-GB"))}
              icon={<Calendar className="absolute right-3 text-gray-500 pointer-events-none" />}
            />
          </div>

          <div className="mb-4">
            <CustomTextArea
              repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
              value={description}
              placeHolderText="Provide more details here..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="font-medium text-sm">Overall Rating</label>
            <div className="rating flex space-x-1 mt-2">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  onClick={() => setRating(index + 1)}
                  size={20}
                  className={`cursor-pointer ${getStarColor(rating, index)}`}
                />
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmitFeedback}
              disabled={loading}
              className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
                }`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>

        <div className="feedback-history mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-medium text-lg">Feedback History</h2>
          {feedbackHistory.length > 0 ? (
            feedbackHistory.map((feedback, index) => (
              <div key={index} className="feedback-item mt-4">
                <div className="text-sm text-gray-700">
                  <strong>{feedback.Subjects}</strong> - {feedback.PatientRating}/5 -{" "}
                  {getRatingLabel(feedback.PatientRating)}
                </div>
                <div className="flex space-x-1 mt-1">{renderStars(feedback.PatientRating)}</div>
                {feedback.Remark && (
                  <div className="text-xs text-gray-500 mt-1">{feedback.Remark}</div>
                )}
                <div className="text-xs text-gray-500">
                  Submitted on: {feedback.EnquiryDate}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 mt-4">No feedback history found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedbackSection;